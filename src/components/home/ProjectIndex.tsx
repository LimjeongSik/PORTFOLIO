import { ProjectRow } from "@/components/project/ProjectRow";
import { Section } from "@/components/ui/Section";

import { projects } from "@/data/projects";

import type { Project } from "@/types/content";

function Rows({ items }: { items: Project[] }) {
    return (
        <ul className="-mx-4 -my-5 flex flex-col gap-1">
            {items.map((project) => (
                <li key={project.slug}>
                    <ProjectRow project={project} />
                </li>
            ))}
        </ul>
    );
}

export function ProjectIndex() {
    return (
        <Section id="projects" title="프로젝트">
            <Rows items={projects.filter((project) => !project.side)} />
        </Section>
    );
}

/** 회사 · 외주가 아닌 개인 작업. 목록 줄은 프로젝트와 같고, 구간만 따로 세운다. */
export function SideProjectIndex() {
    const items = projects.filter((project) => project.side);
    if (items.length === 0) {
        return null;
    }
    return (
        <Section id="side-projects" title="사이드 프로젝트">
            <Rows items={items} />
        </Section>
    );
}
