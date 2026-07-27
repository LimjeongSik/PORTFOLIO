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

export interface Project {
    slug: string;
    title: string;
    summary: string;
    year: string;
    role: string;
    period: string;
    tech: string[];
    thumbnail: string;
    cover: string;
    problem: string;
    solution: string;
    highlights: string[];
    gallery: string[];
    links: ProjectLinks;
}

export interface SocialLink {
    label: string;
    handle: string;
    href: string;
}
