import { useEffect } from "react";

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
    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        const apply = () => setMood(id, mood, { scene });
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
