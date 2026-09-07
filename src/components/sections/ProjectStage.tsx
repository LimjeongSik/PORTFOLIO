import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { Magnetic } from "@/components/ui/Magnetic";
import { PhoneShot } from "@/components/ui/PhoneShot";

import { moodFromAccent, setMood } from "@/lib/atmosphere";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

import type { PointerEvent } from "react";
import type { Mood } from "@/lib/atmosphere";
import type { Project } from "@/types/content";

interface ProjectStageProps {
    projects: Project[];
    /** 무대를 벗어나 위로 올라갔을 때 돌아갈 무드 */
    leadMood: Mood;
}

/**
 * 한 화면을 통째로 쓰는 프로젝트 전시대.
 *
 * 트랙(프로젝트 수 × 한 화면)을 스크롤하면 안쪽 무대가 sticky로 붙어 있고, 진행률이
 * 현재 인덱스를 정한다. 인덱스가 바뀌면 세 가지가 동시에 움직인다 —
 * 지면 전체의 색(그 프로젝트의 방), 표지 이미지, 본문.
 *
 * 왜 GSAP pin이 아니라 sticky인가: pin은 스페이서를 끼워 넣어 위아래 섹션의 여백을 다시
 * 계산하게 만든다. 여기서 ScrollTrigger가 필요한 건 진행률뿐이라 레이아웃은 CSS에 맡겼다.
 */
