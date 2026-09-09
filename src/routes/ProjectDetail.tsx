import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { ProjectBrief } from "@/components/project/ProjectBrief";
import { ProjectCaseLog } from "@/components/project/ProjectCaseLog";
import { ProjectCover } from "@/components/project/ProjectCover";
import { ProjectSheets } from "@/components/project/ProjectSheets";
import { ProjectShowcase } from "@/components/project/ProjectShowcase";
import { ProjectSignature } from "@/components/project/ProjectSignature";
import { LABEL_MUTED, SHOWCASE } from "@/components/project/typography";
import { useReadingAnchor } from "@/hooks/useReadingAnchor";

import { getAdjacentProjects, getProjectBySlug } from "@/data/projects";
import { applyTheme, releaseTheme } from "@/lib/atmosphere";
import { isCrossing } from "@/lib/transition";

import type { Project, ProjectTheme } from "@/types/content";

const EMPTY_THEME = {} as ProjectTheme;

/** 화면 전시 구간의 제목 — 이 프로젝트가 무엇으로 이루어져 있는지 한 줄로. */
function showcaseTitle(project: Project) {
    return project.platform === "mobile" ? "손에 들고 쓰는 화면들" : "브라우저에서 보이는 화면들";
}

/**
 * 이 프로젝트의 테마를 지면에 얹는다.
 *
 * 페이지를 넘기는 동안에는 홈과 상세가 잠시 함께 살아 있어, 언마운트가 마운트보다 나중에 온다.
 * 그래서 색의 소유권은 `@/lib/atmosphere`가 한곳에서 들고 있고, 걷어내는 것도 아직 내가
 * 주인일 때만 한다 — 직접 `removeProperty`를 부르면 도착한 쪽이 칠한 값까지 지운다.
 *
 * 넘어와서 얹는 것이면 **물들이며** 얹는다. 캔버스가 계속 보이는 채로 카메라가 이 방으로
 * 날아가는데 지면색만 툭 바뀌면 그 한 프레임이 통째로 눈에 띈다. 주소로 바로 열린 것이면
 * 즉시 얹는다 — 어두운 기본값에서 밝은 테마로 물드는 건 전환이 아니라 덜 그려진 화면이다.
 */
function useProjectTheme(slug: string, theme: ProjectTheme) {
    useEffect(() => {
        if (!slug) {
            return;
        }
        applyTheme(slug, theme, { duration: isCrossing() ? 0.75 : 0 });
        return () => releaseTheme(slug, isCrossing());
    }, [slug, theme]);
}

/**
 * 프로젝트 상세.
 *
 * 홈과 **같은 지면**이다 — 하나의 3D 공간을 카메라가 스크롤을 따라 관통하고, 구간은 그
 * 공간 안의 장소다(`components/project/stage/world`). 예전에는 프로젝트마다 표지 연출·
 * 화면 전시·사례 조판을 따로 만들어 세 벌이 있었는데, 그러다 보니 홈과도 서로와도 다른
 * 지면이 셋 생겼다(사용자 지적). 지금은 뼈대가 하나고, 프로젝트마다 다른 것은 **색과
 * 시그니처 그림 하나**뿐이다.
 */
export function ProjectDetail() {
    const { slug } = useParams();
    const project = getProjectBySlug(slug);

    useProjectTheme(project?.slug ?? "", project?.theme ?? EMPTY_THEME);
    /* 창 폭이 `lg` 경계를 넘으면 조판이 통째로 갈린다(붙어 선 기기 · 해부 구간의 pin 여백).
       브라우저는 픽셀을 지키려 하므로 그대로 두면 읽던 자리를 잃는다 — 보고 있던 화면·사례를
       보존한다. */
    useReadingAnchor();

    if (!project) {
        return <Navigate to="/" replace />;
    }

    const { prev, next } = getAdjacentProjects(project.slug);

    return (
        <>
            {/* 무대(좌대 → 벽 → 회랑 → 아치 → 오름 → 바깥)는 `App`이 라우터 바깥에서
                들고 있다. 여기서는 그 앞에 앉는 글과 베일만 둔다 — 베일도 `<main>` 바깥이라야
                한다. 전환이 본문에 거는 `transform`이 안쪽의 `fixed`에게 컨테이닝 블록이
                되어 배경이 스크롤한 만큼 밀려나기 때문이다. */}
            {/* 글이 앉는 자리를 아주 얕게 눌러 준다. 판은 이미 멀리 있지만, 회랑의 기기가
                스칠 때의 대비까지 이 한 겹이 받아 준다. */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(58% 46% at 42% 50%, color-mix(in srgb, var(--color-paper) 76%, transparent) 0%, color-mix(in srgb, var(--color-paper) 40%, transparent) 60%, transparent 100%)",
                }}
            />

            <main className="relative z-10">
                <ProjectCover project={project} />
                <ProjectBrief project={project} />
                <ProjectShowcase
                    screens={project.screens}
                    platform={project.platform}
                    title={showcaseTitle(project)}
                />
                <ProjectSignature project={project} />
                <ProjectCaseLog cases={project.cases} />

                {/* 마지막 사례를 읽고 나면 카메라가 오름을 떠난다 — 그러지 않으면 번호 판과
                    고리가 Craft와 링크를 읽는 내내 배경에 남는다(사용자 지적). 시트가 없는
                    프로젝트에서도 날아갈 스크롤이 있도록 최소 높이를 준다. */}
                <div data-stage-zone="outro" className="min-h-[140svh]">
                    <ProjectSheets sheets={project.sheets} />

                    <div className={`${SHOWCASE} pb-24`}>
                        {project.links.demo || project.links.repo ? (
                            <div className="flex flex-wrap gap-3">
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
                        ) : null}

                        {/* 두 제목이 한 줄에 안 들어가면 줄을 나눈다. 접히지 않는 행에 긴
                            제목이 둘 오면 그 한 줄이 지면 폭을 밀어낸다 — 지금 셋으로는
                            들어가지만, 프로젝트가 늘면 제일 먼저 넘칠 자리다. */}
                        <nav className="mt-16 flex flex-wrap items-stretch justify-between gap-x-6 gap-y-8 border-t border-line pt-8">
                            {prev ? (
                                <Link
                                    to={`/projects/${prev.slug}`}
                                    className="group flex min-w-0 flex-col gap-2 text-left"
                                >
                                    <span className={LABEL_MUTED}>← 이전</span>
                                    <span className="font-display text-lg leading-[1.4] font-medium text-ink transition-colors group-hover:text-espresso">
                                        {prev.title}
                                    </span>
                                </Link>
                            ) : (
                                <span />
                            )}
                            {next ? (
                                <Link
                                    to={`/projects/${next.slug}`}
                                    className="group flex min-w-0 flex-col gap-2 text-right"
                                >
                                    <span className={LABEL_MUTED}>다음 →</span>
                                    <span className="font-display text-lg leading-[1.4] font-medium text-ink transition-colors group-hover:text-espresso">
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
        </>
    );
}
