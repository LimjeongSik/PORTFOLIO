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

/**
 * 지금 라우트가 넘어가는 중인가.
 *
 * 지면색을 즉시 갈아 끼울지 트윈할지가 여기서 갈린다. 처음 열린 페이지에서는 즉시여야
 * 한다 — 어두운 기본값에서 밝은 테마로 0.7초 동안 물드는 것은 전환이 아니라 **덜 그려진
 * 화면**으로 보인다. 반대로 넘어가는 중이라면 트윈이어야 한다: 캔버스가 계속 보이는 채로
 * 카메라가 날아가는데 지면색만 툭 바뀌면 그 한 프레임이 통째로 눈에 띈다.
 */
let crossing = false;

export function setCrossing(next: boolean) {
    crossing = next;
}

export function isCrossing() {
    return crossing;
}
