/**
 * 자동 생성 파일 — 직접 고치지 마세요.
 * 원본은 `src/data/*.ts`이고, `bun run knowledge`로 다시 만듭니다.
 */
import type { Knowledge } from "./types.js";

export const knowledge: Knowledge = {
    profile: {
        name: "임정식",
        role: "프론트엔드 개발자",
        tagline: "완성에 머무르지 않고, 더 나은 방법을 끝까지 탐구합니다.",
        current:
            "지금은 센티언트 시스템즈에서 행사 현장용 React Native 앱 SafeOps를 설계부터 출시 · 운영까지 맡고 있습니다.",
        intro: [
            "하나의 작업을 마친 뒤에도 더 나은 방법이 없는지 다시 살펴보는 편입니다. 여러 방식을 직접 시도해 결과를 비교하고, 작은 차이라도 완성도가 올라간다면 꾸준히 고쳐 나갑니다.",
            "새로운 기술을 배우고 낯선 영역에 도전하는 걸 즐깁니다. 웹 개발에서 멈추지 않고 앱 개발을 공부해 실제 프로젝트까지 냈습니다. 관심이 생긴 기술은 배우는 데서 그치지 않고 직접 구현해 보며 제 것으로 만듭니다.",
        ],
        phone: "010.9194.0167",
        email: "limjeongsik95@gmail.com",
        birth: "1995. 07. 25",
        location: "Seoul, KR",
    },
    experiences: [
        {
            company: "센티언트 시스템즈 (Sentient Systems)",
            position: "플랫폼 엔지니어 · React Native 앱 개발",
            period: "2026.07 — 현재",
            summary:
                "플랫폼 엔지니어링 팀에서 일하고 있습니다. 행사 현장의 경비 요원과 관제실을 잇는 근무 앱 SafeOps를 설계부터 구현까지 맡아 양대 스토어에 출시했고, 지금은 1.0.2 버전을 운영하고 있습니다.",
            achievements: [
                "요원이 화면을 보지 않아도 10초마다 관제실로 좌표를 보내는 백그라운드 위치 전송 설계",
                "무음 · 방해 금지 모드에서도 울리는 긴급 알림 채널을 Kotlin Expo 모듈로 직접 구현하고 Android · iOS 실기기에서 검증",
                "라이트 · 다크 테마를 OTA로 배포하고, 대비 기준 위반과 회귀를 테스트 1,050개로 방지",
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
                "웹 · 앱 공용 API 인스턴스의 설계 방향을 잡고 팀원의 구현을 리뷰",
                "영상 목록 · 스와이프 · 탭을 합성 컴포넌트로 만들어 화면마다 반복하던 구현을 줄임",
                "팀원 코드 리뷰(필요한 곳은 직접 수정)와 주말 줌 개발 스터디 운영",
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
            summary:
                "여러 외주 프로젝트에 프론트엔드 개발자로 참여해 웹 애플리케이션을 개발했습니다.",
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
    ],
    activities: [
        {
            period: "2025",
            title: "우아콘 2025 (WOOWACON)",
            host: "우아한형제들 기술 컨퍼런스",
            note: "AI를 활용한 개발 흐름과 팀 커뮤니케이션, 디자인 시스템을 다룬 세션을 들었습니다.",
            takeaways: [
                "코드 리뷰를 사람과 도구 두 겹으로 두는 방식. 돌아와서 프론트엔드 팀에 그대로 도입했다. 팀이 먼저 보고, GitHub에서 CodeRabbit이 한 번 더 본 뒤에야 커밋할 수 있다",
                "테스터가 오류를 만나면 그때의 화면과 상태를 캡처해 Jira 티켓에 붙인다. 발견한 사람과 고칠 사람이 같은 화면을 보고 시작하니, 어느 화면의 어떤 오류인지 말로 설명하다 정보가 빠지는 일이 없다",
                "디자인 시스템은 컴포넌트를 잘게 쪼갤수록 좋아지는 게 아니라는 것. 너무 나누면 쓰는 쪽이 매번 조립해야 해서, 쓰임에 맞게 조금 바꿔 쓸 여지를 남긴 컴포넌트가 오래간다",
            ],
        },
    ],
    skills: [
        {
            label: "Frontend",
            items: ["React", "Next.js", "TypeScript", "JavaScript"],
        },
        {
            label: "Mobile",
            items: ["React Native", "Expo", "React Native CLI", "React Navigation", "WebView"],
        },
        {
            label: "State & Data",
            items: ["TanStack Query", "Zustand", "Axios", "Context API", "Fetch API"],
        },
        {
            label: "Styling",
            items: ["Tailwind CSS", "styled-components", "CSS Modules"],
        },
        {
            label: "Motion",
            items: ["GSAP", "Motion", "ScrollTrigger", "Lenis"],
        },
        {
            label: "Tooling & Testing",
            items: ["Vite", "Bun", "Biome", "Jest", "Vitest"],
        },
        {
            label: "Workflow",
            items: ["GitHub", "Figma"],
        },
    ],
    socials: [
        {
            label: "GitHub",
            handle: "@username",
            href: "https://github.com",
        },
        {
            label: "LinkedIn",
            handle: "in/username",
            href: "https://linkedin.com",
        },
        {
            label: "Blog",
            handle: "username.dev",
            href: "https://example.com",
        },
    ],
    projects: [
        {
            slug: "safeops",
            title: "SafeOps",
            summary:
                "행사 현장의 경비 요원과 관제실을 잇는 근무 앱. 요원이 화면을 보고 있지 않아도 좌표가 알아서 올라가고, 지시는 벨소리를 꺼 둔 상태에서도 OS 알림으로 울립니다. 센티언트 시스템즈 플랫폼 엔지니어링 팀에서 React Native로 설계부터 구현까지 맡았고, 양대 스토어에 출시해 지금은 1.0.2 버전입니다.",
            year: "2026",
            role: "앱 개발 1인 (설계 · 구현) · 백엔드 1명과 협업",
            period: "2026.07 — 현재",
            platform: "mobile",
            tech: [
                "React Native",
                "Expo",
                "TypeScript",
                "TanStack Query",
                "React Navigation",
                "FCM · Notifee",
                "Expo Modules (Kotlin)",
                "네이버 지도 SDK",
                "EAS Update",
            ],
            links: {},
            context: [
                "경비 요원은 근무 내내 무전기를 들고 걷습니다. 앱은 주머니 안에 있고 화면은 거의 보지 않습니다. 그래서 이 앱은 보통 앱과 전제가 반대입니다. 사용자가 열어야 도는 게 아니라, 열지 않아도 돌아야 합니다.",
                "계정도 요원이 만들지 않습니다. 관제실이 발급하고 근무가 끝나면 닫습니다. 회원가입도 비밀번호 재설정도 없는 대신 앱이 스스로 판단할 게 늘었습니다. 근무가 아직 열려 있는지, 좌표가 실제로 관제실에 들어가고 있는지, 지금 화면에 뜬 상태가 진짜인지.",
                "화면도 한 벌이 아닙니다. 한낮의 야외와 해가 진 뒤는 조명이 전혀 다르고, 야간 근무가 절반이라 테마를 두 벌 만들었습니다. 다만 시스템 설정을 따라가지는 않습니다. 그걸 켜려면 네이티브를 다시 빌드해야 해서, 이미 배포된 빌드에는 영영 적용되지 않거든요. 설정에서 두 테마 중 하나를 고르는 방식은 JS만 바뀌어서 OTA로 배포할 수 있습니다.",
            ],
            approach: [
                "제일 경계한 건 “돌아가는 것처럼 보이는데 아무 일도 안 일어나는” 상태입니다. 그래서 화면은 보내는 중인지가 아니라 실제로 전달되고 있는지를 봅니다. 위치를 못 재서 좌표가 끊기면 화면이 먼저 그 사실을 알립니다.",
                "파생 상태는 한 곳에서만 계산합니다. 홈과 설정이 같은 배지를 각자 조립하다가 한쪽만 근무 종료를 모르는 일이 있었습니다. 조건을 화면마다 다시 짜면 언젠가 한쪽만 고치게 됩니다.",
                "실패를 삼키지 않습니다. 빈 catch 하나 때문에 안드로이드 포그라운드 알림이 통째로 사라진 걸 실기기에 올려 보고서야 알았습니다. 그 뒤로 알림 경로는 실패를 화면까지 올려 보내고, 좌표 경로의 에러는 릴리스 빌드 로그에도 남깁니다.",
                "긴급 여부처럼 서버와 앱이 함께 아는 판단은 서버 한 곳이 정합니다. 어떤 알림이 무음을 뚫고 울릴지는 앱이 알림 종류를 보고 추측하지 않고, 서버가 payload에 실어 보낸 채널과 사운드를 따릅니다.",
            ],
            screens: [
                {
                    name: "홈",
                    note: "근무 상태, 관제실 수신 시각, 마지막으로 보낸 좌표를 찍은 지도",
                },
                {
                    name: "알림함",
                    note: "공지 · 지시 · 대응 세 탭과 미확인 건수, 무한 스크롤",
                },
                {
                    name: "대응 상세",
                    note: "본문을 열면 곧바로 확인 처리되고, 승인 · 거절 버튼은 아래에 있다",
                },
                {
                    name: "거절 사유",
                    note: "사유 없이는 거절할 수 없다. 관제실이 판단할 근거가 있어야 해서",
                },
                {
                    name: "이동 안내",
                    note: "현장 특이사항을 적고, 관제실로 바로 전화한다",
                },
                {
                    name: "완료",
                    note: "수신부터 도착까지 걸린 시간과 남긴 특이사항",
                },
                {
                    name: "공지 상세",
                    note: "종류 배지 · 확인 상태 · 본문",
                },
                {
                    name: "현장 신고",
                    note: "탭을 열면 구역 시트가 바로 뜨고, 신고 유형은 여섯 가지",
                },
                {
                    name: "설정",
                    note: "관제실 전화, GPS 백그라운드 전송, 라이트 · 다크 테마 선택",
                },
                {
                    name: "긴급 알림",
                    note: "무음과 방해 금지를 뚫고 앱 위에 뜬 순간",
                },
            ],
        },
        {
            slug: "korea-baptist",
            title: "침례교(전용앱)",
            summary:
                "출석 · 헌금 · 주보 · 증명서를 앱 하나에 모은 교회 앱. Expo bare 워크플로우로 iOS · 안드로이드 네이티브 코드를 직접 관리하면서, 딥링크 출석부터 푸시 알림 · 결제 웹뷰까지 앱 쪽을 맡았습니다.",
            year: "2026",
            role: "앱 개발 2인 (설계 · 구현) · 2026.07부터 유지보수",
            period: "2025.04 — 현재",
            platform: "mobile",
            tech: [
                "React Native",
                "Expo (bare)",
                "TypeScript",
                "React Navigation",
                "TanStack Query",
                "Reanimated",
                "Firebase Messaging",
            ],
            links: {},
            context: [
                "교회 생활에 필요한 기능이 여기저기 흩어져 있었습니다. 앱 하나로 모으는 게 시작이었는데, 화면이 백 개를 넘어가면서 어려운 건 기능 구현보다 상태를 어디에 둘지가 됐습니다. 로그인 세션과 전역 모달, 서버 캐시가 서로 물려 있어서 한 곳을 잘못 두면 엉뚱한 화면에서 터집니다.",
                "게다가 Expo bare라 ios · android 폴더를 저장소에 그대로 들고 있습니다. prebuild 한 번이면 손으로 쌓아 온 네이티브 설정이 전부 날아가기 때문에, 플랫폼 정책이 바뀔 때마다 네이티브와 JS 양쪽을 같이 맞춰야 했습니다.",
            ],
            approach: [
                "상태는 성격별로 세 군데에만 뒀습니다. 서버에서 온 건 TanStack Query, 세션과 전역 모달은 Context 두 개, 나머지는 화면 안에서 끝냅니다. 어디를 봐야 하는지 헷갈리지 않아야 화면이 백 개여도 굴러갑니다.",
                "앱 밖에서 들어오는 입력은 반드시 한 곳을 거치게 합니다. NFC · QR 딥링크, 푸시 알림 탭, 결제 웹뷰 복귀 모두 언제 열지와 어디로 돌아갈지를 훅이 정합니다. 아무 데서나 화면을 열면 사용자가 돌아갈 자리를 잃습니다.",
                "플랫폼이 갈리는 자리는 경계를 하나만 둡니다. edge-to-edge처럼 네이티브와 JS가 같은 기준을 봐야 하는 건 상수 하나로 묶고, 한쪽만 고치면 어긋나는 지점은 문서에 남겼습니다.",
            ],
            screens: [
                {
                    name: "스플래시",
                    note: "앱 시작 · 폰트 로딩 게이트",
                },
                {
                    name: "로그인",
                    note: "생체 인증으로 자동 진입",
                },
                {
                    name: "홈",
                    note: "성도증 · 바로가기 · 헌금",
                },
                {
                    name: "성도증",
                    note: "회전 QR · 캡처 방지",
                },
                {
                    name: "출석체크",
                    note: "전역 모달 큐가 띄우는 바텀시트",
                },
                {
                    name: "교회주보",
                    note: "무한 스크롤 · 서버 정렬",
                },
                {
                    name: "커뮤니티",
                    note: "성도 게시판 피드",
                },
                {
                    name: "전체",
                    note: "교회 · 제휴 · 고객지원",
                },
            ],
        },
        {
            slug: "imug",
            title: "아이머그",
            summary:
                "보호자가 규칙을 정하고 아이가 그 안에서 영상을 보는 키즈 영상 앱. 웹이지만 앱의 WebView 안에서도 돌아서, 재생을 멈추라는 명령이 앱 쪽에서 내려옵니다. 모과플레이의 서비스이고, 사명만 다른 같은 회사 계열(바움루트미 · 준진소프트)에 있는 동안 개발 리드로 프론트엔드 초기 설계를 잡고 메인 · 영상 · 쇼츠 · 댓글 화면과 시청 시간 연동을 맡았습니다. 팀은 개발 3명(본인 포함) · 디자이너 1명 · 백엔드 1명이었습니다.",
            year: "2025",
            role: "개발 리드 (초기 설계 · 주요 화면 · API 연동)",
            period: "2024.08 — 2025.05",
            platform: "mobile",
            tech: [
                "React",
                "TypeScript",
                "Vite",
                "TanStack Query",
                "Zustand",
                "styled-components",
                "Axios",
            ],
            links: {
                demo: "https://m.i-mug.co.kr",
            },
            context: [
                "이 앱에는 사용자가 둘입니다. 규칙을 정하는 보호자와, 그 규칙 안에서 영상을 보는 아이. 하루에 볼 수 있는 시간을 보호자가 정하면, 아이가 영상을 보는 동안 그 시간이 줄어들고 다 쓰면 멈춰야 합니다. 멈추는 판단이 화면 안에서만 끝나지 않는다는 게 이 앱의 조건이었습니다.",
                "게다가 웹으로 만들었지만 실제로는 iOS · 안드로이드 앱의 WebView 안에서 돕니다. 영상을 멈추라는 말이 웹 바깥, 앱에서 들어옵니다. 브라우저에만 뜨는 페이지였다면 없었을 입구를 하나 더 들고 있는 셈입니다.",
            ],
            approach: [
                "시청 시간은 서버가 판정하게 했습니다. 브라우저 안에서 센 시간은 새로고침 한 번이면 사라지고, 아이가 여러 기기로 볼 수도 있습니다. 재생 중에는 5초마다 본 시간을 보내고, 서버가 그만 보라고 답하면 그 자리에서 멈춥니다.",
                "밖에서 들어오는 명령은 페이지가 한 번만 받습니다. 쇼츠처럼 플레이어가 여러 개 떠 있는 화면에서 각자 명령을 받게 두면, 누가 받았는지가 마운트 순서에 달려 버립니다. 페이지가 받아 상태로 내려주고, 지금 보이는 플레이어만 그 상태에 반응합니다.",
                "개발 리드로서 프로젝트 초기 구조를 세웠습니다. Vite · 라우팅 · 라우트 가드 구조를 첫 커밋으로 세우고, 화면마다 모양이 조금씩 다른 영상 목록을 VideoModule 합성 컴포넌트(썸네일 · 제목 · 채널 · 조회수를 조각으로 조립) 하나로 만들어 화면 컴포넌트 6곳이 같이 쓰게 했습니다. 스와이프 영역과 탭 메뉴도 같은 방식의 합성 컴포넌트로 만들었습니다. 토큰 인증을 맡은 API 인스턴스는 설계 방향을 잡아 주고 구현은 팀원이 했습니다. 팀원 코드는 리뷰하고 필요한 곳은 직접 고쳤고, 주말에는 줌으로 개발 스터디를 열었습니다.",
            ],
            screens: [
                {
                    name: "스플래시",
                    note: "앱 시작 · 모리가 먼저 나온다",
                },
                {
                    name: "로그인",
                    note: "카카오 · 애플 · 통합 로그인",
                },
                {
                    name: "프로필 선택",
                    note: "누가 보는지를 여기서 정한다",
                },
                {
                    name: "홈",
                    note: "남은 시청 시간 · 구독 채널 · 영상",
                },
                {
                    name: "영상",
                    note: "플레이어 · 댓글 · 이전/다음",
                },
                {
                    name: "쇼츠",
                    note: "세로 스와이프 · 활성 슬라이드만 재생",
                },
                {
                    name: "검색",
                    note: "최근 검색어 · 추천 채널",
                },
                {
                    name: "설정",
                    note: "보호자 전용 · 2차 인증 뒤",
                },
                {
                    name: "시력보호",
                    note: "화면에 너무 가까이 붙으면 덮인다",
                },
                {
                    name: "시청 종료",
                    note: "시간을 다 쓰면 여기서 멈춘다",
                },
            ],
        },
        {
            slug: "plus-sms",
            title: "Plus SMS",
            summary:
                "문자를 한 번에 수만 건 보내는 웹 서비스. 엑셀이나 메신저에서 복사해 온 번호를 붙여넣으면 형식을 맞추고 중복과 오류를 걸러 목록에 올리고, 포인트가 모자라면 보내기 전에 막습니다. 한 저장소를 Plus SMS와 Modoo SMS 두 브랜드로 빌드합니다. 바움루트미에 있을 때 개인으로 맡은 외주로, 프론트엔드를 설계부터 개발 · 배포 파이프라인까지 만들었습니다.",
            year: "2025",
            role: "프론트엔드 1인 (설계 · 개발 · API 연동 · 배포) · 백엔드 1명과 협업",
            period: "2024.11 — 2025.05",
            platform: "web",
            tech: [
                "React",
                "TypeScript",
                "Vite",
                "TanStack Query",
                "Zustand",
                "styled-components",
                "react-window",
                "xlsx",
                "Jenkins",
            ],
            links: {
                demo: "https://www.plus-sms.com",
            },
            context: [
                "대량 문자 서비스가 받는 입력은 깔끔하지 않습니다. 고객 명단은 엑셀에서, 메신저에서, 다른 시스템에서 복사돼 오고, 같은 번호가 010-1234-5678로도 +82 10 1234 5678로도 들어옵니다. 한 번에 최대 5만 건이고, 그중 몇 개가 틀렸다고 전체를 돌려보내면 쓸 수가 없습니다.",
                "보내는 순간 돈이 나갑니다. 건당 단가는 서버가 정하고 보유 포인트는 계정마다 다르니, 몇 명에게 보낼지가 정해지는 순간 결제할 포인트도 같이 정해져야 합니다. 보내고 나서 모자랐다고 알려 주면 이미 늦습니다.",
                "게다가 같은 서비스를 이름만 바꿔 두 곳에서 운영합니다. Plus SMS와 Modoo SMS는 로고와 상호만 다르고 기능은 같아서, 저장소를 둘로 나누면 고칠 때마다 두 번 고쳐야 했습니다.",
            ],
            approach: [
                "번호를 거르는 규칙은 한 함수에만 둡니다. 직접 입력이든 엑셀이든 들어온 글을 줄 단위 문자열로 맞춘 뒤 같은 파서를 거칩니다. 입구마다 규칙을 따로 두면 한쪽에서만 통과하는 번호가 생깁니다.",
                "틀린 번호 때문에 전체를 막지 않습니다. 등록 · 중복 · 오류를 따로 들고 있다가 문제 번호만 복사하거나 엑셀로 내려받게 했습니다. 어느 번호를 고쳐야 하는지 알아야 다시 올릴 수 있으니까요.",
                "서버에서 온 것과 화면이 들고 있는 것을 나눴습니다. 단가와 내역은 TanStack Query가 들고, 로그인한 사람의 정보(보유 포인트 포함)는 Zustand 스토어 하나에서 읽습니다. 토큰은 만료 5분 전에 요청 인터셉터가 먼저 갈아 끼웁니다.",
                "브랜드는 코드가 아니라 빌드가 고릅니다. 로고와 상호는 VITE_DOMAIN 한 값으로 갈리고, 호스트 이름을 보고 분기하는 코드는 두지 않았습니다.",
            ],
            screens: [
                {
                    name: "랜딩",
                    note: "로그인 전 첫 화면. 로고와 상호는 코드가 아니라 빌드가 고른다",
                },
                {
                    name: "로그인",
                    note: "이메일 인증 전 계정이면 오류 문구와 함께 버튼이 재전송으로 바뀐다",
                },
                {
                    name: "문자전송",
                    note: "70자 제한 카운터와, 치는 대로 따라오는 휴대폰 미리보기",
                },
                {
                    name: "번호 정리",
                    note: "추가하면 국가번호가 붙고, 중복 4건과 오류 1건은 따로 복사하거나 내려받는다",
                },
                {
                    name: "엑셀 등록",
                    note: "샘플 파일을 채워 올리면 직접 입력과 같은 검증을 거쳐 300건이 오른다",
                },
                {
                    name: "포인트 부족",
                    note: "결제 포인트가 보유 포인트를 넘으면 안내가 뜨고 전송 버튼이 잠긴다",
                },
                {
                    name: "3사 테스트",
                    note: "SKT · KT · LG+에 먼저 보내 전송 여부와 스팸 통과를 따로 본다",
                },
                {
                    name: "충전",
                    note: "빠른 금액 버튼을 누를 때마다 금액이 더해지고, 부가세 적용 회원에게만 10%를 더한 입금액을 보여 준다",
                },
                {
                    name: "전송내역",
                    note: "성공 · 실패 · 대기 건수와 상태. 엑셀은 전송이 끝난 건만 내려받는다",
                },
                {
                    name: "충전신청 내역",
                    note: "한국어로 맞춘 기간 달력과 1 · 3 · 6개월 빠른 선택",
                },
            ],
        },
    ],
    details: {
        safeops: {
            cases: [
                {
                    label: "무음을 뚫는 건 채널이 아니라 스트림의 문제였다",
                    problem:
                        "현장 대응 지시만은 벨소리를 꺼 뒀어도 들려야 합니다. 안드로이드는 방해 금지 우회가 알림이 아니라 채널의 속성이라 채널을 둘로 갈랐는데, 실기기로 보내 보니 방해 금지는 뚫었지만 벨소리 무음은 못 뚫었습니다. 무음 모드가 막는 건 알림 스트림이라, 소리를 내려면 알람 스트림에 실어야 합니다. 그런데 쓰던 알림 라이브러리(Notifee)의 채널 생성에는 오디오 속성을 넣을 자리가 없었습니다. 긴급 여부도 앱이 알림 종류를 보고 정하고 있어서, 서버와 앱의 판단이 어긋날 수 있었습니다.",
                    approach:
                        "긴급 채널만 로컬 Expo 모듈(Kotlin)에서 알람 용도로 직접 만듭니다. 채널의 오디오 속성은 만든 뒤에는 바꿀 수 없고, 지운 뒤 같은 id로 다시 만들어도 옛 설정이 되살아나서 id부터 바꿨습니다. 삼성 기기에서는 알람 스트림이 살아 있는데도 소리가 나지 않아서, 벨소리 모드가 일반이 아닐 때(무음·진동)는 앱이 알람 용도로 소리와 진동을 직접 냅니다. 일반일 때는 앱이 소리를 내지 않습니다. 그러지 않으면 OS 소리와 겹쳐 두 번 울립니다. 긴급 여부는 서버가 고른 채널(안드로이드)과 critical 사운드(iOS)로 판단합니다.",
                    result: "안드로이드와 iOS 실기기에서 무음 상태의 포그라운드·백그라운드·프로세스 종료 세 경우를 모두 확인했습니다. 채널 생성이 실패하면 조용히 넘어가지 않고 홈에 재시도 배너를 띄웁니다. ‘아직 모름’과 ‘실패’를 한 값으로 뭉개면 경고가 영영 뜨지 않습니다.",
                    metrics: [
                        {
                            label: "긴급 판정",
                            value: "알림 종류 → 서버 payload",
                        },
                        {
                            label: "우회 수단",
                            value: "채널 · 알람 스트림",
                        },
                        {
                            label: "검증",
                            value: "양 플랫폼 실기기",
                        },
                    ],
                    changes: [
                        {
                            file: "src/features/notifications/pushNotifications.ts",
                            commit: "5f6e368 · 2026.09.10",
                            before: 'const CRITICAL_NOTIFICATION_TYPE: NotificationType = "FIELD_RESPONSE";\n// ...\nawait notifee.createChannel({\n    id: CRITICAL_CHANNEL_ID,\n    name: "긴급 대응",\n    bypassDnd: true,\n    ...CHANNEL_BASE,\n});\n// ...\nconst isCritical = data.type === CRITICAL_NOTIFICATION_TYPE;',
                            after: '// 긴급 채널만 네이티브가 만든다 — notifee에는 알람 스트림을 지정할 자리가 없다.\nconst created = ensureCriticalChannel(CRITICAL_CHANNEL_ID);\n// ...\nconst isCriticalMessage = (message: RemoteMessage): boolean => {\n    if (Platform.OS === "android") {\n        return message.notification?.android?.channelId === CRITICAL_CHANNEL_ID;\n    }\n    const sound = message.notification?.ios?.sound;\n    return typeof sound === "object" && sound.critical === true;\n};',
                            note: "전에는 앱이 알림 종류(FIELD_RESPONSE)를 보고 긴급을 정했습니다. 그래서 서버가 일반으로 보낸 대응 요청도 앱이 켜져 있을 때만 긴급으로 울렸습니다. 지금은 서버가 실어 보낸 채널과 사운드를 그대로 따릅니다.",
                        },
                        {
                            file: "src/features/notifications/pushNotifications.ts",
                            commit: "b9c3184 · 2026.09.10",
                            before: 'export const hasDndBypass = async (): Promise<boolean | null> => {\n    if (Platform.OS !== "android") return null;\n    try {\n        const channel = await notifee.getChannel(CRITICAL_CHANNEL_ID);\n        return channel?.bypassDnd ?? null;\n    } catch {\n        return null;\n    }\n};',
                            after: 'export type DndBypassState = "bypassing" | "blocked" | "unavailable";\n\nexport const readDndBypass = async (): Promise<DndBypassState | null> => {\n    if (Platform.OS !== "android") return null;\n    try {\n        const channel = await notifee.getChannel(CRITICAL_CHANNEL_ID);\n        if (!channel) return "unavailable";\n        return channel.bypassDnd ? "bypassing" : "blocked";\n    } catch {\n        return "unavailable";\n    }\n};',
                            note: "전에는 채널이 없을 때도, 조회가 실패했을 때도 null이라 ‘아직 확인 전’과 구분되지 않았습니다. 홈은 경고를 띄울 근거가 없었습니다. 지금은 unavailable이면 재시도 배너가 뜹니다.",
                        },
                    ],
                },
                {
                    label: "다음 요원이 앞사람의 화면도, 자격도 물려받지 않게",
                    problem:
                        "한 기기를 교대로 쓰는 앱이라, 앞 요원이 남긴 것이 다음 요원에게 넘어가면 안 됩니다. 처음엔 두 군데가 새고 있었습니다. 하나는 화면입니다. 쿼리 키에 요원 식별자가 없는데 로그아웃은 토큰만 지웠고, 응답 인터셉터는 401을 에러로 바꿔 던지기만 했습니다. 캐시가 남으면 다음 요원이 앞사람 지시를 그대로 보고, 쓰는 도중 세션이 끊기면(401) 화면은 로그인된 채로 모든 요청이 실패합니다. 다른 하나는 좌표입니다. 위치 전송은 OS에 등록된 백그라운드 작업이 맡는데, 이 작업은 앱이 죽어도 남아 있습니다. 앱을 강제 종료하고 다시 열면 아직 로그인 화면인데도 작업이 먼저 깨어나, 로그인하기 3초 전에 좌표가 관제실로 올라갔습니다(실기기 재현). 교대 구간이라면 다음 요원의 기기에서 앞 요원의 자격으로 좌표가 나가고, 화면에는 흔적이 남지 않습니다. 위치 라이브러리를 바꾼 뒤에는 같은 구멍이 다시 열렸습니다. 네이티브 이벤트에는 어느 근무의 것인지 표시가 없고 정지는 큐를 거쳐 늦게 끝나서, 그 사이에 도착한 이벤트가 다음 근무의 구독자에게 갈 수 있었습니다.",
                    approach:
                        "세션이 끝나면 토큰과 쿼리 캐시, 위치 상태를 한 번에 비웁니다. 로그아웃과, 쓰는 도중 받은 401(서버의 세션 만료 코드 포함)이 같은 정리 경로를 탑니다. 좌표는 내보내는 첫 관문에 ‘이 앱이 지금 근무를 맡고 있는가’를 뒀습니다. 이 플래그는 일부러 저장하지 않고 메모리에만 둡니다. 앱이 죽으면 저절로 false가 돼야 ‘이 앱이 살아 있는 동안 근무를 시작했는가’와 같은 뜻이 되고, 저장해 두면 근무 중에 앱이 죽은 경우에 같은 구멍이 생깁니다. 정지를 요청하면 큐에 넣기 전에 플래그부터 닫고 세대 번호를 올립니다. 큐 안에서 닫으면 앞서 진행 중이던 시작이 끝나면서 플래그를 다시 열어 버리는 순서가 남습니다(Codex 리뷰에서 지적받았습니다). 라이브러리를 바꾼 뒤에는 같은 관문을 추적이 실제로 도는 것을 확인한 뒤에 열고, 마지막 구독이 풀릴 때 가장 먼저 닫게 했습니다. 이 일 뒤로 무언가를 시작하는 코드를 붙일 때는 멈추는 코드도 함께 만드는 걸 규칙으로 뒀습니다.",
                    result: "계정이 바뀌면 화면에 남는 게 없습니다. 좌표는 안드로이드 백그라운드 75초 동안 작업이 14번, iOS는 60초에 53번 깨어났는데 근무를 맡지 않은 상태에서는 전부 막혀 한 건도 나가지 않았습니다. 백그라운드와 복귀를 오가고, 토글을 껐다 켜고, 로그아웃했다 다시 로그인하는 동안 중복 전송은 0건이었습니다.",
                    metrics: [
                        {
                            label: "비우는 것",
                            value: "토큰 · 캐시 · 위치",
                        },
                        {
                            label: "근무 전 전송",
                            value: "14회 · 53회 진입 → 0건",
                        },
                        {
                            label: "중복 전송",
                            value: "0건",
                        },
                    ],
                    changes: [
                        {
                            file: "src/screens/settings/_hooks/useLogout.ts → useMutationLogout.ts",
                            commit: "658fcb3 · 2026.08.12",
                            before: "const logoutAndClearToken = async (): Promise<void> => {\n    try {\n        await logoutApi();\n    } finally {\n        await clearAccessToken();\n    }\n};",
                            after: "const clearSession = async (queryClient: QueryClient): Promise<void> => {\n    try {\n        await postLogout();\n    } finally {\n        await queryClient.cancelQueries();\n        queryClient.removeQueries();\n        await clearAccessToken();\n    }\n};",
                            note: "전에는 토큰만 지우고 쿼리 캐시는 그대로 남았습니다. 지금은 진행 중인 요청을 취소하고 캐시를 비운 뒤 세션을 닫습니다.",
                        },
                        {
                            file: "src/services/apiClient.ts",
                            commit: "658fcb3 · 2026.08.12",
                            before: "apiClient.interceptors.response.use(\n    (response) => response,\n    (error) => Promise.reject(toAppErrorFromAxios(error)),\n);",
                            after: 'export const endSessionOnUnauthorized = async (error: unknown): Promise<never> => {\n    const isExpired =\n        error instanceof AppError && (error.status === 401 || error.code === "SESSION_EXPIRED");\n\n    if (isExpired) {\n        await clearAccessToken().catch(() => {});\n        // ...\n        await queryClient.cancelQueries();\n        queryClient.removeQueries();\n        onSessionExpired?.();\n    }\n    throw error;\n};',
                            note: "전에는 401을 받아도 에러만 던져서, 화면이 로그인된 채 요청마다 실패했습니다. 지금은 로그아웃과 같은 정리를 한 번에 하고 로그인 화면으로 보냅니다.",
                        },
                        {
                            file: "src/features/location/backgroundLocationTask.ts",
                            commit: "1fae958 · 2026.08.06",
                            before: '        if (AppState.currentState === "active") return;',
                            after: "        if (!hasTakenOverShift) return;\n// ...\n        if (Date.now() - lastForegroundSendAtMs < FOREGROUND_OWNERSHIP_MS) return;\n// ...\nexport const stopBackgroundLocationUpdates = (): Promise<void> => {\n    // ...\n    hasTakenOverShift = false;\n    shiftGeneration += 1;\n    // ...",
                            note: "전에는 앱이 화면에 떠 있는지만 보고 작업이 보낼지 정해서, 로그인 전에 깨어난 작업도 좌표를 보냈습니다. 지금은 이 앱이 근무를 맡은 뒤에만 보내고, 로그아웃하면 큐를 기다리지 않고 바로 막습니다. 이 파일은 위치 라이브러리를 바꾸며 없어졌습니다.",
                        },
                        {
                            file: "src/features/location/backgroundGeolocation.ts",
                            commit: "d5e4558 · 2026.08.14",
                            before: "const emit = (location: BackgroundLocation): boolean => {\n    if (subscribers.size === 0) return false;",
                            after: "const emit = (location: BackgroundLocation): boolean => {\n    if (!isSessionOpen || subscribers.size === 0) return false;\n// ...\n        // 추적이 실제로 도는 것을 확인한 뒤에야 문을 연다.\n        isSessionOpen = true;\n// ...\n        // **가장 먼저 닫는다** — 정지는 큐를 거쳐 늦게 끝나므로 그 사이 도착한 이벤트가\n        // 다음 근무로 흘러들 수 있다.\n        isSessionOpen = false;\n        trackingGeneration += 1;",
                            note: "전에는 구독자만 있으면 내보내서, 정지가 끝나기 전에 도착한 앞 근무의 좌표가 다음 요원의 구독자에게 갈 수 있었습니다. 지금은 열린 근무 안에서만 좌표가 나갑니다.",
                        },
                    ],
                },
                {
                    label: "‘보내는 중’과 ‘전달되고 있다’는 다른 말이다",
                    problem:
                        "처음 판정은 전송 실패가 연속 몇 번 쌓였는지만 봤습니다. 그런데 측위가 실패하면 보낼 좌표 자체가 없어서 실패도 쌓이지 않습니다. 관제실은 최신 위치를 못 받는데 화면은 계속 ONLINE이었습니다. 게다가 홈과 설정이 같은 배지를 각자 계산하고 있었고, 설정 쪽 계산은 근무 종료를 보지 않았습니다. 근무가 닫힌 뒤에도 설정만 ‘재시도 중’을 경고색으로 띄웠습니다.",
                    approach:
                        "판정에 ‘관제실이 마지막으로 받은 시각부터 흐른 시간’을 더했습니다. 첫 좌표를 기다리는 동안은 90초, 그 뒤로는 3분이 지나면 끊긴 것으로 봅니다. 3분은 실내 네트워크 측위의 공백(실측 7~185초)에 맞춘 값입니다. 갱신 주기(10초)에 맞춰 조이면 실내에 서 있는 요원이 통째로 끊긴 것으로 잡힙니다. 근무가 닫히면 전송과 GPS를 함께 멈춥니다. 다만 이 시각으로 GPS를 다시 켤지까지 판단하면 안 됐습니다. 서버가 받아 줬을 때만 바뀌는 값이라, API가 3분 넘게 멈추면 멀쩡히 좌표를 주는 GPS를 30초마다 껐다 켰습니다. 관제실에 들어가는지와 GPS가 도는지는 다른 질문이라, 좌표가 도착한 시각을 따로 들고 GPS 재시작은 그 값으로만 정합니다. 두 화면이 각자 하던 배지 계산은 순수 함수 하나로 모으고, 그 함수에 근무 종료를 넣었습니다.",
                    result: "좌표가 끊기면 홈이 먼저 위치 전송이 멈췄다고 알립니다. 근무가 닫히면 홈과 설정이 동시에 근무 종료로 바뀝니다. 설정 배지가 근무 종료에서 경고색을 띄우지 않는다는 것은 회귀 테스트로 고정했습니다.",
                    metrics: [
                        {
                            label: "끊김 판정",
                            value: "첫 좌표 전 90초 · 이후 3분",
                        },
                        {
                            label: "전송 주기",
                            value: "10초 고정",
                        },
                        {
                            label: "배지 계산",
                            value: "2곳 → 함수 1개",
                        },
                    ],
                    changes: [
                        {
                            file: "src/stores/locationStore.tsx",
                            commit: "7b05961 · 2026.08.11",
                            before: 'const isDeliveryHealthy =\n    permission === "granted" &&\n    isTransmitting &&\n    state.consecutiveFailures < STALE_AFTER_FAILURES;',
                            after: 'export const STALE_AFTER_SILENCE_MS = 3 * 60_000;\n// ...\nconst lastSignalAtMs = Math.min(\n    silenceCheckedAt,\n    Math.max(transmitStartedAtRef.current, state.lastSentAt ? Date.parse(state.lastSentAt) : 0),\n);\nconst isSilent = silenceCheckedAt - lastSignalAtMs >= STALE_AFTER_SILENCE_MS;\n\nconst isDeliveryHealthy =\n    permission === "granted" &&\n    isTransmitting &&\n    state.consecutiveFailures < STALE_AFTER_FAILURES &&\n    !isSilent;',
                            note: "좌표가 아예 안 들어오면 실패도 쌓이지 않아서, 전에는 이 상태에서 ONLINE이 계속 떠 있었습니다. 지금은 관제실이 마지막으로 받은 시각(lastSentAt)에서 3분이 지나면 RETRYING으로 바뀝니다.",
                        },
                        {
                            file: "src/screens/settings/SettingsScreen.tsx → src/utils/transmissionStatus.ts",
                            commit: "7b7a2e5 · 2026.08.31",
                            before: 'const isTimerRunning = permission === "granted" && isTransmitting;\nconst isStalled = isTimerRunning && !isDeliveryHealthy;\nconst onlineLabel = isDeliveryHealthy ? "ONLINE" : isStalled ? "RETRYING" : "OFFLINE";\nconst onlineTone = isDeliveryHealthy ? "active" : "warning";',
                            after: '// 근무 종료는 고장이 아니다 — `isOffDuty`는 경고색과 타이머 판정에서 모두 빼야 한다.\nconst resolveTransmissionStatus = ({\n    isPermissionGranted,\n    isTransmitting,\n    isDeliveryHealthy,\n    isOffDuty,\n}: TransmissionStatusInput): TransmissionStatus => {\n    const isTimerRunning = isPermissionGranted && isTransmitting && !isOffDuty;\n    const isStalled = isTimerRunning && !isDeliveryHealthy;\n\n    if (isOffDuty) return { isTimerRunning, isStalled, label: "OFF DUTY", tone: "neutral" };\n    if (isDeliveryHealthy) return { isTimerRunning, isStalled, label: "ONLINE", tone: "active" };\n    // ...',
                            note: "근무가 닫혔는데 GPS 토글이 켜져 있으면, 전에는 설정만 경고색 RETRYING을 띄웠습니다. 홈과 설정이 이 함수 하나를 부르게 한 뒤로는 둘 다 OFF DUTY입니다.",
                        },
                        {
                            file: "src/stores/locationStore.tsx",
                            commit: "2436c36 · 2026.08.11",
                            before: 'useEffect(() => {\n    if (status !== "authenticated" || permission !== "granted" || !isTransmitting) return;\n    if (startStatus !== "ok" || !isSilent) return;\n\n    dispatch({ type: "SOURCE_START_FAILED" });\n}, [status, permission, isTransmitting, startStatus, isSilent]);',
                            after: 'const isSourceSilent =\n    silenceCheckedAt -\n        Math.min(\n            silenceCheckedAt,\n            Math.max(transmitStartedAtRef.current, lastCoordinateAtRef.current),\n        ) >=\n    STALE_AFTER_SILENCE_MS;\n// ...\nuseEffect(() => {\n    if (status !== "authenticated" || permission !== "granted" || !isTransmitting) return;\n    if (startStatus !== "ok" || !isSourceSilent) return;\n\n    dispatch({ type: "SOURCE_START_FAILED" });\n}, [status, permission, isTransmitting, startStatus, isSourceSilent]);',
                            note: "전에는 서버가 3분 동안 받아 주지 않으면 GPS가 멀쩡해도 소스를 다시 열었습니다. 지금은 좌표가 실제로 끊겼을 때만 다시 열고, 서버 쪽 문제는 화면 배지로만 드러냅니다.",
                        },
                    ],
                },
                {
                    label: "좁은 구역을 도는 요원은 제자리로 읽혔다",
                    problem:
                        "실기기로 5분 동안 순회해 보니 좌표 간격이 들쭉날쭉했습니다. 안드로이드는 5분에 14건, 가장 긴 공백은 63.9초였습니다. 원인이 네 겹이었습니다. 이동 주기를 거리(5m)로 재고 있었는데, 요원은 좁은 구역을 돌기 때문에 변위로는 제자리에 서 있는 것처럼 읽혔습니다. 안드로이드는 정지 중에는 위치 이벤트를 주지 않아서 정지로 시작한 근무의 첫 좌표는 이동 전환 이벤트에 실려 오는 것뿐인데, 그걸 버리고 있었습니다. 첫 좌표를 기다리는 시한(60초)은 첫 좌표까지 걸리는 최대 시간(90초)보다 짧아서, 시한이 지나 소스를 다시 열면 대기가 처음부터 다시 시작되는 루프에 빠졌습니다. 순서가 뒤집힌 좌표를 거르는 필터는 기기 시계가 뒤로 가면 그 폭만큼 좌표를 통째로 멈췄습니다.",
                    approach:
                        "주기를 거리에서 시간(5초)으로 바꿨습니다. 거리 필터가 0이어야 시간 설정이 살아나고, 최대 빈도 설정도 함께 낮춰야 기본값 10초가 상한으로 남지 않습니다. 전환 이벤트의 좌표를 내보내고, 첫 좌표 대기 시한을 2분으로 늘리고, 시계가 역행하면 기준을 버리게 했습니다. 몇 주 뒤에는 배터리보다 끊김이 더 문제라고 보고 정지 감지를 아예 끄고 10초 고정 주기로 바꿨습니다. 서 있는 요원의 같은 좌표를 안드로이드 네이티브가 버리던 것도 이때 풀었습니다.",
                    result: "같은 5분 순회에서 안드로이드는 14건 · 중앙값 7.7초 · 최대 63.9초에서 58건 · 5.0초 · 최대 10.0초가 됐습니다. 지금은 위의 파이프라인처럼 10초 고정 주기로 돕니다.",
                    metrics: [
                        {
                            label: "5분 순회 좌표",
                            value: "14건 → 58건",
                        },
                        {
                            label: "최대 공백",
                            value: "63.9초 → 10.0초",
                        },
                        {
                            label: "주기 기준",
                            value: "거리 5m → 시간",
                        },
                    ],
                    changes: [
                        {
                            file: "src/features/location/backgroundGeolocation.ts",
                            commit: "456a06d · 2026.08.14",
                            before: "/** 이동 중 측위 간격(m). 설정 화면이 요원에게 그대로 보여준다. */\nexport const MOVING_DISTANCE_FILTER_M = 5;\n// ...\n        distanceFilter: MOVING_DISTANCE_FILTER_M,\n        stopTimeout: STOP_TIMEOUT_MIN,\n// ...\nBackgroundGeolocation.onMotionChange((event) => {\n    hasMotionState = true;\n    isTrackingMoving = event.isMoving;\n});",
                            after: "export const MOVING_UPDATE_INTERVAL_SEC = 5;\n// ...\n        distanceFilter: 0,\n        locationUpdateInterval: MOVING_UPDATE_INTERVAL_SEC * 1000,\n        fastestLocationUpdateInterval: MOVING_UPDATE_INTERVAL_SEC * 1000,\n        stopTimeout: STOP_TIMEOUT_MIN,\n// ...\nBackgroundGeolocation.onMotionChange((event) => {\n    hasMotionState = true;\n    isTrackingMoving = event.isMoving;\n    emit(event.location);\n});",
                            note: "전에는 5m를 움직여야 좌표가 나와서 좁은 구역을 도는 요원은 1분 넘게 비었고, 정지로 시작하면 첫 좌표를 버렸습니다. 지금은 5초마다 재고 전환 좌표도 내보냅니다.",
                        },
                        {
                            file: "src/features/location/backgroundGeolocation.ts",
                            commit: "3b864de · 2026.09.08",
                            before: "        locationUpdateInterval: MOVING_UPDATE_INTERVAL_SEC * 1000,\n        fastestLocationUpdateInterval: MOVING_UPDATE_INTERVAL_SEC * 1000,\n        stopTimeout: STOP_TIMEOUT_MIN,\n// ...\n        heartbeatInterval: HEARTBEAT_INTERVAL_SEC,\n        preventSuspend: true,",
                            after: "        locationUpdateInterval: UPDATE_INTERVAL_SEC * 1000,\n        fastestLocationUpdateInterval: UPDATE_INTERVAL_SEC * 1000,\n        pausesLocationUpdatesAutomatically: false,\n        allowIdenticalLocations: true,\n// ...\n    // **`geolocation`에 넣지 마라** — 타입에는 양쪽 다 있지만 런타임은 이 그룹만 읽는다.\n    activity: {\n        disableStopDetection: true,\n    },",
                            note: "전에는 정지로 판정되면 좌표가 멎었고, 서 있는 요원의 같은 좌표는 네이티브가 버렸습니다. 지금은 정지 감지를 끄고 같은 좌표도 받아 10초마다 보냅니다. 정지 감지 옵션을 엉뚱한 묶음에 넣었던 상태는 커밋된 적이 없어서 전 코드로는 보여 드릴 수 없습니다.",
                        },
                    ],
                },
                {
                    label: "빈 catch 하나가 포그라운드 알림을 지웠다",
                    problem:
                        "알림 라이브러리를 expo-notifications에서 Firebase Messaging + Notifee로 옮기는 중이었습니다. 두 라이브러리가 안드로이드에서 같은 수신 서비스 자리를 다투면 배너와 탭 이동이 조용히 사라져서 하나로 정리해야 했습니다. 옮기고 나서 안드로이드 실기기에 올려 보니, 앱을 켜 둔 상태에서는 지시 알림이 아예 뜨지 않았습니다. Notifee는 진동 패턴에 0이 하나라도 있으면 채널 생성을 거부하는데, 쓰던 패턴이 0으로 시작했습니다. 그 실패를 채널 생성부와 앱 시작부가 빈 catch로 삼키고 있었습니다. 앱이 백그라운드일 때는 OS가 기본 채널로 대신 띄워서 멀쩡해 보였고, 그래서 실기기로 포그라운드를 확인하기 전까지 드러나지 않았습니다.",
                    approach:
                        "진동 패턴의 0을 1로 바꾸고, 이유를 상수 주석에 적었습니다. 앱 시작부의 빈 catch를 걷고, 채널 생성 실패는 기록을 남기게 했습니다. 채널에 소리를 명시한 것도 이때입니다. 비워 두면 무음 채널이 만들어져, 화면을 보지 않는 요원에게 전달될 신호가 남지 않습니다. 채널 생성이 거부되는 경우는 테스트로 따로 만들었습니다. 나중에는 채널을 확인할 수 없는 상태를 별도 값으로 돌려받아, 홈이 재시도 배너를 띄우도록 이어 붙였습니다(위의 무음 사례).",
                    result: "안드로이드 포그라운드에서도 지시 알림이 채널 설정대로 뜹니다. 푸시는 그 뒤 관제 서버가 보낸 알림이 양 플랫폼 실기기에 뜨는 데까지 전 구간을 확인했습니다. 좌표 경로는 여기서 한 걸음 더 나가 릴리스 빌드에서도 에러를 로그로 남깁니다.",
                    metrics: [
                        {
                            label: "원인",
                            value: "진동 패턴의 0 하나",
                        },
                        {
                            label: "드러난 곳",
                            value: "안드로이드 포그라운드만",
                        },
                        {
                            label: "채널 소리",
                            value: "비움 → default 명시",
                        },
                    ],
                    changes: [
                        {
                            file: "App.tsx · src/features/notifications/pushNotifications.ts",
                            commit: "583184c · 2026.08.18",
                            before: 'useEffect(() => {\n    void ensureDispatchChannel().catch(() => {});\n}, []);\n// ...\nconst DISPATCH_VIBRATION_PATTERN = [0, 250, 150, 400];\n// ...\nawait Notifications.setNotificationChannelAsync(DISPATCH_CHANNEL_ID, {\n    name: "긴급 지시",\n    importance: Notifications.AndroidImportance.MAX,\n    vibrationPattern: DISPATCH_VIBRATION_PATTERN,\n    // ...\n});',
                            after: 'useEffect(() => {\n    void ensureDispatchChannel();\n}, []);\n// ...\n/** 짧게 두 번 끊어 친다. **값이 하나라도 0이면 notifee가 채널 생성을 거부한다.** */\nconst DISPATCH_VIBRATION_PATTERN = [1, 250, 150, 400];\n// ...\ntry {\n    await notifee.createChannel({\n        id: DISPATCH_CHANNEL_ID,\n        name: "긴급 지시",\n        importance: AndroidImportance.HIGH,\n        // 비우면 무음 채널이 된다.\n        sound: "default",\n        vibrationPattern: DISPATCH_VIBRATION_PATTERN,\n        // ...\n    });\n} catch (error) {\n    if (__DEV__) console.warn("[push] 지시 알림 채널 생성 실패:", error);\n}',
                            note: "전에는 채널이 만들어지지 않아도 흔적 없이 포그라운드 알림만 사라졌습니다. 지금은 0이 없는 패턴으로 채널이 만들어지고, 실패하면 기록이 남습니다. Notifee로 옮기던 중간 상태는 커밋되지 않아서, 전 코드는 옮기기 직전(expo-notifications)의 것입니다.",
                        },
                    ],
                },
                {
                    label: "안드로이드에서만 좌표가 한 번도 오지 않았다",
                    problem:
                        "iOS에서는 멀쩡한데 안드로이드에서는 권한을 다 허용해도 좌표가 한 건도 올라가지 않았습니다. 추적이 시작조차 되지 않은 거였습니다. 권한 요청이 두 군데서 동시에 나가고 있었습니다. 권한을 확인하는 expo-location과 추적을 맡은 위치 라이브러리가 같은 백그라운드 권한을 같은 순간에 청했습니다. 안드로이드 11부터는 이 권한을 앱 안의 다이얼로그로 받을 수 없어서 expo-location이 설정 화면을 여는데, 그 화면 전환이 위치 라이브러리의 권한 안내를 끊었습니다. 준비 단계가 끝나지 못하니 추적도 시작되지 않았습니다. iOS는 설정 화면으로 보내는 단계가 없어서 이 충돌이 없었습니다. 덤으로, 그 권한 안내는 라이브러리 기본 영문(‘[CHANGEME] ... FEATURE X’)이 그대로 요원에게 보이고 있었습니다.",
                    approach:
                        "권한을 청하는 쪽을 하나로 줄였습니다. 안드로이드에서는 expo-location이 백그라운드 권한을 읽기만 하고, 요청은 추적을 켜는 위치 라이브러리가 이어서 합니다. 이 분기는 지우면 버그가 그대로 돌아오는 자리라, 코드에 이유를 적고 테스트 두 건으로 묶어 뒀습니다. 권한 안내 문구도 한국어로 바꿨습니다.",
                    result: "Galaxy Note20 실기기에서 권한을 허용하고 10초 뒤에 첫 좌표를 받았습니다. 정확도는 ±9.5m였습니다.",
                    metrics: [
                        {
                            label: "권한 요청 주체",
                            value: "2곳 → 1곳",
                        },
                        {
                            label: "첫 좌표",
                            value: "허용 후 10초",
                        },
                        {
                            label: "정확도",
                            value: "±9.5m",
                        },
                    ],
                    changes: [
                        {
                            file: "src/features/location/deviceLocationSource.ts",
                            commit: "dd97cd4 · 2026.08.11",
                            before: 'export const requestLocationPermissions = async (): Promise<LocationPermissionRequestResult> => {\n    const foreground = await requestForegroundLocationPermission();\n    if (foreground !== "granted") return { foreground, background: "denied" };\n\n    const background = await requestPermission(\n        Location.getBackgroundPermissionsAsync,\n        Location.requestBackgroundPermissionsAsync,\n    );\n\n    return { foreground, background };\n};',
                            after: 'export const requestLocationPermissions = async (): Promise<LocationPermissionRequestResult> => {\n    const foreground = await requestForegroundLocationPermission();\n    if (foreground !== "granted") return { foreground, background: "denied" };\n\n    if (Platform.OS === "android") {\n        const { granted } = await Location.getBackgroundPermissionsAsync();\n        return { foreground, background: granted ? "granted" : "denied" };\n    }\n    // ...',
                            note: "전에는 두 라이브러리가 같은 권한을 동시에 청해, 설정 화면 전환이 추적 준비를 끊었습니다. 지금은 안드로이드에서 읽기만 하고 요청은 한 곳에서 합니다.",
                        },
                    ],
                },
                {
                    label: "라이트는 다크를 뒤집은 색이 아니다",
                    problem:
                        "테마를 한 벌 더 만든다는 건 색을 반전하는 일이 아니었습니다. 같은 색상의 명도만 내리면 흰 면 위에서 잉크처럼 탁해집니다. 게다가 스타일 파일이 색 상수를 곧바로 참조해 모듈을 읽는 순간 StyleSheet에 색이 굳어 버려서, 팔레트를 갈아 끼울 자리 자체가 없었습니다.",
                    approach:
                        "색을 쓰는 스타일을 전부 팔레트를 인자로 받는 팩토리로 바꿨습니다. 팩토리는 테마마다 한 번만 StyleSheet를 만들어 캐시합니다. 두 벌은 같은 토큰 이름을 갖고, 신호색은 색상을 지킨 채 명도만 뒤집습니다. 다크 한 벌만 검사하던 대비 테스트는 두 팔레트를 모두 돌게 넓혔습니다. 중립 글자색 세 가지는 AA(4.5:1)를 지키고, 채움 면 위의 글자는 큰 글자 기준(3:1)으로 둡니다. 4.5를 강제하면 신호색이 전부 어두워져 화면이 통째로 탁해집니다. 고른 값은 SecureStore에 남깁니다. 비밀 값이라서가 아니라, 네이티브 모듈을 새로 붙이지 않고 쓸 수 있는 유일한 저장소라서요.",
                    result: "설정에서 고르면 지도 타일까지 야간 팔레트로 뒤집힙니다. 라이트 바탕은 순백으로 두고 깊이는 그림자로 냅니다. 바탕을 옅은 회색으로 내려 카드를 구분하는 안도 써 봤지만, 헤더와 탭바가 불투명 흰색이라 가운데만 회색 띠가 생겨 되돌렸습니다.",
                    metrics: [
                        {
                            label: "팔레트",
                            value: "2벌 · 같은 토큰",
                        },
                        {
                            label: "바꾼 스타일 파일",
                            value: "36개",
                        },
                        {
                            label: "대비 테스트",
                            value: "1벌 → 2벌",
                        },
                    ],
                    changes: [
                        {
                            file: "src/components/ui/_styles/card.ts",
                            commit: "2e96ca2 · 2026.09.07",
                            before: 'import { colors, radius } from "@/theme";\n\nconst styles = StyleSheet.create({\n    base: {\n        backgroundColor: colors.surface,\n        borderRadius: radius.lg,\n        borderColor: colors.border,\n    },\n});',
                            after: 'import cardSurface from "@/styles/surface";\nimport { createStyles } from "@/theme";\n\nconst themedStyles = createStyles((colors) => ({\n    base: cardSurface(colors),\n    emphasized: {\n        borderWidth: 1,\n        borderColor: colors.border,\n    },\n}));',
                            note: "전에는 colors가 모듈 평가 시점의 값으로 고정돼 테마를 바꿔도 카드 색이 그대로였습니다. 이 커밋에서 화면별 _styles 파일 36개(고친 34 · 새로 만든 2)를 같은 꼴로 맞췄습니다(104파일, +1504/−582).",
                        },
                    ],
                },
                {
                    label: "먼저 반영한 값을 보고 화면을 넘기면 안 된다",
                    problem:
                        "끝난 대응을 다시 열면 승인·거절 버튼이 잠깐 보였다가 완료 화면으로 튀었습니다. react-query가 캐시에 남은 옛 상태로 본문을 먼저 그렸기 때문입니다. 같은 이유로, 캐시의 옛 상태를 보고 이미 끝난 대응을 ‘확인함’으로 되돌리는 요청까지 나갈 수 있었습니다.",
                    approach:
                        "상세는 이번 진입에서 성공한 응답을 받기 전까지 본문 대신 로더를 그리고, 상태를 바꾸는 요청도 그 뒤에만 보냅니다. 이동 안내 화면은 들어올 수 없는 상태로 열리면 알맞은 화면으로 스스로 넘기는데, 이 판단은 도착 요청이 idle일 때만 합니다. 도착 버튼을 누른 직후의 완료 상태는 서버 응답이 아니라 낙관적 업데이트로 먼저 써 둔 캐시 값이라, 그걸 보고 넘기면 서버가 거절해도 완료 화면이 뜹니다. 요청이 실패했을 때 캐시를 되돌리는 건 조건 없이 합니다.",
                    result: "끝난 대응을 다시 열어도 버튼이 번쩍이지 않고 곧장 목적지로 갑니다. 도착 응답을 기다리는 동안 완료 화면으로 넘어가지 않는다는 것도 테스트로 고정했습니다.",
                    metrics: [
                        {
                            label: "판단 기준",
                            value: "이번 진입의 성공 응답",
                        },
                        {
                            label: "화면 넘김",
                            value: "요청이 idle일 때만",
                        },
                        {
                            label: "손본 화면",
                            value: "목록 · 상세 · 이동 안내",
                        },
                    ],
                    changes: [
                        {
                            file: "src/screens/notification/FieldResponseDetailScreen.tsx",
                            commit: "3c949c7 · 2026.08.27",
                            before: "const { data: detail, isFetchedAfterMount } = useQueryNotificationDetail(notificationId);\n// ...\nif (hasDecidedEntry.current || !detail || !isFetchedAfterMount) return;",
                            after: 'const {\n    data: detail,\n    isSuccess,\n    isFetchedAfterMount,\n} = useQueryNotificationDetail(notificationId);\n/** 이번 진입에서 성공으로 받아온 상태인가. 갱신이 실패하면 남은 캐시는 지난 진입의 것이다. */\nconst hasFreshStatus = isSuccess && isFetchedAfterMount;\n\n/** 어느 화면으로 보낼지 아직 못 정했는가. 캐시된 옛 상태로 승인·거절이 번쩍이는 것을 막는다. */\nconst isResolvingEntry =\n    !hasFreshStatus ||\n    detail?.progressStatus === "IN_PROGRESS" ||\n    detail?.progressStatus === "DONE";\n// ...\nif (hasDecidedEntry.current || !detail || !hasFreshStatus) return;',
                            note: "전에는 isFetchedAfterMount만 봐서 이번 진입의 갱신이 실패해도 지난 진입의 캐시로 판단했고, 판단이 서기 전에도 본문을 그렸습니다. 지금은 성공 여부까지 보고, 판단이 설 때까지 로더를 그립니다(isResolvingEntry).",
                        },
                    ],
                },
                {
                    label: "콜드스타트에서 사라지던 푸시 링크",
                    problem:
                        "푸시를 탭해 앱이 처음 뜨면, 링크가 도착하는 시점에 대상 화면이 아직 등록돼 있지 않습니다. React Navigation은 이런 링크를 큐에 넣지 않고 버리므로, 그대로 두면 지시 알림을 눌러도 홈만 열립니다. 또 처음에는 서버가 data.url에 담은 주소를 그대로 열고 있어서, 서버 값 하나로 앱을 아무 화면으로나 끌고 갈 수 있었습니다.",
                    approach:
                        "링크를 곧바로 열지 않고 대기열에 넣어 둡니다. 라우트가 준비되고 뒤로 가기로 돌아갈 탭이 정해진 뒤에 꺼내 엽니다. 서버는 전체 URL 대신 앱 안의 경로(dispatch/DP-1)만 보내고, 스킴은 앱이 붙입니다. 스킴이나 //로 시작하는 값은 버립니다.",
                    result: "콜드스타트나 권한 요청 단계에서 도착한 링크도 목적지까지 살아남습니다. 알림 상세에서 뒤로 가면 해당 탭이 열린 알림함으로, 지시 상세에서는 홈으로 돌아갑니다.",
                    metrics: [
                        {
                            label: "딥링크 경로",
                            value: "9개",
                        },
                        {
                            label: "알림 종류",
                            value: "3종",
                        },
                        {
                            label: "서버가 보내는 것",
                            value: "전체 URL → 경로",
                        },
                    ],
                    changes: [
                        {
                            file: "src/navigations/_utils/linking.ts",
                            commit: "e51e691 · 2026.08.12",
                            before: 'const url = response?.notification?.request?.content?.data?.url;\nif (typeof url === "string" && url.length > 0) return url;',
                            after: 'const urlFromPath = (path: string): string | null => {\n    if (/^(?:[a-z][\\w+.-]*:|\\/\\/)/i.test(path)) return null;\n    return Linking.createURL(path.replace(/^\\/+/, ""));\n};\n// ...\nconst pathUrl = typeof path === "string" && path.length > 0 ? urlFromPath(path) : null;\nif (pathUrl) return pathUrl;',
                            note: "전에는 data.url에 무엇이 오든 그대로 열었습니다. 지금은 스킴이나 //가 붙은 값을 버리고 스킴을 앱이 직접 붙입니다. 링크를 맡아 두는 대기열(pendingUrl)은 이 파일을 처음 만들 때부터 넣었기 때문에 전후를 비교할 코드가 없습니다.",
                        },
                    ],
                },
                {
                    label: "업데이트 안내가 한 번도 뜬 적이 없었다",
                    problem:
                        "스토어 새 버전과 OTA 업데이트를 알리는 모달이 있었는데, 이 모달은 한 번도 뜬 적이 없었습니다. 버전 점검이 서버에 없는 주소(/api/version/)를 부르고 있었습니다. 404라 응답이 비어 잘못된 응답으로 끝났고, 점검에 실패하면 아무것도 띄우지 않는다는 원칙 때문에 오류가 조용히 묻혔습니다. 주소를 고치고 보니 다른 구멍도 보였습니다. 버전 응답은 앱을 켤 때 한 번만 받았고, OTA 검사도 기본값이 시작할 때 한 번이었습니다. 요원은 근무 내내 앱을 켜 두니, 그 사이에 나간 업데이트는 다음 실행까지 알 길이 없었습니다.",
                    approach:
                        "경로를 서버 규격(/app/version/)에 맞췄습니다. 앱으로 돌아올 때마다 버전과 OTA를 다시 묻게 했는데, 그러면 ‘나중에’를 눌러도 복귀할 때마다 다시 뜹니다. 그래서 미룬 대상을 기억합니다. 스토어 버전은 버전 번호로, OTA는 업데이트 ID로 기억해서 더 새 것이 나오면 그때 다시 띄웁니다. 스토어 열기에 실패한 표시도 주소가 아니라 그때의 버전 정보에 묶었습니다. 스토어 주소는 릴리스마다 같아서, 주소로만 기억하면 다음 강제 업데이트가 시도도 없이 닫힙니다. OTA 검사는 한 곳에서만 합니다. 설정 화면도 같은 훅을 써서, 두 곳에 두면 요청이 두 배로 나갑니다.",
                    result: "1.0.0 스토어 빌드가 production 브랜치의 OTA를 받아 반영하고 업데이트 모달이 뜨는 것까지 실기기에서 확인했습니다. 두 모달의 동작은 테스트로 고정했습니다(183줄 추가).",
                    metrics: [
                        {
                            label: "모달 표시",
                            value: "0번 → 복귀마다 확인",
                        },
                        {
                            label: "미룬 기록",
                            value: "버전 · 업데이트 ID",
                        },
                        {
                            label: "OTA 검사 위치",
                            value: "1곳",
                        },
                    ],
                    changes: [
                        {
                            file: "src/services/version/app.ts",
                            commit: "02f0390 · 2026.09.07",
                            before: 'const { data } = await publicApi.get<ApiResponse<AppVersionData>>("/api/version/", {\n    params: { platform: Platform.OS },\n});',
                            after: 'const { data } = await publicApi.get<ApiResponse<AppVersionData>>("/app/version/", {\n    params: { platform: Platform.OS },\n});',
                            note: "한 줄 차이입니다. 전에는 404가 ‘점검 실패 → 아무것도 안 띄움’으로 흘러가 모달이 뜬 적이 없었습니다.",
                        },
                        {
                            file: "src/navigations/_components/AppUpdateDialog.tsx",
                            commit: "d0c624f · 2026.09.07",
                            before: "const [isPostponed, setPostponed] = useState(false);\nconst [hasStoreFailed, setStoreFailed] = useState(false);\nconst { data } = useQueryAppVersion();",
                            after: 'const [postponedVersion, setPostponedVersion] = useState<string | null>(null);\nconst [failedVersionKey, setFailedVersionKey] = useState<string | null>(null);\nconst { data, refetch } = useQueryAppVersion();\n// ...\nconst isPostponed = latest !== undefined && postponedVersion === latest;\nconst versionKey = data && `${data.latest}|${data.minSupported}|${data.storeUrl}`;\nconst hasStoreFailed = failedVersionKey !== null && failedVersionKey === versionKey;\n\nuseEffect(() => {\n    const subscription = AppState.addEventListener("change", (state) => {\n        if (state === "active") void refetch();\n    });\n    return () => subscription.remove();\n}, [refetch]);',
                            note: "전에는 앱을 켤 때 받은 버전에 갇혀 켜 둔 동안 나온 버전을 몰랐고, ‘나중에’도 무엇을 미뤘는지 없이 참/거짓 하나였습니다. 지금은 복귀마다 다시 묻고, 미룬 건 그 버전 하나뿐입니다.",
                        },
                    ],
                },
            ],
            sheets: [
                {
                    title: "테마 두 벌 — 홈",
                    note: "같은 화면, 같은 토큰입니다. 지도 타일도 함께 바뀝니다. 다크에서는 네이버 지도 야간 팔레트로 바꾸고, 그 위의 컨트롤도 팔레트를 따릅니다. 컨트롤을 밝은 색으로 고정해 두면 어두운 지도 위에 흰 원판만 떠 있게 됩니다.",
                },
                {
                    title: "테마 두 벌 — 신호색",
                    note: "미확인·처리 완료·거절함은 색상을 지킨 채 명도만 뒤집습니다. 그래도 색만으로 상태를 구분하지는 않습니다. 레일 굵기와 행 배경도 상태를 드러내고, 모든 줄에 상태 라벨을 붙입니다.",
                },
                {
                    title: "앱 아이콘",
                    note: "바탕 네이비 #161D36은 안드로이드 적응형 아이콘과 부팅 스플래시도 같이 씁니다. 선만으로 쌓은 블록 가운데 한 칸에만 색을 넣어서, 작게 줄여도 그 파란 칸은 남습니다.",
                },
                {
                    title: "스플래시 — 다크 · 라이트",
                    note: "앱이 그리는 스플래시도 테마를 따라 두 벌입니다. 로고는 선 색이 흰색과 남색으로 달라서, 색만 바꾸는 대신 PNG를 테마마다 따로 둡니다. 다크의 배경색 #080D16이 이 페이지의 배경색이기도 합니다.",
                },
            ],
            pipeline: {
                title: "좌표 하나가 관제실까지 가는 길",
                lede: "좌표는 10초에 한 번은 반드시 관제실에 들어가야 하지만, 들어오는 좌표를 다 보낼 수는 없습니다. 쓸 수 없는 건 걸러야 하고, 너무 촘촘히 거르면 전송이 통째로 멈춥니다. 흔한 상황 네 가지가 관문마다 어떻게 갈리는지 아래에 정리했습니다.",
                stages: [
                    {
                        name: "측위",
                        detail: "10초 주기로 좌표가 들어옵니다. 정지 감지는 껐습니다. 정지 상태로 바뀌는 순간 두 OS 모두 좌표를 더 주지 않아서, 배터리를 조금 더 쓰더라도 끊기지 않는 쪽을 택했습니다. 처음엔 이 옵션을 엉뚱한 설정 묶음에 넣어 라이브러리가 통째로 무시했는데, 타입 검사는 통과했습니다. 실기기에서 4.5분 만에 좌표가 멎는 걸 로그로 보고서야 찾았습니다. 근무가 닫혀 있으면 추적 자체를 시작하지 않습니다.",
                    },
                    {
                        name: "신선도",
                        detail: "측정한 지 10분이 지난 좌표는 버립니다. 원래 90초였는데, 실내에서 네트워크 측위 갱신이 7~185초로 들쭉날쭉해 전부 걸러졌습니다.",
                    },
                    {
                        name: "역전",
                        detail: "이전보다 뒤로 간 좌표는 연속 3회 들어오고 측정 시각이 단조 증가할 때만 받습니다. 한 건만 보고 받으면 캐시된 옛 좌표 때문에 관제실에 찍힌 위치가 과거로 되돌아갑니다.",
                    },
                    {
                        name: "중복",
                        detail: "같은 측위가 되풀이되면 버리되, 주기의 절반인 5초가 지나면 같은 좌표라도 다시 내보냅니다. 주기와 같은 10초로 두면 경계에서 좌표가 하나씩 걸러 버려집니다.",
                    },
                    {
                        name: "전송",
                        detail: "관제실이 받은 시각을 갱신합니다. 화면이 보는 건 전송 시도가 아니라 이 시각입니다.",
                    },
                ],
                cases: [
                    {
                        label: "실외 · 이동 중",
                        hint: "GPS가 잡히고 요원이 걷고 있는, 가장 흔한 상태입니다.",
                        verdicts: ["pass", "pass", "pass", "pass", "pass"],
                        outcome: "10초마다 그대로 올라갑니다. 홈의 배지는 온라인을 유지합니다.",
                    },
                    {
                        label: "실내 · 정지",
                        hint: "GPS가 안 잡히고 네트워크 측위만 남습니다. 같은 캐시 좌표가 시각까지 똑같이 되풀이됩니다.",
                        verdicts: ["pass", "pass", "pass", "drop", "skip"],
                        outcome:
                            "이 좌표는 중복으로 버려집니다. 다만 5초가 지나면 같은 좌표라도 내보내고, 그마저 없으면 10초 타이머가 마지막 좌표를 다시 올립니다. 전부 버리면 수신 시각이 멈춰서, 앱은 멀쩡한데도 3분 끊김 판정에 걸립니다.",
                    },
                    {
                        label: "좌표가 뒤로 튈 때",
                        hint: "기지국이 바뀌거나 캐시가 섞이면 이전보다 과거의 위치가 들어옵니다.",
                        verdicts: ["pass", "pass", "drop", "skip", "skip"],
                        outcome:
                            "한 건만 보고 받지 않습니다. 같은 방향이 연속 3회 확인되고 측정 시각이 앞으로 갈 때만 기기 시계가 밀린 것으로 보고 새 위치를 인정합니다.",
                    },
                    {
                        label: "근무가 닫혔을 때",
                        hint: "관제실이 근무를 종료하면 앱은 포그라운드로 돌아올 때마다 그 사실을 확인합니다.",
                        verdicts: ["drop", "skip", "skip", "skip", "skip"],
                        outcome:
                            "관문을 거치기 전에 추적을 멈춥니다. 전송과 GPS를 함께 끄고, 홈과 설정이 동시에 근무 종료로 바뀝니다.",
                    },
                ],
                note: "관문 수치는 실기기에서 관측한 값에 맞춰 조정했습니다. 실내 갱신 간격 7~185초는 실측값이고, 신선도 한계 10분과 중복 재전송 5초가 여기서 나왔습니다. 10초 동안 관문을 통과한 좌표가 하나도 없어도 마지막 좌표를 다시 올립니다. 어떤 상태에서든 10초마다 좌표를 보낸다는 게 이 앱의 약속입니다.",
            },
        },
        "korea-baptist": {
            cases: [
                {
                    label: "URL이 늘 똑같아서, 중복을 주소로는 못 걸렀다",
                    problem:
                        "교회에 붙인 NFC 태그와 QR에는 파라미터 없는 같은 주소가 들어 있습니다. iOS는 앱이 꺼진 상태에서 열리면 초기 URL과 url 이벤트가 같이 들어오고, 안드로이드는 재진입할 때마다 인텐트를 다시 던집니다. 링크 문자열이 늘 같으니 무엇이 중복인지 주소로는 가릴 수가 없었습니다. 출시한 뒤에는 한 가지가 더 드러났습니다. OTA 업데이트로 앱을 다시 불러오면 프로세스는 그대로라 남아 있던 인텐트를 새 런타임의 getInitialURL()이 한 번 더 돌려줍니다. 메모리에 둔 쿨다운은 리로드로 초기화돼서, 업데이트 직후 같은 출석이 다시 나갔습니다.",
                    approach:
                        "중복 판정 기준을 주소에서 상태로 바꿨습니다. 네 가지 중복 경로(iOS 콜드 스타트, 안드로이드 재진입, 연속 태그, 오프라인 재태그)를 처리 중 플래그 · 대기 중인 태그 한 건 · 쿨다운 3초 세 가드로 막고, 대기 중인 태그는 10분이 지나면 버립니다. 재개 트리거는 다섯 개를 달았습니다. 그중 30초 타이머는 연결은 살아 있는데 타임아웃만 계속 나는 상황을 빠져나올 유일한 방법입니다. 리로드 문제는 리로드 직전에 시각을 남겨 두고, 다음 실행에서 10초 안이면 getInitialURL()의 출석 링크를 한 번만 건너뛰게 했습니다. 오늘 이미 출석했는지는 앱이 미리 막지 않습니다. 회원 정보가 부팅 시점 스냅샷이라, 앱을 끄지 않고 자정을 넘긴 사람은 영영 출석을 못 하게 되거든요. 중복 출석은 서버 응답(4003)을 받아 따로 안내합니다.",
                    result: "콜드 스타트, 백그라운드 복귀, 연속 태그, 미로그인, OTA 리로드 직후를 안드로이드와 iOS 실기기에서 확인했습니다. 오프라인에서 태그한 뒤 연결되는 순간 출석이 올라가는 경로는 코드와 문서의 시나리오로만 정리했고, 아직 실기기 검증 전입니다.",
                    metrics: [
                        {
                            label: "중복 경로 · 가드",
                            value: "4가지 · 3개",
                        },
                        {
                            label: "재개 트리거",
                            value: "5개",
                        },
                        {
                            label: "대기 유효시간",
                            value: "10분",
                        },
                    ],
                    changes: [
                        {
                            file: "src/hooks/useAttendanceDeepLink.ts",
                            commit: "d718746 · 2026.07.31",
                            before: "// receive 를 직접 의존성에 넣지 않는다. 구독이 다시 걸리면 getInitialURL 이 최초 실행 URL 을\n// 한 번 더 돌려줘 중복 출석으로 이어진다.\nuseEffect(() => {\n    Linking.getInitialURL()\n        .then((url) => receiveRef.current(url))\n        .catch(() => {});",
                            after: "const [reloadedAt, url] = await Promise.all([\n    AsyncStorage.getItem(launchKey.UPDATE_RELOADED_AT).catch(() => null),\n    Linking.getInitialURL().catch(() => null),\n]);\n\nif (reloadedAt) AsyncStorage.removeItem(launchKey.UPDATE_RELOADED_AT).catch(() => {});\n\nconst justReloaded =\n    !!reloadedAt && Date.now() - Number(reloadedAt) < RELOAD_SUPPRESS_WINDOW_MS;\n\nif (justReloaded && isAttendanceLink(url)) {\n    attendanceState.hasDeepLinkIntent = true;\n    return;\n}\n\nreceiveRef.current(url);",
                            note: "전에는 OTA 리로드 뒤에도 getInitialURL()이 돌려준 리로드 전 링크를 그대로 처리해서 출석 요청이 한 번 더 나갔습니다. 양 플랫폼에서 재현했습니다. 지금은 리로드 표식이 있으면 그 한 번만 건너뜁니다. 태그 중복을 거르는 가드는 이 훅을 처음 만들 때부터 들어가 있어서 전후를 비교할 코드가 없습니다.",
                        },
                    ],
                },
                {
                    label: "401이 동시에 여러 개 떠도 갱신은 한 번만",
                    problem:
                        "화면 하나가 뜰 때 요청이 여러 개 같이 나갑니다. 처음 코드에도 만료 5분 전 선제 갱신과 재시도 표시는 있었고, 동시에 온 요청은 isRefreshing 플래그와 구독자 큐로 묶고 있었습니다. 그런데 갱신을 시작한 요청은 갱신을 끝내 큐를 비운 다음, 자기도 그 큐에 구독하고 기다렸습니다. 이미 비워진 큐라 아무도 깨워 주지 않아서 그 요청은 영영 끝나지 않았습니다. 갱신이 실패하면 실패한 요청마다 로그아웃(토큰 삭제 · 캐시 비우기 · 로그인 화면 이동)을 따로 불러서, 같은 처리가 요청 수만큼 반복됐습니다.",
                    approach:
                        "구독자 큐를 걷어내고 진행 중인 갱신 프로미스 하나를 공유하게 바꿨습니다(single-flight). 갱신이 진행 중이면 뒤따라온 요청은 새로 시도하지 않고 그 프로미스를 그대로 기다리고, 갱신을 시작한 요청도 같은 프로미스를 받습니다. 끝나면 성공이든 실패든 finally에서 비웁니다. 세션 만료 처리는 플래그를 둬서 한 번만 돌게 하고, 그 뒤에 온 요청은 SESSION_EXPIRED로 바로 거절합니다. 만료 안내 모달도 이때 함께 붙였습니다.",
                    result: "동시에 401이 몇 개가 오든 리프레시 요청은 한 번만 나가고, 갱신에 성공하면 원래 요청이 새 토큰으로 그대로 이어집니다. 갱신이 끝내 실패하면 만료 처리와 안내는 한 번만 돌고, 서버가 준 메시지를 덮어쓰지 않고 호출한 화면까지 그대로 올려 보냅니다.",
                    metrics: [
                        {
                            label: "리프레시 요청",
                            value: "1회",
                        },
                        {
                            label: "만료 처리",
                            value: "요청 수만큼 → 1회",
                        },
                        {
                            label: "선제 갱신",
                            value: "만료 5분 전",
                        },
                    ],
                    changes: [
                        {
                            file: "src/services/isntance.ts (지금은 instance.ts)",
                            commit: "b9adad1 · 2026.01.22 · 5c17cd2 · 2026.02.19",
                            before: "if (isTokenExpiringSoon(accessTokenExpires)) {\n    if (!isRefreshing) {\n        isRefreshing = true;\n        try {\n            // ...\n            onRefreshed(refreshResponse.jwt_token.access_token);\n        } catch (err) {\n            onRefreshFailed(err);\n            await redirectToSignIn();\n            return Promise.reject(err);\n        } finally {\n            isRefreshing = false;\n        }\n    }\n\n    // ✅ refresh 완료(성공/실패)까지 대기\n    const token = await subscribeTokenRefresh();",
                            after: "let refreshPromise: Promise<string> | null = null;\n\nconst getFreshAccessToken = async (): Promise<string> => {\n    if (refreshPromise) return refreshPromise;\n\n    refreshPromise = (async () => {\n        // ...\n        return next.accessToken;\n    })().finally(() => {\n        refreshPromise = null;\n    });\n\n    return refreshPromise;\n};\n// ...\nconst triggerSessionExpiredOnce = async () => {\n    if (sessionExpired) return;\n    sessionExpired = true;\n    // ...",
                            note: "전에는 갱신을 시작한 요청이 onRefreshed로 큐를 비운 다음 subscribeTokenRefresh()로 빈 큐에 들어가 기다렸습니다. 지금은 모든 요청이 같은 프로미스를 받습니다. 만료 처리도 전에는 실패한 요청마다 redirectToSignIn()을 불렀고, 지금은 플래그가 한 번만 통과시킵니다.",
                        },
                    ],
                },
                {
                    label: "targetSdk 한 줄이 상태바 구조를 통째로 바꿨다",
                    problem:
                        "Play 정책 때문에 targetSdk를 35에서 36으로 올렸습니다. API 35부터는 edge-to-edge가 강제되고 옵트아웃 수단이 사라져서 statusBarColor도 setDecorFitsSystemWindows도 그냥 무시됩니다. 헤더 계층과 루트 SafeArea는 “안드로이드는 시스템 바가 앱 창 밖이라 상단 인셋이 0”이라는 전제로 짜여 있었습니다. 헤더는 인셋 대신 고정 10dp만 비웠는데, 이제 창이 상태바 뒤까지 넓어지니 헤더가 상태바와 겹쳤습니다.",
                    approach:
                        "한쪽으로 통일하는 대신 경계를 하나만 공유하기로 했습니다. 네이티브(MainActivity)는 SDK 35를 기준으로 분기하고, JS도 같은 기준을 상수 하나(IS_EDGE_TO_EDGE)로 봅니다. edge-to-edge에서는 헤더가 상태바 자리를 인셋만큼 직접 비우고, 그 미만에서는 비우면 안 됩니다. 시스템이 이미 비워 둔 자리에 여백을 한 번 더 주면 내용이 헤더 가운데에서 아래로 내려앉거든요. 키보드 Provider도 창을 edge-to-edge로 바꾸기 때문에 API 35 미만에서는 마운트하지 않습니다.",
                    result: "드로어 헤더와 뒤로가기 헤더가 같은 공식을 쓰니 높이가 어긋나지 않습니다. 구버전 경로는 62dp로 전체 높이는 그대로이고, 내용이 헤더 정중앙에 옵니다. 구버전 경로는 최신 기기에서 강제로 재현해 픽셀 단위로 다시 쟀습니다.",
                    metrics: [
                        {
                            label: "분기 경계",
                            value: "SDK 35",
                        },
                        {
                            label: "헤더 높이",
                            value: "인셋+54 / 62",
                        },
                        {
                            label: "함께 고칠 곳",
                            value: "2군데",
                        },
                    ],
                    changes: [
                        {
                            file: "src/components/header/ (_constants · DrawerHeader.tsx) · src/constants/platform.ts",
                            commit: "54bbfc5 · 2026.07.31",
                            before: "// _constants/index.ts\n/**\n * 안드로이드는 시스템 바가 앱 창 밖이라 insets.top 이 0 이다(AppContent 참고).\n * 그대로 두면 헤더가 상태바에 붙으므로 iOS 의 safe area 가 만들어주는 만큼을 직접 준다.\n */\nconst ANDROID_TOP_SPACING = 10;\n// ...\nconst ANDROID_CONTENT_HEIGHT = 52;\n\n// DrawerHeader.tsx\nconst topInset = isAndroid ? ANDROID_TOP_SPACING : insets.top;\nconst contentHeight = isAndroid ? ANDROID_CONTENT_HEIGHT : CONTENT_HEIGHT;",
                            after: '// src/constants/platform.ts\nconst IS_EDGE_TO_EDGE = Platform.OS !== "android" || Platform.Version >= 35;\n\n// DrawerHeader.tsx\nconst topInset = IS_EDGE_TO_EDGE ? insets.top : 0;\nconst contentHeight = IS_EDGE_TO_EDGE ? CONTENT_HEIGHT : ANDROID_HEADER_HEIGHT;',
                            note: "전에는 플랫폼(isAndroid)으로만 갈라 API 35 이상 기기에서도 10dp만 비웠습니다. 지금은 edge-to-edge 여부로 갈라 인셋만큼 비웁니다. Galaxy Note20에서는 인셋 32.71에 54를 더한 86.71dp입니다. 네이티브의 같은 분기(Build.VERSION_CODES.VANILLA_ICE_CREAM)와 짝을 이룹니다.",
                        },
                    ],
                },
                {
                    label: "1페이지에서 끝나던 목록을 끝까지 읽게",
                    problem:
                        "주보와 소식 목록은 첫 페이지만 보여 줬습니다. 페이지 번호 컴포넌트와 훅은 저장소에 있었지만 화면에 연결된 곳이 없어서, 이전 글로 갈 방법이 없었습니다. 리디자인하면서 페이지 번호와 정렬 토글을 붙였는데 서버가 정렬 파라미터를 지원하지 않았습니다. 그래서 처음엔 총 페이지 수를 시작점으로 잡고 뒤에서부터 읽는 우회로를 만들었고, 오래된순을 보려면 최신순을 한 번 받아 총 페이지 수를 알아야 하는 구조가 됐습니다.",
                    approach:
                        "다음 날 서버 쪽에 sort 파라미터를 요청해 정렬을 서버로 넘기고, 역순 읽기와 그걸 지탱하던 상태 · 유틸을 걷어냈습니다. 번호 버튼은 무한 스크롤로 바꿨습니다. 서버가 next를 주지 않아 끝은 누적 건수로 판단합니다. 끝 표시는 항목 수가 아니라 스크롤이 실제로 생겼는지로 붙입니다. 글자 크기 설정과 기기 높이에 따라 기준이 달라지기 때문입니다.",
                    result: "정렬이 무엇이든 1페이지부터 앞으로 읽습니다. 번호 페이지네이션 컴포넌트와 훅, 역순 읽기 유틸을 저장소에서 지웠고, 그 유틸들의 테스트 9건도 함께 빠졌습니다. 서버 정렬은 실서버에서 2페이지 이상 넘겨 보며 확인했습니다.",
                    metrics: [
                        {
                            label: "지운 모듈",
                            value: "3개",
                        },
                        {
                            label: "정렬 판정",
                            value: "앱 → 서버",
                        },
                        {
                            label: "지운 테스트",
                            value: "9건",
                        },
                    ],
                    changes: [
                        {
                            file: "src/hooks/useInfiniteNoticeList.ts",
                            commit: "9db1fbc · 2026.09.01",
                            before: 'const isReverseRead = sortOrder === "oldest" && !supportsServerSort;\n\nconst query = useInfiniteQuery({\n    queryKey: [...queryKey, churchId, sortOrder, isReverseRead ? totalPages : 0],\n    queryFn: ({ pageParam }) => fetchPage(pageParam, sortOrder),\n    initialPageParam: isReverseRead ? totalPages : 1,\n    getNextPageParam: (lastPage, allPages, lastPageParam) => {\n        if (isReverseRead) {\n            return lastPageParam > 1 ? lastPageParam - 1 : undefined;\n        }\n        // ...',
                            after: "queryKey: [...queryKey, churchId, sortOrder],\nqueryFn: ({ pageParam }) => fetchPage(pageParam, sortOrder),\ninitialPageParam: 1,\ngetNextPageParam: (lastPage, allPages, lastPageParam) => {\n    // 서버가 next 를 주지 않아 누적 건수로 끝을 판단한다\n    const loaded = allPages.reduce((sum, page) => sum + page.results.length, 0);\n    if (!lastPage.results.length || loaded >= lastPage.count) return undefined;\n\n    return lastPageParam + 1;\n},",
                            note: "전에는 오래된순이면 총 페이지 수(totalPages)부터 거꾸로 요청했고, 그 값을 얻으려고 최신순 응답을 먼저 받아야 했습니다. 지금은 sort=oldest로 1페이지부터 앞으로 읽습니다. 역순 읽기는 전날 만든 임시 우회로였고, 서버 정렬이 들어오자마자 걷어냈습니다.",
                        },
                    ],
                },
                {
                    label: "인터넷이 멀쩡한데 오프라인 화면이 떴다",
                    problem:
                        "iOS에서만, 그것도 가끔 데이터가 잘 되는데 오프라인 화면으로 넘어갔습니다. 따라가 보니 연결 판정을 하는 주체가 플랫폼마다 달랐습니다. 안드로이드는 OS가 이미 아는 값을 바로 돌려주지만, iOS 네이티브는 이 값을 아예 내보내지 않습니다. 그래서 NetInfo가 JS에서 구글 도메인에 요청을 하나 보내고 그 성패로 판정합니다. 실패하면 5초 뒤에 다시 검사하는데 앱의 디바운스는 2초였습니다. 요청 하나만 삐끗해도 오프라인 화면이 뜰 수밖에 없는 구조였습니다. 고치다 보니 결함이 더 나왔습니다. 온라인으로 돌아왔을 때 지금 화면이 오프라인 화면이 아니면 그냥 return해서, 오프라인 플래그가 true로 굳고 그 뒤로는 감지도 복구도 멈췄습니다. 앱 복귀 직후에 온 false를 버리던 것도 문제였습니다. NetInfo는 같은 값을 다시 알려 주지 않아서, 버린 그 한 번이 진짜 오프라인이었다면 다음 연결 변화까지 영영 못 잡습니다.",
                    approach:
                        "판정 기준을 구글이 아니라 앱 서버의 /health로 옮겼습니다. 요청 타임아웃은 8초, 재검사는 3초로 두고, 디바운스는 재검사 주기보다 길게 6초로 늘렸습니다. 재검사가 디바운스보다 늦으면 회복 신호가 화면 전환 뒤에 도착하기 때문입니다. 이 설정은 기존 리스너를 모두 끊어 버리므로 index.js에서 한 번만 부릅니다. 복귀 직후의 false는 버리지 않고 남은 무시창만큼 판정을 미룹니다. 단선은 잔상이 아니라서 바로 셉니다. 복구는 온라인이 확정됐을 때만 합니다. 재검사를 시작하면 판정이 잠깐 null로 돌아가는데, 그걸 온라인으로 읽으면 화면이 돌아갔다가 다시 오프라인으로 튑니다.",
                    result: "/health는 인증 없이 리다이렉트 없이 95ms에 200을 돌려줍니다. iOS 실기기에서 앱 진입 시 메인 화면이 정상으로 나오는 것을 확인했습니다. 다만 증상이 간헐적이라 한 번 안 나온 것으로 해결을 증명할 수는 없어서, 닫지 않고 재발을 지켜보고 있습니다. 재발하면 무엇부터 가를지(서버 응답 시간 → 단선 여부 → 타이밍 값)도 문서에 적어 뒀습니다.",
                    metrics: [
                        {
                            label: "판정 기준",
                            value: "구글 → 앱 서버",
                        },
                        {
                            label: "디바운스",
                            value: "2초 → 6초",
                        },
                        {
                            label: "재검사 주기",
                            value: "5초 → 3초",
                        },
                    ],
                    changes: [
                        {
                            file: "src/hooks/useNetworkGuard.ts",
                            commit: "5c71916 · 2026.08.19",
                            before: "const RESUME_IGNORE_MS = 3000;\nconst OFFLINE_DEBOUNCE_MS = 2000;\n// ...\nif (!online && Date.now() - lastResumeAtRef.current < RESUME_IGNORE_MS) {\n    return;\n}\n// ...\nif (isOfflineRef.current) {\n    const currentRoute = navigationRef.getCurrentRoute()?.name;\n\n    if (currentRoute !== rootNavigations.OFFLINE) return;\n\n    isOfflineRef.current = false;",
                            after: "const RESUME_IGNORE_MS = 10000;\nconst OFFLINE_DEBOUNCE_MS = 6000;\n// ...\nconst resumeRemaining = state.isConnected\n    ? Math.max(0, RESUME_IGNORE_MS - (Date.now() - lastResumeAtRef.current))\n    : 0;\n// ...\nif (!isOfflineRef.current) return;\n\nif (state.isInternetReachable !== true) return;\n\nconst currentRoute = navigationRef.getCurrentRoute()?.name;\n\nif (currentRoute !== rootNavigations.OFFLINE) {\n    isOfflineRef.current = false;\n    lastStateRef.current = null;\n\n    return;\n}",
                            note: "전에는 복귀 3초 안의 false를 그냥 버렸고, 복구 때 화면이 오프라인이 아니면 플래그를 남긴 채 빠져나갔습니다. 지금은 false를 남은 시간만큼 미뤄 두고, 복구 때는 화면과 상관없이 플래그를 정리합니다.",
                        },
                        {
                            file: "index.js",
                            commit: "5c71916 · 2026.08.19",
                            after: 'NetInfo.configure({\n    reachabilityUrl: `${API_URL}/health`,\n    reachabilityMethod: "GET",\n    reachabilityTest: async (response) => response.status === 200,\n    reachabilityRequestTimeout: 8 * 1000,\n    reachabilityShortTimeout: 3 * 1000,\n});',
                            note: "새로 넣은 설정입니다. 전에는 이 설정이 없어 iOS가 구글 도메인(generate_204)으로 판정했습니다. GET으로 둔 건 기본값 HEAD를 서버가 405로 막으면 그대로 오프라인이 되기 때문이고, 기본 판정이 204라 200으로 함께 바꿨습니다.",
                        },
                    ],
                },
                {
                    label: "재설치하면 지문을 찍고 나서야 실패했다",
                    problem:
                        "간편 로그인(생체 인증)은 로그인 정보를 Keychain에 봉인해 둡니다. 그런데 Keychain은 앱을 지워도 남고, 로그인 기록을 둔 AsyncStorage는 지워집니다. 재설치하면 봉인만 살아남아서 자동 인증이 돌고, 사용자는 지문을 찍은 다음에야 실패를 봤습니다. 안드로이드는 더 나빴습니다. 재설치하면 Keystore 키가 새로 만들어져 예전 암호문을 풀 수 없는데, 이때 라이브러리가 던지는 건 키 무효화 예외가 아니라 복호화 실패 예외였습니다. 이 오류가 분류되지 않고 unknown으로 떨어졌고, unknown은 봉인을 지우지 않아서 앱을 켤 때마다 프롬프트와 실패 모달이 반복됐습니다. 여기에 하나가 더 겹쳤습니다. 로그인 요청은 FCM 토큰을 캐시에서만 읽는데, 그 캐시는 서버 왕복 두 번을 마친 뒤에야 채워집니다. 재설치 직후의 자동 로그인은 서버에서 fcm_token 없음으로 거절됐습니다.",
                    approach:
                        "세 군데를 따로 막았습니다. 봉인은 있는데 로그인 기록이 없으면 이전 설치의 잔재로 보고 인증을 띄우기 전에 지웁니다. 복호화 실패는 무효화와 같게 분류해서, 한 번 실패하면 봉인을 확실히 버리고 재등록으로 넘어가게 했습니다. 두 방어는 서로를 메웁니다. 잔재 정리만으로는 안 잡혔는데, Galaxy S24+처럼 재설치해도 AsyncStorage가 살아남는 기기가 있었기 때문입니다. FCM 토큰은 캐시가 비어 있으면 SDK에서 직접 받습니다. 캐시를 채우는 시점을 앞당기지는 않았습니다. 지금 그 캐시는 서버에 등록된 토큰이라는 뜻이라, 앞당기면 등록에 실패해도 저장돼 영영 다시 등록되지 않는 경로가 생깁니다.",
                    result: "Galaxy S24+(API 36)와 iOS 실기기에서 재설치해 봤습니다. 첫 실행에서 무효화 안내가 한 번 뜨고, 그 뒤로는 프롬프트가 뜨지 않습니다. 실기기 로그의 오류 문구 그대로 단위 테스트를 만들어 분류를 고정했습니다.",
                    metrics: [
                        {
                            label: "실패 반복",
                            value: "매 실행 → 첫 실행 1회",
                        },
                        {
                            label: "막은 곳",
                            value: "3곳",
                        },
                        {
                            label: "검증 기기",
                            value: "S24+ · iOS",
                        },
                    ],
                    changes: [
                        {
                            file: "src/hooks/useBiometricStatus.ts",
                            commit: "497932d · 2026.08.13",
                            before: "const [type, passcode] = await Promise.all([getBiometryType(), isPasscodeAvailable()]);\nconst available = !!type || passcode;\nconst has = available ? await hasBiometricLogin() : false;",
                            after: "const [type, passcode] = await Promise.all([getBiometryType(), isPasscodeAvailable()]);\nconst available = !!type || passcode;\nlet has = available ? await hasBiometricLogin() : false;\n\nif (has) {\n    const promptedAccount = await AsyncStorage.getItem(\n        authStorageKey.BIOMETRIC_PROMPTED_ACCOUNT,\n    );\n\n    if (!promptedAccount) {\n        await removeBiometricLogin();\n        has = false;\n    }\n}",
                            note: "전에는 봉인이 있기만 하면 자동 인증을 띄웠습니다. 지금은 이 설치에서 남긴 기록이 없으면 봉인을 먼저 지워서 프롬프트 자체가 뜨지 않습니다.",
                        },
                        {
                            file: "src/utils/biometricAuth.ts",
                            commit: "4003fdf · 2026.08.13",
                            after: 'if (/Decryption failed|Authentication tag verification failed|CryptoFailed/i.test(messageText)) {\n    return "invalidated";\n}',
                            note: "전에는 KeyPermanentlyInvalidated 문자열만 무효화로 봐서, 키가 교체된 경우는 unknown이 되고 봉인이 남았습니다. 지금은 복호화 실패도 무효화로 보고 봉인을 버립니다.",
                        },
                        {
                            file: "src/services/signin/index.tsx",
                            commit: "eeebd5c · 2026.08.13",
                            before: "const fcm_token = await getToken(tokenKey.FCM_TOKEN);",
                            after: "const fcm_token =\n    (await getToken(tokenKey.FCM_TOKEN)) ??\n    (await getFcmToken(getMessaging(getApp())).catch(() => null));",
                            note: "전에는 캐시가 비어 있으면 토큰 없이 로그인을 보내 거절당했습니다. 지금은 캐시가 비면 SDK에서 받아 보냅니다.",
                        },
                    ],
                },
                {
                    label: "모달 하나가 앱 전체 모달을 멈춰 세웠다",
                    problem:
                        "출석 결과, 세션 만료 안내, 업데이트 안내는 전부 전역 모달 큐에 줄을 섭니다. 앱이 꺼진 상태에서 NFC로 켜면 출석은 되는데 결과 모달이 안 뜨고, 그 뒤로는 바텀시트까지 열리지 않았습니다. 원인은 두 겹이었습니다. iOS는 콜드 스타트 직후처럼 화면이 전환 중이면 네이티브 모달을 띄우라는 요청을 조용히 무시합니다. 그런데 라이브러리는 자기 타이머로 표시 완료 이벤트를 보내서 JS는 모달이 떠 있다고 믿습니다. 큐를 비우는 유일한 길이 모달이 닫혔다는 이벤트인데, 화면에 없으니 닫을 수가 없었습니다. 큐 자체에도 경쟁 조건이 있었습니다. 지금 떠 있는 모달을 effect로 한 박자 늦게 기록해서, 같은 순간에 모달을 두 번 열면 둘 다 빈자리로 보고 첫 모달을 덮어썼습니다. 덮인 모달의 Promise는 영원히 끝나지 않았습니다. 나중에는 안드로이드에서 모달이 떠 있어도 뒤로가기가 ‘한 번 더 누르면 종료’ 토스트로 빠지는 일도 생겼습니다.",
                    approach:
                        "먼저 원인을 확정했습니다. 4초를 늦추면 100% 뜨고(실패 1.2초 · 성공 4.8초), Release 빌드에서도 재현되고, 뜨지 않은 모달 뒤로 탭바가 그대로 눌렸습니다. 스플래시나 내비게이션 준비는 그보다 먼저 끝나 있었습니다. 그래서 모달이 네이티브 모달을 거치지 않고 화면 안의 뷰로 그려지게 바꿨습니다. 큐는 state에서 ref로 옮기고, 지금 떠 있는 모달의 기록을 state와 같은 순간에 바꿉니다. 줄이 비어 있지 않으면 빈자리가 보여도 뒤에 서게 해서 먼저 선 모달을 새치기하지 못하게 했습니다. 뒤로가기는 안드로이드가 나중에 등록한 핸들러부터 부르는 구조라, 등록 순서에 기대던 게 문제였습니다. 화면을 오갈 때마다 종료 핸들러가 다시 등록되며 앞으로 나왔으니까요. 모달 쪽 핸들러를 모달이 떠 있는 동안에만 등록해서 항상 가장 먼저 불리게 했습니다.",
                    result: "콜드 스타트 직후에도 출석 결과가 뜨고, 모달 하나 때문에 큐 전체가 멈추는 일이 없어졌습니다. 모달을 화면 안의 뷰로 바꾼 뒤에도 안드로이드 뒤로가기로 모달이 닫히는 것은 확인했습니다. 그 뒤에 따로 고친 뒤로가기 등록 순서는 타입 검사 · 린트 · 코드 리뷰까지 거쳤고, 안드로이드 실기기 확인은 남아 있습니다.",
                    metrics: [
                        {
                            label: "실패 · 성공 경계",
                            value: "1.2초 · 4.8초",
                        },
                        {
                            label: "모달 렌더링",
                            value: "네이티브 → 화면 안의 뷰",
                        },
                        {
                            label: "대기 큐",
                            value: "state → ref",
                        },
                    ],
                    changes: [
                        {
                            file: "src/context/GlobalModalContext.tsx",
                            commit: "701d43d · 2026.07.30",
                            before: "const [, setQueue] = useState<AnyQueueItem[]>([]);\nconst [current, setCurrent] = useState<AnyQueueItem | null>(null);\nconst currentRef = useRef<AnyQueueItem | null>(null); // 항상 최신 current 저장\n// ...\nuseEffect(() => {\n    currentRef.current = current;\n}, [current]);\n// ...\nsetQueue((prev) => {\n    if (currentRef.current) {\n        return [...prev, entry as AnyQueueItem];\n    } else {\n        setCurrent(entry as AnyQueueItem);\n        return prev;\n    }\n});",
                            after: "const queueRef = useRef<AnyQueueItem[]>([]);\n\nconst [current, setCurrent] = useState<AnyQueueItem | null>(null);\nconst currentRef = useRef<AnyQueueItem | null>(null);\n// ...\nconst setCurrentSynced = useCallback((next: AnyQueueItem | null) => {\n    currentRef.current = next;\n    setCurrent(next);\n}, []);\n// ...\nif (currentRef.current || queueRef.current.length > 0) {\n    queueRef.current.push(entry as AnyQueueItem);\n    return;\n}\n\nsetCurrentSynced(entry as AnyQueueItem);",
                            note: "전에는 같은 순간에 두 번 열면 둘 다 빈자리를 봐서 첫 모달이 사라지고 그 Promise가 끝나지 않았습니다. 지금은 여는 순서대로 하나씩 뜹니다.",
                        },
                        {
                            file: "src/context/_components/ConfirmModal.tsx",
                            commit: "93eb171 · 2026.07.30",
                            before: "<ReactNativeModal\n    isVisible={visible}\n    backdropOpacity={backdropOpacity}",
                            after: "<ReactNativeModal\n    isVisible={visible}\n    // ...\n    coverScreen={false}\n    backdropOpacity={backdropOpacity}",
                            note: "전에는 iOS 네이티브 모달로 띄워서 콜드 스타트 직후의 요청이 무시됐습니다. 지금은 화면 안의 뷰로 그려서 그 경합이 없습니다. 코드에 절대 true로 되돌리지 말라는 주석을 달아 뒀습니다.",
                        },
                        {
                            file: "src/context/GlobalModalContext.tsx",
                            commit: "6ee5ad5 · 2026.08.26",
                            before: 'useEffect(() => {\n    const sub = BackHandler.addEventListener("hardwareBackPress", () => {\n        if (currentRef.current) {\n            dismissAndDequeue();\n            return true;\n        }\n        return false;\n    });\n    return () => sub.remove();\n}, [dismissAndDequeue]);',
                            after: 'useEffect(() => {\n    if (!current) return;\n\n    const sub = BackHandler.addEventListener("hardwareBackPress", () => {\n        if (!currentRef.current) return false;\n\n        dismissAndDequeue();\n        return true;\n    });\n    return () => sub.remove();\n}, [current, dismissAndDequeue]);',
                            note: "전에는 앱을 켤 때 한 번 등록해서, 화면을 오가며 다시 등록된 종료 핸들러가 앞을 차지했습니다. 지금은 모달이 뜰 때 등록돼 늘 먼저 불립니다. 관련 코드는 그동안 한 줄도 바뀌지 않았고, 부팅 직후엔 순서가 우연히 맞았을 뿐이었습니다.",
                        },
                    ],
                },
                {
                    label: "꺼져 있던 캡처 방지를 되살리자 화면이 걸렸다",
                    problem:
                        "성도증에는 QR과 성도 정보가 나와서 캡처를 막아야 합니다. 그런데 캡처 방지 코드가 사유 없이 주석으로 꺼져 있었습니다. 읽어 보니 끌 만한 결함이 셋 있었습니다. 이벤트 값은 8 미만이 비트 플래그가 아니라 순서 값인데 &로 검사해서, 알 수 없음(5)이 녹화로 잡히고 녹화를 끝낼 때마다 경고가 떴습니다. 경고 모달을 확인으로 닫을 때만 중복 방지 플래그를 풀어서, 취소나 뒤로가기로 닫으면 그 뒤로 캡처를 영영 감지하지 못했습니다. 포커스 판단은 홈의 탭 번호만 봐서, 다른 화면으로 넘어가도 캡처 차단이 따라다녔습니다. 되살린 뒤 성도증 화면에서는 다른 문제가 보였습니다. 일부 iOS 기기에서 진입과 뒤로가기 스와이프가 한 번 툭 걸렸습니다.",
                    approach:
                        "결함 셋은 그대로 고쳤습니다. 캡처와 녹화 시작만 같은 값으로 비교하고, 플래그는 finally에서 풀고, 활성 조건에 화면 포커스를 더했습니다. 걸림은 원인이 두 스레드에 하나씩 있었습니다. iOS의 캡처 방지는 앱 창의 레이어를 보안 입력창 밑으로 옮겨 붙이는 방식이라, 켜고 끌 때마다 창 전체가 다시 합성됩니다. 이걸 포커스에 걸어 두니 전환 애니메이션의 첫 프레임에 실행됐습니다. 그래서 켜는 건 누르는 순간 이동 직전으로 앞당기고, 끄는 건 전환이 끝난 뒤로 미뤘습니다. 보호가 비는 구간은 없습니다. JS 쪽에서는 1초마다 도는 진행 막대가 width를 보간하느라 네이티브 드라이버를 못 쓰고 있었습니다. scaleX로 바꿔 네이티브 드라이버로 넘겼습니다. 그라디언트가 막대 안을 꽉 채우는 구조라 픽셀은 똑같습니다.",
                    result: "캡처 방지 복원은 안드로이드와 iOS 실기기에서 확인했습니다. 실제 차단은 안드로이드만 되고 iOS는 감지만 가능하다는 것도 이때 정리했습니다. 전환 걸림 수정은 정적 검증만 거쳤고 실기기 확인은 남아 있습니다. ‘매초 다시 그려서 느리다’는 가설은 QR과 그림자 라이브러리가 이미 메모이즈하고 있다는 걸 확인하고 버렸습니다.",
                    metrics: [
                        {
                            label: "고친 결함",
                            value: "3건",
                        },
                        {
                            label: "보호가 비는 구간",
                            value: "0",
                        },
                        {
                            label: "진행 막대",
                            value: "JS → 네이티브 드라이버",
                        },
                    ],
                    changes: [
                        {
                            file: "src/screens/main/home/_tabScreen/TabIdentityScreen.tsx",
                            commit: "1ebb1d5 · 2026.08.03",
                            before: '//         const isCaptured = e === CaptureEventType.CAPTURED;\n//         const isRecording = (e & CaptureEventType.RECORDING) === CaptureEventType.RECORDING;\n//         const isEndRecording =\n//             (e & CaptureEventType.END_RECORDING) === CaptureEventType.END_RECORDING;\n\n//         if (!isCaptured && !isRecording && !isEndRecording) return;\n//         if (showingRef.current) return;\n//         showingRef.current = true;\n//         const ok = await modal.open("confirm", { /* ... */ });\n\n//         if (ok) {\n//             showingRef.current = false;\n//         }',
                            after: 'if (e !== CaptureEventType.CAPTURED && e !== CaptureEventType.RECORDING) return;\n\nif (showingRef.current) return;\nshowingRef.current = true;\n\ntry {\n    await modal.open("confirm", { /* ... */ });\n} finally {\n    showingRef.current = false;\n}',
                            note: "전에는 주석으로 꺼져 있었고, 켰다면 녹화 종료에도 경고가 뜨고 취소로 닫은 뒤엔 감지가 멈췄을 코드였습니다. 지금은 캡처와 녹화 시작에만 경고하고 어떻게 닫든 다음 캡처를 잡습니다.",
                        },
                        {
                            file: "src/screens/main/memberCard/MemberCardScreen.tsx · home/_sections/MemberCardSection.tsx",
                            commit: "a2d9c9b · 2026.08.31",
                            before: "useEffect(() => {\n    if (!isFocused) {\n        CaptureProtection.allow();\n        return;\n    }\n    // ...\n    return () => {\n        sub?.remove();\n        CaptureProtection.allow();\n        showingRef.current = false;\n    };\n}, [isFocused]);",
                            after: "const goToMemberCard = () => {\n    CaptureProtection.prevent({ screenshot: true, record: true });\n    navigation.navigate(rootMainNavigations.MEMBER_CARD);\n};\n// ...\nreturn () => {\n    sub?.remove();\n    showingRef.current = false;\n\n    allowTaskRef.current = InteractionManager.runAfterInteractions(() => {\n        allowTaskRef.current = null;\n        CaptureProtection.allow();\n    });\n};",
                            note: "전에는 켜고 끄는 게 전환 애니메이션 첫 프레임에 겹쳐 창 전체를 다시 합성했습니다. 지금은 이동 전에 켜 두고, 끄는 건 전환이 끝난 뒤에 합니다. 전환 끝 이벤트(transitionEnd)를 쓰지 않은 건, 새 화면이 움직이는 쪽일 때 성도증이 그 이벤트를 받지 못해 보호가 영영 안 풀리기 때문입니다.",
                        },
                    ],
                },
            ],
            sheets: [
                {
                    title: "아이덴티티",
                    note: "iOS 아이콘 · 안드로이드 적응형 아이콘 · 스플래시 원본. 적응형은 바깥이 잘려 나가서 안전 영역을 따로 잡습니다.",
                },
                {
                    title: "디자인 토큰",
                    note: "색 · 서체 · 간격 · 터치 영역을 코드 한 곳에 모으고 화면은 이름으로만 부릅니다. hex 이름으로 된 기존 색 키는 121개 파일에서 약 500번 쓰이고 있어서, 그대로 두고 의미 계층만 위에 얹어 회귀 없이 넘어갔습니다.",
                },
                {
                    title: "구조",
                    note: "부팅 순서와 내비게이션 트리를 한 장에 펼친 그림입니다. 위의 부팅 순서와 Provider 목록은 이 그림을 글로 풀어 쓴 것입니다.",
                },
            ],
            anatomy: {
                title: "홈 한 화면에 뭐가 물려 있나",
                lede: "세션, 캡처 방지, 웹뷰, 전역 모달이 한 화면에서 동시에 돕니다. 위에서부터 훑어보면 이렇습니다.",
                footnote:
                    "RootNavigator — Auth · Main(Drawer) · WebView · Camera · Offline / MainTab 5",
                notes: [
                    {
                        title: "성도증 카드 — 캡처가 막힌 화면으로 가는 입구",
                        body: "누르면 일정 시간마다 새로 그려지는 QR 화면으로 들어갑니다. 캡처와 녹화를 막는 레이어가 얹혀 있어서 화면을 켜는 순간 그 레이어가 다시 합성되고, 그 찰나가 눈에 띄어 전환 구간을 따로 손봤습니다.",
                    },
                    {
                        title: "바로가기 8칸 — 목적지는 전부 라우트 상수",
                        body: "타일이 가리키는 화면 이름은 상수 파일에만 있습니다. 문자열을 직접 적으면 오타가 타입 검사를 지나 런타임까지 살아남습니다. 8칸은 스크롤 없이 한 화면에 들어오는 최대 개수이기도 합니다.",
                    },
                    {
                        title: "헌금 카드 — 여기서부터는 웹뷰",
                        body: "금액을 누르면 결제는 앱 화면이 아니라 웹뷰에서 이어집니다. iOS만 웹뷰였던 걸 안드로이드까지 통일하면서 하드웨어 뒤로 가기 키의 동작을 나눴습니다. 같은 호스트 안이면 이전 페이지로, 밖이면 웹뷰를 닫습니다. 이 규칙이 모달의 뒤로 가기 처리와 겹쳐서, 등록 순서를 잡는 게 실제로 제일 까다로웠습니다.",
                    },
                    {
                        title: "생일 — 서버가 다음 페이지를 알려주지 않는다",
                        body: "목록 응답에 next가 없어서 누적 건수가 전체 건수에 이르거나 빈 페이지가 오면 끝으로 봅니다. 오늘 생일인 사람이 없는 날이 대부분이라, 목록이 비면 다가오는 생일 목록으로 바꿔서 섹션이 사라졌다 나타났다 하지 않게 했습니다.",
                    },
                    {
                        title: "가운데 탭 — 화면 이동이 아니라 전역 모달",
                        body: "누르면 라우트가 바뀌는 게 아니라 전역 모달 큐가 바텀시트를 올립니다. 출석은 어느 화면에서 시작하든 같은 동작이어야 하는데, 탭 전환으로 만들면 보고 있던 자리를 빼앗깁니다.",
                    },
                ],
            },
            runtime: {
                title: "순서를 지키지 않으면 조용히 깨지는 곳",
                lede: "부팅은 다섯 단계, Provider는 여덟 겹입니다. 대부분은 자리를 바꿔도 아무 일이 없지만 몇 군데는 에러 없이 기능만 사라집니다. ‘주의’ 표시가 붙은 곳이 그렇습니다.",
                payload: "<AppContent />",
                boot: [
                    {
                        name: "index.js",
                        role: "React가 올라오기 전에 도는 유일한 자리입니다. FCM 백그라운드 핸들러, 알림 탭을 담아 두는 큐, 연결 상태 판정 설정을 여기서 등록합니다.",
                        caution:
                            "백그라운드 핸들러를 App.tsx로 옮기면 앱이 꺼져 있을 때 온 푸시를 못 받습니다. 연결 상태 설정도 리스너가 붙기 전에 한 번만 불러야 합니다. 나중에 부르면 이미 등록된 리스너가 전부 끊깁니다.",
                    },
                    {
                        name: "App.tsx",
                        role: "Provider를 쌓고, 서체 7종을 다 불러올 때까지 화면을 내보내지 않습니다.",
                        caution:
                            "폰트 게이트를 빼면 첫 프레임이 기본 서체로 그려졌다가 한 번 더 다시 그려집니다.",
                    },
                    {
                        name: "AppContent",
                        role: "인증 상태를 보고 어떤 내비게이터를 띄울지 정하고, 상태바 색과 안전 영역을 맞춥니다.",
                    },
                    {
                        name: "RootNavigation",
                        role: "내비게이션 컨테이너. 딥링크 훅은 여기서 마운트합니다.",
                        caution:
                            "App.tsx에 두면 AuthProvider 바깥이라 useAuth()가 그대로 throw합니다. 컨테이너가 준비됐다는 신호도 여기서만 받을 수 있습니다.",
                    },
                    {
                        name: "RootNavigator",
                        role: "Auth · Main(Drawer) · WebView · Camera · Offline으로 갈라지고, 탭 5개는 Main 안에 있습니다.",
                    },
                ],
                tree: [
                    {
                        name: "GestureHandlerRootView",
                        role: "제스처 시스템의 뿌리. 트리 맨 바깥이어야 합니다.",
                    },
                    {
                        name: "KeyboardProvider",
                        role: "키보드가 올라올 때의 인셋을 다룹니다. API 35 미만에서는 아예 마운트하지 않습니다.",
                        caution:
                            "이 Provider가 창을 edge-to-edge로 바꿉니다. 구버전 경로에서 함께 켜지면 네이티브의 상태바 설정과 경합해서 헤더가 상태바를 덮거나 여백이 두 번 들어갑니다.",
                    },
                    {
                        name: "QueryClientProvider",
                        role: "서버에서 온 상태 전부. retry 0 · staleTime 0으로 두고, 다시 받는 시점은 화면이 정합니다.",
                    },
                    {
                        name: "SafeAreaProvider",
                        role: "안전 영역 인셋. 헤더 높이 공식이 여기서 나온 값을 씁니다.",
                    },
                    {
                        name: "BottomSheetModalProvider",
                        role: "바텀시트가 쓰는 컨텍스트.",
                    },
                    {
                        name: "GlobalQueuedModalProvider",
                        role: "전역 모달 큐. 출석 결과, 세션 만료 안내, 업데이트 안내가 여기로 줄을 섭니다.",
                    },
                    {
                        name: "AuthProvider",
                        role: "세션. 토큰 갱신이 끝내 실패하면 여기서 만료 처리를 합니다.",
                        caution:
                            "모달 Provider보다 바깥에 두면 만료 처리가 부르는 modal.open()이 없습니다. 에러도 안 나고, 세션이 끊긴 사용자가 아무 안내 없이 로그아웃될 뿐입니다.",
                    },
                    {
                        name: "Host (portalize)",
                        role: "포털. 바텀시트가 화면 트리 밖에 그려질 자리입니다.",
                    },
                ],
                note: "그림은 App.tsx의 실제 중첩 순서 그대로입니다.",
            },
        },
        imug: {
            cases: [
                {
                    label: "정지 명령을 누가 받았는지가 마운트 순서에 달려 있었다",
                    problem:
                        "앱이 부르는 정지 함수는 처음엔 플레이어만 멈췄습니다. 시력보호 오버레이와 스크롤 잠금은 따로 놀아서, 영상은 멈췄는데 화면은 그대로 움직였습니다. 쇼츠는 더 복잡했습니다. 세로로 이어진 슬라이드마다 플레이어가 있는데, 슬라이드마다 마운트될 때 window의 같은 함수를 덮어썼습니다. 그러면 명령은 마지막에 마운트된 슬라이드 하나만 받습니다. 그 슬라이드가 지금 보이는 것인지도 알 수 없었고, 함수 안에서 본 활성 여부도 마운트 당시 값에 멈춰 있었습니다.",
                    approach:
                        "영상 화면은 정지 함수 하나가 재생 · 스크롤 잠금 · 오버레이를 함께 바꾸게 묶었습니다. 쇼츠는 명령을 받는 자리를 슬라이드에서 페이지로 올렸습니다. 페이지의 Provider가 window에 함수를 한 번만 걸고 정지 상태를 Context로 내려주면, 각 슬라이드는 자기가 활성일 때만 그 상태를 보고 멈추거나 재생합니다. 페이지를 떠날 때는 걸어 둔 함수를 지웁니다.",
                    result: "앱이 멈추라고 하면 지금 보이는 영상이 멈추고 화면도 같이 잠깁니다. 쇼츠를 몇 장 넘겼든 명령을 받는 곳은 한 곳입니다.",
                    metrics: [
                        {
                            label: "명령 받는 곳",
                            value: "슬라이드마다 → 페이지 1곳",
                        },
                        {
                            label: "함께 바뀌는 것",
                            value: "재생 · 스크롤 · 오버레이",
                        },
                        {
                            label: "반응하는 슬라이드",
                            value: "활성 1개",
                        },
                    ],
                    changes: [
                        {
                            file: "src/pages/video/_component/VideoFrame.tsx",
                            commit: "026dce2 · 2024.10.29",
                            before: "useEffect(() => {\n    window.handleAppVideoPause = () => {\n        if (youtubeRef && youtubeRef.current && youtubeRef.current.internalPlayer) {\n            youtubeRef.current.internalPlayer.pauseVideo();\n        }\n    };\n    // ...\n}, []);",
                            after: "const { lockScroll, unlockScroll } = useLockBodyScroll();\nconst [isProtect, setIsProtect] = useState(false);\n\nuseEffect(() => {\n    window.handleAppVideoPause = () => {\n        if (youtubeRef && youtubeRef.current && youtubeRef.current.internalPlayer) {\n            youtubeRef.current.internalPlayer.pauseVideo();\n            lockScroll();\n            setIsProtect(true);\n        }\n    };\n    // ...\n}, []);",
                            note: "전에는 앱이 멈추라고 하면 플레이어만 멈췄습니다. 지금은 같은 함수가 스크롤을 잠그고 시력보호 오버레이까지 덮습니다.",
                        },
                        {
                            file: "src/pages/shorts/_component/ShortDetail.tsx → context/ShortProvider.tsx",
                            commit: "deba43c · 2024.11.07",
                            before: "// ShortDetail — 슬라이드마다 실행된다\nuseEffect(() => {\n    window.handleAppVideoPause = () => {\n        if (youtubeRef && youtubeRef.current && youtubeRef.current.internalPlayer) {\n            youtubeRef.current.internalPlayer.pauseVideo();\n            lockScroll();\n            setIsProtect(true);\n        }\n    };\n    window.handleAppVideoPlay = () => {\n        // ...\n        if (isActive) {\n            youtubeRef.current.internalPlayer.playVideo();\n        }\n    };\n}, []);",
                            after: "// ShortProvider — 페이지에 하나\nuseEffect(() => {\n    window.handleAppVideoPause = () => {\n        setIsPaused(true);\n    };\n    window.handleAppVideoPlay = () => {\n        setIsPaused(false);\n    };\n\n    return () => {\n        delete window.handleAppVideoPause;\n        delete window.handleAppVideoPlay;\n    };\n}, []);\n\n// ShortDetail\nuseEffect(() => {\n    if (!youtubeRef.current) return;\n\n    if (isPaused && isActive) {\n        youtubeRef.current.getInternalPlayer()?.pauseVideo();\n        lockScroll();\n        setIsProtect(true);\n    } else if (!isPaused && isActive) {\n        // ...\n    }\n}, [isPaused, isActive]);",
                            note: "전에는 슬라이드마다 같은 window 함수를 덮어써서 마지막에 마운트된 슬라이드만 명령을 받았고, 그 안의 isActive는 마운트 당시 값에 고정됐습니다. 지금은 페이지가 한 번 받아 상태로 내려주고, 활성 슬라이드만 반응합니다.",
                        },
                    ],
                },
                {
                    label: "시청 시간이 끝나도 영상은 계속 돌았다",
                    problem:
                        "처음에는 본 시간을 영상을 나갈 때 한 번 서버에 보냈고, 그 응답은 쓰지 않았습니다. 그래서 영상을 보는 도중에 하루치 시간을 다 써도 웹은 알 방법이 없었습니다. 아이가 영상 하나를 틀어 두면 한도를 넘겨서도 끝까지 봤습니다. 쇼츠를 붙일 때는 문제가 하나 더 생겼습니다. 이 훅은 라우터로 넘어온 영상 ID에 묶여 있었는데, 쇼츠는 슬라이드 여러 개가 동시에 마운트되니 그대로 쓰면 영상 ID가 없고 모든 슬라이드가 각자 타이머를 돌립니다.",
                    approach:
                        "재생 중일 때만 5초마다 누적 시청 시간을 보내고, 응답에 실려 오는 시청 가능 여부를 상태로 들고 있게 바꿨습니다. 화면은 그 값이 거짓이 되면 플레이어를 멈추고 스크롤을 잠근 뒤 제한 모달을 띄웁니다. 판단은 서버가 하고, 웹은 그 결과를 따르기만 합니다. 쇼츠를 위해서는 훅이 영상 ID를 라우터 대신 받은 영상에서 꺼낼 수 있게 하고, 활성 여부를 받아 활성 슬라이드만 시간을 세고 보내게 했습니다.",
                    result: "보던 영상도 다음 5초 보고에서 서버가 한도를 넘었다고 답하면 그 자리에서 멈추고 제한 안내가 뜹니다. 이 제한은 아이 프로필에만 걸고, 보호자의 기본 프로필에는 걸지 않습니다. 영상 화면과 쇼츠가 훅 하나를 같이 쓰고, 쇼츠에서는 화면에 보이는 슬라이드 하나만 시간을 보냅니다.",
                    metrics: [
                        {
                            label: "보내는 시점",
                            value: "나갈 때 1번 → 재생 중 5초마다",
                        },
                        {
                            label: "멈춤 판단",
                            value: "서버 응답",
                        },
                        {
                            label: "쇼츠에서 세는 것",
                            value: "활성 슬라이드만",
                        },
                    ],
                    changes: [
                        {
                            file: "src/hooks/useHandleVideoPlayer.ts",
                            commit: "0780894 · 2024.10.08",
                            before: "const handlePostPlayTimeApi = ({\n    currentPlayTime,\n    endVideo,\n}: {\n    currentPlayTime?: number | undefined;\n    endVideo?: boolean;\n}) => {\n    youtubeRef.current\n        ?.getInternalPlayer()\n        ?.getCurrentTime()\n        .then((res) => {\n            videoPlayTime.mutate({\n                youtube_video_id: state.videoId,\n                watch_time:\n                    currentPlayTime && currentPlayTime >= 0 ? currentPlayTime : playTime,\n                current_time: endVideo ? 0 : Math.floor(res),\n            });\n        });\n};",
                            after: "const currentTime = await youtubeRef.current?.getInternalPlayer()?.getCurrentTime();\n\nif (currentTime !== undefined) {\n    const result = await videoPlayTime.mutateAsync({ /* ... */ });\n    setIsWatched(result.status);\n    return result.status;\n}\n// ...\nuseEffect(() => {\n    const timeCount = setInterval(() => {\n        youtubeRef.current\n            ?.getInternalPlayer()\n            ?.getPlayerState()\n            .then((state) => {\n                if (state === 1) {\n                    handlePostPlayTimeApi({ currentPlayTime: playTimeRef.current });\n                    // ...\n                }\n            });\n    }, 5000);\n    // ...\n}, [video?.id]);",
                            note: "전에는 보내고 응답을 버려서 보는 도중에 한도가 끝나도 몰랐습니다. 지금은 재생 중(state 1)에 5초마다 보내고, 서버가 준 status로 화면이 멈춥니다.",
                        },
                        {
                            file: "src/hooks/useHandleVideoPlayer.ts",
                            commit: "1d2981b · 2024.11.07",
                            before: "const useHandleVIdeoPlayer = ({\n    me,\n    prevAndNextVideo,\n    videoPlayTime,\n    video,\n}: UseHandleVideoPlayerProps) => {\n    const { state } = useLocation() as { state: LocationState };\n    // ...\n    useEffect(() => {\n        const playTimeInterval = setInterval(handlePlayTimeCount, 1000);\n        // ...\n    }, [me, playTime]);",
                            after: "    isShorts,\n    isActive = true,\n}: UseHandleVideoPlayerProps) => {\n    // ...\n    const getVideoId = () => {\n        if (isShorts && video) {\n            return video.id;\n        }\n\n        if (!isShorts && state) {\n            return state.videoId;\n        }\n        return undefined;\n    };\n    // ...\n    useEffect(() => {\n        if (!isActive) return;\n        const playTimeInterval = setInterval(handlePlayTimeCount, 1000);\n        // ...\n    }, [me, playTime, isActive]);",
                            note: "전에는 라우터로 넘어온 영상 ID만 알아서 쇼츠에서 쓸 수 없었습니다. 지금은 쇼츠면 받은 영상에서 ID를 꺼내고, 활성 슬라이드가 아니면 타이머를 돌리지 않습니다.",
                        },
                    ],
                },
                {
                    label: "평범한 텍스트 입력창으로는 부족했다",
                    problem:
                        "댓글 하나에 답글 멘션과 영상 타임라인이 같이 들어갑니다. input이나 textarea로는 @닉네임과 01:23을 다른 모양으로 보여줄 수도, 지울 때 한 덩어리로 다룰 수도 없었습니다. contentEditable로 바꾸니 이번엔 입력 도중 DOM을 건드릴 때마다 커서가 맨 뒤로 튀고, 한글 조합 중이면 글자가 깨졌습니다.",
                    approach:
                        "시간 형식이 감지되면 그 문자열을 편집 불가 요소로 바꿔 하나의 토큰처럼 다룹니다. 바꾸기 전에 커서 위치를 저장해 두고 변환이 끝나면 범위를 다시 만들어 제자리로 돌려놓습니다. 한글은 조합이 시작되면 변환을 멈추고, 조합이 끝난 뒤에만 다시 변환합니다. 지울 때는 커서가 있는 자리의 부모가 그 토큰인지 보고, 맞으면 멘션·타임라인 상태까지 같이 비웁니다.",
                    result: "멘션과 타임라인이 글자가 아니라 덩어리로 움직입니다. 한글을 치는 도중에 토큰이 끼어들어 조합을 끊는 일도 없어졌습니다.",
                    metrics: [
                        {
                            label: "토큰 종류",
                            value: "멘션 · 타임라인",
                        },
                        {
                            label: "커서 복구",
                            value: "Range 재생성",
                        },
                        {
                            label: "조합 가드",
                            value: "composition",
                        },
                    ],
                    changes: [
                        {
                            file: "src/components/comment/_component/CommentWrite.tsx",
                            commit: "f2185ef · 2024.10.10",
                            before: "const handleInputChange = () => {\n    updateMentionsAndText();\n    const newHeight = contentRef.current?.scrollHeight || 0;\n    // ...\n};\n// ...\n<StyledWriteEditor\n    contentEditable\n    ref={contentRef}\n    onInput={handleInputChange}\n    onKeyDown={handleKeyDown}\n    // ...\n/>",
                            after: 'const handleInputChange = () => {\n    if (!contentRef.current) return;\n\n    if (isComposing) {\n        setCommentText(contentRef.current.innerText);\n        return;\n    }\n\n    const selection = window.getSelection();\n    if (!selection || selection.rangeCount === 0) return;\n    const range = selection.getRangeAt(0);\n\n    const preCursorRange = range.cloneRange();\n    preCursorRange.selectNodeContents(contentRef.current);\n    preCursorRange.setEnd(range.startContainer, range.startOffset);\n    const cursorOffset = preCursorRange.toString().length;\n\n    const regex = /(\\d{1,2}:\\d{2}(?::\\d{2})?\\s)/g;\n    // ...\n            timeElement.setAttribute("contenteditable", "false");\n    // ...\n};\n// ...\n    onCompositionStart={() => setIsComposing(true)}\n    onCompositionEnd={() => {\n        setIsComposing(false);\n        handleInputChange();\n    }}',
                            note: "전에는 입력마다 텍스트만 다시 읽었습니다. 지금은 01:23 꼴을 편집 불가 토큰으로 바꾸기 전에 커서 위치를 재 두었다가 되돌리고, 한글 조합 중에는 변환을 미룹니다.",
                        },
                        {
                            file: "src/components/portal/comment/_component/CommentWrite.tsx",
                            commit: "9203435 · 2024.10.31",
                            before: 'if (focusNode?.nodeType === Node.ELEMENT_NODE) {\n    const nodeAtCursor = focusNode as HTMLElement;\n\n    if (nodeAtCursor.tagName === "B") {',
                            after: 'if (focusNode) {\n    let nodeAtCursor: HTMLElement | null = null;\n\n    if (focusNode.nodeType === Node.ELEMENT_NODE) {\n        nodeAtCursor = focusNode as HTMLElement;\n    } else if (\n        focusNode.parentNode &&\n        focusNode.parentNode.nodeType === Node.ELEMENT_NODE\n    ) {\n        nodeAtCursor = focusNode.parentNode as HTMLElement;\n    }\n\n    if (nodeAtCursor && nodeAtCursor.tagName === "B") {',
                            note: "전에는 커서가 토큰 안의 글자 노드에 있으면 그 자리를 토큰으로 알아보지 못했습니다. 지금은 부모가 토큰이면 토큰째 지웁니다.",
                        },
                    ],
                },
                {
                    label: "쇼츠는 지금 보는 것만 재생돼야 한다",
                    problem:
                        "일반 영상은 플레이어 하나만 다루면 됐지만 쇼츠는 세로로 이어진 슬라이드마다 플레이어가 있습니다. 처음 구현은 슬라이드가 바뀌면 현재 영상인 슬라이드가 플레이어 상태를 물어 재생과 정지를 뒤집는 방식이었고, 다음 목록은 끝에 닿은 뒤에야 요청했습니다. 끝까지 넘기면 목록이 올 때까지 기다려야 했고, 넘긴 슬라이드는 플레이어째 전부 DOM에 남았습니다.",
                    approach:
                        "슬라이드는 자기가 활성인지 하나만 봅니다. 활성이 되면 처음부터 재생하고, 아니면 멈춥니다. 다음 페이지는 끝에 닿을 때가 아니라 4번째 슬라이드부터 미리 요청하고, 요청 중이거나 더 없으면 건너뜁니다. 슬라이드는 Swiper의 Virtual 모듈로 가상화해서 화면 근처 것만 DOM에 둡니다. 이 제어는 이틀 뒤 별도 훅으로 떼어 냈고, 거기에 시청 시간 제한 모달과 시력보호 오버레이를 일반 영상과 같은 방식으로 붙였습니다.",
                    result: "넘기는 즉시 앞 영상이 멈추고 다음이 처음부터 재생됩니다. 다음 목록은 끝에 닿기 전에 미리 요청해 둡니다.",
                    metrics: [
                        {
                            label: "재생 판정",
                            value: "활성 슬라이드",
                        },
                        {
                            label: "다음 페이지",
                            value: "끝 도달 → 4번째부터 미리",
                        },
                        {
                            label: "슬라이드",
                            value: "가상화",
                        },
                    ],
                    changes: [
                        {
                            file: "src/pages/shorts/index.tsx",
                            commit: "3b4df01 · 2024.11.05",
                            before: 'const handleNextPage = () => {\n    if (!isFetchingNextPage && hasNextPage) {\n        fetchNextPage();\n    }\n};\n// ...\n<Swiper\n    direction="vertical"\n    slidesPerView={1}\n    onRealIndexChange={(swiper) => {\n        setVideoId(swiper?.slides[swiper.activeIndex]?.dataset.videoId);\n    }}\n    ref={sliderRef}\n    onReachEnd={handleNextPage}\n>',
                            after: 'const handleSlideChange = useCallback(\n    async (swiper: Swiper) => {\n        setActiveIndex(swiper.activeIndex);\n\n        const prefetchThreshold = 4;\n\n        if (swiper.activeIndex + 1 >= prefetchThreshold && hasNextPage && !isFetchingNextPage) {\n            await fetchNextPage();\n        }\n    },\n    [fetchNextPage, hasNextPage, isFetchingNextPage],\n);\n// ...\n<ReactSwiper\n    modules={[Virtual]}\n    virtual\n    direction="vertical"\n    slidesPerView={1}\n    onSlideChange={handleSlideChange}',
                            note: "전에는 끝에 닿아야 다음 목록을 요청했고 슬라이드가 전부 DOM에 남았습니다. 지금은 4번째 슬라이드부터 미리 요청하고, 가상화로 화면 근처 슬라이드만 그립니다.",
                        },
                        {
                            file: "src/pages/shorts/_component/ShortDetail.tsx",
                            commit: "3b4df01 · 2024.11.05",
                            before: "useEffect(() => {\n    handlePlayer();\n}, [videoId]);\n\nconst handlePlayer = () => {\n    if (videoId === short.video_id) {\n        youtubeRef.current\n            ?.getInternalPlayer()\n            ?.getPlayerState()\n            .then((state) => {\n                if (state === 1) {\n                    youtubeRef.current?.getInternalPlayer()?.pauseVideo();\n                } else {\n                    youtubeRef.current?.getInternalPlayer()?.playVideo();\n                }\n            });\n    } else {\n        youtubeRef.current?.getInternalPlayer()?.pauseVideo();\n    }\n};",
                            after: "useEffect(() => {\n    const player = youtubeRef.current?.getInternalPlayer();\n    if (isActive) {\n        player?.mute();\n        player?.seekTo(0, true);\n        player?.playVideo();\n    } else {\n        player?.pauseVideo();\n    }\n}, [isActive]);",
                            note: "전에는 현재 영상인지 확인한 뒤 플레이어 상태를 물어 재생과 정지를 뒤집었습니다. 지금은 활성 여부 하나만 보고, 활성이면 처음부터 재생하고 아니면 멈춥니다.",
                        },
                    ],
                },
            ],
            sheets: [
                {
                    title: "로고",
                    note: "밝은 바탕에서도 어두운 바탕에서도 같은 무게로 보여야 해서 네 벌을 씁니다.",
                },
                {
                    title: "모리와 친구들",
                    note: "아이가 먼저 알아보는 건 글자가 아니라 이 얼굴입니다. 시력보호 안내도 모리가 대신 말합니다.",
                },
                {
                    title: "색",
                    note: "주황 #FF6032가 브랜드 색이고, 이 페이지의 강조로 쓴 #FFC702는 모리의 노랑입니다.",
                },
                {
                    title: "스택",
                    note: "React · Vite · React Query · Zustand · styled-components. 배포는 Jenkins로 빌드해 Nginx에 올립니다.",
                },
            ],
            bridge: {
                title: "앱이 웹의 영상을 멈출 때",
                lede: "같은 화면이 브라우저에도 뜨고 앱의 WebView 안에도 뜹니다. 앱이 재생을 멈추거나 다시 틀 때 부르는 함수는 둘이고, 웹은 이걸 window에 걸어 두고 기다립니다.",
                note: "브라우저에서 열면 이 함수를 부를 앱이 없어서, 영상은 평소대로 재생됩니다.",
                calls: [
                    {
                        from: "app",
                        label: "앱이 영상을 멈춘다",
                        call: "window.handleAppVideoPause()",
                        effects: [
                            "영상 화면: 플레이어에 pauseVideo()를 보내고 스크롤을 잠근 뒤 시력보호 오버레이를 덮는다",
                            "쇼츠: 페이지가 한 번 받아 정지 상태만 바꾸고, 지금 보이는 슬라이드만 반응한다",
                            "페이지를 떠나면 걸어 둔 함수를 지운다",
                        ],
                    },
                    {
                        from: "app",
                        label: "앱이 다시 재생시킨다",
                        call: "window.handleAppVideoPlay()",
                        effects: [
                            "플레이어에 playVideo()를 보낸다",
                            "스크롤 잠금을 푼다",
                            "덮여 있던 오버레이를 걷는다",
                        ],
                    },
                ],
            },
        },
        "plus-sms": {
            cases: [
                {
                    label: "5만 건을 다 그리면 화면이 먼저 멈춘다",
                    problem:
                        "한 번에 5만 건까지 올릴 수 있어야 했습니다. 등록한 번호는 칩마다 삭제 버튼을 달아 목록에 보여 주는데, 발송 화면을 처음 만들 때는 이 칩을 전부 DOM에 그렸습니다. 건수만큼 요소가 늘어나는 구조라 1만 건만 올려도 한 번 그리는 데 1.3초가 걸렸습니다.",
                    approach:
                        "발송 API를 붙이면서 목록을 react-window의 FixedSizeList로 바꿔 보이는 줄만 그리게 했습니다. 두 방식은 같은 10,000건으로 놓고 performance.now로 각각 재서 비교했습니다. 칩을 하나씩 가상화하면 줄이 어디서 꺾일지 목록이 알 수 없어서, 번호를 세 개씩 묶어 한 줄로 만들고 줄 높이를 고정했습니다. 루트 글자 크기가 창 높이에 따라 바뀌어서, 줄 높이도 창 높이를 보고 다시 정합니다.",
                    result: "10,000건 기준 평균 렌더링 시간이 1,300.9ms에서 32.6ms로 줄었습니다. 5만 건을 올려도 DOM에 있는 건 창에 보이는 몇 줄뿐입니다.",
                    metrics: [
                        {
                            label: "가상화 전",
                            value: "1,300.9ms",
                        },
                        {
                            label: "가상화 후",
                            value: "32.6ms",
                        },
                        {
                            label: "한 줄",
                            value: "번호 3개",
                        },
                    ],
                    changes: [
                        {
                            file: "src/pages/send/_component/SendTarget.tsx",
                            commit: "ea54eec · 2024.11.14",
                            before: '<div className="viewer">\n    {targets &&\n        targets.map((target, index) => (\n            <div key={index}>\n                <span>{target}</span>\n                <button onClick={() => handleDelete(index)}>\n                    <Delete width={"1.6rem"} height={"1.6rem"} />\n                </button>\n            </div>\n        ))}\n</div>',
                            after: 'const chunkedTargets = useMemo(() => {\n    if (!targets) return [];\n    const chunkSize = 3;\n    return Array.from(\n        { length: Math.ceil(targets.length / chunkSize) },\n        (_, i) => targets.slice(i * chunkSize, i * chunkSize + chunkSize)\n    );\n}, [targets]);\n// ...\n<List\n    height={144}\n    itemCount={chunkedTargets.length}\n    itemSize={itemSize}\n    width="100%"\n>\n    {Row}\n</List>',
                            note: "전에는 번호마다 칩을 하나씩 전부 그렸습니다. 지금은 세 개씩 묶은 줄을 고정 높이 가상 목록으로 그려, 건수와 상관없이 상자에 보이는 줄만 DOM에 있습니다.",
                        },
                    ],
                },
                {
                    label: "같은 번호가 네 가지 모양으로 들어온다",
                    problem:
                        "처음 입력창은 허용 문자(숫자 · 콤마 · 줄바꿈 · 하이픈) 밖의 글자가 하나라도 섞이면 붙여넣기 자체를 버렸습니다. 공백이나 +82, 괄호가 섞인 명단은 입력창에 들어가지도 않았고, 어느 글자 때문인지 알 수 없으니 사용자에게는 붙여넣기가 고장 난 것처럼 보였습니다. 들어온 번호를 판정하는 쪽에도 구멍이 있었습니다. 사람마다 번호를 01012345678, 010-1234-5678, +82 10 1234 5678, 괄호를 친 번호까지 섞여 들어옵니다. 처음 판정은 길이(9~12자리)만 봐서 02로 시작하는 유선 번호도 통과했습니다. 정규식 판정으로 바꾸는 과정에서는 중복 비교가 정규화하기 전 모양끼리로 돌아가, 010과 +82로 적은 같은 번호가 따로 등록될 수 있었습니다.",
                    approach:
                        "파싱을 별도 함수로 떼어 냈습니다. 공백으로 자른 조각을 숫자가 10자리가 될 때까지 이어 붙이고, 82로 시작하는 12자리와 10으로 시작하는 10자리는 010 꼴로 정규화한 뒤 휴대폰 패턴으로 판정합니다. 통과한 번호는 앞자리 0을 국가번호로 바꿔 목록에 올리고, 중복도 이 최종 모양끼리 비교합니다. 입력창의 필터는 허용 문자를 넓히다가 결국 주석으로 꺼 두고, 무엇이 틀렸는지는 이 파서 한 곳이 판정하게 했습니다.",
                    result: "적는 방식이 달라도 같은 번호면 하나로 모입니다. +82로 적은 번호와 010으로 적은 번호가 따로 등록되지 않고, 02 같은 유선 번호는 오류로 따로 빠집니다. 무엇을 붙여넣어도 일단 입력창에 들어가고, 번호가 아닌 조각은 오류 목록으로 빠집니다.",
                    metrics: [
                        {
                            label: "정규화 규칙",
                            value: "2개",
                        },
                        {
                            label: "판정 패턴",
                            value: "01[016789] + 7~8자리",
                        },
                        {
                            label: "중복 비교",
                            value: "국가번호 붙인 뒤",
                        },
                    ],
                    changes: [
                        {
                            file: "src/hooks/useTransactionForm.ts",
                            commit: "7bc73b1 · 2025.01.10 → 8d1174a · 2025.04.18",
                            before: "const regex = /^[0-9,\\n,-]*$/;\n// ...\nconst handleChangeTarget = (e: React.ChangeEvent<HTMLTextAreaElement>) => {\n    const { value } = e.target;\n\n    if (!regex.test(value)) return;\n\n    setTransactionValues((prev) => ({\n        ...prev,\n        target: value,\n    }));\n};",
                            after: "const handleChangeTarget = (e: React.ChangeEvent<HTMLTextAreaElement>) => {\n    const { value } = e.target;\n\n    // if (!regex.test(value)) return;\n\n    setTransactionValues((prev) => ({\n        ...prev,\n        target: value,\n    }));\n};",
                            note: "전에는 허용 문자 밖의 글자가 하나라도 섞이면 입력 전체가 버려졌습니다. 중간에 /^[0-9,\\n\\s\\-+()]*$/까지 넓혔다가, 지금은 필터를 주석으로 꺼 두고 판정은 파서가 합니다.",
                        },
                        {
                            file: "src/hooks/useTransactionForm.ts",
                            commit: "2fc156f · 2025.04.04",
                            before: "rawTargets.forEach((phone) => {\n    if (valuidPhoneNumber(phone) === false) {\n        notValidTargets.push(phone);\n        return;\n    }\n\n    const normalizedPhone = normalizePhone(phone);\n\n    if (\n        existingNormalizedTargets.includes(phone) ||\n        normalizedValidTargets.includes(phone)\n    ) {\n        duplications.push(phone);\n    } else {\n        normalizedValidTargets.push(phone);\n        validTargets.push(normalizedPhone);\n    }\n});",
                            after: 'tokens.forEach((raw) => {\n    const isInvalid = raw.startsWith("INVALID_");\n    const phone = isInvalid ? raw.replace("INVALID_", "") : raw;\n\n    if (isInvalid || !valuidPhoneNumber(phone)) {\n        notValidTargets.push(phone);\n        return;\n    }\n\n    const finalPhone = transactionValues.country.value + phone.slice(1);\n\n    if (\n        existingNormalizedTargets.includes(finalPhone) ||\n        normalizedValidTargets.includes(finalPhone)\n    ) {\n        duplications.push(phone);\n    } else {\n        normalizedValidTargets.push(finalPhone);\n        validTargets.push(finalPhone);\n    }\n});',
                            note: "전에는 적힌 모양 그대로(phone) 중복을 비교해서 010-2481-3690과 82 10 2481 3690이 둘 다 등록됐습니다. 지금은 국가번호를 붙인 최종 모양(finalPhone)끼리 비교합니다.",
                        },
                        {
                            file: "src/hooks/useTransactionForm.ts",
                            commit: "6b1b659 · 2025.04.23",
                            before: "const roughTokens = input\n    .split(/[\\n,]+/)\n    .map((token) => token.trim())\n    .filter(Boolean);\n// ...\nconst validRegex = /(?:\\+?\\(?82\\)?|\\(?0\\)?)(1[016789])[-\\s()]*(\\d{3,4})[-\\s()]*(\\d{4})/g;",
                            after: 'const tokens = input.split(/\\s+/).filter(Boolean); // 공백으로만 분리\n// ...\nconst flushBuffer = () => {\n    const candidate = buffer.join("").replace(/\\D/g, "");\n    let normalized = candidate;\n\n    if (normalized.startsWith("82") && normalized.length === 12) {\n        normalized = "0" + normalized.slice(2);\n    }\n    if (normalized.length === 10 && normalized.startsWith("10")) {\n        normalized = "0" + normalized;\n    }\n    // ...',
                            note: "전에는 줄과 콤마로 자른 조각을 긴 정규식으로 훑었습니다. 지금은 공백으로 자른 조각을 숫자가 10자리가 될 때까지 이어 붙여 한 번호로 보고, 82로 시작하는 12자리와 10으로 시작하는 10자리를 010 꼴로 맞춘 뒤 판정합니다.",
                        },
                    ],
                },
                {
                    label: "엑셀로 올린 번호만 통째로 오류가 됐다",
                    problem:
                        "엑셀 업로드와 직접 입력이 같은 목록에 쌓이는데, 들어오는 모양이 달랐습니다. 엑셀에서 읽은 셀은 콤마로 이어 붙여 넘기고 있었고, 원래 파서는 줄과 콤마로 잘라서 문제가 없었습니다. 파서를 공백으로 잘라 조각을 이어 붙이는 방식으로 바꾸자, 엑셀로 올린 명단만 번호 수백 개가 한 덩어리가 돼 통째로 오류로 떨어졌습니다. 파서를 바꿀 때 입구 하나만 보고 다른 입구를 확인하지 않은 탓이었습니다.",
                    approach:
                        "파서에 콤마를 다시 넣는 대신 엑셀 쪽을 입력창의 모양에 맞췄습니다. 파서가 입구마다 달라지면 같은 일이 또 생기기 때문입니다. xlsx로 첫 시트를 읽어 숫자가 들어 있는 셀만 추리고, 줄바꿈으로 이어 입력창에 넣은 뒤 직접 입력과 같은 handleFormatTargets를 거칩니다.",
                    result: "입구가 둘이어도 검증은 한 길로 갑니다. 번호 규칙을 고칠 때도 한 곳만 고치면 됩니다.",
                    metrics: [
                        {
                            label: "검증 경로",
                            value: "1개",
                        },
                        {
                            label: "읽는 셀",
                            value: "숫자가 있는 셀",
                        },
                        {
                            label: "잇는 문자",
                            value: "줄바꿈",
                        },
                    ],
                    changes: [
                        {
                            file: "src/utils/readExcel.ts",
                            commit: "2fc156f · 2025.04.04",
                            before: 'const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];\nconst range = XLSX.utils.decode_range(\n    firstWorksheet["!ref"] || "A1"\n);\nrange.s.r = 1;\nrange.e.c = 0;\n// ...\nconst columnAData = jsonData.map((row) => row[0]).filter(Boolean);\nresolve(columnAData);',
                            after: 'const worksheet = workbook.Sheets[workbook.SheetNames[0]];\nconst allCells = XLSX.utils.sheet_to_json<string[]>(worksheet, {\n    header: 1,\n    blankrows: false,\n});\n\nconst flatCells = allCells.flat();\n\n// 숫자 포함된 문자열만 필터링\nconst onlyNumbers = flatCells\n    .filter((cell) => typeof cell === "string" && /\\d/.test(cell))\n    .map((cell) => cell.trim());\n\nresolve(onlyNumbers);',
                            note: "전에는 A열의 2행부터만 읽어서 번호를 다른 열에 적은 파일은 비어 들어왔습니다. 지금은 첫 시트의 모든 셀 중 숫자가 든 셀을 읽습니다.",
                        },
                        {
                            file: "src/utils/readExcel.ts · src/hooks/useExcelFileData.ts",
                            commit: "d334eb5 · 2025.05.07",
                            before: 'const handleReadExcel = async (file: File) => {\n    const excel = await readExcel(file);\n    const excelData = excel.flatMap((data) => data);\n\n    return excelData;\n};\n// useExcelFileData\nexcel.join(",")',
                            after: 'const handleReadExcel = async (file: File) => {\n    const excel = await readExcel(file);\n    const excelData = excel.flatMap((data) => data);\n    const formatExcelData = excelData.reduce((prev, cur) => `${prev}\\n` + `${cur}`, "");\n\n    return formatExcelData;\n};',
                            note: "전에는 셀을 콤마로 이어 넘겨, 공백으로 자르는 파서에게는 한 덩어리였습니다. 지금은 줄바꿈으로 이어 직접 입력과 같은 모양으로 넘깁니다.",
                        },
                    ],
                },
                {
                    label: "틀린 번호 하나 때문에 전체를 돌려보내지 않는다",
                    problem:
                        "대량 발송에서는 일부 번호만 틀리거나 겹치는 게 보통입니다. 오류가 있으면 alert 하나로 막았더니, 수천 줄 명단에서 어느 번호를 고쳐야 하는지 알 방법이 없었습니다. 직접 입력에서 엑셀로 방식을 바꾸면 앞에서 걸린 중복 · 오류 목록이 그대로 남아 새 명단의 결과처럼 보이기도 했습니다.",
                    approach:
                        "등록 · 중복 · 오류를 각각의 상태로 나눠 들고, 걸린 번호는 따로 보여 주면서 복사하기와 엑셀 다운로드를 붙였습니다. 추가를 여러 번 눌러도 앞의 결과에 이어 쌓고, 입력 방식을 바꾸는 순간 세 목록을 함께 비웁니다.",
                    result: "멀쩡한 번호는 그대로 등록되고, 문제 번호만 따로 받아 고친 뒤 다시 붙여넣으면 됩니다.",
                    metrics: [
                        {
                            label: "분류",
                            value: "등록 · 중복 · 오류",
                        },
                        {
                            label: "내보내기",
                            value: "복사 · xlsx",
                        },
                        {
                            label: "비우는 때",
                            value: "입력 방식 전환",
                        },
                    ],
                    changes: [
                        {
                            file: "src/hooks/useTransactionForm.ts",
                            commit: "af28c92 · 2025.01.20",
                            before: 'const valueFail = targets.some((phone) => phone.length < 9 || phone.length > 12);\n\nif (valueFail) {\n    alert("전화번호를 확인해주세요.");\n    return;\n}',
                            after: "rawTargets.forEach((phone) => {\n    const normalizedPhone = normalizePhone(phone); // 표준화된 번호 생성\n\n    if (phone.length < 9 || phone.length > 12) {\n        notValidTargets.push(phone);\n    } else if (\n        existingNormalizedTargets.includes(normalizedPhone) ||\n        normalizedValidTargets.includes(normalizedPhone)\n    ) {\n        duplications.push(phone);\n    } else {\n        normalizedValidTargets.push(normalizedPhone);\n        validTargets.push(phone);\n    }\n});",
                            note: "전에는 한 건이라도 틀리면 alert 하나로 전체를 막았습니다. 지금은 오류와 중복만 따로 모으고 나머지는 등록합니다. 같은 커밋에서 걸린 번호의 복사하기와 xlsx 내려받기를 붙였습니다.",
                        },
                        {
                            file: "src/hooks/useTransactionForm.ts",
                            commit: "6a40440 · 2025.01.20",
                            before: '...prev,\ntarget: "",\ntargets: null,\namount: 0,\ntargetMethod: id,',
                            after: '...prev,\ntarget: "",\ntargets: null,\nduplications: null,\nnotValidTargets: null,\nnomralizedTargets: null,\namount: 0,\ntargetMethod: id,',
                            note: "전에는 입력 방식을 바꿔도 앞 명단의 중복 · 오류 목록이 남아 새 명단의 결과처럼 보였습니다. 지금은 세 목록을 함께 비웁니다.",
                        },
                    ],
                },
                {
                    label: "포인트가 모자라면 누르기 전에 막는다",
                    problem:
                        "발송 비용은 인원 × 건당 단가인데, 단가는 서버가 정하고 보유 포인트는 계정마다 다릅니다. 모자란 채로 요청을 보내 서버가 거절하게 두면, 명단을 정리해 둔 사용자는 무엇이 문제였는지 모른 채 실패 화면을 봅니다.",
                    approach:
                        "단가는 API로 받고 보유 포인트는 로그인한 사람의 정보에서 읽어, 목록이 바뀔 때마다 결제 포인트를 다시 계산합니다. 모자라면 전송 버튼을 잠그고 그 자리에 충전 안내를 띄웁니다. 5만 건 상한은 추가할 때 이미 쌓인 건수와 합쳐 한 번, 보낼 때 한 번 더 확인합니다.",
                    result: "보낼 수 없는 요청은 애초에 나가지 않습니다. 사용자는 버튼을 누르기 전에 결제될 포인트와 막힌 이유를 먼저 봅니다.",
                    metrics: [
                        {
                            label: "결제 포인트",
                            value: "인원 × 단가",
                        },
                        {
                            label: "상한",
                            value: "50,000건",
                        },
                        {
                            label: "막는 곳",
                            value: "전송 버튼",
                        },
                    ],
                    changes: [
                        {
                            file: "src/pages/send/index.tsx",
                            commit: "ef43251 · 2024.11.21",
                            before: '<Button\n    text="문자전송 신청"\n    onClick={handleRequestSendMessages}\n/>',
                            after: 'const isDisabled = () => {\n    if (\n        me &&\n        transactionValues.targets &&\n        transactionValues.targets.length > 0 &&\n        price\n    ) {\n        return (\n            me.point - transactionValues.targets.length * price.sms_price <\n            0\n        );\n    }\n};\n// ...\n{isDisabled() === true && (\n    <p className="point-error">\n        포인트가 부족합니다. 충전후 다시\n        신청해주세요.\n    </p>\n)}\n// ...\n    disabled={isDisabled() ?? true}',
                            note: "전에는 포인트와 상관없이 버튼이 늘 눌렸습니다. 지금은 보유 포인트에서 인원 × 단가를 뺀 값이 음수면 버튼을 잠그고 그 자리에 안내를 띄웁니다.",
                        },
                        {
                            file: "src/hooks/useTransactionForm.ts",
                            commit: "af28c92 · 2025.01.20",
                            before: 'if (targets.length > 50000) {\n    alert("전화번호는 50,000개까지만 등록 가능합니다.");\n    return;\n}',
                            after: 'if (formattedValidTargets.length + existingTargets.length > 50000) {\n    alert("전화번호는 50,000개까지만 등록 가능합니다.");\n    return;\n}',
                            note: "전에는 이번에 붙여넣은 묶음만 세서, 추가를 여러 번 누르면 합계가 5만을 넘을 수 있었습니다. 지금은 이미 쌓인 건수와 합쳐 셉니다.",
                        },
                    ],
                },
                {
                    label: "한 저장소로 두 브랜드를 내보낸다",
                    problem:
                        "Plus SMS와 Modoo SMS는 같은 기능에 로고와 상호만 다릅니다. 처음에는 로고와 상호가 컴포넌트에 그대로 박혀 있었고, 파이프라인도 한 브랜드만 빌드했습니다. 저장소를 복사해 두 벌로 가면 버그 하나를 두 번 고쳐야 합니다.",
                    approach:
                        "브랜드마다 달라지는 로고 · 하단 로고 · 상호 · 메타 타이틀을 상수 파일 하나에 모으고, VITE_DOMAIN 값 하나로 고르게 했습니다. Jenkins는 main을 한 번 받아 브랜드마다 폴더를 복사하고 그 브랜드의 .env를 넣어 따로 빌드합니다. 배포할 때는 index.html을 타임스탬프가 붙은 이름으로 남기고 심볼릭 링크로 가리키게 해서, 배포마다 어떤 진입 파일이 나갔는지 서버에 남깁니다.",
                    result: "기능을 고치면 두 브랜드에 같이 나갑니다. 브랜드마다 다른 건 상수 파일의 값 네 개와 .env 하나뿐입니다. 지금 상수는 두 브랜드 중 하나를 고르는 모양이라, 브랜드가 셋이 되면 이 파일을 표 형태로 바꿔야 합니다.",
                    metrics: [
                        {
                            label: "브랜드",
                            value: "2개",
                        },
                        {
                            label: "분기 기준",
                            value: "VITE_DOMAIN",
                        },
                        {
                            label: "진입 파일",
                            value: "index-<ts>.html",
                        },
                    ],
                    changes: [
                        {
                            file: "src/constants/domains.ts · src/components/footer/WebFooter.tsx",
                            commit: "b874e8b · 2025.01.21",
                            before: 'import { FootLogo } from "@/components/footer/_image";\n// ...\n<img src={FootLogo} alt="foot-logo" />\n<StyledWebFooterInner>\n    <span>Copyright ⓒ Plus SMS,Inc. All Rights Reserved</span>',
                            after: 'const domains = {\n    LOGO: import.meta.env.VITE_DOMAIN === "plus" ? SmS_Logo : "없노",\n    BOTTOMLOGO: import.meta.env.VITE_DOMAIN === "plus" ? SmS_BottomLogo : "없노",\n    COPYNAME: import.meta.env.VITE_DOMAIN === "plus" ? "Plus SMS" : "Modoo SMS",\n    METATITLE: import.meta.env.VITE_DOMAIN === "plus" ? "Plus SMS" : "Modoo SMS",\n};\n// ...\n<img src={domains.BOTTOMLOGO} alt="foot-logo" />\n<StyledWebFooterInner>\n    <span>Copyright ⓒ {domains.COPYNAME},Inc. All Rights Reserved</span>',
                            note: '전에는 로고와 상호가 컴포넌트마다 박혀 있었습니다. 지금은 VITE_DOMAIN 하나로 네 값을 고릅니다. Modoo 로고 자리의 "없노"는 이 커밋의 임시값이고, 다음 날(10145f6) 실제 로고로 채웠습니다.',
                        },
                        {
                            file: "Jenkinsfile",
                            commit: "abadeae · 2025.04.03 → ab6b997 · 2025.04.04",
                            before: "stage('git pull') {\n    steps {\n        git branch: 'main', credentialsId: 'github', url: 'https://github.com/mogwaplay/sms-web.git'\n    }\n}\nstage('build') {\n    steps {\n        sh \"pwd\"\n        sh \"npm install\"\n        sh \"npm run build\"",
                            after: 'def buildApp = { appName ->\n    dir("${WORKSPACE}/${appName}") {\n        echo "📂 ${appName} 환경 설정 복사"\n        sh "cp -r ${WORKSPACE}/${APP_NAME}/* ."\n        sh "sudo cp /var/www/envs/${appName}/.env .env"\n\n        echo "⚙️ ${appName} 빌드 시작"\n        sh "npm install"\n        sh "npm run build"\n    }\n}\n\nbuildApp(APP1_NAME)\nbuildApp(APP2_NAME)',
                            note: "전에는 main을 받아 한 번 빌드했습니다. 지금은 한 번 받은 코드를 브랜드별 폴더에 복사하고, 브랜드마다 자기 .env를 넣어 따로 빌드합니다.",
                        },
                    ],
                },
            ],
            sheets: [
                {
                    title: "브랜드 두 벌",
                    note: "Modoo SMS는 같은 저장소를 VITE_DOMAIN만 바꿔 빌드한 것입니다. 달라지는 건 상수 파일의 네 값(로고 · 하단 로고 · 상호 · 메타 타이틀)뿐이고, 배포 경로도 브랜드마다 따로 둡니다.",
                },
                {
                    title: "번호를 다루는 조각",
                    note: "대상 목록과 중복 · 오류 상자. 목록은 번호 세 개를 한 줄로 묶어 가상화하고, 걸러진 번호는 버리지 않고 따로 들고 있다가 내보냅니다.",
                },
            ],
            sieve: {
                title: "붙여넣은 번호가 목록에 오르기까지",
                lede: "문자전송 화면의 추가하기 버튼이 하는 일을 그대로 옮겼습니다. 규칙은 원래 코드와 같고, 입력창도 실제로 고칠 수 있습니다. 예시를 고른 뒤 번호를 띄어 쓰거나 지워 보세요.",
                country: "82",
                samples: [
                    {
                        label: "적는 방식이 제각각",
                        hint: "같은 명단을 사람마다 다르게 적어 옵니다. 띄어 쓴 번호는 공백에서 잘려 들어오지만, 숫자가 10자리가 될 때까지 이어 붙여 한 번호로 봅니다.",
                        input: "010-2481-3690\n+82 10 7315 2048\n(010) 5520-1874\n1093321706\n01068012245",
                    },
                    {
                        label: "중복이 섞인 명단",
                        hint: "010으로 적은 번호와 +82로 적은 번호도 국가번호를 붙인 최종 모양끼리 비교합니다. 먼저 등록된 번호와 같으면 뒤에 온 번호는 중복이 됩니다.",
                        input: "01024813690\n010-2481-3690\n+82 10 2481 3690\n821024813690\n01073152048",
                    },
                    {
                        label: "틀린 번호",
                        hint: "휴대폰 번호 패턴을 통과하지 못하면 오류로 따로 모읍니다. 휴대폰 번호가 아니거나, 두 번호가 붙어 버렸거나, 자리가 모자란 경우입니다.",
                        input: "02-3456-7890\n0502-1234-5678\n0107315204801055201874\n010-2481-36",
                    },
                    {
                        label: "엑셀 — 콤마로 이어 붙이던 때",
                        hint: "엑셀에서 읽은 셀을 콤마로 이어 넘기던 때의 입력입니다. 파서는 공백으로만 자르니 번호 다섯 개가 한 덩어리로 보이고, 통째로 오류가 됩니다.",
                        input: "01024813690,01073152048,01055201874,01093321706,01068012245",
                    },
                    {
                        label: "엑셀 — 줄바꿈으로 맞춘 뒤",
                        hint: "같은 셀을 줄바꿈으로 이어 입력창과 같은 모양으로 맞추면, 직접 입력과 같은 길로 다섯 건이 등록됩니다.",
                        input: "01024813690\n01073152048\n01055201874\n01093321706\n01068012245",
                    },
                ],
                note: "판정 순서와 정규식은 원 저장소의 parsePhones 그대로입니다. 등록된 번호는 앞자리 0이 국가번호 82로 바뀐 모양으로 목록에 오르고, 실제 화면에서는 여기에 5만 건 상한과 결제 포인트 계산이 더 붙습니다. 입력창 아래 안내에는 아직 콤마로 구분하라는 문구가 남아 있어서, 다시 손댄다면 구분자부터 파서와 맞출 겁니다.",
            },
            windowing: {
                title: "5만 건을 올려도 그리는 건 몇 줄뿐",
                lede: "등록한 번호는 칩으로 보여 주고 칩마다 삭제 버튼이 붙습니다. 전부 그리면 건수만큼 DOM이 늘어서, 창에 보이는 줄만 그리게 했습니다. 건수를 바꾸고 상자 안을 스크롤해 보세요.",
                counts: [1200, 10000, 50000],
                perRow: 3,
                measured: [
                    {
                        label: "가상화 전",
                        value: "1,300.9ms",
                    },
                    {
                        label: "가상화 후",
                        value: "32.6ms",
                    },
                    {
                        label: "측정 기준",
                        value: "10,000건 · performance.now 평균",
                    },
                ],
                note: "원 프로젝트는 react-window의 FixedSizeList를 썼고, 이 상자는 같은 계산을 라이브러리 없이 옮긴 것입니다. 번호 세 개를 한 줄로 묶은 것도 그대로입니다. 칩 하나하나를 가상화하면 줄이 어디서 꺾일지가 창 폭에 따라 달라져 줄 높이를 고정할 수 없기 때문입니다.",
            },
        },
    },
};
