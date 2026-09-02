import { useCallback, useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/ui/Reveal";

import { getLenisInstance } from "@/lib/lenis";

import type { ProjectCase } from "@/types/content";

interface ProjectCasesProps {
    cases: ProjectCase[];
}

const ROWS = [
    { key: "problem", label: "문제" },
    { key: "approach", label: "판단" },
    { key: "result", label: "결과" },
] as const;

/** 화면 한가운데를 지나는 사례만 활성으로 본다. */
const BAND = "-45% 0px -45% 0px";

/**
 * 사례를 대장(ledger)처럼 읽는다 — 왼쪽에 목록이 붙어 따라오고 오른쪽 본문이 흐른다.
 * 지금 어디를 읽고 있는지가 항상 보이고, 목록을 눌러 그 사례로 건너뛸 수 있다.
 */
export function ProjectCases({ cases }: ProjectCasesProps) {
    const items = useRef<(HTMLLIElement | null)[]>([]);
    const [active, setActive] = useState(0);

    /**
     * 인접 프로젝트 링크로 signal 프로젝트끼리 오갈 때는 이 컴포넌트가 언마운트되지 않는다.
     * key가 바뀐 `li`들만 교체되므로, 의존성을 비워 두면 옵저버가 떨어져 나간 노드를 계속 보고
     * 왼쪽 목록의 표시가 그 자리에 굳는다.
     */
    useEffect(() => {
        setActive(0);
        const nodes = cases
            .map((_, index) => items.current[index])
            .filter((node): node is HTMLLIElement => node !== null);
        if (nodes.length === 0) {
            return;
        }

        const visible = new Set<number>();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const index = nodes.indexOf(entry.target as HTMLLIElement);
                    if (index < 0) {
                        continue;
                    }
                    if (entry.isIntersecting) {
                        visible.add(index);
                    } else {
                        visible.delete(index);
                    }
                }
                // 밴드가 비는 순간(빠른 스크롤·사례 사이 여백)에는 마지막 값을 유지한다.
                // 목록이 깜빡이는 것보다 직전 사례가 남아 있는 편이 읽기에 낫다.
                if (visible.size > 0) {
                    setActive(Math.min(...visible));
                }
            },
            { rootMargin: BAND },
        );

        for (const node of nodes) {
            observer.observe(node);
        }
        return () => observer.disconnect();
    }, [cases]);

    const jump = useCallback((index: number) => {
        const target = items.current[index];
        if (!target) {
            return;
        }
        const lenis = getLenisInstance();
        if (lenis) {
            // Lenis가 window 스크롤을 소유하므로 직접 scrollTo하면 다음 프레임에 되돌아간다.
            lenis.scrollTo(target, { offset: -120 });
            return;
        }
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    if (cases.length === 0) {
        return null;
    }

    return (
        <section className="mt-24 px-6">
            <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10">
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                        Cases
                    </h2>
                    <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
                        무엇을 했는지가 아니라, 무엇을 보고 그렇게 정했는지.
                    </p>

                    <ol className="mt-6 hidden flex-col lg:flex">
                        {cases.map((item, index) => {
                            const on = index === active;
                            return (
                                <li key={item.label}>
                                    <button
                                        type="button"
                                        onClick={() => jump(index)}
                                        aria-current={on ? "true" : undefined}
                                        className="group flex w-full items-start gap-3 py-2 text-left"
                                    >
                                        <span
                                            aria-hidden
                                            className={`mt-2 h-px shrink-0 transition-all duration-500 ease-out ${
                                                on ? "w-6 bg-espresso" : "w-3 bg-line"
                                            }`}
                                        />
                                        <span
                                            className={`font-mono text-[0.625rem] tracking-[0.18em] tabular-nums transition-colors duration-500 ${
                                                on ? "text-espresso" : "text-muted"
                                            }`}
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span
                                            className={`line-clamp-2 text-[0.8125rem] leading-snug transition-colors duration-500 ${
                                                on
                                                    ? "text-ink"
                                                    : "text-muted group-hover:text-ink/70"
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <ol className="flex flex-col">
                    {cases.map((item, index) => (
                        <li
                            key={item.label}
                            ref={(node) => {
                                items.current[index] = node;
                            }}
                            className="border-t border-line pt-8 pb-10 first:border-t-0 first:pt-0 last:pb-0"
                        >
                            <Reveal>
                                <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted tabular-nums">
                                    CASE {String(index + 1).padStart(2, "0")}
                                </p>
                                <h3 className="mt-4 font-display text-xl leading-snug font-medium text-ink sm:text-2xl">
                                    {item.label}
                                </h3>

                                <dl className="mt-6 flex flex-col gap-4">
                                    {ROWS.map((row) => (
                                        <div
                                            key={row.key}
                                            className="grid gap-1.5 sm:grid-cols-[3.5rem_1fr] sm:gap-5"
                                        >
                                            <dt
                                                className={`font-mono text-[0.6875rem] tracking-[0.18em] uppercase sm:mt-1 ${
                                                    row.key === "result"
                                                        ? "text-espresso"
                                                        : "text-muted"
                                                }`}
                                            >
                                                {row.label}
                                            </dt>
                                            <dd className="text-[0.9375rem] leading-relaxed text-ink/85">
                                                {item[row.key]}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                {item.metrics && item.metrics.length > 0 ? (
                                    <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5 sm:ml-[4.5rem]">
                                        {item.metrics.map((metric) => (
                                            <div key={metric.label}>
                                                <dt className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                                                    {metric.label}
                                                </dt>
                                                <dd className="mt-1 font-display text-lg font-medium text-ink tabular-nums">
                                                    {metric.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : null}
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
