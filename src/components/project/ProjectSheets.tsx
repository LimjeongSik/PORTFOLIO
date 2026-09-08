import { Reveal } from "@/components/ui/Reveal";

import { LABEL, NOTE, SHOWCASE, TITLE } from "./typography";

import type { ProjectSheet } from "@/types/content";

interface ProjectSheetsProps {
    sheets: ProjectSheet[];
}

/** 설계 시트 — 화면 밖에서 정해 둔 것들. */
export function ProjectSheets({ sheets }: ProjectSheetsProps) {
    if (sheets.length === 0) {
        return null;
    }

    return (
        <section className="relative py-24 sm:py-32">
            <div className={SHOWCASE}>
                <header className="max-w-[34rem]">
                    <h2 className={LABEL}>Craft</h2>
                    <p className={`mt-5 ${TITLE}`}>화면을 그리기 전에 정해 둔 것</p>
                </header>

                <div className="mt-14 flex flex-col gap-16">
                    {sheets.map((sheet) => (
                        <Reveal key={sheet.title}>
                            <figure>
                                <img
                                    src={sheet.src}
                                    alt={sheet.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full rounded-2xl border border-line"
                                />
                                <figcaption className="mt-5 max-w-[38rem]">
                                    <span className="font-display text-base leading-[1.5] font-medium text-ink">
                                        {sheet.title}
                                    </span>
                                    <span className={`mt-2 block ${NOTE}`}>{sheet.note}</span>
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
