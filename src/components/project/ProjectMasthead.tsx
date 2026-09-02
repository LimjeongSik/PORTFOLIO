import { useRef } from "react";

import { ProjectAperture } from "@/components/project/ProjectAperture";
import { Tag } from "@/components/ui/Tag";

import { gsap, useGSAP } from "@/lib/gsap";

import type { Project } from "@/types/content";

interface ProjectMastheadProps {
    project: Project;
}

const META_LABEL = "font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase";

/**
 * 주보 제호를 빌린 표지. 겹선 사이에 발행 정보를 두고, 제목은 빛이 들어오듯 왼쪽에서 열린다.
 * 스크롤에는 사라지지 않고 빛과 글이 서로 다른 속도로 밀린다(패럴랙스).
 */
export function ProjectMasthead({ project }: ProjectMastheadProps) {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.from(".masthead-aperture", { opacity: 0, duration: 1.6, ease: "power1.out" })
                .from(".masthead-band", { scaleX: 0, duration: 1, ease: "power2.inOut" }, 0.1)
                .from(".masthead-stamp", { opacity: 0, scale: 0.7, duration: 0.6 }, 0.5)
                .fromTo(
                    ".masthead-title",
                    { clipPath: "inset(0% 100% 0% 0%)" },
                    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power2.inOut" },
                    0.45,
                )
                // 제목이 열린 직후 밑줄이 액센트로 그어졌다가 지면의 선 색으로 가라앉는다.
                .from(".masthead-rule", { scaleX: 0, duration: 0.8, ease: "power2.inOut" }, 1.1)
                .fromTo(
                    ".masthead-rule",
                    { backgroundColor: "var(--color-espresso)" },
                    { backgroundColor: "var(--color-line)", duration: 0.9 },
                    1.5,
                )
                .from(
                    ".masthead-line",
                    { opacity: 0, y: 14, stagger: 0.08, duration: 0.55 },
                    "-=1.1",
                );

            // 빛과 글이 다른 속도로 밀린다 — 표지가 사라지는 대신 깊이가 생긴다.
            gsap.to(".masthead-aperture", {
                yPercent: 14,
                ease: "none",
                scrollTrigger: {
                    trigger: root.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
            gsap.to(".masthead-inner", {
                yPercent: -6,
                ease: "none",
                scrollTrigger: {
                    trigger: root.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        },
        { scope: root },
    );

    return (
        <header ref={root} className="relative overflow-hidden px-6 pt-6 pb-16">
            {/* 빛은 높은 창에서 들어온다 — 오른쪽 위가 가장 밝고 아래로 갈수록 지면에 녹는다. */}
            <div
                className="masthead-aperture pointer-events-none absolute inset-0"
                style={{
                    maskImage: "radial-gradient(120% 95% at 82% 0%, black 20%, transparent 78%)",
                    WebkitMaskImage:
                        "radial-gradient(120% 95% at 82% 0%, black 20%, transparent 78%)",
                }}
            >
                <ProjectAperture line={project.theme.line} accent={project.theme.espresso} />
            </div>

            <div className="masthead-inner relative mx-auto max-w-5xl">
                <div className="masthead-band h-px origin-left bg-line" />
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
                    <p className={META_LABEL}>Korea Baptist Convention</p>
                    <p className={META_LABEL}>{project.year} · 성도 전용 모바일 앱</p>
                </div>
                <div className="masthead-band h-0.5 origin-left bg-ink" />

                <div className="mt-10 flex flex-wrap items-center gap-5">
                    {project.icon ? (
                        <img
                            src={project.icon}
                            alt=""
                            width={64}
                            height={64}
                            className="masthead-stamp h-16 w-16 shrink-0 rounded-[1.25rem] border border-line shadow-[0_10px_30px_-18px_var(--color-ink)]"
                        />
                    ) : null}
                    <h1 className="masthead-title font-sans text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-ink">
                        {project.title}
                    </h1>
                </div>

                <div className="masthead-rule mt-8 h-px origin-left bg-line" />

                <p className="masthead-line mt-8 max-w-2xl text-base leading-[1.75] text-ink/85 sm:text-lg">
                    {project.summary}
                </p>

                <dl className="masthead-line mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-6 sm:grid-cols-[11rem_11rem_1fr]">
                    <div>
                        <dt className={META_LABEL}>Role</dt>
                        <dd className="mt-1.5 text-sm text-ink">{project.role}</dd>
                    </div>
                    <div>
                        <dt className={META_LABEL}>Period</dt>
                        <dd className="mt-1.5 text-sm text-ink tabular-nums">{project.period}</dd>
                    </div>
                    <div>
                        <dt className={META_LABEL}>Stack</dt>
                        <dd className="mt-2">
                            <ul className="flex flex-wrap gap-1.5">
                                {project.tech.map((tech) => (
                                    <li key={tech}>
                                        <Tag>{tech}</Tag>
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </div>
                </dl>

                <p className="masthead-line mt-14 flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                    <span aria-hidden className="h-px w-10 bg-line" />
                    아래로 읽기
                </p>
            </div>
        </header>
    );
}
