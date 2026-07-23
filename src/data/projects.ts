import hero from "@/assets/hero.png";

import type { Project } from "@/types/content";

export const projects: Project[] = [
    {
        slug: "atlas-analytics",
        title: "Atlas Analytics",
        summary: "실시간 데이터를 한눈에 읽히는 대시보드로 재해석한 분석 플랫폼.",
        year: "2024",
        role: "프론트엔드 리드",
        period: "2024.02 — 2024.09",
        tech: ["React", "TypeScript", "TanStack Query", "D3", "Tailwind CSS"],
        thumbnail: hero,
        cover: hero,
        problem:
            "수십 개의 지표가 흩어져 있어 사용자가 원하는 인사이트에 도달하기까지 클릭이 지나치게 많았습니다.",
        solution:
            "지표 간 관계를 우선순위로 재구성하고, 사용자 맞춤 위젯 레이아웃과 실시간 스트리밍 차트를 도입해 탐색 경로를 단축했습니다.",
        highlights: [
            "위젯 드래그 앤 드롭 커스터마이징으로 개인화된 대시보드 구성",
            "가상 스크롤과 메모이제이션으로 1만 행 테이블 60fps 유지",
            "차트 인터랙션 전반에 부드러운 트랜지션 적용",
        ],
        gallery: [hero, hero, hero],
        links: { demo: "https://example.com", repo: "https://github.com" },
    },
    {
        slug: "muse-commerce",
        title: "Muse Commerce",
        summary: "브랜드의 결을 살린 몰입형 커머스 경험을 위한 스토어프론트.",
        year: "2023",
        role: "프론트엔드 개발",
        period: "2023.05 — 2023.11",
        tech: ["Next.js", "React", "GSAP", "styled-components"],
        thumbnail: hero,
        cover: hero,
        problem:
            "일반적인 커머스 템플릿으로는 브랜드가 전하려는 감성과 몰입감을 담아내기 어려웠습니다.",
        solution:
            "스크롤 기반 스토리텔링과 제품 상세의 인터랙션을 설계해, 쇼핑 과정 자체가 브랜드 경험이 되도록 구성했습니다.",
        highlights: [
            "스크롤 연동 제품 쇼케이스로 체류시간 2배 향상",
            "장바구니·결제 플로우 재설계로 이탈률 18% 감소",
            "이미지 지연 로딩과 프리페치로 체감 속도 개선",
        ],
        gallery: [hero, hero, hero],
        links: { demo: "https://example.com" },
    },
    {
        slug: "cadence-planner",
        title: "Cadence Planner",
        summary: "팀의 리듬을 시각화하는 협업 일정 관리 도구.",
        year: "2023",
        role: "프론트엔드 개발",
        period: "2022.11 — 2023.04",
        tech: ["React", "TypeScript", "Zustand", "Motion"],
        thumbnail: hero,
        cover: hero,
        problem: "여러 팀의 일정이 겹치면서 우선순위와 병목을 파악하기 어려웠습니다.",
        solution:
            "타임라인 뷰와 드래그 인터랙션으로 일정을 직관적으로 조정하고, 충돌을 즉시 시각적으로 알리도록 했습니다.",
        highlights: [
            "드래그 리사이즈 기반 타임라인 편집 인터랙션 구현",
            "낙관적 업데이트로 지연 없는 편집 경험 제공",
            "키보드 내비게이션 완전 지원으로 접근성 강화",
        ],
        gallery: [hero, hero, hero],
        links: { repo: "https://github.com" },
    },
    {
        slug: "prism-docs",
        title: "Prism Docs",
        summary: "개발자를 위한 인터랙티브 문서 플랫폼.",
        year: "2022",
        role: "프론트엔드 개발",
        period: "2022.03 — 2022.09",
        tech: ["React", "MDX", "Vite", "Tailwind CSS"],
        thumbnail: hero,
        cover: hero,
        problem: "정적인 문서로는 API 사용법을 직접 실험해보기 어려워 학습 곡선이 가팔랐습니다.",
        solution:
            "문서 안에서 코드를 즉시 실행하고 결과를 확인할 수 있는 라이브 플레이그라운드를 통합했습니다.",
        highlights: [
            "인라인 코드 에디터와 실시간 프리뷰 연동",
            "전문 검색과 키보드 단축키로 탐색 효율 향상",
            "다크/라이트 테마와 반응형 레이아웃 지원",
        ],
        gallery: [hero, hero, hero],
        links: { demo: "https://example.com", repo: "https://github.com" },
    },
];

export function getProjectBySlug(slug: string | undefined): Project | undefined {
    return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug: string): {
    prev: Project | null;
    next: Project | null;
} {
    const index = projects.findIndex((project) => project.slug === slug);
    if (index === -1) {
        return { prev: null, next: null };
    }
    return {
        prev: index > 0 ? projects[index - 1] : null,
        next: index < projects.length - 1 ? projects[index + 1] : null,
    };
}
