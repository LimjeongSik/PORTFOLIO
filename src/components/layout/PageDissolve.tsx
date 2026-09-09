import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { RouteBoundary } from "@/components/layout/RouteBoundary";

import { closeAssistant } from "@/lib/assistant/bridge";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onLeaving } from "@/lib/leaving";
import { seal } from "@/lib/scrollMemory";
import { hasStage, holdStage, releaseStage, remeasureStage } from "@/lib/stage";
import { setCrossing, setTransitionRunner } from "@/lib/transition";
import { Home } from "@/routes/Home";
import { createProjectDetailRoute, loadProjectDetail } from "@/routes/lazy";

/**
 * 본문이 잠기는 시간과 떠오르는 시간(초).
 *
 * 잠기는 쪽이 더 짧아야 한다 — 누른 즉시 반응한 것으로 읽히고, 기다림은 이미 글이 사라진
 * 뒤에 온다. 반대로 두면 클릭이 씹힌 것처럼 느껴진다.
 */
const DIM = 0.3;
const LIFT = 0.52;

/**
 * 글이 다시 앉기까지 비워 두는 시간(초).
 *
 * 이 사이에 화면에 있는 것은 **3D 공간뿐**이다. 카메라가 다음 자리로 날아가는 동안 글이
 * 겹쳐 있으면 무엇을 봐야 할지 알 수 없고, 반대로 너무 오래 비우면 페이지가 멎은 것으로
 * 보인다. 비행의 절반쯤에서 글이 떠오르기 시작해 착지와 함께 다 읽히도록 맞춘다.
 * 무대가 없는 환경(WebGL 실패 · 동작 줄이기)에서는 비워 둘 이유가 없으니 곧바로 띄운다.
 */
const HOLD_FOR_FLIGHT = 0.45;

/**
 * 청크를 기다리는 두 상한(ms).
 *
 * 앞의 것은 **누른 반응**을 늦추지 않으려는 상한이다 — 이만큼 지나면 청크가 아직이어도
 * 일단 글이 잠기기 시작한다. 뒤의 것은 **글을 다시 띄워도 되는가**의 상한이다. 글이 없는
 * 동안에도 화면에는 3D 공간이 돌고 있으므로 뒤쪽을 넉넉히 주는 것이 공짜다.
 */
const HOLD_BEFORE_DIM = 1200;
const HOLD_BEFORE_LIFT = 4000;

/**
 * 떠오르는 방향. 앞으로 갈 때는 아래에서 올라오고, 뒤로 갈 때는 위에서 내려온다.
 *
 * 뒤로가기에는 잠기는 절반이 없어(§뒤로가기) 앞으로 갈 때와 구분되는 표식이 이것뿐이다.
 */
const RISE = 26;
const FALL = -18;

/**
 * 라우트가 그린 본문. 배경(`fixed`)은 이 바깥에 있다.
 *
 * 변형을 페이지 전체가 아니라 `<main>`에만 거는 이유: `transform`이 걸린 요소는 그 안의
 * `fixed` 자손에게 컨테이닝 블록이 된다. 3D 무대와 베일을 함께 감싸면 스크롤한 만큼
 * 화면 밖으로 밀려난다.
 */
function bodyOf(host: HTMLElement | null) {
    /* **보이는 것만** 고른다. 이미 드러난 Suspense 경계가 다시 멈추면(느린 회선에서 상세
       청크가 늦을 때) React는 옛 화면을 DOM에 남긴 채 `display: none`으로 감추고 폴백을
       보여 준다 — 그 유령을 잡으면 감추기와 되살리기가 도착지가 아니라 떠나온 화면에 걸리고,
       정작 도착한 본문은 연출 없이 튀어나온다. `offsetParent`는 감춰진 조상이 하나라도 있으면
       `null`이라 그 판정에 그대로 쓸 수 있다(`<main>`은 `relative`라 fixed 예외에 걸리지 않는다). */
    for (const node of host?.querySelectorAll<HTMLElement>("main") ?? []) {
        if (node.offsetParent !== null) {
            return node;
        }
    }
    return null;
}

/**
 * 축소의 축을 지금 보고 있는 자리에 둔다.
 *
 * 본문은 화면보다 몇 배 길다. 기본 축(요소 한가운데)으로 줄이면 스크롤한 거리에 비례해
 * 글이 위아래로 쓸려, 가라앉는 것이 아니라 튀는 것으로 보인다.
 */
function originOf(element: HTMLElement) {
    const { top } = element.getBoundingClientRect();
    return `50% ${Math.round(window.innerHeight / 2 - top)}px`;
}

