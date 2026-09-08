import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, TorusGeometry, Vector3 } from "three";

import { BEVEL, bodyGeometry, DISPLAY, MONO, screenTexture } from "@/components/stage/mockup";
import {
    cameraKey,
    clamp01,
    facing,
    hash,
    smoothstep,
    TAU,
    textPlate,
    UP,
} from "@/components/stage/pieces";

import type { WorldContext, Zone } from "@/components/stage/rig";
import type { CameraKey } from "@/components/stage/timeline";
import type { Project } from "@/types/content";

/**
 * 프로젝트 상세를 관통하는 하나의 세계.
 *
 * 홈과 **같은 문법**이다 — 다섯 장소가 한 공간에 실제 좌표로 놓여 있고, 카메라 하나가
 * 스크롤을 따라 그 사이를 난다. 다른 것은 순서와 소재뿐이다.
 *
 *   좌대(cover)    앱 아이콘이 고리 안에 서 있다. 카메라가 정면에서 천천히 다가간다
 *   벽(brief)      스택 이름 판이 멀리 벽을 이룬다. 읽는 구간이라 카메라는 옆으로만 흐른다
 *   회랑(screens)  화면들이 좌우로 늘어선 복도를 카메라가 관통한다 — 판마다 본문의 닻이 있다
 *   아치(system)   네모난 틀이 줄지어 선 통로. 구조를 눌러 보는 동안 카메라는 천천히 통과한다
 *   오름(cases)    사례 번호 판이 나선으로 감겨 오르고, 카메라가 닻을 따라 올라간다
 *   바깥(outro)    아무것도 없는 자리. 마지막 사례를 읽고 나면 카메라가 오름을 떠난다
 *
 * 홈이 "무채의 전시장"이라면 여기는 **그 프로젝트의 색이 터지는 방**이다. 고리와 금속은
 * 전부 프로젝트 액센트를 쓴다.
 */

/** 상세가 쓰는 구간 이름 — DOM의 `data-stage-zone`과 같아야 한다. */
export const DETAIL_ZONES = ["cover", "brief", "screens", "system", "cases", "outro"] as const;
export type DetailZone = (typeof DETAIL_ZONES)[number];

/**
 * 장소의 자리 — **원점에서의 상대 좌표**다.
 *
 * 상세 세계는 제 원점을 갖지 않는다. 홈 갤러리에서 그 프로젝트가 서 있던 자리에 통째로
 * 겹쳐 놓아(`buildDetailWorld`의 `origin`), 목록에서 눌러 들어온 카메라가 **원래 서 있던
 * 자리에서** 좌대 앞으로 몇 걸음 날아가게 한다. 두 세계는 같은 좌표계에 겹쳐 있지만
 * 동시에 보이지 않는다 — `data-stage-zone`이 DOM에 없는 구간은 통째로 꺼진다.
 */
/**
 * 좌대를 갤러리 자리보다 이만큼 **더 깊은 곳**에 세운다.
 *
 * 처음에는 두 자리를 정확히 겹쳐 놓았다. 그랬더니 목록에서 눌러 들어갈 때 카메라가 날아갈
 * 거리가 5뿐이라, 이동이 아니라 **화면이 한 번 바뀐 것**으로 읽혔다(사용자 지적).
 * 갤러리에서 보던 축을 그대로 따라 더 안쪽에 두면, 들어가는 일이 곧 **보고 있던 고리를
 * 통과해 그 안으로 들어가는 것**이 된다 — 20 남짓의 전진이고, 도착하면 고리는 등 뒤에 남는다.
 */
export const ENTRY_DEPTH = 24;

/** 갤러리의 그 자리에서 상세 세계의 원점을 뽑는다. */
export function detailOrigin(station: Vector3) {
    return new Vector3(station.x, station.y, station.z - ENTRY_DEPTH);
}

