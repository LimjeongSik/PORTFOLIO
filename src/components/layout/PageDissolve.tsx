import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { RouteBoundary } from "@/components/layout/RouteBoundary";

import { projects } from "@/data/projects";
import { closeAssistant } from "@/lib/assistant/bridge";
import { VOID_MOOD } from "@/lib/atmosphere";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { onLeaving } from "@/lib/leaving";
import { seal } from "@/lib/scrollMemory";
import { setTransitionRunner } from "@/lib/transition";
import { Home } from "@/routes/Home";
import { createProjectDetailRoute, loadProjectDetail } from "@/routes/lazy";

/**
 * 잠기는 시간과 떠오르는 시간.
 *
 * 잠기는 쪽이 더 짧아야 한다 — 누른 즉시 반응한 것으로 읽히고, 기다림은 이미 화면이
 * 덮인 뒤에 온다. 반대로 두면 클릭이 씹힌 것처럼 느껴진다.
 */
const DIM = 0.34;
const LIFT = 0.52;

/**
 * 청크를 기다리는 두 상한(ms).
 *
 * 앞의 것은 **누른 반응**을 늦추지 않으려는 상한이다 — 이만큼 지나면 청크가 아직이어도
 * 일단 잠기기 시작한다. 뒤의 것은 **덮개를 걷어도 되는가**의 상한이다. 베일이 완전히
 * 덮인 뒤의 기다림은 화면에 보이지 않으므로 넉넉히 준다.
 *
 * 하나로 합치면 둘 중 하나를 반드시 희생한다 — 짧으면 빈 화면이 드러나고, 길면 클릭이
 * 씹힌다. 앞의 상한만 두었을 때 실제로 전자가 났다.
 */
const HOLD_BEFORE_DIM = 1200;
const HOLD_BEFORE_LIFT = 4000;

/**
 * 떠오르는 방향. 앞으로 갈 때는 아래에서 올라오고, 뒤로 갈 때는 위에서 내려온다.
 *
 * 뒤로가기에는 잠기는 절반이 없어(§뒤로가기) 앞으로 갈 때와 구분되는 표식이 이것뿐이다.
 * 되돌아온 화면이 왔던 방향의 반대로 들어오면, 절반만 보고도 뒤로 왔다는 것이 읽힌다.
 */
const RISE = 26;
const FALL = -18;

/** 도착지의 지면색 — 상세는 자기 테마를 :root에 주입하므로 베일도 그 색으로 옮겨 간다. */
function paperOf(pathname: string) {
    const slug = pathname.startsWith("/projects/") ? pathname.slice("/projects/".length) : "";
    return projects.find((project) => project.slug === slug)?.theme.paper ?? VOID_MOOD.paper;
}

/** 지금 지면에 칠해져 있는 색. 홈에서는 스크롤 구간마다 다르므로 그때그때 읽어야 한다. */
function paperNow() {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-paper")
        .trim();
    return value || VOID_MOOD.paper;
}

/**
 * 라우트가 그린 본문. 배경(`fixed`)은 이 바깥에 있다.
 *
 * 변형을 페이지 전체가 아니라 `<main>`에만 거는 이유: `transform`이 걸린 요소는 그 안의
 * `fixed` 자손에게 컨테이닝 블록이 된다. 3D 필드와 베일을 함께 감싸면 스크롤한 만큼
 * 화면 밖으로 밀려난다.
 */
