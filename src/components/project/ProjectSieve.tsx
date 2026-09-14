import { useMemo, useState } from "react";

import { BODY, BODY_TIGHT, LABEL_MUTED } from "@/lib/typography";

import type { ProjectSieve as Sieve } from "@/types/content";

interface ProjectSieveProps {
    sieve: Sieve;
}

type Verdict = "added" | "duplicate" | "invalid";

/** 번호 한 덩어리가 체를 지난 기록. */
interface Chunk {
    /** 공백으로 잘린 조각들 — 10자리가 찰 때까지 이어 붙인 것 */
    pieces: string[];
    digits: string;
    normalized: string;
    /** 정규화에서 손댄 것. 손대지 않았으면 null */
    rule: string | null;
    verdict: Verdict;
    /** 목록에 올라가는 모양(국가번호가 붙은 것). 오류면 없다. */
    final?: string;
}

const VERDICT_LABEL: Record<Verdict, string> = {
    added: "등록",
    duplicate: "중복",
    invalid: "오류",
};

const MOBILE = /^01[016789]\d{7,8}$/;

/** 입력창이 받는 최대 글자 수 — 이 그림은 판정 규칙을 보여 주는 자리지 5만 건을 돌리는 자리가 아니다. */
const MAX_INPUT = 1200;

/**
 * 원 저장소 `useTransactionForm`의 `parsePhones` + `handleFormatTargets`를 **판정 순서 그대로**
 * 옮기고, 덩어리마다 무엇을 했는지 기록만 덧붙였다. 규칙을 여기서 고치면 그림이 원 코드와
 * 다른 말을 한다.
 *
 * - 공백으로만 자른다. 조각의 숫자가 10자리에 닿을 때까지 다음 조각을 이어 붙인다 —
 *   `+82 10 1234 5678`이 네 조각으로 잘려 들어오기 때문이다.
 * - `82`로 시작하는 12자리는 `0`으로, `10`으로 시작하는 10자리는 앞에 `0`을 붙인다.
 * - 휴대폰 패턴을 통과하면 앞자리 `0`을 국가번호로 바꿔 등록하고, 이미 있으면 중복이다.
 */
function sift(input: string, country: string): Chunk[] {
    const tokens = input.split(/\s+/).filter(Boolean);
    const chunks: Chunk[] = [];
    const seen = new Set<string>();
    let buffer: string[] = [];

    const flush = () => {
        const pieces = buffer;
        buffer = [];
        const digits = pieces.join("").replace(/\D/g, "");
        if (!digits) {
            return;
        }

        let normalized = digits;
        let rule: string | null = null;
        if (normalized.startsWith("82") && normalized.length === 12) {
            normalized = `0${normalized.slice(2)}`;
            rule = "82 → 0";
        }
        if (normalized.length === 10 && normalized.startsWith("10")) {
            normalized = `0${normalized}`;
            rule = "앞에 0";
        }

        if (!MOBILE.test(normalized)) {
            chunks.push({ pieces, digits, normalized, rule, verdict: "invalid" });
            return;
        }

        const final = country + normalized.slice(1);
        const verdict = seen.has(final) ? "duplicate" : "added";
        seen.add(final);
        chunks.push({ pieces, digits, normalized, rule, verdict, final });
    };

    for (const token of tokens) {
        buffer.push(token);
        if (buffer.join("").replace(/\D/g, "").length >= 10) {
            flush();
        }
    }
    if (buffer.length > 0) {
        flush();
    }

    return chunks;
}

/**
 * 붙여넣은 번호가 등록 · 중복 · 오류로 갈리는 체.
 *
 * SafeOps의 관문이 **한 건이 어디서 멈추는지**를 따라간다면, 이쪽은 **한 번에 붙여넣은
 * 덩어리가 어떻게 쪼개지고 모이는지**를 본다. 입력창은 실제로 고칠 수 있다 — 준비된 예시를
 * 고른 뒤 번호를 지우거나 띄어 써 보면 판정이 그 자리에서 다시 선다.
 */
