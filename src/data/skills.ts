import type { SkillGroup } from "@/types/content";

export const skillGroups: SkillGroup[] = [
    {
        label: "Frontend",
        items: ["React", "TypeScript", "Next.js", "Vite"],
    },
    {
        label: "Mobile",
        items: [
            "React Native",
            "Expo (managed · bare)",
            "Expo Modules (Kotlin)",
            "React Navigation",
        ],
    },
    {
        label: "Push",
        items: ["FCM", "Notifee"],
    },
    {
        label: "Data",
        items: ["TanStack Query", "Zustand"],
    },
    {
        label: "Styling",
        items: ["styled-components", "Tailwind CSS"],
    },
    {
        label: "Test · Delivery",
        items: ["Jest", "Vitest", "EAS Update", "Jenkins"],
    },
];
