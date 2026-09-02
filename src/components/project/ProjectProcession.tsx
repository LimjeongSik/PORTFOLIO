import { useRef } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { gsap, useGSAP } from "@/lib/gsap";

import type { ProjectScreen } from "@/types/content";

interface ProjectProcessionProps {
    screens: ProjectScreen[];
}

/** 트랙 양끝 여백 — 첫 화면이 왼쪽 벽에 붙어 시작하지 않게 한다. */
const EDGE = 96;

/**
 * 성도가 앱을 지나는 순서대로 화면을 가로로 늘어놓고, 세로 스크롤로 그 줄을 옆으로 민다.
 * 항목마다 세로 이동량이 달라 앞뒤로 층이 진다.
 * 좁은 화면·reduced-motion에서는 핀을 걸지 않고 손으로 넘기는 가로 스크롤로 같은 줄을 준다.
 */
export function ProjectProcession({ screens }: ProjectProcessionProps) {
    const root = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLDivElement>(null);
    const rail = useRef<HTMLDivElement>(null);
    const wide = useMediaQuery("(min-width: 1024px)");
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
    const pinned = wide && !reduced && screens.length > 1;

    useGSAP(
        () => {
            const el = track.current;
            if (!pinned || !el) {
                return;
            }

            const distance = () => Math.max(1, el.scrollWidth - window.innerWidth + EDGE);

            const travel = gsap.to(el, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                    trigger: ".procession-stage",
                    start: "top top",
                    end: () => `+=${distance()}`,
                    pin: true,
                    scrub: true,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => gsap.set(rail.current, { scaleX: self.progress }),
                },
            });

            // 가로로 흐르는 트윈을 기준으로 삼으면 각 항목이 화면을 가로지르는 동안의
            // 진행률로 다시 트리거할 수 있다(containerAnimation).
            const depth = gsap.utils.toArray<HTMLElement>(".procession-item").map((item, index) => {
                const amount = index % 2 === 0 ? 30 : -18;
                return gsap.fromTo(
                    item,
                    { y: amount },
                    {
                        y: -amount,
                        ease: "none",
                        scrollTrigger: {
                            trigger: item,
                            containerAnimation: travel,
                            start: "left right",
                            end: "right left",
                            scrub: true,
                        },
                    },
                );
            });

            return () => {
                for (const tween of depth) {
                    tween.scrollTrigger?.kill();
                    tween.kill();
                }
                travel.scrollTrigger?.kill();
                travel.kill();
            };
        },
        { scope: root, dependencies: [pinned, screens.length] },
    );

    if (screens.length === 0) {
        return null;
    }

    const cards = screens.map((screen, index) => (
        <figure
            key={screen.name}
            className="procession-item group w-[clamp(11rem,25vh,14rem)] shrink-0 snap-center"
        >
            <div className="flex items-center gap-2.5">
                <span className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
            <div className="mt-4 aspect-[9/19.5] overflow-hidden rounded-4xl border border-line bg-surface transition-[transform,border-color] duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-espresso">
                <img
                    src={screen.src}
                    alt=""
                    loading={index < 3 ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                />
            </div>
            <figcaption className="mt-4">
                <span className="block font-sans text-base font-bold tracking-[-0.02em] text-ink">
                    {screen.name}
                </span>
                <span className="mt-1 block text-[0.8125rem] leading-relaxed text-muted">
                    {screen.note}
                </span>
            </figcaption>
        </figure>
    ));

    return (
        <section ref={root} className="mt-24">
            {pinned ? (
                <div className="procession-stage relative flex h-screen flex-col justify-center overflow-hidden border-y border-line">
                    <div className="absolute inset-x-0 top-24 px-6">
                        <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-6">
                            <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                                Screens
                            </h2>
                            <p className="text-[0.8125rem] text-muted">
                                앱을 처음 열고 출석을 찍기까지, 성도가 실제로 지나는 순서 그대로
                            </p>
                        </div>
                    </div>

                    <div
                        ref={track}
                        className="flex items-center gap-12 pr-24 pl-[8vw] will-change-transform"
                    >
                        {cards}
                    </div>

                    <div className="absolute inset-x-0 bottom-14 px-6">
                        <div className="mx-auto max-w-5xl">
                            <div className="h-px bg-line">
                                <div
                                    ref={rail}
                                    aria-hidden
                                    className="h-px origin-left scale-x-0 bg-espresso"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-y border-line py-14">
                    <div className="mx-auto max-w-4xl px-6">
                        <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                            Screens
                        </h2>
                        <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                            앱을 처음 열고 출석을 찍기까지, 성도가 실제로 지나는 순서 그대로. 옆으로
                            넘겨 보세요.
                        </p>
                    </div>
                    <div className="mt-8 flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-4">
                        {cards}
                    </div>
                </div>
            )}
        </section>
    );
}
