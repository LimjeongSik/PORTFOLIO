import hero from "@/assets/hero.png";
import safeopsHome from "@/assets/safeops-home.webp";
import safeopsIcon from "@/assets/safeops-icon.webp";
import safeopsNotifications from "@/assets/safeops-notifications.webp";
import safeopsReport from "@/assets/safeops-report.webp";
import safeopsSettings from "@/assets/safeops-settings.webp";
import safeopsSheetIcon from "@/assets/safeops-sheet-icon.webp";
import safeopsSheetSplash from "@/assets/safeops-sheet-splash.webp";
import safeopsTabs from "@/assets/safeops-tabs.webp";

import type { Project } from "@/types/content";

export const projects: Project[] = [
    {
        slug: "safeops",
        title: "SafeOps",
        summary:
            "행사 현장의 경비 요원과 관제실을 잇는 근무 앱. 좌표는 스스로 올라가고, 지시는 알림으로 내려옵니다.",
        year: "2026",
        role: "앱 개발 (설계 · 구현)",
        period: "2026.07 — 현재",
        platform: "mobile",
        tech: [
            "React Native",
            "Expo",
            "TypeScript",
            "TanStack Query",
            "React Navigation",
            "FCM",
            "Reanimated",
        ],
        thumbnail: safeopsTabs,
        icon: safeopsIcon,
        theme: {
            paper: "#080d16",
            surface: "#111a2b",
            ink: "#f2f5fa",
            muted: "#8fa0b8",
            line: "#223049",
            espresso: "#f5441b",
            sand: "#1b2740",
        },
        context: [
            "행사장 경비 요원은 근무 내내 무전기를 들고 걷습니다. 관제실은 요원이 지금 어느 구역에 있는지 실시간으로 알아야 하고, 지시는 몇 초 안에 닿아야 합니다. 그런데 앱을 열어야만 동작하는 구조에서는 둘 중 어느 것도 성립하지 않습니다 — 요원은 화면을 보고 있지 않기 때문입니다.",
            "계정도 요원이 만들지 않습니다. 관제실이 발급하고 근무가 끝나면 닫습니다. 회원가입도 비밀번호 재설정도 없는 대신, 앱은 켜져 있는 동안 스스로 판단해 움직여야 했습니다.",
        ],
        approach: [
            "앱이 사용자를 기다리지 않게 만들었습니다. 좌표는 백그라운드에서 이동 중 5초 · 정지 중 60초 주기로 올라가고, 지시는 FCM 푸시가 OS 알림으로 띄운 뒤 탭 한 번에 해당 화면을 엽니다.",
            "판단은 한 곳에만 둡니다. 지시의 상태 전이는 항상 상태 머신에 묻고, 좌표는 단일 창구를 통과한 것만 씁니다. 화면이 무엇을 믿어야 할지 흔들리지 않으려면 진실의 출처가 하나여야 했습니다.",
            "실패를 조용히 넘기지 않습니다. 좌표를 못 보내면 화면이 먼저 말하고, 사유 없는 거절은 올라가지 않으며, 인증이 끊기면 앞사람의 흔적을 남기지 않고 세션을 폐기합니다.",
        ],
        cases: [
            {
                label: "'전송되고 있다'와 '닿고 있다'는 다른 말이다",
                problem:
                    "전송 성공 여부만 보면 앱은 정상으로 보입니다. 하지만 측위가 실패하면 보낼 좌표 자체가 없어, 관제실은 최신 위치를 받지 못하는데도 화면에는 아무 이상이 없었습니다.",
                approach:
                    "판정 기준을 전송 결과가 아니라 '마지막으로 관제실에 닿은 시각'으로 바꿨습니다. 첫 측위 전과 이후의 임계 시간을 따로 두고, 근무가 닫히면 전송과 GPS를 함께 멈춥니다.",
                result: "좌표가 끊기면 홈 화면이 '위치를 보내지 못합니다'라고 먼저 알립니다. 요원이 앱을 확인하지 않아도 침묵이 화면에 드러납니다.",
                metrics: [
                    { label: "전송 주기", value: "5초 / 60초" },
                    { label: "걸러내는 좌표", value: "3종" },
                    { label: "정지 판정", value: "1분" },
                ],
            },
            {
                label: "콜드스타트에서 사라지던 푸시 링크",
                problem:
                    "푸시를 탭해 앱이 처음 뜨는 경우, React Navigation은 대상 화면이 아직 없는 링크를 조용히 버립니다. 지시 알림을 눌렀는데 홈만 열리는 일이 생겼습니다.",
                approach:
                    "링크를 곧바로 열지 않고 보류함에 넣었습니다. 라우트가 준비되고 뒤로가기 탭이 정해진 뒤에 전달합니다. 서버가 보낸 주소로 앱을 끌고 갈 수 없도록, 스킴이 붙은 풀 URL은 거부합니다.",
                result: "콜드스타트나 권한 요청 단계에서 도착한 링크도 목적지까지 살아남습니다. 알림 상세에서 뒤로 가면 그 밴드가 열린 알림함으로, 지시 상세에서는 홈으로 돌아갑니다.",
                metrics: [
                    { label: "딥링크 경로", value: "9개" },
                    { label: "알림 종류", value: "3종" },
                    { label: "링크 프리픽스", value: "2개" },
                ],
            },
            {
                label: "화면이 그려지는 도중에 앱이 죽지 않게",
                problem:
                    "지시 상태를 화면마다 직접 대입하면 불가능한 전이가 통과하거나, 막으려고 던진 예외가 렌더 도중에 터집니다. 현장에서 앱이 내려앉으면 요원은 지시를 볼 수 없습니다.",
                approach:
                    "전이를 상태 머신 한 곳으로 모으고, 불가능한 전이는 예외 대신 null을 돌려주도록 했습니다. 화면은 null을 받으면 버튼을 막습니다. 사유 없는 거절은 애초에 올라가지 않습니다 — 관제실이 판단할 근거가 없기 때문입니다.",
                result: "상태를 직접 대입하는 코드가 저장소에서 사라졌고, 전이 실패로 렌더가 무너지는 경로가 없어졌습니다.",
                metrics: [
                    { label: "지시 상태", value: "5단계" },
                    { label: "상태 직접 대입", value: "0곳" },
                    { label: "전이 시 예외", value: "0개" },
                ],
            },
            {
                label: "검사를 다 통과하고도 앱이 죽던 이유",
                problem:
                    "expo install --fix가 제안한 버전으로 맞췄더니 Expo Go가 실행 즉시 종료됐습니다. 린트도 타입 검사도 테스트도 전부 통과한 상태였습니다.",
                approach:
                    "네이티브 모듈 버전의 정본은 --fix가 아니라 bundledNativeModules.json이라는 걸 확인하고, 설치본과 대조하는 스크립트를 만들었습니다. 의심되면 Expo Go 바이너리에서 심볼을 직접 확인했습니다.",
                result: "JS 검사는 네이티브 불일치를 원리적으로 잡지 못한다는 사실을 함정 노트로 못박았고, 이후 네이티브를 건드릴 때는 대조를 먼저 합니다.",
                metrics: [
                    { label: "테스트", value: "81 suites · 890개" },
                    { label: "그래도 못 잡는 것", value: "네이티브 불일치" },
                ],
            },
        ],
        screens: [
            {
                src: safeopsHome,
                name: "홈",
                note: "근무 상태와 좌표 전송 현황, 최근 알림",
            },
            {
                src: safeopsNotifications,
                name: "알림함",
                note: "공지 · 지시 · 대응 세 밴드와 미확인 건수",
            },
            {
                src: safeopsReport,
                name: "신고",
                note: "구역과 유형을 골라 관제실로 접수",
            },
            {
                src: safeopsSettings,
                name: "설정",
                note: "온라인 상태와 백그라운드 전송 주기",
            },
        ],
        sheets: [
            {
                src: safeopsSheetIcon,
                title: "앱 아이콘",
                note: "아이콘 바탕 #F5441B는 지금 이 페이지가 강조에 쓰는 색이기도 합니다.",
            },
            {
                src: safeopsSheetSplash,
                title: "실행",
                note: "부팅 스플래시에서 앱 스플래시로 넘어가는 두 판. 이 페이지의 지면 #080D16이 여기서 왔습니다.",
            },
        ],
        links: {},
    },
    {
        slug: "atlas-analytics",
        title: "Atlas Analytics",
        summary: "실시간 데이터를 한눈에 읽히는 대시보드로 재해석한 분석 플랫폼.",
        year: "2024",
        role: "프론트엔드 리드",
        period: "2024.02 — 2024.09",
        platform: "web",
        tech: ["React", "TypeScript", "TanStack Query", "D3", "Tailwind CSS"],
        thumbnail: hero,
        theme: {
            paper: "#eef1f6",
            surface: "#e1e7f0",
            ink: "#16202e",
            muted: "#6b7a90",
            line: "#ccd6e4",
            espresso: "#2f6df0",
            sand: "#c9dbff",
        },
        context: [
            "수십 개의 지표가 서로 다른 화면에 흩어져 있어, 사용자가 원하는 인사이트에 닿기까지 클릭이 지나치게 많았습니다.",
            "지표마다 갱신 주기가 달라 어떤 숫자가 최신인지 화면만 봐서는 알 수 없었습니다.",
        ],
        approach: [
            "지표 간 관계를 우선순위로 재구성하고, 사용자가 직접 위젯을 배치할 수 있게 했습니다.",
            "실시간 스트리밍 차트를 도입해 갱신 시점을 화면이 스스로 드러내도록 했습니다.",
        ],
        cases: [
            {
                label: "1만 행 테이블에서 프레임을 지키기",
                problem: "전체 데이터를 한 번에 그리면 스크롤이 눈에 띄게 끊겼습니다.",
                approach:
                    "가상 스크롤로 보이는 행만 그리고, 셀 렌더링을 메모이제이션해 리렌더 범위를 좁혔습니다.",
                result: "1만 행에서도 60fps를 유지합니다.",
                metrics: [
                    { label: "테이블 행", value: "10,000" },
                    { label: "스크롤", value: "60fps" },
                ],
            },
            {
                label: "개인화된 대시보드",
                problem: "팀마다 중요한 지표가 달랐지만 화면은 하나였습니다.",
                approach: "위젯 드래그 앤 드롭으로 레이아웃을 저장하도록 했습니다.",
                result: "사용자가 자기 화면을 직접 구성합니다.",
            },
        ],
        screens: [
            { src: hero, name: "대시보드", note: "위젯 레이아웃 커스터마이징" },
            { src: hero, name: "리포트", note: "지표 상세와 스트리밍 차트" },
        ],
        sheets: [],
        links: { demo: "https://example.com", repo: "https://github.com" },
    },
    {
        slug: "muse-commerce",
        title: "Muse Commerce",
        summary: "브랜드의 결을 살린 몰입형 커머스 경험을 위한 스토어프론트.",
        year: "2023",
        role: "프론트엔드 개발",
        period: "2023.05 — 2023.11",
        platform: "web",
        tech: ["Next.js", "React", "GSAP", "styled-components"],
        thumbnail: hero,
        theme: {
            paper: "#17100f",
            surface: "#241917",
            ink: "#f6ece6",
            muted: "#ab9086",
            line: "#3a2a26",
            espresso: "#d4623c",
            sand: "#33231f",
        },
        context: [
            "일반적인 커머스 템플릿으로는 브랜드가 전하려는 감성과 몰입감을 담아내기 어려웠습니다.",
            "제품 사진이 좋아도 나열식 그리드에서는 그 결이 살지 않았습니다.",
        ],
        approach: [
            "스크롤 기반 스토리텔링으로 제품을 한 번에 하나씩 보여주도록 구성했습니다.",
            "쇼핑 과정 자체가 브랜드 경험이 되도록 상세 화면의 인터랙션을 설계했습니다.",
        ],
        cases: [
            {
                label: "스크롤이 곧 쇼케이스",
                problem: "그리드 나열로는 제품 하나에 시선이 머무르지 않았습니다.",
                approach: "스크롤에 연동해 제품이 한 번에 하나씩 무대에 서도록 했습니다.",
                result: "제품 페이지 체류시간이 두 배로 늘었습니다.",
                metrics: [{ label: "체류시간", value: "2배" }],
            },
            {
                label: "결제까지 가는 길 줄이기",
                problem: "장바구니에서 결제로 넘어가는 과정에서 이탈이 컸습니다.",
                approach: "단계를 합치고, 입력 중 이탈을 막도록 상태를 보존했습니다.",
                result: "이탈률이 18% 줄었습니다.",
                metrics: [{ label: "결제 이탈률", value: "-18%" }],
            },
        ],
        screens: [
            { src: hero, name: "메인", note: "스크롤 연동 제품 쇼케이스" },
            { src: hero, name: "제품 상세", note: "이미지 인터랙션과 장바구니 플로우" },
        ],
        sheets: [],
        links: { demo: "https://example.com" },
    },
    {
        slug: "cadence-planner",
        title: "Cadence Planner",
        summary: "팀의 리듬을 시각화하는 협업 일정 관리 도구.",
        year: "2023",
        role: "프론트엔드 개발",
        period: "2022.11 — 2023.04",
        platform: "web",
        tech: ["React", "TypeScript", "Zustand", "Motion"],
        thumbnail: hero,
        theme: {
            paper: "#f0f4ef",
            surface: "#e2eae0",
            ink: "#1f2a22",
            muted: "#6f8073",
            line: "#cbd9c7",
            espresso: "#3f7d58",
            sand: "#b8e0c8",
        },
        context: [
            "여러 팀의 일정이 겹치면서 우선순위와 병목을 파악하기 어려웠습니다.",
            "충돌을 발견하는 시점이 늦어 조정 비용이 컸습니다.",
        ],
        approach: [
            "타임라인 뷰에서 드래그로 일정을 직접 조정하도록 했습니다.",
            "충돌은 저장 후가 아니라 끄는 도중에 즉시 표시합니다.",
        ],
        cases: [
            {
                label: "지연 없는 편집",
                problem: "서버 응답을 기다리는 동안 드래그가 되돌아가 보였습니다.",
                approach: "낙관적 업데이트로 먼저 반영하고 실패 시 되돌리도록 했습니다.",
                result: "편집이 손끝에 붙습니다.",
            },
            {
                label: "마우스 없이도 쓰는 타임라인",
                problem: "드래그 전용 인터랙션은 키보드 사용자를 배제했습니다.",
                approach: "모든 조작에 키보드 경로를 만들고 포커스 순서를 정리했습니다.",
                result: "키보드만으로 일정 편집이 가능합니다.",
            },
        ],
        screens: [
            { src: hero, name: "타임라인", note: "드래그 리사이즈로 일정 편집" },
            { src: hero, name: "충돌 알림", note: "겹치는 일정을 즉시 표시" },
        ],
        sheets: [],
        links: { repo: "https://github.com" },
    },
    {
        slug: "prism-docs",
        title: "Prism Docs",
        summary: "개발자를 위한 인터랙티브 문서 플랫폼.",
        year: "2022",
        role: "프론트엔드 개발",
        period: "2022.03 — 2022.09",
        platform: "web",
        tech: ["React", "MDX", "Vite", "Tailwind CSS"],
        thumbnail: hero,
        theme: {
            paper: "#10101c",
            surface: "#1a1a2c",
            ink: "#eceaf6",
            muted: "#9490b4",
            line: "#2d2b45",
            espresso: "#7c6cf0",
            sand: "#262441",
        },
        context: [
            "정적인 문서로는 API 사용법을 직접 실험해볼 수 없어 학습 곡선이 가팔랐습니다.",
            "예제를 복사해 자기 환경에 옮기기 전까지는 동작을 확인할 방법이 없었습니다.",
        ],
        approach: [
            "문서 안에서 코드를 즉시 실행하고 결과를 보는 플레이그라운드를 통합했습니다.",
            "탐색은 키보드로 끝낼 수 있도록 단축키와 전문 검색을 붙였습니다.",
        ],
        cases: [
            {
                label: "문서 안에서 코드를 돌린다",
                problem: "예제를 확인하려면 문서를 떠나 자기 환경으로 옮겨야 했습니다.",
                approach: "인라인 에디터와 실시간 프리뷰를 문서 렌더러에 연결했습니다.",
                result: "문서를 읽는 자리에서 바로 실험합니다.",
            },
            {
                label: "손이 키보드를 떠나지 않게",
                problem: "원하는 API를 찾는 데 클릭이 많았습니다.",
                approach: "전문 검색과 단축키를 붙이고 결과를 키보드로 이동하게 했습니다.",
                result: "탐색 경로가 짧아졌습니다.",
            },
        ],
        screens: [
            { src: hero, name: "문서", note: "인라인 에디터와 실시간 프리뷰" },
            { src: hero, name: "검색", note: "전문 검색과 키보드 단축키" },
        ],
        sheets: [],
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
