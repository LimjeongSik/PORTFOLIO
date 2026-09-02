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
    name: string;
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

/**
 * 상세 페이지의 연출 갈래. 프로젝트마다 스크롤 문법이 다르다.
 * - `signal`   신호 필드 표지 + 제자리 크로스페이드 전시 (SafeOps)
 * - `sanctuary` 빛이 드는 표지 + 가로 행렬 · 화면 해부 · 대비 실측 (침례교 전용앱)
 */
export type ProjectVariant = "signal" | "sanctuary";

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
    sheets: ProjectSheet[];
    links: ProjectLinks;
    /** 생략하면 `signal` */
    variant?: ProjectVariant;
    anatomy?: ProjectAnatomy;
    runtime?: ProjectRuntimeMap;
    pipeline?: ProjectPipeline;
}

export interface SocialLink {
    label: string;
    handle: string;
    href: string;
}
