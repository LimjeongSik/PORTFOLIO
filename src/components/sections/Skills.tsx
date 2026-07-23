import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { skillGroups } from "@/data/skills";

export function Skills() {
    return (
        <section id="skills" className="scroll-mt-20 bg-surface/50 px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-6xl">
                <SectionHeading
                    index="02"
                    eyebrow="Skills"
                    title="기술 스택"
                    description="프로덕트를 만들며 손에 익힌 도구들입니다. 새로운 스택도 필요하면 빠르게 익혀 적용합니다."
                />

                <div className="mt-14 divide-y divide-line border-t border-line">
                    {skillGroups.map((group, index) => (
                        <Reveal key={group.label} delay={index * 0.05}>
                            <div className="grid gap-4 py-6 md:grid-cols-[200px_1fr] md:items-center">
                                <p className="font-mono text-sm tracking-wider text-espresso uppercase">
                                    {group.label}
                                </p>
                                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                                    {group.items.map((item) => (
                                        <li key={item} className="text-lg text-ink/90 sm:text-xl">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
