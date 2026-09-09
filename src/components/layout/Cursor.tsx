import { useEffect, useRef, useState } from "react";

/**
 * 포인터를 뒤따르는 고리.
 *
 * OS 커서를 감추지 않는다 — 감췄다가 스크립트가 어긋나면 사용자에게 커서가 아예 없어진다.
 * 이건 대체물이 아니라 한 겹 더 붙는 표시고, 늦게 따라오는 그 시차가 곧 무게감이다.
 * 누를 수 있는 것 위에 오면 커진다.
 *
 * `mix-blend-mode: difference`를 쓰기 때문에 지면색이 구간마다 바뀌어도(어두운 방 · 밝은 상세)
 * 늘 배경의 반대색으로 보인다. 색을 따로 관리하지 않아도 되고, 흰 지면에서 사라지지도 않는다.
 *
 * **블렌드는 고리 자신에게만 건다.** 예전에는 `fixed inset-0`으로 화면을 덮은 상자에 걸어
 * 두었는데, 그러면 고리가 1px 움직일 때마다 합성기가 **화면 전체**를 뒤의 WebGL 캔버스와
 * 다시 섞는다 — 마우스만 움직여도 프레임이 떨어지던 원인이다. 지금은 섞는 면적이 40px짜리
 * 고리 하나고, 보이는 결과는 똑같다.
 */
export function Cursor() {
    const ringRef = useRef<HTMLDivElement>(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // 터치 기기에는 따라갈 커서가 없고, 동작 줄이기에서는 지연 자체가 불필요한 움직임이다.
        const fine = window.matchMedia("(pointer: fine)").matches;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!fine || reduced) {
            return;
        }
        setEnabled(true);
    }, []);

    useEffect(() => {
        if (!enabled) {
            return;
        }
        const ring = ringRef.current;
        if (!ring) {
            return;
        }

        const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const trail = { ...pointer };
        let scale = 1;
        let target = 1;
        let visible = false;
        let frame = 0;

        const onMove = (event: PointerEvent) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            if (!visible) {
                visible = true;
                trail.x = pointer.x;
                trail.y = pointer.y;
                ring.style.opacity = "1";
            }
        };

        const onOver = (event: PointerEvent) => {
            const node = event.target as HTMLElement | null;
            target = node?.closest("a, button, [data-cursor]") ? 2.1 : 1;
        };

        const onLeave = () => {
            visible = false;
            ring.style.opacity = "0";
        };

        const tick = () => {
            trail.x += (pointer.x - trail.x) * 0.16;
            trail.y += (pointer.y - trail.y) * 0.16;
            scale += (target - scale) * 0.12;

            ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;

            frame = requestAnimationFrame(tick);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerover", onOver, { passive: true });
        document.addEventListener("pointerleave", onLeave);
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerover", onOver);
            document.removeEventListener("pointerleave", onLeave);
        };
    }, [enabled]);

    if (!enabled) {
        return null;
    }

    return (
        <div
            ref={ringRef}
            aria-hidden
            className="pointer-events-none fixed top-0 left-0 z-80 h-10 w-10 rounded-full border border-white/70 opacity-0 mix-blend-difference transition-opacity duration-300 will-change-transform"
        />
    );
}
