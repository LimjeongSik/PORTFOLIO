import { gsap } from "@/lib/gsap";

import type { ProjectTheme } from "@/types/content";

/**
 * 지면의 무드 — 스크롤 구간마다 :root의 --color-* 를 통째로 갈아 끼운다.
 *
 * 왜 CSS 트랜지션이 아니라 JS 트윈인가: Tailwind v4가 `bg-paper`를
 * `var(--color-paper)`로 컴파일하는 덕에 변수 하나만 바꾸면 지면 전체가 따라오지만,
 * 커스텀 프로퍼티는 `@property`로 타입을 등록하지 않는 한 트랜지션되지 않는다.
 * 색을 RGB 숫자로 풀어 직접 보간하면 등록 여부·브라우저 지원과 무관하게 항상 같은 곡선으로
 * 움직이고, 같은 값을 캔버스 셰이더에도 그대로 넘길 수 있다.
 */
export type Mood = ProjectTheme;

type Rgb = [number, number, number];

const KEYS = ["paper", "surface", "ink", "muted", "line", "sand", "espresso"] as const;

type Key = (typeof KEYS)[number];

/**
 * styles/index.css의 @theme 기본값과 같아야 한다.
 *
 * 홈의 기본 액센트는 채도가 거의 없는 본(bone)이다. 네온을 쓰면 어두운 지면에서 화면이
 * 형광으로 뜨고, 정작 **색을 가진 건 프로젝트뿐**이라는 구조가 무너진다. 홈은 무채로 두고
 * 색은 프로젝트 방에서만 터지게 한다.
 */
export const BASE_MOOD: Mood = {
    paper: "#08070c",
    surface: "#141119",
    ink: "#f2efe9",
    muted: "#8b8598",
    line: "#26232f",
    sand: "#1c1926",
    espresso: "#e7e0d2",
};

/**
 * 홈의 앞부분은 깊이와 **온도**로 나눈다. 히어로가 가장 깊고 아래로 갈수록 지면이 한 단계씩 뜨며,
 * 액센트는 본 → 펄 → 강철 → 모래로 미지근하게 옮겨 간다. 채도를 낮게 두는 것이 핵심이다 —
 * 여기서 색을 세게 쓰면 프로젝트 방의 색이 사건으로 읽히지 않는다.
 */
export const VOID_MOOD: Mood = {
    ...BASE_MOOD,
    paper: "#040308",
    surface: "#0e0c14",
    line: "#1e1b26",
    espresso: "#e7e0d2",
};

/** 프로필 구간 — 히어로의 본에서 한 걸음 차가운 쪽으로. */
export const PROFILE_MOOD: Mood = {
    ...BASE_MOOD,
    espresso: "#ded8e6",
};

export const SKILL_MOOD: Mood = {
    ...BASE_MOOD,
    paper: "#0b0a11",
    surface: "#17141f",
    line: "#2a2735",
    espresso: "#b9cfe0",
};

export const CRAFT_MOOD: Mood = {
    ...BASE_MOOD,
    paper: "#0e0c15",
    surface: "#1b1725",
    line: "#302c3c",
    espresso: "#e2c6a4",
};

function parseHex(hex: string): Rgb {
    const value = hex.replace("#", "");
    const full =
        value.length === 3
            ? value
                  .split("")
                  .map((char) => char + char)
                  .join("")
            : value;
    return [
        Number.parseInt(full.slice(0, 2), 16),
        Number.parseInt(full.slice(2, 4), 16),
        Number.parseInt(full.slice(4, 6), 16),
    ];
}

function toRgbMood(mood: Mood): Record<Key, Rgb> {
    return {
        paper: parseHex(mood.paper),
        surface: parseHex(mood.surface),
        ink: parseHex(mood.ink),
        muted: parseHex(mood.muted),
        line: parseHex(mood.line),
        sand: parseHex(mood.sand),
        espresso: parseHex(mood.espresso),
    };
}

/** 현재 화면에 실제로 칠해져 있는 값. 트윈이 이 객체를 제자리에서 굴린다. */
const current = toRgbMood(BASE_MOOD);

let tween: gsap.core.Tween | null = null;
let sceneTween: gsap.core.Tween | null = null;
let activeId: string | null = null;
let mounted = false;

/**
 * 지금 `:root`의 색을 칠해 둔 쪽.
 *
 * 페이지를 넘기는 동안에는 **떠나는 라우트와 도착한 라우트가 잠시 함께 살아 있다**. 그래서
 * 정리(`clearMood` · `releaseTheme`)가 도착한 쪽이 이미 칠해 둔 값을 지워 버리는 일이 생긴다 —
 * 언마운트가 마운트보다 나중에 오기 때문이다. 소유자가 자기일 때만 걷어내게 해서 막는다.
 */
let owner: string | null = null;

