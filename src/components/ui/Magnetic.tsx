import { useRef } from "react";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import type { PointerEvent, ReactNode } from "react";

interface MagneticProps {
    children: ReactNode;
    /** 끌려가는 거리(px). 버튼이 클수록 조금만 움직여야 자연스럽다. */
    strength?: number;
    className?: string;
}

/**
 * 커서가 가까이 오면 요소가 그쪽으로 끌려간다.
 *
 * 포인터의 절대 좌표가 아니라 **요소 중심에서 벗어난 비율**을 쓰기 때문에, 버튼 크기가
 * 달라도 같은 정도로 반응한다. 스프링을 한 겹 끼워 손을 떼면 제자리로 돌아온다.
 */
export function Magnetic({ children, strength = 14, className }: MagneticProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const reduced = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const smoothX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
    const smoothY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });

    const onPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
        if (reduced) {
            return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(((event.clientX - rect.left) / rect.width - 0.5) * strength * 2);
        y.set(((event.clientY - rect.top) / rect.height - 0.5) * strength * 2);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.span
            ref={ref}
            onPointerMove={onPointerMove}
            onPointerLeave={reset}
            style={reduced ? undefined : { x: smoothX, y: smoothY }}
            className={`inline-block ${className ?? ""}`}
        >
            {children}
        </motion.span>
    );
}