export function ProjectStage({ projects, leadMood }: ProjectStageProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);

    // 표지를 포인터 쪽으로 살짝 기울인다. 원근이 붙은 판이라 각도가 작아도 입체로 읽힌다.
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const smoothX = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.4 });
    const smoothY = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.4 });
    const tiltY = useTransform(smoothX, [-1, 1], [-7, 7]);
    const tiltX = useTransform(smoothY, [-1, 1], [5, -5]);

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
        pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const onPointerLeave = () => {
        pointerX.set(0);
        pointerY.set(0);
    };

    // 프로젝트별 방은 색 계산이 들어가므로 한 번만 만들어 둔다.
    const moods = useMemo(
        () => projects.map((project) => moodFromAccent(project.theme.espresso)),
        [projects],
    );

    useGSAP(
        () => {
            const track = trackRef.current;
            if (!track) {
                return;
            }

            const count = projects.length;
            let last = -1;

            const trigger = ScrollTrigger.create({
                trigger: track,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    // 마지막 한 화면은 다음 섹션으로 빠져나가는 여백이라 진행률을 count로 나눈다.
                    const next = Math.min(count - 1, Math.floor(self.progress * count));
                    if (next === last) {
                        return;
                    }
                    last = next;
                    setIndex(next);
                    setMood(projects[next].slug, moods[next], { scene: 4 });
                },
                onLeaveBack: () => {
                    last = -1;
                    setMood("work-lead", leadMood, { scene: 4 });
                },
                /**
                 * 다시 잴 때 무대가 화면을 잡고 있으면 자기 방을 한 번 더 주장한다.
                 *
                 * 스크롤이 한 번에 건너뛰면(뒤로가기 복원) `onUpdate`는 인덱스가 이미 맞아
                 * 그냥 빠져나가는데, 같은 순간 위쪽 구간의 트리거들이 지면색을 자기 것으로
                 * 덮는다 — 무대는 침례교를 띄운 채 지면만 경력 구간의 모래색이 되던 이유다.
                 * 캐시를 비우고 다시 칠하면 마지막에 말하는 쪽이 무대가 된다(트리거는 start가
                 * 이른 순서로 평가되고, 무대의 트랙은 그 구간들보다 아래에 있다).
                 */
                onRefresh: (self) => {
                    if (!self.isActive) {
                        return;
                    }
                    const next = Math.min(count - 1, Math.floor(self.progress * count));
                    last = next;
                    setIndex(next);
                    setMood(projects[next].slug, moods[next], { scene: 4 });
                },
            });

            return () => trigger.kill();
        },
        { scope: stageRef, dependencies: [projects, moods, leadMood] },
    );

    const active = projects[index];

    // 본문이 교체될 때마다 줄 단위로 다시 올라온다. revertOnUpdate를 켜지 않으므로
    // 이전 트윈을 되돌리지 않고, key 교체로 새로 마운트된 노드에만 걸린다.
    useGSAP(
        () => {
            gsap.from(".stage-line", {
                opacity: 0,
                y: 24,
                duration: 0.7,
                stagger: 0.07,
                ease: "power3.out",
            });
        },
        { scope: stageRef, dependencies: [active.slug] },
    );

    return (
        <div ref={trackRef} style={{ height: `${(projects.length + 1) * 100}vh` }}>
            <div
                ref={stageRef}
                className="sticky top-0 flex h-svh items-center overflow-hidden px-6"
            >
                <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
                    {/* --- 본문 --- */}
                    <div className="relative">
                        <div className="flex items-baseline gap-4 font-mono text-xs tracking-widest text-muted uppercase">
                            <span className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-none font-bold text-espresso tabular-nums">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="flex flex-col gap-1">
                                <span>{active.year}</span>
                                <span>{active.role}</span>
                            </span>
                        </div>

                        {/* 프로젝트가 바뀌면 통째로 갈아 끼운다. key가 바뀌며 리빌이 다시 돈다. */}
                        <div key={active.slug} className="stage-body">
                            <h3 className="stage-line mt-6 font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-bold tracking-tight text-ink">
                                {active.title}
                            </h3>
                            <p className="stage-line mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                                {active.summary}
                            </p>
                            <ul className="stage-line mt-6 flex flex-wrap gap-2">
                                {active.tech.slice(0, 6).map((item) => (
                                    <li
                                        key={item}
                                        className="rounded-full border border-line px-3 py-1 font-mono text-[11px] tracking-wide text-muted"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="stage-line mt-8">
                                <Magnetic strength={16}>
                                    <Link
                                        to={`/projects/${active.slug}`}
                                        className="group inline-flex items-center gap-3 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-paper"
                                    >
                                        자세히 보기
                                        <span
                                            aria-hidden
                                            className="transition-transform group-hover:translate-x-1"
                                        >
                                            →
                                        </span>
                                    </Link>
                                </Magnetic>
                            </div>
                        </div>
                    </div>

                    {/* --- 표지 --- */}
                    <motion.div
                        onPointerMove={onPointerMove}
                        onPointerLeave={onPointerLeave}
                        style={{ perspective: 1200 }}
                        className="relative h-[58vh] max-h-[620px] w-full"
                    >
                        <motion.div
                            className="relative h-full w-full"
                            style={{
                                rotateX: tiltX,
                                rotateY: tiltY,
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {projects.map((project, order) => {
                                const current = order === index;
                                const mobile = project.platform === "mobile";
                                return (
                                    <figure
                                        key={project.slug}
                                        aria-hidden={!current}
                                        className="absolute inset-0 overflow-hidden rounded-3xl border border-line bg-surface transition-[opacity,transform,filter] duration-700 ease-out"
                                        style={{
                                            opacity: current ? 1 : 0,
                                            transform: current
                                                ? "scale(1) translateY(0)"
                                                : `scale(1.05) translateY(${order < index ? "-2.5%" : "2.5%"})`,
                                            filter: current ? "none" : "blur(14px)",
                                        }}
                                    >
                                        {/* 방의 색이 표지 안쪽까지 이어지도록 액센트를 아래에서 피워 올린다. */}
                                        <span
                                            aria-hidden
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "radial-gradient(115% 80% at 50% 112%, color-mix(in srgb, var(--color-espresso) 30%, transparent), transparent 64%)",
                                            }}
                                        />

                                        {mobile ? (
                                            /* 세로 화면은 판에 맞춰 자르지 않는다. 아이콘과 함께 세워 두고
                                               아래로 흘려보내야 무슨 앱인지 알아볼 수 있다(ProjectCard와 같은 규칙). */
                                            <div className="relative flex h-full items-end justify-center">
                                                {project.icon ? (
                                                    <img
                                                        src={project.icon}
                                                        alt=""
                                                        aria-hidden
                                                        className="absolute top-7 left-7 h-14 w-14 rounded-2xl border border-line/60 shadow-lg"
                                                    />
                                                ) : null}
                                                <PhoneShot
                                                    src={project.thumbnail}
                                                    alt={
                                                        current ? `${project.title} 대표 화면` : ""
                                                    }
                                                    loading={order === 0 ? "eager" : "lazy"}
                                                    // 아래로 살짝 내려 밑동을 판 밖으로 흘린다 —
                                                    // 바닥 모서리까지 둥글면 판 위에 얹힌 그림이
                                                    // 되고, 잘려 나가야 세워 둔 기기로 읽힌다.
                                                    className="h-[88%] w-auto max-w-none translate-y-[5%] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)]"
                                                />
                                            </div>
                                        ) : (
                                            <img
                                                src={project.thumbnail}
                                                alt={current ? `${project.title} 대표 화면` : ""}
                                                loading={order === 0 ? "eager" : "lazy"}
                                                decoding="async"
                                                className="relative h-full w-full object-cover"
                                            />
                                        )}
                                    </figure>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </div>

                {/* --- 진행 레일 --- */}
                <div className="pointer-events-none absolute inset-x-6 bottom-8">
                    <ul className="mx-auto flex max-w-6xl items-center gap-2">
                        {projects.map((project, order) => (
                            <li key={project.slug} className="h-px flex-1 bg-line">
                                <span
                                    className="block h-px origin-left bg-espresso transition-transform duration-500 ease-out"
                                    style={{ transform: `scaleX(${order <= index ? 1 : 0})` }}
                                />
                            </li>
                        ))}
                    </ul>
                    <p className="mx-auto mt-3 max-w-6xl font-mono text-[10px] tracking-widest text-muted uppercase">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(projects.length).padStart(2, "0")}
                    </p>
                </div>
            </div>
        </div>
    );
}