type Listener = (accent: Rgb, paper: Rgb, scene: number) => void;
const listeners = new Set<Listener>();

/**
 * 지금 구간의 번호(0 히어로 · 1 프로필 · 2 기술 · 3 경력 · 4 프로젝트).
 * 캔버스가 이 값 하나로 필드의 조판을 바꾼다 — 색과 함께 트윈되므로 지면과 배경이 같이 넘어간다.
 */
const scene = { value: 0 };

function write() {
    const root = document.documentElement;
    for (const key of KEYS) {
        const [r, g, b] = current[key];
        root.style.setProperty(
            `--color-${key}`,
            `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`,
        );
    }
    notify();
}

function notify() {
    for (const listener of listeners) {
        listener(current.espresso, current.paper, scene.value);
    }
}

/**
 * 무드를 바꾼다. `id`가 같으면 아무 것도 하지 않으므로 ScrollTrigger가 같은 구간에서
 * 몇 번을 다시 불러도 트윈이 재시작되지 않는다.
 */
export function setMood(id: string, mood: Mood, options?: { immediate?: boolean; scene?: number }) {
    if (activeId === id) {
        return;
    }
    activeId = id;
    mounted = true;
    owner = "home";

    const target = toRgbMood(mood);
    const nextScene = options?.scene ?? scene.value;
    tween?.kill();
    sceneTween?.kill();

    if (options?.immediate) {
        scene.value = nextScene;
        for (const key of KEYS) {
            current[key] = [...target[key]] as Rgb;
        }
        write();
        return;
    }

    if (nextScene !== scene.value) {
        // 구간 번호는 색보다 조금 길게 넘긴다 — 배경의 조판이 바뀌는 건 더 큰 사건이라
        // 같은 시간에 끝내면 뚝 끊긴 것처럼 보인다.
        sceneTween = gsap.to(scene, {
            value: nextScene,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: notify,
        });
    }

    // 채널을 평평한 숫자 배열로 펴서 한 트윈으로 굴린다.
    const proxy: Record<string, number> = {};
    const to: Record<string, number> = {};
    for (const key of KEYS) {
        for (let channel = 0; channel < 3; channel += 1) {
            proxy[`${key}${channel}`] = current[key][channel];
            to[`${key}${channel}`] = target[key][channel];
        }
    }

    tween = gsap.to(proxy, {
        ...to,
        duration: 0.85,
        ease: "power2.inOut",
        onUpdate: () => {
            for (const key of KEYS) {
                current[key] = [proxy[`${key}0`], proxy[`${key}1`], proxy[`${key}2`]];
            }
            write();
        },
    });
}

/**
 * 홈을 벗어날 때 호출 — 주입한 값을 걷어 @theme 기본값이 다시 보이게 한다.
 *
 * `keep`이면 **칠해 둔 색을 그대로 남긴다.** 라우트가 넘어가는 중에는 캔버스가 계속 보이므로,
 * 여기서 기본값으로 되돌리면 카메라가 다음 방으로 날아가는 한가운데서 지면만 한 프레임에
 * 뒤집힌다. 도착한 쪽이 이 색에서 물들여 가면 된다.
 */
export function clearMood(keep = false) {
    tween?.kill();
    sceneTween?.kill();
    tween = null;
    sceneTween = null;
    scene.value = 0;
    activeId = null;
    mounted = false;

    // 내부 상태는 언제나 되돌리되, 화면의 값은 아직 내가 주인일 때만 걷는다.
    const mine = owner === "home";
    if (mine) {
        owner = null;
    }
    if (keep) {
        return;
    }
    const root = document.documentElement;
    for (const key of KEYS) {
        if (mine) {
            root.style.removeProperty(`--color-${key}`);
        }
        current[key] = parseHex(BASE_MOOD[key]);
    }
}

/**
 * 프로젝트 상세가 자기 테마를 지면에 주입한다.
 *
 * 홈의 무드와 같은 변수를 쓰므로 소유권도 같은 곳에서 관리한다 — 상세가 칠한 값을
 * 뒤늦게 언마운트되는 홈이 지우면, 넘기는 동안 지면이 통째로 기본값으로 돌아간다.
 */
export function applyTheme(id: string, theme: Mood, options?: { duration?: number }) {
    tween?.kill();
    sceneTween?.kill();
    owner = id;

    const target = toRgbMood(theme);
    const duration = options?.duration ?? 0;

    if (duration <= 0) {
        const root = document.documentElement;
        for (const key of KEYS) {
            root.style.setProperty(`--color-${key}`, theme[key]);
            current[key] = [...target[key]] as Rgb;
        }
        notify();
        return;
    }

    /* 넘어가는 중이라면 물들이며 간다 — 캔버스가 계속 보이는 채로 카메라가 날아가는데
       지면색만 툭 바뀌면 그 한 프레임이 통째로 눈에 띈다. 채널을 평평한 숫자 배열로 펴서
       한 트윈으로 굴리는 것은 `setMood`와 같다. */
    const proxy: Record<string, number> = {};
    const to: Record<string, number> = {};
    for (const key of KEYS) {
        for (let channel = 0; channel < 3; channel += 1) {
            proxy[`${key}${channel}`] = current[key][channel];
            to[`${key}${channel}`] = target[key][channel];
        }
    }
    tween = gsap.to(proxy, {
        ...to,
        duration,
        ease: "power2.inOut",
        onUpdate: () => {
            for (const key of KEYS) {
                current[key] = [proxy[`${key}0`], proxy[`${key}1`], proxy[`${key}2`]];
            }
            write();
        },
    });
}

