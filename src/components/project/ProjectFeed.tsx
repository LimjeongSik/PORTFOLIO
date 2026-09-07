import { useRef } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { gsap, useGSAP } from "@/lib/gsap";

import type { ProjectScreen } from "@/types/content";

interface ProjectFeedProps {
    screens: ProjectScreen[];
}

/** 화면 한 장이 지나가는 데 쓰는 스크롤 길이(vh). */
const PER_SCREEN = 62;

/**
 * 화면을 세로로 넘긴다.
 *
 * 이 앱의 쇼츠가 세로 스와이프라, 전시도 옆으로 늘어놓지 않고 한 자리에서 위로 밀어 올린다.
 * 스크롤이 곧 스와이프고, 프레임은 제자리에 서 있는다.
 *
 * 프레임(기기 테두리)은 컨테이너가 들고 이미지만 그 안에서 미끄러진다. `PhoneShot`은 테두리를
 * 이미지 자신에게 주기 때문에 여기서는 쓸 수 없다 — 테두리가 이미지와 함께 올라가 버린다.
 *
 * 스크럽으로 매 프레임 바뀌는 값은 state로 들지 않고 DOM에 직접 쓴다.
 */
export function ProjectFeed({ screens }: ProjectFeedProps) {
    const root = useRef<HTMLElement>(null);
    const shots = useRef<(HTMLImageElement | null)[]>([]);
    const name = useRef<HTMLParagraphElement>(null);
    const note = useRef<HTMLParagraphElement>(null);
    const counter = useRef<HTMLSpanElement>(null);
    const ticks = useRef<(HTMLSpanElement | null)[]>([]);

    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
    const sliding = !reduced && screens.length > 1;

    useGSAP(
        () => {
            if (!sliding) {
                return;
            }

            const last = screens.length - 1;
            let painted = -1;

            const paint = (progress: number) => {
                const pos = progress * last;

                shots.current.forEach((shot, index) => {
                    if (!shot) {
                        return;
                    }
                    const offset = index - pos;
                    // 위아래로 한 장 넘게 떨어진 것은 그리지 않는다.
                    if (Math.abs(offset) > 1.05) {
                        shot.style.opacity = "0";
                        shot.style.visibility = "hidden";
                        return;
                    }
                    shot.style.visibility = "visible";
                    shot.style.transform = `translateY(${offset * 100}%)`;
                    shot.style.opacity = String(1 - Math.min(1, Math.abs(offset)) * 0.55);
                });

                const current = Math.round(pos);
                if (current === painted) {
                    return;
                }
                painted = current;

                const screen = screens[current];
                if (name.current) {
                    name.current.textContent = screen.name;
                }
                if (note.current) {
                    note.current.textContent = screen.note;
                }
                if (counter.current) {
                    counter.current.textContent = String(current + 1).padStart(2, "0");
                }
                ticks.current.forEach((tick, index) => {
                    if (tick) {
                        tick.dataset.on = index <= current ? "true" : "false";
                    }
                });
            };

            paint(0);

            const tween = gsap.to(
                {},
                {
                    scrollTrigger: {
                        trigger: root.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: true,
                        onUpdate: (self) => paint(self.progress),
                    },
                },
            );

            return () => {
                tween.scrollTrigger?.kill();
                tween.kill();
            };
        },
        { scope: root, dependencies: [sliding, screens] },
    );

    if (screens.length === 0) {
        return null;
    }

    if (!sliding) {
        return (
            <section className="mt-28 px-6">
                <div className="mx-auto max-w-4xl">
                    <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                        Screens
                    </h2>
                    <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
                        {screens.map((screen) => (
                            <li key={screen.name}>
                                <img
                                    src={screen.src}
                                    alt={`${screen.name} 화면`}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full rounded-2xl border border-line"
                                />
                                <p className="mt-3 font-sans text-sm font-bold text-ink">
                                    {screen.name}
                                </p>
                                <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
                                    {screen.note}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={root}
            className="mt-28"
            style={{ height: `${screens.length * PER_SCREEN}vh` }}
        >
            <div className="sticky top-0 flex h-screen items-center px-6">
                {/* 다른 구간보다 좁게 잡는다. 기기 한 대와 한 줄짜리 설명뿐이라, 본문 폭을 그대로
                    쓰면 오른쪽이 통째로 빈다. */}
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 sm:flex-row sm:gap-14">
                    {/* 제자리에 선 프레임 — 안에서 화면만 미끄러진다.
                        폭이 아니라 높이로 잡는다. 한 화면을 통째로 쓰는 구간이라 기기가 뷰포트
                        높이를 따라가야 위아래가 비지 않는다. */}
                    <div
                        className="relative h-[46vh] max-h-[36rem] shrink-0 overflow-hidden border-[5px] border-[#0b0f19] bg-[#0b0f19] ring-1 ring-white/15 sm:h-[64vh]"
                        style={{ aspectRatio: "780 / 1688", borderRadius: "14% / 6.5%" }}
                    >
                        {screens.map((screen, index) => (
                            <img
                                key={screen.name}
                                ref={(node) => {
                                    shots.current[index] = node;
                                }}
                                src={screen.src}
                                alt={`${screen.name} 화면`}
                                loading={index < 2 ? "eager" : "lazy"}
                                decoding="async"
                                className="absolute inset-0 h-full w-full object-cover will-change-transform"
                            />
                        ))}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                            Screens
                        </h2>
                        <p
                            ref={name}
                            className="mt-4 font-sans text-2xl leading-tight font-bold tracking-[-0.03em] text-ink sm:text-3xl"
                        >
                            {screens[0].name}
                        </p>
                        <p
                            ref={note}
                            className="mt-3 max-w-md text-[0.9375rem] leading-[1.8] text-muted"
                        >
                            {screens[0].note}
                        </p>

                        <div className="mt-8 flex items-center gap-4">
                            <span className="font-mono text-sm tabular-nums text-ink">
                                <span ref={counter}>01</span>
                                <span className="text-muted"> / {screens.length}</span>
                            </span>
                            <span aria-hidden className="flex flex-1 gap-1">
                                {screens.map((screen, index) => (
                                    <span
                                        key={screen.name}
                                        ref={(node) => {
                                            ticks.current[index] = node;
                                        }}
                                        data-on={index === 0 ? "true" : "false"}
                                        className="h-px flex-1 bg-line transition-colors duration-300 data-[on=true]:bg-espresso"
                                    />
                                ))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
