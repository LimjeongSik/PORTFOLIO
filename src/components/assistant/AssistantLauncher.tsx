import { lazy, Suspense, useCallback, useId, useState } from "react";

const AssistantWidget = lazy(() =>
    import("@/components/assistant/AssistantWidget").then((module) => ({
        default: module.AssistantWidget,
    })),
);

/**
 * 첫 화면에 남는 유일한 조각 — 버튼 하나.
 *
 * `lazy`는 컴포넌트가 실제로 렌더될 때 import를 실행하므로, 패널을 무조건 그려 두면
 * 방문자가 열든 말든 첫 렌더 직후에 assistant 묶음(534KB)을 받아 온다. 그래서
 * **누르기 전까지는 마운트하지 않고**, 커서가 버튼에 닿는 순간 미리 받아 둔다.
 * 한 번 마운트한 뒤에는 닫아도 내리지 않는다 — 대화가 사라지기 때문이다.
 */
export function AssistantLauncher() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const panelId = useId();

    const close = useCallback(() => setOpen(false), []);

    const prefetch = () => {
        void import("@/components/assistant/AssistantWidget");
    };

    const toggle = () => {
        setMounted(true);
        setOpen((prev) => !prev);
    };

    return (
        <div className="fixed right-4 bottom-4 z-60 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
            {mounted ? (
                <Suspense fallback={null}>
                    <AssistantWidget panelId={panelId} open={open} onClose={close} />
                </Suspense>
            ) : null}

            <button
                type="button"
                onClick={toggle}
                onPointerEnter={prefetch}
                onFocus={prefetch}
                aria-expanded={open}
                aria-controls={mounted ? panelId : undefined}
                className="flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-paper shadow-[0_12px_32px_-14px_rgba(21,23,28,0.55)] transition-colors hover:bg-ink/85"
            >
                <span aria-hidden="true" className="relative flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-paper/70" />
                </span>
                <span className="text-sm font-bold">{open ? "닫기" : "물어보기"}</span>
            </button>
        </div>
    );
}
