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
    const lead = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const wide = useMediaQuery("(min-width: 1024px)");

    // 무대는 한 화면을 통째로 쓰는 연출이라 넓은 화면 + 모션 허용에서만 켠다.
    // 그 밖에서는 지금까지의 지그재그 목록을 그대로 쓴다 — 같은 내용을 스크롤 없이 펼쳐 준다.
    const staged = wide && !reduced;

    /* 제목 영역만 이 섹션의 방이다 — 섹션 전체를 존으로 잡으면 갤러리·카드의 방과 겹쳐,
       트리거가 한꺼번에 다시 만들어질 때(리사이즈 · 복원) 나중에 도는 이쪽이 이긴다.
       제목을 지나 무대에 들어가면 카드가 제 방을 주장하고, 위로 되돌아오면 무대의
       onLeaveBack이 이 방으로 돌려놓는다. */
    useMoodZone(lead, staged ? "work-lead" : "work-list", CRAFT_MOOD, 4);

    return (
        <section id="projects" className="scroll-mt-20 px-0 pt-24 sm:pt-32">
            <div ref={lead} className="px-6">
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
                /* 목록으로 떨어져도 3D 무대는 그대로 갤러리로 난다 — 구간 표식이 무대 컴포넌트
                   안에만 있으면 타임라인에 프로젝트 구간이 없어 카메라가 경력의 계단 꼭대기에
                   영영 머문다(사용자 지적). 카드마다 닻을 두어, 카드가 화면 가운데 올 때
                   같은 순서의 자리 앞에 카메라가 선다. */
                <div data-stage-zone="projects" className="px-6 pb-24 sm:pb-32">
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
        <div ref={ref} data-stage-anchor="">
            <ProjectCard project={project} index={index} reversed={reversed} />
        </div>
    );
}
