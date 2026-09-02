/**
 * `src/data/*.ts` → `api/_lib/knowledge.generated.ts`
 *
 * 서버 함수는 `src/data`를 직접 import할 수 없다 — `@/` 별칭과 `.webp` import가
 * 번들러 밖에서는 풀리지 않는다. 그래서 Bun으로 한 번 읽어(둘 다 Bun이 처리한다)
 * 이미지 경로를 걷어낸 순수 텍스트를 TS 파일로 뽑아 커밋한다.
 *
 * 콘텐츠를 고쳤다면 반드시 다시 실행: `bun run knowledge`
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { experiences } from "../src/data/experience";
import { profile } from "../src/data/profile";
import { projects } from "../src/data/projects";
import { skillGroups } from "../src/data/skills";
import { socials } from "../src/data/socials";

import type { Knowledge, KnowledgeProject, KnowledgeProjectDetail } from "../api/_lib/types";

const { avatar: _avatar, ...knowledgeProfile } = profile;

const knowledgeProjects: KnowledgeProject[] = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    year: project.year,
    role: project.role,
    period: project.period,
    platform: project.platform,
    tech: project.tech,
    variant: project.variant,
    links: project.links,
    context: project.context,
    approach: project.approach,
    screens: project.screens.map(({ name, note }) => ({ name, note })),
}));

const details: Record<string, KnowledgeProjectDetail> = {};
for (const project of projects) {
    const detail: KnowledgeProjectDetail = {
        cases: project.cases,
        sheets: project.sheets.map(({ title, note }) => ({ title, note })),
    };
    if (project.anatomy) {
        const { src: _src, ratio: _ratio, ...anatomy } = project.anatomy;
        detail.anatomy = anatomy;
    }
    if (project.runtime) detail.runtime = project.runtime;
    if (project.pipeline) detail.pipeline = project.pipeline;
    details[project.slug] = detail;
}

const knowledge: Knowledge = {
    profile: knowledgeProfile,
    experiences,
    skills: skillGroups,
    socials,
    projects: knowledgeProjects,
    details,
};

const banner = `/**
 * 자동 생성 파일 — 직접 고치지 마세요.
 * 원본은 \`src/data/*.ts\`이고, \`bun run knowledge\`로 다시 만듭니다.
 */
import type { Knowledge } from "./types.js";

export const knowledge: Knowledge = `;

const out = fileURLToPath(new URL("../api/_lib/knowledge.generated.ts", import.meta.url));
writeFileSync(out, `${banner}${JSON.stringify(knowledge, null, 4)};\n`, "utf8");

const chars = JSON.stringify(knowledge).length;
console.log(
    `✓ api/_lib/knowledge.generated.ts — 프로젝트 ${knowledgeProjects.length}개, ${chars.toLocaleString()}자`,
);
