/**
 * 스크롤 계산이 쓰는 화면 높이 — **조판과 같은 자**.
 *
 * 모바일에서 `window.innerHeight`는 주소창이 여닫힐 때마다 오간다. 그런데 이 지면의 세로
 * 길이는 전부 `svh`(주소창이 열려 있는, 가장 작은 뷰포트)로 적혀 있어서 주소창이 접혀도
 * 조판은 1px도 움직이지 않는다. 재는 쪽만 `innerHeight`를 보면 굴리는 중에 기준이 갈리고,
 * 구간의 스크롤 폭(`rect.height - viewport`)과 닻 기준선이 통째로 밀려 **같은 스크롤 위치가
 * 다른 자리를 가리킨다** — 손도 안 댔는데 배경이 홱 움직인다(사용자 지적).
 *
 * 그래서 `100svh`를 실제로 재는 보이지 않는 자를 문서에 하나 두고, 세로가 필요할 때 그것에
 * 묻는다. `svh`는 정의상 주소창이 여닫혀도 값이 변하지 않고, 화면 회전이나 창 크기 변경에는
 * 제대로 따라온다. 스크롤 폭의 뜻으로도 이쪽이 옳다 — 구간 안에서 붙어 서는 상자가 `svh`다.
 *
 * 소프트 키보드가 올라올 때도 같은 이유로 흔들리지 않는다.
 */

let ruler: HTMLDivElement | null = null;

function rulerHeight(): number {
    if (!ruler?.isConnected) {
        if (!document.body) {
            return 0;
        }
        ruler = document.createElement("div");
        ruler.setAttribute("aria-hidden", "true");
        // 폭 0 · 고정 위치 — 조판에도 문서 높이에도 영향을 주지 않는다.
        ruler.style.cssText =
            "position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none;";
        document.body.appendChild(ruler);
    }
    return ruler.clientHeight;
}

/** 조판이 쓰는 화면 높이(px). `svh`를 모르는 브라우저에서는 창 높이로 떨어진다. */
export function viewportHeight(): number {
    return rulerHeight() || window.innerHeight;
}

/**
 * 조판 기준 화면 크기가 **실제로** 달라졌을 때만 참을 돌려주는 검사기.
 *
 * `resize`는 주소창이 여닫히기만 해도 온다. 그 이벤트에 조판을 다시 재거나 스크롤을 옮기면
 * 굴릴 때마다 화면이 잡아채인다 — 걸러내는 자리를 한 군데로 모은다.
 */
export function viewportWatcher(): () => boolean {
    let width = window.innerWidth;
    let height = viewportHeight();
    return () => {
        const nextWidth = window.innerWidth;
        const nextHeight = viewportHeight();
        if (nextWidth === width && nextHeight === height) {
            return false;
        }
        width = nextWidth;
        height = nextHeight;
        return true;
    };
}
