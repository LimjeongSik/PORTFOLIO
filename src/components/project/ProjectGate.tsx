import { useRef, useState } from "react";

import { motion, useReducedMotion } from "motion/react";

import type { ProjectPipeline, ProjectPipelineVerdict } from "@/types/content";

interface ProjectGateProps {
    pipeline: ProjectPipeline;
}

const VERDICT_LABEL: Record<ProjectPipelineVerdict, string> = {
    pass: "통과",
    drop: "버림",
    skip: "여기까지 안 옴",
};

/**
 * 좌표 하나가 서버까지 가는 길. 상황을 고르면 관문이 위에서부터 차례로 판정하고,
 * 왼쪽 레일이 좌표가 실제로 닿은 지점까지만 차오른다.
 * 침례교 페이지의 런타임 지도가 '멈춰 있는 구조'라면 이쪽은 '흘러가는 한 건'이다.
 */
export function ProjectGate({ pipeline }: ProjectGateProps) {
    const root = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(0);
    const reduced = useReducedMotion();

    const current = pipeline.cases[selected];
    if (!current) {
        return null;
    }

    // 레일은 마지막으로 통과한 관문까지만 찬다 — 좌표가 어디서 멈췄는지가 길이로 보인다.
    const lastPass = current.verdicts.lastIndexOf("pass");
    const fill = lastPass < 0 ? 0 : ((lastPass + 1) / pipeline.stages.length) * 100;

    return (
        <section ref={root} className="mt-24 px-6">
            <div className="mx-auto max-w-5xl">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                    Pipeline
                </h2>
                <p className="mt-4 max-w-2xl font-display text-2xl leading-snug font-medium text-ink sm:text-3xl">
                    {pipeline.title}
                </p>
                <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
                    {pipeline.lede}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                    {pipeline.cases.map((item, index) => {
                        const on = index === selected;
                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() => setSelected(index)}
                                aria-pressed={on}
                                className={`rounded-full border px-4 py-2 text-[0.8125rem] transition-colors duration-300 ${
                                    on
                                        ? "border-espresso bg-espresso text-paper"
                                        : "border-line text-muted hover:border-espresso hover:text-ink"
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink/80">{current.hint}</p>

                <div className="relative mt-8 pl-8">
                    {/* 레일 — 배경은 끝까지, 채움은 좌표가 닿은 데까지 */}
                    <span aria-hidden className="absolute top-7 bottom-7 left-2 w-px bg-line" />
                    <motion.span
                        aria-hidden
                        className="absolute top-7 left-2 w-px bg-espresso"
                        initial={false}
                        animate={{ height: `calc(${fill}% - 1.75rem)` }}
                        transition={
                            reduced ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                        }
                    />

                    <ol className="flex flex-col">
                        {pipeline.stages.map((stage, index) => {
                            const verdict = current.verdicts[index] ?? "skip";
                            const dropped = verdict === "drop";
                            const skipped = verdict === "skip";

                            return (
                                <li
                                    key={stage.name}
                                    className={`relative border-t border-line py-5 first:border-t-0 ${
                                        skipped ? "opacity-35" : ""
                                    }`}
                                >
                                    <span
                                        aria-hidden
                                        className={`absolute top-6 -left-[1.6875rem] h-2.5 w-2.5 rounded-full border transition-colors duration-500 ${
                                            dropped
                                                ? "border-espresso bg-paper"
                                                : skipped
                                                  ? "border-line bg-paper"
                                                  : "border-espresso bg-espresso"
                                        }`}
                                    />
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                                        <h3 className="font-mono text-sm text-ink">{stage.name}</h3>
                                        <motion.span
                                            key={`${selected}-${stage.name}`}
                                            initial={
                                                reduced ? { opacity: 1 } : { opacity: 0, x: -6 }
                                            }
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: reduced ? 0 : index * 0.09,
                                            }}
                                            className={`font-mono text-[0.6875rem] tracking-[0.18em] uppercase ${
                                                dropped
                                                    ? "text-espresso"
                                                    : skipped
                                                      ? "text-muted"
                                                      : "text-ink"
                                            }`}
                                        >
                                            {VERDICT_LABEL[verdict]}
                                        </motion.span>
                                    </div>
                                    <p className="mt-2 max-w-2xl text-[0.875rem] leading-relaxed text-muted">
                                        {stage.detail}
                                    </p>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <motion.p
                    key={selected}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: reduced ? 0 : 0.25 }}
                    className="mt-8 border-l-2 border-espresso pl-5 text-[0.9375rem] leading-[1.75] text-ink"
                >
                    {current.outcome}
                </motion.p>

                <p className="mt-6 text-[0.8125rem] leading-relaxed text-muted">{pipeline.note}</p>
            </div>
        </section>
    );
}