const AT_COVER = new Vector3(0, 0, 0);
const AT_BRIEF = new Vector3(22, -1, -34);
const AT_HALL = new Vector3(50, 0, -72);
const AT_SYSTEM = new Vector3(92, -1, -132);
const AT_CASES = new Vector3(118, 1, -172);
/** 오름을 벗어난 빈 공간. 마지막 장소가 아니라 **나가는 자리**다(§4 함정). */
const AT_OUTRO = new Vector3(136, 18, -200);

const key = cameraKey;

/** 두 자리를 잇는 방향과 그 오른쪽. 회랑·아치가 이 축 위에 놓인다. */
function axis(from: Vector3, to: Vector3) {
    const forward = new Vector3().subVectors(to, from).normalize();
    const side = new Vector3().crossVectors(forward, UP).normalize();
    return { forward, side };
}

/* ── 1. 좌대 ─────────────────────────────────────────────────────────────── */

/** 아이콘 판의 한 변(월드 단위) */
const BADGE = 1.9;

/**
 * 앱 아이콘을 물건으로 세운 좌대.
 *
 * 홈의 갤러리에서 이 프로젝트 자리에 떠 있던 고리를 그대로 가져온다 — 목록에서 눌러 들어온
 * 방문자가 같은 물건 앞에 서는 셈이다. 제목은 3D에 적지 않는다. 본문에 이미 크게 있고,
 * 같은 낱말이 앞뒤로 두 번 보이면 어수선하다.
 */
function buildPlinth(ctx: WorldContext, project: Project, o: Vector3): Zone {
    const COVER = AT_COVER.clone().add(o);
    const group = new Group();
    group.position.copy(COVER);

    const accent = project.theme.espresso;

    // 아이콘 — 둥근 사각을 압출한 몸체 위에 이미지를 얹는다. 실제 앱 아이콘의 실루엣이다.
    const badge = new Mesh(
        ctx.disposer.add(bodyGeometry(BADGE, BADGE, 0.2, BADGE * 0.22)),
        ctx.materials.plate,
    );
    group.add(badge);

    const art = screenTexture({ kind: "plain", width: 384, height: 384, radius: 84 });
    ctx.disposer.add(art.texture);
    const badgeFace = new Mesh(
        ctx.disposer.add(new PlaneGeometry(BADGE * 0.92, BADGE * 0.92)),
        ctx.disposer.add(new MeshBasicMaterial({ map: art.texture, transparent: true })),
    );
    badgeFace.position.z = 0.1 + BEVEL + 0.004;
    badge.add(badgeFace);

    // 첫 화면 한 대 — 아이콘 뒤 오른쪽에 비스듬히 선다.
    const device = (project.platform === "mobile" ? ctx.phone : ctx.window)(
        project.screens[0]?.src ?? project.thumbnail,
    );
    device.group.scale.setScalar(project.platform === "mobile" ? 0.9 : 0.72);
    device.group.position.set(2.5, -0.2, -1.6);
    device.group.rotation.set(0.04, -0.42, 0.03);
    group.add(device.group);

    // 고리 — 홈 갤러리의 그 고리다. 프로젝트 색이 터지는 유일한 자리.
    const halo = new Mesh(
        ctx.disposer.add(new TorusGeometry(3.3, 0.03, 8, 128)),
        ctx.disposer.add(new MeshBasicMaterial({ color: accent, toneMapped: false })),
    );
    halo.position.z = -1.6;
    group.add(halo);

    const orbits = [0, 1, 2].map((index) => {
        const ring = new Mesh(
            ctx.disposer.add(new TorusGeometry(1.5 + index * 0.55, 0.018, 6, 96)),
            ctx.materials.metal,
        );
        ring.position.z = -0.6 - index * 0.5;
        group.add(ring);
        return { ring, phase: hash(index + 3) * TAU, speed: 0.06 + index * 0.03 };
    });

    const position = new Vector3();
    const look = new Vector3();
    const forward = new Vector3();
    const right = new Vector3();

    /* 넓은 창에서는 본문(제목·요약·메타)이 왼쪽 기둥에 앉으므로 좌대를 오른쪽에 둔다.
       세로 창에서는 본문이 가운데라 비켜 잡을 곳이 없으니 정면에 두고 조금 물러선다. */
    const keys = (aspect: number) => {
        const wide = aspect > 1;
        const aside = wide ? -2.5 : 0;
        const list: CameraKey[] = [];
        for (const [t, distance, height] of [
            [0, wide ? 15 : 19, 2.2],
            [0.5, wide ? 10.5 : 14, 1.1],
            [1, wide ? 7.4 : 10.5, 0.2],
        ] as const) {
            position.set(COVER.x - t * 1.6, COVER.y + height, COVER.z + distance);
            forward.copy(COVER).sub(position).normalize();
            right.crossVectors(forward, UP).normalize();
            look.copy(COVER).addScaledVector(right, aside);
            look.y += 0.15;
            list.push(key("cover", t, position, look, 48 - t * 4));
        }
        return list;
    };

    return {
        name: "cover",
        group,
        keys,
        warm() {
            device.load();
            if (project.icon) {
                art.load(project.icon);
            } else {
                art.load(project.thumbnail);
            }
        },
        update(local, frame) {
            badge.rotation.y = Math.sin(local * Math.PI) * 0.5 + frame.lag * 0.12;
            badge.rotation.x = -0.04 + Math.sin(local * Math.PI * 0.5) * 0.06;
            badge.position.y = frame.idle ? Math.sin(frame.time * 0.5) * 0.05 : 0;
            device.group.rotation.y = -0.42 + local * 0.5 + frame.lag * 0.1;
            halo.rotation.set(Math.sin(local * Math.PI) * 0.4, frame.time * 0.08 + local * 0.6, 0);
            for (const orbit of orbits) {
                orbit.ring.rotation.set(
                    Math.sin(frame.time * orbit.speed + orbit.phase) * 0.5,
                    frame.time * orbit.speed + orbit.phase,
                    local * 0.8,
                );
            }
        },
    };
}

