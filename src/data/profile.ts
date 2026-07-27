// 원본 profile.png(1122x1440, 1.6MB)는 백업으로만 두고, 표시 크기에 맞춰
// 줄인 webp를 쓴다. 재생성: `python3 scripts/optimize-images.py`
import ProfileImage from "@/assets/profile.webp";

import type { Profile } from "@/types/content";

export const profile: Profile = {
    name: "임정식",
    role: "프론트엔드 개발자",
    tagline: "완성에 머무르지 않고, 더 나은 방법을 끝까지 탐구합니다.",
    intro: [
        "하나의 작업을 마친 뒤에도 더 나은 방법이 없는지 다시 살펴보는 편입니다. 여러 방식을 직접 시도하고 결과를 비교하며, 작은 차이라도 더 나은 완성도로 이어질 수 있도록 꾸준히 개선합니다.",
        "새로운 기술을 배우고 낯선 영역에 도전하는 과정에서 즐거움을 느낍니다. 웹 개발 경험에 머무르지 않고 앱 개발을 공부해 실제 프로젝트를 만드는 등, 관심이 생긴 기술을 배움에서 끝내지 않고 직접 구현하며 제 것으로 만들어갑니다.",
    ],
    phone: "010.9194.0167",
    email: "limjeongsik95@gmail.com",
    birth: "1995. 07. 25",
    location: "Seoul, KR",
    avatar: ProfileImage,
};
