import { useRef, useState } from "react";

import { CONTAINER } from "@/lib/typography";
import { hostOf } from "@/lib/url";

import type { Project } from "@/types/content";

/** 컨테이너 왼쪽 선에 첫 화면을 맞춘다(`CONTAINER`의 max-w-6xl · px-8과 같은 셈). */
const GUTTER = "max(1.25rem, calc((100% - 72rem) / 2 + 2rem))";

/**
 * 화면 목록. 가로로 넘기는 선반이고, 넘기는 것은 브라우저의 스크롤 그대로다.
 * 트랙패드·터치는 바로 밀면 되고, 마우스만 쓰는 사람을 위해 이전·다음 버튼을 둔다.
 * 화면이 두 벌(라이트 · 다크)이면 토글이 서고, 같은 자리에서 두 벌이 겹쳐 바뀐다.
 */
export function ScreenShelf({ project }: { project: Project }) {
    const { screens, screenModes } = project;
    const shelf = useRef<HTMLUListElement>(null);
    const [alt, setAlt] = useState(false);

    const paired = Boolean(screenModes) && screens.every((screen) => screen.srcAlt);
    const web = project.platform === "web";
    const host = hostOf(project.links.demo);

    const step = (direction: 1 | -1) => {
        const box = shelf.current;
        if (box) {
            box.scrollBy({ left: direction * box.clientWidth * 0.8 });
        }
    };

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
                        aria-label="이전 화면"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-current/25 transition-colors hover:border-current/60"
                    >
                        <Chevron flip />
                    </button>
                    <button
                        type="button"
                        onClick={() => step(1)}
                        aria-label="다음 화면"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-current/25 transition-colors hover:border-current/60"
                    >
                        <Chevron />
                    </button>
                </div>
            </div>

            <ul
                ref={shelf}
                // biome-ignore lint/a11y/noNoninteractiveTabindex: 가로 스크롤 영역은 키보드로도 넘길 수 있어야 한다
                tabIndex={0}
                aria-label={`${project.title} 화면 ${screens.length}장`}
                className="shelf mt-8 flex snap-x snap-proximity gap-5 overflow-x-auto pb-4 outline-none sm:gap-7"
                style={{ paddingInline: GUTTER, scrollPaddingInline: GUTTER }}
            >
                {screens.map((screen) => (
                    <li
                        key={screen.name}
                        className={`shrink-0 snap-start ${web ? "w-[min(40rem,84vw)]" : "w-[min(15rem,62vw)]"}`}
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
                                    className="absolute inset-0 h-full w-full object-cover object-top"
                                />
                                {paired && screen.srcAlt ? (
                                    <img
                                        src={screen.srcAlt}
                                        alt=""
                                        aria-hidden={!alt}
                                        loading="lazy"
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