/* ── 2. 벽 ───────────────────────────────────────────────────────────────── */

/**
 * 스택 이름이 멀찍이 벽을 이룬다.
 *
 * 여기는 Context·Approach를 **읽는** 구간이라 앞에 아무것도 두지 않는다. 판은 카메라에서
 * 14 이상 떨어져 있고, 정면으로 보고 있을 때만 겨우 밝아진다 — 가까이 있으면 본문과
 * 경쟁하지만 멀리 있으면 배경의 목록이 된다(홈의 드럼과 같은 처방).
 */
function buildWall(ctx: WorldContext, project: Project, o: Vector3): Zone {
    const BRIEF = AT_BRIEF.clone().add(o);
    const group = new Group();
    group.position.copy(BRIEF);

    const names = project.tech;
    const SPREAD_X = 11;
    const SPREAD_Y = 3.4;

    const tiles = names.map((name, index) => {
        const plate = textPlate(ctx, 3.2, 0.72, [
            { text: name, font: `600 40px ${DISPLAY}`, color: ctx.ink, y: 0.5 },
        ]);
        /* 격자를 반 칸 밀고 크게 흔든다 — 무리수 간격으로 흩으면 군데군데 뭉치고 빈다. */
        const columns = Math.ceil(names.length / 2);
        const row = index % 2;
        const column = Math.floor(index / 2);
        const home = new Vector3(
            (((column + (row ? 0.5 : 0)) / Math.max(1, columns - 0.5)) * 2 - 1) * SPREAD_X +
                (hash(index + 5) - 0.5) * 1.6,
            (row ? 1 : -1) * SPREAD_Y * (0.45 + hash(index + 11) * 0.5),
            -14 - hash(index + 17) * 5,
        );
        plate.group.position.copy(home);
        group.add(plate.group);
        return { plate, home, drift: hash(index + 23) * TAU };
    });

    const position = new Vector3();
    const look = new Vector3();

    const keys = (aspect: number) => {
        const back = aspect > 1 ? 7 : 11;
        const list: CameraKey[] = [];
        for (const t of [0, 0.5, 1]) {
            position.set(BRIEF.x - 5 + t * 10, BRIEF.y + 1.4 - t * 1.2, BRIEF.z + back);
            look.set(BRIEF.x - 3 + t * 8, BRIEF.y, BRIEF.z - 12);
            list.push(key("brief", t, position, look, 52));
        }
        return list;
    };

    const world = new Vector3();

    return {
        name: "brief",
        group,
        keys,
        warm() {},
        update(_local, frame) {
            for (const tile of tiles) {
                tile.plate.group.getWorldPosition(world);
                const hit = smoothstep(0.72, 0.995, facing(frame, world));
                tile.plate.face.opacity = 0.14 + 0.42 * hit;
                tile.plate.group.position.y = frame.idle
                    ? tile.home.y + Math.sin(frame.time * 0.35 + tile.drift) * 0.12
                    : tile.home.y;
            }
        },
    };
}

