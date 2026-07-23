import hero from "@/assets/hero.png";

import type { Profile } from "@/types/content";

export const profile: Profile = {
    name: "홍길동",
    role: "프론트엔드 개발자",
    tagline: "보이는 것과 느껴지는 것 사이를 설계합니다.",
    intro: [
        "사용자가 화면을 마주하는 짧은 순간에 신뢰가 만들어진다고 믿습니다. 그 순간을 위해 인터페이스의 구조와 움직임을 함께 고민합니다.",
        "React와 TypeScript를 중심으로 5년간 웹 프로덕트를 만들어 왔고, 디자인 시스템 구축부터 성능 최적화, 인터랙션 구현까지 폭넓게 다룹니다.",
    ],
    email: "hong.gildong@example.com",
    birth: "1995. 08. 14",
    location: "Seoul, KR",
    avatar: hero,
};
