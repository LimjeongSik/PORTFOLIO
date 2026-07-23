import { useRef } from "react";
import { Link } from "react-router-dom";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

import type { PointerEvent } from "react";
import type { Project } from "@/types/content";

interface ProjectCardProps {
    project: Project;
    index: string;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    const reduced = useReducedMotion();
    const ref = useRef<HTMLAnchorElement>(null);

    // 0~1로 정규화한 포인터 위치 (중앙 = 0.5)
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const smoothX = useSpring(px, { stiffness: 150, damping: 18 });
    const smoothY = useSpring(py, { stiffness: 150, damping: 18 });

    const rotateX = useTransform(smoothY, [0, 1], [7, -7]);
    const rotateY = useTransform(smoothX, [0, 1], [-7, 7]);
    const imageX = useTransform(smoothX, [0, 1], [-18, 18]);
    const imageY = useTransform(smoothY, [0, 1], [-18, 18]);

    const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
        if (reduced) {
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1100 }}
        >
            <Link
                ref={ref}
                to={`/projects/${project.slug}`}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                className="group block"
                aria-label={`${project.title} 프로젝트 상세 보기`}
            >
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="relative aspect-16/11 overflow-hidden rounded-2xl border border-line bg-surface"
                >
                    <motion.img
                        src={project.thumbnail}
                        alt={project.title}
                        style={reduced ? undefined : { x: imageX, y: imageY }}
                        className="h-full w-full scale-110 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.16]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <span className="absolute top-4 left-4 font-mono text-xs text-paper/80 mix-blend-difference">
                        {index}
                    </span>

                    <div className="absolute inset-x-4 bottom-4 flex translate-y-2 items-end justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <ul className="flex flex-wrap gap-x-3 gap-y-1">
                            {project.tech.slice(0, 3).map((tech) => (
                                <li key={tech} className="font-mono text-xs text-paper/90">
                                    {tech}
                                </li>
                            ))}
                        </ul>
                        <span className="inline-flex items-center gap-1 rounded-full bg-paper px-4 py-2 text-xs font-medium text-ink">
                            View <span aria-hidden>→</span>
                        </span>
                    </div>
                </motion.div>

                <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl font-medium text-ink transition-colors group-hover:text-espresso sm:text-3xl">
                        {project.title}
                    </h3>
                    <span className="shrink-0 font-mono text-sm text-muted">{project.year}</span>
                </div>
                <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">
                    {project.summary}
                </p>
            </Link>
        </motion.div>
    );
}