/* ── 3. 회랑 ─────────────────────────────────────────────────────────────── */

/** 화면 사이의 최대 간격(월드 단위). 카메라가 한 대를 지날 때 다음 한 대가 들어온다. */
const HALL_STEP_MAX = 7.2;
/** 회랑이 다음 장소(아치)를 침범하지 않도록 남겨 두는 여유 */
const HALL_MARGIN = 16;
/** 카메라가 지금 보는 화면 뒤로 물러서 있는 거리 */
const HALL_BACK = 3.6;

/**
 * 화면들이 좌우로 늘어선 복도. 카메라가 관통하고, 본문의 닻(캡션 하나)이 곧 한 대의 자리다.
 *
 * 홈의 복도가 "여러 프로젝트의 화면이 떠 있는 곳"이라면 여기는 **한 프로젝트의 화면만**
 * 순서대로 선다. 기기는 카메라가 오는 쪽으로 조금 돌아서 있어, 다가가는 동안 화면이 보인다.
 */
function buildHall(ctx: WorldContext, project: Project, o: Vector3): Zone {
    const HALL = AT_HALL.clone().add(o);
    const SYSTEM = AT_SYSTEM.clone().add(o);
    const group = new Group();
    const { forward, side } = axis(HALL, SYSTEM);
    const screens = project.screens;

    /* 화면 수는 프로젝트마다 다르다(넷 ~ 열). 간격을 상수로 두면 열 장짜리 회랑이 다음
       장소인 아치를 뚫고 들어가, 화면 구간을 읽는 동안 아치가 사이에 낀다. 두 장소 사이
       거리에 맞춰 간격을 줄인다 — 넉넉하면 최대값을 그대로 쓴다. */
    const span = HALL.distanceTo(SYSTEM) - HALL_MARGIN;
    const step = Math.min(HALL_STEP_MAX, span / Math.max(1, screens.length - 1));

    const devices = screens.map((screen, index) => {
        const device = (project.platform === "mobile" ? ctx.phone : ctx.window)(screen.src);
        const lean = index % 2 === 0 ? 1 : -1;
        const home = new Vector3()
            .copy(HALL)
            .addScaledVector(forward, index * step)
            .addScaledVector(side, lean * (2.9 + hash(index) * 0.5));
        home.y += lean * 0.35 + (hash(index + 7) - 0.5) * 0.5;
        device.group.position.copy(home);
        device.group.scale.setScalar(project.platform === "mobile" ? 1.05 : 0.85);
        // 카메라가 오는 쪽(뒤)을 향해 조금 돌아선다 — 다가가는 동안 화면이 읽힌다.
        device.group.lookAt(
            new Vector3()
                .copy(HALL)
                .addScaledVector(forward, index * step - 6)
                .addScaledVector(side, lean * -1.2),
        );
        group.add(device.group);
        /* 자세는 여기서 한 번 정하고 매 프레임 이 값에서 다시 시작한다. `rotateY`는 상대
           회전이라, 기준을 되돌리지 않고 부르면 프레임마다 쌓여 기기가 저 혼자 돌아간다. */
        return {
            device,
            home,
            base: device.group.quaternion.clone(),
            phase: hash(index + 13) * TAU,
        };
    });

    const position = new Vector3();
    const look = new Vector3();
    const last = Math.max(1, screens.length - 1);

    const keys = () => {
        const list: CameraKey[] = [];
        for (let index = 0; index < screens.length; index += 1) {
            position
                .copy(HALL)
                .addScaledVector(forward, index * step - HALL_BACK)
                .addScaledVector(side, index % 2 === 0 ? -0.9 : 0.9);
            position.y += 0.35;
            look.copy(HALL).addScaledVector(forward, index * step + 4.5);
            look.y += 0.1;
            list.push(key("screens", index / last, position, look, 55));
        }
        // 마지막 화면을 읽는 동안 카메라를 붙들어 둔다. 바로 떠나면 판을 뚫고 나간다.
        list.push(key("screens", 2, position, look, 55));
        return list;
    };

    return {
        name: "screens",
        group,
        keys,
        warm() {
            for (const item of devices) {
                item.device.load();
            }
        },
        update(local, frame) {
            const at = local * last;
            for (const [index, item] of devices.entries()) {
                const near = 1 - clamp01(Math.abs(at - index) / 2.2);
                item.device.group.quaternion.copy(item.base);
                // 빠르게 굴리면 기기가 진행 방향으로 한 박자 늦게 따라 돈다.
                item.device.group.rotateY(frame.lag * 0.06);
                item.device.group.rotateZ(Math.sin(frame.time * 0.4 + item.phase) * 0.012);
                item.device.group.position.y = frame.idle
                    ? item.home.y + Math.sin(frame.time * 0.5 + item.phase) * 0.07
                    : item.home.y;
                // 가까울수록 한 뼘 커진다 — 지금 읽는 화면이 어느 것인지가 크기로 읽힌다.
                item.device.group.scale.setScalar(
                    (project.platform === "mobile" ? 1.05 : 0.85) * (0.9 + near * 0.18),
                );
            }
        },
    };
}

