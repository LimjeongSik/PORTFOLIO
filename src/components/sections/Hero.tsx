import { useEffect, useRef } from "react";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { Magnetic } from "@/components/ui/Magnetic";
import { useMoodZone } from "@/hooks/useMoodZone";

import { profile } from "@/data/profile";
import { VOID_MOOD } from "@/lib/atmosphere";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenisInstance } from "@/lib/lenis";

const TITLE_LINES = ["프론트엔드를", "설계하는 개발자"];

export function Hero() {
    const root = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const reduced = useReducedMotion();

    useMoodZone(root, "hero", VOID_MOOD, 0);

    // 스크롤에 따라 히어로 콘텐츠가 밀려나며 페이드.
    // 엘리먼트 측정이 아니라 전역 스크롤 픽셀값에 직접 매핑해 항상 단조 증가/감소하게 한다
    // → 내려갈 때 0, 올라올 때 서서히 1로 대칭 동작하며 구간 전환 시 튀지 않는다.
    const { scrollY } = useScroll();
    const contentY = useTransform(scrollY, [0, 560], [0, 90]);
    const contentOpacity = useTransform(scrollY, [0, 460], [1, 0]);

    // 관성 스크롤의 속도를 글자에 흘려 넣는다. 빠르게 굴릴수록 타이틀이 진행 방향으로 눕는다.
    // Lenis가 없으면(동작 줄이기·최초 마운트) 아무것도 하지 않는다.
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

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [reduced]);

    useGSAP(
        () => {
            // reduced-motion에서는 GSAP 트윈(인라인 transform)이 CSS 미디어쿼리로 억제되지 않으므로
            // 여기서 직접 건너뛴다. 요소들은 애니메이션 없이 최종 상태로 그대로 보인다.
            if (reduced) {
                return;
            }

            const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

            tl.from(".hero-char", {
                yPercent: 130,
                duration: 1.05,
                stagger: 0.026,
            })
                .from(".hero-rule", { scaleX: 0, duration: 1, ease: "expo.out" }, "-=0.8")
                .from(".hero-meta", { opacity: 0, y: 18, stagger: 0.1 }, "-=0.6")
                .from(".hero-cue", { opacity: 0, duration: 0.8 }, "-=0.3");

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

    return (
        <section
            ref={root}
            className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 pt-24 pb-16"
        >
            <motion.div
                className="relative mx-auto w-full max-w-6xl"
                style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
            >
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

                <p className="hero-meta mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
                    {profile.tagline}
                </p>

                <div className="hero-meta mt-10 flex flex-wrap items-center gap-4">
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
            </motion.div>

            <div className="hero-cue pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-widest text-muted uppercase">
                <span>Scroll</span>
                <span className="flex h-8 w-5 justify-center rounded-full border border-line pt-1.5">
                    <span className="hero-cue-dot h-1.5 w-1.5 rounded-full bg-espresso" />
                </span>
            </div>
        </section>
    );
}
