import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import type { ProjectBridgeMap } from "@/types/content";

interface ProjectBridgeProps {
    bridge: ProjectBridgeMap;
}

interface WebViewState {
    playing: boolean;
    locked: boolean;
    protect: boolean;
}

const INITIAL: WebViewState = { playing: true, locked: false, protect: false };

/** 처음 고른 것이 이미 있으므로, 램프도 그 말이 닿은 뒤의 상태에서 시작한다. */
function initialState(calls: ProjectBridgeMap["calls"]) {
    return calls[0]?.applies ?? INITIAL;
}

const LAMPS = [
    { key: "playing", on: "재생 중", off: "멈춤" },
    { key: "locked", on: "스크롤 잠김", off: "스크롤 열림" },
    { key: "protect", on: "시력보호 덮임", off: "시력보호 꺼짐" },
] as const;

/**
 * 웹이 앱 안에서 돌 때의 통로.
 *
 * 앱과 웹을 좌우로 나란히 두지 않는다. 이 코드는 네이티브 껍데기 **안쪽**에서 도는 것이고,
 * 그 중첩 자체가 이 프로젝트의 조건이라 그림도 안팎으로 겹쳐 놓는다.
 *
 * 말을 고르면 신호가 그 방향으로 건너가고, 안쪽의 상태 램프가 실제로 바뀐다. 마지막 하나는
 * 아무것도 바뀌지 않는 게 정답인 경우다 — 브라우저에는 받을 창구가 없다.
 */
export function ProjectBridge({ bridge }: ProjectBridgeProps) {
    const { calls, note } = bridge;
    const [picked, setPicked] = useState(0);
    const [state, setState] = useState<WebViewState>(() => initialState(calls));
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

    const call = calls[picked];

    /** 프로젝트가 바뀌면 고른 것도 상태도 처음으로. */
    useEffect(() => {
        setPicked(0);
        setState(initialState(calls));
    }, [calls]);

    const pick = (index: number) => {
        setPicked(index);
        const applies = calls[index]?.applies;
        if (applies) {
            setState(applies);
        }
    };

    const inbound = call?.from === "app";
    const split = Boolean(call?.ios && call?.android);

    return (
        <section className="mt-28 px-6">
            <div className="mx-auto max-w-4xl">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                    Bridge
                </h2>
                <h3 className="mt-4 max-w-2xl font-sans text-2xl leading-tight font-bold tracking-[-0.03em] text-ink sm:text-3xl">
                    {bridge.title}
                </h3>
                <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.8] text-muted">
                    {bridge.lede}
                </p>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
                    {/* 바깥 — 네이티브 껍데기 */}
                    <div className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink uppercase">
                                App
                            </span>
                            <span className="font-mono text-[0.625rem] text-muted">
                                iOS · Android
                            </span>
                        </div>

                        {/* 껍데기와 안쪽 사이 — 신호가 건너는 자리 */}
                        <div className="relative my-4 h-24 sm:h-28">
                            <span
                                aria-hidden
                                className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-line"
                            />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={picked}
                                    initial={
                                        reduced
                                            ? { opacity: 1 }
                                            : { opacity: 0, y: inbound ? -26 : 26 }
                                    }
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduced ? { opacity: 1 } : { opacity: 0 }}
                                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                                    className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
                                >
                                    <span className="font-mono text-[0.625rem] tracking-[0.18em] text-espresso uppercase">
                                        {inbound ? "app → web" : "web → app"}
                                    </span>
                                    {split ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <code className="max-w-full truncate px-2 font-mono text-[0.6875rem] text-ink">
                                                {call.ios}
                                            </code>
                                            <code className="max-w-full truncate px-2 font-mono text-[0.6875rem] text-ink">
                                                {call.android}
                                            </code>
                                        </div>
                                    ) : (
                                        <code className="max-w-full truncate px-2 font-mono text-[0.6875rem] text-ink">
                                            {call?.call}
                                        </code>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* 안쪽 — 이 코드가 도는 곳 */}
                        <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
                            <span className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink uppercase">
                                WebView
                            </span>
                            <p className="mt-1 text-[0.8125rem] text-muted">
                                이 프로젝트의 코드가 도는 곳
                            </p>

                            <ul className="mt-5 flex flex-col gap-2.5">
                                {LAMPS.map((lamp) => {
                                    const on = state[lamp.key];
                                    return (
                                        <li key={lamp.key} className="flex items-center gap-3">
                                            <span
                                                aria-hidden
                                                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                                                    on ? "bg-espresso" : "bg-ink/25"
                                                }`}
                                            />
                                            <span
                                                className={`font-mono text-[0.75rem] transition-colors duration-300 ${
                                                    on ? "text-ink" : "text-muted"
                                                }`}
                                            >
                                                {on ? lamp.on : lamp.off}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    {/* 오가는 말 */}
                    <div>
                        <ul className="flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
                            {calls.map((item, index) => (
                                <li key={item.label}>
                                    <button
                                        type="button"
                                        onClick={() => pick(index)}
                                        aria-pressed={index === picked}
                                        className={`w-full bg-paper px-4 py-3.5 text-left transition-colors ${
                                            index === picked ? "bg-surface" : "hover:bg-surface/60"
                                        }`}
                                    >
                                        <span className="font-mono text-[0.625rem] tracking-[0.18em] text-muted uppercase">
                                            {item.from === "app" ? "app" : "web"}
                                        </span>
                                        <span
                                            className={`mt-1 block text-[0.875rem] leading-snug font-medium ${
                                                index === picked ? "text-espresso" : "text-ink"
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <ol className="mt-5 flex flex-col gap-2">
                            {call?.effects.map((effect) => (
                                <li
                                    key={effect}
                                    className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-ink/80"
                                >
                                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-line" />
                                    {effect}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <p className="mt-8 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-muted">
                    {note}
                </p>
            </div>
        </section>
    );
}
