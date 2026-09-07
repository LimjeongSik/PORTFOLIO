import { useRef } from "react";

import { Tag } from "@/components/ui/Tag";

import { gsap, useGSAP } from "@/lib/gsap";

import type { Project } from "@/types/content";

interface ProjectSplashProps {
    project: Project;
}

const META_LABEL = "font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase";

/**
 * 앱이 켜지는 순간을 빌린 표지.
 *
 * 스플래시는 로고가 먼저 뜨고 그다음 앱이 열린다. 그 순서를 그대로 쓴다 — 빛이 켜지고,
 * 아이콘이 서고, 제목이 자리를 잡고, 정보가 뒤따른다. 스크롤이 아니라 **페이지가 열릴 때
 * 한 번만** 도는 시퀀스라, 아래로 내려간 뒤에는 남는 움직임이 없다.
 *
 * 어두운 지면 한가운데에 광원을 하나만 둔다. 이 프로젝트의 화면들이 전부 밝아서, 지면이
 * 어두울수록 화면이 스스로 빛나 보인다.
 */
export function ProjectSplash({ project }: ProjectSplashProps) {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.from(".splash-glow", { opacity: 0, scale: 0.82, duration: 1.4, ease: "power1.out" })
                .from(".splash-icon", { opacity: 0, scale: 0.86, duration: 0.75 }, 0.18)
                .from(".splash-title", { opacity: 0, y: 16, duration: 0.7 }, 0.42)
                .from(".splash-wordmark", { opacity: 0, duration: 0.6 }, 0.62)
                .from(".splash-rule", { scaleX: 0, duration: 0.9, ease: "power2.inOut" }, 0.7)
                .from(".splash-line", { opacity: 0, y: 12, stagger: 0.07, duration: 0.5 }, 0.8);

            // 표지를 지나가면 불이 꺼지듯 광원만 옅어진다.
            gsap.to(".splash-glow", {
                opacity: 0.25,
                yPercent: 10,
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
        <header ref={root} className="relative overflow-hidden px-6 pt-10 pb-16">
            {/* 광원 — 아이콘 자리에서 번진다 */}
            <div
                aria-hidden
                className="splash-glow pointer-events-none absolute top-0 left-1/2 h-[34rem] w-[46rem] max-w-none -translate-x-1/2"
                style={{
                    background:
                        "radial-gradient(50% 50% at 50% 32%, var(--color-espresso) 0%, transparent 70%)",
                    opacity: 0.16,
                }}
            />

            <div className="relative mx-auto max-w-4xl">
                <div className="flex flex-col items-center text-center">
                    {project.icon ? (
                        <img
                            src={project.icon}
                            alt=""
                            width={104}
                            height={104}
                            className="splash-icon h-24 w-24 rounded-[1.75rem] shadow-[0_24px_60px_-24px_var(--color-espresso)] sm:h-26 sm:w-26"
                        />
                    ) : null}

                    <h1 className="splash-title mt-7 font-sans text-[clamp(2.5rem,7vw,4.25rem)] leading-[1.02] font-bold tracking-[-0.035em] text-ink">
                        {project.title}
                    </h1>

                    <p className="splash-wordmark mt-3 font-mono text-[0.75rem] tracking-[0.3em] text-muted lowercase">
                        imug
                    </p>

                    <p className="splash-line mt-8 max-w-2xl text-base leading-[1.8] text-ink/85 sm:text-[1.0625rem]">
                        {project.summary}
                    </p>
                </div>

                <div className="splash-rule mt-14 h-px origin-center bg-line" />

                <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-[13rem_11rem_1fr]">
                    <div className="splash-line">
                        <dt className={META_LABEL}>Role</dt>
                        <dd className="mt-1.5 text-sm text-ink">{project.role}</dd>
                    </div>
                    <div className="splash-line">
                        <dt className={META_LABEL}>Period</dt>
                        <dd className="mt-1.5 text-sm text-ink tabular-nums">{project.period}</dd>
                    </div>
                    <div className="splash-line">
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
            </div>
        </header>
    );
}
