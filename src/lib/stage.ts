import type { StageHandle } from "@/components/stage/rig";

/**
 * 무대로 가는 다리 — 모듈 싱글톤.
 *
 * 전환(`PageDissolve`)은 라우터 안에 있고 무대는 라우터 **바깥**에 있다. 게다가 무대는
 * three를 늦게 받는 `lazy` 청크라, 전환이 무대를 직접 참조할 수 없다. 실행기를 걸어 두는
 * `lib/transition`과 같은 방식으로, 무대가 자기 손잡이를 여기 걸어 두고 전환이 그것을 쓴다.
 *
 * 무대가 아직 없거나(청크 도착 전) WebGL을 못 얻은 환경에서는 전부 조용히 아무 일도 하지
 * 않는다 — 그 경우 전환은 본문이 잠겼다 떠오르는 것만으로 끝난다.
 */

let handle: StageHandle | null = null;

/**
 * 공간이 화면에 놓였는가.
 *
 * 페이지 전환의 어법은 **가리는 것이 아니라 자리를 비켜 주는 것**이다 — 배경은 계속 돌고
 * 글만 잠겼다 떠오른다. 첫 로드도 같아야 한다: 공간이 먼저 서고 그 위로 글이 떠오른다.
 * 순서를 뒤집어 무대를 다 지은 뒤에 인트로를 열었더니 그 전이 검은 화면이 됐고, 그 자리를
 * 덮는 로딩 화면을 두었더니 이번엔 "흐름이 끊긴다"고 했다(사용자 지적 둘 다). 덮을 것이
 * 아니라 **공간을 먼저 세우는 것**이 답이다.
 *
 * 그래서 이 신호는 손잡이가 생긴 순간이 아니라 **첫 프레임이 실제로 그려진 순간**이다
 * (`rig`의 `onReady`). 그때 화면에는 안개와 먼지가 이미 있고, 나머지 장소는 프레임마다
 * 하나씩 채워진다.
 */
let settled = false;
const waiting = new Set<() => void>();

/**
 * 무대를 기다려 주는 최대 시간(ms).
 *
 * WebGL을 못 얻었거나 회선이 느려 무대가 영영 안 오는 경우가 있다. 그때까지 첫 화면을
 * 붙잡아 두는 것이 끊기는 인트로보다 나쁘므로, 이만큼 지나면 기다리지 않는다.
 */
const GRACE = 700;

/**
 * 무대가 자리를 잡았을 때 — 또는 기다릴 만큼 기다렸을 때 — 부른다.
 *
 * 첫 화면의 고리를 걷는 일과 히어로 인트로를 여는 일은 **같은 순간**이어야 하므로, 그 순간을
 * 여기 한 곳에서 정한다. 각자 타이머를 들면 둘이 어긋나 고리가 걷힌 뒤 빈 화면이 잠깐 남는다.
 */
export function onStageReady(listener: () => void) {
    let done = false;
    let timer = 0;
    let stop: (() => void) | null = null;

    const fire = () => {
        if (done) {
            return;
        }
        done = true;
        window.clearTimeout(timer);
        stop?.();
        listener();
    };

    // 이미 자리를 잡았으면 여기서 곧바로 불린다(상세에서 홈으로 돌아오는 길).
    stop = onStageSettled(fire);
    if (!done) {
        timer = window.setTimeout(fire, GRACE);
    }

    return () => {
        done = true;
        window.clearTimeout(timer);
        stop?.();
    };
}

/** 무대가 자리를 잡으면(또는 이미 잡았으면) 부른다. 돌려주는 함수로 구독을 끊는다. */
export function onStageSettled(listener: () => void) {
    if (settled) {
        listener();
        return () => {};
    }
    waiting.add(listener);
    return () => {
        waiting.delete(listener);
    };
}

export function setStageHandle(next: StageHandle | null) {
    handle = next;
}

/** 무대가 첫 프레임을 그렸다. `rig`가 딱 한 번 부른다. */
export function markStageReady() {
    if (settled) {
        return;
    }
    settled = true;
    for (const listener of waiting) {
        listener();
    }
    waiting.clear();
}

/** 떠나는 순간의 카메라 자세를 굳힌다. 라우트가 갈리는 동안 스크롤을 따르지 않는다. */
export function holdStage() {
    handle?.hold();
}

/** 구간을 지금 당장 다시 잰다 — 새 DOM이 붙은 그 프레임에. */
export function remeasureStage() {
    handle?.remeasure();
}

/**
 * 새 DOM이 붙은 뒤 — 구간을 다시 재고, 굳혀 둔 자리에서 새 자리로 날아간다.
 * 시간을 주지 않으면 무대가 **거리에서 뽑는다**(몇 걸음이면 짧게, 방을 되돌아 나오면 길게).
 */
export function releaseStage(seconds?: number) {
    if (!handle) {
        return;
    }
    handle.remeasure();
    handle.release(seconds);
}

/** 무대가 살아 있는가 — 비행에 시간을 줄지 정하는 데 쓴다. */
export function hasStage() {
    return handle !== null;
}
