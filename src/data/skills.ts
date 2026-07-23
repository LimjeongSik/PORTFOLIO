import type { SkillGroup } from "@/types/content";

export const skillGroups: SkillGroup[] = [
    {
        label: "Core",
        items: ["React", "TypeScript", "JavaScript (ES2023)", "HTML", "CSS"],
    },
    {
        label: "Styling",
        items: ["Tailwind CSS", "styled-components", "SCSS", "Design Tokens"],
    },
    {
        label: "Motion",
        items: ["GSAP", "Motion", "ScrollTrigger", "Lenis"],
    },
    {
        label: "Tooling",
        items: ["Vite", "Bun", "Biome", "Storybook", "Vitest"],
    },
    {
        label: "Workflow",
        items: ["Git", "Figma", "CI/CD", "Web Accessibility"],
    },
];