/* ── 4. 아치 ─────────────────────────────────────────────────────────────── */

/** 통로에 선 틀의 개수 */
const ARCHES = 7;
const ARCH_STEP = 5;

/**
 * 네모난 틀이 줄지어 선 통로.
 *
 * 이 구간의 본문은 눌러 보는 그림(파이프라인 · 런타임 지도 · 열쇠 시계)이라, 뒤에서
 * 무언가 활발히 움직이면 조작이 방해받는다. 글자를 하나도 두지 않고, 카메라도 아주
 * 천천히 통과한다 — 구조 안으로 들어간다는 사실만 남긴다.
 */
function buildArches(ctx: WorldContext, project: Project, o: Vector3): Zone {
    const SYSTEM = AT_SYSTEM.clone().add(o);
    const CASES = AT_CASES.clone().add(o);
    const group = new Group();
    const { forward } = axis(SYSTEM, CASES);

    /* 사각 틀 — 튜브를 네 마디로 끊으면 모서리가 진다. 45° 돌려 세워야 네모로 선다. */
    const geometry = ctx.disposer.add(new TorusGeometry(5.6, 0.05, 6, 4));
    const accentMaterial = ctx.disposer.add(
        new MeshBasicMaterial({ color: project.theme.espresso, toneMapped: false }),
    );

    const frames = Array.from({ length: ARCHES }, (_, index) => {
        const mesh = new Mesh(geometry, index % 3 === 0 ? accentMaterial : ctx.materials.metal);
        mesh.position.copy(SYSTEM).addScaledVector(forward, (index - 1) * ARCH_STEP);
        mesh.lookAt(new Vector3().copy(mesh.position).add(forward));
        group.add(mesh);
        return { mesh, spin: (index % 2 ? 1 : -1) * (0.05 + hash(index) * 0.05), index };
    });

    const position = new Vector3();
    const look = new Vector3();

    const keys = () => {
        const list: CameraKey[] = [];
        for (const t of [0, 0.5, 1]) {
            position
                .copy(SYSTEM)
                .addScaledVector(forward, -12 + t * (ARCHES - 1) * ARCH_STEP * 0.85);
            position.y += 0.6 - t * 0.4;
            look.copy(position).addScaledVector(forward, 14);
            list.push(key("system", t, position, look, 54));
        }
        return list;
    };

    return {
        name: "system",
        group,
        keys,
        warm() {},
        update(local, frame) {
            for (const item of frames) {
                const roll =
                    Math.PI / 4 + item.index * 0.12 + local * item.spin * 3 + frame.lag * 0.1;
                item.mesh.rotation.z = roll;
                item.mesh.scale.setScalar(0.9 + Math.sin(local * Math.PI + item.index) * 0.06);
            }
        },
    };
}

