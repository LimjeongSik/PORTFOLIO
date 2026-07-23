import { ProjectCard } from "@/components/project/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { projects } from "@/data/projects";

export function Projects() {
    return (
        <section id="projects" className="scroll-mt-20 bg-surface/50 px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-6xl">
                <SectionHeading
                    index="04"
                    eyebrow="Work"
                    title="프로젝트"
                    description="문제를 정의하고, 인터랙션으로 풀어낸 대표 작업들입니다. 카드를 눌러 자세히 살펴보세요."
                />

                <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.slug}
                            project={project}
                            index={String(index + 1).padStart(2, "0")}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
