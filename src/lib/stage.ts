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

export function setStageHandle(next: StageHandle | null) {
    handle = next;
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
