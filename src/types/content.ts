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
    name: string;
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

export interface ProjectCase {
    label: string;
    problem: string;
    approach: string;
    result: string;
    metrics?: ProjectMetric[];
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
    sheets: ProjectSheet[];
    links: ProjectLinks;
}

export interface SocialLink {
    label: string;
    handle: string;
    href: string;
}