function bodyOf(host: HTMLElement | null) {
    return host?.querySelector<HTMLElement>("main") ?? null;
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
 * 페이지 전환 — 보던 화면이 지면색으로 잠겼다가, 새 화면이 그 색을 밀어내며 떠오른다.
 *
 * 라우트가 바뀌는 순간에는 가릴 것이 많다. 상세 청크를 받는 동안의 빈 화면, 테마가 갈리는
 * 사이에 드러나는 기본 토큰, 맨 위로 되돌리는 스크롤 점프, three 씬의 재생성 — 전부 베일
 * 뒤에서 일어나게 하면 깜빡임이 사라진다.
 *
 * 덮는 것은 검정이 아니라 **지금 지면에 칠해져 있는 색**이고, 덮여 있는 동안 그 색이
 * 도착지의 지면색으로 건너간다. 어두운 방에서 밝은 방으로 넘어가도 흰 플래시가 없는 이유다 —
 * 색 토큰을 스크롤에 맞춰 계속 트윈하는 `@/lib/atmosphere`와 같은 어휘를 쓴다.
 *
 * 움직이는 것은 `<main>` 하나뿐이다. 배경(3D 필드·베일)은 변형 밖에 남아 자리를 지키고,
 * 그 위에서 본문만 잠겼다 떠오른다. 화면을 복제하지 않으니 캔버스가 흐려질 일도 없다.
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
    const veilRef = useRef<HTMLDivElement>(null);
    const busyRef = useRef(false);
    /** 이번 라우트 변경을 전환이 일으켰는가 — 뒤로가기와 구분하는 표식. */
    const ownRef = useRef(false);
    const prevPathRef = useRef(location.pathname);
    /** popstate 핸들러가 보는 지금 항목 — 떠나는 자리를 굳히는 데 쓴다. */
    const keyRef = useRef(location.key);
    keyRef.current = location.key;
    /** 뒤로가기로 떠나온 화면의 지면색. popstate 시점에는 아직 :root에 그 색이 남아 있다. */
    const leavingPaperRef = useRef<string | null>(null);

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

    /**
     * 도착한 화면을 띄운다 — 링크로 왔든 뒤로가기로 왔든 뒷절반은 같다.
     *
     * 베일의 색을 도착지로 옮기는 트윈과 걷어내는 트윈을 겹쳐 둔다. 색이 다 건너간 뒤에
     * 걷으면 총 시간이 1초를 넘고, 겹쳐 두면 옅어지는 동안 그 밑의 실제 지면색이 비쳐
     * 어차피 같은 자리로 수렴한다.
     */
    const settle = useCallback((pathname: string, rise: number) => {
        const veil = veilRef.current;
        if (!veil) {
            return;
        }

        const body = bodyOf(pageRef.current);
        const timeline = gsap.timeline({
            onComplete: () => {
                if (body) {
                    gsap.set(body, { clearProps: "all" });
                }
                veil.style.visibility = "hidden";
                busyRef.current = false;
                // 본문에 걸었던 변형을 걷어낸 **뒤에** 다시 잰다. 트리거의 기준점은
                // getBoundingClientRect에서 나오므로, 26px 들려 있는 동안 재면 그만큼 어긋난다.
                ScrollTrigger.refresh();
            },
        });

        timeline.to(
            veil,
            { backgroundColor: paperOf(pathname), duration: 0.34, ease: "power1.inOut" },
            0,
        );

        if (body) {
            timeline.fromTo(
                body,
                { y: rise, scale: 0.994, opacity: 0, transformOrigin: originOf(body) },
                { y: 0, scale: 1, opacity: 1, duration: LIFT, ease: "power3.out" },
                0.04,
            );
        }

        timeline.to(veil, { opacity: 0, duration: 0.46, ease: "power2.out" }, 0.06);
    }, []);

    const run = useCallback(
        (to: string) => {
            const veil = veilRef.current;
            if (busyRef.current) {
                return;
            }

            // 지금 자리를 굳힌 뒤에 떠난다. 라우트가 갈리면서 문서가 짧아지면 브라우저가
            // 스크롤을 클램프하고, 그 값이 뒤늦게 기록을 덮는다.
            seal(keyRef.current);

            // "동작 줄이기"에서도 이 입구는 지난다 — 자리를 굳히는 일은 애니메이션이 아니다.
            if (!veil || prefersReducedMotion()) {
                navigateRef.current(to);
                return;
            }

            busyRef.current = true;
            // 상세로 건너뛸 때 패널이 열린 채 남지 않게 한다(모바일에서는 화면을 덮는다).
            closeAssistant();

            // 청크를 먼저 받아 둔다. 베일 뒤에서 받기 시작하면 Suspense 폴백(빈 화면)이
            // 자리를 차지하고, 베일이 걷힌 자리에 그것이 남는다.
            const { pathname } = new URL(to, window.location.href);
            // 받다 실패해도 여기서 삼킨다 — 기다림이 영영 걷히지 않는 베일로 번지지 않게.
            // 실제 실패는 라우트가 렌더될 때 드러난다.
            const ready = pathname.startsWith("/projects/")
                ? loadProjectDetail().then(
                      () => undefined,
                      () => undefined,
                  )
                : Promise.resolve();

            void Promise.race([ready, timeout(HOLD_BEFORE_DIM)]).then(() => {
                const body = bodyOf(pageRef.current);
                gsap.set(veil, { backgroundColor: paperNow(), opacity: 0, visibility: "visible" });

                const timeline = gsap.timeline({
                    onComplete: () => {
                        ownRef.current = true;
                        navigateRef.current(to);
                        // 첫 상한은 잠그기 시작할 때를 정할 뿐이라, 느린 회선에서는 아직
                        // 청크가 없을 수 있다. 그대로 걷으면 Suspense 폴백(빈 화면)이
                        // 드러난다 — 덮인 채로 한 번 더 기다린다.
                        void Promise.race([ready, timeout(HOLD_BEFORE_LIFT)]).then(() => {
                            // 새 본문이 자리를 잡고(레이아웃 · 스크롤 리셋 · 테마 주입) 나서 띄운다.
                            requestAnimationFrame(() => {
                                requestAnimationFrame(() => settle(pathname, RISE));
                            });
                        });
                    },
                });

                timeline.to(veil, { opacity: 1, duration: DIM, ease: "power2.inOut" }, 0);
                if (body) {
                    timeline.to(
                        body,
                        {
                            scale: 0.985,
                            opacity: 0,
                            duration: DIM,
                            ease: "power2.in",
                            transformOrigin: originOf(body),
                        },
                        0,
                    );
                }
            });
        },
        [settle],
    );

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
     * 떠나온 화면의 지면색을 그 자리에서 받아 둔다.
     *
     * 떠나는 순간에는 `:root`에 아직 떠나온 쪽의 색이 칠해져 있다. 라우터가 그리고 나면
     * 도착지의 색으로 덮여 다시 읽을 수 없다 — `onLeaving`이 필요한 이유가 그것이다.
     */
    useEffect(
        () =>
            onLeaving(() => {
                leavingPaperRef.current = paperNow();
            }),
        [],
    );

    /**
     * 뒤로/앞으로 가기에는 **잠기는 절반이 없다.**
     *
     * `popstate`는 히스토리가 이미 갈린 뒤에 오고, 라우터도 같은 이벤트를 듣는다 — 우리
     * 리스너가 먼저 받더라도 라우터의 리렌더를 붙잡아 둘 수 없다. 떠나는 화면을 붙잡으려면
     * 다시 복제하는 수밖에 없는데, 그것이 방금 걷어낸 방식이다.
     *
     * 그래서 뒷절반만 태우되 **떠나온 색에서 시작한다.** 도착지 색으로 덮고 시작하면 색이
     * 이미 갈린 뒤라 "덮개가 걷혔다"로만 보이고, 떠나온 색에서 도착지 색으로 물들며 걷히면
     * 그 사이에 이동이 있었다는 것이 읽힌다. 본문도 앞으로 갈 때와 반대 방향에서 들어온다.
     */
    useLayoutEffect(() => {
        const from = prevPathRef.current;
        prevPathRef.current = location.pathname;

        // 같은 페이지 안에서 해시만 바뀐 것은 이동이 아니다.
        if (from === location.pathname) {
            return;
        }
        if (ownRef.current) {
            ownRef.current = false;
            return;
        }

        const veil = veilRef.current;
        if (!veil || prefersReducedMotion()) {
            return;
        }

        busyRef.current = true;
        gsap.set(veil, {
            backgroundColor: leavingPaperRef.current ?? paperOf(from),
            opacity: 1,
            visibility: "visible",
        });
        leavingPaperRef.current = null;
        // 스크롤 복원(ScrollToTop)도 두 프레임 뒤에 온다 — 그 점프가 아직 불투명한 베일
        // 뒤에서 일어나도록, 걷어내는 트윈은 0.06초 늦게 시작한다(settle).
        requestAnimationFrame(() => {
            requestAnimationFrame(() => settle(location.pathname, FALL));
        });
    }, [location.pathname, settle]);

    return (
        <>
            {/* 라우트는 문서 흐름에 그대로 둔다 — 감싸는 상자가 레이아웃에 끼어들면
                안쪽의 fixed 배경이 그 상자를 기준으로 잡혀 버린다. */}
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

            <div
                ref={veilRef}
                aria-hidden
                className="pointer-events-none fixed inset-0 z-40"
                style={{ visibility: "hidden", opacity: 0 }}
            />
        </>
    );
}
