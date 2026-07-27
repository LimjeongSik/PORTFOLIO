import { useRef } from "react";
import { Link } from "react-router-dom";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import type { Variants } from "motion/react";
import type { PointerEvent } from "react";
import type { Project } from "@/types/content";

interface ProjectCardProps {
    project: Project;
    index: string;
    /** 지그재그 배치 — true면 넓은 화면에서 썸네일이 오른쪽에 온다 */
    reversed?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** 자체 애니메이션은 없고, hidden/show 상태를 자식 트리로 전파하는 역할만 한다. */
const rootVariants: Variants = { hidden: {}, show: {} };

/**
 * 썸네일 프레임: 살짝 아래에서 떠오른다.
 * clipPath 문자열 보간은 `round` 키워드가 섞이면 중간 프레임 없이 최종값으로 점프하므로,
 * 마스크 리빌은 clipPath가 아니라 아래 curtainVariants(패널을 걷어내는 방식)로 구현한다.
 */
const mediaVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * 썸네일을 덮은 패널이 아래로 걷히며 이미지가 드러난다(transform이라 보간이 확실하다).
 * 좁은 화면에서는 CSS(`hidden md:block`)로만 감춘다 — 조건부로 마운트하면 창을 넓힐 때
 * 패널이 새로 붙으면서 `viewport once`로 끝난 리빌을 못 받아 이미지를 덮은 채 굳는다.
 */
const curtainVariants: Variants = {
    hidden: { scaleY: 1 },
    show: { scaleY: 0, transition: { duration: 0.85, ease: EASE, delay: 0.12 } },
};

/** 본문: 마스크가 어느 정도 걷힌 뒤 줄 단위로 이어서 올라온다. */
const bodyVariants: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.22, staggerChildren: 0.07 } },
};

const lineVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * 1열로 접히는 좁은 화면용 — 썸네일과 본문이 위아래로 쌓여 한 화면을 거의 채우므로,
 * 커튼 리빌과 긴 스태거는 굼떠 보인다. 이동 거리·지연을 줄여 짧게 끝낸다.
 */
const compactMediaVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const compactBodyVariants: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.08, staggerChildren: 0.05 } },
};

const compactLineVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

/** reduced-motion: 위치·마스크 이동 없이 페이드만. */
const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4 } },
};

