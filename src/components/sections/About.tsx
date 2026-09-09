import { useRef } from "react";

import { useReducedMotion } from "motion/react";

import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WordReveal } from "@/components/ui/WordReveal";

import { profile } from "@/data/profile";
import { gsap, useGSAP } from "@/lib/gsap";
import { BODY, MEASURE, STACK } from "@/lib/typography";

const details: { label: string; value: string; href?: string }[] = [
    { label: "연락처", value: profile.phone },
    { label: "이메일", value: profile.email, href: `mailto:${profile.email}` },
    { label: "생년월일", value: profile.birth },
    { label: "직군", value: profile.role },
    { label: "위치", value: profile.location },
];

const stats: { to: number; suffix: string; label: string }[] = [
    { to: 6, suffix: "+", label: "년 경력" },
    { to: 24, suffix: "+", label: "프로젝트" },
    { to: 20, suffix: "+", label: "기술 스택" },
];

export function About() {
    const root = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();

    useGSAP(
        () => {
            if (reduced) {
                return;
            }

            // 사진은 스크롤에 매달려 계속 돈다. 지나가는 동안 각도가 바뀌니 판이 살아 있다.
            gsap.fromTo(
                ".about-portrait",
                { rotateY: -16, rotateX: 6, y: 40 },
                {
                    rotateY: 10,
                    rotateX: -4,
                    y: -40,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".about-portrait",
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.6,
                    },
                },
            );

            // 이름은 문자 단위로 한 번만 올라온다.
            gsap.from(".about-char", {
                yPercent: 120,
                duration: 0.9,
                stagger: 0.03,
                ease: "power4.out",
                scrollTrigger: { trigger: ".about-name", start: "top 82%" },
            });

            // 연락처는 왼쪽부터 차례로 켜진다 — 표를 한 줄씩 읽어 내려가는 느낌.
            gsap.from(".about-detail", {
                opacity: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.07,
                ease: "power3.out",
                scrollTrigger: { trigger: ".about-details", start: "top 85%" },
            });

            // 지표는 아래에서 밀려 올라오며 밑줄이 함께 그어진다.
            gsap.from(".about-stat-rule", {
                scaleX: 0,
                duration: 0.9,
                stagger: 0.1,
                ease: "expo.out",
                scrollTrigger: { trigger: ".about-stats", start: "top 88%" },
            });
        },
        { scope: root, dependencies: [reduced] },
    );

    return (
        <section ref={root} id="about" className="scroll-mt-20 px-6 py-20 sm:py-24">
            <div className="mx-auto max-w-6xl">
                <SectionHeading index="01" eyebrow="Profile" title="프로필" />

                <div className="mt-14 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
                    {/* 원근은 바깥, 회전은 안쪽 — 같은 요소에 두면 각도가 평면으로 눌린다. */}
                    <div className="w-32 shrink-0 perspective-[900px] sm:w-36">
                        <Reveal className="group block">
                            <div className="about-portrait overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="aspect-4/5 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                            </div>
                        </Reveal>
                    </div>

                    <div>
                        <h3 className="about-name font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                            <span className="block overflow-hidden pb-[0.06em]">
                                {[...profile.name].map((char, index) => (
                                    <span
                                        // biome-ignore lint/suspicious/noArrayIndexKey: 고정된 이름 문자열이라 인덱스 키가 안전
                                        key={`${char}-${index}`}
                                        className="about-char inline-block whitespace-pre"
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>
                        </h3>
                        <Reveal delay={0.05}>
                            <p className="mt-3 text-lg text-espresso">{profile.role}</p>
                        </Reveal>
                    </div>
                </div>

                {/* 아주 좁은 화면에서는 한 칸이다. 두 칸으로 두면 칸마다 120px밖에 안 남아
                    이메일이 세 줄로 접힌다 — 폭이 아니라 칸 수를 줄이는 게 맞다. */}
                <dl className="about-details mt-12 grid grid-cols-1 gap-x-8 gap-y-6 border-y border-line py-8 min-[30rem]:grid-cols-2 sm:grid-cols-4">
                    {details.map((item) => (
                        /* 그리드 칸은 기본이 `min-width: auto`(= min-content)라, 끊기지
                           않는 이메일 한 줄이 제 칸을 넘어 표 전체를 넓힌다 — 좁은 화면에서
                           지면이 옆으로 밀리던 원인이다. 칸이 줄어들 수 있게 열고, 값은
                           필요할 때만 끊는다. */
                        <div key={item.label} className="about-detail min-w-0">
                            <dt className="font-mono text-xs tracking-wider text-muted uppercase">
                                {item.label}
                            </dt>
                            <dd className="mt-2 text-base wrap-anywhere text-ink">
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        className="transition-colors hover:text-espresso"
                                    >
                                        {item.value}
                                    </a>
                                ) : (
                                    item.value
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>

                {/* 본문은 스크롤이 읽어 준다 — 단어가 하나씩 밝아진다.
                    폭은 상세와 같은 `MEASURE`로 묶는다 — 예전의 48rem은 한 줄이 43자를 넘어
                    다음 줄 첫 글자를 찾는 데 눈이 걸렸다. */}
                <div className={`mt-12 ${MEASURE} ${STACK}`}>
                    {profile.intro.map((paragraph) => (
                        <WordReveal key={paragraph} className={BODY}>
                            {paragraph}
                        </WordReveal>
                    ))}
                </div>

                <div className="about-stats mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-8">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <p className="font-display text-3xl font-bold text-ink sm:text-4xl">
                                <CountUp to={stat.to} suffix={stat.suffix} />
                            </p>
                            <span className="about-stat-rule mt-3 block h-px w-full origin-left bg-espresso/70" />
                            <p className="mt-2 font-mono text-xs text-muted">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
