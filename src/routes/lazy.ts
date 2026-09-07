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
    pending ??= import("@/routes/ProjectDetail");
    return pending;
}

export const ProjectDetailRoute = lazy(() =>
    loadProjectDetail().then((module) => ({ default: module.ProjectDetail })),
);
