import { Reveal } from "@/components/ui/Reveal";

import type { ProjectCase } from "@/types/content";

interface ProjectCasesProps {
    cases: ProjectCase[];
}

const ROWS = [
    { key: "problem", label: "문제" },
    { key: "approach", label: "판단" },
    { key: "result", label: "결과" },
] as const;

export function ProjectCases({ cases }: ProjectCasesProps) {
    if (cases.length === 0) {
        return null;
    }

    return (
        <section className="mt-20">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                Cases
            </h2>

            <ol className="mt-8 flex flex-col">
                {cases.map((item, index) => (
                    <Reveal as="li" key={item.label} className="border-t border-line py-8">
                        <div className="grid gap-6 md:grid-cols-[5rem_1fr] md:gap-10">
                            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted">
                                CASE {String(index + 1).padStart(2, "0")}
                            </p>

                            <div>
                                <h3 className="font-display text-xl leading-snug font-medium text-ink sm:text-2xl">
                                    {item.label}
                                </h3>

                                <dl className="mt-5 flex flex-col gap-4">
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
                                    <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5 sm:ml-[4.5rem]">
                                        {item.metrics.map((metric) => (
                                            <div key={metric.label}>
                                                <dt className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                                                    {metric.label}
                                                </dt>
                                                <dd className="mt-1 font-display text-lg font-medium text-ink">
                                                    {metric.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : null}
                            </div>
                        </div>
                    </Reveal>
                ))}
            </ol>
        </section>
    );
}
