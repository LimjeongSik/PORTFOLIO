import {
    Group,
    IcosahedronGeometry,
    InstancedMesh,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Quaternion,
    Vector3,
} from "three";

import { BEVEL, bodyGeometry, textTexture } from "./mockup";

import type { TextLine } from "./mockup";
import type { Frame, WorldContext } from "./rig";
import type { CameraKey } from "./timeline";

/** 무대 두 곳이 나눠 쓰는 조각과 셈. */

export const TAU = Math.PI * 2;
export const UP = new Vector3(0, 1, 0);

export function clamp01(value: number) {
    return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function smoothstep(edge0: number, edge1: number, value: number) {
    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
}

/** 판마다 고정된 흩어짐 — 매번 다르면 리사이즈마다 자리가 튄다. */
export function hash(seed: number) {
    const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return value - Math.floor(value);
}

export function cameraKey(
    zone: string,
    at: number,
    position: Vector3,
    look: Vector3,
    fov: number,
): CameraKey {
    return {
        zone,
        at,
        position: [position.x, position.y, position.z],
        look: [look.x, look.y, look.z],
        fov,
    };
}

/** 카메라가 이 물체를 얼마나 정면으로 보고 있는가(0~1). */
const toObject = new Vector3();
export function facing(frame: Frame, position: Vector3) {
    toObject.copy(position).sub(frame.camera).normalize();
    return clamp01(toObject.dot(frame.forward));
}

export interface Plate {
    group: Group;
    face: MeshBasicMaterial;
}

/**
 * 글자가 새겨진 얇은 판. 몸체는 빛을 받고, 글자 면은 스스로 빛난다.
 * 같은 크기의 판은 지오메트리를 나눠 쓴다.
 */
export function textPlate(
    ctx: WorldContext,
    width: number,
    height: number,
    lines: TextLine[],
): Plate {
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

/**
 * 장소와 장소 사이의 비행에서 화면이 비지 않게, 경로를 따라 작은 금속 조각을 흩뿌린다.
 * 카메라가 지나는 통로 안쪽은 비워 두어 얼굴에 부딪히지 않는다. 움직이지 않는다 — 카메라가
 * 움직이면 시차가 곧 움직임이다.
 */
export function buildDust(ctx: WorldContext, path: readonly Vector3[], count = 800) {
    const geometry = ctx.disposer.add(new IcosahedronGeometry(0.07, 0));
    const mesh = new InstancedMesh(geometry, ctx.materials.dust, count);
    const lengths = path.slice(1).map((anchor, index) => anchor.distanceTo(path[index]));
    const total = lengths.reduce((sum, length) => sum + length, 0);
    const matrix = new Matrix4();
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();
    const spin = new Vector3();
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
            .copy(path[segment + 1])
            .sub(path[segment])
            .normalize();
        side.crossVectors(along, UP).normalize();
        lift.crossVectors(side, along).normalize();
        const angle = hash(index * 3 + 2) * TAU;
        const radius = 6.5 + hash(index * 3 + 3) * 13;
        position
            .copy(path[segment])
            .addScaledVector(along, distance)
            .addScaledVector(side, Math.cos(angle) * radius)
            .addScaledVector(lift, Math.sin(angle) * radius * 0.7);
        spin.set(
            hash(index + 11) - 0.5,
            hash(index + 17) - 0.5,
            hash(index + 23) - 0.5,
        ).normalize();
        quaternion.setFromAxisAngle(spin, hash(index + 29) * TAU);
        scale.setScalar(0.4 + hash(index + 31) * 0.9);
        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(index, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    return mesh;
}
