import { ProjectCases } from "@/components/project/ProjectCases";
import { ProjectGate } from "@/components/project/ProjectGate";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectScreens } from "@/components/project/ProjectScreens";
import { ProjectSheets } from "@/components/project/ProjectSheets";
import { Reveal } from "@/components/ui/Reveal";

import type { Project } from "@/types/content";

const SECTION_LABEL = "font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase";

interface SignalDetailProps {
    project: Project;
}

/**
 * 표지에서 제목이 잡히고 → 화면 전시 → 좌표 한 건이 관문을 지나는 파이프라인 → 사례 대장.
 * 침례교 쪽이 '구조를 펼쳐 보는' 페이지라면 이쪽은 '한 건이 흘러가는' 페이지다.
 */
export function SignalDetail({ project }: SignalDetailProps) {
    return (
        <>
            <ProjectHero project={project} />

            <div className="px-6">
                <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2 md:gap-14">
                    <Reveal>
                        <section>
                            <h2 className={SECTION_LABEL}>Context</h2>
                            <div className="mt-4 flex flex-col gap-4">
                                {project.context.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="text-[0.9375rem] leading-[1.8] text-ink/85"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <section>
                            <h2 className={SECTION_LABEL}>Approach</h2>
                            <div className="mt-4 flex flex-col gap-4">
                                {project.approach.map((paragraph) => (
                                    <p
                                        key={paragraph}
                                        className="text-[0.9375rem] leading-[1.8] text-ink/85"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    </Reveal>
                </div>
            </div>

            <ProjectScreens screens={project.screens} platform={project.platform} />

            {project.pipeline ? <ProjectGate pipeline={project.pipeline} /> : null}

            <ProjectCases cases={project.cases} />

            <div className="px-6">
                <div className="mx-auto max-w-4xl">
                    <ProjectSheets sheets={project.sheets} />
                </div>
            </div>
        </>
    );
}
