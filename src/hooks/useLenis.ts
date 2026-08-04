import { useEffect } from "react";

import Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenisInstance } from "@/lib/lenis";

/**
 * Lenis 관성 스크롤을 초기화하고 GSAP ScrollTrigger와 동기화한다.
 * "동작 줄이기" 설정이 켜져 있으면 네이티브 스크롤을 그대로 사용한다.
 */
export function useLenis() {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        });

        setLenisInstance(lenis);
        lenis.on("scroll", ScrollTrigger.update);

        const update = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            setLenisInstance(null);
            lenis.destroy();
            gsap.ticker.remove(update);
        };
    }, []);
}
