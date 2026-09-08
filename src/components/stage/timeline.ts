import type { Vector3 } from "three";

/**
 * 스크롤 → 카메라의 단일 축.
 *
 * 무대의 모든 값은 **지금 스크롤 위치의 순수 함수**다. 시간으로 흐르는 트윈이나 러프를 사이에
 * 끼우지 않는다 — 1px 굴리면 1px만큼만 움직이고, 손을 떼면 그 자리에 선다.
 *
 * 카메라 경로는 구간(`data-stage-zone`)마다 **구간 안의 자리(0~1)** 로 적어 둔 키프레임이다.
 * 실제 스크롤 픽셀은 레이아웃이 정해진 뒤에야 알 수 있으므로, 잴 때마다 키를 픽셀 위치로
 * 풀어 스플라인에 다시 올린다. 구간과 구간 사이(다리·섹션 제목)는 키가 없어도 스플라인이
 * 이어 주므로, 그 사이 스크롤이 곧 카메라가 다음 장소로 날아가는 시간이 된다.
 *
 * 구간 안에 **닻(`data-stage-anchor`)** 이 둘 이상 있으면 자리는 구간 상자가 아니라 닻을
 * 따른다 — 0은 첫 닻이, 1은 마지막 닻이 화면 가운데 오는 순간이고 그 사이는 닻 사이를 고르게
 * 나눈다. 내용이 구간보다 짧거나 항목 높이가 제각각인 구간(경력)에서, 카메라가 보는 판과
 * 화면에 읽히는 항목이 같은 순간에 맞아야 하기 때문이다. 구간 상자로 재면 화면 비율마다
 * 다르게 어긋난다.
 *
 * 스플라인은 **단조 큐빅**(Fritsch–Carlson)이다. 키 사이 간격이 몹시 고르지 않다 — 구간 안의
 * 키는 150px 간격인데 구간 사이는 1,000px이 넘는다. 보통의 캣멀롬은 긴 구간의 속도를 짧은
 * 구간에 물려주어 키를 지나쳐 튀고(드럼 한가운데 서야 할 카메라가 벽에 붙는다), 단조 큐빅은
 * 성분마다 키 사이에서 절대 키 밖으로 나가지 않는다.
 */

export interface CameraKey {
    zone: string;
    /**
     * 구간 안의 자리(0~1). 0은 구간이 화면에 붙는 순간, 1은 떠나기 직전.
     * 닻이 있는 구간에서는 0이 첫 닻, 1이 마지막 닻이고, **1~2는 마지막 닻에서 구간 끝까지**다 —
     * 마지막 항목을 읽는 동안 카메라를 그 자리에 붙들어 두는 데 쓴다(`at: 2`).
     */
    at: number;
    position: readonly [number, number, number];
    look: readonly [number, number, number];
    fov: number;
}

interface Range {
    start: number;
    end: number;
    /** 닻마다 그것이 화면 가운데 오는 스크롤 위치. 닻이 둘 미만이면 없다. */
    anchors: number[] | null;
}

/** 닻이 화면의 어느 높이에 왔을 때 "도착"으로 치는가 — 경력의 점이 켜지는 선과 맞춘다. */
const ANCHOR_LINE = 0.5;

