import type { Experience } from "@/types/content";

export const experiences: Experience[] = [
    {
        company: "센티언트 시스템즈 (Sentient Systems)",
        position: "플랫폼 엔지니어",
        period: "2026.07 — 현재",
        summary:
            "플랫폼 엔지니어링 팀에서 일하고 있습니다. 행사 현장의 경비 요원과 관제실을 잇는 근무 앱 SafeOps를 설계부터 구현까지 맡아 양대 스토어에 출시했고, 지금은 1.0.2 버전을 운영하고 있습니다.",
        achievements: [
            "요원이 화면을 보지 않아도 10초마다 관제실로 좌표를 보내는 백그라운드 위치 전송 설계",
            "무음 · 방해 금지 모드에서도 울리는 긴급 알림 채널을 Kotlin Expo 모듈로 직접 구현하고 Android · iOS 실기기에서 검증",
            "라이트 · 다크 테마를 OTA로 배포하고, 대비 기준 위반과 회귀를 테스트 1,006개로 방지",
            "팀 코드 리뷰와 CodeRabbit 자동 리뷰를 모두 통과해야 커밋할 수 있는 흐름을 프론트엔드 팀에 도입",
            "리팩터링을 탐색 · 판단 · 실행 세 단계로 나눠, 탐색과 판단은 읽기 전용 AI 에이전트에 맡기고 파일 수정 권한은 실행 단계에만 둔 파이프라인 운영",
        ],
        stack: [
            "React Native",
            "Expo",
            "TypeScript",
            "TanStack Query",
            "Expo Modules (Kotlin)",
            "FCM · Notifee",
        ],
    },
    {
        company: "준진소프트 주식회사 및 외주 프로젝트",
        position: "프론트엔드 개발 팀 리드",
        period: "2025.04 — 2026.07",
        summary:
            "준진소프트 개발 팀에서 앱을 개발하며 프론트엔드 아키텍처를 설계하고 팀의 기술 방향을 이끌었습니다.",
        achievements: [
            "웹 · 앱 개발에 함께 쓰는 공용 인스턴스 설계 · 구현",
            "코드 리뷰와 멘토링으로 팀의 기술 역량 향상에 기여",
        ],
        stack: ["React", "React Native", "TypeScript", "Vite", "Axios", "TanStack Query"],
    },
    {
        company: "바움루트미 주식회사",
        position: "프론트엔드 개발 팀 리드",
        period: "2024.04 — 2025.04",
        summary:
            "바움루트미 개발 팀 리드로 프론트엔드 아키텍처를 설계하고 팀의 기술 방향을 이끌었습니다.",
        achievements: [
            "웹 · 앱 개발에 함께 쓰는 공용 인스턴스 설계 · 구현",
            "공용 컴포넌트를 설계 · 도입해 신규 화면 개발 기간을 30% 단축",
            "개발 스터디를 운영하며 팀의 기술 역량 향상에 기여",
        ],
        stack: [
            "React",
            "Next.js",
            "Recoil",
            "Axios",
            "Zustand",
            "styled-components",
            "TanStack Query",
        ],
    },
    {
        company: "프리랜서 외주 프로젝트",
        position: "프리랜서 프론트엔드 개발자",
        period: "2022.08 — 2024.03",
        summary: "여러 외주 프로젝트에 프론트엔드 개발자로 참여해 웹 애플리케이션을 개발했습니다.",
        achievements: [
            "클라이언트 요구사항에 맞춰 UI/UX를 구현하고 최적화해 프로젝트 완료",
            "프로젝트마다 요구사항에 맞는 기술 스택을 골라 구현",
        ],
        stack: ["React", "Next.js", "React Native", "TypeScript", "Axios", "styled-components"],
    },
    {
        company: "주식회사 피씨유스토어",
        position: "주니어 프론트엔드 개발자",
        period: "2022.03 — 2022.07",
        summary:
            "피씨유스토어 개발 팀에서 프론트엔드 개발자로 근무하며 회사 홈페이지를 만들고 쇼핑몰을 유지보수했습니다.",
        achievements: [
            "쇼핑몰 UI를 개선해 사용자 경험 향상",
            "웹 접근성을 개선해 WCAG AA 기준 충족",
            "반응형 웹 디자인을 적용해 다양한 기기에 맞는 화면 제공",
        ],
        stack: ["JavaScript", "jQuery", "CSS", "HTML"],
    },
    {
        company: "모과플레이 주식회사 및 외주 프로젝트",
        position: "웹 퍼블리셔",
        period: "2020.10 — 2022.02",
        summary:
            "모과플레이 개발 팀에서 웹 퍼블리셔로 근무하며 다양한 웹 프로젝트를 제작하고 유지보수했습니다.",
        achievements: [
            "웹 접근성을 개선해 WCAG AA 기준 충족",
            "웹 표준을 지켜 크로스 브라우징 문제 해결",
            "여러 외주 프로젝트의 UI/UX 개선과 유지보수",
            "애니메이션과 인터랙션을 구현해 사용자 경험 향상",
        ],
        stack: ["JavaScript", "jQuery", "CSS", "HTML"],
    },
];
