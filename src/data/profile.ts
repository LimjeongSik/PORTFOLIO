// 원본 profile.png(1122x1440, 1.6MB)는 백업으로만 두고, 표시 크기에 맞춰
// 줄인 webp를 쓴다. 재생성: `python3 scripts/optimize-images.py`
import ProfileImage from "@/assets/profile.webp";

import type { Profile } from "@/types/content";

export const profile: Profile = {
    name: "임정식",
    role: "프론트엔드 개발자",
    tagline: "완성에 머무르지 않고, 더 나은 방법을 끝까지 탐구합니다.",
    current:
        "지금은 센티언트 시스템즈에서 행사 현장용 React Native 앱 SafeOps를 설계부터 출시 · 운영까지 맡고 있습니다.",
    intro: [
        "6년 동안 React와 React Native로 웹과 앱을 만들어 왔습니다. 웹 퍼블리셔로 시작해 React 웹, React Native 앱, 필요하면 Kotlin 네이티브 모듈까지 맡는 범위를 넓혔고, 두 회사에서 프론트엔드 팀 리드로 공통 구조와 코드 리뷰를 맡았습니다.",
        "화면을 그리는 것보다 운영하면서 생기는 문제에 오래 붙어 있는 편입니다. 백그라운드 위치 전송, 무음을 뚫는 알림, 토큰 갱신, WebView 연동처럼 OS와 서버가 얽힌 곳이요. 고친 뒤에는 실기기에서 상태별로 다시 확인하고, 잴 수 있는 건 재서 비교합니다.",
    ],
    phone: "010.9194.0167",
    email: "limjeongsik95@gmail.com",
    birth: "1995. 07. 25",
    location: "Seoul, KR",
    avatar: ProfileImage,
};
