import { useEffect, useRef } from "react";

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

import { BASE_MOOD, subscribeMood } from "@/lib/atmosphere";
import { ScrollTrigger } from "@/lib/gsap";
import { getLenisInstance } from "@/lib/lenis";

import { Disposer, deviceFactory, PHONE, WINDOW } from "./stage/mockup";
import { Timeline } from "./stage/timeline";
import {
    buildDrum,
    buildDust,
    buildGallery,
    buildHall,
    buildMonolith,
    buildStair,
} from "./stage/world";

import type { Frame, Materials, WorldContext, Zone } from "./stage/world";

/**
 * 홈을 받치는 3D 무대.
 *
 * 원칙은 셋이다.
 *
 * 1. **스크롤이 유일한 시간축이다.** 카메라 자리·시선·화각, 물건의 회전각이 전부 지금 스크롤
 *    위치의 순수 함수다(`stage/timeline`). 1px 굴리면 1px만큼 움직이고 손을 떼면 선다.
 *    스크롤 속도는 양념으로만 쓴다 — 빠르게 굴릴 때 화각이 살짝 벌어지고 물건이 한 박자 늦게
 *    따라붙는다.
 * 2. **장면이 아니라 장소다.** 다섯 구간은 한 공간 안의 다섯 좌표고(`stage/world`), 카메라
 *    하나가 그 사이를 난다. 구간 사이의 스크롤(다리·섹션 제목)이 곧 비행 시간이다.
 *    지나온 장소는 페이드로 지우지 않고 뒤에 그대로 둔다.
 * 3. **물건은 두께와 재질을 가진다**(`stage/mockup`). 압출한 몸체 · 스스로 빛나는 화면 ·
 *    환경광을 받는 유리. 종이가 아니라 기기라서 어느 각도로 돌아도 입체로 읽힌다.
 */

/** 구간이 이만큼(화면 높이) 안으로 오면 그린다. 그보다 멀면 안개 너머라 어차피 안 보인다. */
const DRAW_WITHIN = 3.2;
/** 이만큼 가까워지면 이미지를 받기 시작한다. */
const WARM_WITHIN = 1.8;

function clamp(value: number, min: number, max: number) {
    return value < min ? min : value > max ? max : value;
}

