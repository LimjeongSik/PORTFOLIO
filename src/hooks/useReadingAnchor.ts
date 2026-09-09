import { useEffect } from "react";

import { ScrollTrigger } from "@/lib/gsap";
import { scrollToOffset } from "@/lib/scroll";
import { viewportWatcher } from "@/lib/viewport";

/**
 * 창 크기가 바뀌어도 **보고 있던 것**을 놓치지 않는다.
 *
 * 상세 지면의 조판은 `lg` 경계에서 통째로 갈린다 — 화면 전시는 붙어 선 기기 하나와 지나가는
 * 설명에서 세로로 흐르는 목록이 되고, 해부 구간은 400vh에 가까운 pin 여백을 통째로
 * 잃는다. 그런데 브라우저가 지키려는 것은 **픽셀 위치**라, 문서가 그만큼 짧아지면 읽던
 * 자리를 잃고 엉뚱한 데(또는 최하단)에 떨어진다.
 *
 * 그래서 픽셀이 아니라 **랜드마크와 그 안에서의 자리(0~1)** 를 들고 있다가, 조판이 갈린
 * 뒤에 같은 자리로 되돌린다. 랜드마크는 이미 무대가 쓰고 있는 표식을 그대로 빌린다 —
 * 구간(`data-stage-zone`)과 그 안의 닻(`data-stage-anchor`). 지금 읽는 화면·사례가 곧
 * 닻이므로, 되돌리면 **같은 화면·같은 사례**가 다시 화면 한가운데에 온다.
 *
 * 홈은 이 훅을 쓰지 않는다. 거기서는 무대 ↔ 목록이 갈릴 때 "몇 번째 프로젝트"를 보존하는
 * 장치가 이미 있고(`Projects`의 `locate`/`scrollFor`), 둘이 같은 스크롤을 두고 다투면
 * 어느 쪽도 제 자리를 못 잡는다.
 */

/** 구간보다 닻이 먼저다 — 지금 읽는 것에 더 가깝다. 둘 다 여기서 찾는다. */
const LANDMARKS = "[data-stage-anchor],[data-stage-zone]";

/** 리사이즈가 멎었다고 보는 시간(ms). 조판이 실제로 갈린 뒤에 재야 한다. */
const SETTLE_MS = 180;

/** 스크롤이 멎었다고 보고 자리를 잡는 시간(ms). */
const PICK_IDLE_MS = 90;