/**
 * 상세를 벗어날 때 — 그 사이 다른 쪽이 칠했다면 건드리지 않는다.
 *
 * `keep`의 뜻은 `clearMood`와 같다. 넘어가는 중이면 이 프로젝트의 색을 남겨 두고, 도착한
 * 쪽(홈 또는 다음 프로젝트)이 그 색에서 물들여 간다.
 */
export function releaseTheme(id: string, keep = false) {
    if (owner !== id) {
        return;
    }
    owner = null;
    if (keep) {
        return;
    }
    const root = document.documentElement;
    for (const key of KEYS) {
        root.style.removeProperty(`--color-${key}`);
        current[key] = parseHex(BASE_MOOD[key]);
    }
}

/** 캔버스가 지면과 같은 색을 쓰도록 현재 액센트·지면색을 구독한다. */
export function subscribeMood(listener: Listener) {
    listeners.add(listener);
    listener(current.espresso, current.paper, scene.value);
    return () => {
        listeners.delete(listener);
    };
}

export function isMoodMounted() {
    return mounted;
}

/* ---------------------------------------------------------------------------
   프로젝트 액센트 → 그 프로젝트의 "방"
   --------------------------------------------------------------------------- */

function toHex([r, g, b]: Rgb) {
    const part = (value: number) =>
        Math.round(Math.min(255, Math.max(0, value)))
            .toString(16)
            .padStart(2, "0");
    return `#${part(r)}${part(g)}${part(b)}`;
}

function mix(a: Rgb, b: Rgb, amount: number): Rgb {
    return [
        a[0] + (b[0] - a[0]) * amount,
        a[1] + (b[1] - a[1]) * amount,
        a[2] + (b[2] - a[2]) * amount,
    ];
}

/** WCAG 상대 휘도. 액센트가 어두운 지면에서 읽히는지 판정하는 데만 쓴다. */
function luminance([r, g, b]: Rgb) {
    const channel = (value: number) => {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * 어두운 방에서도 액센트가 본문 대비를 넘도록 색조를 지킨 채 밝기만 끌어올린다.
 * 침례교의 `#2b5fde`는 검정 위에서 3.76:1이라 작은 글자에 그대로 쓸 수 없다 —
 * 상세 페이지(밝은 지면)에서 쓰던 값을 홈의 어두운 지면으로 그냥 가져오면 안 되는 이유다.
 */
function liftForDark(rgb: Rgb): Rgb {
    const TARGET = 0.24;
    let current: Rgb = [...rgb];
    for (let step = 0; step < 24 && luminance(current) < TARGET; step += 1) {
        current = mix(current, [255, 255, 255], 0.06);
    }
    return current;
}

const ROOM_PAPER: Rgb = [5, 4, 9];
const ROOM_SURFACE: Rgb = [15, 13, 21];
const ROOM_LINE: Rgb = [32, 29, 40];
const ROOM_SAND: Rgb = [21, 18, 30];
const ROOM_MUTED: Rgb = [138, 132, 152];

/**
 * 프로젝트마다 지면을 그 프로젝트의 색으로 물들인 어두운 방을 만든다.
 *
 * 상세 페이지의 `theme`을 통째로 쓰지 않는 이유: 침례교처럼 밝은 테마를 가진 프로젝트에서
 * 지면이 near-black ↔ near-white로 뒤집혀 스크롤 중에 눈이 아프다. 홈은 계속 어둡게 두고
 * **액센트만 프로젝트 것으로 갈아 끼운 뒤**, 그 액센트를 지면·경계선에 옅게 섞어 방의 온도를 바꾼다.
 */
export function moodFromAccent(accentHex: string): Mood {
    const accent = liftForDark(parseHex(accentHex));
    return {
        paper: toHex(mix(ROOM_PAPER, accent, 0.05)),
        surface: toHex(mix(ROOM_SURFACE, accent, 0.09)),
        ink: "#f4f2ee",
        muted: toHex(mix(ROOM_MUTED, accent, 0.16)),
        line: toHex(mix(ROOM_LINE, accent, 0.18)),
        sand: toHex(mix(ROOM_SAND, accent, 0.12)),
        espresso: toHex(accent),
    };
}