export function ProjectSieve({ sieve }: ProjectSieveProps) {
    const { samples, country } = sieve;
    const [text, setText] = useState(samples[0]?.input ?? "");

    const chunks = useMemo(() => sift(text, country), [text, country]);
    const counts = useMemo(() => {
        const result: Record<Verdict, number> = { added: 0, duplicate: 0, invalid: 0 };
        for (const chunk of chunks) {
            result[chunk.verdict] += 1;
        }
        return result;
    }, [chunks]);

    const active = samples.findIndex((sample) => sample.input === text);
    const hint = active >= 0 ? samples[active]?.hint : "직접 고친 입력입니다.";

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                {samples.map((sample, index) => {
                    const on = index === active;
                    return (
                        <button
                            key={sample.label}
                            type="button"
                            onClick={() => setText(sample.input)}
                            aria-pressed={on}
                            className={`rounded-full border px-4 py-2 text-[0.8125rem] transition-colors duration-300 ${
                                on
                                    ? "border-espresso bg-espresso text-paper"
                                    : "border-line text-muted hover:border-espresso hover:text-ink"
                            }`}
                        >
                            {sample.label}
                        </button>
                    );
                })}
            </div>

            <p className={`mt-6 max-w-[38rem] ${BODY}`}>{hint}</p>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-14">
                <label className="block">
                    <span className={LABEL_MUTED}>붙여넣은 그대로</span>
                    <textarea
                        value={text}
                        onChange={(event) => setText(event.target.value.slice(0, MAX_INPUT))}
                        rows={9}
                        spellCheck={false}
                        /* 입력창 안의 휠은 입력창이 받는다 — 관성 스크롤이 가로채면 긴 입력을
                           내려 볼 수 없다. */
                        data-lenis-prevent
                        className="mt-3 block w-full resize-y rounded-xl border border-ink/25 bg-paper/90 px-4 py-3 font-mono text-sm leading-[1.9] text-ink outline-none focus:border-espresso"
                    />
                </label>

                <div>
                    <dl className="flex flex-wrap gap-x-10 gap-y-4">
                        {(Object.keys(VERDICT_LABEL) as Verdict[]).map((verdict) => (
                            <div key={verdict}>
                                <dt className={LABEL_MUTED}>{VERDICT_LABEL[verdict]}</dt>
                                <dd
                                    className={`mt-1 font-mono text-2xl tabular-nums ${
                                        verdict === "added" ? "text-espresso" : "text-ink"
                                    }`}
                                >
                                    {counts[verdict]}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    {chunks.length === 0 ? (
                        <p className={`mt-8 ${BODY_TIGHT}`}>
                            숫자가 하나도 없어 거를 것이 없습니다.
                        </p>
                    ) : (
                        <ol className="mt-8 flex flex-col">
                            {chunks.map((chunk, index) => (
                                <li
                                    // biome-ignore lint/suspicious/noArrayIndexKey: 같은 번호가 되풀이되는 것이 이 그림의 요점이라 순번이 유일한 키다
                                    key={index}
                                    className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-5 gap-y-1 border-t border-line py-3.5 first:border-t-0"
                                >
                                    <p className="min-w-0 font-mono text-sm leading-[1.7] break-all text-ink/80">
                                        {chunk.pieces.map((piece, at) => (
                                            <span
                                                // biome-ignore lint/suspicious/noArrayIndexKey: 조각은 순서가 곧 정체다
                                                key={at}
                                                className={
                                                    chunk.pieces.length > 1
                                                        ? "mr-1.5 rounded border border-line px-1.5"
                                                        : ""
                                                }
                                            >
                                                {piece}
                                            </span>
                                        ))}
                                    </p>
                                    <span
                                        className={`justify-self-end rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] tracking-[0.14em] ${
                                            chunk.verdict === "added"
                                                ? "border-espresso bg-espresso text-paper"
                                                : chunk.verdict === "invalid"
                                                  ? "border-espresso text-espresso"
                                                  : "border-ink/30 text-ink/80"
                                        }`}
                                    >
                                        {VERDICT_LABEL[chunk.verdict]}
                                    </span>
                                    <p className="col-span-2 font-mono text-xs leading-[1.7] text-muted">
                                        {chunk.pieces.length > 1
                                            ? `조각 ${chunk.pieces.length}개를 이어 붙임 · `
                                            : ""}
                                        {chunk.rule
                                            ? `${chunk.digits} (${chunk.rule}) ${chunk.normalized}`
                                            : chunk.digits}
                                        {chunk.final
                                            ? ` → ${chunk.final}`
                                            : ` → 휴대폰 번호 패턴이 아님 (${chunk.normalized.length}자리)`}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </div>
    );
}
