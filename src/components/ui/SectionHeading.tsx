import { motion } from "motion/react";

import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
    index: string;
    eyebrow: string;
    title: string;
    description?: string;
}

export function SectionHeading({ index, eyebrow, title, description }: SectionHeadingProps) {
    return (
        <div className="max-w-2xl">
            <Reveal>
                <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-muted uppercase">
                    <span className="text-espresso">{index}</span>
                    <motion.span
                        className="h-px w-8 origin-left bg-line"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <span>{eyebrow}</span>
                </div>
            </Reveal>
            <Reveal delay={0.06}>
                <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
                    {title}
                </h2>
            </Reveal>
            {description ? (
                <Reveal delay={0.12}>
                    <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                        {description}
                    </p>
                </Reveal>
            ) : null}
        </div>
    );
}
