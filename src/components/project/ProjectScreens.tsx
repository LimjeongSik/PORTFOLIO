import { useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

import type { Project, ProjectScreen } from "@/types/content";

interface ProjectScreensProps {
    screens: ProjectScreen[];
    platform: Project["platform"];
}

const STEP_VH = 62;

export function ProjectScreens({ screens, platform }: ProjectScreensProps) {
    const root = useRef<HTMLDivElement>(null);
    const progressBar = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const wide = useMediaQuery("(min-width: 1024px)");
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
    const isMobile = platform === "mobile";
    const pinned = wide && !reduced && screens.length > 1;

    useGSAP(
        () => {
            if (!pinned) {
                setActive(0);
                return;
            }

            const end = `+=${screens.length * STEP_VH}%`;

            const trigger = ScrollTrigger.create({
                trigger: ".screens-stage",
                start: "top top",
                end,
                pin: true,
                onUpdate: (self) => {
                    const index = Math.min(
                        screens.length - 1,
                        Math.floor(self.progress * screens.length),
                    );
                    setActive(index);
                    gsap.set(progressBar.current, { scaleX: self.progress });
                },
            });

            const entrance = gsap.from(".screens-device", {
                opacity: 0,
                scale: 0.94,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: ".screens-stage", start: "top 65%" },
            });

            const drift = gsap.fromTo(
                ".screens-device",
                { y: 18 },
                {
                    y: -18,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".screens-stage",
                        start: "top top",
                        end,
                        scrub: true,
                    },
                },
            );

            return () => {
                trigger.kill();
                entrance.scrollTrigger?.kill();
                entrance.kill();
                drift.scrollTrigger?.kill();
                drift.kill();
            };
        },
        { scope: root, dependencies: [pinned, screens.length] },
    );

    if (screens.length === 0) {
        return null;
    }

    const frameShape = isMobile ? "aspect-[9/19.5] rounded-4xl" : "aspect-16/10 rounded-2xl";
    const frameChrome = "overflow-hidden border border-line bg-surface";

    return (
        <section ref={root} className="mt-20">
            {pinned ? (
                <div className="screens-stage grid-veil relative flex h-screen flex-col justify-center border-y border-line px-6">
                    <div className="absolute inset-x-0 top-24 px-6">
                        <div className="mx-auto flex max-w-5xl items-baseline justify-between">
                            <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                                Screens
                            </h2>
                            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted">
                                <span className="text-espresso">
                                    {String(active + 1).padStart(2, "0")}
                                </span>{" "}
                                / {String(screens.length).padStart(2, "0")}
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-16 xl:gap-24">
                        {/* 화면을 겹쳐 두고 활성 장만 드러낸다 — 자리 이동이 없어야 프레임이 고정돼 보인다. */}
                        <div
                            className={`screens-device relative shrink-0 ${frameChrome} ${frameShape} ${
                                isMobile ? "h-[min(68vh,580px)]" : "w-[min(38vw,520px)]"
                            }`}
                        >
                            {screens.map((screen, index) => (
                                <img
                                    key={screen.name}
                                    src={screen.src}
                                    alt=""
                                    loading={index === 0 ? "eager" : "lazy"}
                                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
                                        index === active
                                            ? "translate-y-0 opacity-100"
                                            : "translate-y-2 opacity-0"
                                    }`}
                                />
                            ))}
                        </div>

                        <ol className="flex w-76 shrink-0 flex-col gap-7">
                            {screens.map((screen, index) => {
                                const on = index === active;
                                return (
                                    <li key={screen.name} className="flex gap-4">
                                        <span
                                            aria-hidden
                                            className={`mt-2.5 h-px shrink-0 transition-all duration-500 ease-out ${
                                                on ? "w-10 bg-espresso" : "w-4 bg-line"
                                            }`}
                                        />
                                        <div
                                            className={`transition-opacity duration-500 ${
                                                on ? "opacity-100" : "opacity-40"
                                            }`}
                                        >
                                            <p className="font-display text-lg font-medium text-ink">
                                                {screen.name}
                                            </p>
                                            <p className="mt-1 text-sm leading-relaxed text-muted">
                                                {screen.note}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>

                    <div className="absolute inset-x-0 bottom-14 px-6">
                        <div className="mx-auto max-w-5xl">
                            <div className="h-px bg-line">
                                <div
                                    ref={progressBar}
                                    className="h-px origin-left scale-x-0 bg-espresso"
                                    aria-hidden
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid-veil border-y border-line px-6 py-16">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                            Screens
                        </h2>
                        <ul
                            className={
                                isMobile
                                    ? "mt-6 grid grid-cols-2 justify-items-start gap-x-5 gap-y-8 sm:grid-cols-3"
                                    : "mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2"
                            }
                        >
                            {screens.map((screen) => (
                                <li
                                    key={screen.name}
                                    className={isMobile ? "w-full max-w-43" : undefined}
                                >
                                    <figure>
                                        <div className={`${frameChrome} ${frameShape}`}>
                                            <img
                                                src={screen.src}
                                                alt=""
                                                loading="lazy"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <figcaption className="mt-3">
                                            <span className="font-display text-sm font-medium text-ink">
                                                {screen.name}
                                            </span>
                                            <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                                                {screen.note}
                                            </span>
                                        </figcaption>
                                    </figure>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </section>
    );
}
