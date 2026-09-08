import { useEffect, useRef } from "react";

import { About } from "@/components/sections/About";
import { Bridge } from "@/components/sections/Bridge";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Roomy } from "@/components/stage/Roomy";
import { useMoodZone } from "@/hooks/useMoodZone";

import {
    CRAFT_MOOD,
    clearMood,
    isMoodMounted,
    PROFILE_MOOD,
    SKILL_MOOD,
    setMood,
    VOID_MOOD,
} from "@/lib/atmosphere";
import { isCrossing } from "@/lib/transition";

/** 다리에 흘려보낼 낱말. 이력의 핵심만 큰 글자로 지나간다. */
const BRIDGE_WORDS = ["FRONTEND", "REACT", "REACT NATIVE", "TYPESCRIPT", "INTERACTION", "SEOUL"];

export function Home() {
    const aboutZone = useRef<HTMLDivElement>(null);
    const skillsZone = useRef<HTMLDivElement>(null);
    const experienceZone = useRef<HTMLDivElement>(null);

    // 첫 페인트는 트리거를 기다리지 않고 히어로의 방으로 바로 맞춘다 — 단, 구간 트리거는
    // 레이아웃 이펙트라 이보다 먼저 돈다. 복원된 스크롤이 이미 어느 구간 안이면 그쪽이 먼저
    // 말했으므로 덮지 않는다(덮으면 다음 경계를 넘을 때까지 히어로 색으로 남는다).
    // 홈을 벗어날 때는 주입한 값을 걷어 프로젝트 상세가 자기 테마를 그대로 얹게 한다.
    useEffect(() => {
        if (!isMoodMounted()) {
            // 상세에서 돌아온 것이면 프로젝트 색에서 **물러나며** 온다 — 즉시 갈아 끼우면
            // 카메라가 갤러리로 날아오는 동안 지면만 한 프레임에 뒤집힌다. 반대로 처음 열린
            // 화면에서는 즉시여야 한다: 기본값에서 히어로 색으로 0.85초 동안 물드는 것은
            // 전환이 아니라 덜 그려진 화면이다(`applyTheme`와 같은 규칙).
            setMood("hero", VOID_MOOD, { scene: 0, immediate: !isCrossing() });
        }
        return () => clearMood(isCrossing());
    }, []);

    useMoodZone(aboutZone, "about", PROFILE_MOOD, 1);
    useMoodZone(skillsZone, "skills", SKILL_MOOD, 2);
    useMoodZone(experienceZone, "experience", CRAFT_MOOD, 3);

    return (
        <>
            {/* 무대(복도 → 비석 → 드럼 → 계단 → 갤러리)는 `App`이 라우터 바깥에서 들고 있다.
                여기서는 그 앞에 앉는 글과, 글이 읽히게 지면을 눌러 주는 베일만 둔다. */}
            {/* 글이 앉는 한가운데를 아주 얕게 눌러 준다. 판은 이미 가까워질수록 지워지므로
                가릴 일이 없지만, 낱말 판이 스칠 때의 대비까지 이 한 겹이 받아 준다. */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(52% 44% at 50% 50%, color-mix(in srgb, var(--color-paper) 72%, transparent) 0%, color-mix(in srgb, var(--color-paper) 38%, transparent) 58%, transparent 100%)",
                }}
            />
            <main className="relative z-10">
                <Hero />
                {/* 히어로 무드를 그대로 쥔 채 다음 구간으로 눈을 넘긴다 — 어느 존에도 속하지 않는다. */}
                <Bridge words={BRIDGE_WORDS} />
                <Roomy zoneRef={aboutZone} zone="about" length={280}>
                    <About />
                </Roomy>
                <Roomy zoneRef={skillsZone} zone="skills" length={300}>
                    <Skills />
                </Roomy>
                {/* 경력은 항목이 다섯이라 화면 하나에 담기지 않는다 — 붙이지 않고 흐르게 둔다.
                    카메라는 구간 상자가 아니라 항목마다의 닻(data-stage-anchor)을 따라 오르므로,
                    여기 최소 높이는 마지막 항목을 읽은 뒤 갤러리로 날아갈 여유만 준다. */}
                <div ref={experienceZone} data-stage-zone="experience" className="min-h-[240svh]">
                    <Experience />
                </div>
                <Projects />
            </main>
        </>
    );
}
