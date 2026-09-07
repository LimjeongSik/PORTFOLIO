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
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
            /* 트랙패드를 옆으로 쓸어도 같은 타임라인이 밀린다. 홈의 무대는 스크롤 하나가
               카메라를 몰기 때문에, 입력이 세로든 가로든 출력은 하나여야 갈라지지 않는다. */
            gestureOrientation: "both",
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
