import {
    Group,
    IcosahedronGeometry,
    InstancedMesh,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Quaternion,
    TorusGeometry,
    Vector3,
} from "three";

import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

import { BEVEL, BODY, bodyGeometry, DISPLAY, MONO, screenTexture, textTexture } from "./mockup";

import type { Color, MeshPhysicalMaterial } from "three";
import type { Device, Disposer, TextLine } from "./mockup";
import type { CameraKey, ZoneName } from "./timeline";

/**
 * 홈을 관통하는 하나의 세계.
 *
 * 다섯 장소가 한 공간 안에 실제 좌표로 놓여 있고, 카메라 하나가 스크롤을 따라 그 사이를
 * 난다. 장소는 페이드로 나타나고 사라지는 것이 아니라 **지나온 자리에 그대로 남는다** —
 * 카메라가 돌아서면 방금 지나온 복도가 뒤에 보인다.
 *
 *   복도(hero)      기기들이 떠 있는 복도를 카메라가 관통한다. 기기는 제 축으로 한 바퀴 돈다
 *   비석(about)     초상이 새겨진 판 둘레를 카메라가 반 바퀴 넘게 돈다 — 뒷면까지 본다
 *   드럼(skills)    이름 판이 안쪽 벽을 두른 원통. 카메라가 그 한가운데서 360° 돈다
 *   계단(experience) 연도 판이 나선으로 감겨 오르고, 카메라가 두 바퀴 돌며 올라간다
 *   갤러리(projects) 프로젝트마다 자리가 있고 화면들이 그 둘레를 돈다. 카메라는 옆으로 걷는다
 */

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
    name: ZoneName;
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

export interface WorldContext {
    disposer: Disposer;
    materials: Materials;
    /** 같은 크기의 글자 판이 나눠 쓰는 지오메트리. 무대 인스턴스마다 따로 둔다 — 모듈에 두면
        언마운트 때 버린 지오메트리가 캐시에 남아, 다시 마운트한 무대가 그것을 집어 쓰고도
        자기 정리 목록에는 올리지 못한다. */
    plateGeometries: Map<string, PlateGeometry>;
    phone: (src: string) => Device;
    window: (src: string) => Device;
    ink: string;
    accent: Color;
}

/* ── 공용 ────────────────────────────────────────────────────────────────── */

const TAU = Math.PI * 2;
const UP = new Vector3(0, 1, 0);

