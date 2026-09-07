import { useMemo, useRef } from "react";

import { useReducedMotion } from "motion/react";

import { ProjectCard } from "@/components/project/ProjectCard";
import { ProjectStage } from "@/components/sections/ProjectStage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMoodZone } from "@/hooks/useMoodZone";

import { projects } from "@/data/projects";
import { CRAFT_MOOD, moodFromAccent } from "@/lib/atmosphere";

import type { Project } from "@/types/content";

export function Projects() {
    const root = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();
    const wide = useMediaQuery("(min-width: 1024px)");

    // 무대는 한 화면을 통째로 쓰는 연출이라 넓은 화면 + 모션 허용에서만 켠다.
    // 그 밖에서는 지금까지의 지그재그 목록을 그대로 쓴다 — 같은 내용을 스크롤 없이 펼쳐 준다.
    const staged = wide && !reduced;

    // 목록으로 떨어질 때는 무대가 무드를 몰지 않으므로, 이 섹션이 직접 자기 방을 잡는다.
    useMoodZone(root, staged ? "work-lead" : "work-list", CRAFT_MOOD, 4);

    return (
        <section ref={root} id="projects" className="scroll-mt-20 px-0 pt-24 sm:pt-32">
            <div className="px-6">
                <div className="mx-auto max-w-6xl">
                    <SectionHeading
                        index="04"
                        eyebrow="Work"
                        title="프로젝트"
                        description={
                            staged
                                ? "스크롤을 내리면 프로젝트마다 지면의 색이 바뀝니다. 카드를 눌러 자세히 살펴보세요."
                                : "문제를 정의하고, 인터랙션으로 풀어낸 대표 작업들입니다. 카드를 눌러 자세히 살펴보세요."
                        }
                    />
                </div>
            </div>

            {staged ? (
                <div className="mt-16">
                    <ProjectStage projects={projects} leadMood={CRAFT_MOOD} />
                </div>
            ) : (
                <div className="px-6 pb-24 sm:pb-32">
                    <div className="mx-auto max-w-6xl">
                        {/* 그리드 나열 대신 한 줄에 한 프로젝트씩 — 썸네일과 본문의 좌우를 번갈아
                            배치해(지그재그) 스크롤하며 하나씩 읽히게 한다. */}
                        <div className="mt-14 flex flex-col gap-16 sm:mt-16 md:gap-24">
                            {projects.map((project, index) => (
                                <MoodedCard
                                    key={project.slug}
                                    project={project}
                                    index={String(index + 1).padStart(2, "0")}
                                    reversed={index % 2 === 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

interface MoodedCardProps {
    project: Project;
    index: string;
    reversed: boolean;
}

/**
 * 목록으로 떨어졌을 때도 색은 프로젝트를 따라간다.
 * 무대가 없으니 카드 하나하나가 자기 방을 들고, 그 카드가 화면 가운데를 지날 때 지면이 물든다.
 */
function MoodedCard({ project, index, reversed }: MoodedCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mood = useMemo(() => moodFromAccent(project.theme.espresso), [project.theme.espresso]);

    useMoodZone(ref, project.slug, mood, 4);

    return (
        <div ref={ref}>
            <ProjectCard project={project} index={index} reversed={reversed} />
        </div>
    );
}
