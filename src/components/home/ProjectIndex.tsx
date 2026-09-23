import { ProjectRow } from "@/components/project/ProjectRow";
import { Section } from "@/components/ui/Section";

import { projects } from "@/data/projects";

export function ProjectIndex() {
    return (
        <Section id="projects" title="프로젝트">
            <ul className="-mx-4 -my-5 flex flex-col gap-1">
                {projects.map((project) => (
                    <li key={project.slug}>
                        <ProjectRow project={project} />
                    </li>
                ))}
            </ul>
        </Section>
    );
}
