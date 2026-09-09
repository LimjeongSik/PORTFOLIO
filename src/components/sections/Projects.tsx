import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

import { useReducedMotion } from "motion/react";

import { ProjectCard } from "@/components/project/ProjectCard";
import { ProjectStage } from "@/components/sections/ProjectStage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useMoodZone } from "@/hooks/useMoodZone";

import { projects } from "@/data/projects";
import { CRAFT_MOOD, moodFromAccent } from "@/lib/atmosphere";
import { getLenisInstance } from "@/lib/lenis";
import { viewportWatcher } from "@/lib/viewport";

import type { Project } from "@/types/content";

/**
 * 지금 스크롤이 프로젝트 구간의 어디를 보고 있는지를 레이아웃과 무관한 수로 적는다 —
 * 0은 첫 프로젝트, count-1은 마지막 프로젝트, 그 사이는 두 프로젝트 사이의 비율.
 * 구간 위에 있으면 null.
 */
function locate(zone: HTMLElement, staged: boolean, count: number): number | null {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const top = zone.getBoundingClientRect().top + scrollY;
    const bottom = top + zone.offsetHeight;
    if (count < 2) {
        return null;
    }
    if (staged) {
        /* 무대 아래(푸터)로 지나갔으면 건드리지 않는다 — 마지막 카드로 되돌려 세우면 안 된다.
           기준은 무대의 스크롤 끝(bottom - vh)이 아니라 무대 상자의 바닥이다. 그 사이는 마지막
           카드가 아직 화면에 남아 위로 밀려 나가는 구간이라 마지막 프로젝트로 보는 게 맞고,
           여기서 닻을 버리면 좁혔다 넓힐 때 첫 카드로 튀는 원래 버그가 되살아난다. */
        if (scrollY > bottom) {
            return null;
        }
        /* 무대 위(섹션 제목)는 두 모드의 레이아웃이 같으므로 건드리지 않는다. 다만 무대가
           화면 아래쪽으로 들어오기 시작한 자리는 첫 카드로 본다 — 목록은 훨씬 촘촘해서 같은
           픽셀에 두면 둘째 카드가 가운데 온다. */
        if (scrollY < top - vh / 2) {
            return null;
        }
        const range = zone.offsetHeight - vh;
        const progress = range > 0 ? Math.max(0, Math.min(1, (scrollY - top) / range)) : 0;
        return progress * (count - 1);
    }
    const centers = cardCenters(zone);
    if (centers.length < 2) {
        return null;
    }
    const center = scrollY + vh / 2;
    // 목록 위(섹션 제목)와 아래(푸터)는 건드리지 않고, 목록 안이되 첫 카드보다 위면 첫 카드로 본다.
    if (center < top || center > bottom) {
        return null;
    }
    if (center <= centers[0]) {
        return 0;
    }
    for (let i = 0; i < centers.length - 1; i += 1) {
        if (center <= centers[i + 1]) {
            return i + (center - centers[i]) / (centers[i + 1] - centers[i]);
        }
    }
    return centers.length - 1;
}

/** `locate`가 적은 자리를 지금 레이아웃의 스크롤 위치로 되돌린다. */
function scrollFor(zone: HTMLElement, staged: boolean, count: number, at: number): number | null {
    const vh = window.innerHeight;
    const top = zone.getBoundingClientRect().top + window.scrollY;
    if (staged) {
        return top + (at / (count - 1)) * Math.max(0, zone.offsetHeight - vh);
    }
    const centers = cardCenters(zone);
    if (centers.length < 2) {
        return null;
    }
    const index = Math.max(0, Math.min(centers.length - 2, Math.floor(at)));
    const fraction = Math.max(0, Math.min(1, at - index));
    const center = centers[index] + (centers[index + 1] - centers[index]) * fraction;
    return center - vh / 2;
}

function cardCenters(zone: HTMLElement): number[] {
    return Array.from(zone.querySelectorAll<HTMLElement>("[data-stage-anchor]")).map((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2;
    });
}