/* ── 5. 오름 ─────────────────────────────────────────────────────────────── */

const ASCENT_RADIUS = 6.2;
const ASCENT_RISE = 11;
const ASCENT_TURNS = 1.25;

/**
 * 사례 번호가 나선으로 감겨 오른다. 본문의 사례 하나가 닻 하나이므로, 읽는 사례와
 * 카메라가 정면으로 보는 판이 언제나 같은 것이다.
 */
function buildAscent(ctx: WorldContext, project: Project, o: Vector3): Zone {
    const SYSTEM = AT_SYSTEM.clone().add(o);
    const CASES = AT_CASES.clone().add(o);
    const group = new Group();
    group.position.copy(CASES);

    const heading = Math.atan2(CASES.x - SYSTEM.x, CASES.z - SYSTEM.z);
    const count = Math.max(2, project.cases.length);
    const ringGeometry = ctx.disposer.add(new TorusGeometry(1.9, 0.035, 10, 84));

    const plates = project.cases.map((item, index) => {
        const t = index / (count - 1);
        const angle = heading + t * TAU * ASCENT_TURNS;
        const y = -ASCENT_RISE / 2 + t * ASCENT_RISE;
        const pivot = new Group();
        pivot.position.set(Math.sin(angle) * ASCENT_RADIUS, y, Math.cos(angle) * ASCENT_RADIUS);
        pivot.lookAt(0, y, 0);
        group.add(pivot);

        const plate = textPlate(ctx, 2.4, 1.2, [
            {
                text: String(index + 1).padStart(2, "0"),
                font: `700 78px ${MONO}`,
                color: ctx.ink,
                y: 0.44,
            },
            { text: item.label.slice(0, 18), font: `500 17px ${DISPLAY}`, color: ctx.dim, y: 0.78 },
        ]);
        pivot.add(plate.group);

        const ring = new Mesh(ringGeometry, ctx.materials.metal);
        pivot.add(ring);
        return { pivot, plate, ring, phase: hash(index) * TAU };
    });

    const position = new Vector3();
    const look = new Vector3();

    const keys = () => {
        const list: CameraKey[] = [];
        for (let index = 0; index <= 8; index += 1) {
            const t = index / 8;
            const angle = heading + t * TAU * ASCENT_TURNS;
            const y = -ASCENT_RISE / 2 - 0.3 + t * (ASCENT_RISE + 0.3);
            position.set(CASES.x, CASES.y + y, CASES.z);
            look.set(
                CASES.x + Math.sin(angle) * 8,
                CASES.y + y + 0.3,
                CASES.z + Math.cos(angle) * 8,
            );
            list.push(key("cases", t, position, look, 50));
        }
        // 마지막 사례를 읽는 동안 꼭대기에 머문다.
        list.push(key("cases", 2, position, look, 50));
        return list;
    };

    const world = new Vector3();

    return {
        name: "cases",
        group,
        keys,
        warm() {},
        update(_local, frame) {
            for (const item of plates) {
                item.ring.rotation.z = frame.time * 0.1 + frame.lag * 0.7 + item.phase;
                item.pivot.getWorldPosition(world);
                item.plate.face.opacity = 0.28 + 0.72 * smoothstep(0.6, 0.99, facing(frame, world));
            }
        },
    };
}

