import { useEffect, useRef } from "react";

import {
    AdditiveBlending,
    AmbientLight,
    CanvasTexture,
    Clock,
    Color,
    DirectionalLight,
    ExtrudeGeometry,
    Fog,
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    Shape,
    SRGBColorSpace,
    Vector2,
    WebGLRenderer,
} from "three";

import baptistBoard from "@/assets/baptist-board-tokens.webp";
import baptistHome from "@/assets/baptist-screen-03.webp";
import baptistCard from "@/assets/baptist-screen-04.webp";
import baptistBulletin from "@/assets/baptist-screen-06.webp";
import safeopsHome from "@/assets/safeops-home.webp";
import safeopsNotifications from "@/assets/safeops-notifications.webp";
import safeopsReport from "@/assets/safeops-report.webp";
import safeopsSettings from "@/assets/safeops-settings.webp";

import { subscribeMood } from "@/lib/atmosphere";
import { getLenisInstance } from "@/lib/lenis";

/**
 * 화면 재료. 배경이 추상 도형이 아니라 **실제로 만든 것**이라야 프론트엔드 지면으로 읽힌다.
 *
 * `kind`가 그 화면이 어떤 기기에 담길지를 정한다 — 앱 화면은 폰 목업, 보드는 브라우저 창.
 * 화면을 맨판에 붙이면 "이미지를 붙였다"로 보이고, 기기에 담기면 "만든 앱"으로 읽힌다.
 */
type Mockup = "phone" | "browser" | "editor";

const SHOTS: { src: string; kind: Mockup }[] = [
    { src: safeopsHome, kind: "phone" },
    { src: baptistHome, kind: "phone" },
    { src: safeopsNotifications, kind: "phone" },
    { src: baptistCard, kind: "phone" },
    { src: safeopsReport, kind: "phone" },
    { src: baptistBulletin, kind: "phone" },
    { src: safeopsSettings, kind: "phone" },
    { src: baptistBoard, kind: "browser" },
];

/** 코드 패널에 찍을 조각들. 이 저장소에서 실제로 쓰는 형태를 줄여 옮겼다. */
const SNIPPETS: string[][] = [
    [
        "const { scrollYProgress } = useScroll();",
        "const y = useTransform(scrollYProgress,",
        "    [0, 1], [0, -120]);",
        "",
        "useGSAP(() => {",
        "    if (reduced) return;",
        "    gsap.from('.hero-char', {",
        "        yPercent: 130,",
        "        stagger: 0.026,",
        "        ease: 'power4.out',",
        "    });",
        "}, { scope: root });",
    ],
    [
        "export function moodFromAccent(hex: string) {",
        "    const accent = liftForDark(parse(hex));",
        "    return {",
        "        paper: mix(ROOM_PAPER, accent, 0.05),",
        "        line: mix(ROOM_LINE, accent, 0.18),",
        "        espresso: accent,",
        "    };",
        "}",
        "",
        "// 4.5:1을 넘을 때까지 밝기만 끌어올린다",
        "while (luminance(c) < TARGET) {",
        "    c = mix(c, WHITE, 0.06);",
        "}",
    ],
    [
        "const lenis = new Lenis({",
        "    duration: 1.1,",
        "    easing: (t) => Math.min(1,",
        "        1.001 - 2 ** (-10 * t)),",
        "});",
        "",
        "lenis.on('scroll', ScrollTrigger.update);",
        "gsap.ticker.add((time) => {",
        "    lenis.raf(time * 1000);",
        "});",
        "gsap.ticker.lagSmoothing(0);",
    ],
    [
        "type Listener = (",
        "    accent: Rgb,",
        "    paper: Rgb,",
        "    scene: number,",
        ") => void;",
        "",
        "export function setMood(id, mood, opts) {",
        "    if (activeId === id) return;",
        "    activeId = id;",
        "    tween = gsap.to(proxy, {",
        "        ...target, duration: 0.85,",
        "    });",
        "}",
    ],
    [
        "// 좌표는 열지 않아도 올라가야 한다",
        "const stale = Date.now() - lastFix;",
        "if (stale > SILENT_MS) {",
        "    return { tone: 'warn',",
        "        label: '위치를 보내지 못함' };",
        "}",
        "",
        "// 되돌림은 idle일 때만",
        "if (mutation.status === 'idle') {",
        "    queryClient.setQueryData(key, prev);",
        "}",
    ],
    [
        "export function moodFromAccent(hex) {",
        "    return {",
        "        paper: mix(ROOM, accent, 0.05),",
        "    };",
        "}",
        "",
        "const link = pending.take();",
        "if (link && navigationReady) {",
        "    navigate(link.route, link.params);",
        "}",
    ],
];

