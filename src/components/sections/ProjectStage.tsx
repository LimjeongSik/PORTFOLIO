import { useLayoutEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

import { Tag } from "@/components/ui/Tag";

import { moodFromAccent, setMood } from "@/lib/atmosphere";
import { ScrollTrigger } from "@/lib/gsap";
import { getLenisInstance } from "@/lib/lenis";

import type { Mood } from "@/lib/atmosphere";
import type { Project } from "@/types/content";

interface ProjectStageProps {
    projects: Project[];
    /** 갤러리를 벗어나 위로 올라갔을 때 돌아갈 무드 */
    leadMood: Mood;
}

/** 카드 하나가 지나가는 데 쓰는 세로 스크롤(vh). 그동안 뒤의 화면 위성이 한 바퀴 돈다. */
const PER_CARD = 135;

/** 가장자리 카드가 정면에서 벗어나는 최대 각도(도). */
const MAX_YAW = 26;

/**
 * 프로젝트가 옆으로 흐르는 갤러리.
 *
 * 첫 화면의 원통을 펼친 것이다 — 거기서는 화면들이 축을 돌고, 여기서는 그 축이 풀려 일렬로
 * 지나간다. 그래서 가운데 온 것만 정면을 보고 좌우로 갈수록 판이 비스듬히 눕는다.
 *
 * 기기 틀에 담지 않는다. 화면 자체가 판이고, 판이 각도를 갖는다.
 *
 * 세로 스크롤이 가로 이동을 몬다. 휠·키보드·터치가 전부 평소대로 동작해야 하므로 가로
 * 스크롤 컨테이너를 쓰지 않고, 세로로 번 거리를 `translate3d`로 옮긴다.
 *
 * 카드 위치는 마운트할 때 한 번 재고 그 뒤로는 계산으로 얻는다. 매 프레임
 * `getBoundingClientRect`를 부르면 방금 쓴 transform 때문에 레이아웃이 강제로 다시 계산된다.
 */
export function ProjectStage({ projects, leadMood }: ProjectStageProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLUListElement>(null);
    const cards = useRef<(HTMLLIElement | null)[]>([]);

    // 프로젝트별 방은 색 계산이 들어가므로 한 번만 만들어 둔다.
    const moods = useMemo(
        () => projects.map((project) => moodFromAccent(project.theme.espresso)),
        [projects],
    );

    /* `useGSAP`을 쓰지 않는다 — 여기서 만드는 건 트리거 하나뿐이고 트윈이 없다. 그런데
       `useGSAP`의 컨텍스트는 콜백 안에서 동기로 만들어지는 트윈을 전부 포획하므로, 첫 자세를
       잡으며 부른 `setMood`의 지면색 트윈까지 붙잡는다. 개발 서버의 StrictMode가 이펙트를
       두 번 돌리면 첫 컨텍스트의 revert가 그 트윈을 죽이고, 두 번째 호출은 같은 id라
       건너뛴다 — 무드는 바뀌었다고 기록됐는데 화면은 그대로인 반쪽 상태가 된다.
       레이아웃 이펙트인 이유는 첫 페인트 전에 레일을 제자리에 두기 위해서다. */
    useLayoutEffect(() => {
        const rail = railRef.current;
        const track = trackRef.current;
        if (!rail || !track) {
            return;
        }

        /** 레일 안에서의 카드 중심 위치. 리사이즈 때 다시 잰다. */
        let centers: number[] = [];

        const measure = () => {
            const nodes = cards.current.filter((node): node is HTMLLIElement => node !== null);
            centers = nodes.map((node) => node.offsetLeft + node.offsetWidth / 2);
        };

        /**
         * 레일과 카드의 자세를 진행률에 맞춘다. `claim`이 참일 때만 가운데 카드의 방을
         * 지면에 주장한다 — 갤러리가 화면을 잡고 있지 않은데 색을 칠하면 안 된다.
         *
         * "마지막에 주장한 카드"를 여기서 따로 기억하지 않는다. 그 사이 다른 구간이 지면을
         * 칠했으면 그 기억은 거짓이 되고, 같은 카드라며 다시 칠하지 않는다(뒤로가기 복원 ·
         * 리사이즈 재마운트에서 실제로 그랬다). 같은 id면 `setMood`가 알아서 건너뛴다.
         */
        const paint = (progress: number, claim: boolean) => {
            const count = centers.length;
            if (count === 0) {
                return;
            }

            /* 스크롤을 거리에 균등하게 나누면 카드가 화면 한가운데에 서 있는 시간보다
                   두 카드가 반씩 걸쳐 있는 시간이 길어진다. 대신 **카드 중심 사이를** 오가되
                   그 사이를 빠르게 지나는 곡선을 쓴다 — 카드는 중앙에 머물고 전환만 짧다. */
            const t = progress * (count - 1);
            const from = Math.max(0, Math.min(count - 2, Math.floor(t)));
            const f = Math.max(0, Math.min(1, t - from));
            const eased = f * f * f * (f * (f * 6 - 15) + 10);
            const center =
                count > 1
                    ? centers[from] + (centers[from + 1] - centers[from]) * eased
                    : centers[0];

            const middle = window.innerWidth / 2;
            const shift = middle - center;
            rail.style.transform = `translate3d(${shift}px, 0, 0)`;

            centers.forEach((cardCenter, index) => {
                const node = cards.current[index];
                if (!node) {
                    return;
                }
                // 이 카드의 중심이 지금 화면 어디에 있는가.
                const offset = cardCenter + shift - middle;
                const ratio = Math.max(-1.4, Math.min(1.4, offset / middle));

                node.style.transform = `rotateY(${-ratio * MAX_YAW}deg) translateZ(${-Math.abs(ratio) * 90}px)`;
                node.style.opacity = String(1 - Math.min(1, Math.abs(ratio)) * 0.62);
            });

            if (!claim) {
                return;
            }
            const nearest = Math.max(0, Math.min(count - 1, Math.round(t)));
            setMood(projects[nearest].slug, moods[nearest], { scene: 4 });
        };

        measure();

        /* 갤러리가 지면색을 말할 자격이 있는가 — 화면을 잡고 있거나, 이미 끝까지 지나
               아래(푸터)에 있을 때. 위로 벗어난 경우(진행률 0)만 자격이 없다. */
        const holds = (self: ScrollTrigger) => self.isActive || self.progress >= 1;

        const trigger = ScrollTrigger.create({
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => paint(self.progress, holds(self)),
            onLeaveBack: () => setMood("work-lead", leadMood, { scene: 4 }),
            /* 다시 잴 때 갤러리가 화면을 잡고 있으면 자기 방을 한 번 더 주장한다.
                   스크롤이 한 번에 건너뛰면(뒤로가기 복원) 위쪽 구간의 트리거들이 지면색을
                   자기 것으로 덮는다 — 마지막에 말하는 쪽이 갤러리여야 한다. */
            onRefresh: (self) => {
                measure();
                paint(self.progress, holds(self));
            },
        });

        /* 처음 자세는 지금 스크롤 위치에서 잰다. 색은 갤러리가 화면을 잡고 있을 때만 —
               무조건 첫 프로젝트의 방을 칠하면, 창을 `lg` 아래로 줄였다 늘려 무대가 다시
               마운트될 때 히어로에 서 있어도 지면이 SafeOps의 주황으로 물든다(사용자 지적).
               첫 로드에서는 뒤이어 도는 히어로 트리거가 덮어 주어 보이지 않던 버그다. */
        paint(trigger.progress, holds(trigger));

        // ← → 로 한 장씩. 갤러리가 화면을 잡고 있을 때만 받는다.
        const onKeyDown = (event: KeyboardEvent) => {
            if (!trigger.isActive || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
                return;
            }
            const active = document.activeElement;
            if (
                active instanceof HTMLElement &&
                active.closest("input, textarea, [contenteditable]")
            ) {
                return;
            }
            event.preventDefault();
            const count = centers.length;
            if (count < 2) {
                return;
            }
            const perCard = (track.offsetHeight - window.innerHeight) / (count - 1);
            const current = Math.round(trigger.progress * (count - 1));
            const next = Math.max(
                0,
                Math.min(count - 1, current + (event.key === "ArrowRight" ? 1 : -1)),
            );
            const target = track.offsetTop + next * perCard;
            const lenis = getLenisInstance();
            if (lenis) {
                lenis.scrollTo(target, { duration: 0.9 });
            } else {
                window.scrollTo({ top: target, behavior: "smooth" });
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            trigger.kill();
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [projects, moods, leadMood]);

    return (
        <div
            ref={trackRef}
            data-stage-zone="projects"
            style={{ height: `${projects.length * PER_CARD}vh` }}
        >
            <div className="sticky top-0 flex h-svh items-center overflow-hidden">
                <ul
                    ref={railRef}
                    /* 여백을 두지 않는다 — 레일은 언제나 "지금 카드의 중심"이 화면 한가운데
                       오도록 옮겨지므로, 양 끝을 패딩으로 맞출 필요가 없다.

                       원근은 레일에 두고 3D 컨텍스트는 보존하지 않는다. `preserve-3d` 안에서
                       카드를 `translateZ(음수)`로 눌러 두면 부모 평면 뒤로 넘어가, 눈에는 보여도
                       히트 테스트에서는 레일이 맞는다 — "자세히 보기"가 눌리지 않던 원인이다.
                       카드끼리 교차하지 않으므로 평탄화해도 보이는 모양은 같다. */
                    className="flex items-center gap-[9vw] will-change-transform"
                    style={{ perspective: "1600px" }}
                >
                    {projects.map((project, index) => (
                        <li
                            key={project.slug}
                            ref={(node) => {
                                cards.current[index] = node;
                            }}
                            className="w-[62vw] max-w-4xl shrink-0"
                        >
                            <article className="grid grid-cols-[minmax(0,18rem)_minmax(0,1fr)] items-center gap-12">
                                {/* 기기 틀 없이 화면 그대로. 각도가 붙은 판이라 그림자만으로 뜬다.
                                    세로 화면이라 폭만 정해 두면 낮은 화면(예: 1024×600)에서
                                    `h-svh` 무대를 넘겨 잘린다 — 높이도 함께 죄어 둔다. */}
                                <img
                                    src={project.thumbnail}
                                    alt={`${project.title} 화면`}
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                    className="mx-auto max-h-[62svh] max-w-full rounded-2xl shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)]"
                                />

                                <div>
                                    <div className="flex items-baseline gap-4 font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                                        <span className="text-espresso tabular-nums">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span>{project.year}</span>
                                        <span aria-hidden className="h-px flex-1 bg-line" />
                                    </div>

                                    <h3 className="mt-5 font-display text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.05] font-bold tracking-[-0.03em] text-ink">
                                        {project.title}
                                    </h3>

                                    <p className="mt-4 max-w-lg text-[0.9375rem] leading-[1.8] text-muted">
                                        {project.summary}
                                    </p>

                                    <ul className="mt-6 flex flex-wrap gap-1.5">
                                        {project.tech.slice(0, 5).map((tech) => (
                                            <li key={tech}>
                                                <Tag>{tech}</Tag>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link
                                        to={`/projects/${project.slug}`}
                                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-0.5"
                                    >
                                        자세히 보기 <span aria-hidden>→</span>
                                    </Link>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
