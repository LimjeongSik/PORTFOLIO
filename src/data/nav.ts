export interface NavItem {
    id: string;
    label: string;
}

export const navItems: NavItem[] = [
    { id: "projects", label: "프로젝트" },
    { id: "experience", label: "경력" },
    { id: "skills", label: "기술" },
    { id: "about", label: "소개" },
];