export function Projects() {
    const root = useRef<HTMLElement>(null);
    const lead = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();
    const wide = useMediaQuery("(min-width: 1024px)");

    // 무대는 한 화면을 통째로 쓰는 연출이라 넓은 화면 + 모션 허용에서만 켠다.
    // 그 밖에서는 지금까지의 지그재그 목록을 그대로 쓴다 — 같은 내용을 스크롤 없이 펼쳐 준다.
    const staged = wide && !reduced;

    /* 제목 영역만 이 섹션의 방이다 — 섹션 전체를 존으로 잡으면 갤러리·카드의 방과 겹쳐,
       트리거가 한꺼번에 다시 만들어질 때(리사이즈 · 복원) 나중에 도는 이쪽이 이긴다.
       제목을 지나 무대에 들어가면 카드가 제 방을 주장하고, 위로 되돌아오면 무대의
       onLeaveBack이 이 방으로 돌려놓는다. */
    useMoodZone(lead, staged ? "work-lead" : "work-list", CRAFT_MOOD, 4);

    /* 창 폭이 `lg` 경계를 넘으면 무대와 목록이 갈아 끼워지는데, 둘의 높이가 달라 같은 픽셀
       위치가 다른 프로젝트를 가리킨다. 목록은 무대보다 짧아서 갤러리 깊숙이 있다가 좁히면
       브라우저가 스크롤을 바닥으로 잘라 마지막 카드로 튀고, 다시 넓히면 첫 카드에 선다.

       그래서 "몇 번째 프로젝트의 어디"를 레이아웃과 무관한 수로 늘 들고 있다가, 갈아 끼워진
       직후(레이아웃 이펙트) 새 레이아웃의 같은 자리로 옮긴다. 재는 시점은 스크롤 때와,
       **모드가 그대로인** 리사이즈 때다 — 목록의 레이아웃은 폭에 따라 달라지므로, 경계를 넘긴
       리사이즈 순간(아직 옛 모드, 이미 새 폭)에 재면 옛 폭에서 보던 자리와 어긋난다. */
    const stagedRef = useRef(staged);
    const anchor = useRef<number | null>(null);
    useEffect(() => {
        stagedRef.current = staged;
    }, [staged]);
    useEffect(() => {
        const measure = () => {
            const zone = root.current?.querySelector<HTMLElement>("[data-stage-zone='projects']");
            anchor.current = zone ? locate(zone, stagedRef.current, projects.length) : null;
        };
        /* 모바일의 `resize`는 대개 주소창이 여닫힌 것이다 — 조판은 `svh`라 그대로이므로
           굴릴 때마다 랜드마크를 다시 잴 이유가 없다(`lib/viewport`). */
        const viewportChanged = viewportWatcher();
        let frame = 0;
        const onScroll = () => {
            if (!frame) {
                frame = requestAnimationFrame(() => {
                    frame = 0;
                    measure();
                });
            }
        };
        const onResize = () => {
            if (!viewportChanged()) {
                return;
            }
            const stagedNow = window.matchMedia("(min-width: 1024px)").matches && !reduced;
            if (stagedNow === stagedRef.current) {
                measure();
            } else if (frame) {
                // 경계를 넘는 순간 대기 중인 스크롤 측정은 옛 모드의 DOM을 새 폭에서 재게 된다 — 버린다.
                cancelAnimationFrame(frame);
                frame = 0;
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, [reduced]);
    useLayoutEffect(() => {
        const at = anchor.current;
        anchor.current = null;
        const zone = root.current?.querySelector<HTMLElement>("[data-stage-zone='projects']");
        if (at === null || !zone) {
            return;
        }
        const move = () => {
            const top = scrollFor(zone, staged, projects.length, at);
            if (top === null || Math.abs(top - window.scrollY) < 2) {
                return;
            }
            const lenis = getLenisInstance();
            if (lenis) {
                // 이전 높이 기준의 한계가 남아 있으면 목표가 잘못 잘린다.
                lenis.resize();
                lenis.scrollTo(top, { immediate: true, force: true });
            } else {
                window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
            }
        };
        move();
        // 갈아 끼운 직후의 높이는 한 박자 뒤에 굳는 수가 있다 — 다음 프레임에 어긋나 있으면 한 번만 다시 맞춘다.
        const frame = requestAnimationFrame(move);
        return () => cancelAnimationFrame(frame);
    }, [staged]);

    return (
        <section ref={root} id="projects" className="scroll-mt-20 px-0 pt-24 sm:pt-32">
            <div ref={lead} className="px-6">
                <div className="mx-auto max-w-6xl">
                    <SectionHeading
                        index="04"
                        eyebrow="Work"
                        title="프로젝트"
                        description={
                            staged
                                ? "스크롤을 내리면 프로젝트마다 지면의 색이 바뀝니다. 카드를 눌러 자세히 살펴보세요."
                                : "문제를 정의하고, 인터랙션으로 풀어낸 대표 작업들입니다. 카드를 눌러 자세히 살펴보세요."
                        }
                    />
                </div>
            </div>

            {staged ? (
                <div className="mt-16">
                    <ProjectStage projects={projects} leadMood={CRAFT_MOOD} />
                </div>
            ) : (
                /* 목록으로 떨어져도 3D 무대는 그대로 갤러리로 난다 — 구간 표식이 무대 컴포넌트
                   안에만 있으면 타임라인에 프로젝트 구간이 없어 카메라가 경력의 계단 꼭대기에
                   영영 머문다(사용자 지적). 카드마다 닻을 두어, 카드가 화면 가운데 올 때
                   같은 순서의 자리 앞에 카메라가 선다. */
                <div data-stage-zone="projects" className="px-6 pb-24 sm:pb-32">
                    <div className="mx-auto max-w-6xl">
                        {/* 그리드 나열 대신 한 줄에 한 프로젝트씩 — 썸네일과 본문의 좌우를 번갈아
                            배치해(지그재그) 스크롤하며 하나씩 읽히게 한다. */}
                        <div className="mt-14 flex flex-col gap-16 sm:mt-16 md:gap-24">
                            {projects.map((project, index) => (
                                <MoodedCard
                                    key={project.slug}
                                    project={project}
                                    index={String(index + 1).padStart(2, "0")}
                                    reversed={index % 2 === 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

interface MoodedCardProps {
    project: Project;
    index: string;
    reversed: boolean;
}

/**
 * 목록으로 떨어졌을 때도 색은 프로젝트를 따라간다.
 * 무대가 없으니 카드 하나하나가 자기 방을 들고, 그 카드가 화면 가운데를 지날 때 지면이 물든다.
 */
function MoodedCard({ project, index, reversed }: MoodedCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mood = useMemo(() => moodFromAccent(project.theme.espresso), [project.theme.espresso]);

    useMoodZone(ref, project.slug, mood, 4);

    return (
        <div ref={ref} data-stage-anchor="">
            <ProjectCard project={project} index={index} reversed={reversed} />
        </div>
    );
}
