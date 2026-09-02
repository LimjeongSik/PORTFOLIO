import { defineToolkit } from "@assistant-ui/react";
import { z } from "zod";

import {
    ActionNote,
    ContactNote,
    ExperienceCard,
    ProfileCard,
    ProjectCards,
    SkillCard,
} from "@/components/assistant/ToolCards";

import { navItems } from "@/data/nav";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { assistantNavigate, isHomePath } from "@/lib/assistant/bridge";
import { scrollToSection, scrollToTop } from "@/lib/scroll";

const sectionIds = navItems.map((item) => item.id);
const sectionLabels = new Map(navItems.map((item) => [item.id, item.label]));
const projectSlugs = projects.map((project) => project.slug) as [string, ...string[]];
const projectTitles = new Map(projects.map((project) => [project.slug, project.title]));

/**
 * 모델이 브라우저에서 실행시키는 툴들.
 *
 * `AssistantChatTransport`가 이 스키마를 요청 본문에 실어 보내고, 서버는 `frontendTools()`로
 * 모델에 알리기만 한다 — 실제 실행은 전부 여기, 사용자의 화면에서 일어난다.
 */
export const assistantToolkit = defineToolkit({
    scroll_to_section: {
        type: "frontend",
        description:
            "홈의 특정 섹션으로 화면을 스크롤한다. 방문자가 어떤 영역을 궁금해할 때 답과 함께 부른다. " +
            "top은 맨 위(첫 화면)를 뜻한다.",
        parameters: z.object({
            section: z.enum(["top", ...sectionIds] as [string, ...string[]]),
        }),
        execute: ({ section }) => {
            if (!isHomePath()) {
                assistantNavigate(section === "top" ? "/" : `/#${section}`);
                return { moved: section, note: "홈으로 이동한 뒤 해당 섹션으로 스크롤했습니다." };
            }
            if (section === "top") {
                scrollToTop();
                return { moved: "top" };
            }
            const found = scrollToSection(section);
            return found ? { moved: section } : { error: "그 섹션을 찾지 못했습니다." };
        },
        render: ({ args }) => (
            <ActionNote>
                {args.section === "top"
                    ? "맨 위로"
                    : `${sectionLabels.get(args.section) ?? args.section} 섹션으로`}{" "}
                이동했습니다
            </ActionNote>
        ),
    },

    open_project: {
        type: "frontend",
        description: "프로젝트 상세 페이지를 연다. 한 프로젝트를 깊이 보고 싶어 할 때 부른다.",
        parameters: z.object({
            slug: z.enum(projectSlugs).describe("프로젝트 slug"),
        }),
        execute: ({ slug }) => {
            assistantNavigate(`/projects/${slug}`);
            return { opened: slug };
        },
        render: ({ args }) => (
            <ActionNote>{projectTitles.get(args.slug) ?? args.slug} 상세를 열었습니다</ActionNote>
        ),
    },

    show_projects: {
        type: "frontend",
        description:
            "프로젝트를 카드로 보여준다. 여러 개를 소개하거나 어떤 걸 했는지 물을 때 부른다. " +
            "카드가 제목과 기술을 이미 보여주므로, 같은 내용을 문장으로 또 나열하지 않는다.",
        parameters: z.object({
            slugs: z
                .array(z.enum(projectSlugs))
                .min(1)
                .max(4)
                .describe("보여줄 프로젝트 slug 목록"),
        }),
        execute: ({ slugs }) => ({ shown: slugs }),
        render: ({ args }) => <ProjectCards slugs={args.slugs ?? []} />,
    },

    show_skills: {
        type: "frontend",
        description: "기술 스택 전체를 그룹별 카드로 보여준다.",
        parameters: z.object({}),
        execute: () => ({ shown: "skills" }),
        render: () => <SkillCard />,
    },

    show_experience: {
        type: "frontend",
        description: "경력을 시간순 카드로 보여준다.",
        parameters: z.object({}),
        execute: () => ({ shown: "experience" }),
        render: () => <ExperienceCard />,
    },

    show_profile: {
        type: "frontend",
        description: "프로필과 연락처를 카드로 보여준다.",
        parameters: z.object({}),
        execute: () => ({ shown: "profile" }),
        render: () => <ProfileCard />,
    },

    show_contact: {
        type: "frontend",
        description:
            "이메일이나 전화번호를 복사 버튼과 함께 보여준다. 연락처를 물으면 부른다. " +
            "카드에 값이 이미 있으니 답변에서 주소를 다시 적을 필요는 없다.",
        parameters: z.object({
            field: z.enum(["email", "phone"]),
        }),
        execute: ({ field }) => ({
            field,
            value: field === "email" ? profile.email : profile.phone,
        }),
        render: ({ args }) => (
            <ContactNote
                label={args.field === "phone" ? "phone" : "email"}
                value={args.field === "phone" ? profile.phone : profile.email}
            />
        ),
    },
});
