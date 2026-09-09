import {
    ACESFilmicToneMapping,
    Color,
    DirectionalLight,
    Fog,
    HemisphereLight,
    MeshPhysicalMaterial,
    PerspectiveCamera,
    PMREMGenerator,
    PointLight,
    Scene,
    SRGBColorSpace,
    Vector2,
    Vector3,
    WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

import { subscribeMood } from "@/lib/atmosphere";
import { ScrollTrigger } from "@/lib/gsap";
import { getLenisInstance } from "@/lib/lenis";
import { viewportWatcher } from "@/lib/viewport";

import { Disposer, deviceFactory, PHONE, WINDOW } from "./mockup";
import { Timeline } from "./timeline";

import type { Group, Object3D, PlaneGeometry } from "three";
import type { Mood } from "@/lib/atmosphere";
import type { bodyGeometry, Device } from "./mockup";
import type { CameraKey } from "./timeline";

/**
 * 무대 장치 — 이 사이트의 **유일한** 3D 무대.
 *
 * 홈과 프로젝트 상세는 서로 다른 지면이 아니라 **한 공간 안의 서로 다른 자리**다. 그래서
 * 캔버스도 하나고, 라우트가 갈려도 파괴하지 않는다(`App`이 라우터 바깥에서 들고 있다).
 * 페이지를 넘기는 것은 화면을 갈아 끼우는 일이 아니라 **카메라가 그리로 날아가는 일**이다.
 *
 * 문법은 셋이다.
 *
 * 1. **스크롤이 유일한 시간축이다.** 카메라 자리·시선·화각이 전부 지금 스크롤 위치의 순수
 *    함수다(`./timeline`). 1px 굴리면 1px만큼 움직이고 손을 떼면 선다. 예외는 하나 —
 *    라우트가 갈리는 동안의 **비행**(`hold`/`release`)이고, 그것도 스스로 끝난다.
 * 2. **장면이 아니라 장소다.** 구간은 한 공간 안의 좌표고, 카메라 하나가 그 사이를 난다.
 *    구간 사이의 스크롤이 곧 비행 시간이고, 지나온 장소는 페이드로 지우지 않는다.
 * 3. **물건은 두께와 재질을 가진다**(`./mockup`). 압출한 몸체 · 스스로 빛나는 화면 ·
 *    환경광을 받는 유리.
 *
 * 어느 장소가 지금 살아 있는지는 **DOM이 정한다**. `Timeline`은 `data-stage-zone`을 못 찾은
 * 구간의 키를 통째로 버리므로, 홈에 서 있으면 상세의 장소들이, 상세에 서 있으면 홈의
 * 장소들이 저절로 꺼진다 — 두 세계가 같은 좌표계에서 겹쳐 있어도 되는 이유다.
 */

/** 구간이 이만큼(화면 높이) 안으로 오면 그린다. 그보다 멀면 안개 너머라 어차피 안 보인다. */
const DRAW_WITHIN = 3.2;
/** 이만큼 가까워지면 이미지를 받기 시작한다. */
const WARM_WITHIN = 1.8;

/**
 * 비행 시간(초)은 **거리에서 나온다.**
 *
 * 목록에서 프로젝트로 들어가는 것은 몇 걸음이지만(두 자리가 겹쳐 있다), 상세 맨 아래에서
 * "프로젝트 목록"을 누르면 100 단위를 되돌아 나와야 한다. 같은 시간을 주면 앞은 굼뜨고
 * 뒤는 순간이동이 된다.
 */
const FLIGHT_MIN = 0.65;
const FLIGHT_MAX = 1.5;
const FLIGHT_PER_UNIT = 0.012;

function clamp(value: number, min: number, max: number) {
    return value < min ? min : value > max ? max : value;
}

function clamp01(value: number) {
    return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(edge0: number, edge1: number, value: number) {
    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
}

/** 비행의 이징 — 떠날 때도 닿을 때도 부드럽게. */
function easeInOut(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export interface Frame {
    /** 초 */
    time: number;
    /** 스크롤 속도를 -1~1로 눌러 부드럽게 따라붙인 값 */
    lag: number;
    /** 가만히 있어도 미세하게 숨쉬어도 되는가(동작 줄이기가 꺼져 있을 때만) */
    idle: boolean;
    /** 세로로 긴 창인가 — 화각이 좁아 가까운 물건이 화면을 덮는다 */
    narrow: boolean;
    forward: Vector3;
    camera: Vector3;
}

export interface Zone {
    /** DOM의 `data-stage-zone` 값 */
    name: string;
    group: Group;
    /** 카메라 키 — 창 비율에 따라 시선을 달리 잡을 수 있어 잴 때마다 다시 만든다. */
    keys(aspect: number): CameraKey[];
    /** 이미지처럼 늦게 받아도 되는 것을 받는다. 구간이 가까워질 때 한 번. */
    warm(): void;
    update(local: number, frame: Frame): void;
}

export interface Materials {
    deviceBody: MeshPhysicalMaterial;
    glass: MeshPhysicalMaterial;
    plate: MeshPhysicalMaterial;
    stone: MeshPhysicalMaterial;
    metal: MeshPhysicalMaterial;
    dust: MeshPhysicalMaterial;
}

export interface PlateGeometry {
    body: ReturnType<typeof bodyGeometry>;
    face: PlaneGeometry;
}

export interface WorldContext {
    disposer: Disposer;
    materials: Materials;
    /** 같은 크기의 글자 판이 나눠 쓰는 지오메트리. 세계마다 따로 둔다 — 모듈에 두면
        버린 세계의 지오메트리가 캐시에 남아, 다음 세계가 그것을 집어 쓰고도 자기 정리
        목록에는 올리지 못한다. */
    plateGeometries: Map<string, PlateGeometry>;
    phone: (src: string) => Device;
    window: (src: string) => Device;
    /** 글자 색 — 이 지면의 잉크다. 밝은 테마(침례교)에서는 검정에 가깝다. */
    ink: string;
    /** 판 위에서 한 단계 죽인 글자 색 */
    dim: string;
    accent: Color;
}

/** 한 지면이 들고 오는 장소들. 홈은 늘 살아 있고, 상세는 열려 있는 프로젝트의 것만 산다. */
export interface World {
    /** 재질의 바닥값을 뽑는 색 */
    mood: Mood;
    build(ctx: WorldContext): Zone[];
    /** 장소에 속하지 않고 늘 떠 있는 것(먼지 따위) */
    extras?(ctx: WorldContext): Object3D[];
}

export interface MountOptions {
    host: HTMLElement;
    /** 늘 살아 있는 세계(홈)와 그 구간 이름 */
    home: World & { zones: readonly string[] };
    /** 상세가 쓸 수 있는 구간 이름 전체. 지금 안 열려 있어도 타임라인은 미리 알고 있어야 한다. */
    detailZones: readonly string[];
}

export interface StageHandle {
    dispose(): void;
    /** 구간을 지금 당장 다시 잰다. 새 DOM이 붙은 직후에 부른다. */
    remeasure(): void;
    /** 카메라를 지금 자리에 붙들어 둔다 — 라우트가 갈리는 동안 스크롤을 따르지 않는다. */
    hold(): void;
    /** 붙들어 둔 자리에서 **지금 스크롤이 가리키는 자리로** 날아간다. */
    release(seconds?: number): void;
    /** 열려 있는 프로젝트의 장소를 갈아 끼운다. `null`이면 걷어낸다. */
    setDetail(world: World | null): void;
}

/** WCAG 상대 휘도 — 밝은 지면인지만 가른다. */
function luminance(color: Color) {
    const channel = (value: number) =>
        value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

/**
 * 무대를 세우고 그리기 시작한다.
 *
 * 컨텍스트를 못 얻는 환경(하드웨어 가속 off · 컨텍스트 한도 초과)에서는 `null`을 돌려주고
 * 조용히 물러난다 — 지면색은 CSS가 이미 칠해 두었다. **아무 일도 하지 않는 손잡이를 돌려주면
 * 안 된다**: 부르는 쪽은 그것을 살아 있는 무대로 등록하고, 전환은 있지도 않은 비행이 끝나기를
 * 기다리며 빈 화면을 0.45초씩 붙잡는다.
 */
export function mountStage(options: MountOptions): StageHandle | null {
    const { host, home, detailZones } = options;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let renderer: WebGLRenderer;
    try {
        renderer = new WebGLRenderer({
            antialias: !coarse,
            alpha: false,
            powerPreference: "high-performance",
        });
    } catch {
        return null;
    }

    const paper = new Color(home.mood.paper);
    const accent = new Color(home.mood.espresso);
    const white = new Color(0xffffff);

    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.outputColorSpace = SRGBColorSpace;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    /** 무대 자체(렌더러·환경광·후처리)를 붙잡는 정리 목록. 세계와 수명이 다르다. */
    const rigDisposer = new Disposer();
    const scene = new Scene();
    const camera = new PerspectiveCamera(52, 1, 0.1, 140);
    scene.add(camera);

    /* ── 빛 ─────────────────────────────────────────────────────────────── */

    scene.background = paper;
    scene.fog = new Fog(paper, 18, 72);

    const pmrem = new PMREMGenerator(renderer);
    const environment = rigDisposer.add(pmrem.fromScene(new RoomEnvironment(), 0.04).texture);
    pmrem.dispose();
    scene.environment = environment;

    const hemisphere = new HemisphereLight(0xcfd6ff, 0x120e1a, 0.35);
    scene.add(hemisphere);
    const sun = new DirectionalLight(0xfff4e6, 1.6);
    sun.position.set(6, 10, 8);
    scene.add(sun);
    // 액센트 색의 빛이 카메라를 따라다닌다 — 가까운 물건의 테두리가 그 색으로 물든다.
    const lamp = new PointLight(accent, 60, 40, 2);
    lamp.position.set(2, 1.5, 1);
    camera.add(lamp);

    const skyDark = new Color(0xcfd6ff);
    const skyBright = new Color(0xffffff);
    const groundDark = new Color(0x120e1a);

    /* ── 후처리 ──────────────────────────────────────────────────────────── */

    /* 블룸은 화면과 글자(톤매핑을 건너뛴 밝은 면)만 살짝 번지게 한다. 켜진 화면이 지면에
       빛을 흘리는 것 — 터치 기기에서는 비용이 커서 아예 만들지 않는다. 밝은 지면에서는
       세기를 0으로 내린다(`applyGround`): 프로젝트마다 지면이 다르므로 있고 없고로 못 가른다. */
    const composer = coarse ? null : new EffectComposer(renderer);
    const bloom = composer ? new UnrealBloomPass(new Vector2(1, 1), 0.14, 0.5, 0.93) : null;
    if (composer && bloom) {
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(bloom);
        composer.addPass(new OutputPass());
        rigDisposer.add(bloom);
        rigDisposer.add(composer);
    }

    /**
     * 빛을 지면색에서 유도한다.
     *
     * 침례교 테마는 지면이 밝다(`#edf0f6`). 어두운 방을 전제로 굳혀 둔 값(노출 1.05 ·
     * 반구광 0.35 · 블룸)을 그대로 쓰면 물건이 통째로 날아가고 지면이 하얗게 탄다.
     * 마운트 시점에 한 번 가르지 않고 **매 프레임 지금 지면색에서 뽑는** 이유는, 라우트가
     * 갈릴 때 지면색이 트윈되기 때문이다 — 색이 건너가는 동안 빛도 같이 건너가야 한다.
     */
    const applyGround = () => {
        const bright = smoothstep(0.2, 0.46, luminance(paper));
        renderer.toneMappingExposure = 1.05 + (0.82 - 1.05) * bright;
        scene.environmentIntensity = 0.85 + (1.15 - 0.85) * bright;
        hemisphere.intensity = 0.35 + (1.1 - 0.35) * bright;
        hemisphere.color.copy(skyDark).lerp(skyBright, bright);
        hemisphere.groundColor.copy(groundDark).lerp(paper, bright);
        sun.intensity = 1.6 + (1.1 - 1.6) * bright;
        lamp.intensity = 60 + (26 - 60) * bright;
        if (bloom) {
            bloom.strength = 0.14 * (1 - bright);
        }
    };

    /* ── 재질 ────────────────────────────────────────────────────────────── */

    /**
     * 세계마다 제 재질을 갖는다. 판과 돌의 색은 그 지면의 `surface`·`sand`에서 뽑아야,
     * 밝은 테마에서 검은 글자가 검은 판에 얹히지 않는다.
     */
    function makeMaterials(disposer: Disposer, mood: Mood): Materials {
        return {
            // 기기는 지면이 밝든 어둡든 어둡다 — 실제 기기가 그렇고, 그래야 화면이 켜져 보인다.
            deviceBody: disposer.add(
                new MeshPhysicalMaterial({
                    color: 0x14121a,
                    metalness: 0.75,
                    roughness: 0.32,
                    clearcoat: 1,
                    clearcoatRoughness: 0.18,
                    envMapIntensity: 1.2,
                }),
            ),
            glass: disposer.add(
                new MeshPhysicalMaterial({
                    color: 0xffffff,
                    metalness: 0,
                    roughness: 0.05,
                    transparent: true,
                    opacity: 0.1,
                    envMapIntensity: 1.8,
                    depthWrite: false,
                }),
            ),
            plate: disposer.add(
                new MeshPhysicalMaterial({
                    color: new Color(mood.surface),
                    metalness: 0.45,
                    roughness: 0.4,
                    clearcoat: 0.8,
                    clearcoatRoughness: 0.25,
                }),
            ),
            stone: disposer.add(
                new MeshPhysicalMaterial({
                    color: new Color(mood.sand),
                    metalness: 0.2,
                    roughness: 0.55,
                    clearcoat: 0.5,
                }),
            ),
            metal: disposer.add(
                new MeshPhysicalMaterial({
                    color: accent.clone().lerp(white, 0.3),
                    metalness: 1,
                    roughness: 0.22,
                    envMapIntensity: 1.4,
                }),
            ),
            // 먼지는 빛나면 안 된다 — 별처럼 번지면 시선을 뺏는다. 어둡게, 거칠게.
            dust: disposer.add(
                new MeshPhysicalMaterial({
                    color: new Color(mood.muted),
                    metalness: 0.9,
                    roughness: 0.45,
                    envMapIntensity: 0.6,
                }),
            ),
        };
    }

    function makeContext(disposer: Disposer, mood: Mood): WorldContext {
        const materials = makeMaterials(disposer, mood);
        return {
            disposer,
            materials,
            plateGeometries: new Map(),
            phone: deviceFactory(PHONE, {
                disposer,
                bodyMaterial: materials.deviceBody,
                glassMaterial: materials.glass,
            }),
            window: deviceFactory(WINDOW, {
                disposer,
                bodyMaterial: materials.deviceBody,
                glassMaterial: materials.glass,
            }),
            ink: mood.ink,
            dim: mood.muted,
            accent,
        };
    }

    /** 지어 놓은 세계 하나 — 장소들과, 그것만 따로 버릴 수 있는 정리 목록. */
    interface Built {
        zones: Zone[];
        objects: Object3D[];
        disposer: Disposer;
        materials: Materials;
    }

    function build(world: World): Built {
        const disposer = new Disposer();
        const ctx = makeContext(disposer, world.mood);
        const zones = world.build(ctx);
        const objects: Object3D[] = [];
        for (const zone of zones) {
            zone.group.visible = false;
            scene.add(zone.group);
            objects.push(zone.group);
        }
        for (const extra of world.extras?.(ctx) ?? []) {
            scene.add(extra);
            objects.push(extra);
        }
        return { zones, objects, disposer, materials: ctx.materials };
    }

    function demolish(built: Built) {
        for (const object of built.objects) {
            scene.remove(object);
        }
        built.disposer.dispose();
    }

    const homeBuilt = build(home);
    let detailBuilt: Built | null = null;
    /**
     * 물러나는 세계 — **비행이 끝날 때까지** 버리지 않는다.
     *
     * 라우트가 갈리는 순간 지난 세계를 곧바로 버리면 물건들이 눈앞에서 사라진다. 그 한
     * 프레임이 "화면이 찰나에 꺼졌다"로 읽힌다(사용자 지적). 카메라가 착지한 뒤에 버리면
     * 그때는 이미 등 뒤이거나 안개 너머다.
     *
     * **살아 있는 세계로 세지 않는다.** 물러난 장소는 마지막 자세 그대로 씬에 남아 있을
     * 뿐이고, 카메라 경로에도 갱신 루프에도 끼지 않는다 — 상세끼리 넘어갈 때 두 세계의
     * 구간 이름이 똑같기 때문이다(§4 함정).
     */
    let retiring: Built | null = null;
    /* 갈아 끼워지는 장소를 `Set`으로 들면 버린 세계가 영영 남는다 — 약한 참조로 둔다. */
    const warmed = new WeakSet<Zone>();

    /* 매 프레임 도는 목록이라 새로 만들지 않는다 — 세계가 갈릴 때만 다시 잇는다. */
    let live: Zone[] = homeBuilt.zones;
    const relist = () => {
        live = detailBuilt ? [...homeBuilt.zones, ...detailBuilt.zones] : homeBuilt.zones;
    };
    const keysFor = (aspect: number) => live.flatMap((zone) => zone.keys(aspect));

    /**
     * 상자가 **세로로만** 늘었다 줄 때 세계의 크기를 붙들어 두는 배율.
     *
     * 모바일에서 주소창이 접히면 `fixed inset-0` 상자가 그만큼 세로로 늘어난다. 세로 화각이
     * 그대로면 같은 세계가 더 많은 픽셀에 펴져 8%쯤 확대되고, 주소창이 돌아오면 다시
     * 줄어든다 — 손도 안 댔는데 배경이 숨쉬듯 움직인다. 화각을 늘어난 만큼 되돌리면 늘어난
     * 자리에는 **원래 잘려 있던 세계가 더 보일 뿐**이라 크기도 자리도 그대로다.
     *
     * 조판이 실제로 달라지는 순간(`viewportChanged`)마다 기준을 다시 잡으므로, 창을 끌어
     * 줄이는 평범한 리사이즈에서는 늘 1이다.
     */
    let baseHeight = 0;
    let heightScale = 1;
    const DEG = Math.PI / 180;
    const stretchFov = (fov: number) =>
        heightScale === 1 ? fov : (2 * Math.atan(Math.tan((fov * DEG) / 2) * heightScale)) / DEG;

    const resize = () => {
        /* 크기는 **캔버스가 앉은 상자**(`fixed inset-0`)에서 잰다. `window.innerWidth`는
           고전 스크롤바 폭을 포함하므로, 그 값으로 캔버스를 세우면 상자보다 15px쯤 넓어져
           오른쪽으로 삐져나온다 — 개발자도구 기기 모드처럼 고전 스크롤바가 서는 환경에서
           가로 스크롤이 생기던 원인이다(사용자 지적). 상자를 재면 스크롤바가 있든 없든,
           픽셀비가 얼마든 언제나 정확히 들어맞는다. */
        const width = host.clientWidth || window.innerWidth;
        const height = host.clientHeight || window.innerHeight;
        const ratio = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);
        renderer.setPixelRatio(ratio);
        /* 세 번째 인자를 `false`로 두면 three가 캔버스에 **CSS 크기를 주지 않는다**. 그러면
           캔버스는 제 속성값(`width = 폭 × 픽셀비`)대로 레이아웃되어, 픽셀비가 1이 아닌
           화면에서 그 배율만큼 커진 채 좌상단부터 잘린다 — 지면은 그대로인데 배경만 확대돼
           어긋난다(사용자 지적). 기기 모드는 DPR을 2~3으로 흉내 내므로 상한 1.5가 걸려
           정확히 1.5배가 됐다. */
        renderer.setSize(width, height);
        composer?.setPixelRatio(ratio);
        composer?.setSize(width, height);
        camera.aspect = width / height;
        if (!baseHeight) {
            baseHeight = height;
        }
        heightScale = height / baseHeight;
        camera.updateProjectionMatrix();
    };
    resize();
    applyGround();

    /* ── 스크롤 축 ───────────────────────────────────────────────────────── */

    const timeline = new Timeline([...home.zones, ...detailZones]);
    let measureQueued = 0;
    const measureNow = () => {
        timeline.measure(keysFor(camera.aspect));
    };
    const measure = () => {
        if (measureQueued) {
            return;
        }
        measureQueued = requestAnimationFrame(() => {
            measureQueued = 0;
            measureNow();
        });
    };
    measureNow();

    /* 캔버스 크기는 상자를 따라 늘 맞춘다. 다만 **다시 재는 일**은 조판이 실제로 달라졌을
       때만 한다 — 모바일의 `resize`는 대개 주소창이 여닫힌 것이고, 그때 다시 재면 구간의
       스크롤 폭 기준만 갈려 카메라가 튄다(사용자 지적, `lib/viewport`). */
    const viewportChanged = viewportWatcher();
    const onResize = () => {
        if (viewportChanged()) {
            // 조판이 실제로 달라졌다 — 지금 크기를 새 기준으로 삼고 구간을 다시 잰다.
            baseHeight = 0;
            resize();
            measure();
            return;
        }
        resize();
    };
    window.addEventListener("resize", onResize);
    // 이미지가 늦게 오거나 섹션이 늦게 붙어 문서 높이가 바뀌면 구간 위치도 바뀐다.
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    ScrollTrigger.addEventListener("refresh", measure);

    const unsubscribe = subscribeMood((nextAccent, nextPaper) => {
        paper.setRGB(nextPaper[0] / 255, nextPaper[1] / 255, nextPaper[2] / 255, SRGBColorSpace);
        accent.setRGB(
            nextAccent[0] / 255,
            nextAccent[1] / 255,
            nextAccent[2] / 255,
            SRGBColorSpace,
        );
        lamp.color.copy(accent);
        homeBuilt.materials.metal.color.copy(accent).lerp(white, 0.3);
        detailBuilt?.materials.metal.color.copy(accent).lerp(white, 0.3);
    });

    /* ── 입력 ────────────────────────────────────────────────────────────── */

    let pointerX = 0;
    let pointerY = 0;
    let driftX = 0;
    let driftY = 0;
    const onPointerMove = (event: PointerEvent) => {
        pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced && !coarse) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    /* ── 비행 ────────────────────────────────────────────────────────────── */

    /**
     * 라우트가 갈리는 동안의 **유일한 시간축**.
     *
     * `hold()`가 떠나는 순간의 자세를 굳히고(그동안 카메라는 스크롤을 따르지 않는다),
     * 새 DOM이 붙어 구간을 다시 잰 뒤 `release()`가 비행을 켠다. 목표는 매 프레임
     * **지금 스크롤이 가리키는 자리**라 착지하는 순간 스크롤 축과 정확히 맞물린다 —
     * 넘겨받는 이음매가 따로 없다.
     */
    interface Pose {
        position: Vector3;
        look: Vector3;
        fov: number;
    }

    let held: Pose | null = null;
    let flight: { from: Pose; start: number; duration: number } | null = null;
    const probe = new Vector3();
    const probeLook = new Vector3();

    /* ── 그리기 ──────────────────────────────────────────────────────────── */

    const position = new Vector3();
    const look = new Vector3();
    const right = new Vector3();
    const up = new Vector3();
    const frame: Frame = {
        time: 0,
        lag: 0,
        idle: !reduced,
        narrow: false,
        forward: new Vector3(),
        camera: new Vector3(),
    };

    let lag = 0;
    let fovNow = 52;
    let raf = 0;

    const draw = (now: number) => {
        frame.time = now / 1000;

        /* 동작 줄이기에서는 스크롤 사이의 비행을 걷어내고 구간 한가운데 시점에 선다. */
        const scroll = reduced ? timeline.settle(window.scrollY) : window.scrollY;

        if (!reduced) {
            const velocity = getLenisInstance()?.velocity ?? 0;
            lag += (clamp(velocity / 60, -1, 1) - lag) * 0.08;
            driftX += (pointerX - driftX) * 0.05;
            driftY += (pointerY - driftY) * 0.05;
        }
        frame.lag = lag;

        let fov = timeline.sample(scroll, position, look);

        if (held) {
            // 라우트가 갈리는 중 — 떠나온 자세에 그대로 서 있는다.
            position.copy(held.position);
            look.copy(held.look);
            fov = held.fov;
        } else if (flight) {
            const k = easeInOut(clamp01((frame.time - flight.start) / flight.duration));
            position.lerpVectors(flight.from.position, position, k);
            look.lerpVectors(flight.from.look, look, k);
            fov = flight.from.fov + (fov - flight.from.fov) * k;
            if (k >= 1) {
                flight = null;
                if (retiring) {
                    // 착지했다 — 이제 지난 세계를 버려도 눈에 띄지 않는다.
                    demolish(retiring);
                    retiring = null;
                }
            }
        }
        fovNow = fov;

        camera.position.copy(position);
        camera.lookAt(look);

        // 커서 시차 — 카메라를 제 오른쪽·위 방향으로 조금 옮기고 같은 곳을 본다.
        right.set(1, 0, 0).applyQuaternion(camera.quaternion);
        up.set(0, 1, 0).applyQuaternion(camera.quaternion);
        camera.position.addScaledVector(right, driftX * 0.45).addScaledVector(up, -driftY * 0.3);
        if (frame.idle) {
            camera.position.addScaledVector(up, Math.sin(frame.time * 0.4) * 0.03);
        }
        camera.lookAt(look);
        // 빠르게 굴리면 카메라가 진행 방향으로 살짝 기울고 화각이 벌어진다.
        camera.rotateZ(-lag * 0.035);
        camera.fov = stretchFov(fov + Math.abs(lag) * 5);
        camera.updateProjectionMatrix();
        camera.getWorldDirection(frame.forward);
        frame.camera.copy(camera.position);
        frame.narrow = camera.aspect < 1;

        applyGround();

        /* 넘어가는 중에는 **켜기만 한다.** 라우트가 갈리는 프레임에 지난 세계를 끄면
           물건이 눈앞에서 사라지고, 그 한 프레임이 통째로 "꺼졌다"로 읽힌다. 카메라가
           날아가는 동안 그대로 두면 지나온 것은 등 뒤로 밀리거나 안개에 잠긴다. */
        const crossing = held !== null || flight !== null;
        for (const zone of live) {
            const near = timeline.proximity(zone.name, scroll);
            const inRange = near < DRAW_WITHIN;
            zone.group.visible = inRange || (crossing && zone.group.visible);
            // 범위 밖인 구간은 그리기만 남기고 갱신하지 않는다 — 진행률이 0으로 떨어져
            // 물건이 처음 자세로 튀는 것을 막는다.
            if (!inRange) {
                continue;
            }
            if (near < WARM_WITHIN && !warmed.has(zone)) {
                warmed.add(zone);
                zone.warm();
            }
            zone.update(timeline.localOf(zone.name, scroll), frame);
        }

        if (composer) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }
        raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return {
        dispose() {
            cancelAnimationFrame(raf);
            cancelAnimationFrame(measureQueued);
            unsubscribe();
            observer.disconnect();
            ScrollTrigger.removeEventListener("refresh", measure);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointermove", onPointerMove);
            if (retiring) {
                demolish(retiring);
                retiring = null;
            }
            if (detailBuilt) {
                demolish(detailBuilt);
                detailBuilt = null;
            }
            demolish(homeBuilt);
            rigDisposer.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        },
        remeasure() {
            cancelAnimationFrame(measureQueued);
            measureQueued = 0;
            measureNow();
        },
        hold() {
            held = { position: position.clone(), look: look.clone(), fov: fovNow };
            flight = null;
        },
        release(seconds) {
            if (!held) {
                return;
            }
            let duration = seconds;
            if (duration === undefined) {
                // 지금 스크롤이 가리키는 자리까지의 거리로 시간을 정한다.
                timeline.sample(window.scrollY, probe, probeLook);
                duration = clamp(
                    FLIGHT_MIN + probe.distanceTo(held.position) * FLIGHT_PER_UNIT,
                    FLIGHT_MIN,
                    FLIGHT_MAX,
                );
            }
            flight = {
                from: held,
                start: performance.now() / 1000,
                duration: Math.max(0.01, duration),
            };
            held = null;
        },
        setDetail(world) {
            if (detailBuilt) {
                if (held || flight) {
                    // 비행 중이면 눈앞에서 지우지 않는다. 앞서 물러난 것이 아직 있으면
                    // 그건 이미 볼 일이 없으므로 지금 버린다.
                    if (retiring) {
                        demolish(retiring);
                    }
                    retiring = detailBuilt;
                } else {
                    demolish(detailBuilt);
                }
                detailBuilt = null;
            }
            if (world) {
                detailBuilt = build(world);
                detailBuilt.materials.metal.color.copy(accent).lerp(white, 0.3);
            }
            relist();
            measure();
        },
    };
}
