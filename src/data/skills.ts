import type { SkillGroup } from "@/types/content";

export const skillGroups: SkillGroup[] = [
    {
        label: "Frontend",
        items: ["React", "Next.js", "TypeScript", "JavaScript"],
    },
    {
        label: "Mobile",
        items: ["React Native", "Expo", "React Native CLI", "React Navigation", "WebView"],
    },
    {
        label: "State & Data",
        items: ["TanStack Query", "Zustand", "Axios", "Context API", "Fetch API"],
    },
    {
        label: "Styling",
        items: ["Tailwind CSS", "styled-components", "CSS Modules"],
    },
    {
        label: "Motion",
        items: ["GSAP", "Motion", "ScrollTrigger", "Lenis"],
    },
    {
        label: "Tooling & Testing",
        items: ["Vite", "Bun", "Biome", "Vitest"],
    },
    {
        label: "Workflow",
        items: ["GitHub", "Figma"],
    },
];