function clamp01(value: number) {
    return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** 화면 한가운데에서 이 상자까지의 거리. 안에 있으면 0. */
function distanceToCenter(rect: DOMRect, center: number) {
    if (center < rect.top) {
        return rect.top - center;
    }
    if (center > rect.bottom) {
        return center - rect.bottom;
    }
    return 0;
}

interface Place {
    node: HTMLElement;
    ratio: number;
}

export function useReadingAnchor(active = true) {
    useEffect(() => {
        if (!active) {
            return;
        }

        /** 지금 읽고 있는 것과, 그것이 사라졌을 때 대신 쓸 구간. */
        let place: Place | null = null;
        let fallback: Place | null = null;
        /**
         * 세로만 달라진 것을 받아 줄지는 **그것이 조판을 움직였는지가 가른다.**
         *
         * 상세는 `200svh`·`180svh`와 화면 높이에 묶인 붙임으로 짜여 있어, 창을 세로로 끌면
         * 문서 위치가 실제로 달라진다 — 그때는 자리를 다시 맞춰야 한다. 하지만 모바일에서
         * 세로가 바뀌는 것은 대개 **스크롤에 따라 여닫히는 주소창**이고, 그때 `svh`로 적힌
         * 조판은 꿈쩍도 않는다. 거기에 반응하면 굴릴 때마다 스크롤을 잡아채고
         * `ScrollTrigger.refresh()`까지 돌아 화면이 버벅인다(사용자 지적).
         *
         * 그래서 조판이 쓰는 자(`100svh`)로 재고, 그 값이 달라졌을 때만 받는다(`lib/viewport`).
         */
        const viewportChanged = viewportWatcher();
        /** 조판이 갈리는 동안에는 재지 않는다 — 그 순간의 값은 이미 어긋난 값이다. */
        let frozen = false;
        let queued = 0;
        let settle = 0;
        let idle = 0;

        const measure = (node: HTMLElement): Place => {
            const rect = node.getBoundingClientRect();
            const center = window.innerHeight / 2;
            return { node, ratio: clamp01((center - rect.top) / Math.max(1, rect.height)) };
        };

        const pick = () => {
            queued = 0;
            if (frozen) {
                return;
            }
            const center = window.innerHeight / 2;
            let best: HTMLElement | null = null;
            let bestDistance = Number.POSITIVE_INFINITY;
            let bestHeight = Number.POSITIVE_INFINITY;
            let bestZone: HTMLElement | null = null;

            for (const node of document.querySelectorAll<HTMLElement>(LANDMARKS)) {
                const rect = node.getBoundingClientRect();
                if (rect.height <= 0) {
                    continue;
                }
                const distance = distanceToCenter(rect, center);
                // 화면 한가운데가 구간과 닻 양쪽 안에 있으면(둘 다 0) 작은 쪽을 고른다.
                if (
                    distance < bestDistance ||
                    (distance === bestDistance && rect.height < bestHeight)
                ) {
                    best = node;
                    bestDistance = distance;
                    bestHeight = rect.height;
                }
                if (distance === 0 && node.hasAttribute("data-stage-zone")) {
                    bestZone = node;
                }
            }

            place = best ? measure(best) : null;
            fallback = bestZone ? measure(bestZone) : null;
        };

        const restore = () => {
            settle = 0;
            /* 조판이 갈리며 통째로 다시 그려진 자리(해부 구간의 좁은 화면 갈래 같은)는
               노드가 문서에서 떨어져 나간다 — 그럴 때는 그것을 품고 있던 구간으로 돌아간다. */
            const target = place?.node.isConnected
                ? place
                : fallback?.node.isConnected
                  ? fallback
                  : null;
            if (!target) {
                frozen = false;
                return;
            }
            const rect = target.node.getBoundingClientRect();
            const top = Math.max(
                0,
                window.scrollY + rect.top + target.ratio * rect.height - window.innerHeight / 2,
            );
            scrollToOffset(top);
            requestAnimationFrame(() => {
                // 지연 이미지로 높이가 한 박자 늦게 확정되면 방금 목표가 클램프된 채 굳는다.
                if (Math.abs(window.scrollY - top) > 2) {
                    scrollToOffset(top);
                }
                // 무대의 구간과 스크롤 장치들이 새 조판을 다시 재게 한다.
                ScrollTrigger.refresh();
                frozen = false;
            });
        };

        const request = () => {
            if (!queued) {
                queued = requestAnimationFrame(pick);
            }
        };

        /* **굴리는 동안에는 재지 않는다.** 랜드마크마다 `getBoundingClientRect`를 읽는 일은
           레이아웃을 강제로 계산시키는데, 이 지면에는 3D 루프와 스크롤 장치들이 이미 매
           프레임 돌고 있다. 자리가 필요한 순간은 폭이 바뀔 때뿐이고 그건 굴리는 중에 오지
           않으므로, 멈춘 직후에 한 번만 잡는다. */
        const onScroll = () => {
            window.clearTimeout(idle);
            idle = window.setTimeout(request, PICK_IDLE_MS);
        };

        const onResize = () => {
            if (!viewportChanged()) {
                return;
            }
            // 첫 이벤트에서 곧바로 얼린다. 여기서부터의 측정값은 이미 어긋난 값이다.
            frozen = true;
            window.clearTimeout(settle);
            settle = window.setTimeout(restore, SETTLE_MS);
        };

        pick();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(queued);
            window.clearTimeout(settle);
            window.clearTimeout(idle);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, [active]);
}
