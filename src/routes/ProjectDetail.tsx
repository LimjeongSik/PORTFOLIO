import { Link, Navigate, useParams } from "react-router-dom";

import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectHero } from "@/components/project/ProjectHero";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";

import { getAdjacentProjects, getProjectBySlug } from "@/data/projects";

export function ProjectDetail() {
    const { slug } = useParams();
    const project = getProjectBySlug(slug);

    if (!project) {
        return <Navigate to="/" replace />;
    }

    const { prev, next } = getAdjacentProjects(project.slug);

    return (
        <main className="pb-24">
            <div className="px-6 pt-24">
                <div className="mx-auto max-w-6xl">
                    <Link
                        to="/#projects"
                        className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-ink"
                    >
                        <span aria-hidden>←</span> 프로젝트 목록
                    </Link>
                </div>
            </div>

            <ProjectHero project={project} />

            <div className="mt-16 px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-10 border-y border-line py-10 md:grid-cols-4">
                        <div>
                            <p className="font-mono text-xs tracking-wider text-muted uppercase">
                                Role
                            </p>
                            <p className="mt-2 text-base text-ink">{project.role}</p>
                        </div>
                        <div>
                            <p className="font-mono text-xs tracking-wider text-muted uppercase">
                                Period
                            </p>
                            <p className="mt-2 text-base text-ink">{project.period}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="font-mono text-xs tracking-wider text-muted uppercase">
                                Stack
                            </p>
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {project.tech.map((tech) => (
                                    <li key={tech}>
                                        <Tag>{tech}</Tag>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-14 grid gap-12 md:grid-cols-2">
                        <Reveal>
                            <div>
                                <h2 className="font-mono text-sm tracking-wider text-espresso uppercase">
                                    Problem
                                </h2>
                                <p className="mt-4 text-lg leading-relaxed text-ink/90">
                                    {project.problem}
                                </p>
                            </div>
                        </Reveal>
                        <Reveal delay={0.08}>
                            <div>
                                <h2 className="font-mono text-sm tracking-wider text-espresso uppercase">
                                    Solution
                                </h2>
                                <p className="mt-4 text-lg leading-relaxed text-ink/90">
                                    {project.solution}
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <Reveal>
                        <div className="mt-14">
                            <h2 className="font-mono text-sm tracking-wider text-espresso uppercase">
                                Highlights
                            </h2>
                            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                                {project.highlights.map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-3 rounded-xl border border-line bg-surface/50 p-5 text-base leading-relaxed text-ink/90"
                                    >
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-espresso" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>

                    {(project.links.demo || project.links.repo) && (
                        <div className="mt-10 flex flex-wrap gap-4">
                            {project.links.demo ? (
                                <a
                                    href={project.links.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5"
                                >
                                    라이브 데모 <span aria-hidden>↗</span>
                                </a>
                            ) : null}
                            {project.links.repo ? (
                                <a
                                    href={project.links.repo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
                                >
                                    소스 코드 <span aria-hidden>↗</span>
                                </a>
                            ) : null}
                        </div>
                    )}

                    <ProjectGallery images={project.gallery} title={project.title} />

                    <nav className="mt-20 flex items-stretch justify-between gap-4 border-t border-line pt-8">
                        {prev ? (
                            <Link
                                to={`/projects/${prev.slug}`}
                                className="group flex flex-col gap-1 text-left"
                            >
                                <span className="font-mono text-xs text-muted">← 이전</span>
                                <span className="font-display text-lg font-medium text-ink transition-colors group-hover:text-espresso">
                                    {prev.title}
                                </span>
                            </Link>
                        ) : (
                            <span />
                        )}
                        {next ? (
                            <Link
                                to={`/projects/${next.slug}`}
                                className="group flex flex-col gap-1 text-right"
                            >
                                <span className="font-mono text-xs text-muted">다음 →</span>
                                <span className="font-display text-lg font-medium text-ink transition-colors group-hover:text-espresso">
                                    {next.title}
                                </span>
                            </Link>
                        ) : (
                            <span />
                        )}
                    </nav>
                </div>
            </div>
        </main>
    );
}
