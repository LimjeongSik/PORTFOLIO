import { useCallback, useEffect, useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import type { ProjectKeyring as Keyring } from "@/types/content";

interface ProjectKeyringProps {
    keyring: Keyring;
}

/** 실제 1초에 흘려보내는 앱 시간(초). 30초 임계가 눈으로 좇을 수 있는 속도. */
const SPEED = 20;

/** 갱신 표시가 켜져 있는 시간(초, 앱 시간 기준). */
const FLASH = 40;

function clock(seconds: number) {
    const total = Math.max(0, Math.ceil(seconds));
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * 열쇠 네 개가 각자 다른 속도로 닳는 시간축.
 *
 * 이 구간의 요점은 "토큰이 넷"이 아니라 **넷의 시계가 따로 돈다**는 것이라, 숫자를 적어 두는
 * 대신 실제로 시간을 흘려보낸다. 임계(30초 · 60초)와 갱신 경로는 데이터 그대로고, 수명만
 * `SPEED`배로 감는다.
 *
 * 갱신은 열쇠가 아니라 **경로 단위**로 일어난다. `/token/refresh` 한 번이 Access와
 * Sub-Profile을 같은 응답으로 함께 채우는 게 실제 코드의 모양이고, 동시에 임계 아래로
 * 떨어져도 요청은 한 번뿐이라는 것(단일 비행)도 여기서 그대로 드러난다.
 *
 * 매 프레임 바뀌는 값은 state로 들지 않는다. 네 트랙의 폭과 시각 텍스트를 60fps로 리렌더하면
 * 이 페이지의 다른 스크롤 장치까지 같이 끌려 내려간다 — DOM에 직접 쓴다.
 */
export function ProjectKeyring({ keyring }: ProjectKeyringProps) {
    const { keys, burst, note } = keyring;

    const root = useRef<HTMLDivElement>(null);
    const fills = useRef<(HTMLDivElement | null)[]>([]);
    const times = useRef<(HTMLSpanElement | null)[]>([]);
    const rows = useRef<(HTMLLIElement | null)[]>([]);

    /** 남은 수명(앱 시간, 초). 프레임마다 줄어든다. */
    const lives = useRef<number[]>(keys.map((key) => key.life));
    /** 갱신 표시가 아직 켜져 있어야 할 시간. 0이면 꺼진 상태. */
    const flashes = useRef<number[]>(keys.map(() => 0));

    /** 경로별 갱신 횟수 — 화면에는 이 값만 이따금 내보낸다. */
    const [calls, setCalls] = useState<Record<string, number>>({});
    /** 리프레시가 만료돼 세션이 통째로 버려진 직후인지 */
    const [dropped, setDropped] = useState(false);
    /** 방금 터뜨린 동시 요청 수. 0이면 표시하지 않는다. */
    const [inflight, setInflight] = useState(0);

    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
    const [visible, setVisible] = useState(false);

    const paths = [...new Set(keys.map((key) => key.renewVia).filter((via) => via !== undefined))];

    /** 화면 밖에서 시계를 돌릴 이유가 없다. */
    useEffect(() => {
        const node = root.current;
        if (!node) {
            return;
        }
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            rootMargin: "120px",
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    /** 프로젝트가 바뀌면 시계도 처음부터 — 인접 링크로 넘어와도 이 컴포넌트는 살아 있다. */
    useEffect(() => {
        lives.current = keys.map((key) => key.life);
        flashes.current = keys.map(() => 0);
        setCalls({});
        setDropped(false);
        setInflight(0);
    }, [keys]);

    useEffect(() => {
        if (reduced || !visible) {
            return;
        }

        let raf = 0;
        let last = performance.now();
        /** 프레임 안에서 모인 갱신을 경로별로 합친다 — 같은 경로면 요청은 한 번이다. */
        let pending: Record<string, number> = {};
        let flushAt = 0;

        const tick = (now: number) => {
            const delta = ((now - last) / 1000) * SPEED;
            last = now;

            const fired = new Set<string>();
            let expired = false;

            keys.forEach((key, index) => {
                lives.current[index] -= delta;
                flashes.current[index] = Math.max(0, flashes.current[index] - delta);

                if (key.renewVia) {
                    if (lives.current[index] <= key.renewAt) {
                        fired.add(key.renewVia);
                    }
                } else if (lives.current[index] <= 0) {
                    // 물어볼 데가 없는 열쇠가 죽었다. 저장소를 비우고 로그인부터 다시.
                    expired = true;
                }
            });

            for (const path of fired) {
                pending[path] = (pending[path] ?? 0) + 1;
                keys.forEach((key, index) => {
                    if (key.renewVia === path) {
                        lives.current[index] = key.life;
                        flashes.current[index] = FLASH;
                    }
                });
            }

            if (expired) {
                lives.current = keys.map((key) => key.life);
                flashes.current = keys.map(() => 0);
                pending = {};
                setDropped(true);
                setCalls({});
                window.setTimeout(() => setDropped(false), 2200);
            }

            keys.forEach((key, index) => {
                const left = lives.current[index];
                const fill = fills.current[index];
                if (fill) {
                    fill.style.transform = `scaleX(${Math.max(0, Math.min(1, left / key.life))})`;
                }
                const time = times.current[index];
                if (time) {
                    time.textContent = clock(left);
                }
                const row = rows.current[index];
                if (row) {
                    const warned = key.renewVia ? left <= key.renewAt * 2 : left <= key.life * 0.15;
                    row.dataset.state =
                        flashes.current[index] > 0 ? "renewed" : warned ? "warned" : "running";
                }
            });

            // 카운터는 초당 몇 번만 내보낸다. 프레임마다 setState하면 트랙이 끊긴다.
            if (Object.keys(pending).length > 0 && now - flushAt > 200) {
                flushAt = now;
                const merged = pending;
                pending = {};
                setCalls((prev) => {
                    const next = { ...prev };
                    for (const [path, count] of Object.entries(merged)) {
                        next[path] = (next[path] ?? 0) + count;
                    }
                    return next;
                });
            }

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [keys, reduced, visible]);

    /**
     * 요청 여러 개를 같은 순간에 밀어 넣는다. 임계 아래로 함께 떨어져도 다음 프레임에서
     * 경로가 하나로 묶이기 때문에, 갱신 요청은 결국 한 번만 나간다.
     */
    const fire = useCallback(() => {
        keys.forEach((key, index) => {
            if (key.renewVia) {
                lives.current[index] = Math.min(lives.current[index], key.renewAt + 0.4);
            }
        });
        setInflight(burst);
        window.setTimeout(() => setInflight(0), 1400);
    }, [keys, burst]);

    return (
        <section ref={root} className="mt-28 px-6">
            <div className="mx-auto max-w-4xl">
                <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-espresso uppercase">
                    Keyring
                </h2>
                <h3 className="mt-4 max-w-2xl font-sans text-2xl leading-tight font-bold tracking-[-0.03em] text-ink sm:text-3xl">
                    {keyring.title}
                </h3>
                <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.8] text-muted">
                    {keyring.lede}
                </p>

                <ul className="mt-10 flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
                    {keys.map((key, index) => (
                        <li
                            key={key.name}
                            ref={(node) => {
                                rows.current[index] = node;
                            }}
                            data-state="running"
                            className="group bg-paper p-5 sm:p-6"
                        >
                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                <h4 className="font-sans text-base font-bold tracking-[-0.02em] text-ink">
                                    {key.name}
                                </h4>
                                <code className="font-mono text-[0.6875rem] text-muted">
                                    {key.header}
                                </code>
                                <span className="ml-auto flex items-baseline gap-2">
                                    <span
                                        ref={(node) => {
                                            times.current[index] = node;
                                        }}
                                        className="font-mono text-sm tabular-nums text-muted transition-colors duration-300 group-data-[state=renewed]:text-espresso group-data-[state=warned]:text-espresso"
                                    >
                                        {clock(key.life)}
                                    </span>
                                    <span className="font-mono text-[0.625rem] text-muted">
                                        남음
                                    </span>
                                </span>
                            </div>

                            <p className="mt-1 text-[0.8125rem] text-muted">{key.opens}</p>

                            {/* 트랙 — 채움은 transform으로만 움직인다(레이아웃을 건드리지 않는다) */}
                            <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-sand">
                                <div
                                    ref={(node) => {
                                        fills.current[index] = node;
                                    }}
                                    className="h-full origin-left rounded-full bg-ink/45 transition-colors duration-300 group-data-[state=renewed]:bg-espresso group-data-[state=warned]:bg-espresso"
                                />
                                {key.renewAt > 0 ? (
                                    <span
                                        aria-hidden
                                        className="absolute top-0 h-full w-px bg-ink/45"
                                        style={{ left: `${(key.renewAt / key.life) * 100}%` }}
                                    />
                                ) : null}
                            </div>

                            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                {key.renewVia ? (
                                    <code className="font-mono text-[0.6875rem] text-espresso">
                                        {key.renewAt}초 아래 → {key.renewVia}
                                    </code>
                                ) : (
                                    <code className="font-mono text-[0.6875rem] text-muted">
                                        갱신 경로 없음
                                    </code>
                                )}
                            </div>

                            <p className="mt-2 max-w-2xl text-[0.8125rem] leading-[1.75] text-ink/70">
                                {key.note}
                            </p>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <button
                        type="button"
                        onClick={fire}
                        disabled={reduced}
                        className="rounded-full border border-line px-4 py-2 font-mono text-[0.6875rem] text-ink transition-colors hover:border-espresso hover:text-espresso disabled:opacity-40"
                    >
                        요청 {burst}개를 같은 순간에 보낸다
                    </button>

                    <dl className="flex flex-wrap gap-x-8 gap-y-2">
                        {paths.map((path) => (
                            <div key={path} className="flex items-baseline gap-2">
                                <dt className="font-mono text-[0.6875rem] text-muted">{path}</dt>
                                <dd className="font-mono text-sm tabular-nums text-ink">
                                    {calls[path] ?? 0}회
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <p
                    aria-live="polite"
                    className="mt-4 font-mono text-[0.6875rem] text-espresso empty:mt-0"
                >
                    {dropped
                        ? "리프레시 만료 — 저장소를 비우고 로그인으로 보냈습니다."
                        : inflight > 0
                          ? `요청 ${inflight}개가 동시에 임계에 걸렸지만, 갱신은 경로마다 한 번입니다.`
                          : ""}
                </p>

                <p className="mt-6 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-muted">
                    {reduced ? "동작 최소화 설정이라 시계를 세워 뒀습니다. " : ""}
                    {note}
                </p>
            </div>
        </section>
    );
}
