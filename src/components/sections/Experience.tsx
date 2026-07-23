import { useRef } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { experiences } from "@/data/experience";
import { gsap, useGSAP } from "@/lib/gsap";

export function Experience() {
    const root = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
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
        },
        { scope: root },
    );

    return (
        <section id="experience" className="scroll-mt-20 px-6 py-24 sm:py-32">
            <div ref={root} className="mx-auto max-w-6xl">
                <SectionHeading
                    index="03"
                    eyebrow="Experience"
                    title="경력"
                    description="지금까지 함께한 팀과 그곳에서 남긴 결과입니다."
                />

                <div className="timeline-track relative mt-16 pl-8 sm:pl-12">
                    <div className="absolute top-2 bottom-2 left-[3px] w-px bg-line sm:left-[7px]" />
                    <div className="timeline-progress absolute top-2 bottom-2 left-[3px] w-px origin-top bg-espresso sm:left-[7px]" />

                    <div className="space-y-16">
                        {experiences.map((exp) => (
                            <Reveal key={`${exp.company}-${exp.period}`}>
                                <article className="relative">
                                    <span className="absolute top-1.5 -left-8 h-2 w-2 rounded-full bg-espresso ring-4 ring-paper sm:-left-12 sm:h-3.5 sm:w-3.5" />
                                    <p className="font-mono text-xs tracking-wider text-muted">
                                        {exp.period}
                                    </p>
                                    <h3 className="mt-2 font-display text-2xl font-medium text-ink sm:text-3xl">
                                        {exp.position}
                                    </h3>
                                    <p className="mt-1 text-base text-espresso">{exp.company}</p>
                                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                                        {exp.summary}
                                    </p>
                                    <ul className="mt-5 max-w-2xl space-y-2">
                                        {exp.achievements.map((item) => (
                                            <li
                                                key={item}
                                                className="flex gap-3 text-base leading-relaxed text-ink/90"
                                            >
                                                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-espresso" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
                                        {exp.stack.map((tech) => (
                                            <li key={tech} className="font-mono text-xs text-muted">
                                                {tech}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
