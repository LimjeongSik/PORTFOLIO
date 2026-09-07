import { lazy } from "react";

/**
 * 상세 페이지 청크.
 *
 * `lazy`는 **컴포넌트가 렌더될 때** import를 실행하므로, 전환 커튼이 걷힌 뒤에야 청크가
 * 도착한다 — 빈 화면이 한 번 스치는 이유가 그것이다. 팩토리를 밖으로 꺼내 두면 커튼이
 * 닫히는 동안 미리 받아 둘 수 있고, `lazy`는 같은 프로미스를 그대로 받는다.
 */
let pending: Promise<typeof import("@/routes/ProjectDetail")> | null = null;

export function loadProjectDetail() {
    // 캐시에서 **성공만** 붙잡아 둔다. 실패한 프로미스를 그대로 들고 있으면 다음 시도가
    // 망을 다시 타지 않고 같은 실패를 즉시 돌려받아, 회선이 돌아와도 영영 못 받는다.
    pending ??= import("@/routes/ProjectDetail").catch((error) => {
        pending = null;
        throw error;
    });
    return pending;
}

/**
 * 한 번 실패한 `lazy`는 되살아나지 않는다 — 그래서 상수가 아니라 공장이다.
 *
 * React는 팩토리를 딱 한 번만 부르고, 그 프로미스가 거부되면 결과를 `Rejected`로 굳혀
 * 이후 렌더마다 같은 에러를 다시 던진다. 위의 프로미스 캐시를 비워 두어도 이 캐시는
 * 남으므로, 다시 받으려면 **새 `lazy`를 만들어 갈아 끼우는** 수밖에 없다.
 * 그 일은 `RouteBoundary`가 실패를 받아 낸 자리에서 한다.
 */
export function createProjectDetailRoute() {
    return lazy(() => loadProjectDetail().then((module) => ({ default: module.ProjectDetail })));
}
