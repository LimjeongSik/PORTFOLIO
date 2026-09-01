import { useEffect, useRef } from "react";

interface ProjectAmbientProps {
    line: string;
    accent: string;
}

const CELL = 34;
const NODE_COUNT = 8;
const PING_RADIUS = 190;

interface Node {
    x: number;
    y: number;
    wait: number;
    period: number;
    age: number | null;
}

export function ProjectAmbient({ line, accent }: ProjectAmbientProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) {
            return;
        }

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let width = 0;
        let height = 0;
        let nodes: Node[] = [];
        let frame = 0;
        let last = 0;
        const pointer = { x: -9999, y: -9999 };

        const seedNodes = () => {
            nodes = Array.from({ length: NODE_COUNT }, () => {
                const period = 2600 + Math.random() * 3800;
                return {
                    x: Math.round((Math.random() * width) / CELL) * CELL,
                    y: Math.round((Math.random() * height) / CELL) * CELL,
                    period,
                    wait: Math.random() * period,
                    age: null,
                };
            });
        };

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            seedNodes();
        };

        const draw = (delta: number) => {
            context.clearRect(0, 0, width, height);

            for (let x = CELL; x < width; x += CELL) {
                for (let y = CELL; y < height; y += CELL) {
                    const dx = x - pointer.x;
                    const dy = y - pointer.y;
                    const near = Math.max(0, 1 - Math.hypot(dx, dy) / 150);
                    context.globalAlpha = 0.9;
                    context.fillStyle = near > 0.02 ? accent : line;
                    const size = 1.4 + near * 1.6;
                    context.fillRect(x - size / 2, y - size / 2, size, size);
                }
            }

            for (const node of nodes) {
                if (node.age === null) {
                    node.wait -= delta;
                    if (node.wait <= 0) {
                        node.age = 0;
                    }
                } else {
                    node.age += delta;
                }

                context.globalAlpha = 0.85;
                context.fillStyle = accent;
                context.beginPath();
                context.arc(node.x, node.y, 1.8, 0, Math.PI * 2);
                context.fill();

                if (node.age === null) {
                    continue;
                }

                const life = node.age / 1900;
                if (life >= 1) {
                    node.age = null;
                    node.wait = node.period;
                    continue;
                }

                context.globalAlpha = (1 - life) * 0.55;
                context.strokeStyle = accent;
                context.lineWidth = 1;
                context.beginPath();
                context.arc(node.x, node.y, life * PING_RADIUS, 0, Math.PI * 2);
                context.stroke();
            }

            context.globalAlpha = 1;
        };

        const tick = (time: number) => {
            const delta = Math.min(time - last, 48);
            last = time;
            draw(delta);
            frame = requestAnimationFrame(tick);
        };

        const onPointerMove = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
        };

        const onPointerLeave = () => {
            pointer.x = -9999;
            pointer.y = -9999;
        };

        const drawStill = () => {
            for (const node of nodes) {
                node.age = null;
                node.wait = Number.POSITIVE_INFINITY;
            }
            draw(0);
        };

        const onResize = reduced
            ? () => {
                  resize();
                  drawStill();
              }
            : resize;

        resize();
        window.addEventListener("resize", onResize);

        if (reduced) {
            drawStill();
            return () => window.removeEventListener("resize", onResize);
        }

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerleave", onPointerLeave);
        last = performance.now();
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerleave", onPointerLeave);
        };
    }, [line, accent]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
        />
    );
}