export default function Stage() {
    const hostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) {
            return;
        }

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const coarse = window.matchMedia("(pointer: coarse)").matches;

        /* 컨텍스트를 못 얻는 환경이 실제로 있다 — 하드웨어 가속을 끈 브라우저, GPU 컨텍스트
           한도를 넘긴 탭. 생성자가 던지면 이펙트째로 홈이 깨지므로, 조용히 물러나고 지면색만
           남긴다(어차피 CSS가 이미 칠해 두었다). */
        let renderer: WebGLRenderer;
        try {
            renderer = new WebGLRenderer({
                antialias: !coarse,
                alpha: false,
                powerPreference: "high-performance",
            });
        } catch {
            return;
        }
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.outputColorSpace = SRGBColorSpace;
        host.appendChild(renderer.domElement);
        renderer.domElement.style.display = "block";

        const disposer = new Disposer();
        const scene = new Scene();
        const camera = new PerspectiveCamera(52, 1, 0.1, 140);
        scene.add(camera);

        /* ── 빛 ─────────────────────────────────────────────────────────── */

        const paper = new Color(BASE_MOOD.paper);
        const accent = new Color(BASE_MOOD.espresso);
        scene.background = paper;
        scene.fog = new Fog(paper, 18, 72);

        const pmrem = new PMREMGenerator(renderer);
        const environment = disposer.add(pmrem.fromScene(new RoomEnvironment(), 0.04).texture);
        pmrem.dispose();
        scene.environment = environment;
        scene.environmentIntensity = 0.85;

        scene.add(new HemisphereLight(0xcfd6ff, 0x120e1a, 0.35));
        const sun = new DirectionalLight(0xfff4e6, 1.6);
        sun.position.set(6, 10, 8);
        scene.add(sun);
        // 액센트 색의 빛이 카메라를 따라다닌다 — 가까운 물건의 테두리가 구간 색으로 물든다.
        const lamp = new PointLight(accent, 60, 40, 2);
        lamp.position.set(2, 1.5, 1);
        camera.add(lamp);

        /* ── 재질 ────────────────────────────────────────────────────────── */

        const materials: Materials = {
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
                    color: 0x1b1824,
                    metalness: 0.45,
                    roughness: 0.4,
                    clearcoat: 0.8,
                    clearcoatRoughness: 0.25,
                }),
            ),
            stone: disposer.add(
                new MeshPhysicalMaterial({
                    color: 0x1d1a24,
                    metalness: 0.2,
                    roughness: 0.55,
                    clearcoat: 0.5,
                }),
            ),
            metal: disposer.add(
                new MeshPhysicalMaterial({
                    color: 0xd8d0c0,
                    metalness: 1,
                    roughness: 0.22,
                    envMapIntensity: 1.4,
                }),
            ),
            // 먼지는 빛나면 안 된다 — 별처럼 번지면 시선을 뺏는다. 어둡게, 거칠게.
            dust: disposer.add(
                new MeshPhysicalMaterial({
                    color: 0x6f6a7a,
                    metalness: 0.9,
                    roughness: 0.45,
                    envMapIntensity: 0.6,
                }),
            ),
        };

        const context: WorldContext = {
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
            ink: BASE_MOOD.ink,
            accent,
        };

        const zones: Zone[] = [
            buildHall(context),
            buildMonolith(context),
            buildDrum(context),
            buildStair(context),
            buildGallery(context),
        ];
        for (const zone of zones) {
            zone.group.visible = false;
            scene.add(zone.group);
        }
        scene.add(buildDust(context));
        const keysFor = (aspect: number) => zones.flatMap((zone) => zone.keys(aspect));
        const warmed = new Set<Zone>();

        /* ── 후처리 ──────────────────────────────────────────────────────── */

        /* 블룸은 화면과 글자(톤매핑을 건너뛴 밝은 면)만 살짝 번지게 한다. 켜진 화면이 지면에
           빛을 흘리는 것 — 터치 기기에서는 비용이 커서 건너뛴다. */
        const composer = coarse ? null : new EffectComposer(renderer);
        const bloom = composer ? new UnrealBloomPass(new Vector2(1, 1), 0.14, 0.5, 0.93) : null;
        if (composer && bloom) {
            composer.addPass(new RenderPass(scene, camera));
            composer.addPass(bloom);
            composer.addPass(new OutputPass());
            disposer.add(bloom);
            disposer.add(composer);
        }

        const resize = () => {
            const ratio = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);
            renderer.setPixelRatio(ratio);
            renderer.setSize(window.innerWidth, window.innerHeight, false);
            composer?.setPixelRatio(ratio);
            composer?.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
        resize();

        /* ── 스크롤 축 ───────────────────────────────────────────────────── */

        const timeline = new Timeline();
        let measureQueued = 0;
        const measure = () => {
            if (measureQueued) {
                return;
            }
            measureQueued = requestAnimationFrame(() => {
                measureQueued = 0;
                timeline.measure(keysFor(camera.aspect));
            });
        };
        timeline.measure(keysFor(camera.aspect));

        const onResize = () => {
            resize();
            measure();
        };
        window.addEventListener("resize", onResize);
        // 이미지가 늦게 오거나 섹션이 늦게 붙어 문서 높이가 바뀌면 구간 위치도 바뀐다.
        const observer = new ResizeObserver(measure);
        observer.observe(document.body);
        ScrollTrigger.addEventListener("refresh", measure);

        const unsubscribe = subscribeMood((nextAccent, nextPaper) => {
            paper.setRGB(
                nextPaper[0] / 255,
                nextPaper[1] / 255,
                nextPaper[2] / 255,
                SRGBColorSpace,
            );
            accent.setRGB(
                nextAccent[0] / 255,
                nextAccent[1] / 255,
                nextAccent[2] / 255,
                SRGBColorSpace,
            );
            lamp.color.copy(accent);
            materials.metal.color.copy(accent).lerp(new Color(0xffffff), 0.3);
        });

        /* ── 입력 ────────────────────────────────────────────────────────── */

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

        /* ── 그리기 ──────────────────────────────────────────────────────── */

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

            const fov = timeline.sample(scroll, position, look);
            camera.position.copy(position);
            camera.lookAt(look);

            // 커서 시차 — 카메라를 제 오른쪽·위 방향으로 조금 옮기고 같은 곳을 본다.
            right.set(1, 0, 0).applyQuaternion(camera.quaternion);
            up.set(0, 1, 0).applyQuaternion(camera.quaternion);
            camera.position
                .addScaledVector(right, driftX * 0.45)
                .addScaledVector(up, -driftY * 0.3);
            if (frame.idle) {
                camera.position.addScaledVector(up, Math.sin(frame.time * 0.4) * 0.03);
            }
            camera.lookAt(look);
            // 빠르게 굴리면 카메라가 진행 방향으로 살짝 기울고 화각이 벌어진다.
            camera.rotateZ(-lag * 0.035);
            camera.fov = fov + Math.abs(lag) * 5;
            camera.updateProjectionMatrix();
            camera.getWorldDirection(frame.forward);
            frame.camera.copy(camera.position);
            frame.narrow = camera.aspect < 1;

            for (const zone of zones) {
                const near = timeline.proximity(zone.name, scroll);
                const visible = near < DRAW_WITHIN;
                zone.group.visible = visible;
                if (!visible) {
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

        return () => {
            cancelAnimationFrame(raf);
            cancelAnimationFrame(measureQueued);
            unsubscribe();
            observer.disconnect();
            ScrollTrigger.removeEventListener("refresh", measure);
            window.removeEventListener("resize", onResize);
            window.removeEventListener("pointermove", onPointerMove);
            disposer.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return (
        <div ref={hostRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-paper" />
    );
}
