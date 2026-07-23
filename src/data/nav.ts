export interface NavItem {
    id: string;
    label: string;
}

export const navItems: NavItem[] = [
    { id: "about", label: "소개" },
    { id: "skills", label: "기술" },
    { id: "experience", label: "경력" },
    { id: "projects", label: "프로젝트" },
];
