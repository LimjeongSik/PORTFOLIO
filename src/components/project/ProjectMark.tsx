import type { Project } from "@/types/content";

interface ProjectMarkProps {
    project: Project;
    className?: string;
}

/** 앱 아이콘. 아이콘이 없는 프로젝트는 자기 색 위에 첫 글자를 세운다. */
export function ProjectMark({ project, className = "h-12 w-12" }: ProjectMarkProps) {
    if (project.icon) {
        return (
            <img
                src={project.icon}
                alt=""
                className={`${className} shrink-0 rounded-[24%] object-cover ring-1 ring-black/5`}
            />
        );
    }
    return (
        <span
            aria-hidden="true"
            className={`${className} flex shrink-0 items-center justify-center rounded-[24%] text-[1.125rem] font-bold ring-1 ring-black/5`}
            style={{ backgroundColor: project.theme.paper, color: project.theme.espresso }}
        >
            {project.title.charAt(0)}
        </span>
    );
}
