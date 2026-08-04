import type Lenis from "lenis";

/**
 * Lenis는 자체 rAF 루프로 window 스크롤을 제어하므로,
 * `window.scrollTo()`를 직접 부르면 다음 프레임에 이전 위치로 되돌아간다.
 * 라우트 이동 등 앱 바깥에서 스크롤을 옮길 때 쓰도록 인스턴스를 공유한다.
 * ("동작 줄이기"가 켜져 네이티브 스크롤을 쓰는 경우 `null`이다.)
 */
let instance: Lenis | null = null;

export function setLenisInstance(next: Lenis | null) {
    instance = next;
}

export function getLenisInstance() {
    return instance;
}
