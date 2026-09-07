import { useRef } from "react";

import { useReducedMotion } from "motion/react";

import { Marquee } from "@/components/ui/Marquee";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { skillGroups } from "@/data/skills";
import { gsap, useGSAP } from "@/lib/gsap";

/** 마퀴에 흘려보낼 전체 목록 — 데이터가 곧 장식이다. */
const allSkills = skillGroups.flatMap((group) => group.items);

export function Skills() {
    const root = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();

    useGSAP(
        () => {
            if (reduced) {
                return;
            }

            // 행이 좌우 번갈아 밀려 들어온다. 목록이 길어도 같은 방향으로만 오면 지루하다.
            for (const row of gsap.utils.toArray<HTMLElement>(".skill-row")) {
                const fromLeft = row.dataset.side === "left";
                gsap.from(row, {
                    opacity: 0,
                    x: fromLeft ? -70 : 70,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: { trigger: row, start: "top 88%" },
                });
                gsap.from(row.querySelectorAll(".skill-item"), {
                    opacity: 0,
                    y: 14,
                    duration: 0.5,
                    stagger: 0.04,
                    ease: "power2.out",
                    scrollTrigger: { trigger: row, start: "top 86%" },
                });
            }

            // 행을 가로지르는 선이 스크롤에 맞춰 그어진다.
            gsap.from(".skill-rule", {
                scaleX: 0,
                ease: "none",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: ".skill-list",
                    start: "top 80%",
                    end: "bottom 70%",
                    scrub: true,
                },
            });
        },
        { scope: root, dependencies: [reduced] },
    );

    return (
        <section ref={root} id="skills" className="scroll-mt-20 py-20 sm:py-24">
            <div className="px-6">
                <div className="mx-auto max-w-6xl">
                    <SectionHeading
                        index="02"
                        eyebrow="Skills"
                        title="기술 스택"
                        description="프로덕트를 만들며 손에 익힌 도구들입니다. 새로운 스택도 필요하면 빠르게 익혀 적용합니다."
                    />
                </div>
            </div>

            {/* 스크롤을 굴리면 같이 밀리는 한 줄. 페이지의 관성이 글자에도 걸려 있다. */}
            <Marquee items={allSkills} className="mt-12 border-y border-line py-5" />

            <div className="mt-14 px-6">
                <div className="skill-list mx-auto max-w-6xl">
                    {skillGroups.map((group, index) => (
                        <div key={group.label}>
                            <span className="skill-rule block h-px w-full origin-left bg-line" />
                            <div
                                className="skill-row grid gap-4 py-6 md:grid-cols-[200px_1fr] md:items-center"
                                data-side={index % 2 === 0 ? "left" : "right"}
                            >
                                <p className="font-mono text-sm tracking-wider text-espresso uppercase">
                                    {group.label}
                                </p>
                                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                                    {group.items.map((item) => (
                                        <li
                                            key={item}
                                            className="skill-item cursor-default text-lg text-ink/85 transition-colors duration-300 hover:text-espresso sm:text-xl"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                    <span className="skill-rule block h-px w-full origin-left bg-line" />
                </div>
            </div>
        </section>
    );
}
