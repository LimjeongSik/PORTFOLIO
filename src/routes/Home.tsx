import { lazy, Suspense, useEffect, useRef } from "react";

import { About } from "@/components/sections/About";
import { Bridge } from "@/components/sections/Bridge";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { useMoodZone } from "@/hooks/useMoodZone";

import {
    CRAFT_MOOD,
    clearMood,
    PROFILE_MOOD,
    SKILL_MOOD,
    setMood,
    VOID_MOOD,
} from "@/lib/atmosphere";

/* three는 압축 후 100KB를 넘는다. 첫 페인트를 이 청크에 묶지 않으려고 따로 떼어 늦게 받는다 —
   배경이 없어도 지면색은 이미 칠해져 있어서 늦게 붙는 것이 티나지 않는다. */
const HomeStage = lazy(() => import("@/components/sections/HomeStage"));

/** 다리에 흘려보낼 낱말. 이력의 핵심만 큰 글자로 지나간다. */
const BRIDGE_WORDS = ["FRONTEND", "REACT", "REACT NATIVE", "TYPESCRIPT", "INTERACTION", "SEOUL"];

export function Home() {
    const aboutZone = useRef<HTMLDivElement>(null);
    const skillsZone = useRef<HTMLDivElement>(null);
    const experienceZone = useRef<HTMLDivElement>(null);

    // 첫 페인트는 트리거를 기다리지 않고 히어로의 방으로 바로 맞춘다.
    // 홈을 벗어날 때는 주입한 값을 걷어 프로젝트 상세가 자기 테마를 그대로 얹게 한다.
    useEffect(() => {
        setMood("hero", VOID_MOOD, { immediate: true, scene: 0 });
        return () => clearMood();
    }, []);

    useMoodZone(aboutZone, "about", PROFILE_MOOD, 1);
    useMoodZone(skillsZone, "skills", SKILL_MOOD, 2);
    useMoodZone(experienceZone, "experience", CRAFT_MOOD, 3);

    return (
        <>
            {/* 배경은 섹션마다 새로 그리지 않는다. 화면에 고정된 3D 필드 하나가 홈 전체를 받치고,
                스크롤이 그 배치를, 커서가 그 표면을 움직인다. */}
            <Suspense fallback={null}>
                <HomeStage />
            </Suspense>
            {/* 얇은 베일 한 겹. 카드를 가운데에서 밀어내는 대신 **본문 뒤에 그대로 두고**
                전체를 살짝 눌러 글자만 앞으로 나오게 한다. 가운데를 웅덩이로 파면 배경이
                도넛처럼 비어 광활한 느낌이 사라진다. */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(125% 95% at 50% 46%, color-mix(in srgb, var(--color-paper) 74%, transparent) 0%, color-mix(in srgb, var(--color-paper) 58%, transparent) 46%, color-mix(in srgb, var(--color-paper) 28%, transparent) 78%, transparent 100%)",
                }}
            />
            <main className="relative z-10">
                <Hero />
                {/* 히어로 무드를 그대로 쥔 채 다음 구간으로 눈을 넘긴다 — 어느 존에도 속하지 않는다. */}
                <Bridge words={BRIDGE_WORDS} />
                <div ref={aboutZone}>
                    <About />
                </div>
                <div ref={skillsZone}>
                    <Skills />
                </div>
                <div ref={experienceZone}>
                    <Experience />
                </div>
                <Projects />
            </main>
        </>
    );
}
