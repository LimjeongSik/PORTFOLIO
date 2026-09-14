import { useEffect, useRef, useState } from "react";

import { BrowserChrome } from "@/components/ui/BrowserShot";

import { BODY, LABEL, LABEL_MUTED, NOTE, SHOWCASE, TITLE } from "@/lib/typography";

import type { ReactNode } from "react";
import type { Project, ProjectScreen } from "@/types/content";

interface ProjectShowcaseProps {
    screens: ProjectScreen[];
    platform: Project["platform"];
    title: string;
    modes?: Project["screenModes"];
    /** 웹 화면의 주소창에 적을 호스트. 화면마다의 `path`가 뒤에 붙는다. */
    host?: string;
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
 *
 * 화면이 두 벌인 프로젝트(테마 두 벌)는 머리에 토글이 선다. **두 벌을 함께 걸어 두고
 * 불투명도로만 바꾼다** — `src`를 갈아 끼우면 아직 받지 않은 쪽에서 한 프레임이 비어,
 * 뒤집는 순간 기기가 깜빡인다.
 */
export function ProjectShowcase({ screens, platform, title, modes, host }: ProjectShowcaseProps) {
    const [active, setActive] = useState(0);
    const [mode, setMode] = useState(0);
    const marks = useRef<(HTMLDivElement | null)[]>([]);

    /* 이전/다음으로 넘어가면 같은 컴포넌트가 다른 화면 목록을 받는다 — 첫 화면으로 되돌리고
       관찰자도 새 노드에 다시 건다. */
    // biome-ignore lint/correctness/useExhaustiveDependencies: 목록이 갈리면 노드도 갈린다
    useEffect(() => {
        setActive(0);
        setMode(0);
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

    /* 한 화면이라도 짝이 없으면 토글을 세우지 않는다 — 뒤집었을 때 어떤 화면만 안 바뀌면
       그건 고장으로 읽힌다. */
    const pair = modes && screens.every((screen) => screen.srcAlt) ? modes : null;
    /* 두 벌은 **넓은 창에서도 좁은 창에서도** 함께 걸어 둔다(codex 리뷰 P2). 한쪽만
       `src`를 갈아 끼우면 처음 뒤집는 순간 열 장을 그때부터 받기 시작해 프레임이 비거나
       지난 장이 남는다. */
    const variantsOf = (screen: ProjectScreen) =>
        pair && screen.srcAlt ? [screen.src, screen.srcAlt] : [screen.src];
    const shown = pair ? mode : 0;

    /* 토글은 **구간 내내 따라다닌다.** 머리에 한 번 세웠더니 스크롤이 빨라 지나쳐 버리고,
       화면을 열 장 읽는 동안 되돌아갈 길이 없었다(사용자 지적). 넓은 창에서는 붙어 선 기기
       아래에, 좁은 창에서는 지면 위쪽에 붙는다. 같은 상태를 두 자리가 나눠 쓰고 지금 창에서
       보이지 않는 쪽은 CSS로 감춘다 — 조건부 마운트는 `lg` 경계를 넘을 때 상태를 잃는다. */
    const toggle = pair ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
            <span className={LABEL}>화면 테마</span>
            {/* 지면이 어두운 프로젝트에서는 테두리와 글자가 함께 가라앉아 **토글이 있는 줄도
                모른다**(사용자 지적 둘). 판은 지면색으로 거의 불투명하게 채워 뒤를 가리고,
                고르지 않은 쪽 글자도 본문과 같은 밝기로 둔다. **`backdrop-blur`는 쓰지
                않는다** — 매 프레임 다시 그려지는 WebGL 캔버스 위에 떠 있어서, 흐리려면
                합성기가 프레임마다 뒤를 다시 읽는다(`Navbar`와 같은 이유). */}
            <fieldset className="inline-flex rounded-full border border-ink/30 bg-paper/92 p-1 shadow-lg">
                <legend className="sr-only">화면 테마</legend>
                {pair.labels.map((label, index) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => setMode(index)}
                        aria-pressed={index === mode}
                        className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                            index === mode ? "bg-espresso text-paper" : "text-ink hover:bg-ink/10"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </fieldset>
        </div>
    ) : null;

    const mobile = platform === "mobile";
    const frame = `overflow-hidden border border-line bg-surface ${
        mobile ? "aspect-9/19.5 rounded-4xl" : "aspect-16/10 rounded-2xl"
    }`;
    /* 붙어 서는 기기의 크기는 뷰포트 **높이**에 묶는다. 폭으로 잡으면 낮은 노트북에서
       세로 화면이 창을 넘어 위아래가 잘린다. */
    const standing = mobile ? "h-[min(66svh,34rem)]" : "w-full";
    /* 웹 화면은 가로 판이라 세로 폰의 기둥 폭(20rem)에 넣으면 글자가 읽히지 않는다 — 기기
       쪽에 폭을 더 주고 설명을 좁힌다. 좁은 창의 인라인 화면도 같은 이유로 폭 상한을 푼다. */
    const columns = mobile
        ? "lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24"
        : "lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16";
    const inline = mobile ? "max-w-56" : "max-w-xl";
    /* 잘라 둔 웹 화면은 머리(내비게이션·제목)부터 읽혀야 한다 — 가운데 기준으로 자르면 위가 날아간다. */
    const fit = mobile ? "object-cover" : "object-cover object-top";

    /* 웹 화면은 맨 판이 아니라 브라우저 창에 담는다 — 흰 캡처가 둥근 사각형에 담기면 페이지가
       아니라 이미지 한 장으로 읽혔다(사용자 지적). 주소창은 그 화면의 경로를 따라 바뀐다.
       이미지는 창의 16:10 몸통 안에서만 겹치므로, 크롬 한 줄이 이미지를 밀어 내지 않는다. */
    const addressOf = (screen: ProjectScreen | undefined) =>
        host ? `${host}${screen?.path && screen.path !== "/" ? screen.path : ""}` : screen?.path;
    const shell = (children: ReactNode, url: string | undefined, placement: string) =>
        mobile ? (
            <div className={`relative ${placement} ${frame}`}>{children}</div>
        ) : (
            <div
                className={`@container overflow-hidden rounded-xl bg-[#0b0f19] ring-1 ring-white/15 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] ${placement}`}
            >
                <BrowserChrome url={url} />
                <div className="relative aspect-16/10 bg-surface">{children}</div>
            </div>
        );

    return (
        <section data-stage-zone="screens" className="relative py-24 sm:py-32">
            <div className={SHOWCASE}>
                <header className="max-w-[34rem]">
                    <h2 className={LABEL}>Screens</h2>
                    <p className={`mt-5 ${TITLE}`}>{title}</p>
                    {pair ? <p className={`mt-6 ${NOTE}`}>{pair.note}</p> : null}
                </header>

                {/* 좁은 창 — 고정 네비바(h-16)가 z-50으로 덮으므로 그 아래로 내려 붙인다. */}
                {toggle ? (
                    <div className="sticky top-20 z-20 mt-10 flex justify-center lg:hidden">
                        {toggle}
                    </div>
                ) : null}

                <div className={`mt-14 lg:grid ${columns}`}>
                    {/* 붙어 서는 기기 — 자리는 그대로 두고 안의 화면만 바뀐다. */}
                    <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:items-center lg:justify-center lg:gap-7 lg:self-start">
                        {shell(
                            screens.flatMap((screen, index) =>
                                variantsOf(screen).map((src, variant) => (
                                    <img
                                        key={src}
                                        src={src}
                                        alt=""
                                        loading={index === 0 && variant === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                        className={`absolute inset-0 h-full w-full ${fit} transition-opacity duration-500 ease-out ${
                                            index === active && variant === shown
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                )),
                            ),
                            addressOf(screens[active]),
                            standing,
                        )}
                        {toggle}
                    </div>

                    {/* 설명 한 칸이 한 화면(100svh)이다. 58svh였을 때는 트랙패드를 한 번 쓸면 관성까지 두 장이
                        지나갔다(사용자 지적). 휠을 가로채 한 장씩 넘기는 방식은 부자연스럽다는
                        지적에 걷었다 — 스크롤은 평소대로 두고 한 장이 머무는 거리만 늘린다. */}
                    <ol className="lg:pt-[18svh] lg:pb-[18svh]">
                        {screens.map((screen, index) => {
                            const on = index === active;
                            return (
                                <li
                                    key={screen.name}
                                    className="flex flex-col justify-center gap-6 py-14 lg:min-h-[100svh] lg:py-0"
                                >
                                    {/* 좁은 창에서는 설명 위에 그 화면이 그대로 선다 —
                                        화면은 가운데, 글은 왼쪽이다. 한글 본문까지 가운데로
                                        맞추면 줄 시작이 들쭉날쭉해 읽기 어렵다. */}
                                    {shell(
                                        variantsOf(screen).map((src, variant) => (
                                            <img
                                                key={src}
                                                src={src}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                                className={`absolute inset-0 h-full w-full ${fit} transition-opacity duration-500 ease-out ${
                                                    variant === shown ? "opacity-100" : "opacity-0"
                                                }`}
                                            />
                                        )),
                                        addressOf(screen),
                                        `w-full ${inline} self-center lg:hidden`,
                                    )}

                                    <div
                                        ref={(node) => {
                                            marks.current[index] = node;
                                        }}
                                        data-stage-anchor
                                        className={`transition-opacity duration-500 ${
                                            on ? "lg:opacity-100" : "lg:opacity-60"
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