/* ── 6. 바깥 ─────────────────────────────────────────────────────────────── */

/**
 * 아무것도 놓지 않는 자리.
 *
 * 오름이 마지막 장소이면 카메라가 꼭대기에 붙들려, 설계 시트(Craft)와 링크를 읽는 내내
 * 마지막 사례의 번호 판과 고리가 배경에 그대로 남는다(사용자 지적). 홈에서 갤러리가 마지막인
 * 것과 다르다 — 거기서는 갤러리 뒤에 읽을 것이 없다.
 *
 * 사라지게 만드는 대신 **떠나게** 한다. 카메라가 나선을 벗어나 위로·앞으로 빠지면 오름은
 * 뒤로 밀려 안개에 잠긴다. "지나온 자리는 남는다"는 이 지면의 원칙을 깨지 않으면서도
 * 화면에서는 없어진다.
 */
function buildOutro(o: Vector3): Zone {
    const SYSTEM = AT_SYSTEM.clone().add(o);
    const CASES = AT_CASES.clone().add(o);
    const OUTRO = AT_OUTRO.clone().add(o);
    const { forward } = axis(SYSTEM, CASES);
    const top = new Vector3(CASES.x, CASES.y + ASCENT_RISE / 2, CASES.z);
    const position = new Vector3();
    const look = new Vector3();

    const keys = () => {
        const list: CameraKey[] = [];
        for (const t of [0, 0.5, 1]) {
            position
                .copy(top)
                .addScaledVector(forward, 4 + t * 30)
                .lerp(OUTRO, t * 0.55);
            position.y += 1.5 + t * 6;
            look.copy(position).addScaledVector(forward, 14);
            look.y += 1.5;
            list.push(key("outro", t, position, look, 52 + t * 4));
        }
        return list;
    };

    return {
        name: "outro",
        // 놓는 것이 없다. 이 자리의 값어치는 오름에서 멀어지는 거리 자체다.
        group: new Group(),
        keys,
        warm() {},
        update() {},
    };
}

/* ── 조립 ────────────────────────────────────────────────────────────────── */

/**
 * 이 프로젝트의 장소들을 `origin`에 통째로 놓는다.
 *
 * `origin`은 홈 갤러리에서 그 프로젝트가 서 있던 자리다(`galleryStation`). 목록에서 눌러
 * 들어오면 카메라가 **서 있던 그 자리에서** 좌대 앞으로 몇 걸음 날아간다 — 공간이 끊기지
 * 않는 이유가 이 한 줄이다.
 */
export function buildDetailWorld(ctx: WorldContext, project: Project, origin: Vector3): Zone[] {
    return [
        buildPlinth(ctx, project, origin),
        buildWall(ctx, project, origin),
        buildHall(ctx, project, origin),
        buildArches(ctx, project, origin),
        buildAscent(ctx, project, origin),
        buildOutro(origin),
    ];
}

/** 장소 사이의 비행에서 화면이 비지 않게 뿌리는 금속 조각의 경로. */
export function detailPath(origin: Vector3) {
    return [AT_COVER, AT_BRIEF, AT_HALL, AT_SYSTEM, AT_CASES, AT_OUTRO].map((at) =>
        at.clone().add(origin),
    );
}
