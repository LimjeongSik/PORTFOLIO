import {
    CanvasTexture,
    ExtrudeGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Shape,
    SRGBColorSpace,
} from "three";

import type { MeshPhysicalMaterial } from "three";

/**
 * 무대의 재료.
 *
 * 평면에 스크린샷을 붙이면 아무리 돌려도 종이가 뒤집히는 것으로 읽힌다. 여기서 만드는 건
 * **두께가 있는 물건**이다 — 둥근 사각형을 압출한 몸체(베벨이 빛을 받아 두께의 근거가 된다),
 * 그 위에 스스로 빛나는 화면, 그 위에 환경광을 받아 반짝이는 유리 한 겹.
 */

/** 만든 것을 전부 기억해 두었다가 한 번에 버린다. */
export class Disposer {
    private items: { dispose(): void }[] = [];

    add<T extends { dispose(): void }>(item: T): T {
        this.items.push(item);
        return item;
    }

    dispose() {
        for (const item of this.items) {
            item.dispose();
        }
        this.items = [];
    }
}

function roundedShape(width: number, height: number, radius: number) {
    const shape = new Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
}

export const BEVEL = 0.018;

/** 둥근 판을 압출한 몸체. z축 가운데에 놓인다. */
export function bodyGeometry(width: number, height: number, depth: number, radius: number) {
    const geometry = new ExtrudeGeometry(roundedShape(width, height, radius), {
        depth,
        bevelEnabled: true,
        bevelThickness: BEVEL,
        bevelSize: BEVEL,
        bevelSegments: 3,
        curveSegments: 10,
    });
    geometry.translate(0, 0, -depth / 2);
    return geometry;
}

/* ── 이미지 ──────────────────────────────────────────────────────────────── */

const images = new Map<string, Promise<HTMLImageElement>>();

/**
 * `TextureLoader`가 아니라 `Image`로 받는다 — 목업 안에 합성하려면 캔버스에 그릴 수 있는
 * 원본이 필요한데, `Texture`는 그릴 수 없다.
 */
export function loadImage(src: string) {
    let pending = images.get(src);
    if (!pending) {
        pending = new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.decoding = "async";
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`image failed: ${src}`));
            image.src = src;
        });
        images.set(src, pending);
    }
    return pending;
}

/* ── 화면 ────────────────────────────────────────────────────────────────── */

export type ScreenKind = "phone" | "window" | "plain";

interface ScreenTextureOptions {
    kind: ScreenKind;
    width: number;
    height: number;
    radius: number;
}

function roundedPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
}

/** 기기의 크롬을 화면 위에 합성한다. 폰은 다이내믹 아일랜드·홈 인디케이터, 창은 손잡이. */
function drawChrome(ctx: CanvasRenderingContext2D, options: ScreenTextureOptions) {
    const { kind, width, height } = options;
    if (kind === "plain") {
        return;
    }
    if (kind === "phone") {
        const island = { w: width * 0.3, h: height * 0.032, r: height * 0.016 };
        ctx.fillStyle = "#05050a";
        roundedPath(ctx, (width - island.w) / 2, height * 0.02, island.w, island.h, island.r);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.72)";
        roundedPath(ctx, width * 0.32, height * 0.978, width * 0.36, height * 0.006, 4);
        ctx.fill();
        return;
    }
    const bar = height * 0.075;
    ctx.fillStyle = "#15131c";
    ctx.fillRect(0, 0, width, bar);
    ctx.fillStyle = "#2a2733";
    ctx.fillRect(0, bar - 1, width, 1);
    for (const [index, color] of ["#ff5f57", "#febc2e", "#28c840"].entries()) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(bar * 0.55 + index * bar * 0.55, bar / 2, bar * 0.16, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = "#211e29";
    roundedPath(ctx, width * 0.24, bar * 0.25, width * 0.52, bar * 0.5, bar * 0.25);
    ctx.fill();
}

/**
 * 화면 하나를 캔버스에 굽는다. 이미지가 오기 전에는 꺼진 화면, 온 뒤에는 화면을 꽉 채워
 * 자른 스크린샷 위에 크롬을 얹는다. 바깥은 투명이라 그 밑의 몸체가 그대로 비친다.
 */
export function screenTexture(options: ScreenTextureOptions) {
    const { width, height, radius } = options;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;

    const paint = (image: HTMLImageElement | null) => {
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        roundedPath(ctx, 0, 0, width, height, radius);
        ctx.clip();
        ctx.fillStyle = "#0b0a10";
        ctx.fillRect(0, 0, width, height);
        if (image) {
            const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
            const w = image.naturalWidth * scale;
            const h = image.naturalHeight * scale;
            ctx.drawImage(image, (width - w) / 2, 0, w, h);
        }
        drawChrome(ctx, options);
        ctx.restore();
        texture.needsUpdate = true;
    };

    paint(null);

    return {
        texture,
        load(src: string) {
            loadImage(src)
                .then(paint)
                .catch(() => undefined);
        },
    };
}

