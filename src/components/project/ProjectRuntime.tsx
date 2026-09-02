import { useRef, useState } from "react";

import { motion, useReducedMotion } from "motion/react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { gsap, useGSAP } from "@/lib/gsap";

import type { ReactNode } from "react";
import type { ProjectRuntimeMap, ProjectRuntimeNode } from "@/types/content";

interface ProjectRuntimeProps {
    runtime: ProjectRuntimeMap;
}

type Group = "boot" | "tree";

interface Selection {
    group: Group;
    index: number;
}

const LABEL = "font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase";

/**
 * 부팅 순서와 Provider 중첩을 눌러 볼 수 있게 편 그림. 자리를 바꿔도 에러는 안 나지만
 * 기능만 조용히 사라지는 곳이 있어서, 그 자리에 표시를 달고 무엇이 깨지는지 옆에 적는다.
 */
export function ProjectRuntime({ runtime }: ProjectRuntimeProps) {
    const root = useRef<HTMLDivElement>(null);
    const [selection, setSelection] = useState<Selection>({ group: "boot", index: 0 });
    const reduced = useReducedMotion();
    // 좁은 화면에서는 설명이 오른쪽 열이 아니라 누른 목록 바로 아래에 붙는다.
    const wide = useMediaQuery("(min-width: 1024px)");

    const nodes = selection.group === "boot" ? runtime.boot : runtime.tree;
    const active: ProjectRuntimeNode | undefined = nodes[selection.index];

    useGSAP(
        () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                return;
            }

            // 바깥 겹부터 안쪽으로 한 장씩 접혀 들어오듯 열린다.
            const tween = gsap.from(".runtime-layer", {
                opacity: 0,
                y: -8,
                duration: 0.45,
                stagger: 0.07,
                ease: "power2.out",
                scrollTrigger: { trigger: ".runtime-tree", start: "top 78%", once: true },
            });

            return () => {
                tween.scrollTrigger?.kill();
                tween.kill();
            };
        },
        { scope: root },
    );

    const select = (group: Group, index: number) => () => setSelection({ group, index });

    const isOn = (group: Group, index: number) =>
        selection.group === group && selection.index === index;

    /** 바깥 겹이 안쪽 겹을 감싸도록 재귀로 그린다 — App.tsx의 중첩 순서 그대로. */
    const nest = (depth: number): ReactNode => {
        if (depth >= runtime.tree.length) {
            return (
                <p className="rounded-lg border border-line border-dashed px-2.5 py-2 text-center font-mono text-[0.6875rem] text-muted">
                    {runtime.payload}
                </p>
            );
        }

        const node = runtime.tree[depth];
        const on = isOn("tree", depth);

        return (
            <div
                className={`runtime-layer rounded-xl border p-1.5 transition-colors duration-300 ${
                    on ? "border-espresso bg-sand/50" : "border-line"
                }`}
            >
                <button
                    type="button"
                    onClick={select("tree", depth)}
                    onFocus={select("tree", depth)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left font-mono text-[0.6875rem] transition-colors duration-300 ${
                        on ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                >
                    <span className="truncate">{node.name}</span>
                    {node.caution ? (
                        <span className="ml-auto flex shrink-0 items-center">
                            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-espresso" />
                            <span className="sr-only">순서에 제약이 있는 자리</span>
                        </span>
                    ) : null}
                </button>
                <div className="mt-1.5">{nest(depth + 1)}</div>
            </div>
        );
    };

    const detail = (
        <motion.div
            key={`${selection.group}-${selection.index}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-line bg-surface p-6 sm:p-7"
        >
            <p className={LABEL}>{selection.group === "boot" ? "부팅 순서" : "Provider 중첩"}</p>
            <p className="mt-3 font-mono text-base text-ink">{active?.name}</p>
            <p className="mt-4 text-[0.9375rem] leading-[1.75] text-ink/85">{active?.role}</p>
            {active?.caution ? (
                <div className="mt-5 border-t border-line pt-4">
                    <p className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-espresso" />
                        자리를 바꾸면
                    </p>
                    <p className="mt-2.5 text-[0.9375rem] leading-[1.75] text-ink/85">
                        {active.caution}
                    </p>
                </div>
            ) : null}
        </motion.div>
    );

    const note = <p className="text-[0.8125rem] leading-relaxed text-muted">{runtime.note}</p>;

    return (
        <section ref={root} className="mt-24 px-6">
            <div className="mx-auto max-w-5xl">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                    Runtime
                </h2>
                <p className="mt-4 max-w-2xl font-sans text-2xl leading-snug font-bold tracking-[-0.03em] text-ink sm:text-3xl">
                    {runtime.title}
                </p>
                <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
                    {runtime.lede}
                </p>

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
                    <div>
                        <h3 className={LABEL}>부팅 순서</h3>
                        <ol className="mt-4 border-l border-line">
                            {runtime.boot.map((node, index) => {
                                const on = isOn("boot", index);
                                return (
                                    <li key={node.name} className="relative">
                                        <button
                                            type="button"
                                            onClick={select("boot", index)}
                                            onFocus={select("boot", index)}
                                            aria-pressed={on}
                                            className="flex w-full items-center gap-3 py-2 pl-5 text-left"
                                        >
                                            <span
                                                aria-hidden
                                                className={`absolute top-1/2 left-0 h-px -translate-y-1/2 transition-all duration-300 ${
                                                    on ? "w-4 bg-espresso" : "w-2.5 bg-line"
                                                }`}
                                            />
                                            <span
                                                className={`font-mono text-[0.625rem] tabular-nums transition-colors duration-300 ${
                                                    on ? "text-espresso" : "text-muted"
                                                }`}
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span
                                                className={`font-mono text-[0.8125rem] transition-colors duration-300 ${
                                                    on ? "text-ink" : "text-muted hover:text-ink"
                                                }`}
                                            >
                                                {node.name}
                                            </span>
                                            {node.caution ? (
                                                <span className="ml-2 flex items-center">
                                                    <span
                                                        aria-hidden
                                                        className="h-1.5 w-1.5 rounded-full bg-espresso"
                                                    />
                                                    <span className="sr-only">
                                                        순서에 제약이 있는 자리
                                                    </span>
                                                </span>
                                            ) : null}
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>

                        {!wide && selection.group === "boot" ? (
                            <div className="mt-6">{detail}</div>
                        ) : null}

                        <h3 className={`${LABEL} mt-9 block`}>Provider 중첩</h3>
                        <div className="runtime-tree mt-4">{nest(0)}</div>

                        {!wide && selection.group === "tree" ? (
                            <div className="mt-6">{detail}</div>
                        ) : null}

                        {!wide ? <div className="mt-4">{note}</div> : null}
                    </div>

                    {wide ? (
                        <div className="sticky top-24 self-start">
                            {detail}
                            <div className="mt-4">{note}</div>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
