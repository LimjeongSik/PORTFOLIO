import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

import type { Project } from "@/types/content";

interface ProjectHeroProps {
    project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
    const root = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.to(".cover-img", {
                yPercent: 12,
                ease: "none",
                scrollTrigger: {
                    trigger: ".cover-frame",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        },
        { scope: root },
    );

    return (
        <div ref={root} className="px-6 pt-28">
            <div className="mx-auto max-w-6xl">
                <p className="font-mono text-xs tracking-widest text-muted uppercase">
                    {project.year} · {project.role}
                </p>
                <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98] font-bold tracking-tight text-ink">
                    {project.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
                    {project.summary}
                </p>

                <div className="cover-frame mt-12 aspect-16/9 overflow-hidden rounded-3xl border border-line bg-surface">
                    <img
                        src={project.cover}
                        alt={project.title}
                        className="cover-img h-[112%] w-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
