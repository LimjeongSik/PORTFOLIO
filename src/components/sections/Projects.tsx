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

                {/* 그리드 나열 대신 한 줄에 한 프로젝트씩 — 썸네일과 본문의 좌우를 번갈아
                    배치해(지그재그) 스크롤하며 하나씩 읽히게 한다. */}
                <div className="mt-14 flex flex-col gap-16 sm:mt-16 md:gap-24">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.slug}
                            project={project}
                            index={String(index + 1).padStart(2, "0")}
                            reversed={index % 2 === 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