export function ProjectCard({ project, index, reversed = false }: ProjectCardProps) {
    const reduced = useReducedMotion();
    // 썸네일과 본문이 좌우로 나뉘는 지점(md). 아래에서는 1열로 접히므로 모션도 달라진다.
    const split = useMediaQuery("(min-width: 768px)");
    const ref = useRef<HTMLDivElement>(null);

    // 0~1로 정규화한 포인터 위치 (중앙 = 0.5). 썸네일 영역 기준으로만 측정한다.
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const smoothX = useSpring(px, { stiffness: 150, damping: 18 });
    const smoothY = useSpring(py, { stiffness: 150, damping: 18 });

    const rotateX = useTransform(smoothY, [0, 1], [7, -7]);
    const rotateY = useTransform(smoothX, [0, 1], [-7, 7]);
    // 이동량은 px가 아닌 이미지 크기 대비 비율 — scale-108이 만드는 여백(각 변 4%) 안에
    // 항상 머물러야 좁은 화면에서도 이미지 가장자리가 드러나지 않는다.
    const imageX = useTransform(smoothX, [0, 1], ["-3%", "3%"]);
    const imageY = useTransform(smoothY, [0, 1], ["-3%", "3%"]);

    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        // 1열 구간은 대부분 터치 기기 — 탭할 때마다 카드가 기우는 게 어색해 틸트를 끈다.
        if (reduced || !split) {
            return;
        }
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }
        px.set((event.clientX - rect.left) / rect.width);
        py.set((event.clientY - rect.top) / rect.height);
    };

    const onPointerLeave = () => {
        px.set(0.5);
        py.set(0.5);
    };

    // 지그재그: 썸네일과 본문의 열 위치를 뒤집는다(DOM 순서는 썸네일 → 본문으로 고정).
    // md에서는 6:6, lg부터 5:6(+사이 1칸) — 2열로 갓 전환된 폭에서 썸네일이 너무 쪼그라들지 않게.
    const mediaColumn = reversed
        ? "md:col-start-7 md:col-span-6 lg:col-start-8 lg:col-span-5"
        : "md:col-start-1 md:col-span-6 lg:col-span-5";
    const bodyColumn = reversed ? "md:col-start-1 md:col-span-6" : "md:col-start-7 md:col-span-6";

    const media = reduced ? fadeVariants : split ? mediaVariants : compactMediaVariants;
    const body = split ? bodyVariants : compactBodyVariants;
    const line = reduced ? fadeVariants : split ? lineVariants : compactLineVariants;

    return (
        <motion.article
            variants={rootVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: split ? "0px 0px -15% 0px" : "0px 0px -5% 0px" }}
        >
            <Link
                to={`/projects/${project.slug}`}
                className="group grid items-center gap-6 md:grid-cols-12 md:gap-x-10"
                aria-label={`${project.title} 프로젝트 상세 보기`}
            >
                <div
                    ref={ref}
                    onPointerMove={onPointerMove}
                    onPointerLeave={onPointerLeave}
                    className={`md:row-start-1 ${mediaColumn}`}
                    style={{ perspective: 1100 }}
                >
                    {/* 틸트가 바깥, 리빌이 안쪽 — 순서가 반대면 perspective가 회전 요소의
                        직계 부모가 아니게 되어(perspective는 직계 자식에만 적용) 원근이 사라진다. */}
                    <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
                        <motion.div
                            variants={media}
                            className="relative aspect-16/10 overflow-hidden rounded-2xl border border-line bg-surface"
                        >
                            {/* 확대(CSS)와 패럴랙스 이동(Motion)을 다른 요소에 나눈다 — 한
                                요소에 두면 Motion이 쓰는 인라인 transform이 Tailwind scale을
                                덮어써 확대가 사라지고, 이동 여백이 없어 배경이 드러난다. */}
                            <div className="h-full w-full scale-108 transition-transform duration-700 ease-out group-hover:scale-113">
                                <motion.img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    loading="lazy"
                                    style={reduced ? undefined : { x: imageX, y: imageY }}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            {!reduced && (
                                <motion.div
                                    aria-hidden
                                    variants={curtainVariants}
                                    style={{ originY: 1 }}
                                    className="absolute inset-0 hidden bg-surface md:block"
                                />
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div variants={body} className={`md:row-start-1 ${bodyColumn}`}>
                    <motion.div
                        variants={line}
                        className="flex items-center gap-3 font-mono text-xs text-muted"
                    >
                        <span>{index}</span>
                        <span
                            aria-hidden
                            className="h-px w-8 bg-line transition-all duration-500 ease-out group-hover:w-14 group-hover:bg-espresso"
                        />
                        <span>{project.year}</span>
                    </motion.div>

                    <motion.h3
                        variants={line}
                        className="mt-4 font-display text-2xl font-medium text-ink sm:text-3xl"
                    >
                        <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-ink after:transition-[width] after:duration-500 after:ease-out after:content-[''] group-hover:after:w-full">
                            {project.title}
                        </span>
                    </motion.h3>

                    <motion.p variants={line} className="mt-3 text-base leading-relaxed text-muted">
                        {project.summary}
                    </motion.p>

                    <motion.ul variants={line} className="mt-5 flex flex-wrap gap-x-3 gap-y-1">
                        {project.tech.slice(0, 4).map((tech) => (
                            <li key={tech} className="font-mono text-xs text-muted">
                                {tech}
                            </li>
                        ))}
                    </motion.ul>

                    <motion.span
                        variants={line}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink"
                    >
                        자세히 보기
                        <span
                            aria-hidden
                            className="transition-transform group-hover:translate-x-1"
                        >
                            →
                        </span>
                    </motion.span>
                </motion.div>
            </Link>
        </motion.article>
    );
}
