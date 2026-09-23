import type { CSSProperties } from "react";
import type { Project } from "@/types/content";

export const PLATFORM_LABEL: Record<Project["platform"], string> = {
    mobile: "앱",
    web: "웹",
};

/**
 * 프로젝트의 색을 CSS 변수로 싣는다. 사이트에서 색을 가진 것은 프로젝트뿐이고,
 * 그 색은 이 변수를 읽는 곳(목록 줄의 hover · 상세 표지 띠)에서만 나온다.
 */
export function paint(project: Project) {
    return {
        "--p-paper": project.theme.paper,
        "--p-ink": project.theme.ink,
        "--p-muted": project.theme.muted,
        "--p-accent": project.theme.espresso,
    } as CSSProperties;
}
