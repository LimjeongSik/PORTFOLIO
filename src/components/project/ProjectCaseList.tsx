import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import type { ProjectCase } from "@/types/content";

interface ProjectCaseListProps {
    cases: ProjectCase[];
}

const ROWS = [
    { key: "problem", label: "문제" },
    { key: "approach", label: "판단" },
    { key: "result", label: "결과" },
] as const;

/**
 * 사례를 접어 둔 목록.
 *
 * 이 페이지는 위쪽에 움직이는 장치가 셋이나 있어서, 정작 오래 읽어야 하는 자리는 조용해야
 * 한다. 그래서 여기서만은 스크롤이 아무것도 하지 않는다 — 열고 닫는 것은 읽는 사람이고,
 * 움직임은 그 손짓에 답하는 것뿐이다.
 *
 * 여러 개를 함께 펼칠 수 있게 뒀다. 사례끼리 견주며 읽는 편이 하나씩 넘기는 것보다 낫다.
 */
export function ProjectCaseList({ cases }: ProjectCaseListProps) {
    const [open, setOpen] = useState<number[]>([0]);
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

    /** 인접 프로젝트로 넘어와도 이 컴포넌트는 살아 있다 — 펼친 자리를 처음으로 되돌린다. */
    // biome-ignore lint/correctness/useExhaustiveDependencies: cases는 리셋 시점을 정하는 의도된 의존성
    useEffect(() => {
        setOpen([0]);
    }, [cases]);

    const toggle = (index: number) => {
        setOpen((prev) =>
            prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index],
        );
    };

    if (cases.length === 0) {
        return null;
    }

    return (
        <section className="mt-28 px-6">
            <div className="mx-auto max-w-4xl">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                    Cases
                </h2>
                <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
                    무엇을 했는지가 아니라, 무엇을 보고 그렇게 정했는지.
                </p>

                <ul className="mt-10 border-t border-line">
                    {cases.map((item, index) => {
                        const expanded = open.includes(index);
                        return (
                            <li key={item.label} className="border-b border-line">
                                <h3>
                                    <button
                                        type="button"
                                        onClick={() => toggle(index)}
                                        aria-expanded={expanded}
                                        className="group flex w-full items-start gap-5 py-6 text-left"
                                    >
                                        <span
                                            className={`flex-1 font-sans text-lg leading-snug font-bold tracking-[-0.03em] transition-colors sm:text-xl ${
                                                expanded
                                                    ? "text-espresso"
                                                    : "text-ink group-hover:text-espresso"
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                        {/* 닫혀 있으면 십자, 열리면 가로선 하나 */}
                                        <span
                                            aria-hidden
                                            className="relative mt-2.5 h-3 w-3 shrink-0"
                                        >
                                            <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-muted transition-colors group-hover:bg-espresso" />
                                            <span
                                                className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-muted transition-all duration-300 group-hover:bg-espresso ${
                                                    expanded ? "scale-y-0 opacity-0" : ""
                                                }`}
                                            />
                                        </span>
                                    </button>
                                </h3>

                                <AnimatePresence initial={false}>
                                    {expanded ? (
                                        <motion.div
                                            initial={
                                                reduced
                                                    ? { height: "auto", opacity: 1 }
                                                    : { height: 0, opacity: 0 }
                                            }
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={
                                                reduced
                                                    ? { height: "auto", opacity: 1 }
                                                    : { height: 0, opacity: 0 }
                                            }
                                            transition={{
                                                duration: 0.42,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <dl className="flex flex-col gap-4 pb-8">
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
                                                        <dd className="max-w-2xl text-[0.9375rem] leading-[1.8] text-ink/85">
                                                            {item[row.key]}
                                                        </dd>
                                                    </div>
                                                ))}

                                                {item.metrics && item.metrics.length > 0 ? (
                                                    <div className="mt-2 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5 sm:ml-[4.5rem]">
                                                        {item.metrics.map((metric) => (
                                                            <div key={metric.label}>
                                                                <dt className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                                                                    {metric.label}
                                                                </dt>
                                                                <dd className="mt-1 font-sans text-lg font-bold text-ink tabular-nums">
                                                                    {metric.value}
                                                                </dd>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </dl>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
