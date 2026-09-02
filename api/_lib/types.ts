/**
 * AI가 읽는 지식의 형태. `src/types/content.ts`에서 파생시켜, 화면에만 필요한 것
 * (이미지 경로 · 테마 색 · 스크롤 진행률)을 걷어낸 서술 텍스트만 남긴다.
 */
import type {
    Experience,
    Profile,
    Project,
    ProjectAnatomy,
    ProjectCase,
    ProjectPipeline,
    ProjectRuntimeMap,
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
> & {
    screens: { name: string; note: string }[];
};

/** 깊은 질문이 왔을 때만 `get_project_detail`로 꺼내는 본문. */
export type KnowledgeProjectDetail = {
    cases: ProjectCase[];
    sheets: { title: string; note: string }[];
    anatomy?: Omit<ProjectAnatomy, "src" | "ratio">;
    runtime?: ProjectRuntimeMap;
    pipeline?: ProjectPipeline;
};

export type Knowledge = {
    profile: KnowledgeProfile;
    experiences: Experience[];
    skills: SkillGroup[];
    socials: SocialLink[];
    projects: KnowledgeProject[];
    details: Record<string, KnowledgeProjectDetail>;
};
