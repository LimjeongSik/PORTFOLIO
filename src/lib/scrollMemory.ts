/**
 * 히스토리 항목마다의 스크롤 위치.
 *
 * 브라우저의 `scrollRestoration`은 SPA에서 쓸 수 없다 — 뒤로가기 시점에 새 라우트가 아직
 * 그려지지 않아 문서가 짧고, 복원값이 최하단으로 클램프된다. 그래서 수동으로 꺼 두고
 * (`ScrollToTop`), 대신 `location.key`에 묶어 여기에 적는다. 새로고침하면 비는 것이 맞다.
 *
 * **떠나는 순간부터 도착지의 스크롤이 정해질 때까지는 아무것도 적으면 안 된다.**
 * 그 사이의 `scrollY`는 전부 거짓말이기 때문이다. 두 가지가 값을 오염시킨다:
 *
 * - 라우트가 갈리면서 문서가 짧아지면 브라우저가 스크롤을 **그 자리에서 클램프**하고,
 *   뒤늦게 도착한 그 값이 기록을 덮는다.
 * - 도착한 항목의 기록이 **복원보다 먼저 돈다**. 뒤로가기로 홈에 닿는 순간 `ScrollToTop`의
 *   기록 effect가 라우트 effect보다 먼저 실행되는데, 그때 `scrollY`는 아직 떠나온 상세의
 *   것이다 — 되돌려야 할 5,000px이 그 값으로 덮인 뒤에 복원이 그것을 읽는다.
 *
 * 그래서 떠나기 직전에 `seal()`로 자리를 굳히면서 **기록 전체를 잠그고**, 도착지의 스크롤이
 * 정해진 뒤에야(`unseal()`) 다시 받는다. 전환 중에 새로 적어 둘 위치는 어차피 없다.
 */
const positions = new Map<string, number>();

/** 떠나는 중 — 정해질 때까지 들어오는 기록은 전부 거짓말이다. */
let locked = false;

export function remember(key: string) {
    if (locked) {
        return;
    }
    positions.set(key, window.scrollY);
}

export function recall(key: string) {
    return positions.get(key);
}

/** 떠나기 직전에 지금 자리를 굳히고 기록을 잠근다. */
export function seal(key: string) {
    positions.set(key, window.scrollY);
    locked = true;
}

/** 도착지의 스크롤이 정해졌다 — 다시 기록을 받는다. */
export function unseal() {
    locked = false;
}
