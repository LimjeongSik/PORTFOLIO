import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "motion/react";

import { Magnetic } from "@/components/ui/Magnetic";
import { useMoodZone } from "@/hooks/useMoodZone";

import { profile } from "@/data/profile";
import { VOID_MOOD } from "@/lib/atmosphere";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenisInstance } from "@/lib/lenis";
import { onStageReady } from "@/lib/stage";

const TITLE_LINES = ["프론트엔드를", "설계하는 개발자"];

export function Hero() {
    const root = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const intro = useRef<gsap.core.Timeline | null>(null);
    const reduced = useReducedMotion();
    const [cued, setCued] = useState(false);

    useMoodZone(root, "hero", VOID_MOOD, 0);

    /* 무대가 자리를 잡은 뒤에 인트로를 연다(`lib/stage`). 무대를 세우는 100ms 단위의 동기
       작업이 인트로 한복판에 떨어지면 글자가 끊겨 올라오는데, 그 일을 먼저 끝내면 인트로는
       온전히 돈다. 그동안 화면은 비어 있지 않다 — `index.html`의 고리가 같은 공간을 채우고
       있고, 그것이 걷히는 것과 이 인트로가 열리는 것이 같은 순간이다(`onStageReady`). */
    useEffect(() => onStageReady(() => setCued(true)), []);

    // 관성 스크롤의 속도를 글자에 흘려 넣는다. 빠르게 굴릴수록 타이틀이 진행 방향으로 눕는다.
    useEffect(() => {
        if (reduced) {
            return;
        }
        const element = titleRef.current;
        if (!element) {
            return;
        }

        let skew = 0;
        let frame = 0;

        const tick = () => {
            const velocity = getLenisInstance()?.velocity ?? 0;
            const target = gsap.utils.clamp(-7, 7, velocity * 0.16);
            skew += (target - skew) * 0.1;
            element.style.transform =
                Math.abs(skew) < 0.01
                    ? ""
                    : `skewY(${skew.toFixed(3)}deg) scaleY(${(1 + Math.abs(skew) * 0.006).toFixed(4)})`;
            frame = requestAnimationFrame(tick);
        };

        /* 히어로가 화면에 있을 때만 돈다. 이 루프는 7rem 볼드 두 줄에 매 프레임 transform을
           쓰는 일이라 그 자체로 큰 영역을 다시 칠하게 하는데, 예전에는 첫 화면을 지나 경력이나
           갤러리를 읽는 내내도 계속 돌았다 — 보이지 않는 글자를 위해 지면 전체와 무대가 프레임을
           나눠 쓰고 있었다. 나갈 때 기울기를 0으로 되돌려 두어 다시 들어와도 튀지 않는다. */
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.some((entry) => entry.isIntersecting);
            if (visible && !frame) {
                frame = requestAnimationFrame(tick);
                return;
            }
            if (!visible && frame) {
                cancelAnimationFrame(frame);
                frame = 0;
                skew = 0;
                element.style.transform = "";
            }
        });
        observer.observe(element);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [reduced]);

    useGSAP(
        () => {
            // reduced-motion에서는 GSAP 트윈(인라인 transform)이 CSS 미디어쿼리로 억제되지 않으므로
            // 여기서 직접 건너뛴다. 요소들은 애니메이션 없이 최종 상태로 그대로 보인다.
            if (reduced) {
                return;
            }

            /* 첫 화면이 다 열리기까지 2.2초가 걸렸다 — 처음 온 사람이 제목을 다 읽고도
               한참을 기다린다(사용자 지적). 순서·이징·움직이는 거리는 그대로 두고 길이만
               절반으로 줄여 1.2초 안에 끝낸다.

               **멈춰 세운 채로 만든다.** 여는 것은 무대가 자리를 잡은 뒤다(위 이펙트).
               `from` 트윈은 만들어지는 순간 시작 자세를 적용하므로, 멈춰 있어도 글자는
               처음부터 숨어 있다 — 나중에 열어도 완성된 화면이 한 번 보였다가 튀지 않는다. */
            const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
            intro.current = tl;

            tl.from(".hero-char", { yPercent: 130, duration: 0.62, stagger: 0.016 })
                .from(".hero-rule", { scaleX: 0, duration: 0.6, ease: "expo.out" }, "-=0.45")
                .from(".hero-meta", { opacity: 0, y: 18, duration: 0.5, stagger: 0.06 }, "-=0.4")
                .from(".hero-cue", { opacity: 0, duration: 0.5 }, "-=0.25");

            // 스크롤 표시의 점은 인트로와 무관하게 계속 뛴다.
            gsap.to(".hero-cue-dot", {
                y: 8,
                repeat: -1,
                yoyo: true,
                duration: 0.9,
                ease: "sine.inOut",
            });
        },
        { scope: root, dependencies: [reduced] },
    );

    useEffect(() => {
        if (cued) {
            intro.current?.play();
        }
    }, [cued]);

    return (
        // 화면보다 긴 건 뒤의 공간이 원통에서 다음 대형으로 넘어갈 스크롤을 벌기 위해서다.
        <section ref={root} data-stage-zone="hero" className="relative h-[230svh]">
            <div className="sticky top-0 h-svh overflow-hidden">
                {/* 글자는 3D 공간 앞에 선다. 판이 도는 자리를 글자 판이 가로채지 않도록
                    포인터를 넘기고, 실제로 눌러야 하는 것(링크)만 다시 켠다. */}
                <div className="pointer-events-none relative flex h-full items-center px-6">
                    <div className="mx-auto w-full max-w-6xl">
                        <div className="hero-meta flex flex-wrap items-center gap-3 font-mono text-xs tracking-widest text-muted uppercase">
                            <span className="text-espresso">{profile.role}</span>
                            <span className="h-px w-8 bg-line" />
                            <span>{profile.location}</span>
                        </div>

                        <h1
                            ref={titleRef}
                            className="mt-8 origin-left font-display text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] font-bold tracking-tight text-ink will-change-transform"
                        >
                            {TITLE_LINES.map((line) => (
                                <span key={line} className="block overflow-hidden pb-[0.08em]">
                                    <span className="block">
                                        {[...line].map((char, index) => (
                                            <span
                                                // biome-ignore lint/suspicious/noArrayIndexKey: 고정된 타이틀 문자열이라 인덱스 키가 안전
                                                key={`${line}-${index}`}
                                                className="hero-char inline-block whitespace-pre"
                                            >
                                                {char}
                                            </span>
                                        ))}
                                    </span>
                                </span>
                            ))}
                        </h1>

                        <div className="hero-rule mt-8 h-px w-full max-w-md origin-left bg-gradient-to-r from-espresso to-transparent" />

                        <p className="hero-meta mt-8 max-w-[34rem] text-lg leading-[1.72] text-ink/75 sm:text-xl">
                            {profile.tagline}
                        </p>

                        <div className="hero-meta pointer-events-auto mt-10 flex flex-wrap items-center gap-4">
                            <Magnetic strength={16}>
                                <a
                                    href="#projects"
                                    className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-paper"
                                >
                                    프로젝트 보기
                                    <span aria-hidden>→</span>
                                </a>
                            </Magnetic>
                            <Magnetic strength={12}>
                                <a
                                    href="#about"
                                    className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
                                >
                                    프로필 보기
                                </a>
                            </Magnetic>
                        </div>
                    </div>
                </div>

                <div className="hero-cue pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-widest text-muted uppercase">
                    <span>Scroll</span>
                    <span className="flex h-8 w-5 justify-center rounded-full border border-line pt-1.5">
                        <span className="hero-cue-dot h-1.5 w-1.5 rounded-full bg-espresso" />
                    </span>
                </div>
            </div>
        </section>
    );
}