function timeout(ms: number) {
    return new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * 페이지 전환 — **공간은 끊기지 않고, 시점이 옮겨간다.**
 *
 * 예전에는 지면색 베일이 화면 전체를 덮었다. 홈과 상세가 각자의 캔버스를 들고 있어서
 * 넘어갈 때마다 3D 세계가 한 번 파괴되고 다시 지어졌고, 그 사이를 가리는 것 말고는 할 수
 * 있는 일이 없었다 — 방문자에게는 우주가 꺼졌다 켜지는 것으로 보였다(사용자 지적).
 *
 * 지금은 캔버스가 하나뿐이고 라우터 바깥에 산다(`App`). 그래서 전환이 하는 일은 가리는 것이
 * 아니라 **자리를 비켜 주는 것**이다:
 *
 *   ① 글(`<main>`)만 잠긴다 — 배경은 그대로 돌고 있다
 *   ② `holdStage()`가 떠나는 순간의 카메라 자세를 굳히고 라우트를 갈아 끼운다
 *   ③ 새 DOM이 붙으면 `releaseStage()`가 구간을 다시 재고 그 자리로 **날아간다**
 *   ④ 비행이 절반쯤 갔을 때 새 글이 떠오른다
 *
 * 지면색도 이 사이에 물든다(`applyTheme`·`setMood`의 트윈). 가릴 것이 없으므로 색이 툭
 * 바뀌면 그 한 프레임이 그대로 보이기 때문이다.
 *
 * "동작 줄이기"에서는 실행기를 등록하지 않아 링크가 평소대로 즉시 이동한다.
 */
export function PageDissolve() {
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * `useNavigate`는 **pathname이 바뀔 때마다 새 함수를 돌려준다**(BrowserRouter는 data router가
     * 아니라 참조가 고정되지 않는다). 의존성에 넣으면 이동 직후 이펙트가 통째로 다시 돈다.
     */
    const navigateRef = useRef(navigate);
    navigateRef.current = navigate;

    const pageRef = useRef<HTMLDivElement>(null);
    const busyRef = useRef(false);
    /** 이번 라우트 변경을 전환이 일으켰는가 — 뒤로가기와 구분하는 표식. */
    const ownRef = useRef(false);
    const prevPathRef = useRef(location.pathname);
    /** popstate 핸들러가 보는 지금 항목 — 떠나는 자리를 굳히는 데 쓴다. */
    const keyRef = useRef(location.key);
    keyRef.current = location.key;

    /**
     * 상세 라우트는 상수가 아니라 **지금 쓰는 것**을 들고 있는다.
     *
     * 청크를 못 받아 한 번 넘어지면 그 `lazy`는 이후 렌더마다 같은 에러만 던진다
     * (`routes/lazy.ts` 참고). 다시 시도할 때 새것으로 갈아 끼워야 되살아난다.
     */
    const [ProjectDetailRoute, setProjectDetailRoute] = useState(createProjectDetailRoute);
    const retryProjectDetail = useCallback(() => {
        setProjectDetailRoute(() => createProjectDetailRoute());
    }, []);

    /** 전환이 끝났다 — 다음 이동을 받고, 새 조판으로 트리거를 다시 잰다. */
    const finish = useCallback(() => {
        busyRef.current = false;
        setCrossing(false);
        // 본문에 걸었던 변형을 걷어낸 **뒤에** 다시 잰다. 트리거의 기준점은
        // getBoundingClientRect에서 나오므로, 26px 들려 있는 동안 재면 그만큼 어긋난다.
        ScrollTrigger.refresh();
    }, []);

    /**
     * 도착한 화면을 띄운다 — 링크로 왔든 뒤로가기로 왔든 뒷절반은 같다. 글은 비행이 절반쯤
     * 갔을 때 떠오르므로, 방문자는 **공간이 옮겨간 뒤에** 그 자리의 글을 읽게 된다.
     *
     * 감춰 둔 **바로 그 요소**를 되살린다.
     *
     * 요소를 인자로 받는 것이 핵심이다. 예전에는 여기서 `<main>`을 다시 찾았는데, 감춘
     * 요소와 되살리는 요소가 **다를 수 있었다** — `navigate()`는 React 이벤트 밖에서 불려
     * DefaultLane(매크로태스크)으로 커밋되므로, 상세처럼 트리가 크면 커밋이 예약해 둔
     * 프레임 뒤로 밀린다. 그러면 되살리기가 옛 본문에 걸리고, 뒤늦은 커밋의 레이아웃
     * 이펙트가 새 본문을 감춘 채로 굳었다(사용자 지적 — "페이지 이동하면 본문이 사라진다").
     */
    const settle = useCallback(
        (body: HTMLElement, rise: number) => {
            gsap.timeline({
                delay: hasStage() ? HOLD_FOR_FLIGHT : 0.04,
                onComplete: () => {
                    gsap.set(body, { clearProps: "all" });
                    finish();
                },
            }).fromTo(
                body,
                { y: rise, scale: 0.994, opacity: 0, transformOrigin: originOf(body) },
                { y: 0, scale: 1, opacity: 1, duration: LIFT, ease: "power3.out" },
            );
        },
        [finish],
    );

    const run = useCallback((to: string) => {
        if (busyRef.current) {
            return;
        }

        // 지금 자리를 굳힌 뒤에 떠난다. 라우트가 갈리면서 문서가 짧아지면 브라우저가
        // 스크롤을 클램프하고, 그 값이 뒤늦게 기록을 덮는다.
        seal(keyRef.current);

        // "동작 줄이기"에서도 이 입구는 지난다 — 자리를 굳히는 일은 애니메이션이 아니다.
        if (prefersReducedMotion()) {
            navigateRef.current(to);
            return;
        }

        busyRef.current = true;
        // 지면색을 툭 갈아 끼우지 않고 물들이게 한다(`applyTheme`·`clearMood`).
        setCrossing(true);
        // 상세로 건너뛸 때 패널이 열린 채 남지 않게 한다(모바일에서는 화면을 덮는다).
        closeAssistant();

        // 청크를 먼저 받아 둔다. 글이 사라진 뒤에 받기 시작하면 Suspense 폴백이
        // 자리를 차지하고, 글이 떠오를 자리에 그것이 남는다.
        const { pathname } = new URL(to, window.location.href);
        // 받다 실패해도 여기서 삼킨다 — 기다림이 영영 끝나지 않는 전환으로 번지지 않게.
        // 실제 실패는 라우트가 렌더될 때 드러난다.
        const ready = pathname.startsWith("/projects/")
            ? loadProjectDetail().then(
                  () => undefined,
                  () => undefined,
              )
            : Promise.resolve();

        void Promise.race([ready, timeout(HOLD_BEFORE_DIM)]).then(() => {
            const body = bodyOf(pageRef.current);

            const leave = () => {
                // 떠나는 순간의 카메라 자세를 굳힌다. 라우트가 갈리는 동안 카메라는
                // 여기 서 있고, 새 DOM을 재고 나서야 다음 자리로 날아간다.
                holdStage();
                ownRef.current = true;
                navigateRef.current(to);
                /* 여기서 끝이다 — 도착한 화면을 띄우는 일은 **도착한 쪽**(아래 레이아웃
                       이펙트)이 맡는다. 여기서 타이머로 예약하면 커밋과 경주하게 된다. */
            };

            if (!body) {
                leave();
                return;
            }
            gsap.to(body, {
                scale: 0.985,
                opacity: 0,
                duration: DIM,
                ease: "power2.in",
                transformOrigin: originOf(body),
                onComplete: leave,
            });
        });
    }, []);

    // --- 링크를 가로챈다 ---------------------------------------------------
    // Link를 전부 갈아 끼우는 대신 캡처 단계에서 한 번에 받는다. 라우터의 핸들러는
    // `defaultPrevented`를 보지 않으므로, 막으려면 전파 자체를 끊어야 한다.
    useEffect(() => {
        setTransitionRunner(run);

        const onClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0) {
                return;
            }
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const anchor = (event.target as HTMLElement | null)?.closest("a");
            if (!anchor || anchor.hasAttribute("download")) {
                return;
            }
            if (anchor.target && anchor.target !== "_self") {
                return;
            }

            const url = new URL(anchor.href, window.location.href);
            if (url.origin !== window.location.origin) {
                return;
            }
            // 같은 페이지 안의 해시 이동은 스크롤이 맡는다.
            if (url.pathname === window.location.pathname) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            run(`${url.pathname}${url.search}${url.hash}`);
        };

        document.addEventListener("click", onClick, true);
        return () => {
            document.removeEventListener("click", onClick, true);
            setTransitionRunner(null);
        };
    }, [run]);

    // --- 브라우저 뒤로/앞으로 가기 -----------------------------------------
    /**
     * 떠나는 순간의 카메라 자세를 그 자리에서 굳힌다.
     *
     * `popstate`는 히스토리가 이미 갈린 뒤에 오고 라우터도 같은 이벤트를 듣는다. 우리
     * 리스너가 **먼저** 등록돼 있어야(`lib/leaving`은 모듈 최상위에서 건다) 라우터가
     * 리렌더하기 전에 지금 카메라를 붙잡을 수 있다. 여기서 놓치면 뒤로가기는 떠나온 자리를
     * 잃고, 도착지에서 그냥 튀어 나타난다.
     */
    useEffect(
        () =>
            onLeaving(() => {
                if (prefersReducedMotion()) {
                    return;
                }
                /* `popstate`는 주소가 이미 바뀐 뒤에 온다. 해시만 바뀐 것(같은 페이지 안의
                   섹션 이동)에도 불리는데, 그때 붙잡아 두면 뒤의 레이아웃 이펙트가 일찍
                   빠져나가 `busy`가 켜진 채로 남는다 — 이후의 이동이 통째로 막힌다. */
                if (window.location.pathname === prevPathRef.current) {
                    return;
                }
                busyRef.current = true;
                setCrossing(true);
                holdStage();
            }),
        [],
    );

    /**
     * 라우트가 갈린 직후 — 새 본문을 **그리기 전에** 감춘다.
     *
     * 레이아웃 이펙트는 브라우저가 칠하기 전에 돈다. 여기서 감추지 않으면 새 화면이 한
     * 프레임 통째로 드러났다가 다시 사라진다(예전에는 베일이 그것을 가렸다).
     *
     * 뒤로가기에는 **잠기는 절반이 없다.** `popstate`가 온 시점에는 라우터가 이미 동기
     * 렌더까지 끝냈으므로 떠나는 화면을 붙잡을 방법이 없다. 대신 카메라는 `onLeaving`에서
     * 이미 굳혀 두었으므로, 뒷절반(비행 + 글이 떠오름)은 앞으로 갈 때와 똑같다.
     */
    useLayoutEffect(() => {
        const from = prevPathRef.current;
        prevPathRef.current = location.pathname;

        // 같은 페이지 안에서 해시만 바뀐 것은 이동이 아니다.
        if (from === location.pathname) {
            return;
        }

        const own = ownRef.current;
        ownRef.current = false;
        if (prefersReducedMotion()) {
            return;
        }

        /* 감추기와 되살리기를 **한 흐름**으로 든다. 둘을 갈라 두면(예전처럼 되살리기를
           타이머로 예약하면) 커밋과 경주해서, 감춘 요소와 되살리는 요소가 어긋난 채 굳는다.

           본문이 아직 없을 수 있다 — 느린 회선에서 청크가 늦으면 이 커밋에는 Suspense
           폴백만 있다. 그때는 프레임마다 다시 보되, **rAF는 칠하기 전에 돌므로** 본문을
           발견한 그 프레임에 감추면 한 번도 드러나지 않는다. */
        let waiting = 0;
        const deadline = performance.now() + HOLD_BEFORE_LIFT;

        const begin = () => {
            waiting = 0;
            const body = bodyOf(pageRef.current);
            if (!body) {
                if (performance.now() > deadline) {
                    /* 본문이 끝내 오지 않았다(청크 실패 · 에러 화면). 그래도 카메라는
                       놓아 준다 — `holdStage()`로 붙들어 둔 채로 두면 무대가 떠나온 자세에
                       영영 얼어붙고, 뒤늦게 청크가 도착해도 이 이펙트는 다시 돌지 않는다. */
                    remeasureStage();
                    releaseStage();
                    finish();
                    return;
                }
                waiting = requestAnimationFrame(begin);
                return;
            }

            gsap.set(body, { opacity: 0 });
            /* 세계는 방금(`Stage`의 레이아웃 이펙트) 교대했다. 같은 프레임에 다시 재고
               **곧바로 띄운다.** 기다렸다 띄우면 그 사이 카메라가 붙들린 채로 글도 배경도
               멎어 있어, 그 정지가 "화면이 한 번 꺼졌다"로 읽힌다(사용자 지적). */
            remeasureStage();
            releaseStage();

            // 스크롤 리셋·테마 주입이 자리를 잡고 나서 띄운다.
            waiting = requestAnimationFrame(() => {
                waiting = requestAnimationFrame(() => settle(body, own ? RISE : FALL));
            });
        };

        begin();
        return () => cancelAnimationFrame(waiting);
    }, [location.pathname, settle, finish]);

    return (
        /* 라우트는 문서 흐름에 그대로 둔다 — 감싸는 상자가 레이아웃에 끼어들면
           안쪽의 fixed 배경이 그 상자를 기준으로 잡혀 버린다. */
        <div ref={pageRef} style={{ display: "contents" }}>
            <RouteBoundary resetKey={location.pathname} onRetry={retryProjectDetail}>
                <Suspense fallback={<div className="min-h-screen" />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects/:slug" element={<ProjectDetailRoute />} />
                    </Routes>
                </Suspense>
            </RouteBoundary>
        </div>
    );
}
