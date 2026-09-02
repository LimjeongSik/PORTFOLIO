import { useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { gsap, useGSAP } from "@/lib/gsap";

import type { ProjectAnatomy as Anatomy } from "@/types/content";

interface ProjectAnatomyProps {
    anatomy: Anatomy;
}

/** 주석 한 편이 머무는 구간(vh). 글을 다 읽을 만큼은 길어야 한다. */
const STEP_VH = 78;

/**
 * 홈 화면 하나를 세로로 이어 붙인 스크롤샷이 고정된 프레임 안에서 스스로 흐르고,
 * 지나는 구간마다 설계 근거가 바뀐다. 화면을 보여주는 게 아니라 화면을 읽는 구간.
 */
export function ProjectAnatomy({ anatomy }: ProjectAnatomyProps) {
    const root = useRef<HTMLDivElement>(null);
    const stage = useRef<HTMLDivElement>(null);
    const frame = useRef<HTMLDivElement>(null);
    const shot = useRef<HTMLImageElement>(null);
    const [active, setActive] = useState(0);
    const wide = useMediaQuery("(min-width: 1024px)");
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
    const running = wide && !reduced;

    useGSAP(
        () => {
            if (!running) {
                setActive(0);
                return;
            }

            const container = root.current;
            const sticky = stage.current;
            const window_ = frame.current;
            const image = shot.current;
            if (!container || !sticky || !window_ || !image) {
                return;
            }

            const travel = () => Math.max(0, image.offsetHeight - window_.clientHeight);

            const tween = gsap.to(image, {
                y: () => -travel(),
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top top+=96",
                    // 스티키가 풀리는 지점까지가 흐르는 구간이다.
                    end: () => `+=${Math.max(1, container.offsetHeight - sticky.offsetHeight)}`,
                    scrub: 0.4,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        let index = 0;
                        for (let i = 0; i < anatomy.notes.length; i += 1) {
                            if (self.progress >= anatomy.notes[i].at) {
                                index = i;
                            }
                        }
                        setActive(index);
                    },
                },
            });

            return () => {
                tween.scrollTrigger?.kill();
                tween.kill();
            };
        },
        { scope: root, dependencies: [running, anatomy.notes.length] },
    );

    const heading = (
        <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                Anatomy
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-2xl leading-snug font-bold tracking-[-0.03em] text-ink sm:text-3xl">
                {anatomy.title}
            </p>
            <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
                {anatomy.lede}
            </p>
        </div>
    );

    const notes = anatomy.notes.map((note, index) => {
        const on = index === active;
        return (
            <li key={note.title} className="flex gap-5">
                <span
                    aria-hidden
                    className={`mt-3 h-px shrink-0 transition-all duration-500 ease-out ${
                        on ? "w-12 bg-espresso" : "w-5 bg-line"
                    }`}
                />
                <div
                    className={`transition-opacity duration-500 ${on ? "opacity-100" : "opacity-35"}`}
                >
                    <h3 className="font-sans text-lg leading-snug font-bold tracking-[-0.02em] text-ink">
                        {note.title}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink/80">{note.body}</p>
                </div>
            </li>
        );
    });

    if (!running) {
        return (
            <section className="mt-24">
                {heading}
                <div className="mx-auto mt-10 max-w-5xl px-6">
                    <figure className="mx-auto w-full max-w-64">
                        <div className="overflow-hidden rounded-4xl border border-line bg-surface">
                            <img
                                src={anatomy.src}
                                alt={anatomy.title}
                                loading="lazy"
                                style={{ aspectRatio: `1 / ${anatomy.ratio}` }}
                                className="w-full"
                            />
                        </div>
                        <figcaption className="mt-3 text-center font-mono text-[0.6875rem] tracking-[0.14em] text-muted tabular-nums">
                            {anatomy.footnote}
                        </figcaption>
                    </figure>
                    <ol className="mt-10 flex flex-col gap-8">{notes}</ol>
                </div>
            </section>
        );
    }

    return (
        <section className="mt-24">
            {heading}
            <div
                ref={root}
                className="mx-auto max-w-5xl px-6"
                style={{ height: `${anatomy.notes.length * STEP_VH}vh` }}
            >
                <div ref={stage} className="sticky top-24 flex items-start gap-12 xl:gap-16">
                    <figure className="w-[clamp(13rem,28vh,16.25rem)] shrink-0">
                        <div
                            ref={frame}
                            className="aspect-[9/19.5] w-full overflow-hidden rounded-4xl border border-line bg-surface"
                        >
                            {/* 프레임 폭을 정확히 채우고 세로로만 흐른다 — 가로로 밀면 상태바가 잘린다. */}
                            <img
                                ref={shot}
                                src={anatomy.src}
                                alt={anatomy.title}
                                loading="lazy"
                                style={{ aspectRatio: `1 / ${anatomy.ratio}` }}
                                className="w-full will-change-transform"
                            />
                        </div>
                        <figcaption className="mt-4 font-mono text-[0.6875rem] leading-relaxed tracking-[0.14em] text-muted tabular-nums">
                            {anatomy.footnote}
                        </figcaption>
                    </figure>

                    <ol className="flex flex-col gap-8 pt-1">{notes}</ol>
                </div>
            </div>
        </section>
    );
}
