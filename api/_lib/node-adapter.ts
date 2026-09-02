import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * Node의 요청·응답을 Web 표준으로 오가는 다리.
 *
 * 핸들러는 Web `Request`/`Response`로 쓰는 게 읽기 좋은데, 이걸 실제로 실행하는 두 곳
 * (Vercel의 Node 런타임과 개발 서버의 Vite 미들웨어)은 모두 Node의 `IncomingMessage`·
 * `ServerResponse`를 준다. 그 변환을 한 곳에 모아 양쪽이 같은 코드를 쓰게 한다.
 */
export function toWebRequest(req: IncomingMessage): Request {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === "string") headers.set(key, value);
        else if (Array.isArray(value)) for (const item of value) headers.append(key, item);
    }

    const method = req.method ?? "GET";
    if (method === "GET" || method === "HEAD") {
        return new Request(url, { method, headers });
    }

    // Vercel의 Node 런타임은 요청 본문을 미리 읽어 `req.body`에 파싱해 둔다. 그 뒤에 스트림을
    // 다시 읽으려 하면 아무것도 오지 않고 `done`도 나지 않아 함수가 통째로 매달린다
    // (배포본에서만 FUNCTION_INVOCATION_TIMEOUT이 났던 원인). 이미 읽힌 본문이 있으면 그걸 쓴다.
    const parsed = (req as IncomingMessage & { body?: unknown }).body;
    if (parsed !== undefined && parsed !== null) {
        const body = typeof parsed === "string" ? parsed : JSON.stringify(parsed);
        return new Request(url, { method, headers, body });
    }

    return new Request(url, {
        method,
        headers,
        body: Readable.toWeb(req) as ReadableStream<Uint8Array>,
        // 요청 본문을 스트림으로 넘길 때 필요하지만 lib.dom 타입에는 없다.
        duplex: "half",
    } as RequestInit & { duplex: "half" });
}

export async function sendWebResponse(res: ServerResponse, response: Response): Promise<void> {
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
        res.setHeader(key, value);
    });

    if (!response.body) {
        res.end();
        return;
    }
    // 토큰이 도착하는 대로 흘려보낸다 — 모아서 보내면 스트리밍이 죽는다.
    await pipeline(Readable.fromWeb(response.body as Parameters<typeof Readable.fromWeb>[0]), res);
}
