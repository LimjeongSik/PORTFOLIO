import { useRef } from "react";

import { useReducedMotion } from "motion/react";

import { gsap, useGSAP } from "@/lib/gsap";

interface BridgeProps {
    words: string[];
}

/**
 * 히어로와 본문 사이를 잇는 띠.
 *
 * 시간이 아니라 **스크롤이 민다** — 손을 떼면 글자도 멈춘다. 첫 화면에서 읽는 구간으로
 * 넘어갈 때 그 사이가 뚝 끊기지 않도록, 스크롤에 직접 반응하는 것 하나를 걸쳐 둔 것이다.
 */
export function Bridge({ words }: BridgeProps) {
    const root = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    useGSAP(
        () => {
            if (reduced) {
                return;
            }

            gsap.fromTo(
                ".bridge-track",
                { xPercent: 4 },
                {
                    xPercent: -34,
                    ease: "none",
                    scrollTrigger: {
                        trigger: root.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.5,
                    },
                },
            );

            gsap.fromTo(
                ".bridge-rule",
                { scaleX: 0 },
                {
                    scaleX: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: root.current,
                        start: "top 92%",
                        end: "bottom 60%",
                        scrub: true,
                    },
                },
            );
        },
        { scope: root, dependencies: [reduced] },
    );

    return (
        <div ref={root} className="relative overflow-hidden py-14 sm:py-20">
            <span className="bridge-rule mx-6 block h-px origin-left bg-line" />

            <div
                aria-hidden
                className="bridge-track mt-10 flex w-max items-center gap-10 will-change-transform"
            >
                {[0, 1].map((copy) =>
                    words.map((word) => (
                        <span
                            key={`${copy}-${word}`}
                            className="flex items-center gap-10 font-display text-[clamp(2rem,6vw,4.5rem)] leading-none font-bold tracking-tight whitespace-nowrap text-ink/12"
                        >
                            {word}
                            <span className="h-2 w-2 shrink-0 rounded-full bg-espresso/70" />
                        </span>
                    )),
                )}
            </div>
        </div>
    );
}
