import { google } from "@ai-sdk/google";
import { frontendTools } from "@assistant-ui/react-ai-sdk";
import {
    convertToModelMessages,
    createUIMessageStreamResponse,
    stepCountIs,
    streamText,
    toUIMessageStream,
} from "ai";
import { z } from "zod";

import { buildSystemPrompt, getProjectDetail, projectSlugs } from "./prompt.js";

import type { ToolSet, UIMessage } from "ai";

/**
 * 공개 사이트에 붙는 엔드포인트라 남용 방어가 기본으로 들어간다.
 * 인프라를 늘리지 않는 선에서 막을 수 있는 것들 — 본문 크기, 대화 길이, 출력 길이, 툴 반복.
 */
const MAX_BODY_BYTES = 32_000;
const MAX_MESSAGES = 24;
const MAX_USER_CHARS = 1_000;
const MAX_OUTPUT_TOKENS = 900;
const MAX_STEPS = 5;
/** 브라우저에서 도는 툴은 매번 새 요청이라 서버 스텝 제한이 닿지 않는다. 왕복도 막는다. */
const MAX_TOOL_TURNS = 3;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;
/** 기억해 둘 최대 주소 수. 넘으면 가장 오래된 것부터 버린다(맵이 무한히 자라지 않도록). */
const RATE_KEYS = 500;

/**
 * 무료 티어의 일일 한도는 모델마다 크게 다르다 — **Flash 계열은 하루 20건**이라 공개 사이트에는
 * 금방 마르고, **Lite 계열은 그보다 훨씬 넉넉하다**. 안내자가 하는 일(짧은 답 + 도구 호출)에는
 * Lite로 충분해서 기본값을 그쪽에 뒀다.
 * 한도가 차거나 결제를 붙여 더 좋은 모델을 쓰고 싶으면 GEMINI_MODEL만 바꾼다.
 */
const MODEL_ID = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";

/**
 * 한 주소가 1분에 몇 번까지 물어볼 수 있는지.
 *
 * 서버리스는 인스턴스가 여러 개라 이 카운터는 인스턴스마다 따로 세어진다 — 완벽한 방벽이
 * 아니라, 인프라를 늘리지 않고 세울 수 있는 첫 문턱이다. 한 사람이 창을 열어 두고 묻는
 * 속도로는 절대 닿지 않고, 스크립트로 두드리는 쪽만 걸린다.
 * 분당 요청까지 정확히 묶으려면 공유 저장소(Vercel KV 등)가 필요하다.
 */
declare global {
    var __chatRateHits: Map<string, number[]> | undefined;
}

// 개발 서버는 모듈을 다시 평가할 수 있고(HMR), 서버리스도 인스턴스를 갈아끼운다.
// 살아 있는 프로세스 안에서만이라도 카운터가 이어지도록 전역에 붙여 둔다.
if (!globalThis.__chatRateHits) globalThis.__chatRateHits = new Map();
const recentHits = globalThis.__chatRateHits;

function isRateLimited(key: string): boolean {
    const now = Date.now();
    const hits = (recentHits.get(key) ?? []).filter((at) => now - at < RATE_WINDOW_MS);
    hits.push(now);

    recentHits.set(key, hits);
    if (recentHits.size > RATE_KEYS) {
        // Map은 삽입 순서를 지키므로 가장 오래 전에 들어온 주소가 먼저 나온다.
        const oldest = recentHits.keys().next().value;
        if (oldest !== undefined) recentHits.delete(oldest);
    }

    return hits.length > RATE_LIMIT;
}

/** Vercel은 원 주소를 x-forwarded-for 맨 앞에 넣는다. 개발 서버에는 없을 수 있다. */
function clientKey(req: Request): string {
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    return forwarded || req.headers.get("x-real-ip") || "unknown";
}

function json(body: unknown, status: number): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json; charset=utf-8" },
    });
}

/**
 * 본문을 상한까지만 읽는다. 다 읽고 나서 재는 것과는 다르다 — 넘치는 요청은
 * 끝까지 받아 문자열로 만들기 전에 스트림을 끊는다. `content-length`가 붙어 있으면
 * 한 바이트도 읽지 않고 거절하므로, 호스팅이 본문을 미리 파싱해 넘기는 환경에서도
 * (Vercel의 Node 런타임이 그렇다) 크기 방어는 그대로 선다.
 */
async function readCapped(req: Request, limit: number): Promise<string | null> {
    const declared = Number(req.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > limit) return null;

    const reader = req.body?.getReader();
    if (!reader) return "";

    const decoder = new TextDecoder();
    let text = "";
    let bytes = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        bytes += value.byteLength;
        if (bytes > limit) {
            await reader.cancel();
            return null;
        }
        text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
}

