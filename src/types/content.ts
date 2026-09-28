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

/**
 * 경력·프로젝트로는 안 세지만 남겨 둘 만한 것 — 컨퍼런스 · 세미나 · 스터디 · 자격.
 * 경력 섹션 꼬리에 작은 목록으로 붙는다(무대의 닻은 붙이지 않는다 — §경력 카메라).
 */
export interface Activity {
    /** "2025" 또는 "2025.10" */
    period: string;
    title: string;
    /** 주최·기관 한 줄 */
    host: string;
    /** 무엇을 들었는지 한 문장 */
    note: string;
    /** 거기서 가져온 것. 참석 사실만 적힌 줄은 읽는 사람에게 아무것도 증명하지 않는다. */
    takeaways?: string[];
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
    /** 웹 화면의 주소(경로). 전시의 주소창에 호스트 뒤로 붙는다. */
    path?: string;
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

/**
 * 사례의 근거 — 같은 자리의 코드가 전에는 어땠고 지금은 어떤가. 원 저장소의 git 이력에서
 * 그대로 발췌한다(줄임은 `// ...`로만). 지어낸 코드나 다듬은 의사 코드는 넣지 않는다.
 */
export interface ProjectCodeChange {
    /** 발췌한 파일(원 저장소 기준 경로) */
    file: string;
    /** 바뀐 커밋 — "짧은 해시 · YYYY.MM.DD". 저장소가 비공개라 확인할 때 짚는 표식이다. */
    commit?: string;
    /** 없으면 이 커밋에서 새로 들어간 코드다 — 전 칸을 지어내지 않고 추가 칸 하나만 그린다. */
    before?: string;
    after: string;
    /** 두 코드가 같은 입력에서 실제로 어떻게 다르게 움직였나 */
    note: string;
}

export interface ProjectCase {
    label: string;
    problem: string;
    approach: string;
    result: string;
    metrics?: ProjectMetric[];
    changes?: ProjectCodeChange[];
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

/** 붙여넣어 볼 입력 한 벌. */
export interface ProjectSieveSample {
    label: string;
    hint: string;
    /** 입력창에 그대로 들어가는 원문. 줄바꿈도 공백으로 친다. */
    input: string;
}

/** 붙여넣은 번호가 등록 · 중복 · 오류로 갈리는 체. 판정 규칙은 컴포넌트가 원 코드를 옮겨 들고 있다. */
export interface ProjectSieve {
    title: string;
    lede: string;
    /** 등록할 때 앞자리 0 대신 붙는 국가번호 */
    country: string;
    samples: ProjectSieveSample[];
    note: string;
}

/** 목록이 아무리 길어도 보이는 줄만 그리는 창. */
export interface ProjectWindowing {
    title: string;
    lede: string;
    /** 골라 볼 등록 건수 */
    counts: number[];
    /** 한 줄에 묶는 번호 수 */
    perRow: number;
    /** 원 프로젝트에서 잰 값 */
    measured: ProjectMetric[];
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
    /* 아래는 그 프로젝트만의 시그니처 그림이다. 있는 것만 상세 페이지의 `system`
       구간에 차례로 놓인다(`ProjectSignature`). */
    anatomy?: ProjectAnatomy;
    runtime?: ProjectRuntimeMap;
    pipeline?: ProjectPipeline;
    bridge?: ProjectBridgeMap;
    sieve?: ProjectSieve;
    windowing?: ProjectWindowing;
}

export interface SocialLink {
    label: string;
    handle: string;
    href: string;
}
