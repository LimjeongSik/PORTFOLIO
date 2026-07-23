import { motion } from "motion/react";

import type { ReactNode } from "react";

interface RevealProps {
    children: ReactNode;
    delay?: number;
    y?: number;
    className?: string;
    as?: "div" | "li" | "span";
}

/**
 * 뷰포트에 들어올 때 아래에서 위로 페이드인하는 래퍼.
 * reduced-motion에서는 motion이 자동으로 트랜지션을 축소한다.
 */
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: RevealProps) {
    const MotionTag = motion[as];

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </MotionTag>
    );
}
