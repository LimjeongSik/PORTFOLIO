import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

import { ScrollTrigger } from "@/lib/gsap";
import { onLeaving } from "@/lib/leaving";
import { scrollToOffset, scrollToSection } from "@/lib/scroll";
import { recall, remember, seal, unseal } from "@/lib/scrollMemory";

/**
 * 스크롤을 옮긴다 — 정본은 `@/lib/scroll`에 있다.
 *
 * Lenis가 활성화된 경우 반드시 Lenis를 통해야 한다. `window.scrollTo()`만 부르면 Lenis
 * 내부 목표 위치가 이전 값으로 남아 다음 프레임에 되돌아가고, 새 페이지가 더 짧으면
 * 최하단으로 클램프된다. 폴백이 남아 있어야 하는 이유도 그쪽에 적어 두었다 — React는
 * 자식 → 부모 순으로 effect를 실행하므로 최초 마운트 때는 `useLenis`(App)보다 이 컴포넌트가
 * 먼저 돌고, 그때 인스턴스는 아직 `null`이다.
 */
const move = scrollToOffset;

/** 새 라우트가 방금 그려져 높이가 아직 확정되지 않았다 — 두 프레임 뒤에 옮긴다. */
function restore(top: number) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            move(top);
            // 지연 청크·이미지로 높이가 한 박자 늦게 확정되면 방금 목표가 클램프된 채 굳는다.
            // 한 프레임 더 보고 어긋나 있으면 한 번만 다시 맞춘다.
            requestAnimationFrame(() => {
                if (Math.abs(window.scrollY - top) > 2) {
                    move(top);
                }
                // 무대의 인덱스와 지면의 무드는 스크롤 위치에서 나온다 — 옮긴 자리를 다시 재게 한다.
                ScrollTrigger.refresh();
                unseal();
            });
        });
    });
}

/**
 * 라우트 이동 시 스크롤 위치를 정한다.
 *
 * - 뒤로/앞으로 가기(POP)는 **보던 자리로** 되돌린다.
 * - 해시(`/#projects`)가 있으면 해당 섹션으로 스크롤한다.
 * - 그 밖에는 맨 위로.
 */
export function ScrollToTop() {
    const { pathname, hash, key } = useLocation();
    const navigationType = useNavigationType();

    /** popstate 핸들러가 보는 "지금 떠나는 항목". 이벤트는 트리 밖에서 온다. */
    const keyRef = useRef(key);
    keyRef.current = key;

    /** 직전에 있던 페이지 — 해시 이동을 즉시로 할지 부드럽게 할지 여기서 갈린다. */
    const prevPathRef = useRef(pathname);

    useEffect(() => {
        // 새로고침·뒤로가기 시 브라우저가 스크롤을 복원하면 우리 복원과 충돌한다.
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    /**
     * 브라우저 뒤로/앞으로는 우리가 시작한 이동이 아니다.
     *
     * 떠나는 순간에는 히스토리만 갈렸고 화면은 아직 그 자리 그대로다 — 여기서 굳혀야
     * 나중에 돌아올 수 있다. 링크로 떠날 때는 전환(`PageDissolve`)이 잠기기 직전에 한다.
     * 이 구독이 `window`에 직접 걸지 않고 `onLeaving`을 거치는 이유는 그 모듈에 적어 두었다.
     */
    useEffect(() => onLeaving(() => seal(keyRef.current)), []);

    /**
     * 이 히스토리 항목에 머무는 동안의 스크롤 위치를 계속 적어 둔다.
     *
     * 정리 단계에서 한 번 더 적으면 **안 된다**. cleanup은 새 라우트가 커밋된 뒤에 오고,
     * 그때 `scrollY`는 짧아진 문서에 맞춰 이미 클램프되어 있다 — 굳혀 둔 값을 그 값이 덮는다.
     */
    useEffect(() => {
        const record = () => remember(key);
        record();
        window.addEventListener("scroll", record, { passive: true });
        return () => window.removeEventListener("scroll", record);
    }, [key]);

    useEffect(() => {
        /* 라우트를 건너왔는지는 **어느 갈래로 빠지든** 먼저 확정해 둔다. 아래 어느 하나에서
           일찍 빠져나가면서 갱신을 놓치면, 그 뒤 같은 페이지 안의 해시 이동까지 "건너온 것"으로
           오판해 툭 튄다. */
        const crossed = prevPathRef.current !== pathname;
        prevPathRef.current = pathname;

        if (navigationType === "POP") {
            const saved = recall(key);
            if (saved !== undefined) {
                restore(saved);
                return;
            }
        }

        if (hash) {
            const id = hash.replace("#", "");
            if (document.getElementById(id)) {
                /* **라우트를 건너와 도착한 것이면 즉시 옮긴다.** 그때는 카메라도 새 자리로
                   날아가는 중인데, 스크롤이 부드럽게 흐르면 비행의 목표가 매 프레임 앞서
                   달아나 궤적이 엉킨다(사용자 지적). 같은 페이지 안의 해시 이동은 가릴 것이
                   없으니 평소대로 부드럽게 간다. */
                // 방금 그려진 라우트라, 한 프레임 뒤에야 위치가 확정된다.
                requestAnimationFrame(() => {
                    scrollToSection(id, crossed);
                    unseal();
                });
                return;
            }
        }

        move(0);
        unseal();
    }, [pathname, hash, key, navigationType]);

    return null;
}
