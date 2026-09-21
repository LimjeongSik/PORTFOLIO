import { useRef } from "react";

import { useReducedMotion } from "motion/react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { activities } from "@/data/activities";
import { experiences } from "@/data/experience";
import { gsap, useGSAP } from "@/lib/gsap";
import { BODY, LABEL, LEDE, MEASURE, NOTE } from "@/lib/typography";

export function Experience() {
    const root = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    useGSAP(
        () => {
            // 진행선은 동작 줄이기에서도 유지한다 — 스크롤 위치를 알려 주는 표시라 장식이 아니다.
            gsap.from(".timeline-progress", {
                scaleY: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".timeline-track",
                    start: "top center",
                    end: "bottom center",
                    scrub: true,
                },
            });

            if (reduced) {
                return;
            }

            for (const entry of gsap.utils.toArray<HTMLElement>(".timeline-entry")) {
                // 카드가 원근을 쓰고 비스듬히 서 있다가 자리에 앉는다.
                gsap.from(entry.querySelector(".timeline-card"), {
                    opacity: 0,
                    y: 48,
                    rotateX: 12,
                    duration: 0.85,
                    ease: "power3.out",
                    scrollTrigger: { trigger: entry, start: "top 84%" },
                });

                // 점은 진행선이 도착할 때 켜진다. 지나가면 그대로 남는다.
                gsap.fromTo(
                    entry.querySelector(".timeline-dot"),
                    { scale: 0.45, backgroundColor: "var(--color-line)" },
                    {
                        scale: 1,
                        backgroundColor: "var(--color-espresso)",
                        duration: 0.45,
                        ease: "back.out(2.2)",
                        scrollTrigger: { trigger: entry, start: "top 52%" },
                    },
                );

                // 회사명 옆의 선이 길게 뻗는다.
                gsap.from(entry.querySelector(".timeline-tick"), {
                    scaleX: 0,
                    duration: 0.7,
                    ease: "expo.out",
                    scrollTrigger: { trigger: entry, start: "top 80%" },
                });

                // 성과는 한 줄씩 붙는다.
                gsap.from(entry.querySelectorAll(".timeline-point"), {
                    opacity: 0,
                    x: -14,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out",
                    scrollTrigger: { trigger: entry, start: "top 76%" },
                });
            }
        },
        { scope: root, dependencies: [reduced] },
    );

    return (
        <section id="experience" className="scroll-mt-20 px-6 py-20 sm:py-24">
            <div ref={root} className="mx-auto max-w-6xl">
                <SectionHeading
                    index="03"
                    eyebrow="Experience"
                    title="경력"
                    description="지금까지 함께한 팀과 그곳에서 남긴 결과입니다."
                />

                <div className="timeline-track relative mt-16 pl-8 perspective-[1100px] sm:pl-12">
                    <div className="absolute top-2 bottom-2 left-0.75 w-px bg-line sm:left-1.75" />
                    <div className="timeline-progress absolute top-2 bottom-2 left-0.75 w-px origin-top bg-espresso sm:left-1.75" />

                    <div className="space-y-16">
                        {experiences.map((exp) => (
                            <article
                                key={`${exp.company}-${exp.period}`}
                                className="timeline-entry relative"
                                // 홈 무대의 카메라가 이 항목이 화면 가운데 올 때 같은 순서의
                                // 연도 판을 보도록 잡아 주는 닻(stage/timeline).
                                data-stage-anchor=""
                            >
                                <span className="timeline-dot absolute top-1.5 -left-8 h-2 w-2 rounded-full bg-espresso ring-4 ring-paper sm:-left-12 sm:h-3.5 sm:w-3.5" />
                                <div className="timeline-card origin-top">
                                    <p className="font-mono text-xs tracking-wider text-muted">
                                        {exp.period}
                                    </p>
                                    <h3 className="mt-2 font-display text-2xl font-medium text-ink sm:text-3xl">
                                        {exp.position}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-3">
                                        <p className="text-base text-espresso">{exp.company}</p>
                                        <span className="timeline-tick h-px w-16 origin-left bg-espresso/50" />
                                    </div>
                                    <p className={`mt-4 ${MEASURE} ${LEDE}`}>{exp.summary}</p>
                                    <ul className={`mt-5 ${MEASURE} space-y-3`}>
                                        {exp.achievements.map((item) => (
                                            <li
                                                key={item}
                                                className={`timeline-point flex gap-3 ${BODY}`}
                                            >
                                                <span className="mt-3.5 h-1 w-1 shrink-0 rounded-full bg-espresso" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
                                        {exp.stack.map((tech) => (
                                            <li
                                                key={tech}
                                                className="font-mono text-xs text-muted transition-colors hover:text-espresso"
                                            >
                                                {tech}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {/* 활동은 경력의 꼬리표다 — 섹션을 따로 세우지 않는다. 항목이 하나뿐인 섹션은
                    채울 게 없어 보이고, 무대는 구간이 다섯으로 고정돼 있다(stage/world).
                    **여기에 data-stage-anchor를 붙이지 말 것** — 경력의 카메라는 닻 순서를
                    연도 판에 그대로 대응시키므로, 닻이 experiences.length를 넘으면 마지막
                    항목을 읽는 동안 계단이 어긋난다. 마지막 닻 뒤의 스크롤은 카메라가
                    꼭대기에 머무는 구간이라 이 블록이 지면을 늘려도 안전하다. */}
                {activities.length > 0 && (
                    <div className="mt-24 border-t border-line pt-10 pl-8 sm:pl-12">
                        <Reveal>
                            <p className={LABEL}>Activity</p>
                        </Reveal>
                        <ul className="mt-8 space-y-8">
                            {activities.map((item, index) => (
                                <Reveal
                                    as="li"
                                    key={`${item.title}-${item.period}`}
                                    delay={index * 0.06}
                                >
                                    <p className="font-mono text-xs tracking-wider text-muted">
                                        {item.period}
                                    </p>
                                    <h3 className="mt-2 font-display text-xl font-medium text-ink">
                                        {item.title}
                                    </h3>
                                    <p className={`mt-1 ${NOTE}`}>{item.host}</p>
                                    <p className={`mt-3 ${MEASURE} ${BODY}`}>{item.note}</p>
                                    {item.takeaways && (
                                        <ul className={`mt-4 ${MEASURE} space-y-3`}>
                                            {item.takeaways.map((line) => (
                                                <li key={line} className={`flex gap-3 ${BODY}`}>
                                                    <span className="mt-3.5 h-1 w-1 shrink-0 rounded-full bg-espresso" />
                                                    {line}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Reveal>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
}
