import { useEffect, useRef } from "react";

import { ProjectAmbient } from "@/components/project/ProjectAmbient";
import { Tag } from "@/components/ui/Tag";

import { gsap, useGSAP } from "@/lib/gsap";

import type { Project } from "@/types/content";

const PLATFORM_LABEL: Record<Project["platform"], string> = {
    mobile: "모바일 앱",
    web: "웹",
};

interface ProjectHeroProps {
    project: Project;
}

/** 굴릴 때 쓰는 글자 — 관제 단말의 잡음처럼 보이도록 라틴 대문자와 기호만. */
const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}#*+=-";
/** 글자 하나가 확정되기까지의 간격(ms) */
const SETTLE_MS = 46;

export function ProjectHero({ project }: ProjectHeroProps) {
    const root = useRef<HTMLDivElement>(null);
    const title = useRef<HTMLSpanElement>(null);

    // 제목이 잡히는 연출. React 상태로 돌리면 프레임마다 리렌더가 나므로 DOM에 직접 쓴다.
    useEffect(() => {
        const node = title.current;
        if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const text = project.title;
        let frame = 0;
        let start = 0;

        const tick = (time: number) => {
            if (start === 0) {
                start = time;
            }
            const settled = (time - start) / SETTLE_MS;
            let next = "";
            let done = true;

            for (let i = 0; i < text.length; i += 1) {
                if (settled > i + 4) {
                    next += text[i];
                } else if (settled > i) {
                    next += NOISE[Math.floor(Math.random() * NOISE.length)];
                    done = false;
                } else {
                    // 확정 전 폭이 흔들리지 않도록 자리는 비워 두되 크기는 유지한다.
                    next += "\u00a0";
                    done = false;
                }
            }

            node.textContent = next;
            if (!done) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(frame);
            node.textContent = text;
        };
    }, [project.title]);

    useGSAP(
        () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
            tl.from(".hero-field", { opacity: 0, duration: 1.4, ease: "power2.out" })
                .from(".hero-icon", { scale: 0.72, opacity: 0, duration: 0.55 }, "-=1.1")
                .from(".hero-eyebrow", { opacity: 0, x: -12, duration: 0.5 }, "-=0.3")
                .from(".hero-title", { opacity: 0, duration: 0.3 }, "-=0.25")
                .from(".hero-summary", { opacity: 0, y: 18, duration: 0.6 }, "-=0.35")
                .from(".hero-rule", { scaleX: 0, duration: 0.9, ease: "power2.inOut" }, "-=0.6")
                .from(
                    ".hero-meta > *",
                    { opacity: 0, y: 16, stagger: 0.09, duration: 0.5 },
                    "-=0.6",
                )
                .from(".hero-scroll", { opacity: 0, duration: 0.5 }, "-=0.2");

            gsap.to(".hero-inner", {
                yPercent: -10,
                opacity: 0.4,
                ease: "none",
                scrollTrigger: {
                    trigger: root.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
            gsap.to(".hero-field", {
                opacity: 0,
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
        <header ref={root} className="relative overflow-hidden px-6 pt-8 pb-14">
            {/* 필드는 표지 뒤에만 산다 — 아래쪽은 마스크로 지면에 녹인다. */}
            <div
                className="hero-field pointer-events-none absolute inset-0"
                style={{
                    maskImage: "linear-gradient(to bottom, black 45%, transparent 92%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 45%, transparent 92%)",
                }}
            >
                <ProjectAmbient line={project.theme.line} accent={project.theme.espresso} />
            </div>

            <div className="hero-inner relative mx-auto max-w-4xl">
                <div className="flex items-center gap-4">
                    {project.icon ? (
                        <img
                            src={project.icon}
                            alt=""
                            width={56}
                            height={56}
                            className="hero-icon h-14 w-14 shrink-0 rounded-[1.0625rem] border border-line"
                        />
                    ) : null}
                    <p className="hero-eyebrow font-mono text-xs tracking-[0.18em] text-muted uppercase">
                        {project.year} · {PLATFORM_LABEL[project.platform]}
                    </p>
                </div>

                {/* 제목은 관제 단말처럼 잡힌다 — 글자가 굴러가다 앞에서부터 확정된다.
                    읽는 쪽에는 완성된 제목만 전하도록 aria-label을 h1이 든다. */}
                <h1 className="mt-5" aria-label={project.title}>
                    <span
                        ref={title}
                        aria-hidden
                        className="hero-title block font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.06] font-bold tracking-tight text-ink"
                    >
                        {project.title}
                    </span>
                </h1>
                <p className="hero-summary mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                    {project.summary}
                </p>

                <div className="hero-rule mt-9 h-px origin-left bg-line" />

                <dl className="hero-meta mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-[10rem_10rem_1fr]">
                    <div>
                        <dt className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                            Role
                        </dt>
                        <dd className="mt-1.5 text-sm text-ink">{project.role}</dd>
                    </div>
                    <div>
                        <dt className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                            Period
                        </dt>
                        <dd className="mt-1.5 text-sm text-ink">{project.period}</dd>
                    </div>
                    <div>
                        <dt className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                            Stack
                        </dt>
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

                <p className="hero-scroll mt-14 flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                    <span aria-hidden className="h-px w-10 bg-line" />
                    아래로 읽기
                </p>
            </div>
        </header>
    );
}