const CARDS = 34;
const SOURCES = SHOTS.length + SNIPPETS.length;

/* 목업의 화면 영역 크기(px). 본체 비율과 맞아야 화면이 늘어나 보이지 않는다. */
const SCREEN = {
    phone: { w: 440, h: 960, radius: 40 },
    browser: { w: 880, h: 550, radius: 10 },
    editor: { w: 880, h: 550, radius: 10 },
} as const;

function roundedPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

/** 창 손잡이의 신호등. 이게 있어야 그림이 아니라 창 하나로 읽힌다. */
function drawTrafficLights(ctx: CanvasRenderingContext2D, accent: string) {
    for (let dot = 0; dot < 3; dot += 1) {
        ctx.beginPath();
        ctx.arc(26 + dot * 20, 22, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = dot === 0 ? accent : "#33333f";
        ctx.fill();
    }
}

/**
 * 화면 텍스처를 만든다. 바깥은 투명이라 그 밑의 본체(둥근 모서리)가 그대로 드러난다.
 *
 * 폰이면 다이내믹 아일랜드와 홈 인디케이터를, 창이면 손잡이 막대를 얹는다 —
 * 스크린샷만 붙여 두면 어디에 담긴 화면인지 알 수 없다.
 */
function composeScreen(
    kind: Mockup,
    accent: string,
    paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
    const spec = SCREEN[kind];
    const canvas = document.createElement("canvas");
    canvas.width = spec.w;
    canvas.height = spec.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return null;
    }

    ctx.save();
    roundedPath(ctx, 0, 0, spec.w, spec.h, spec.radius);
    ctx.clip();

    if (kind === "phone") {
        paint(ctx, spec.w, spec.h);

        // 다이내믹 아일랜드
        ctx.fillStyle = "#000";
        roundedPath(ctx, spec.w / 2 - 58, 16, 116, 32, 16);
        ctx.fill();

        // 홈 인디케이터
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        roundedPath(ctx, spec.w / 2 - 62, spec.h - 18, 124, 5, 2.5);
        ctx.fill();
    } else {
        const bar = 44;
        ctx.fillStyle = kind === "editor" ? "#15151e" : "#1b1b23";
        ctx.fillRect(0, 0, spec.w, bar);
        drawTrafficLights(ctx, accent);

        if (kind === "browser") {
            // 주소 막대 — 브라우저라는 걸 알려 주는 최소한의 표시
            ctx.fillStyle = "#2a2a34";
            roundedPath(ctx, 100, 12, spec.w - 140, 20, 10);
            ctx.fill();
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, bar, spec.w, spec.h - bar);
        ctx.clip();
        ctx.translate(0, bar);
        paint(ctx, spec.w, spec.h - bar);
        ctx.restore();
    }

    ctx.restore();

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    return texture;
}

/** 이미지를 화면 영역에 꽉 차게(cover) 그린다. 위쪽을 기준으로 잘라 상태바가 살아남는다. */
function paintCover(image: HTMLImageElement) {
    return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        const scale = Math.max(w / image.width, h / image.height);
        const dw = image.width * scale;
        const dh = image.height * scale;
        ctx.drawImage(image, (w - dw) / 2, 0, dw, dh);
    };
}

/** 코드는 내려받지 않고 그 자리에서 그린다. 액센트가 바뀌면 다시 칠하면 된다. */
function paintCode(lines: string[], accent: string) {
    return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.fillStyle = "#0c0c12";
        ctx.fillRect(0, 0, w, h);
        ctx.font = "22px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textBaseline = "top";

        const keyword = /\b(const|export|function|return|type|while|if|new|=>)\b/g;
        lines.forEach((line, index) => {
            const y = 22 + index * 32;
            ctx.fillStyle = "#37374a";
            ctx.fillText(String(index + 1).padStart(2, " "), 22, y);

            // 키워드만 액센트로 찍는다. 토크나이저를 흉내 낼 필요는 없다 — 멀리서 보는 그림이다.
            let cursor = 70;
            let last = 0;
            keyword.lastIndex = 0;
            let match = keyword.exec(line);
            while (match) {
                const before = line.slice(last, match.index);
                ctx.fillStyle = "#82829b";
                ctx.fillText(before, cursor, y);
                cursor += ctx.measureText(before).width;
                ctx.fillStyle = accent;
                ctx.fillText(match[0], cursor, y);
                cursor += ctx.measureText(match[0]).width;
                last = match.index + match[0].length;
                match = keyword.exec(line);
            }
            ctx.fillStyle = "#82829b";
            ctx.fillText(line.slice(last), cursor, y);
        });
    };
}

