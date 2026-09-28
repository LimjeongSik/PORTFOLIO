import type { Experience } from "@/types/content";

export const experiences: Experience[] = [
    {
        company: "센티언트 시스템즈 (Sentient Systems)",
        position: "플랫폼 엔지니어 · React Native 앱 개발",
        period: "2026.07 — 현재",
        summary:
            "플랫폼 엔지니어링 팀에서 일하고 있습니다. 행사 현장의 경비 요원과 관제실을 잇는 근무 앱 SafeOps를 설계부터 구현까지 맡아 양대 스토어에 출시했고, 지금은 1.0.2 버전을 운영하고 있습니다. 관제실이 쓰는 백오피스도 함께 개발하고 있습니다.",
        achievements: [
            "앱 1명 · 백엔드 1명 팀에서 SafeOps 앱 전체(설계 · 개발 · 양대 스토어 출시 · OTA 운영)를 맡음",
            "요원이 화면을 보지 않아도 근무 중 10초 주기로 관제실에 좌표를 보내는 백그라운드 위치 전송 설계",
            "무음 · 방해 금지에서도 울리는 긴급 알림 구현. Android는 알람 스트림 채널을 Kotlin Expo 모듈로 직접 만들고, iOS는 Critical Alert를 써서 양쪽 실기기에서 확인",
            "라이트 · 다크 테마를 OTA로 배포하고 글자 대비 기준을 두 테마 모두 테스트로 검사(앱 전체 테스트 1,050개 · 88 suites)",
            "관제 백오피스(React 19 · Vite · TanStack Router · Tailwind v4)를 동료와 함께 개발. 전광판(DS) 화면과 편성 페이지, 요원 위치 · 이동 경로 지도(증분 폴링)를 맡음",
            "백오피스에 Vitest 테스트 환경을 세우고 테스트 225개 파일을 추가",
            "AI 에이전트가 리뷰를 돕는 흐름을 운영. 코드가 고쳐지면 Codex 리뷰를 거친 뒤에야 커밋되는 리뷰 게이트(Claude Code 훅)를 직접 만들고, MCP로 붙인 도구가 리뷰를 돕게 함",
            "리팩터링을 탐색 · 판단 · 실행 세 단계로 나눠, 탐색과 판단은 읽기 전용 AI 에이전트에 맡기고 파일 수정 권한은 실행 단계에만 둔 파이프라인 운영",
        ],
        stack: [
            "React Native",
            "Expo",
            "TypeScript",
            "TanStack Query",
            "Expo Modules (Kotlin)",
            "FCM · Notifee",
            "React",
            "Vitest",
        ],
    },
    {
        company: "준진소프트 주식회사 및 외주 프로젝트",
        position: "프론트엔드 개발 팀 리드",
        period: "2025.04 — 2026.07",
        summary:
            "개발 3 · 디자인 1명 팀의 프론트엔드 리드로, 침례교 전용앱(React Native · Expo bare)을 동료 1명과 개발하며 앱 구조와 코드 리뷰 기준을 맡았습니다. 웹 리드에서 앱까지 맡는 범위를 넓힌 시기입니다.",
        achievements: [
            "아이머그 · 아이머그-바이블 · 침례교 · Plus SMS 등에서 쓰는 공용 API 인스턴스 구조를 설계하고, 프로젝트마다 필요한 기능을 더해 가며 다듬음",
            "코드 리뷰와 멘토링으로 팀의 코드 작성 기준을 맞춤",
        ],
        stack: ["React", "React Native", "TypeScript", "Vite", "Axios", "TanStack Query"],
    },
    {
        company: "바움루트미 주식회사",
        position: "프론트엔드 개발 팀 리드",
        period: "2024.04 — 2025.04",
        summary:
            "아이머그(React 웹 · 앱 WebView)의 개발 리드로 프론트엔드 초기 구조를 세웠습니다. 팀은 개발 3 · 디자인 1 · 백엔드 1명이었습니다.",
        achievements: [
            "웹 · 앱 공용 API 인스턴스의 설계 방향을 잡고 팀원의 구현을 리뷰",
            "영상 목록 · 스와이프 · 탭을 합성 컴포넌트로 만들어 화면마다 반복하던 구현을 줄임",
            "팀원 코드 리뷰(필요한 곳은 직접 수정)와 주말 줌 개발 스터디 운영",
        ],
        stack: ["React", "Vite", "TypeScript", "Zustand", "TanStack Query", "styled-components"],
    },
    {
        company: "프리랜서 외주 프로젝트",
        position: "프리랜서 프론트엔드 개발자",
        period: "2022.08 — 2024.03",
        summary: "React · Next.js · React Native로 웹과 앱 외주 프로젝트를 개발했습니다.",
        achievements: [],
        stack: ["React", "Next.js", "React Native", "TypeScript", "Recoil", "styled-components"],
    },
    {
        company: "주식회사 피씨유스토어",
        position: "주니어 프론트엔드 개발자",
        period: "2022.03 — 2022.07",
        summary: "회사 홈페이지를 만들고 쇼핑몰을 유지보수했습니다(반응형 · 웹 접근성).",
        achievements: [],
        stack: ["JavaScript", "jQuery", "CSS", "HTML"],
    },
    {
        company: "모과플레이 주식회사 및 외주 프로젝트",
        position: "웹 퍼블리셔",
        period: "2020.10 — 2022.02",
        summary:
            "웹 퍼블리셔로 일을 시작해 회사 홈페이지 개발과 아이머그 웹/앱 리뉴얼을 맡았습니다.",
        achievements: [],
        stack: ["JavaScript", "jQuery", "CSS", "HTML"],
    },
];
