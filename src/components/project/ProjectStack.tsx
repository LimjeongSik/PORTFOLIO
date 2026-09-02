import { useEffect, useRef } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

import type { ProjectCase } from "@/types/content";

interface ProjectStackProps {
    cases: ProjectCase[];
}

const ROWS = [
    { key: "problem", label: "문제" },
    { key: "approach", label: "판단" },
    { key: "result", label: "결과" },
] as const;

/** 스택에서 앞 카드가 위로 내미는 폭(px). 몇 장이 쌓였는지 옆으로 보인다. */
const PEEK = 14;
const TOP = 96;

/**
 * 사례를 넘기는 대신 쌓는다. 다음 사례가 올라와 앞 사례를 덮고, 덮인 카드는 위쪽 테두리만
 * 남겨 몇 장째인지 알린다. 좁은 화면·reduced-motion에서는 그냥 이어지는 카드 목록이다.
 */
export function ProjectStack({ cases }: ProjectStackProps) {
    const root = useRef<HTMLOListElement>(null);
    const bodies = useRef<(HTMLElement | null)[]>([]);
    const wide = useMediaQuery("(min-width: 1024px)");
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
    const stacking = wide && !reduced && cases.length > 1;

    /**
     * 카드 높이를 제일 큰 것에 맞춘다. 뒤 카드가 앞 카드보다 짧으면 앞 카드 밑단이 그만큼
     * 삐져나와 테두리가 겹쳐 보인다(측정값: 516 / 492 / 492 / 492 → 10px 노출).
     * 높이를 바꾸면 스크롤 위치도 달라지므로 ScrollTrigger를 다시 재운다.
     */
    useEffect(() => {
        if (!stacking) {
            return;
        }

        // 프로젝트가 바뀌면 잰 노드가 트리에서 빠지므로, 목록을 `cases`에서 다시 끌어온다.
        const cards = cases
            .map((_, index) => bodies.current[index])
            .filter((node): node is HTMLElement => node !== null);
        if (cards.length === 0) {
            return;
        }

        const measure = () => {
            for (const card of cards) {
                card.style.minHeight = "";
            }
            // offsetHeight는 레이아웃 값이라 GSAP이 건 scale 변환의 영향을 받지 않는다.
            const tallest = Math.max(...cards.map((card) => card.offsetHeight));
            for (const card of cards) {
                card.style.minHeight = `${tallest}px`;
            }
            ScrollTrigger.refresh();
        };

        measure();
        window.addEventListener("resize", measure);
        // 서브셋 폰트가 늦게 붙으면 줄 수가 달라져 방금 잰 값이 무효가 된다.
        document.fonts?.ready.then(measure);

        return () => {
            window.removeEventListener("resize", measure);
            for (const card of cards) {
                card.style.minHeight = "";
            }
        };
    }, [stacking, cases]);

    useGSAP(
        () => {
            if (!stacking) {
                return;
            }

            const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
            const tweens = cards.slice(0, -1).map((card, index) =>
                gsap.to(card, {
                    scale: 0.97,
                    ease: "none",
                    scrollTrigger: {
                        // 덮으러 오는 다음 카드가 이 카드의 진행을 정한다.
                        trigger: cards[index + 1],
                        start: "top bottom",
                        end: `top top+=${TOP}`,
                        scrub: true,
                    },
                }),
            );

            return () => {
                for (const tween of tweens) {
                    tween.scrollTrigger?.kill();
                    tween.kill();
                }
            };
        },
        { scope: root, dependencies: [stacking, cases.length] },
    );

    if (cases.length === 0) {
        return null;
    }

    return (
        <section className="mt-24 px-6">
            <div className="mx-auto max-w-4xl">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                    Cases
                </h2>
                <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
                    무엇을 했는지가 아니라, 무엇을 보고 그렇게 정했는지.
                </p>

                <ol ref={root} className={stacking ? "mt-10" : "mt-10 flex flex-col gap-8"}>
                    {cases.map((item, index) => (
                        <li
                            key={item.label}
                            className={stacking ? "stack-card sticky origin-top mb-28" : undefined}
                            style={stacking ? { top: TOP + index * PEEK } : undefined}
                        >
                            <article
                                ref={(node) => {
                                    bodies.current[index] = node;
                                }}
                                className="rounded-3xl border border-line bg-paper p-7 shadow-[0_24px_60px_-40px_var(--color-ink)] sm:p-9"
                            >
                                <div className="flex items-baseline gap-4">
                                    <span className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso tabular-nums">
                                        CASE {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span aria-hidden className="h-px flex-1 bg-line" />
                                    <span className="font-mono text-[0.6875rem] text-muted tabular-nums">
                                        {String(index + 1).padStart(2, "0")} /{" "}
                                        {String(cases.length).padStart(2, "0")}
                                    </span>
                                </div>

                                <h3 className="mt-5 font-sans text-xl leading-snug font-bold tracking-[-0.03em] text-ink sm:text-2xl">
                                    {item.label}
                                </h3>

                                <dl className="mt-6 flex flex-col gap-4">
                                    {ROWS.map((row) => (
                                        <div
                                            key={row.key}
                                            className="grid gap-1.5 sm:grid-cols-[3.5rem_1fr] sm:gap-5"
                                        >
                                            <dt
                                                className={`font-mono text-[0.6875rem] tracking-[0.18em] uppercase sm:mt-1 ${
                                                    row.key === "result"
                                                        ? "text-espresso"
                                                        : "text-muted"
                                                }`}
                                            >
                                                {row.label}
                                            </dt>
                                            <dd className="text-[0.9375rem] leading-relaxed text-ink/85">
                                                {item[row.key]}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                {item.metrics && item.metrics.length > 0 ? (
                                    <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5 sm:ml-[4.5rem]">
                                        {item.metrics.map((metric) => (
                                            <div key={metric.label}>
                                                <dt className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                                                    {metric.label}
                                                </dt>
                                                <dd className="mt-1 font-sans text-lg font-bold text-ink tabular-nums">
                                                    {metric.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : null}
                            </article>
                        </li>
                    ))}
                    {/* 다 쌓인 스택이 한 화면쯤 머물 자리. 패딩이 아니라 자리를 차지하는
                        요소여야 sticky가 그만큼 더 붙어 있는다. */}
                    {stacking ? <li aria-hidden className="h-[65vh]" /> : null}
                </ol>
            </div>
        </section>
    );
}