/** 유리 반사. 화면 위를 비스듬히 훑고 지나가는 밝은 띠 하나가 판을 물건처럼 보이게 한다. */
function drawSheen() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return null;
    }
    const gradient = ctx.createLinearGradient(0, 256, 256, 0);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(0.42, "rgba(255,255,255,0)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.55)");
    gradient.addColorStop(0.58, "rgba(255,255,255,0)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new CanvasTexture(canvas);
}

/* 기기 본체. 모서리를 둥글리고 베벨을 줘서 조명이 테두리를 훑게 한다 —
   납작한 판에는 두께가 없고, 두께가 없으면 아무리 배치를 잘 해도 스티커로 보인다. */
const BODY = {
    phone: { w: 0.48, h: 1, radius: 0.06, depth: 0.05, bezel: 0.02 },
    browser: { w: 1.6, h: 1, radius: 0.03, depth: 0.045, bezel: 0.016 },
    editor: { w: 1.6, h: 1, radius: 0.03, depth: 0.045, bezel: 0.016 },
} as const;

function roundedShape(w: number, h: number, r: number) {
    const shape = new Shape();
    const x = -w / 2;
    const y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
}

function makeBody(kind: Mockup) {
    const spec = BODY[kind];
    const geometry = new ExtrudeGeometry(roundedShape(spec.w, spec.h, spec.radius), {
        depth: spec.depth,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 2,
        curveSegments: 8,
    });
    geometry.translate(0, 0, -spec.depth / 2);
    return geometry;
}

interface Card {
    group: Group;
    shell: MeshLambertMaterial;
    face: MeshBasicMaterial;
    sheen: MeshBasicMaterial;
    seed: number;
    /** 고정된 깊이 순위(0 = 가장 앞). 배치가 바뀌어도 이 순서는 절대 바뀌지 않는다. */
    rank: number;
    /** 커서 때문에 생긴 어긋남. 목표값으로 천천히 따라가야 손을 움직여도 카드가 튀지 않는다. */
    offsetX: number;
    offsetY: number;
}

/** 카메라는 한 자리에 둔다. 배치가 화면 좌표라 펼침은 배치가 맡고, 시점은 시차만 담당한다. */
const CAMERA_Z = 9;

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** 사선 배치가 흐르는 방향(정규화). 대각선 각도 ≈ 39°. */
const DIAG_X = 0.78;
const DIAG_Y = 0.63;
/** 사선을 몇 갈래로 겹쳐 흘릴지. 한 줄로는 화면 대각선만 채우고 위아래가 비어 성기다. */
const LANES = 3;

/**
 * 한 카드가 구간별로 **화면의 어디에** 서는지. 월드 좌표가 아니라 정규화 좌표(-1~1)로 적는다.
 *
 * 월드 좌표로 적으면 창 비율이 바뀔 때마다 카드가 화면 밖으로 나가거나 가운데로 몰린다.
 * 화면 좌표로 적고 매 프레임 그 깊이에서의 시야 크기로 환산하면, **보이는 범위 안에서만**
 * 펼쳐진다 — 안 보이는 데까지 벌려 두는 건 의미가 없다.
 *
 * **깊이는 여기서 정하지 않는다.** 카드마다 고정된 깊이 순위가 따로 있고(DEPTH), 배치는
 * 좌우·상하만 바꾼다. 배치마다 z를 새로 주면 전환 도중 두 카드가 서로를 통과해 앞뒤가 뒤집힌다.
 *
 * out = [nx, ny, rx, ry, rz]
 *
 * 0 무리   가운데로 뭉쳐 겹쳐 있다
 * 1 궤도   타원을 그리며 바깥으로 벌어진다
 * 2 격자   화면 가득 가지런히 늘어선다
 * 3 사선   좌하 → 우상 대각선으로 쫙 나열된다
 */
