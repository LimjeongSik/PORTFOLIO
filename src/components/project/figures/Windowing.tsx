import { useRef, useState } from "react";

import { Choice, Figure } from "@/components/project/Figure";

import { SMALL } from "@/lib/typography";

import type { UIEvent } from "react";
import type { ProjectWindowing } from "@/types/content";

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
 * 원 프로젝트는 `react-window`의 `FixedSizeList`를 썼다. 여기서는 같은 셈을 직접 한다 —
 * 스크롤 위치를 줄 높이로 나눈 몫이 첫 줄이고, 그 앞뒤 몇 줄만 절대 위치로 놓는다.
 * 전체 높이는 빈 상자 하나가 들고 있어 스크롤 막대는 건수 그대로다.
 * 첫 줄 번호가 **바뀔 때만** 다시 그린다.
 */
export function Windowing({ windowing }: { windowing: ProjectWindowing }) {
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
        <Figure title={windowing.title} lede={windowing.lede} note={windowing.note}>
            <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-2 text-[0.875rem] text-muted">등록 건수</span>
                {counts.map((value) => (
                    <Choice key={value} on={value === count} onClick={() => choose(value)}>
                        {value.toLocaleString()}
                    </Choice>
                ))}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
                <section
                    ref={box}
                    onScroll={onScroll}
                    // biome-ignore lint/a11y/noNoninteractiveTabindex: 스크롤 영역은 키보드로도 굴릴 수 있어야 한다
                    tabIndex={0}
                    aria-label={`등록된 번호 ${count.toLocaleString()}건`}
                    className="relative overflow-y-auto overscroll-contain rounded-xl border border-line bg-surface outline-none focus-visible:border-ink/50"
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
                                                className="my-1.5 flex items-center truncate rounded-full bg-paper px-3 font-mono text-[0.75rem] text-ink/85 tabular-nums ring-1 ring-line"
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
                    <dl className="flex gap-10 lg:flex-col lg:gap-6">
                        <div>
                            <dt className="text-[0.875rem] text-muted">지금 DOM에 있는 줄</dt>
                            <dd className="mt-1 text-[1.75rem] leading-none font-bold text-ink tabular-nums">
                                {mountedRows}
                                <span className="text-[1rem] font-normal text-muted">
                                    {" "}
                                    / {rows.toLocaleString()}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[0.875rem] text-muted">그려진 번호</dt>
                            <dd className="mt-1 text-[1.75rem] leading-none font-bold text-ink tabular-nums">
                                {mountedPhones}
                                <span className="text-[1rem] font-normal text-muted">
                                    {" "}
                                    / {count.toLocaleString()}
                                </span>
                            </dd>
                        </div>
                    </dl>
                    <p className={SMALL}>
                        스크롤 막대는 {count.toLocaleString()}건만큼 길지만, 스크롤해도 위의 두
                        숫자는 거의 그대로입니다.
                    </p>
                </div>
            </div>

            <dl className="mt-10 grid gap-6 border-line border-t pt-6 sm:grid-cols-3">
                {measured.map((metric) => (
                    <div key={metric.label}>
                        <dt className="text-[0.875rem] text-muted">{metric.label}</dt>
                        <dd className="mt-1 text-[1.125rem] font-bold text-ink tabular-nums">
                            {metric.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </Figure>
    );
}
