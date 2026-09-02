import { useEffect, useRef } from "react";

interface ProjectApertureProps {
    line: string;
    accent: string;
}

/** 창살 간격(px). 화면 폭과 무관하게 일정해야 창이 창으로 읽힌다. */
const PANE = 54;
/** 빛 기둥이 지나는 축의 기울기 — 오전 예배 시간대의 창 그림자 각도. */
const TILT = -0.46;

interface Shaft {
    /** 축 위 위치 0~1 */
    at: number;
    /** 한 바퀴 도는 데 걸리는 시간(ms) */
    period: number;
    /** 정규화된 폭 */
    width: number;
    strength: number;
}

const SHAFTS: Shaft[] = [
    { at: 0.12, period: 26000, width: 0.26, strength: 1 },
    { at: 0.58, period: 41000, width: 0.4, strength: 0.5 },
];

/**
 * 창을 지나는 빛. 창살 격자 위로 빛 기둥이 아주 느리게 흐르고, 지나는 칸이 밝아진다.
 * 입력은 포인터가 아니라 스크롤이다 — 아래로 내려갈수록 빛도 함께 넘어간다.
 * SafeOps 표지(신호 필드)와 기법·입력·밀도를 전부 다르게 두기 위한 선택.
 */
export function ProjectAperture({ line, accent }: ProjectApertureProps) {
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
        let axis = 1;
        let frame = 0;
        let last = 0;
        let elapsed = 0;

        const cos = Math.cos(TILT);
        const sin = Math.sin(TILT);

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            // 축 위 좌표를 0~1로 정규화하기 위한 길이. 기울기 때문에 폭보다 길다.
            axis = Math.abs(width * cos) + Math.abs(height * sin);
        };

        /** 빛 기둥 중심에서 멀어질수록 부드럽게 꺼진다. */
        const glow = (distance: number, shaftWidth: number) => {
            const t = Math.min(1, Math.abs(distance) / shaftWidth);
            const fade = 1 - t * t;
            return fade * fade;
        };

        const draw = (offset: number) => {
            context.clearRect(0, 0, width, height);

            const positions = SHAFTS.map((shaft) => ({
                at: (shaft.at + offset / shaft.period) % 1,
                width: shaft.width,
                strength: shaft.strength,
            }));

            const columns = Math.ceil(width / PANE) + 1;
            const rows = Math.ceil(height / PANE) + 1;

            for (let column = 0; column < columns; column += 1) {
                for (let row = 0; row < rows; row += 1) {
                    const x = column * PANE;
                    const y = row * PANE;
                    // 칸 중심을 빛이 지나는 축에 투영한다.
                    const u = ((x + PANE / 2) * cos + (y + PANE / 2) * sin) / axis + 0.5;

                    let light = 0;
                    for (const position of positions) {
                        // 축을 순환시키므로 양끝을 넘어가는 거리도 함께 본다.
                        const raw = u - position.at;
                        const wrapped = raw - Math.round(raw);
                        light += glow(wrapped, position.width) * position.strength;
                    }

                    if (light <= 0.004) {
                        continue;
                    }

                    context.globalAlpha = Math.min(0.13, light * 0.13);
                    context.fillStyle = accent;
                    context.fillRect(x + 1, y + 1, PANE - 2, PANE - 2);
                }
            }

            // 창살은 빛과 무관하게 늘 같은 세기로 남는다.
            context.globalAlpha = 0.4;
            context.strokeStyle = line;
            context.lineWidth = 1;
            context.beginPath();
            for (let column = 0; column <= columns; column += 1) {
                const x = Math.round(column * PANE) + 0.5;
                context.moveTo(x, 0);
                context.lineTo(x, height);
            }
            for (let row = 0; row <= rows; row += 1) {
                const y = Math.round(row * PANE) + 0.5;
                context.moveTo(0, y);
                context.lineTo(width, y);
            }
            context.stroke();
            context.globalAlpha = 1;
        };

        const tick = (time: number) => {
            const delta = Math.min(time - last, 48);
            last = time;
            elapsed += delta;
            // 스크롤이 빛을 함께 민다 — 표지를 지나가는 동안 창의 계절이 바뀐다.
            draw(elapsed + window.scrollY * 26);
            frame = requestAnimationFrame(tick);
        };

        // reduced-motion에서도 리사이즈 후 다시 그려야 한다. 비트맵을 새로 잡으면
        // 이전 그림이 지워지는데 rAF가 없어 아무도 다시 그려주지 않는다.
        const onResize = reduced
            ? () => {
                  resize();
                  draw(0);
              }
            : resize;

        resize();
        window.addEventListener("resize", onResize);

        if (reduced) {
            draw(0);
            return () => window.removeEventListener("resize", onResize);
        }

        last = performance.now();
        frame = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", onResize);
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
