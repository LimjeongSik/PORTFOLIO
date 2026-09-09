import { useEffect, useRef } from "react";

import { useReducedMotion } from "motion/react";

import { getLenisInstance } from "@/lib/lenis";

interface MarqueeProps {
    items: string[];
    /** 초당 이동 픽셀. 음수면 반대로 흐른다. */
    speed?: number;
    className?: string;
}

/**
 * 스크롤 속도를 함께 태우는 가로 흐름.
 *
 * 가만히 두면 천천히 흐르고, 스크롤을 굴리면 그 방향으로 확 밀린다 — 페이지의 관성이
 * 배경뿐 아니라 글자에도 걸려 있다는 걸 보여 주는 장치다. 목록을 두 벌 이어 붙이고
 * 한 벌 너비만큼 지나면 되감아 이음매가 보이지 않게 한다.
 */
export function Marquee({ items, speed = 34, className }: MarqueeProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const track = trackRef.current;
        if (!track || reduced) {
            return;
        }

        let offset = 0;
        let last = 0;
        let frame = 0;

        /* 한 벌의 너비는 **매 프레임 재지 않는다.** `scrollWidth`는 읽는 순간 레이아웃을
           강제로 다시 계산시키는 값이라, 이 줄 하나가 초당 60번의 리플로우였다 — 이 마퀴는
           기술 구간에 늘 떠 있으므로 페이지 수명 내내 그랬다. 폭이 실제로 달라질 때만
           다시 잰다(창 크기 · 폰트가 늦게 붙어 글자 폭이 바뀔 때). */
        let span = track.scrollWidth / 2;
        const remeasure = () => {
            span = track.scrollWidth / 2;
        };
        const observer = new ResizeObserver(remeasure);
        observer.observe(track);

        const tick = (time: number) => {
            const delta = last ? Math.min((time - last) / 1000, 0.05) : 0;
            last = time;

            const velocity = getLenisInstance()?.velocity ?? 0;
            offset += (speed + velocity * 6) * delta;

            // 한 벌 너비를 넘어가면 되감는다. 두 벌이 이어져 있어 눈에는 끊김이 없다.
            if (span > 0) {
                offset = ((offset % span) + span) % span;
            }
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;

            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [reduced, speed]);

    return (
        <div aria-hidden className={`overflow-hidden ${className ?? ""}`}>
            <div ref={trackRef} className="flex w-max will-change-transform">
                {[0, 1].map((copy) => (
                    <ul key={copy} className="flex shrink-0 items-center">
                        {items.map((item) => (
                            <li
                                key={`${copy}-${item}`}
                                className="flex items-center gap-6 pr-6 font-display text-2xl font-medium whitespace-nowrap text-muted/45 sm:text-3xl"
                            >
                                {item}
                                <span className="h-1 w-1 rounded-full bg-espresso/60" />
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
}
