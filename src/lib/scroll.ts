/**
 * 프로그래매틱 스크롤. 부드러운 이동은 CSS(`html { scroll-behavior: smooth }`)가 맡고,
 * 동작 줄이기에서는 같은 CSS가 즉시 이동으로 바꾼다. 고정 헤더만큼의 여백은
 * `scroll-padding-top`이 준다.
 */
export function scrollToSection(id: string) {
    const target = document.getElementById(id);
    if (!target) {
        return false;
    }
    target.scrollIntoView({ block: "start" });
    return true;
}

export function scrollToTop() {
    window.scrollTo({ top: 0 });
}
