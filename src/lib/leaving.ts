/**
 * 떠나기 직전에 할 일들 — 브라우저 뒤로/앞으로 가기.
 *
 * **리스너를 모듈 최상위에서 등록하는 이유가 전부다.** `popstate`는 등록 순서대로 실행되는데,
 * 라우터는 자기 리스너를 effect에서 건다. 우리도 컴포넌트에서 걸면 라우터보다 뒤에 서고,
 * 그 사이 라우터는 **동기 렌더까지 끝낸다**(popstate는 discrete 이벤트다). 그러면 우리가
 * 불릴 때는 이미 도착한 화면이다 — 떠나온 자리의 스크롤도, 떠나온 지면의 색도 사라진 뒤다.
 *
 * 이 모듈은 `App`이 import하므로 첫 `render()`보다 먼저 평가된다. 라우터의 리스너는 그
 * render의 effect에서 걸리니, 여기서 등록한 쪽이 언제나 앞선다.
 */
type Handler = () => void;

const handlers = new Set<Handler>();

if (typeof window !== "undefined") {
    window.addEventListener("popstate", () => {
        for (const handler of handlers) {
            handler();
        }
    });
}

/** 떠나는 순간을 구독한다. 핸들러 안에서는 아직 떠나온 화면의 상태를 읽을 수 있다. */
export function onLeaving(handler: Handler) {
    handlers.add(handler);
    return () => {
        handlers.delete(handler);
    };
}
