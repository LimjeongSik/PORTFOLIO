import { useRef } from "react";

import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "motion/react";

import { profile } from "@/data/profile";
import { gsap, useGSAP } from "@/lib/gsap";

import type { PointerEvent } from "react";

export function Hero() {
    const root = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();

    // 포인터를 따라 은은하게 움직이는 웜 베이지 글로우
    const glowX = useMotionValue(50);
    const glowY = useMotionValue(38);
    const smoothX = useSpring(glowX, { stiffness: 60, damping: 20 });
    const smoothY = useSpring(glowY, { stiffness: 60, damping: 20 });
    const glow = useMotionTemplate`radial-gradient(680px circle at ${smoothX}% ${smoothY}%, rgba(228,211,178,0.55), transparent 62%)`;

    // 스크롤에 따라 히어로 콘텐츠가 살짝 밀려나며 페이드.
    // 엘리먼트 측정이 아니라 전역 스크롤 픽셀값에 직접 매핑해 항상 단조 증가/감소하게 한다
    // → 내려갈 때 0, 올라올 때 서서히 1로 대칭 동작하며 구간 전환 시 튀지 않는다.
    const { scrollY } = useScroll();
    const contentY = useTransform(scrollY, [0, 560], [0, 90]);
    const contentOpacity = useTransform(scrollY, [0, 460], [1, 0]);

    useGSAP(
        () => {
            // reduced-motion에서는 GSAP 트윈(인라인 transform)이 CSS 미디어쿼리로 억제되지 않으므로
            // 여기서 직접 건너뛴다. 요소들은 애니메이션 없이 최종 상태로 그대로 보인다.
            if (reduced) {
                return;
            }

            const tl = gsap.timeline({
                defaults: { ease: "power4.out" },
            });

            tl.from(".hero-char", {
                yPercent: 120,
                duration: 1,
                stagger: 0.028,
            })
                .from(".hero-meta", { opacity: 0, y: 18, stagger: 0.1 }, "-=0.55")
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

    const titleLines = ["프론트엔드를", "설계하는 개발자"];

    const onPointerMove = (event: PointerEvent<HTMLElement>) => {
        if (reduced) {
            return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        glowX.set(((event.clientX - rect.left) / rect.width) * 100);
        glowY.set(((event.clientY - rect.top) / rect.height) * 100);
    };

    return (
        <section
            ref={root}
            onPointerMove={onPointerMove}
            className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 pt-24 pb-16"
        >
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: glow }}
            />

            <motion.div
                className="mx-auto w-full max-w-6xl"
                style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
            >
                <div className="hero-meta flex flex-wrap items-center gap-3 font-mono text-xs tracking-widest text-muted uppercase">
                    <span>{profile.role}</span>
                    <span className="h-px w-8 bg-line" />
                    <span>{profile.location}</span>
                </div>

                <h1 className="mt-8 font-display text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] font-bold tracking-tight text-ink">
                    {titleLines.map((line) => (
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

                <p className="hero-meta mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
                    {profile.tagline}
                </p>

                <div className="hero-meta mt-10 flex flex-wrap items-center gap-4">
                    <a
                        href="#projects"
                        className="inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5"
                    >
                        프로젝트 보기
                        <span aria-hidden>→</span>
                    </a>
                    <a
                        href="#about"
                        className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
                    >
                        프로필 보기
                    </a>
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