function placement(layout: number, index: number, seed: number, out: number[]) {
    if (layout === 0) {
        /* 가운데가 뚫린 고리. 피보나치 각도로 돌리되 반지름을 **면적 기준**으로 안쪽 반지름부터
           배분해, 화면 가장자리까지 고르게 차면서 한가운데는 비어 제목이 앉는다.
           `sqrt`로 굽히지 않으면 안쪽에만 몰린다 — 고리의 면적은 반지름의 제곱에 비례한다. */
        const inner = 0.4;
        const angle = index * GOLDEN;
        const radius = Math.sqrt(inner * inner + (1 - inner * inner) * ((index + 0.5) / CARDS));
        out[0] = Math.cos(angle) * radius * 1.02;
        out[1] = Math.sin(angle) * radius * 0.92;
        out[2] = (seed - 0.5) * 0.1;
        out[3] = (seed - 0.5) * 0.24;
        out[4] = (seed - 0.5) * 0.08;
        return;
    }

    if (layout === 1) {
        /* 고리 세 겹. 한 겹짜리 링은 가운데와 모서리가 함께 비어 성기게 보인다 —
           안쪽에도 몇 장 두어야 화면이 찬다. */
        const band = index % 3;
        const seat = Math.floor(index / 3);
        const perBand = Math.ceil(CARDS / 3);
        const angle = (seat / perBand) * Math.PI * 2 + band * 0.8 + seed * 0.25;
        const radius = 0.34 + band * 0.33;
        out[0] = Math.cos(angle) * radius * 1.06;
        out[1] = Math.sin(angle) * radius * 0.94;
        out[2] = (seed - 0.5) * 0.08;
        out[3] = -Math.cos(angle) * 0.22;
        out[4] = 0;
        return;
    }

    const cols = 7;
    const rows = Math.ceil(CARDS / cols);
    const col = index % cols;
    const row = Math.floor(index / cols);

    if (layout === 2) {
        // 가지런한 격자. 흔들림을 아주 조금만 줘서 "정렬돼 있다"가 먼저 읽히게 한다.
        out[0] = (col / (cols - 1) - 0.5) * 1.94 + (seed - 0.5) * 0.07;
        out[1] = (row / (rows - 1) - 0.5) * 1.82 + (seed - 0.5) * 0.07;
        out[2] = 0;
        out[3] = -out[0] * 0.24;
        out[4] = 0;
        return;
    }

    /* 대각선 스트림. 앞 구간이 가지런한 격자라, 여기서 격자를 흔들기만 하면 **같은 조판**으로
       읽힌다 — 축을 통째로 비틀어 카드가 왼쪽 아래에서 오른쪽 위로 흐르는 사선 띠를 이룬다.
       세 갈래로 나누되 갈래마다 반 칸씩 밀어, 줄이 세 개로 끊겨 보이지 않고 하나로 흐른다. */
    const lane = index % LANES;
    const seat = Math.floor(index / LANES);
    const seats = Math.ceil(CARDS / LANES);
    const step = 1.84 / (seats - 1);
    const along = (seat / (seats - 1) - 0.5) * 1.84 + (lane / LANES - 0.33) * step;
    const across = (lane - (LANES - 1) / 2) * 0.4 + (seed - 0.5) * 0.1;

    // 사선 축(along)과 그 수직축(across)을 화면 좌표로 되돌린다.
    out[0] = DIAG_X * along - DIAG_Y * across;
    out[1] = DIAG_Y * along + DIAG_X * across;
    out[2] = (seed - 0.5) * 0.06;
    out[3] = -out[0] * 0.2;
    // 카드도 같은 각도로 눕는다. 흐름과 나란해야 사선이 배치가 아니라 **방향**으로 읽힌다.
    out[4] = 0.34 + (seed - 0.5) * 0.06;
}

/**
 * 배치별 깊이 분포. `[가장 앞, 가장 뒤, 지수]`로, 카드의 깊이 순위(0~1)를 지수로 굽혀 배분한다.
 * 지수는 단조 함수라 **순위가 뒤바뀌지 않는다** — 앞뒤가 고정된 채 간격만 달라진다.
 *
 * 범위를 깊게 잡으면 뒤쪽 카드가 안개와 거리 감쇠에 먹혀 사라지고, 격자에 구멍이 뚫린 것처럼
 * 성기게 보인다. 앞뒤 크기 차가 두 배쯤 나는 선에서 끊는다.
 */
const DEPTH = [
    [0.5, -11, 1],
    [1.5, -12, 1.05],
    [0, -12, 0.9],
    [2, -15, 1.15],
] as const;

function sampleDepth(value: number, axis: number) {
    const clamped = Math.max(0, Math.min(3, value));
    const low = Math.floor(clamped);
    const high = Math.min(3, low + 1);
    const ratio = clamped - low;
    return DEPTH[low][axis] * (1 - ratio) + DEPTH[high][axis] * ratio;
}

