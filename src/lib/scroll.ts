import { getLenisInstance } from "@/lib/lenis";

/** 고정 Navbar(h-16) 아래로 섹션이 들어오도록 띄우는 여백. */
const NAV_OFFSET = -80;

/**
 * 프로그래매틱 스크롤의 정본.
 *
 * Lenis가 window 스크롤을 소유하므로 `window.scrollTo()` 직접 호출은 다음 프레임에
 * 되돌려진다. 반대로 Lenis는 "동작 줄이기"가 켜져 있거나 아직 마운트되기 전이면
 * `null`이므로, 두 경로를 늘 함께 둔다.
 *
 * `scroll-mt-*`(CSS scroll-margin)는 Lenis가 보지 않는다 — 여백은 여기서 준다.
 */
export function scrollToSection(id: string): boolean {
    const target = document.getElementById(id);
    if (!target) return false;

    const lenis = getLenisInstance();
    if (lenis) {
        // 리사이즈 감지가 250ms 디바운스라, 방금 바뀐 페이지에서는 한계값이 낡아 있다.
        lenis.resize();
        lenis.scrollTo(target, { offset: NAV_OFFSET });
    } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return true;
}

export function scrollToTop(immediate = false) {
    const lenis = getLenisInstance();
    if (lenis) {
        lenis.resize();
        lenis.scrollTo(0, immediate ? { immediate: true, force: true } : {});
        return;
    }
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: (immediate ? "instant" : "smooth") as ScrollBehavior,
    });
}
