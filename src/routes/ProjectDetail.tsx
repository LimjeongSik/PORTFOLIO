import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { KeyringDetail } from "@/components/project/KeyringDetail";
import { SanctuaryDetail } from "@/components/project/SanctuaryDetail";
import { SignalDetail } from "@/components/project/SignalDetail";

import { getAdjacentProjects, getProjectBySlug } from "@/data/projects";
import { applyTheme, releaseTheme } from "@/lib/atmosphere";

import type { ProjectTheme } from "@/types/content";

const EMPTY_THEME = {} as ProjectTheme;

/**
 * 이 프로젝트의 테마를 지면에 얹는다.
 *
 * 페이지를 넘기는 동안에는 홈과 상세가 잠시 함께 살아 있어, 언마운트가 마운트보다 나중에 온다.
 * 그래서 색의 소유권은 `@/lib/atmosphere`가 한곳에서 들고 있고, 걷어내는 것도 아직 내가
 * 주인일 때만 한다 — 직접 `removeProperty`를 부르면 도착한 쪽이 칠한 값까지 지운다.
 */
function useProjectTheme(slug: string, theme: ProjectTheme) {
    useEffect(() => {
        if (!slug) {
            return;
        }
        applyTheme(slug, theme);
        return () => releaseTheme(slug);
    }, [slug, theme]);
}

export function ProjectDetail() {
    const { slug } = useParams();
    const project = getProjectBySlug(slug);

    useProjectTheme(project?.slug ?? "", project?.theme ?? EMPTY_THEME);

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
            ) : project.variant === "keyring" ? (
                <KeyringDetail project={project} />
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