/**
 * 구간마다 화면을 쓰는 폭. 첫 화면부터 가득 채우므로 값의 차이는 크지 않다 —
 * 구간 전환은 **배치의 모양**이 맡는다(가운데가 뚫린 고리 → 채워진 세 겹 → 격자 → 흔든 격자).
 */
const SPREAD = [0.92, 0.98, 1.04, 1.06] as const;

function sampleSpread(value: number) {
    const clamped = Math.max(0, Math.min(3, value));
    const low = Math.floor(clamped);
    const high = Math.min(3, low + 1);
    const ratio = clamped - low;
    return SPREAD[low] * (1 - ratio) + SPREAD[high] * ratio;
}

/**
 * 홈 전체의 배경. 실제 프로젝트 화면과 코드 패널이 **두께가 있는 카드**로 3D 공간에 떠 있고,
 * 스크롤이 그 배치를(깊이 → 호 → 격자 → 사선), 커서가 시점과 시차를 움직인다.
 *
 * 입체감은 세 가지에서 나온다 — 카드에 실제 **두께**가 있어 조명이 테두리를 다르게 물들이고,
 * 앞뒤로 벌어진 **깊이** 차가 커서를 따라 **시차**로 어긋난다. 화면 면만은 조명을 받지 않는다:
 * 켜져 있는 화면이라 스스로 빛나는 게 맞고, 그래야 UI의 원래 색이 유지된다.
 */
