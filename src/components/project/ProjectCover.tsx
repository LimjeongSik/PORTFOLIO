import { Link } from "react-router-dom";

import { ProjectMark } from "@/components/project/ProjectMark";
import { PLATFORM_LABEL, paint } from "@/components/project/palette";
import { ScreenShelf } from "@/components/project/ScreenShelf";

import { CONTAINER, MEASURE } from "@/lib/typography";
import { hostOf } from "@/lib/url";

import type { Project } from "@/types/content";

/**
 * 상세의 표지 띠. 사이트에서 프로젝트가 자기 색을 온전히 쓰는 유일한 자리다 — 홈 목록의
 * hover가 같은 색이라, 목록에서 눌러 들어오면 그 줄이 그대로 펼쳐진 것처럼 이어진다.
 * 화면 목록도 이 띠 위에 놓여 스크린샷이 자기 앱의 색 위에서 보인다.
 */
export function ProjectCover({ project }: { project: Project }) {
    const host = hostOf(project.links.demo);
    const facts = [
        { label: "역할", value: project.role },
        { label: "기간", value: project.period },
        { label: "형태", value: PLATFORM_LABEL[project.platform] },
    ];

    return (
        <div style={paint(project)} className="bg-(--p-paper) text-(--p-ink)">
            <div className={`${CONTAINER} pt-8 sm:pt-10`}>
                <Link
                    to="/#projects"
                    className="text-[0.875rem] text-(--p-muted) transition-colors hover:text-(--p-ink)"
                >
                    모든 프로젝트
                </Link>

                <div className="mt-12 flex items-center gap-5 sm:mt-16">
                    <ProjectMark project={project} className="h-14 w-14 sm:h-16 sm:w-16" />
                    <h1 className="text-[clamp(2.25rem,5.6vw,4rem)] leading-[1.15] font-bold tracking-[-0.03em]">
                        {project.title}
                    </h1>
                </div>

                <p className={`mt-8 ${MEASURE} text-[1.125rem] leading-[1.8] sm:text-[1.1875rem]`}>
                    {project.summary}
                </p>

                <dl className="mt-10 grid max-w-3xl gap-x-10 gap-y-5 sm:grid-cols-3">
                    {facts.map((fact) => (
                        <div key={fact.label}>
                            <dt className="text-[0.8125rem] text-(--p-muted)">{fact.label}</dt>
                            <dd className="mt-1 text-[0.9375rem] leading-[1.6] tabular-nums">
                                {fact.value}
                            </dd>
                        </div>
                    ))}
                    <div className="sm:col-span-3">
                        <dt className="text-[0.8125rem] text-(--p-muted)">기술</dt>
                        <dd className="mt-1 text-[0.9375rem] leading-[1.6]">
                            {project.tech.join(", ")}
                        </dd>
                    </div>
                </dl>

                {project.links.demo ? (
                    <p className="mt-8">
                        <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-(--p-ink) px-5 py-2.5 text-[0.9375rem] font-medium text-(--p-paper) transition-opacity hover:opacity-85"
                        >
                            {host ?? "서비스"} 열기
                        </a>
                    </p>
                ) : null}
            </div>

            <ScreenShelf project={project} />
        </div>
    );
}
