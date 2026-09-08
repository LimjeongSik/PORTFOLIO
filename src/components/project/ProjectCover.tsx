import { useRef } from "react";
import { Link } from "react-router-dom";

import { useReducedMotion } from "motion/react";

import { Tag } from "@/components/ui/Tag";

import { gsap, useGSAP } from "@/lib/gsap";

import { BODY_LEAD, LABEL_MUTED, MEASURE } from "./typography";

import type { Project } from "@/types/content";

interface ProjectCoverProps {
    project: Project;
}

const PLATFORM_LABEL: Record<Project["platform"], string> = {
    mobile: "모바일 앱",
    web: "웹",
};

/**
 * 표지.
 *
 * 홈의 히어로와 같은 문법이다 — 글은 화면 왼쪽 기둥에 앉고, 오른쪽은 3D 무대의 좌대가
 * 가진다(`stage/world`의 `cover`). 구간이 화면보다 긴 것은 그동안 카메라가 좌대로
 * 다가갈 스크롤을 벌기 위해서다.
 *
 * 페이지가 열릴 때 도는 시퀀스는 **하나뿐**이다. 프로젝트마다 다른 표지 연출(제목 디코드 ·
 * 조리개 · 스플래시)을 세 벌 두었더니, 상세만 홈과 다른 지면처럼 보였다. 지금은 홈 히어로가
 * 쓰는 것과 같은 글자 올림 하나로 통일하고, 프로젝트마다 다른 것은 **색과 좌대 위의 물건**이
 * 맡는다.
 */
export function ProjectCover({ project }: ProjectCoverProps) {
    const root = useRef<HTMLElement>(null);
    const reduced = useReducedMotion();

    useGSAP(
        () => {
            // GSAP 인라인 트윈은 CSS 미디어쿼리로 막히지 않는다 — 여기서 직접 가드한다.
            if (reduced) {
                return;
            }
            gsap.timeline({ defaults: { ease: "power4.out" } })
                .from(".cover-back", { opacity: 0, x: -10, duration: 0.6 })
                .from(".cover-eyebrow", { opacity: 0, y: 12, duration: 0.6 }, "-=0.4")
                .from(".cover-char", { yPercent: 120, duration: 1, stagger: 0.03 }, "-=0.35")
                .from(".cover-rule", { scaleX: 0, duration: 0.9, ease: "expo.out" }, "-=0.75")
                .from(".cover-line", { opacity: 0, y: 16, stagger: 0.09, duration: 0.6 }, "-=0.65");
        },
        { scope: root, dependencies: [reduced, project.slug] },
    );

    return (
        <section
            ref={root}
            data-stage-zone="cover"
            /* 좁은 화면에서는 붙이지 않는다 — 표지에 들어가는 것(제목·요약·역할·스택)은 세로
               폭이 좁을수록 길어져서, 화면 하나에 가두면 아래가 잘린다. 대신 **여유는 그대로
               준다**: 구간이 화면 하나보다 짧으면 카메라 키 셋이 1px 안에 뭉쳐, 맨 위에서
               조금만 굴려도 좌대가 확 커졌다 작아진다(사용자 지적). 내용은 가운데로 모으고
               남는 높이는 카메라가 다가갈 스크롤이 된다. */
            className="relative flex min-h-[170svh] flex-col justify-center py-28 lg:block lg:h-[200svh] lg:py-0"
            aria-labelledby="project-title"
        >
            <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center">
                {/* 좌대가 도는 자리를 글자 판이 가로채지 않도록 포인터를 넘기고,
                    실제로 눌러야 하는 것(링크)만 다시 켠다. */}
                <div className="pointer-events-none mx-auto w-full max-w-6xl px-6 lg:pt-16">
                    <div className="lg:max-w-[34rem]">
                        <Link
                            to="/#projects"
                            className="cover-back pointer-events-auto inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-ink"
                        >
                            <span aria-hidden>←</span> 프로젝트 목록
                        </Link>

                        <p className={`cover-eyebrow mt-10 ${LABEL_MUTED}`}>
                            {project.year} · {PLATFORM_LABEL[project.platform]}
                        </p>

                        <h1
                            id="project-title"
                            className="mt-5 font-display text-[clamp(2.5rem,6.5vw,4.5rem)] leading-[1.04] font-bold tracking-tight text-ink"
                        >
                            <span className="block overflow-hidden pb-[0.08em]">
                                {[...project.title].map((char, index) => (
                                    <span
                                        // biome-ignore lint/suspicious/noArrayIndexKey: 같은 글자가 반복될 수 있어 인덱스가 유일한 키다
                                        key={`${project.slug}-${index}`}
                                        className="cover-char inline-block whitespace-pre"
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>
                        </h1>

                        <div className="cover-rule mt-8 h-px w-full max-w-sm origin-left bg-gradient-to-r from-espresso to-transparent" />

                        <p className={`cover-line mt-8 ${MEASURE} ${BODY_LEAD}`}>
                            {project.summary}
                        </p>

                        <dl className="cover-line mt-10 flex flex-wrap gap-x-12 gap-y-6">
                            <div>
                                <dt className={LABEL_MUTED}>Role</dt>
                                <dd className="mt-2 text-sm leading-[1.7] text-ink">
                                    {project.role}
                                </dd>
                            </div>
                            <div>
                                <dt className={LABEL_MUTED}>Period</dt>
                                <dd className="mt-2 text-sm leading-[1.7] text-ink tabular-nums">
                                    {project.period}
                                </dd>
                            </div>
                        </dl>

                        <ul className="cover-line mt-8 flex flex-wrap gap-1.5">
                            {project.tech.map((tech) => (
                                <li key={tech}>
                                    <Tag>{tech}</Tag>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <p className="cover-line pointer-events-none absolute bottom-8 left-6 hidden items-center gap-3 font-mono text-[0.6875rem] tracking-[0.22em] text-muted uppercase lg:flex">
                    <span aria-hidden className="h-px w-10 bg-line" />
                    아래로 읽기
                </p>
            </div>
        </section>
    );
}