/**
 * 이 엔드포인트가 받는 건 방문자의 질문과, 브라우저에서 실행한 도구의 결과뿐이다.
 *
 * `convertToModelMessages`는 `role: "system"`을 그대로 시스템 메시지로 넘기므로, 걸러내지 않으면
 * 누구든 POST 한 번으로 안내자의 역할을 갈아치우고 이 API 키를 범용 모델 프록시로 쓸 수 있다.
 */
function isVisitorMessage(message: unknown): message is UIMessage {
    if (typeof message !== "object" || message === null) return false;

    const { role, parts } = message as { role?: unknown; parts?: unknown };
    return (role === "user" || role === "assistant") && Array.isArray(parts);
}

/** UI 메시지에서 사람이 친 글자만 뽑는다(길이 제한 검사용). */
function textLength(message: UIMessage): number {
    return message.parts.reduce(
        (sum, part) => sum + (part.type === "text" ? part.text.length : 0),
        0,
    );
}

/**
 * 말은 없이 도구만 부른 어시스턴트 턴이 몇 번 연속됐는지 센다.
 * `stopWhen`은 한 요청 안의 스텝만 세므로, 클라이언트 툴로 오가는 왕복은 여기서 끊는다.
 */
function consecutiveToolTurns(messages: UIMessage[]): number {
    let count = 0;
    for (let i = messages.length - 1; i >= 0; i -= 1) {
        const message = messages[i];
        if (!message || message.role === "user") break;
        if (message.role !== "assistant") continue;

        const calledTool = message.parts.some((part) => part.type.startsWith("tool-"));
        const spoke = message.parts.some(
            (part) => part.type === "text" && part.text.trim().length > 0,
        );
        if (!calledTool || spoke) break;
        count += 1;
    }
    return count;
}

const serverTools = {
    get_project_detail: {
        description:
            "프로젝트 상세 자료(문제 → 판단 → 결과 사례, 화면 해부, 런타임 구조, 좌표 파이프라인)를 꺼낸다. " +
            "구현을 깊이 묻는 질문에 답하기 전에 먼저 호출한다.",
        inputSchema: z.object({
            slug: z.enum(projectSlugs as [string, ...string[]]).describe("프로젝트 slug"),
        }),
        execute: async ({ slug }: { slug: string }) => {
            const detail = getProjectDetail(slug);
            if (!detail) return { error: `${slug}에 해당하는 프로젝트가 없습니다.` };
            return detail;
        },
    },
} satisfies ToolSet;

export async function handleChat(req: Request): Promise<Response> {
    if (req.method !== "POST") {
        return json({ error: "POST만 받습니다." }, 405);
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return json(
            {
                error: "서버에 GOOGLE_GENERATIVE_AI_API_KEY가 없습니다. .env.local을 확인해 주세요.",
            },
            503,
        );
    }

    if (isRateLimited(clientKey(req))) {
        return json({ error: "잠시 뒤에 다시 물어봐 주세요." }, 429);
    }

    const raw = await readCapped(req, MAX_BODY_BYTES);
    if (raw === null) {
        return json({ error: "요청이 너무 큽니다." }, 413);
    }

    let body: { messages?: unknown; tools?: Record<string, unknown> };
    try {
        body = JSON.parse(raw);
    } catch {
        return json({ error: "본문을 읽을 수 없습니다." }, 400);
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
        return json({ error: "메시지가 없습니다." }, 400);
    }
    if (!messages.every(isVisitorMessage)) {
        return json({ error: "메시지 형식이 올바르지 않습니다." }, 400);
    }
    if (messages.length > MAX_MESSAGES) {
        return json(
            { error: "대화가 길어졌습니다. 위의 ‘새 대화’를 눌러 다시 시작해 주세요." },
            400,
        );
    }

    const last = messages[messages.length - 1];
    if (last?.role === "user" && textLength(last) > MAX_USER_CHARS) {
        return json({ error: "질문이 너무 깁니다. 조금 줄여서 다시 물어봐 주세요." }, 400);
    }

    // 클라이언트 툴(UI 조작·카드 렌더)은 AssistantChatTransport가 스키마만 실어 보낸다.
    // 여기서는 모델에 알리기만 하고, 실행은 브라우저가 한다.
    const tools: ToolSet = {
        ...frontendTools((body.tools ?? {}) as Parameters<typeof frontendTools>[0]),
        ...serverTools,
    };

    const result = streamText({
        model: google(MODEL_ID),
        system: buildSystemPrompt(),
        messages: await convertToModelMessages(messages),
        tools,
        stopWhen: stepCountIs(MAX_STEPS),
        // 도구만 계속 부르며 도는 대화는 말로 끝내게 만든다.
        toolChoice: consecutiveToolTurns(messages) >= MAX_TOOL_TURNS ? "none" : undefined,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        temperature: 0.4,
        // 한도가 찼을 때 재시도로 시간만 끄는 걸 막는다.
        maxRetries: 1,
    });

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream, tools }),
    });
}
