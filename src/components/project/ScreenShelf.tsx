import { useCallback, useEffect, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { CONTAINER } from "@/lib/typography";
import { hostOf } from "@/lib/url";

import type { Project } from "@/types/content";

/** 컨테이너 왼쪽 선에 첫 화면을 맞춘다(`CONTAINER`의 max-w-6xl · px-8과 같은 셈). */
const GUTTER = "max(1.25rem, calc((100% - 72rem) / 2 + 2rem))";

/** 넘길 수 있는 방향과 진행률(0~1). 버튼 잠금과 아래 막대가 이 값을 읽는다. */
interface ShelfState {
    prev: boolean;
    next: boolean;
    progress: number;
}

/**
 * 화면 목록. 가로로 넘기는 선반이고, 넘기기는 Embla가 맡는다 — 터치 스와이프와 마우스 끌기가
 * 같은 손맛으로 스냅되고, 트랙패드 가로 밀기는 휠 제스처 플러그인이 받는다. 이전·다음 버튼과
 * 키보드 ←/→도 같은 스냅을 따른다. 화면이 두 벌(라이트 · 다크)이면 토글이 서고, 같은 자리에서
 * 두 벌이 겹쳐 바뀐다.
 */
export function ScreenShelf({ project }: { project: Project }) {
    const { screens, screenModes } = project;
    const [alt, setAlt] = useState(false);
    const [state, setState] = useState<ShelfState>({ prev: false, next: false, progress: 0 });
    const still = useMediaQuery("(prefers-reduced-motion: reduce)");
    const [viewport, embla] = useEmblaCarousel(
        {
            align: "start",
            containScroll: "trimSnaps",
            inViewThreshold: 0.9,
            skipSnaps: true,
            duration: still ? 0 : 25,
        },
        [WheelGesturesPlugin()],
    );

    const paired = Boolean(screenModes) && screens.every((screen) => screen.srcAlt);
    const web = project.platform === "web";
    const host = hostOf(project.links.demo);

    useEffect(() => {
        if (!embla) {
            return;
        }
        const sync = () =>
            setState({
                prev: embla.canScrollPrev(),
                next: embla.canScrollNext(),
                progress: Math.min(1, Math.max(0, embla.scrollProgress())),
            });
        // 끌기 · 휠을 놓은 뒤의 스냅은 `duration` 옵션을 따르지 않는다. 동작 줄이기에서는 고른 자리로 바로 옮긴다.
        const settle = () => {
            if (still) {
                embla.scrollTo(embla.selectedScrollSnap(), true);
            }
        };
        sync();
        embla.on("select", sync).on("reInit", sync).on("scroll", sync).on("pointerUp", settle);
        return () => {
            embla
                .off("select", sync)
                .off("reInit", sync)
                .off("scroll", sync)
                .off("pointerUp", settle);
        };
    }, [embla, still]);

    // 끌기는 한 장 단위로 멈추고, 버튼 · 키보드는 다 보이는 장 수만큼 넘긴다(한 장씩이면 열 장을 열 번 눌러야 한다).
    // 동작 줄이기에서는 버튼 · 키보드 이동도 미끄러지지 않고 바로 간다.
    const step = useCallback(
        (direction: 1 | -1) => {
            if (!embla) {
                return;
            }
            const snaps = embla.scrollSnapList().length;
            const page = Math.max(1, embla.slidesInView().length);
            const target = Math.min(
                snaps - 1,
                Math.max(0, embla.selectedScrollSnap() + direction * page),
            );
            embla.scrollTo(target, still);
        },
        [embla, still],
    );

    if (screens.length === 0) {
        return <div className="h-16" />;
    }

    return (
        <section aria-label="화면" className="pt-16 pb-14 sm:pt-20 sm:pb-16">
            <div className={`${CONTAINER} flex flex-wrap items-end justify-between gap-4`}>
                {paired && screenModes ? (
                    <div className="flex max-w-xl flex-col gap-3">
                        <fieldset className="flex gap-1.5">
                            <legend className="sr-only">화면 테마</legend>
                            {screenModes.labels.map((label, index) => {
                                const on = alt === (index === 1);
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        aria-pressed={on}
                                        onClick={() => setAlt(index === 1)}
                                        className={`rounded-full border px-4 py-1.5 text-[0.875rem] transition-colors ${
                                            on
                                                ? "border-(--p-ink) bg-(--p-ink) text-(--p-paper)"
                                                : "border-current/25 hover:border-current/60"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </fieldset>
                        <p className="text-[0.875rem] leading-[1.7] text-(--p-muted)">
                            {screenModes.note}
                        </p>
                    </div>
                ) : (
                    <span />
                )}
                <div className="flex gap-1.5">
                    <button
                        type="button"
                        onClick={() => step(-1)}
                        disabled={!state.prev}
                        aria-label="이전 화면"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-current/25 transition-colors hover:border-current/60 disabled:pointer-events-none disabled:opacity-30"
                    >
                        <Chevron flip />
                    </button>
                    <button
                        type="button"
                        onClick={() => step(1)}
                        disabled={!state.next}
                        aria-label="다음 화면"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-current/25 transition-colors hover:border-current/60 disabled:pointer-events-none disabled:opacity-30"
                    >
                        <Chevron />
                    </button>
                </div>
            </div>

            {/* 패딩 안쪽까지는 잘리지 않아서, 첫 화면은 컨테이너 선에 맞고 넘긴 화면은 화면 끝까지 보인다. */}
            <section
                ref={viewport}
                // biome-ignore lint/a11y/noNoninteractiveTabindex: 선반은 키보드 ←/→로도 넘길 수 있어야 한다
                tabIndex={0}
                aria-roledescription="carousel"
                aria-label={`${project.title} 화면 ${screens.length}장`}
                onKeyDown={(event) => {
                    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                        event.preventDefault();
                        step(event.key === "ArrowLeft" ? -1 : 1);
                    }
                }}
                className="mt-8 cursor-grab overflow-hidden outline-none active:cursor-grabbing"
                style={{ paddingInline: GUTTER }}
            >
                <ul className="flex touch-pan-y gap-5 sm:gap-7">
                    {screens.map((screen) => (
                        <li
                            key={screen.name}
                            className={`min-w-0 shrink-0 ${web ? "w-[min(40rem,84vw)]" : "w-[min(15rem,62vw)]"}`}
                        >
                            <figure>
                                <div
                                    className={`relative overflow-hidden bg-black/10 ring-1 ring-current/10 ${
                                        web
                                            ? "aspect-16/10 rounded-xl"
                                            : "aspect-9/19.5 rounded-[1.75rem]"
                                    }`}
                                >
                                    <img
                                        src={screen.src}
                                        alt={screen.name}
                                        loading="lazy"
                                        draggable={false}
                                        className="absolute inset-0 h-full w-full object-cover object-top"
                                    />
                                    {paired && screen.srcAlt ? (
                                        <img
                                            src={screen.srcAlt}
                                            alt=""
                                            aria-hidden={!alt}
                                            loading="lazy"
                                            draggable={false}
                                            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ${
                                                alt ? "opacity-100" : "opacity-0"
                                            }`}
                                        />
                                    ) : null}
                                </div>
                                <figcaption className="mt-4 pr-2">
                                    <p className="text-[0.9375rem] font-bold">{screen.name}</p>
                                    {host && screen.path ? (
                                        <p className="mt-0.5 font-mono text-[0.75rem] text-(--p-muted)">
                                            {host}
                                            {screen.path}
                                        </p>
                                    ) : null}
                                    <p className="mt-1 text-[0.875rem] leading-[1.7] text-(--p-muted)">
                                        {screen.note}
                                    </p>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </section>

            {/* 지금 어디쯤인지. 끌거나 넘기는 동안 따라 움직인다. */}
            <div className={`${CONTAINER} mt-8`} aria-hidden="true">
                <div className="h-0.5 overflow-hidden rounded-full bg-current/10">
                    <div
                        className="h-full origin-left rounded-full bg-current/50"
                        style={{ transform: `scaleX(${Math.max(0.08, state.progress)})` }}
                    />
                </div>
            </div>
        </section>
    );
}

function Chevron({ flip = false }: { flip?: boolean }) {
    return (
        <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className={`h-3.5 w-3.5 ${flip ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
        >
            <path d="m6 3 5 5-5 5" />
        </svg>
    );
}
