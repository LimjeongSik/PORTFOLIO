import { Reveal } from "@/components/ui/Reveal";

import { BODY, LABEL, LABEL_MUTED, READING, TITLE } from "./typography";

import type { ProjectCase } from "@/types/content";

interface ProjectCaseLogProps {
    cases: ProjectCase[];
}

/** 사례 한 건이 답하는 세 가지. 순서가 곧 판단이 서는 순서다. */
const ROWS = [
    { key: "problem", label: "무엇이 문제였나" },
    { key: "approach", label: "그래서 어떻게 정했나" },
    { key: "result", label: "무엇이 달라졌나" },
] as const;

/**
 * 사례 대장.
 *
 * 한 건이 곧 **무대의 닻**(`data-stage-anchor`)이라, 3D의 오름에서 카메라가 정면으로 보는
 * 번호 판과 지금 읽는 사례가 같다. 넘기지도 쌓지도 않고 세로로 흐른다 — 프로젝트마다 다른
 * 사례 조판(대장 · 스택 · 접은 목록)을 세 벌 두었던 것을 하나로 모았다.
 *
 * 무엇을 했는지가 아니라 **무엇을 보고 그렇게 정했는지**가 남아야 포트폴리오로 읽히므로,
 * 세 줄의 이름표를 "문제 · 판단 · 결과" 같은 명사가 아니라 묻는 말로 적는다.
 */
export function ProjectCaseLog({ cases }: ProjectCaseLogProps) {
    if (cases.length === 0) {
        return null;
    }

    return (
        <section data-stage-zone="cases" className="relative py-24 sm:py-32">
            <div className={READING}>
                <header className="max-w-[34rem]">
                    <h2 className={LABEL}>Cases</h2>
                    <p className={`mt-5 ${TITLE}`}>막힌 자리와, 그때 내린 결정</p>
                </header>

                <ol className="mt-16">
                    {cases.map((item, index) => (
                        <li
                            key={item.label}
                            className="border-t border-line py-16 first:border-t-0 first:pt-0 lg:py-20"
                        >
                            <Reveal>
                                <article
                                    data-stage-anchor
                                    className="grid gap-x-10 gap-y-8 md:grid-cols-[4rem_minmax(0,1fr)]"
                                >
                                    <p
                                        className={`${LABEL_MUTED} tabular-nums md:mt-2.5`}
                                        aria-hidden
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </p>

                                    <div className="max-w-[38rem]">
                                        <h3 className="font-display text-[clamp(1.375rem,2.4vw,1.75rem)] leading-[1.42] font-medium tracking-tight text-ink">
                                            {item.label}
                                        </h3>

                                        <dl className="mt-9 flex flex-col gap-8">
                                            {ROWS.map((row) => (
                                                <div key={row.key}>
                                                    <dt className={LABEL_MUTED}>{row.label}</dt>
                                                    <dd className={`mt-3 ${BODY}`}>
                                                        {item[row.key]}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>

                                        {item.metrics?.length ? (
                                            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-line pt-7">
                                                {item.metrics.map((metric) => (
                                                    <div key={metric.label}>
                                                        <dt className={LABEL_MUTED}>
                                                            {metric.label}
                                                        </dt>
                                                        <dd className="mt-2 font-mono text-sm leading-[1.6] text-espresso tabular-nums">
                                                            {metric.value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        ) : null}
                                    </div>
                                </article>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