function clamp01(value: number) {
    return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(edge0: number, edge1: number, value: number) {
    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
}

/** 판마다 고정된 흩어짐 — 매번 다르면 리사이즈마다 자리가 튄다. */
function hash(seed: number) {
    const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return value - Math.floor(value);
}

function key(zone: ZoneName, at: number, position: Vector3, look: Vector3, fov: number): CameraKey {
    return {
        zone,
        at,
        position: [position.x, position.y, position.z],
        look: [look.x, look.y, look.z],
        fov,
    };
}

interface Plate {
    group: Group;
    face: MeshBasicMaterial;
}

export interface PlateGeometry {
    body: ReturnType<typeof bodyGeometry>;
    face: PlaneGeometry;
}

/**
 * 글자가 새겨진 얇은 판. 몸체는 빛을 받고, 글자 면은 스스로 빛난다.
 * 같은 크기의 판은 지오메트리를 나눠 쓴다.
 */
function textPlate(ctx: WorldContext, width: number, height: number, lines: TextLine[]): Plate {
    const id = `${width}x${height}`;
    let shared = ctx.plateGeometries.get(id);
    if (!shared) {
        shared = {
            body: ctx.disposer.add(bodyGeometry(width, height, 0.06, Math.min(0.09, height / 4))),
            face: ctx.disposer.add(new PlaneGeometry(width, height)),
        };
        ctx.plateGeometries.set(id, shared);
    }
    const PX = 120;
    const baked = textTexture({ width: width * PX, height: height * PX, lines });
    ctx.disposer.add({ dispose: () => baked.release() });

    const face = ctx.disposer.add(
        new MeshBasicMaterial({
            map: baked.texture,
            transparent: true,
            toneMapped: false,
            depthWrite: false,
        }),
    );
    const group = new Group();
    group.add(new Mesh(shared.body, ctx.materials.plate));
    const faceMesh = new Mesh(shared.face, face);
    faceMesh.position.z = 0.03 + BEVEL + 0.003;
    group.add(faceMesh);
    return { group, face };
}

/** 카메라가 이 물체를 얼마나 정면으로 보고 있는가(0~1). */
const toObject = new Vector3();
function facing(frame: Frame, position: Vector3) {
    toObject.copy(position).sub(frame.camera).normalize();
    return clamp01(toObject.dot(frame.forward));
}

/* ── 1. 복도 ─────────────────────────────────────────────────────────────── */

const HALL_LENGTH = 44;

export function buildHall(ctx: WorldContext): Zone {
    const group = new Group();
    const sources = projects
        .filter((project) => project.icon)
        .flatMap((project) => project.screens.slice(0, 5).map((screen) => screen.src));

    const items = sources.map((src, index) => {
        const device = ctx.phone(src);
        const theta = index * 2.39996;
        const radius = 3.4 + hash(index + 7) * 1.6;
        const home = new Vector3(
            Math.cos(theta) * radius * 1.3,
            Math.sin(theta) * radius * 0.62,
            -2 - (index / sources.length) * HALL_LENGTH,
        );
        device.group.position.copy(home);
        group.add(device.group);
        return {
            device,
            home,
            // 제 축은 조금씩 기울어 있다 — 전부 같은 축으로 돌면 회전목마가 된다.
            axis: new Vector3(hash(index + 3) - 0.5, 1, hash(index + 11) - 0.5).normalize(),
            turns: 1 + (index % 3) * 0.5,
            // 처음엔 대체로 정면 — 스크롤이 시작되면서 돌기 시작한다.
            phase: (hash(index + 5) - 0.5) * 0.8,
        };
    });

    const quaternion = new Quaternion();
    const v = new Vector3();

    return {
        name: "hero",
        group,
        keys: () => [
            key("hero", 0, v.set(0, 0.2, 9), new Vector3(0, 0, -12), 54),
            key("hero", 0.5, v.set(0.9, 0.5, -14), new Vector3(0, 0, -40), 52),
            key("hero", 1, v.set(0, 0.8, -38), new Vector3(6, 1, -62), 50),
        ],
        warm() {
            for (const item of items) {
                item.device.load();
            }
        },
        update(local, frame) {
            for (const item of items) {
                // 구간을 지나는 동안 제 축으로 한 바퀴(혹은 두 바퀴). 스크롤이 곧 회전각이다.
                quaternion.setFromAxisAngle(
                    item.axis,
                    item.phase + local * TAU * item.turns + frame.lag * 0.6,
                );
                item.device.group.quaternion.copy(quaternion);
                // 세로 창에서는 화각이 좁아 가까운 기기가 글을 덮는다 — 한 단계 줄인다.
                item.device.group.scale.setScalar(frame.narrow ? 0.8 : 1.15);
                item.device.group.position.y = frame.idle
                    ? item.home.y + Math.sin(frame.time * 0.6 + item.phase) * 0.05
                    : item.home.y;
            }
        },
    };
}

/* ── 2. 비석 ─────────────────────────────────────────────────────────────── */

const MONOLITH = new Vector3(16, 0, -66);

export function buildMonolith(ctx: WorldContext): Zone {
    const group = new Group();
    group.position.copy(MONOLITH);

    const WIDTH = 2.6;
    const HEIGHT = 3.3;
    const DEPTH = 0.22;
    const slab = new Mesh(
        ctx.disposer.add(bodyGeometry(WIDTH, HEIGHT, DEPTH, 0.12)),
        ctx.materials.stone,
    );
    group.add(slab);

    // 앞면 — 초상
    const inset = 0.08;
    const faceGeometry = ctx.disposer.add(new PlaneGeometry(WIDTH - inset * 2, HEIGHT - inset * 2));
    const portrait = screenTexture({
        kind: "plain",
        width: 504,
        height: Math.round((504 * (HEIGHT - inset * 2)) / (WIDTH - inset * 2)),
        radius: 12,
    });
    ctx.disposer.add(portrait.texture);
    const front = new Mesh(
        faceGeometry,
        ctx.disposer.add(
            // 사진은 톤매핑을 거치고 한 단계 눌러 둔다 — 밝은 배경이 블룸으로 번지면 얼굴이
            // 지워지고, 본문 뒤에서 너무 밝으면 글이 묻힌다.
            new MeshBasicMaterial({ map: portrait.texture, transparent: true, color: 0xb4b0ba }),
        ),
    );
    front.position.z = DEPTH / 2 + BEVEL + 0.003;
    slab.add(front);

    // 뒷면 — 명패. 돌아가서야 읽힌다.
    const card = textTexture({
        width: 504,
        height: 640,
        lines: [
            { text: profile.name, font: `700 76px ${DISPLAY}`, color: ctx.ink, y: 0.3 },
            { text: profile.role, font: `500 30px ${BODY}`, color: "#b9b3c4", y: 0.41 },
            {
                text: profile.location.toUpperCase(),
                font: `500 20px ${MONO}`,
                color: "#8b8598",
                y: 0.58,
                letterSpacing: "4px",
            },
            {
                text: profile.birth,
                font: `500 20px ${MONO}`,
                color: "#8b8598",
                y: 0.64,
                letterSpacing: "4px",
            },
            {
                text: profile.email,
                font: `500 18px ${MONO}`,
                color: "#8b8598",
                y: 0.8,
                letterSpacing: "1px",
            },
        ],
    });
    ctx.disposer.add({ dispose: () => card.release() });
    const back = new Mesh(
        faceGeometry,
        ctx.disposer.add(
            new MeshBasicMaterial({ map: card.texture, transparent: true, toneMapped: false }),
        ),
    );
    back.position.z = -(DEPTH / 2 + BEVEL + 0.003);
    back.rotation.y = Math.PI;
    slab.add(back);

    // 둘레를 도는 낱말들
    const RING = 2.7;
    const words = [profile.role, profile.location, "REACT · REACT NATIVE", profile.birth].map(
        (word, index) => {
            const plate = textPlate(ctx, 1.5, 0.38, [
                { text: word, font: `600 24px ${DISPLAY}`, color: ctx.ink, y: 0.5 },
            ]);
            group.add(plate.group);
            return { plate, phase: (index / 4) * TAU, lift: (index % 2 ? 1 : -1) * 1.15 };
        },
    );

    const keys = (aspect: number) => {
        const list: CameraKey[] = [];
        const position = new Vector3();
        const look = new Vector3();
        const forward = new Vector3();
        const right = new Vector3();
        /* 비석을 화면 한가운데가 아니라 오른쪽에 둔다 — 넓은 창에서는 본문이 왼쪽에 앉기
           때문이다. 세로 창에서는 본문이 가운데라 비켜 잡을 곳이 없으니 정면에 둔다. */
        const aside = aspect > 1 ? -2.4 : 0;
        for (const t of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
            // 왼쪽 앞에서 들어와 정면을 지나 오른쪽 뒤로 — 뒷면의 명패까지 본다.
            const angle = -1.15 + t * 3.65;
            position.set(
                MONOLITH.x + Math.sin(angle) * 8.4,
                MONOLITH.y + 0.5 - t * 0.9 + Math.sin(t * Math.PI) * 0.7,
                MONOLITH.z + Math.cos(angle) * 8.4,
            );
            forward.copy(MONOLITH).sub(position).normalize();
            right.crossVectors(forward, UP).normalize();
            look.copy(MONOLITH).addScaledVector(right, aside);
            look.y += 0.1;
            list.push(key("about", t, position, look, 44 + t * 2));
        }
        return list;
    };

    const world = new Vector3();

    return {
        name: "about",
        group,
        keys,
        warm() {
            portrait.load(profile.avatar);
        },
        update(local, frame) {
            slab.rotation.y = Math.sin(local * Math.PI) * 0.12 + frame.lag * 0.05;
            slab.position.y = frame.idle ? Math.sin(frame.time * 0.5) * 0.04 : 0;
            for (const word of words) {
                const angle = word.phase - local * Math.PI * 1.4 + frame.lag * 0.35;
                word.plate.group.position.set(
                    Math.sin(angle) * RING,
                    word.lift + (frame.idle ? Math.sin(frame.time * 0.7 + word.phase) * 0.06 : 0),
                    Math.cos(angle) * RING,
                );
                word.plate.group.rotation.y = angle;
                word.plate.group.getWorldPosition(world);
                word.plate.face.opacity = 0.35 + 0.65 * facing(frame, world);
            }
        },
    };
}

/* ── 3. 드럼 ─────────────────────────────────────────────────────────────── */

const DRUM = new Vector3(44, -3, -100);
const DRUM_RADIUS = 10;
/** 들어오는 방향. 문은 이 각과 그 반대편에 낸다. */
const DRUM_HEADING = Math.atan2(DRUM.x - MONOLITH.x, DRUM.z - MONOLITH.z);

export function buildDrum(ctx: WorldContext): Zone {
    const group = new Group();
    group.position.copy(DRUM);

    const names = skillGroups.flatMap((skillGroup) => skillGroup.items);
    const ROWS = [2.7, 0, -2.7];
    const DOOR = 0.42;
    const perRow = Math.ceil(names.length / ROWS.length);

    const tiles = names.map((name, index) => {
        const row = Math.floor(index / perRow);
        const column = index % perRow;
        const count = Math.min(perRow, names.length - row * perRow);
        /* 벽을 두 호로 나눈다 — 문 두 개를 비워 두고, 나머지 각을 줄마다 어긋나게 채운다.
           카메라는 앞문으로 들어와 한 바퀴 돌고 뒷문으로 나간다. */
        const half = Math.floor(count / 2);
        const onFirst = column < half;
        const slot = onFirst ? column : column - half;
        const slots = onFirst ? half : count - half;
        const arc = Math.PI - DOOR * 2;
        const base = onFirst ? DRUM_HEADING + Math.PI + DOOR : DRUM_HEADING + DOOR;
        const angle = base + ((slot + 0.5 + row * 0.33) / slots) * arc;

        const plate = textPlate(ctx, 2.6, 0.78, [
            { text: name, font: `600 46px ${DISPLAY}`, color: ctx.ink, y: 0.5 },
        ]);
        const home = new Vector3(
            Math.sin(angle) * DRUM_RADIUS,
            ROWS[row] ?? 0,
            Math.cos(angle) * DRUM_RADIUS,
        );
        plate.group.position.copy(home);
        plate.group.lookAt(0, home.y, 0);
        group.add(plate.group);
        return { plate, home, inward: new Vector3(-home.x, 0, -home.z).normalize() };
    });

    const keys: CameraKey[] = [];
    const position = new Vector3();
    const look = new Vector3();
    for (let index = 0; index <= 8; index += 1) {
        const t = index / 8;
        const heading = DRUM_HEADING + t * TAU;
        position.set(DRUM.x, DRUM.y + Math.sin(t * TAU) * 0.3, DRUM.z);
        look.set(
            DRUM.x + Math.sin(heading) * 10,
            DRUM.y + Math.sin(t * TAU * 2) * 0.5,
            DRUM.z + Math.cos(heading) * 10,
        );
        keys.push(key("skills", t, position, look, 58));
    }

    const world = new Vector3();

    return {
        name: "skills",
        group,
        keys: () => keys,
        warm() {},
        update(_local, frame) {
            // 빠르게 굴리면 드럼이 한 박자 더 돈다.
            group.rotation.y = frame.lag * 0.08;
            for (const tile of tiles) {
                tile.plate.group.getWorldPosition(world);
                const hit = smoothstep(0.55, 0.985, facing(frame, world));
                tile.plate.face.opacity = 0.22 + 0.68 * hit;
                // 시선이 닿은 판은 벽에서 한 뼘 앞으로 나온다.
                tile.plate.group.position.copy(tile.home).addScaledVector(tile.inward, hit * 0.7);
                tile.plate.group.scale.setScalar(1 + hit * 0.14);
            }
        },
    };
}

/* ── 4. 계단 ─────────────────────────────────────────────────────────────── */

const STAIR = new Vector3(76, 0, -140);
const STAIR_HEADING = Math.atan2(STAIR.x - DRUM.x, STAIR.z - DRUM.z);
const STAIR_RISE = 14;
const STAIR_TURNS = 2;

export function buildStair(ctx: WorldContext): Zone {
    const group = new Group();
    group.position.copy(STAIR);

    const RADIUS = 6.5;
    const count = experiences.length;
    const step = (index: number) => ({
        angle: STAIR_HEADING + (index / (count - 1)) * TAU * STAIR_TURNS,
        y: -STAIR_RISE / 2 + (index / (count - 1)) * STAIR_RISE,
    });

    const ringGeometry = ctx.disposer.add(new TorusGeometry(2.1, 0.04, 12, 96));
    const smallRing = ctx.disposer.add(new TorusGeometry(1, 0.028, 10, 72));

    const plates = experiences.map((item, index) => {
        const { angle, y } = step(index);
        const pivot = new Group();
        pivot.position.set(Math.sin(angle) * RADIUS, y, Math.cos(angle) * RADIUS);
        pivot.lookAt(0, y, 0);
        group.add(pivot);

        const plate = textPlate(ctx, 2.8, 1, [
            { text: item.period.slice(0, 4), font: `700 66px ${DISPLAY}`, color: ctx.ink, y: 0.42 },
            { text: item.company, font: `500 20px ${BODY}`, color: "#b9b3c4", y: 0.8 },
        ]);
        pivot.add(plate.group);

        const ring = new Mesh(ringGeometry, ctx.materials.metal);
        pivot.add(ring);
        return { pivot, plate, ring, phase: hash(index) * TAU };
    });

    // 판 사이사이의 작은 링 — 나선이 이어져 있다는 것을 보여 준다.
    const fillers: Mesh[] = [];
    for (let index = 0; index < (count - 1) * 3; index += 1) {
        const t = (index + 1) / ((count - 1) * 3 + 1);
        const angle = STAIR_HEADING + t * TAU * STAIR_TURNS;
        const y = -STAIR_RISE / 2 + t * STAIR_RISE;
        const ring = new Mesh(smallRing, ctx.materials.metal);
        ring.position.set(Math.sin(angle) * RADIUS, y, Math.cos(angle) * RADIUS);
        ring.lookAt(0, y, 0);
        group.add(ring);
        fillers.push(ring);
    }

    const keys: CameraKey[] = [];
    const position = new Vector3();
    const look = new Vector3();
    for (let index = 0; index <= 8; index += 1) {
        const t = index / 8;
        const heading = STAIR_HEADING + t * TAU * STAIR_TURNS;
        const y = -STAIR_RISE / 2 - 0.4 + t * (STAIR_RISE + 0.4);
        position.set(STAIR.x, STAIR.y + y, STAIR.z);
        look.set(
            STAIR.x + Math.sin(heading) * 8,
            STAIR.y + y + 0.4,
            STAIR.z + Math.cos(heading) * 8,
        );
        keys.push(key("experience", t, position, look, 50));
    }
    // 마지막 항목이 화면 가운데 온 뒤 구간이 끝날 때까지 꼭대기에 머문다. 바로 떠나면
    // 카메라가 마지막 연도 판을 뚫고 나가는 게 읽는 도중에 보인다.
    keys.push(key("experience", 2, position, look, 50));

    const world = new Vector3();

    return {
        name: "experience",
        group,
        keys: () => keys,
        warm() {},
        update(_local, frame) {
            for (const item of plates) {
                item.ring.rotation.z = frame.time * 0.12 + frame.lag * 0.8 + item.phase;
                item.pivot.getWorldPosition(world);
                item.plate.face.opacity = 0.3 + 0.7 * smoothstep(0.6, 0.99, facing(frame, world));
            }
            for (const [index, ring] of fillers.entries()) {
                ring.rotation.z = -frame.time * 0.2 - frame.lag * 1.2 + index;
            }
        },
    };
}

/* ── 5. 갤러리 ───────────────────────────────────────────────────────────── */

const GALLERY = new Vector3(110, 0, -180);
const GALLERY_GAP = 8;

/** 갤러리 DOM 레일과 같은 곡선 — 카드는 가운데 머물고 전환만 짧다. */
function dwell(f: number) {
    return f * f * f * (f * (f * 6 - 15) + 10);
}

export function buildGallery(ctx: WorldContext): Zone {
    const group = new Group();
    group.position.copy(GALLERY);

    const haloGeometry = ctx.disposer.add(new TorusGeometry(3.4, 0.028, 8, 128));

    const stations = projects.map((project, index) => {
        const center = new Vector3(index * GALLERY_GAP, -0.2, 0);
        const scale = project.platform === "mobile" ? 0.95 : 0.8;
        const satellites = project.screens.slice(0, 3).map((screen, k) => {
            const device = (project.platform === "mobile" ? ctx.phone : ctx.window)(screen.src);
            device.group.scale.setScalar(scale);
            group.add(device.group);
            return { device, phase: (k / 3) * TAU };
        });

        /* 프로젝트의 색은 여기서만 터진다 — 자리마다 그 프로젝트 색의 고리가 떠 있고,
           블룸이 그 빛을 지면에 번지게 한다. */
        const haloMaterial = ctx.disposer.add(
            new MeshBasicMaterial({
                color: project.theme.espresso,
                toneMapped: false,
                transparent: true,
            }),
        );
        const halo = new Mesh(haloGeometry, haloMaterial);
        halo.position.copy(center);
        halo.position.z -= 1.2;
        group.add(halo);

        return { center, satellites, halo, haloMaterial, scale };
    });

    const FOV = 46;
    const DISTANCE = 10;
    const position = new Vector3();
    const look = new Vector3();
    const last = projects.length - 1;
    /* DOM 카드는 왼쪽에 썸네일, 오른쪽에 본문이라 한가운데는 썸네일 가장자리다. 자리를
       정면에 두면 고리가 썸네일 뒤에 깔리고, 여백까지 밀면 화면 밖으로 나간다(사용자 지적).
       본문 기둥 뒤에 오도록 카메라를 조금만 왼쪽으로 비켜 세운다 — 얼마나 비킬지는 그
       거리에서 보이는 반폭의 비율이라 창 비율마다 다시 잰다. */
    const keysFor = (aspect: number) => {
        const halfWidth = Math.tan((FOV / 2) * (Math.PI / 180)) * DISTANCE * aspect;
        const aside = halfWidth * 0.25;
        const keys: CameraKey[] = [];
        for (let index = 0; index <= last; index += 1) {
            for (const f of index < last ? [0, 0.25, 0.5, 0.75] : [0]) {
                const x = GALLERY.x + (index + dwell(f)) * GALLERY_GAP - aside;
                position.set(x, GALLERY.y + 0.4, GALLERY.z + DISTANCE);
                look.set(x, GALLERY.y - 0.1, GALLERY.z - 2);
                keys.push(
                    key("projects", last === 0 ? 0 : (index + f) / last, position, look, FOV),
                );
            }
        }
        return keys;
    };

    return {
        name: "projects",
        group,
        keys: keysFor,
        warm() {
            for (const station of stations) {
                for (const satellite of station.satellites) {
                    satellite.device.load();
                }
            }
        },
        update(local, frame) {
            const t = local * last;
            for (const [index, station] of stations.entries()) {
                // 카드 하나를 지나는 동안 화면들이 정확히 한 바퀴 돈다 — 스크롤이 곧 회전각이다.
                const swing = (t - index) * TAU + frame.lag * 0.5;
                const near = 1 - clamp01(Math.abs(t - index) / 1.5);
                /* 자리 사이가 화면 폭보다 좁아, 그대로 두면 다음 자리에 서도 지나온 고리가
                   썸네일 뒤로 비친다(사용자 지적). 지나온 자리와 다음 자리는 카메라가 그
                   앞에 서기 전에 접는다 — 이 장소만은 "지나온 자리가 남는다"의 예외다. */
                const presence = 1 - smoothstep(0.3, 0.9, Math.abs(t - index));
                const shown = presence > 0.001;
                station.halo.visible = shown;
                station.haloMaterial.opacity = presence;
                for (const satellite of station.satellites) {
                    const angle = swing + satellite.phase;
                    const orbit = satellite.device.group;
                    orbit.visible = shown;
                    orbit.scale.setScalar(station.scale * presence);
                    orbit.position.set(
                        station.center.x + Math.cos(angle) * 3.1,
                        station.center.y +
                            Math.sin(angle) * 0.9 +
                            (frame.idle ? Math.sin(frame.time * 0.8 + angle) * 0.05 : 0),
                        station.center.z + Math.sin(angle) * 1.7 - 1,
                    );
                    orbit.rotation.set(Math.cos(angle) * 0.14, Math.sin(angle) * 0.55, 0);
                }
                station.halo.rotation.set(
                    Math.PI * 0.5 + Math.sin(swing * 0.5) * 0.35,
                    frame.time * 0.1 + swing * 0.25,
                    0,
                );
                station.halo.scale.setScalar(0.85 + near * 0.25);
            }
        },
    };
}

/* ── 먼지 — 장소 사이를 채우는 것 ────────────────────────────────────────── */

const ANCHORS = [
    new Vector3(0, 0, 4),
    new Vector3(0, 0, -HALL_LENGTH),
    MONOLITH,
    DRUM,
    STAIR,
    GALLERY,
    new Vector3(GALLERY.x + (projects.length - 1) * GALLERY_GAP, 0, GALLERY.z),
];

/**
 * 장소와 장소 사이의 비행에서 화면이 비지 않게, 경로를 따라 작은 금속 조각을 흩뿌린다.
 * 카메라가 지나는 통로 안쪽은 비워 두어 얼굴에 부딪히지 않는다. 움직이지 않는다 — 카메라가
 * 움직이면 시차가 곧 움직임이다.
 */
export function buildDust(ctx: WorldContext, count = 800) {
    const geometry = ctx.disposer.add(new IcosahedronGeometry(0.07, 0));
    const mesh = new InstancedMesh(geometry, ctx.materials.dust, count);
    const lengths = ANCHORS.slice(1).map((anchor, index) => anchor.distanceTo(ANCHORS[index]));
    const total = lengths.reduce((sum, length) => sum + length, 0);
    const matrix = new Matrix4();
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    const axis = new Vector3();
    const along = new Vector3();
    const side = new Vector3();
    const lift = new Vector3();

    for (let index = 0; index < count; index += 1) {
        let distance = hash(index * 3 + 1) * total;
        let segment = 0;
        while (segment < lengths.length - 1 && distance > lengths[segment]) {
            distance -= lengths[segment];
            segment += 1;
        }
        along
            .copy(ANCHORS[segment + 1])
            .sub(ANCHORS[segment])
            .normalize();
        side.crossVectors(along, UP).normalize();
        lift.crossVectors(side, along).normalize();
        const angle = hash(index * 3 + 2) * TAU;
        const radius = 6.5 + hash(index * 3 + 3) * 13;
        position
            .copy(ANCHORS[segment])
            .addScaledVector(along, distance)
            .addScaledVector(side, Math.cos(angle) * radius)
            .addScaledVector(lift, Math.sin(angle) * radius * 0.7);
        axis.set(
            hash(index + 11) - 0.5,
            hash(index + 17) - 0.5,
            hash(index + 23) - 0.5,
        ).normalize();
        quaternion.setFromAxisAngle(axis, hash(index + 29) * TAU);
        scale.setScalar(0.4 + hash(index + 31) * 0.9);
        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(index, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    return mesh;
}
