/**
 * 툴은 React 트리 밖(모델이 호출하는 순간)에서 실행되므로 `useNavigate`를 직접 쓸 수 없다.
 * 위젯이 마운트되면서 navigate를 여기에 걸어두고, 툴은 이 다리를 건너 라우터를 움직인다.
 */
import { startPageTransition } from "@/lib/transition";

type Navigate = (to: string) => void;

let navigateRef: Navigate | null = null;

export function setAssistantNavigate(next: Navigate | null) {
    navigateRef = next;
}

/** 라우터가 아직 없으면(마운트 전) 전체 새로고침으로라도 도착시킨다. */
export function assistantNavigate(to: string) {
    // 커튼이 살아 있으면 라우팅까지 커튼이 맡는다 — 안내자가 옮긴 화면도 링크와 같게 넘어간다.
    if (startPageTransition(to)) {
        return;
    }
    if (navigateRef) {
        navigateRef(to);
        return;
    }
    window.location.assign(to);
}

export function isHomePath() {
    return window.location.pathname === "/";
}

/** 카드에서 상세로 건너뛸 때 패널을 접는다(모바일에서는 패널이 화면을 덮는다). */
let closeRef: (() => void) | null = null;

export function setAssistantClose(next: (() => void) | null) {
    closeRef = next;
}

export function closeAssistant() {
    closeRef?.();
}
