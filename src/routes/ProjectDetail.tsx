import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { SanctuaryDetail } from "@/components/project/SanctuaryDetail";
import { SignalDetail } from "@/components/project/SignalDetail";

import { getAdjacentProjects, getProjectBySlug } from "@/data/projects";

import type { ProjectTheme } from "@/types/content";

const EMPTY_THEME = {} as ProjectTheme;

function useProjectTheme(theme: ProjectTheme) {
    useEffect(() => {
        const root = document.documentElement;
        const keys = Object.keys(theme) as (keyof ProjectTheme)[];

        for (const key of keys) {
            root.style.setProperty(`--color-${key}`, theme[key]);
        }

        return () => {
            for (const key of keys) {
                root.style.removeProperty(`--color-${key}`);
            }
        };
    }, [theme]);
}

export function ProjectDetail() {
    const { slug } = useParams();
    const project = getProjectBySlug(slug);

    useProjectTheme(project?.theme ?? EMPTY_THEME);

    if (!project) {
        return <Navigate to="/" replace />;
    }

    const { prev, next } = getAdjacentProjects(project.slug);

    return (
        <main className="pb-20">
            <div className="px-6 pt-24">
                <div className="mx-auto max-w-4xl">
                    <Link
                        to="/#projects"
                        className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-ink"
                    >
                        <span aria-hidden>←</span> 프로젝트 목록
                    </Link>
                </div>
            </div>

            {project.variant === "sanctuary" ? (
                <SanctuaryDetail project={project} />
            ) : (
                <SignalDetail project={project} />
            )}

            <div className="px-6">
                <div className="mx-auto max-w-4xl">
                    {(project.links.demo || project.links.repo) && (
                        <div className="mt-12 flex flex-wrap gap-3">
                            {project.links.demo ? (
                                <a
                                    href={project.links.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5"
                                >
                                    라이브 데모 <span aria-hidden>↗</span>
                                </a>
                            ) : null}
                            {project.links.repo ? (
                                <a
                                    href={project.links.repo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
                                >
                                    소스 코드 <span aria-hidden>↗</span>
                                </a>
                            ) : null}
                        </div>
                    )}

                    <nav className="mt-16 flex items-stretch justify-between gap-4 border-t border-line pt-6">
                        {prev ? (
                            <Link
                                to={`/projects/${prev.slug}`}
                                className="group flex flex-col gap-1 text-left"
                            >
                                <span className="font-mono text-xs text-muted">← 이전</span>
                                <span className="font-display text-base font-medium text-ink transition-colors group-hover:text-espresso">
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
                                <span className="font-display text-base font-medium text-ink transition-colors group-hover:text-espresso">
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
