import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 라우트 이동 시 스크롤 위치를 초기화한다.
 * 해시(`/#projects`)가 있으면 해당 섹션으로 스크롤한다.
 */
export function ScrollToTop() {
    const { pathname, hash } = useLocation();

    // biome-ignore lint/correctness/useExhaustiveDependencies: pathname은 라우트 변경 시 스크롤 리셋을 트리거하는 의도된 의존성
    useEffect(() => {
        if (hash) {
            const id = hash.replace("#", "");
            const target = document.getElementById(id);
            if (target) {
                requestAnimationFrame(() => {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                });
                return;
            }
        }
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }, [pathname, hash]);

    return null;
}
