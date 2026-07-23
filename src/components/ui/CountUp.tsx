import { useEffect, useRef } from "react";

import { animate, useInView, useReducedMotion } from "motion/react";

interface CountUpProps {
    to: number;
    suffix?: string;
    duration?: number;
    className?: string;
}

/**
 * 뷰포트 진입 시 0에서 목표 값까지 카운트업하는 숫자.
 * reduced-motion에서는 즉시 최종 값을 표시한다.
 */
export function CountUp({ to, suffix = "", duration = 1.6, className }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
    const reduced = useReducedMotion();

    useEffect(() => {
        const node = ref.current;
        if (!node || !inView) {
            return;
        }
        if (reduced) {
            node.textContent = `${to}${suffix}`;
            return;
        }
        const controls = animate(0, to, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate(value) {
                node.textContent = `${Math.round(value)}${suffix}`;
            },
        });
        return () => controls.stop();
    }, [inView, reduced, to, suffix, duration]);

    return (
        <span ref={ref} className={className}>
            0{suffix}
        </span>
    );
}