function clamp01(value: number) {
    return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** 성분별 단조 큐빅 에르미트 스플라인. 키 사이에서 키 값의 범위를 넘지 않는다. */
class Spline {
    private times: Float32Array;
    private values: Float32Array;
    private size: number;
    private tangents: Float32Array;

    constructor(times: Float32Array, values: Float32Array, size: number) {
        this.times = times;
        this.values = values;
        this.size = size;
        const count = times.length;
        this.tangents = new Float32Array(count * size);
        for (let c = 0; c < size; c += 1) {
            const value = (k: number) => values[k * size + c];
            const slopes = new Float32Array(Math.max(1, count - 1));
            for (let k = 0; k < count - 1; k += 1) {
                slopes[k] = (value(k + 1) - value(k)) / (times[k + 1] - times[k]);
            }
            for (let k = 0; k < count; k += 1) {
                let m: number;
                if (count === 1) {
                    m = 0;
                } else if (k === 0) {
                    m = slopes[0];
                } else if (k === count - 1) {
                    m = slopes[count - 2];
                } else if (slopes[k - 1] * slopes[k] <= 0) {
                    // 방향이 꺾이는 키 — 접선을 0으로 눌러 지나치지 않게 한다.
                    m = 0;
                } else {
                    const h0 = times[k] - times[k - 1];
                    const h1 = times[k + 1] - times[k];
                    const w0 = 2 * h1 + h0;
                    const w1 = h1 + 2 * h0;
                    m = (w0 + w1) / (w0 / slopes[k - 1] + w1 / slopes[k]);
                }
                this.tangents[k * size + c] = m;
            }
        }
    }

    evaluate(t: number, out: Float32Array) {
        const times = this.times;
        const values = this.values;
        const size = this.size;
        const tangents = this.tangents;
        const count = times.length;
        if (t <= times[0]) {
            out.set(values.subarray(0, size));
            return out;
        }
        if (t >= times[count - 1]) {
            out.set(values.subarray((count - 1) * size, count * size));
            return out;
        }
        let lo = 0;
        let hi = count - 1;
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (times[mid] <= t) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        const h = times[hi] - times[lo];
        const s = (t - times[lo]) / h;
        const s2 = s * s;
        const s3 = s2 * s;
        const h00 = 2 * s3 - 3 * s2 + 1;
        const h10 = s3 - 2 * s2 + s;
        const h01 = -2 * s3 + 3 * s2;
        const h11 = s3 - s2;
        for (let c = 0; c < size; c += 1) {
            out[c] =
                h00 * values[lo * size + c] +
                h10 * h * tangents[lo * size + c] +
                h01 * values[hi * size + c] +
                h11 * h * tangents[hi * size + c];
        }
        return out;
    }
}

export class Timeline {
    /** 이 무대가 찾을 구간 이름. 홈과 상세가 서로 다른 목록을 들고 같은 축을 쓴다. */
    private zones: readonly string[];
    private ranges = new Map<string, Range>();
    private position: Spline | null = null;
    private look: Spline | null = null;
    private fov: Spline | null = null;
    private viewport = 1;
    private out3 = new Float32Array(3);
    private out1 = new Float32Array(1);

    constructor(zones: readonly string[]) {
        this.zones = zones;
    }

    /** 구간 요소를 다시 재고, 키를 픽셀 위치로 풀어 보간기를 세운다. */
    measure(keys: readonly CameraKey[]) {
        this.viewport = window.innerHeight;
        this.ranges.clear();
        for (const name of this.zones) {
            const node = document.querySelector<HTMLElement>(`[data-stage-zone="${name}"]`);
            if (!node) {
                continue;
            }
            const rect = node.getBoundingClientRect();
            const start = rect.top + window.scrollY;
            const anchors = Array.from(node.querySelectorAll<HTMLElement>("[data-stage-anchor]"))
                .map(
                    (anchor) =>
                        anchor.getBoundingClientRect().top +
                        window.scrollY -
                        this.viewport * ANCHOR_LINE,
                )
                .sort((a, b) => a - b);
            this.ranges.set(name, {
                start,
                end: start + Math.max(1, rect.height - this.viewport),
                anchors: anchors.length >= 2 ? anchors : null,
            });
        }
        this.build(keys);
    }

    has(zone: string) {
        return this.ranges.has(zone);
    }

    /** 구간이 차지한 스크롤 안에서 지금 어디까지 왔는가(0~1). 닻이 있으면 닻 사이의 자리다. */
    localOf(zone: string, scroll: number) {
        const range = this.ranges.get(zone);
        if (!range) {
            return 0;
        }
        const anchors = range.anchors;
        if (!anchors) {
            return clamp01((scroll - range.start) / (range.end - range.start));
        }
        const last = anchors.length - 1;
        if (scroll <= anchors[0]) {
            return 0;
        }
        if (scroll >= anchors[last]) {
            return 1;
        }
        let lo = 0;
        while (lo < last - 1 && anchors[lo + 1] <= scroll) {
            lo += 1;
        }
        const span = Math.max(1, anchors[lo + 1] - anchors[lo]);
        return (lo + (scroll - anchors[lo]) / span) / last;
    }

    /** 구간에서 얼마나 떨어져 있는가 — 화면 높이 단위. 안에 있으면 0. */
    proximity(zone: string, scroll: number) {
        const range = this.ranges.get(zone);
        if (!range) {
            return Number.POSITIVE_INFINITY;
        }
        if (scroll < range.start) {
            return (range.start - scroll) / this.viewport;
        }
        if (scroll > range.end) {
            return (scroll - range.end) / this.viewport;
        }
        return 0;
    }

    /** 구간 안의 자리(0~1)를 실제 스크롤 픽셀로. 닻이 있으면 닻 사이를 고르게 나눈 자리다. */
    scrollOf(zone: string, at: number) {
        const range = this.ranges.get(zone);
        if (!range) {
            return null;
        }
        const anchors = range.anchors;
        if (!anchors) {
            return range.start + (range.end - range.start) * at;
        }
        const last = anchors.length - 1;
        if (at > 1) {
            // 마지막 닻 뒤는 구간 끝까지 — 구간이 닻보다 먼저 끝나면 그 자리에 겹친다.
            const tail = Math.max(anchors[last], range.end);
            return anchors[last] + (tail - anchors[last]) * (Math.min(at, 2) - 1);
        }
        const spot = clamp01(at) * last;
        const lo = Math.min(last - 1, Math.floor(spot));
        return anchors[lo] + (anchors[lo + 1] - anchors[lo]) * (spot - lo);
    }

    /**
     * 동작 줄이기 — 스크롤이 흐르는 동안의 카메라 이동을 걷어내고, 가장 가까운 구간의
     * 한가운데 시점에 세운다. 구간이 바뀔 때만 화면이 바뀐다.
     */
    settle(scroll: number) {
        let best: string | null = null;
        let distance = Number.POSITIVE_INFINITY;
        for (const name of this.zones) {
            const near = this.proximity(name, scroll);
            if (near < distance) {
                distance = near;
                best = name;
            }
        }
        return best ? (this.scrollOf(best, 0.5) ?? scroll) : scroll;
    }

    /** 스크롤 위치의 카메라 자리·시선을 채우고 화각을 돌려준다. */
    sample(scroll: number, outPosition: Vector3, outLook: Vector3) {
        if (!this.position || !this.look || !this.fov) {
            outPosition.set(0, 0, 9);
            outLook.set(0, 0, -10);
            return 52;
        }
        const p = this.position.evaluate(scroll, this.out3);
        outPosition.set(p[0], p[1], p[2]);
        const l = this.look.evaluate(scroll, this.out3);
        outLook.set(l[0], l[1], l[2]);
        return this.fov.evaluate(scroll, this.out1)[0];
    }

    private build(keys: readonly CameraKey[]) {
        const resolved = keys
            .map((key) => ({ key, time: this.scrollOf(key.zone, key.at) }))
            .filter((item): item is { key: CameraKey; time: number } => item.time !== null)
            .sort((a, b) => a.time - b.time);

        if (resolved.length === 0) {
            this.position = null;
            this.look = null;
            this.fov = null;
            return;
        }
        if (resolved.length === 1) {
            resolved.push({ key: resolved[0].key, time: resolved[0].time + 1 });
        }

        const times = new Float32Array(resolved.length);
        const positions = new Float32Array(resolved.length * 3);
        const looks = new Float32Array(resolved.length * 3);
        const fovs = new Float32Array(resolved.length);

        let previous = Number.NEGATIVE_INFINITY;
        resolved.forEach(({ key, time }, index) => {
            // 보간기는 시간이 엄격히 증가해야 한다. 같은 픽셀에 두 키가 겹치면 1px 벌린다.
            const t = time <= previous ? previous + 1 : time;
            previous = t;
            times[index] = t;
            positions.set(key.position, index * 3);
            looks.set(key.look, index * 3);
            fovs[index] = key.fov;
        });

        this.position = new Spline(times, positions, 3);
        this.look = new Spline(times, looks, 3);
        this.fov = new Spline(times, fovs, 1);
    }
}
