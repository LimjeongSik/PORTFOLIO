import { useRef, useState } from "react";

import { BODY_TIGHT, LABEL_MUTED } from "@/lib/typography";

import type { UIEvent } from "react";
import type { ProjectWindowing } from "@/types/content";

interface ProjectWindowProps {
    windowing: ProjectWindowing;
}

/** 한 줄의 높이(px). 줄 높이가 고정이어야 스크롤 위치만으로 몇 번째 줄인지 셈이 된다. */
const ROW = 44;
/** 창에 보이는 줄 수 */
const VISIBLE = 6;
/** 위아래로 미리 그려 두는 줄 수 — 빠르게 굴려도 빈 줄이 비치지 않게 */
const OVERSCAN = 2;

function phone(index: number) {
    return `8210${String(index + 1).padStart(8, "0")}`;
}

/**
 * 목록이 아무리 길어도 보이는 줄만 그리는 창.
 *
 * 원 프로젝트는 `react-window`의 `FixedSizeList`를 썼다. 여기서는 라이브러리를 들이지 않고
 * 같은 셈을 직접 한다 — 스크롤 위치를 줄 높이로 나눈 몫이 첫 줄이고, 그 앞뒤 몇 줄만
 * 절대 위치로 놓는다. 전체 높이는 빈 상자 하나가 들고 있어 스크롤 막대는 5만 건 그대로다.
 *
 * 스크롤할 때마다 state를 쓰지 않는다. 첫 줄 번호가 **바뀔 때만** 다시 그린다 — 한 줄(44px)을
 * 넘기기 전의 스크롤은 아무것도 다시 그리지 않는다.
 */
export function ProjectWindow({ windowing }: ProjectWindowProps) {
    const { counts, perRow, measured } = windowing;
    const [count, setCount] = useState(counts[0] ?? 0);
    const [first, setFirst] = useState(0);
    const box = useRef<HTMLElement>(null);

    const rows = Math.ceil(count / perRow);
    const start = Math.max(0, first - OVERSCAN);
    const end = Math.min(rows, first + VISIBLE + OVERSCAN);
    const mountedRows = Math.max(0, end - start);
    const mountedPhones = Math.max(0, Math.min(count, end * perRow) - start * perRow);

    const onScroll = (event: UIEvent<HTMLElement>) => {
        const next = Math.floor(event.currentTarget.scrollTop / ROW);
        if (next !== first) {
            setFirst(next);
        }
    };

    const choose = (next: number) => {
        setCount(next);
        setFirst(0);
        if (box.current) {
            box.current.scrollTop = 0;
        }
    };

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <span className={`mr-2 ${LABEL_MUTED}`}>등록 건수</span>
                {counts.map((value) => {
                    const on = value === count;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => choose(value)}
                            aria-pressed={on}
                            className={`rounded-full border px-4 py-2 font-mono text-[0.8125rem] tabular-nums transition-colors duration-300 ${
                                on
                                    ? "border-espresso bg-espresso text-paper"
                                    : "border-line text-muted hover:border-espresso hover:text-ink"
                            }`}
                        >
                            {value.toLocaleString()}
                        </button>
                    );
                })}
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-14">
                <section
                    ref={box}
                    onScroll={onScroll}
                    /* 상자 안의 휠은 상자가 받는다 — 관성 스크롤이 가로채면 페이지가 내려간다. */
                    data-lenis-prevent
                    // biome-ignore lint/a11y/noNoninteractiveTabindex: 스크롤 영역은 키보드로도 굴릴 수 있어야 한다
                    tabIndex={0}
                    aria-label={`등록된 번호 ${count.toLocaleString()}건`}
                    className="relative overflow-y-auto overscroll-contain rounded-xl border border-ink/25 bg-paper/90 outline-none focus-visible:border-espresso"
                    style={{ height: ROW * VISIBLE + 16 }}
                >
                    <div className="relative" style={{ height: rows * ROW + 16 }}>
                        {Array.from({ length: mountedRows }, (_, offset) => {
                            const row = start + offset;
                            return (
                                <div
                                    key={row}
                                    className="absolute inset-x-0 grid gap-2 px-3"
                                    style={{
                                        top: row * ROW + 8,
                                        height: ROW,
                                        gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))`,
                                    }}
                                >
                                    {Array.from({ length: perRow }, (_, col) => {
                                        const index = row * perRow + col;
                                        return index < count ? (
                                            <span
                                                key={index}
                                                className="my-1.5 flex items-center truncate rounded-full bg-surface px-3 font-mono text-[0.75rem] text-ink/85 tabular-nums"
                                            >
                                                {phone(index)}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="flex flex-col gap-6">
                    <dl className="flex flex-col gap-6">
                        <div>
                            <dt className={LABEL_MUTED}>지금 DOM에 있는 줄</dt>
                            <dd className="mt-2 font-mono text-2xl text-espresso tabular-nums">
                                {mountedRows}
                                <span className="text-base text-muted">
                                    {" "}
                                    / {rows.toLocaleString()}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className={LABEL_MUTED}>그려진 번호</dt>
                            <dd className="mt-2 font-mono text-2xl text-ink tabular-nums">
                                {mountedPhones}
                                <span className="text-base text-muted">
                                    {" "}
                                    / {count.toLocaleString()}
                                </span>
                            </dd>
                        </div>
                    </dl>
                    <p className={BODY_TIGHT}>
                        굴려 보세요. 스크롤 막대는 {count.toLocaleString()}건 길이지만 숫자는
                        그대로입니다.
                    </p>
                </div>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-7">
                {measured.map((metric) => (
                    <div key={metric.label}>
                        <dt className={LABEL_MUTED}>{metric.label}</dt>
                        <dd className="mt-2 font-mono text-sm leading-[1.6] text-espresso tabular-nums">
                            {metric.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
