import { useEffect } from "react";

import { ScrollTrigger } from "@/lib/gsap";
import { scrollToOffset } from "@/lib/scroll";

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

/**
 * 굴리는 동안 자리를 다시 잡는 간격(ms)과, 멈춘 뒤 한 번 더 잡는 시간(ms).
 *
 * 프레임마다 재면 `getBoundingClientRect`를 스무 번씩 읽어 3D 무대와 레이아웃을 두고 다툰다.
 * 여기서 필요한 정밀도는 "지금 어느 화면·사례를 읽고 있는가"뿐이라 이따금이면 충분하고,
 * 정작 중요한 **마지막 자리**는 멈춘 직후에 한 번 더 잡아 정확히 남긴다.
 */
const PICK_MS = 120;
const PICK_IDLE_MS = 90;

/** 세로만 이만큼(비율) 넘게 달라져야 자리를 다시 맞춘다 — 모바일 주소창 여닫이를 거른다. */
const HEIGHT_TOLERANCE = 0.1;

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
        let width = window.innerWidth;
        let height = window.innerHeight;
        /** 조판이 갈리는 동안에는 재지 않는다 — 그 순간의 값은 이미 어긋난 값이다. */
        let frozen = false;
        let queued = 0;
        let settle = 0;
        let idle = 0;
        let lastPick = 0;

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
                width = window.innerWidth;
                height = window.innerHeight;
            });
        };

        const request = () => {
            if (!queued) {
                lastPick = performance.now();
                queued = requestAnimationFrame(pick);
            }
        };

        const onScroll = () => {
            // 멈춘 직후 한 번 — 마지막 자리가 가장 정확해야 한다.
            window.clearTimeout(idle);
            idle = window.setTimeout(request, PICK_IDLE_MS);
            if (performance.now() - lastPick >= PICK_MS) {
                request();
            }
        };

        const onResize = () => {
            const grew = window.innerWidth !== width;
            const stretched = Math.abs(window.innerHeight - height) / height > HEIGHT_TOLERANCE;
            if (!grew && !stretched) {
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