export default function HomeStage() {
    const hostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) {
            return;
        }

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const coarse = window.matchMedia("(pointer: coarse)").matches;

        let renderer: WebGLRenderer;
        try {
            renderer = new WebGLRenderer({
                antialias: !coarse,
                alpha: false,
                powerPreference: "low-power",
            });
        } catch {
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.75));
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        renderer.outputColorSpace = SRGBColorSpace;
        host.appendChild(renderer.domElement);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";

        const paper = new Color("#08070c");
        const accent = new Color("#e7e0d2");

        const scene = new Scene();
        // 안개가 깊이를 만든다. 멀리 있는 카드는 지면색에 잠겨 배경과 이어진다.
        scene.fog = new Fog(paper.getHex(), 5, 30);
        // 화각을 넓게 잡을수록 앞뒤 크기 차가 벌어져 같은 배치도 더 깊어 보인다.
        const camera = new PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 90);
        camera.position.z = CAMERA_Z;

        scene.add(new AmbientLight(0xffffff, 0.5));
        const key = new DirectionalLight(0xffffff, 1.15);
        key.position.set(3, 4, 6);
        scene.add(key);
        const rim = new DirectionalLight(0xffffff, 0.45);
        rim.position.set(-5, -1, 2);
        scene.add(rim);

        const bodies = {
            phone: makeBody("phone"),
            browser: makeBody("browser"),
            editor: makeBody("editor"),
        };
        const faceGeometry = new PlaneGeometry(1, 1);
        const sheenTexture = drawSheen();
        const cards: Card[] = [];

        /* 깊이 순위를 인덱스와 떼어 놓는다. 순위가 인덱스를 그대로 따르면 격자에서 읽는 순서대로
           앞에서 뒤로 깔려, 화면이 채워진 게 아니라 비스듬한 경사로 보인다. */
        const ranks = Array.from({ length: CARDS }, (_, at) => at);
        for (let at = ranks.length - 1; at > 0; at -= 1) {
            const swap = Math.floor(Math.random() * (at + 1));
            [ranks[at], ranks[swap]] = [ranks[swap], ranks[at]];
        }

        // 코드 패널은 곧바로 그린다. 화면 스크린샷은 이미지가 도착한 뒤에 목업 안으로 합성한다.
        const screens: (CanvasTexture | null)[] = new Array(SOURCES).fill(null);
        SNIPPETS.forEach((lines, order) => {
            screens[SHOTS.length + order] = composeScreen(
                "editor",
                "#e7e0d2",
                paintCode(lines, "#e7e0d2"),
            );
        });

        const applyScreen = (pick: number) => {
            const texture = screens[pick];
            if (!texture) {
                return;
            }
            for (let index = pick; index < CARDS; index += SOURCES) {
                const card = cards[index];
                if (card) {
                    card.face.map = texture;
                    card.face.needsUpdate = true;
                }
            }
        };

        /* 이미지는 언마운트 뒤에 도착할 수 있다. 그때 만든 텍스처는 아래 정리 루프를 이미
           지나쳐 회수되지 못하고, 붙일 머티리얼도 dispose된 뒤다 — 아예 만들지 않는다. */
        let disposed = false;

        /* TextureLoader가 아니라 Image로 받는다 — 목업 안에 합성하려면 캔버스에 그릴 수 있는
           원본이 필요하고, Texture는 그릴 수 없다. */
        SHOTS.forEach((shot, order) => {
            const image = new Image();
            image.decoding = "async";
            image.onload = () => {
                if (disposed) {
                    return;
                }
                screens[order] = composeScreen(shot.kind, "#e7e0d2", paintCover(image));
                applyScreen(order);
            };
            image.src = shot.src;
        });

        for (let index = 0; index < CARDS; index += 1) {
            const pick = index % SOURCES;
            const kind: Mockup = pick < SHOTS.length ? SHOTS[pick].kind : "editor";
            const spec = BODY[kind];

            // 세로 목업은 크게, 가로 목업은 화면을 덜 먹도록 조금 작게.
            const height = kind === "phone" ? 3.1 : 2.3;

            const group = new Group();

            // 본체는 조명을 받는다 — 베벨이 기울며 만드는 명암이 곧 두께의 근거다.
            const shell = new MeshLambertMaterial({
                color: 0x1b1b24,
                transparent: true,
                opacity: 0,
            });
            const shellMesh = new Mesh(bodies[kind], shell);
            shellMesh.scale.setScalar(height);
            group.add(shellMesh);

            // 화면은 조명을 받지 않는다. 켜져 있는 화면이니 스스로 빛나는 게 맞다.
            const face = new MeshBasicMaterial({
                map: screens[pick],
                transparent: true,
                opacity: 0,
                depthWrite: false,
            });
            const faceMesh = new Mesh(faceGeometry, face);
            faceMesh.scale.set(
                (spec.w - spec.bezel * 2) * height,
                (spec.h - spec.bezel * 2) * height,
                1,
            );
            faceMesh.position.z = (spec.depth / 2 + 0.014) * height;
            group.add(faceMesh);

            const sheen = new MeshBasicMaterial({
                map: sheenTexture,
                transparent: true,
                opacity: 0,
                blending: AdditiveBlending,
                depthWrite: false,
            });
            const sheenMesh = new Mesh(faceGeometry, sheen);
            sheenMesh.scale.copy(faceMesh.scale);
            sheenMesh.position.z = faceMesh.position.z + 0.004;
            group.add(sheenMesh);

            /* 그리는 순서를 깊이 순위로 못 박는다. three가 거리로 정렬하면 두 카드의 거리가
               스칠 때 순서가 튀어(팝) 앞뒤가 깜빡인다. 먼 것부터 그리고, 한 카드 안에서는
               본체 → 화면 → 반사 순으로 겹친다. */
            const base = (CARDS - ranks[index]) * 10;
            shellMesh.renderOrder = base;
            faceMesh.renderOrder = base + 1;
            sheenMesh.renderOrder = base + 2;

            scene.add(group);
            cards.push({
                group,
                shell,
                face,
                sheen,
                seed: Math.random(),
                rank: ranks[index] / (CARDS - 1),
                offsetX: 0,
                offsetY: 0,
            });
        }

        let sceneValue = 0;
        const unsubscribe = subscribeMood((nextAccent, nextPaper, nextScene) => {
            accent.setRGB(nextAccent[0] / 255, nextAccent[1] / 255, nextAccent[2] / 255);
            paper.setRGB(nextPaper[0] / 255, nextPaper[1] / 255, nextPaper[2] / 255);
            renderer.setClearColor(paper, 1);
            (scene.fog as Fog).color.copy(paper);
            sceneValue = nextScene;
        });

        const pointer = new Vector2(0, 0);
        const smoothed = new Vector2(0, 0);
        let hovering = false;

        const onPointerMove = (event: PointerEvent) => {
            pointer.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                1 - (event.clientY / window.innerHeight) * 2,
            );
            hovering = true;
        };
        const onPointerLeave = () => {
            hovering = false;
        };

        if (!coarse) {
            window.addEventListener("pointermove", onPointerMove, { passive: true });
            document.addEventListener("pointerleave", onPointerLeave);
        }

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight, false);
        };
        window.addEventListener("resize", onResize);

        const clock = new Clock();
        let running = true;
        let frame = 0;
        let energy = 0;
        let blend = 0;
        let cursorGain = 0;

        const low: number[] = [0, 0, 0, 0, 0, 0];
        const high: number[] = [0, 0, 0, 0, 0, 0];
        const white = new Color(0xffffff);
        const shellBase = new Color(0x191922);

        const render = () => {
            const time = clock.getElapsedTime();

            // 포인터가 창을 벗어나면 시차도 제자리로 풀린다.
            if (!hovering) {
                pointer.multiplyScalar(0.94);
            }
            smoothed.lerp(pointer, 0.06);

            const velocity = getLenisInstance()?.velocity ?? 0;
            energy += (Math.max(-1, Math.min(1, velocity / 55)) - energy) * 0.08;

            /* 이 값은 `atmosphere`의 구간 트윈을 한 번 더 따라가는 완충일 뿐이다.
               느리게 잡으면 이징이 두 겹 쌓여 되돌아올 때 몇 초씩 끌린다. */
            blend += (Math.min(sceneValue, 3) - blend) * 0.14;
            const lowIndex = Math.floor(blend);
            const highIndex = Math.min(3, lowIndex + 1);
            const ratio = blend - lowIndex;

            // 프로젝트 무대에서는 배경이 통째로 물러난다.
            const fade = sceneValue > 3 ? 1 - Math.min(sceneValue - 3, 1) : 1;
            // 읽는 구간에서는 카드를 조금 지운다. 가독성은 스크림이 맡는다.
            const settle = 1 - Math.min(Math.min(sceneValue, 3), 1) * 0.4;

            const spread = sampleSpread(blend);
            const halfAngle = Math.tan((camera.fov * Math.PI) / 180 / 2);
            /* 좁은 화면에서는 카드도 같이 줄인다. 자리만 시야에 맞추고 크기를 그대로 두면
               세로 화면에서 카드 한 장이 화면 절반을 덮어, 코드 글자가 제목만큼 커진다. */
            const sizeScale = Math.min(1, Math.max(0.5, camera.aspect / 1.5));
            const depthNear = sampleDepth(blend, 0);
            const depthFar = sampleDepth(blend, 1);
            const depthCurve = sampleDepth(blend, 2);
            cursorGain += ((hovering && !reduced ? 1 : 0) - cursorGain) * 0.05;
            // 첫 섹션에서만 밀어낸다. 구간 1로 넘어가는 동안 따라가는 쪽으로 넘겨받는다.
            const repelMix = 1 - Math.min(1, blend);

            for (let index = 0; index < CARDS; index += 1) {
                const card = cards[index];
                placement(lowIndex, index, card.seed, low);
                placement(highIndex, index, card.seed, high);

                /* 카드마다 조금씩 늦게 출발한다. 전부 같은 순간에 움직이면 무리가 통째로
                   순간이동한 것처럼 보이고, 어긋나 있으면 자리를 서로 물려주는 것처럼 읽힌다. */
                const lag = card.rank * 0.4;
                const local = Math.max(0, Math.min(1, (ratio - lag) / (1 - 0.4)));
                const eased = local * local * (3 - 2 * local);

                const wander = reduced ? 0 : 0.05;
                let nx =
                    (low[0] + (high[0] - low[0]) * eased) * spread +
                    Math.sin(time * 0.17 + card.seed * 6.28) * wander;
                let ny =
                    (low[1] + (high[1] - low[1]) * eased) * spread +
                    Math.cos(time * 0.13 + card.seed * 4.7) * wander * 0.8;

                /* 첫 섹션에서는 **밀어내고**, 그 뒤로는 **따라간다**.
                   뭉쳐 있을 때는 비켜서야 카드 사이가 벌어지며 길이 나고, 펼쳐진 뒤에는
                   따라와야 깊이별로 다르게 밀리는 시차가 보인다. `repelMix`가 그 사이를 잇는다. */
                const dx = nx - smoothed.x;
                const dy = ny - smoothed.y * 0.75;
                const gap = Math.hypot(dx, dy) + 0.0001;
                const repel = Math.exp((-gap * gap) / 0.3) * 0.24 * repelMix * cursorGain;
                const follow = (1 - repelMix) * cursorGain * (0.09 - card.rank * 0.05);

                const wantX = (dx / gap) * repel + smoothed.x * follow * 4.2;
                const wantY = (dy / gap) * repel * 0.85 + smoothed.y * follow * 2.4;

                /* 목표로 곧장 가지 않고 천천히 따라붙는다. 커서 좌표를 그대로 더하면 손을 조금만
                   움직여도 카드가 같은 프레임에 튄다 — 무게가 없어 보이는 원인이다. */
                card.offsetX += (wantX - card.offsetX) * 0.045;
                card.offsetY += (wantY - card.offsetY) * 0.045;
                nx += card.offsetX;
                ny += card.offsetY;

                // 밀려난 카드가 화면 밖으로 빠져나가지 않게 가장자리에서 완만히 잡는다.
                nx = Math.tanh(nx / 1.18) * 1.18;
                ny = Math.tanh(ny / 1.12) * 1.12;

                /* 깊이는 배치가 아니라 **고정된 순위**에서 나온다. 지수는 단조 함수라 간격만
                   달라지고 앞뒤는 절대 뒤바뀌지 않는다 — 전환 중에 서로를 통과하지 않는다. */
                const z = depthNear + (depthFar - depthNear) * card.rank ** depthCurve;

                /* 화면 좌표 → 월드 좌표. 그 깊이에서 카메라가 실제로 보는 범위로 환산하므로
                   창이 좁아지거나 넓어져도 카드가 늘 화면 안에 머문다. */
                const distance = Math.max(0.6, CAMERA_Z - z);
                const halfHeight = halfAngle * distance;
                const halfWidth = halfHeight * camera.aspect;

                card.group.position.set(nx * halfWidth, ny * halfHeight, z);
                card.group.scale.setScalar(sizeScale);
                card.group.rotation.set(
                    low[2] +
                        (high[2] - low[2]) * eased -
                        smoothed.y * 0.08 +
                        (reduced ? 0 : Math.sin(time * 0.19 + card.seed * 3.1) * 0.05),
                    low[3] + (high[3] - low[3]) * eased + smoothed.x * 0.12,
                    low[4] + (high[4] - low[4]) * eased,
                );

                /* 카메라에 가까운 카드만 또렷하게. 멀리 있는 것까지 다 진하면 겹쳐 보여
                   깊이가 사라지고, 그 순간 3D가 아니라 콜라주가 된다. */
                const near = 1 - Math.min(Math.max((distance - 4) / 26, 0), 1);
                const alpha = (0.26 + near * 0.68) * fade * settle;

                card.face.opacity = alpha;
                /* 본체를 화면보다 진하게 두면, 멀어서 흐려진 카드가 **검은 판**만 남는다.
                   같은 값으로 함께 빠져야 기기가 통째로 옅어진 것으로 보인다. */
                card.shell.opacity = alpha;
                card.sheen.opacity = alpha * 0.16;

                /* 구간의 색은 아주 옅게만 얹는다. 세게 섞으면 화면들이 전부 한 색으로 물들어
                   실제 UI라는 사실이 지워진다 — 색은 원래 이 화면들이 들고 온 것이다. */
                card.face.color.lerpColors(white, accent, 0.04 + (1 - near) * 0.14);
                // 껍데기 테두리에는 액센트를 조금 더 준다. 카드의 윤곽이 구간 색을 띤다.
                card.shell.color.lerpColors(shellBase, accent, 0.1 + near * 0.14);
            }

            // 시차는 카메라가 낸다. 카드까지 커서를 따라가면 무리 전체가 흔들려 보인다.
            camera.position.set(smoothed.x * 0.6, smoothed.y * 0.4 + energy * 0.35, CAMERA_Z);
            camera.lookAt(0, 0, -6);
            camera.rotation.z += energy * 0.02;

            (scene.fog as Fog).near = 5 - Math.min(sceneValue, 3) * 0.4;
            (scene.fog as Fog).far = 32 - Math.min(sceneValue, 3) * 1.2;

            renderer.render(scene, camera);
            if (running) {
                frame = requestAnimationFrame(render);
            }
        };

        const onVisibility = () => {
            if (document.hidden) {
                running = false;
                cancelAnimationFrame(frame);
            } else if (!running) {
                running = true;
                frame = requestAnimationFrame(render);
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        frame = requestAnimationFrame(render);

        return () => {
            disposed = true;
            running = false;
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", onPointerMove);
            document.removeEventListener("pointerleave", onPointerLeave);
            window.removeEventListener("resize", onResize);
            document.removeEventListener("visibilitychange", onVisibility);
            unsubscribe();
            for (const card of cards) {
                card.shell.dispose();
                card.face.dispose();
                card.sheen.dispose();
            }
            for (const texture of screens) {
                texture?.dispose();
            }
            sheenTexture?.dispose();
            for (const geometry of Object.values(bodies)) {
                geometry.dispose();
            }
            faceGeometry.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return (
        <div ref={hostRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-paper" />
    );
}
