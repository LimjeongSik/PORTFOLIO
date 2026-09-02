import { ProjectAnatomy } from "@/components/project/ProjectAnatomy";
import { ProjectMasthead } from "@/components/project/ProjectMasthead";
import { ProjectProcession } from "@/components/project/ProjectProcession";
import { ProjectRuntime } from "@/components/project/ProjectRuntime";
import { ProjectSheets } from "@/components/project/ProjectSheets";
import { ProjectStack } from "@/components/project/ProjectStack";
import { Reveal } from "@/components/ui/Reveal";

import type { Project } from "@/types/content";

const SECTION_LABEL = "font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase";

interface SanctuaryDetailProps {
    project: Project;
}

/**
 * 빛이 드는 표지 → 화면 행렬 → 홈 화면 해부 → 런타임 지도 → 사례 스택.
 * 읽는 자리(본문)에는 움직이는 장치를 두지 않고, 모션은 읽기를 멈추는 전시 구간에만 둔다.
 */
export function SanctuaryDetail({ project }: SanctuaryDetailProps) {
    return (
        <>
            <ProjectMasthead project={project} />

            <div className="px-6">
                <div className="mx-auto max-w-4xl">
                    <Reveal>
                        <section className="grid gap-x-10 gap-y-4 md:grid-cols-[7rem_1fr]">
                            <h2 className={`${SECTION_LABEL} md:mt-1.5`}>Context</h2>
                            <div className="flex flex-col gap-5">
                                {project.context.map((paragraph, index) => (
                                    <p
                                        key={paragraph}
                                        className={
                                            index === 0
                                                ? "text-base leading-[1.8] text-ink sm:text-[1.0625rem]"
                                                : "text-[0.9375rem] leading-[1.8] text-ink/80"
                                        }
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <section className="mt-14 grid gap-x-10 gap-y-4 md:grid-cols-[7rem_1fr]">
                            <h2 className={`${SECTION_LABEL} md:mt-1.5`}>Approach</h2>
                            <ol className="flex flex-col">
                                {project.approach.map((paragraph) => (
                                    <li
                                        key={paragraph}
                                        className="border-t border-line py-5 text-[0.9375rem] leading-[1.8] text-ink/85 first:border-t-0 first:pt-0 last:pb-0"
                                    >
                                        {paragraph}
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </Reveal>
                </div>
            </div>

            <ProjectProcession screens={project.screens} />

            {project.anatomy ? <ProjectAnatomy anatomy={project.anatomy} /> : null}

            {project.runtime ? <ProjectRuntime runtime={project.runtime} /> : null}

            <ProjectStack cases={project.cases} />

            <div className="px-6">
                <div className="mx-auto max-w-4xl">
                    <ProjectSheets sheets={project.sheets} />
                </div>
            </div>
        </>
    );
}
