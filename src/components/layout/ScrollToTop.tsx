import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getLenisInstance } from "@/lib/lenis";

/**
 * 라우트 이동 시 스크롤 위치를 초기화한다.
 * 해시(`/#projects`)가 있으면 해당 섹션으로 스크롤한다.
 *
 * Lenis가 활성화된 경우 반드시 Lenis를 통해 이동해야 한다.
 * `window.scrollTo()`만 부르면 Lenis 내부 목표 위치가 이전 값으로 남아
 * 다음 프레임에 되돌아가고, 새 페이지가 더 짧으면 최하단으로 클램프된다.
 */
export function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // 새로고침·뒤로가기 시 브라우저가 스크롤을 복원하면 리셋과 충돌한다.
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: pathname은 라우트 변경 시 스크롤 리셋을 트리거하는 의도된 의존성
    useEffect(() => {
        const lenis = getLenisInstance();

        if (hash) {
            const id = hash.replace("#", "");
            const target = document.getElementById(id);
            if (target) {
                requestAnimationFrame(() => {
                    if (lenis) {
                        // Lenis의 리사이즈 감지는 250ms 디바운스라 이 시점의 스크롤 한계는
                        // 아직 이전 페이지 기준이다. 갱신하지 않으면 목표가 잘못 클램프된다.
                        lenis.resize();
                        lenis.scrollTo(target, { offset: 0 });
                    } else {
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                });
                return;
            }
        }

        if (lenis) {
            // 이전 페이지 높이 기준의 치수가 남아 있으면 목표 위치가 잘못 클램프된다.
            lenis.resize();
            lenis.scrollTo(0, { immediate: true, force: true });
            return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }, [pathname, hash]);

    return null;
}
