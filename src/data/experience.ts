import type { Experience } from "@/types/content";

export const experiences: Experience[] = [
    {
        company: "루미넌트 랩스",
        position: "시니어 프론트엔드 엔지니어",
        period: "2023.03 — 현재",
        summary: "B2B SaaS 대시보드의 프론트엔드 아키텍처를 총괄하고 디자인 시스템을 구축했습니다.",
        achievements: [
            "공용 컴포넌트 라이브러리를 도입해 신규 화면 개발 리드타임을 40% 단축",
            "코드 스플리팅과 렌더링 최적화로 초기 로딩 시간을 2.4초에서 0.9초로 개선",
            "주니어 3인의 코드 리뷰와 온보딩을 담당하며 팀 프론트엔드 컨벤션 정립",
        ],
        stack: ["React", "TypeScript", "Vite", "TanStack Query", "Storybook"],
    },
    {
        company: "노바 커머스",
        position: "프론트엔드 개발자",
        period: "2021.01 — 2023.02",
        summary: "커머스 웹앱의 사용자 여정 전반을 개발하며 전환율 개선 실험을 주도했습니다.",
        achievements: [
            "결제 플로우를 재설계해 이탈률을 18% 감소시키고 결제 완료율 개선",
            "A/B 테스트 인프라를 구축해 실험 기반 UI 의사결정 체계 도입",
            "웹 접근성 진단을 반영해 WCAG AA 기준 주요 페이지 100% 충족",
        ],
        stack: ["React", "Next.js", "Redux", "styled-components"],
    },
    {
        company: "스튜디오 페이즈",
        position: "웹 퍼블리셔 / 주니어 개발자",
        period: "2019.06 — 2020.12",
        summary: "브랜드 캠페인 사이트와 인터랙티브 랜딩 페이지를 다수 제작했습니다.",
        achievements: [
            "스크롤 기반 인터랙션 랜딩을 제작해 캠페인 체류시간 2배 달성",
            "반응형 마크업 가이드를 정리해 퍼블리싱 산출물 품질 표준화",
        ],
        stack: ["JavaScript", "GSAP", "SCSS", "HTML"],
    },
];
