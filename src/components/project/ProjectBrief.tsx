import { Reveal } from "@/components/ui/Reveal";

import { BODY, BODY_LEAD, LABEL, MEASURE, READING, STACK } from "./typography";

import type { Project } from "@/types/content";

interface ProjectBriefProps {
    project: Project;
}

/**
 * 읽는 구간 — 조건(Context)과 판단(Approach).
 *
 * 여기에는 움직이는 장치를 두지 않는다. 뒤의 무대도 이 구간에서는 스택 이름 판이 멀리
 * 벽을 이룰 뿐이고, 카메라는 옆으로만 흐른다. 읽는 자리 옆에서 무언가 계속 움직이면 어떤
 * 형태든 방해가 된다.
 *
 * 조건은 문단으로, 판단은 가로선으로 끊은 목록으로 적는다. 판단은 순서가 아니라 **서로 다른
 * 결정 몇 개**라 번호를 붙이지 않는다 — 번호는 실제로 차례가 있는 것에만 쓴다.
 */
export function ProjectBrief({ project }: ProjectBriefProps) {
    /* 구간을 화면 둘 남짓으로 잡는 것은 그동안 카메라가 벽을 지나 회랑으로 날아갈 스크롤을
       벌기 위해서다. 내용이 그보다 짧으면 가운데로 모인다. */
    return (
        <section
            data-stage-zone="brief"
            className="relative flex min-h-[180svh] flex-col justify-center py-24 sm:py-32"
        >
            <div className={READING}>
                <Reveal>
                    <div className="grid gap-x-10 gap-y-6 md:grid-cols-[7rem_minmax(0,1fr)]">
                        <h2 className={`${LABEL} md:mt-2`}>Context</h2>
                        <div className={`${STACK} ${MEASURE}`}>
                            {project.context.map((paragraph, index) => (
                                <p key={paragraph} className={index === 0 ? BODY_LEAD : BODY}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.06}>
                    <div className="mt-20 grid gap-x-10 gap-y-6 md:grid-cols-[7rem_minmax(0,1fr)]">
                        <h2 className={`${LABEL} md:mt-2`}>Approach</h2>
                        <ul className={MEASURE}>
                            {project.approach.map((paragraph) => (
                                <li
                                    key={paragraph}
                                    className={`border-t border-line py-7 first:border-t-0 first:pt-0 last:pb-0 ${BODY}`}
                                >
                                    {paragraph}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
