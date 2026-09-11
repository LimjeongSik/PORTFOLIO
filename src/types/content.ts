export interface Profile {
    name: string;
    role: string;
    tagline: string;
    intro: string[];
    phone: string;
    email: string;
    birth: string;
    location: string;
    avatar: string;
}

export interface Experience {
    company: string;
    position: string;
    period: string;
    summary: string;
    achievements: string[];
    stack: string[];
}

export interface SkillGroup {
    label: string;
    items: string[];
}

export interface ProjectLinks {
    demo?: string;
    repo?: string;
}

export interface ProjectScreen {
    src: string;
    /** 같은 화면의 다른 한 벌(테마 등). 모든 화면이 갖추면 전시에 토글이 선다. */
    srcAlt?: string;
    name: string;
    note: string;
}

/** 화면이 두 벌일 때 — 토글에 붙는 이름(`[src, srcAlt]` 순서)과 그 아래 한 줄. */
export interface ProjectScreenModes {
    labels: [string, string];
    note: string;
}

export interface ProjectSheet {
    src: string;
    title: string;
    note: string;
}

export interface ProjectMetric {
    label: string;
    value: string;
}

export interface ProjectCase {
    label: string;
    problem: string;
    approach: string;
    result: string;
    metrics?: ProjectMetric[];
}

export interface ProjectAnatomyNote {
    /** 이 주석이 켜지는 스크롤 진행률(0~1). 오름차순으로 적는다. */
    at: number;
    title: string;
    body: string;
}

/** 한 화면을 세로로 이어 붙인 스크롤샷과, 구간마다 바뀌는 설계 근거. */
export interface ProjectAnatomy {
    src: string;
    /** 스크롤샷의 가로 대비 세로 비(세로 ÷ 가로). 프레임 안 이동 거리 계산에 쓴다. */
    ratio: number;
    title: string;
    lede: string;
    notes: ProjectAnatomyNote[];
    /** 화면 아래에 한 줄로 붙는 수치 메모 */
    footnote: string;
}

/** 부팅 단계 또는 Provider 한 겹. `caution`은 자리를 바꿨을 때 실제로 깨지는 것. */
export interface ProjectRuntimeNode {
    name: string;
    role: string;
    caution?: string;
}

export interface ProjectRuntimeMap {
    title: string;
    lede: string;
    /** 앱이 뜨는 순서 */
    boot: ProjectRuntimeNode[];
    /** 바깥에서 안쪽 순서의 Provider 중첩 */
    tree: ProjectRuntimeNode[];
    /** 트리 한가운데에 놓이는 것 */
    payload: string;
    note: string;
}

/** 좌표 하나가 통과해야 하는 관문 한 칸. */
export interface ProjectPipelineStage {
    name: string;
    detail: string;
}

/** 관문에서의 판정 — 통과 · 버림 · 여기까지 오지 않음. */
export type ProjectPipelineVerdict = "pass" | "drop" | "skip";

export interface ProjectPipelineCase {
    label: string;
    hint: string;
    /** `stages`와 같은 길이·순서 */
    verdicts: ProjectPipelineVerdict[];
    outcome: string;
}

export interface ProjectPipeline {
    title: string;
    lede: string;
    stages: ProjectPipelineStage[];
    cases: ProjectPipelineCase[];
    note: string;
}

/** 인증 열쇠 한 개 — 자기 수명과 갱신 임계, 그리고 그것이 여는 문. */
export interface ProjectKey {
    name: string;
    /** 요청에 실려 나가는 헤더 이름 */
    header: string;
    /** 이 열쇠가 여는 곳 */
    opens: string;
    /** 발급 직후 수명(초). 화면에서는 시간을 감아 돌린다. */
    life: number;
    /** 남은 시간이 이 값(초) 이하로 떨어지면 갱신한다. 0이면 스스로 갱신하지 않는다. */
    renewAt: number;
    /** 갱신을 요청하는 자리. 스스로 갱신하지 않는 열쇠는 비워 둔다. */
    renewVia?: string;
    note: string;
}

/** 열쇠들이 각자 다른 속도로 닳는 시간축. */
export interface ProjectKeyring {
    title: string;
    lede: string;
    keys: ProjectKey[];
    /** 동시에 터뜨려 볼 요청 수 — 갱신이 하나로 합쳐지는 걸 보여줄 때 쓴다. */
    burst: number;
    note: string;
}

/** 말을 거는 쪽. 웹이 앱 안에서 돌 때 통로는 양방향이다. */
export type ProjectBridgeSide = "app" | "web";

export interface ProjectBridgeCall {
    from: ProjectBridgeSide;
    /** 사람이 읽는 이름 */
    label: string;
    /** 한 창구로 끝나는 호출. 플랫폼이 갈리면 비우고 `ios` · `android`를 쓴다. */
    call?: string;
    ios?: string;
    android?: string;
    /** 이 말이 닿아서 실제로 벌어지는 일들 */
    effects: string[];
    /** 말이 닿은 뒤 WebView가 놓이는 상태. 생략하면 아무것도 바뀌지 않는다. */
    applies?: {
        playing: boolean;
        locked: boolean;
        protect: boolean;
    };
}

export interface ProjectBridgeMap {
    title: string;
    lede: string;
    calls: ProjectBridgeCall[];
    note: string;
}

export interface ProjectTheme {
    paper: string;
    surface: string;
    ink: string;
    muted: string;
    line: string;
    espresso: string;
    sand: string;
}

export interface Project {
    slug: string;
    title: string;
    summary: string;
    year: string;
    role: string;
    period: string;
    platform: "mobile" | "web";
    tech: string[];
    thumbnail: string;
    icon?: string;
    theme: ProjectTheme;
    context: string[];
    approach: string[];
    cases: ProjectCase[];
    screens: ProjectScreen[];
    screenModes?: ProjectScreenModes;
    sheets: ProjectSheet[];
    links: ProjectLinks;
    /* 아래 다섯은 그 프로젝트만의 시그니처 그림이다. 있는 것만 상세 페이지의 `system`
       구간에 차례로 놓인다(`ProjectSignature`). */
    anatomy?: ProjectAnatomy;
    runtime?: ProjectRuntimeMap;
    pipeline?: ProjectPipeline;
    keyring?: ProjectKeyring;
    bridge?: ProjectBridgeMap;
}

export interface SocialLink {
    label: string;
    handle: string;
    href: string;
}
