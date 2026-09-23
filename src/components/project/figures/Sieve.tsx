import { useMemo, useState } from "react";

import { Choice, Figure } from "@/components/project/Figure";

import { MEASURE, SMALL } from "@/lib/typography";

import type { ProjectSieve } from "@/types/content";

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

const VERDICT_CHIP: Record<Verdict, string> = {
    added: "border-ink bg-ink text-paper",
    duplicate: "border-line text-ink",
    invalid: "border-dashed border-ink/50 text-ink",
};

const MOBILE = /^01[016789]\d{7,8}$/;

/** 입력창이 받는 최대 글자 수 — 판정 규칙을 보여 주는 자리지 5만 건을 돌리는 자리가 아니다. */
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
            rule = "앞에 0 붙임";
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

/** 무엇을 했는지 한 줄 — 이어 붙임 · 정규화 · 최종 모양. */
function trace(chunk: Chunk) {
    const joined = chunk.pieces.length > 1 ? `조각 ${chunk.pieces.length}개를 이어 붙임, ` : "";
    const shaped = chunk.rule
        ? `${chunk.digits} (${chunk.rule}) ${chunk.normalized}`
        : chunk.digits;
    const result = chunk.final
        ? ` → ${chunk.final}`
        : ` → 휴대폰 번호 패턴이 아님 (${chunk.normalized.length}자리)`;
    return `${joined}${shaped}${result}`;
}

/**
 * 붙여넣은 번호가 등록 · 중복 · 오류로 갈리는 체. 입력창은 실제로 고칠 수 있다 —
 * 예시를 고른 뒤 번호를 지우거나 띄어 써 보면 판정이 그 자리에서 다시 선다.
 */
export function Sieve({ sieve }: { sieve: ProjectSieve }) {
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
        <Figure title={sieve.title} lede={sieve.lede} note={sieve.note}>
            <div className="flex flex-wrap gap-1.5">
                {samples.map((sample, index) => (
                    <Choice
                        key={sample.label}
                        on={index === active}
                        onClick={() => setText(sample.input)}
                    >
                        {sample.label}
                    </Choice>
                ))}
            </div>
            <p className={`mt-5 min-h-[3.5em] ${MEASURE} ${SMALL}`} aria-live="polite">
                {hint}
            </p>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-12">
                <label className="block">
                    <span className="text-[0.875rem] text-muted">붙여넣은 그대로</span>
                    <textarea
                        value={text}
                        onChange={(event) => setText(event.target.value.slice(0, MAX_INPUT))}
                        rows={8}
                        spellCheck={false}
                        className="mt-2 block w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 font-mono text-[0.875rem] leading-[1.9] text-ink outline-none focus:border-ink/50"
                    />
                </label>

                <div className="min-w-0">
                    <dl className="flex gap-10">
                        {(Object.keys(VERDICT_LABEL) as Verdict[]).map((verdict) => (
                            <div key={verdict}>
                                <dt className="text-[0.875rem] text-muted">
                                    {VERDICT_LABEL[verdict]}
                                </dt>
                                <dd className="mt-0.5 text-[1.75rem] leading-none font-bold text-ink tabular-nums">
                                    {counts[verdict]}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    {chunks.length === 0 ? (
                        <p className={`mt-6 ${SMALL}`}>숫자가 하나도 없어 거를 것이 없습니다.</p>
                    ) : (
                        <ol className="mt-6 flex flex-col">
                            {chunks.map((chunk, index) => (
                                <li
                                    // biome-ignore lint/suspicious/noArrayIndexKey: 같은 번호가 되풀이되는 것이 이 그림의 요점이라 순번이 유일한 키다
                                    key={index}
                                    className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-0.5 border-line border-t py-3"
                                >
                                    <p className="min-w-0 font-mono text-[0.875rem] leading-[1.7] break-all text-ink">
                                        {chunk.pieces.join(" ")}
                                    </p>
                                    <span
                                        className={`rounded-full border px-2.5 py-0.5 text-[0.75rem] ${VERDICT_CHIP[chunk.verdict]}`}
                                    >
                                        {VERDICT_LABEL[chunk.verdict]}
                                    </span>
                                    <p className="col-span-2 font-mono text-[0.75rem] leading-[1.7] break-all text-muted">
                                        {trace(chunk)}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>
        </Figure>
    );
}
