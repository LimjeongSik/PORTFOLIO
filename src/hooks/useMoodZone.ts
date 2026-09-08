import { useLayoutEffect } from "react";

import { setMood } from "@/lib/atmosphere";
import { ScrollTrigger } from "@/lib/gsap";

import type { RefObject } from "react";
import type { Mood } from "@/lib/atmosphere";

/**
 * 이 구간이 화면 한가운데를 차지하는 동안 지면의 무드를 `mood`로 유지한다.
 * 구간 사이의 빈 곳에서는 마지막 무드가 그대로 남으므로, 색은 섹션을 지날 때만 바뀐다.
 *
 * `scene`은 **필수**다. 생략하면 `setMood`가 직전 구간 번호를 그대로 물려받아, 색만 돌아오고
 * 배경은 그 자리에 굳는다(히어로로 되올라와도 카드가 다시 뭉치지 않던 원인).
 */
export function useMoodZone(
    ref: RefObject<HTMLElement | null>,
    id: string,
    mood: Mood,
    scene: number,
) {
    /* 레이아웃 이펙트인 이유: 구간이 갈아 끼워질 때(무대 ↔ 목록) 떠나는 쪽의 트리거가 새 쪽의
       레이아웃 이펙트보다 먼저 죽어야 한다. 일반 이펙트로 두면 새 쪽이 스크롤을 옮기는 순간
       옛 레이아웃 기준의 트리거가 아직 살아 있어 엉뚱한 카드의 방을 주장한다. */
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        /* 트리거가 만들어지는 순간 스크롤이 이미 구간을 지나 있으면 ScrollTrigger는
           onEnter와 onLeave를 연달아 쏜다(건너뛴 구간의 콜백을 채워 주는 기본 동작).
           그러면 방금 마운트된 구간들이 문서 순서로 차례차례 지면을 칠하고, 마지막에 도는
           부모(섹션)의 무드가 실제로 화면 가운데 있는 자식(카드)의 무드를 덮는다 —
           창을 `lg` 경계 너머로 줄였다 늘릴 때 갤러리가 제목의 모래색으로 돌아가던 이유다.
           지금 실제로 화면을 잡고 있을 때만 주장한다. */
        const apply = (self: ScrollTrigger) => {
            if (self.isActive) {
                setMood(id, mood, { scene });
            }
        };
        const trigger = ScrollTrigger.create({
            trigger: element,
            start: "top 55%",
            end: "bottom 45%",
            onEnter: apply,
            onEnterBack: apply,
        });

        return () => trigger.kill();
    }, [ref, id, mood, scene]);
}