/* ── 기기 ────────────────────────────────────────────────────────────────── */

export interface DeviceSpec {
    kind: ScreenKind;
    /** 월드 단위 */
    width: number;
    height: number;
    depth: number;
    radius: number;
}

export const PHONE: DeviceSpec = {
    kind: "phone",
    width: 1,
    height: 2.1,
    depth: 0.09,
    radius: 0.15,
};
export const WINDOW: DeviceSpec = {
    kind: "window",
    width: 2.4,
    height: 1.55,
    depth: 0.07,
    radius: 0.1,
};

export interface Device {
    group: Group;
    body: Mesh<ExtrudeGeometry, MeshPhysicalMaterial>;
    screen: Mesh<PlaneGeometry, MeshBasicMaterial>;
    load: () => void;
}

interface DeviceFactoryOptions {
    disposer: Disposer;
    bodyMaterial: MeshPhysicalMaterial;
    glassMaterial: MeshPhysicalMaterial;
}

/**
 * 같은 규격의 기기는 지오메트리를 나눠 쓴다. 화면 텍스처만 기기마다 다르다.
 */
export function deviceFactory(spec: DeviceSpec, options: DeviceFactoryOptions) {
    const { disposer, bodyMaterial, glassMaterial } = options;
    const bezel = spec.kind === "phone" ? 0.035 : 0.03;
    const body = disposer.add(bodyGeometry(spec.width, spec.height, spec.depth, spec.radius));
    const face = disposer.add(new PlaneGeometry(spec.width - bezel * 2, spec.height - bezel * 2));
    const pixels = spec.kind === "phone" ? 360 : 640;
    const px = pixels / (spec.width - bezel * 2);

    return (src: string): Device => {
        const shot = screenTexture({
            kind: spec.kind,
            width: Math.round((spec.width - bezel * 2) * px),
            height: Math.round((spec.height - bezel * 2) * px),
            radius: (spec.radius - bezel) * px,
        });
        disposer.add(shot.texture);

        const group = new Group();
        const bodyMesh = new Mesh(body, bodyMaterial);
        group.add(bodyMesh);

        /* 화면 면만은 조명을 받지 않는다 — 켜져 있는 화면이니 스스로 빛나는 게 맞고,
           톤매핑도 건너뛰어야 UI의 원래 색이 눌리지 않는다. */
        const screenMaterial = disposer.add(
            new MeshBasicMaterial({ map: shot.texture, transparent: true, toneMapped: false }),
        );
        const screen = new Mesh(face, screenMaterial);
        screen.position.z = spec.depth / 2 + BEVEL + 0.003;
        group.add(screen);

        /* 유리 — 환경광이 스치는 자리만 반짝인다. 화면이 돌 때 하이라이트가 면을 훑고
           지나가는 것이 "물건"으로 읽히는 마지막 근거다. */
        const glass = new Mesh(face, glassMaterial);
        glass.position.z = screen.position.z + 0.004;
        group.add(glass);

        let loaded = false;
        return {
            group,
            body: bodyMesh,
            screen,
            load() {
                if (loaded) {
                    return;
                }
                loaded = true;
                shot.load(src);
            },
        };
    };
}

/* ── 글자 판 ─────────────────────────────────────────────────────────────── */

export interface TextLine {
    text: string;
    /** CSS font 단축 표기. 예: `700 64px 'Space Grotesk'` */
    font: string;
    color: string;
    /** 캔버스 높이 기준 0~1 */
    y: number;
    align?: CanvasTextAlign;
    letterSpacing?: string;
}

interface TextTextureOptions {
    width: number;
    height: number;
    lines: TextLine[];
}

const rebakes = new Set<() => void>();
let fontsWatched = false;

/**
 * 글자를 투명한 판에 굽는다. 웹폰트가 늦게 오면 시스템 폰트로 먼저 굽히므로, 폰트가 준비되면
 * 같은 캔버스에 한 번 더 굽는다.
 */
export function textTexture(options: TextTextureOptions) {
    const { width, height, lines } = options;
    const ratio = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext("2d");
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;

    const bake = () => {
        if (!ctx) {
            return;
        }
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.textBaseline = "middle";
        for (const line of lines) {
            ctx.font = line.font;
            ctx.fillStyle = line.color;
            ctx.textAlign = line.align ?? "center";
            ctx.letterSpacing = line.letterSpacing ?? "0px";
            const x = line.align === "left" ? 0 : line.align === "right" ? width : width / 2;
            ctx.fillText(line.text, x, height * line.y, width);
        }
        texture.needsUpdate = true;
    };

    bake();
    rebakes.add(bake);
    if (!fontsWatched) {
        fontsWatched = true;
        document.fonts.ready.then(() => {
            for (const rebake of rebakes) {
                rebake();
            }
        });
    }

    return {
        texture,
        release() {
            rebakes.delete(bake);
            texture.dispose();
        },
    };
}

export const DISPLAY = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, monospace";
export const BODY = "Pretendard, 'Space Grotesk', ui-sans-serif, system-ui, sans-serif";
