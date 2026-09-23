import { Navigate, useParams } from "react-router-dom";

import { Anatomy } from "@/components/project/figures/Anatomy";
import { Bridge } from "@/components/project/figures/Bridge";
import { Keyring } from "@/components/project/figures/Keyring";
import { Pipeline } from "@/components/project/figures/Pipeline";
import { Runtime } from "@/components/project/figures/Runtime";
import { Sieve } from "@/components/project/figures/Sieve";
import { Windowing } from "@/components/project/figures/Windowing";
import { ProjectCover } from "@/components/project/ProjectCover";
import { ProjectRow } from "@/components/project/ProjectRow";
import { Section } from "@/components/ui/Section";

import { projects } from "@/data/projects";
import { BODY, HEADING, MEASURE, SMALL } from "@/lib/typography";

import type { ReactNode } from "react";
import type { Project, ProjectCase } from "@/types/content";

function Paragraphs({ items }: { items: string[] }) {
    return (
        <div className={`flex flex-col gap-6 ${MEASURE}`}>
            {items.map((paragraph) => (
                <p key={paragraph} className={BODY}>
                    {paragraph}
                </p>
            ))}
        </div>
    );
}

/** 프로젝트마다 있는 것만 차례로 놓는다. */
function figuresOf(project: Project) {
    const figures: { key: string; node: ReactNode }[] = [];
    if (project.pipeline) {
        figures.push({ key: "pipeline", node: <Pipeline pipeline={project.pipeline} /> });
    }
    if (project.anatomy) {
        figures.push({ key: "anatomy", node: <Anatomy anatomy={project.anatomy} /> });
    }
    if (project.runtime) {
        figures.push({ key: "runtime", node: <Runtime runtime={project.runtime} /> });
    }
    if (project.keyring) {
        figures.push({ key: "keyring", node: <Keyring keyring={project.keyring} /> });
    }
    if (project.bridge) {
        figures.push({ key: "bridge", node: <Bridge bridge={project.bridge} /> });
    }
    if (project.sieve) {
        figures.push({ key: "sieve", node: <Sieve sieve={project.sieve} /> });
    }
    if (project.windowing) {
        figures.push({ key: "windowing", node: <Windowing windowing={project.windowing} /> });
    }
    return figures;
}

const CASE_PARTS: {
    key: keyof Pick<ProjectCase, "problem" | "approach" | "result">;
    label: string;
}[] = [
    { key: "problem", label: "문제" },
    { key: "approach", label: "해결" },
    { key: "result", label: "결과" },
];

function Case({ item }: { item: ProjectCase }) {
    return (
        <article className="border-line border-t py-12 first:border-t-0 first:pt-0">
            <h3 className={`${HEADING} ${MEASURE}`}>{item.label}</h3>
            <dl className="mt-7 flex flex-col gap-5">
                {CASE_PARTS.map((part) => (
                    <div
                        key={part.key}
                        className="grid gap-x-6 gap-y-1 sm:grid-cols-[3.5rem_minmax(0,38rem)]"
                    >
                        <dt className="text-[0.875rem] leading-[2.1] font-bold text-muted">
                            {part.label}
                        </dt>
                        <dd className={BODY}>{item[part.key]}</dd>
                    </div>
                ))}
            </dl>
            {item.metrics?.length ? (
                <dl className="mt-8 grid gap-x-8 gap-y-4 rounded-xl bg-surface px-5 py-5 sm:ml-15 sm:max-w-[38rem] sm:grid-cols-3">
                    {item.metrics.map((metric) => (
                        <div key={metric.label}>
                            <dt className="text-[0.8125rem] text-muted">{metric.label}</dt>
                            <dd className="mt-0.5 text-[1rem] leading-[1.5] font-bold text-ink tabular-nums">
                                {metric.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            ) : null}
        </article>
    );
}

export function ProjectDetail() {
    const { slug } = useParams();
    const index = projects.findIndex((item) => item.slug === slug);
    const project = projects[index];

    if (!project) {
        return <Navigate to="/" replace />;
    }

    const next = projects[(index + 1) % projects.length];
    const figures = figuresOf(project);

    // 상세에서 상세로 바로 넘어가면 React가 같은 인스턴스를 다시 쓴다. 화면 선반의 테마 토글·
    // 가로 스크롤 위치나 데모의 입력이 앞 프로젝트에서 넘어오지 않도록 프로젝트마다 새로 그린다.
    return (
        <article key={project.slug}>
            <ProjectCover project={project} />

            <Section id="context" title="배경">
                <Paragraphs items={project.context} />
            </Section>

            <Section id="approach" title="접근 방식">
                <Paragraphs items={project.approach} />
            </Section>

            {figures.length > 0 ? (
                <Section id="system" title="구조">
                    <div className="flex flex-col gap-24">
                        {figures.map((figure) => (
                            <div key={figure.key}>{figure.node}</div>
                        ))}
                    </div>
                </Section>
            ) : null}

            {project.cases.length > 0 ? (
                <Section id="cases" title="풀어낸 문제">
                    {project.cases.map((item) => (
                        <Case key={item.label} item={item} />
                    ))}
                </Section>
            ) : null}

            {project.sheets.length > 0 ? (
                <Section id="sheets" title="작업물">
                    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
                        {project.sheets.map((sheet) => (
                            <figure key={sheet.title}>
                                <img
                                    src={sheet.src}
                                    alt={sheet.title}
                                    loading="lazy"
                                    className="w-full rounded-xl bg-surface ring-1 ring-line"
                                />
                                <figcaption className="mt-4">
                                    <p className="text-[1rem] font-bold text-ink">{sheet.title}</p>
                                    <p className={`mt-1 ${SMALL}`}>{sheet.note}</p>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </Section>
            ) : null}

            {next && next.slug !== project.slug ? (
                <Section id="next" title="다음 프로젝트">
                    <div className="-mx-4 -my-5">
                        <ProjectRow project={next} />
                    </div>
                </Section>
            ) : null}
        </article>
    );
}
