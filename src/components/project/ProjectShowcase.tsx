import { useEffect, useRef, useState } from "react";

import { BODY, LABEL, LABEL_MUTED, SHOWCASE, TITLE } from "./typography";

import type { Project, ProjectScreen } from "@/types/content";

interface ProjectShowcaseProps {
    screens: ProjectScreen[];
    platform: Project["platform"];
    title: string;
}

/**
 * 화면 전시.
 *
 * 넓은 창에서는 기기 하나가 왼쪽에 붙어 서고, 오른쪽의 설명이 지나가며 그 안의 화면이
 * 바뀐다. 설명 하나가 곧 **무대의 닻**(`data-stage-anchor`)이라, 뒤의 3D 회랑에서 카메라가
 * 서는 자리와 지금 읽는 화면이 언제나 같은 것이다.
 *
 * GSAP pin을 쓰지 않는다. 여기서 필요한 건 진행률이 아니라 "지금 어느 설명이 화면 한가운데에
 * 있는가" 하나뿐이고, 그건 관찰자가 훨씬 싸게 답한다. pin은 스페이서를 끼워 위아래 구간의
 * 여백을 다시 계산하게 만든다 — 레이아웃은 CSS에 맡긴다.
 *
 * 좁은 창에서는 같은 내용을 세로로 흘린다. 반응형으로 **갈아 끼우지 않고 CSS로 감춘다** —
 * 조건부 마운트는 뷰포트 진입 애니메이션을 초기 상태로 굳혀 버린다.
 */
export function ProjectShowcase({ screens, platform, title }: ProjectShowcaseProps) {
    const [active, setActive] = useState(0);
    const marks = useRef<(HTMLDivElement | null)[]>([]);

    /* 이전/다음으로 넘어가면 같은 컴포넌트가 다른 화면 목록을 받는다 — 첫 화면으로 되돌리고
       관찰자도 새 노드에 다시 건다. */
    // biome-ignore lint/correctness/useExhaustiveDependencies: 목록이 갈리면 노드도 갈린다
    useEffect(() => {
        setActive(0);
        const nodes = marks.current.filter((node): node is HTMLDivElement => node !== null);
        if (nodes.length === 0) {
            return;
        }
        // 화면 한가운데 선을 지나는 설명이 활성이다 — 위아래를 반씩 잘라 낸 띠 하나로 잰다.
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const index = nodes.indexOf(entry.target as HTMLDivElement);
                        if (index >= 0) {
                            setActive(index);
                        }
                    }
                }
            },
            { rootMargin: "-50% 0px -50% 0px" },
        );
        for (const node of nodes) {
            observer.observe(node);
        }
        return () => observer.disconnect();
    }, [screens]);

    if (screens.length === 0) {
        return null;
    }

    const mobile = platform === "mobile";
    const frame = `overflow-hidden border border-line bg-surface ${
        mobile ? "aspect-9/19.5 rounded-4xl" : "aspect-16/10 rounded-2xl"
    }`;
    /* 붙어 서는 기기의 크기는 뷰포트 **높이**에 묶는다. 폭으로 잡으면 낮은 노트북에서
       세로 화면이 창을 넘어 위아래가 잘린다. */
    const standing = mobile ? "h-[min(66svh,34rem)]" : "w-full";

    return (
        <section data-stage-zone="screens" className="relative py-24 sm:py-32">
            <div className={SHOWCASE}>
                <header className="max-w-[34rem]">
                    <h2 className={LABEL}>Screens</h2>
                    <p className={`mt-5 ${TITLE}`}>{title}</p>
                </header>

                <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
                    {/* 붙어 서는 기기 — 자리는 그대로 두고 안의 화면만 바뀐다. */}
                    <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:self-start">
                        <div className={`relative mx-auto ${standing} ${frame}`}>
                            {screens.map((screen, index) => (
                                <img
                                    key={screen.name}
                                    src={screen.src}
                                    alt=""
                                    loading={index === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                                        index === active ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <ol className="lg:pt-[18svh] lg:pb-[18svh]">
                        {screens.map((screen, index) => {
                            const on = index === active;
                            return (
                                <li
                                    key={screen.name}
                                    className="flex flex-col justify-center gap-6 py-14 lg:min-h-[58svh] lg:py-0"
                                >
                                    {/* 좁은 창에서는 설명 위에 그 화면이 그대로 선다. */}
                                    <div
                                        className={`w-full max-w-56 self-start lg:hidden ${frame}`}
                                    >
                                        <img
                                            src={screen.src}
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div
                                        ref={(node) => {
                                            marks.current[index] = node;
                                        }}
                                        data-stage-anchor
                                        className={`transition-opacity duration-500 ${
                                            on ? "lg:opacity-100" : "lg:opacity-40"
                                        }`}
                                    >
                                        <p className={LABEL_MUTED}>
                                            <span className="text-espresso tabular-nums">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>{" "}
                                            / {String(screens.length).padStart(2, "0")}
                                        </p>
                                        <h3 className="mt-3 font-display text-xl leading-[1.4] font-medium text-ink sm:text-2xl">
                                            {screen.name}
                                        </h3>
                                        <p className={`mt-4 max-w-[32rem] ${BODY}`}>
                                            {screen.note}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
        </section>
    );
}
