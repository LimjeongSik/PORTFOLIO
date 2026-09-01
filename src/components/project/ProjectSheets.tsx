import { Reveal } from "@/components/ui/Reveal";

import type { ProjectSheet } from "@/types/content";

interface ProjectSheetsProps {
    sheets: ProjectSheet[];
}

export function ProjectSheets({ sheets }: ProjectSheetsProps) {
    if (sheets.length === 0) {
        return null;
    }

    return (
        <section className="mt-20">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                Craft
            </h2>

            <div className="mt-6 flex flex-col gap-10">
                {sheets.map((sheet) => (
                    <Reveal key={sheet.title}>
                        <figure>
                            <img
                                src={sheet.src}
                                alt={sheet.title}
                                loading="lazy"
                                className="w-full rounded-2xl border border-line"
                            />
                            <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span className="font-display text-sm font-medium text-ink">
                                    {sheet.title}
                                </span>
                                <span className="text-sm leading-relaxed text-muted">
                                    {sheet.note}
                                </span>
                            </figcaption>
                        </figure>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
