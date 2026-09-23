import { Link } from "react-router-dom";

import { ProjectMark } from "@/components/project/ProjectMark";
import { PLATFORM_LABEL, paint } from "@/components/project/palette";

import { firstSentence } from "@/lib/text";
import { HEADING, META } from "@/lib/typography";

import type { Project } from "@/types/content";

const TINT = "transition-colors duration-200 ease-out";

/**
 * 프로젝트 한 줄. 손을 올리거나 포커스가 오면 줄이 그 프로젝트의 지면색으로 칠해진다 —
 * 상세의 표지가 같은 색으로 시작하므로, 누르기 전에 어디로 가는지 먼저 보인다.
 */
export function ProjectRow({ project }: { project: Project }) {
    return (
        <Link
            to={`/projects/${project.slug}`}
            style={paint(project)}
            className={`group grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-5 rounded-2xl px-4 py-5 ${TINT} hover:bg-(--p-paper) focus-visible:bg-(--p-paper) sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-x-6`}
        >
            <ProjectMark project={project} />
            <div className="min-w-0">
                <h3
                    className={`${HEADING} ${TINT} group-hover:text-(--p-ink) group-focus-visible:text-(--p-ink)`}
                >
                    {project.title}
                </h3>
                <p
                    className={`mt-1 text-[1rem] leading-[1.7] text-ink/75 ${TINT} group-hover:text-(--p-ink) group-focus-visible:text-(--p-ink)`}
                >
                    {firstSentence(project.summary)}
                </p>
                <p
                    className={`mt-2 ${META} ${TINT} group-hover:text-(--p-muted) group-focus-visible:text-(--p-muted) sm:hidden`}
                >
                    {project.period}, {PLATFORM_LABEL[project.platform]}
                </p>
            </div>
            <div
                className={`hidden pt-1 text-right sm:block ${META} ${TINT} group-hover:text-(--p-muted) group-focus-visible:text-(--p-muted)`}
            >
                <p>{project.period}</p>
                <p>
                    {project.tech[0]} {PLATFORM_LABEL[project.platform]}
                </p>
            </div>
        </Link>
    );
}
