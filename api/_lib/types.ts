/**
 * AI가 읽는 지식의 형태. `src/types/content.ts`에서 파생시켜, 화면에만 필요한 것
 * (이미지 경로 · 테마 색 · 스크롤 진행률)을 걷어낸 서술 텍스트만 남긴다.
 */
import type {
    Activity,
    Experience,
    Profile,
    Project,
    ProjectAnatomy,
    ProjectBridgeMap,
    ProjectCase,
    ProjectKeyring,
    ProjectPipeline,
    ProjectRuntimeMap,
    ProjectSieve,
    ProjectWindowing,
    SkillGroup,
    SocialLink,
} from "../../src/types/content.js";

export type KnowledgeProfile = Omit<Profile, "avatar">;

/** 시스템 프롬프트에 통째로 실리는 요약. 프로젝트마다 이만큼만 항상 들고 있는다. */
export type KnowledgeProject = Omit<
    Project,
    | "thumbnail"
    | "icon"
    | "theme"
    | "screens"
    | "sheets"
    | "cases"
    | "anatomy"
    | "runtime"
    | "pipeline"
    | "sieve"
    | "windowing"
    | "keyring"
    | "bridge"
> & {
    screens: { name: string; note: string }[];
};

/** 깊은 질문이 왔을 때만 `get_project_detail`로 꺼내는 본문. */
export type KnowledgeProjectDetail = {
    cases: ProjectCase[];
    sheets: { title: string; note: string }[];
    anatomy?: Omit<ProjectAnatomy, "src" | "ratio" | "notes"> & {
        notes: { title: string; body: string }[];
    };
    runtime?: ProjectRuntimeMap;
    pipeline?: ProjectPipeline;
    sieve?: ProjectSieve;
    windowing?: ProjectWindowing;
    /** 수명(`life`)과 `burst`는 화면 연출용으로 줄인 값이라 뺀다. 임계·경로는 코드 그대로다. */
    keyring?: Omit<ProjectKeyring, "keys" | "burst"> & {
        keys: Omit<ProjectKeyring["keys"][number], "life">[];
    };
    /** `applies`는 화면 상태 표시용이라 뺀다. */
    bridge?: Omit<ProjectBridgeMap, "calls"> & {
        calls: Omit<ProjectBridgeMap["calls"][number], "applies">[];
    };
};

export type Knowledge = {
    profile: KnowledgeProfile;
    experiences: Experience[];
    activities: Activity[];
    skills: SkillGroup[];
    socials: SocialLink[];
    projects: KnowledgeProject[];
    details: Record<string, KnowledgeProjectDetail>;
};
