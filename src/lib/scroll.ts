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
 * `scroll-mt-*`(CSS scroll-margin)는 Lenis가 보지 않는다 — 여백은 `scrollToSection`이 준다.
 */

/**
 * 지정한 문서 위치로 즉시 옮긴다.
 *
 * `lenis.resize()`를 먼저 부르는 이유: 리사이즈 감지가 250ms 디바운스라, 조판이 방금 갈린
 * 직후에는 Lenis가 든 한계값이 **옛 문서 높이**다. 그 값으로 클램프되면 긴 페이지에서
 * 짧은 페이지로 갈 때 목표가 통째로 잘린다.
 */
export function scrollToOffset(top: number) {
    const lenis = getLenisInstance();
    if (lenis) {
        lenis.resize();
        lenis.scrollTo(top, { immediate: true, force: true });
        return;
    }
    window.scrollTo({ top, left: 0, behavior: "instant" as ScrollBehavior });
}

/**
 * 섹션 앞으로 옮긴다. 고정 Navbar에 가리지 않도록 여백을 함께 준다.
 *
 * `immediate`는 **라우트를 건너와 도착한** 해시 이동에 쓴다. 그때는 3D 무대의 카메라도 새
 * 자리로 날아가는 중인데, 스크롤이 1.3초에 걸쳐 흐르면 비행의 목표(매 프레임 지금 스크롤이
 * 가리키는 자리)가 히어로 → 비석 → 드럼 → 계단 → 갤러리로 계속 앞서 달아나 궤적이 엉킨다
 * (사용자 지적 — "목록 링크로 가면 부자연스럽다"). 뒤로가기가 자연스러운 것은 스크롤을 즉시
 * 복원해 목표가 처음부터 고정이기 때문이고, 이 인자가 링크를 같은 조건으로 맞춘다.
 * 같은 페이지 안의 이동(Navbar · 안내자)은 가릴 것이 없으므로 평소대로 부드럽게 간다.
 */
export function scrollToSection(id: string, immediate = false): boolean {
    const target = document.getElementById(id);
    if (!target) return false;

    const lenis = getLenisInstance();
    if (lenis) {
        // 리사이즈 감지가 250ms 디바운스라, 방금 바뀐 페이지에서는 한계값이 낡아 있다.
        lenis.resize();
        lenis.scrollTo(
            target,
            immediate
                ? { offset: NAV_OFFSET, immediate: true, force: true }
                : { offset: NAV_OFFSET },
        );
    } else {
        target.scrollIntoView({
            behavior: (immediate ? "instant" : "smooth") as ScrollBehavior,
            block: "start",
        });
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
