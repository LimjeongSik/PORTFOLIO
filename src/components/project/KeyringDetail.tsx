import { ProjectBridge } from "@/components/project/ProjectBridge";
import { ProjectCaseList } from "@/components/project/ProjectCaseList";
import { ProjectFeed } from "@/components/project/ProjectFeed";
import { ProjectKeyring } from "@/components/project/ProjectKeyring";
import { ProjectSheets } from "@/components/project/ProjectSheets";
import { ProjectSplash } from "@/components/project/ProjectSplash";
import { Reveal } from "@/components/ui/Reveal";

import type { Project } from "@/types/content";

const SECTION_LABEL = "font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase";

interface KeyringDetailProps {
    project: Project;
}

/**
 * 앱이 켜지는 표지 → 세로로 넘기는 화면 → 열쇠 네 개의 시간축 → 웹↔앱 통신 → 접어 둔 사례.
 *
 * 화면을 먼저 보여 주고 구조로 들어간다. 무슨 앱인지 모른 채로 토큰 이야기를 읽으면 그냥
 * 인증 설명이 되어 버린다.
 */
export function KeyringDetail({ project }: KeyringDetailProps) {
    return (
        <>
            <ProjectSplash project={project} />

            <div className="px-6">
                <div className="mx-auto max-w-4xl">
                    <Reveal>
                        <section>
                            <h2 className={SECTION_LABEL}>Context</h2>
                            <div className="mt-5 flex max-w-3xl flex-col gap-5">
                                {project.context.map((paragraph, index) => (
                                    <p
                                        key={paragraph}
                                        className={
                                            index === 0
                                                ? "text-[1.0625rem] leading-[1.8] text-ink sm:text-lg"
                                                : "text-base leading-[1.8] text-ink/80"
                                        }
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    <Reveal delay={0.06}>
                        <section className="mt-16">
                            <h2 className={SECTION_LABEL}>Approach</h2>
                            <ul className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-3">
                                {project.approach.map((paragraph) => (
                                    <li
                                        key={paragraph}
                                        className="border-t border-line pt-5 text-[0.9375rem] leading-[1.8] text-ink/85"
                                    >
                                        {paragraph}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </Reveal>
                </div>
            </div>

            <ProjectFeed screens={project.screens} />

            {project.keyring ? <ProjectKeyring keyring={project.keyring} /> : null}

            {project.bridge ? <ProjectBridge bridge={project.bridge} /> : null}

            <ProjectCaseList cases={project.cases} />

            <div className="px-6">
                <div className="mx-auto max-w-4xl">
                    <ProjectSheets sheets={project.sheets} />
                </div>
            </div>
        </>
    );
}
