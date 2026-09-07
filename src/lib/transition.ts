/**
 * 라우트 전환의 다리.
 *
 * 커튼은 React 트리 안(`PageTransition`)에 있지만, 전환을 시작하는 쪽은 트리 밖일 수도 있다 —
 * 안내자 툴은 모델이 부르는 순간 실행된다. Lenis·무드와 같은 방식으로 모듈 싱글톤에 실행기를
 * 걸어 두고, 링크든 툴이든 이 함수 하나로 들어온다.
 *
 * 커튼이 없을 때(동작 줄이기 · 마운트 전)는 `false`를 돌려 부르는 쪽이 평소 경로로 가게 한다.
 */
type Runner = (to: string) => void;

let runner: Runner | null = null;

export function setTransitionRunner(next: Runner | null) {
    runner = next;
}

export function startPageTransition(to: string): boolean {
    if (!runner) {
        return false;
    }

    const url = new URL(to, window.location.href);
    // 같은 페이지 안의 이동(해시로 섹션 건너뛰기)은 가릴 것이 없다 — 스크롤이 알아서 한다.
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname) {
        return false;
    }

    runner(`${url.pathname}${url.search}${url.hash}`);
    return true;
}
