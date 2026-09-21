// 이력서(index.html)에 들어가는 내용 전부. 화면은 이 파일만 읽어서 그린다.
// 문구를 고치려면 여기만 고치면 된다 — index.html은 건드리지 않아도 된다.
//
// 규칙
// - 기간은 "YYYY.MM — YYYY.MM" 또는 "YYYY.MM — 현재" 꼴로 적는다. 타임라인이 이 값을 읽는다.
// - 배열을 비워 두면([]) 그 섹션은 화면에서 통째로 사라진다(학력·자격 등).
// - 값이 "TODO"로 시작하면 화면에 점선 표시가 붙는다. 출력(PDF)에는 표시되지 않지만,
//   내보내기 전에 채우거나 지우자.
// - 수치는 포트폴리오 저장소(src/data/*.ts)에 적힌 것만 옮겼다. 새로 넣을 때도 실측값만 쓰자.

window.RESUME = {
    updated: "2026.09.18",

    profile: {
        name: "임정식",
        role: "프론트엔드 개발자",
        // 머리 판에서 이름 아래 한 줄. 비워 두면("") 줄이 사라진다.
        current: "센티언트 시스템즈 플랫폼 엔지니어로 재직 중",
        // 사진 파일은 assets/ 에 둔다. 배경을 투명하게 뺀 PNG라 종이색이 그대로 비친다. 3:4 비율. 비워 두면 사진 칸이 사라진다.
        photo: "assets/profile.png",
        tagline: "완성에 머무르지 않고, 더 나은 방법을 끝까지 탐구합니다.",
        intro: [
            "웹 퍼블리셔로 일을 시작해 React 웹과 React Native 앱을 개발하는 프론트엔드 개발자로 성장했습니다. 두 회사에서 프론트엔드 팀 리드를 맡아 구조 설계와 코드 리뷰를 담당했고, 현재는 센티언트 시스템즈에서 플랫폼 엔지니어로 일하고 있습니다.",
            "인증, 푸시 알림, 위치 추적처럼 앱과 서버, 웹과 네이티브가 함께 얽힌 기능을 주로 맡아 왔습니다. 문제가 생기면 먼저 수치로 확인하고, 실제 기기에서 검증한 뒤, 해결 과정을 문서로 남기는 방식으로 일합니다.",
        ],
        // 세 칸씩 한 줄로 놓인다 — 순서대로 [포트폴리오 · GitHub · 이메일] [전화 · 생년월일 · 거주]
        contacts: [
            {
                label: "포트폴리오",
                value: "portfolio-pi-nine-wt7bk929id.vercel.app",
                href: "https://portfolio-pi-nine-wt7bk929id.vercel.app",
            },
            {
                label: "GitHub",
                value: "github.com/LimjeongSik",
                href: "https://github.com/LimjeongSik",
            },
            {
                label: "이메일",
                value: "limjeongsik95@gmail.com",
                href: "mailto:limjeongsik95@gmail.com",
            },
            { label: "전화", value: "010.9194.0167", href: "tel:01091940167" },
        ],
        facts: [
            { label: "생년월일", value: "1995. 07. 25" },
            { label: "거주", value: "서울" },
        ],
    },

    // 핵심 역량 — 프로젝트에서 반복해서 드러난 일하는 방식. evidence는 근거가 된 프로젝트 이름.
    strengths: [
        {
            title: "웹과 앱을 모두 개발합니다",
            body: "React(Vite · Next.js) 웹과 React Native(Expo managed · bare) 앱을 모두 실제 서비스로 출시했습니다. 웹 페이지가 앱의 WebView 안에서 동작하는 서비스에서는 앱과 웹이 서로 신호를 주고받는 브릿지를 양쪽 모두 설계했습니다.",
            evidence: ["SafeOps", "침례교 전용앱", "아이머그"],
        },
        {
            title: "라이브러리로 해결되지 않으면 네이티브까지 직접 다룹니다",
            body: "알림 라이브러리로는 무음 모드에서 긴급 알림을 울릴 수 없어 Kotlin으로 Expo 네이티브 모듈을 직접 만들었습니다. Android targetSdk 36 대응 때는 edge-to-edge 전환으로 틀어진 상단 여백을 네이티브와 JS가 같은 기준값을 쓰도록 맞춰 해결했습니다.",
            evidence: ["SafeOps", "침례교 전용앱"],
        },
        {
            title: "인증과 상태 관리를 안정적으로 설계합니다",
            body: "여러 요청이 동시에 만료돼도 토큰 갱신은 한 번만 일어나게 하고, 만료 전에 미리 갱신하며, 로그아웃할 때 캐시와 위치 정보까지 함께 정리하는 인증 흐름을 세 프로젝트에서 설계했습니다. 같은 값을 화면마다 따로 계산하지 않도록 계산 로직은 한곳에 모읍니다.",
            evidence: ["침례교 전용앱", "아이머그", "SafeOps"],
        },
        {
            title: "측정하고, 실제 기기로 검증합니다",
            body: "목록 성능을 개선하기 전에 렌더링 시간부터 측정해, 10,000건 기준 1,300.9ms를 32.6ms로 줄였습니다. 위치 필터 기준값은 실내에서 측정한 GPS 갱신 간격(7~185초)을 근거로 정했고, 테스트 1,006개(84 suites)로 수정한 기능이 다시 깨지지 않게 관리합니다.",
            evidence: ["Plus SMS", "SafeOps"],
        },
    ],

    // 기술 — core: true인 항목은 굵게 표시된다(실무에서 반복해서 쓴 것 기준으로 표시해 뒀다. 조정 가능).
    skills: [
        {
            label: "Frontend",
            items: [
                { name: "React", core: true },
                { name: "TypeScript", core: true },
                { name: "Next.js" },
                { name: "JavaScript" },
                { name: "Vite" },
            ],
        },
        {
            label: "Mobile",
            items: [
                { name: "React Native", core: true },
                { name: "Expo (managed · bare)", core: true },
                { name: "React Navigation" },
                { name: "Expo Modules (Kotlin)" },
                { name: "FCM · Notifee" },
                { name: "WebView 브릿지" },
                { name: "EAS Update" },
            ],
        },
        {
            label: "State & Data",
            items: [
                { name: "TanStack Query", core: true },
                { name: "Zustand" },
                { name: "Axios" },
                { name: "Context API" },
                { name: "Recoil" },
            ],
        },
        {
            label: "Styling",
            items: [
                { name: "styled-components" },
                { name: "Tailwind CSS" },
                { name: "CSS Modules" },
            ],
        },
        {
            label: "Motion · 3D",
            items: [{ name: "GSAP" }, { name: "Motion" }, { name: "Lenis" }, { name: "Three.js" }],
        },
        {
            label: "Tooling",
            items: [
                { name: "Bun" },
                { name: "Biome" },
                { name: "Vitest" },
                { name: "Jenkins" },
                { name: "Vercel" },
                { name: "GitHub" },
                { name: "Figma" },
            ],
        },
    ],

    // 경력 — 최근 것부터. short는 타임라인 막대에 붙는 짧은 이름.
    // 막대 진하기는 순서로 자동으로 정해진다(오래된 것일수록 옅다).
    experience: [
        {
            company: "센티언트 시스템즈 (Sentient Systems)",
            short: "센티언트 시스템즈",
            position: "플랫폼 엔지니어",
            period: "2026.07 — 현재",
            summary:
                "플랫폼 엔지니어링 팀에서 근무하고 있습니다. 행사 현장 경비 인력을 위한 근무 앱 SafeOps를 설계부터 개발까지 맡아 App Store와 Google Play에 출시했고, 현재 1.0.2 버전을 운영하고 있습니다.",
            achievements: [
                "앱을 열지 않아도 10초마다 위치가 관제실로 전송되는 백그라운드 위치 전송 기능 설계 · 개발",
                "Kotlin 네이티브 모듈을 직접 만들어 무음 · 방해 금지 모드에서도 울리는 긴급 알림 구현",
                "라이트 · 다크 테마를 앱 재설치 없이(OTA) 배포하고, 테스트 1,006개로 품질 관리",
                "코드 리뷰와 CodeRabbit 자동 리뷰를 모두 통과해야 커밋할 수 있는 흐름을 프론트엔드 팀에 도입",
                "리팩터링을 탐색 · 판단 · 실행 세 단계로 나누고, 앞 두 단계는 코드를 고칠 수 없는 AI 에이전트가 맡도록 파이프라인 구성 · 운영",
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
            short: "준진소프트",
            position: "프론트엔드 개발 팀 리드",
            period: "2025.04 — 2026.07",
            summary: "앱 개발 팀에서 프론트엔드 구조를 설계하고 팀의 기술 방향을 이끌었습니다.",
            achievements: [
                "웹과 앱에서 함께 쓰는 공통 API 인스턴스 설계 · 개발",
                "코드 리뷰와 멘토링으로 팀의 코드 작성 기준을 맞추고 개발 역량 향상에 기여",
            ],
            stack: ["React", "React Native", "TypeScript", "Vite", "Axios", "TanStack Query"],
        },
        {
            company: "바움루트미 주식회사",
            short: "바움루트미",
            position: "프론트엔드 개발 팀 리드",
            period: "2024.04 — 2025.04",
            summary: "개발 팀 리드로 프론트엔드 구조를 설계하고 팀의 기술 방향을 이끌었습니다.",
            achievements: [
                "웹과 앱에서 함께 쓰는 공통 API 인스턴스 설계 · 개발",
                "공통 컴포넌트를 설계 · 도입해 신규 화면 개발 기간 30% 단축",
                "팀 내 개발 스터디를 운영해 기술 역량 향상에 기여",
            ],
            stack: [
                "React",
                "Next.js",
                "Recoil",
                "Zustand",
                "Axios",
                "styled-components",
                "TanStack Query",
            ],
        },
        {
            company: "프리랜서 외주 프로젝트",
            short: "프리랜서",
            position: "프리랜서 프론트엔드 개발자",
            period: "2022.08 — 2024.03",
            summary:
                "여러 외주 프로젝트에서 프론트엔드 개발을 맡아 웹 애플리케이션을 만들었습니다.",
            achievements: [
                "고객 요구사항에 맞춰 화면을 구현 · 개선하고 프로젝트를 마무리",
                "프로젝트 성격에 따라 React · Next.js · React Native 중 적합한 기술을 골라 적용",
            ],
            stack: ["React", "Next.js", "React Native", "TypeScript", "Axios", "styled-components"],
        },
        {
            company: "주식회사 피씨유스토어",
            short: "피씨유스토어",
            position: "주니어 프론트엔드 개발자",
            period: "2022.03 — 2022.07",
            summary: "회사 홈페이지를 제작하고 쇼핑몰을 유지보수했습니다.",
            achievements: ["쇼핑몰 UI/UX 개선 및 반응형 웹 적용", "웹 접근성 개선 (WCAG AA 기준)"],
            stack: ["JavaScript", "jQuery", "HTML", "CSS"],
        },
        {
            company: "모과플레이 주식회사 및 외주 프로젝트",
            short: "모과플레이",
            position: "웹 퍼블리셔",
            period: "2020.10 — 2022.02",
            summary: "웹 퍼블리셔로 여러 웹 프로젝트를 제작하고 유지보수했습니다.",
            achievements: [
                "모과플레이 홈페이지 개발 총괄, 아이머그 웹/앱 리뉴얼",
                "웹 표준을 지켜 크로스 브라우징 문제 해결, 웹 접근성 WCAG AA 기준 충족",
                "애니메이션 · 인터랙션 구현 및 외주 프로젝트 UI 개선 · 유지보수",
            ],
            stack: ["JavaScript", "jQuery", "HTML", "CSS"],
        },
    ],

    // 프로젝트 — 최근 것부터. color는 앱의 브랜드 색(타임라인 막대).
    // icon은 assets/ 의 앱 아이콘. 없으면 color 위에 제목 첫 글자를 그린다.
    // org(소속)를 채우면 역할 옆에 붙는다. 소속이 확실하지 않은 것은 비워 뒀다.
    projects: [
        {
            title: "SafeOps",
            color: "#f5441b",
            icon: "assets/safeops-icon.webp",
            period: "2026.07 — 현재",
            role: "앱 개발 · 설계 · 구현",
            org: "센티언트 시스템즈",
            platform: "iOS · Android",
            summary:
                "행사 현장의 경비 인력과 관제실을 연결하는 근무 앱입니다. 근무 중에는 화면을 거의 보지 않는다는 점을 전제로, 앱을 열지 않아도 위치가 전송되고 무음 상태에서도 긴급 지시를 받을 수 있게 만들었습니다. App Store · Google Play에 출시해 현재 1.0.2 버전을 운영하고 있습니다.",
            points: [
                {
                    title: "위치 전송 상태를 정확하게 표시",
                    body: "10초마다 위치를 전송하면서 오래된 좌표, 이전 위치로 튄 좌표, 중복 좌표를 걸러 냅니다. 화면에는 전송을 시도했는지가 아니라 관제실이 마지막으로 위치를 받은 시각을 기준으로 상태를 보여 줘, 전송이 끊기면 바로 알 수 있게 했습니다. 필터 기준값은 실내에서 측정한 GPS 갱신 간격(7~185초)을 근거로 정했습니다.",
                },
                {
                    title: "무음 모드에서도 울리는 긴급 알림",
                    body: "사용하던 알림 라이브러리로는 알림음을 알람 채널로 보낼 수 없어, Kotlin으로 Expo 네이티브 모듈을 만들어 긴급 알림 채널을 직접 생성했습니다. 긴급 여부는 서버가 보내는 데이터로 판단하게 했고, Android · iOS 실기기에서 앱 실행 중 · 백그라운드 · 종료 상태를 모두 확인했습니다.",
                },
                {
                    title: "라이트 · 다크 테마와 OTA 배포",
                    body: "스타일 코드를 색상 팔레트에 따라 만들어지는 구조로 바꿔 두 가지 테마를 지원하고, 글자 대비 기준(AA 4.5:1 · UI 3:1)은 테스트로 검증합니다. 네이티브를 다시 빌드하지 않고 EAS Update로 배포했습니다.",
                },
                {
                    title: "여러 사람이 한 기기를 쓰는 환경 대응",
                    body: "교대 근무로 기기를 함께 쓰기 때문에 로그아웃 시 토큰 · 캐시 · 위치 정보를 한 번에 초기화합니다. 앱이 꺼진 상태에서 푸시 알림을 눌러도 해당 화면으로 이동하도록 딥링크 처리를 보완했습니다.",
                },
            ],
            metrics: [
                { value: "10초", label: "위치 전송 주기" },
                { value: "3분", label: "전송 중단 감지 기준" },
                { value: "1,006개", label: "테스트 (84 suites)" },
            ],
            tech: [
                "React Native",
                "Expo",
                "TypeScript",
                "TanStack Query",
                "FCM · Notifee",
                "Expo Modules (Kotlin)",
                "네이버 지도 SDK",
                "EAS Update",
            ],
            link: "",
        },
        {
            title: "침례교 전용앱",
            color: "#2b5fde",
            icon: "assets/baptist-icon.webp",
            period: "2025.04 — 현재",
            role: "앱 개발 (2인) · 설계 · 구현",
            org: "",
            platform: "iOS · Android",
            summary:
                "출석 · 헌금 · 주보 · 증명서 발급을 앱 하나로 모은 교회 앱입니다. 화면이 100개가 넘는 Expo bare 프로젝트에서 iOS · Android 네이티브 설정을 직접 관리하며, 딥링크 출석 · 푸시 알림 · 결제 웹뷰를 담당했습니다.",
            points: [
                {
                    title: "NFC · QR 출석의 중복 처리",
                    body: "태그마다 URL이 같아서 주소만으로는 중복 요청을 구분할 수 없었습니다. 처리 상태, 3초 재요청 제한, 10분 유효시간으로 중복을 걸러 내고, 재시도 조건 5가지를 두어 오프라인에서 태그해도 인터넷이 연결되는 즉시 출석이 처리되게 했습니다.",
                },
                {
                    title: "동시에 만료돼도 토큰 갱신은 한 번만",
                    body: "여러 요청이 동시에 401을 받아도 진행 중인 갱신 요청 하나를 함께 기다리게 해 토큰 갱신이 중복되지 않도록 했습니다. 만료 5분 전에 미리 갱신하고, 세션 만료 안내 창이 여러 번 뜨지 않게 막았습니다.",
                },
                {
                    title: "Android targetSdk 36 대응",
                    body: "edge-to-edge가 강제되면서 상단 여백을 0으로 가정한 기존 코드가 앱 전체에서 어긋났습니다. SDK 35를 기준으로 네이티브와 JS가 같은 값을 보도록 정리해 헤더 높이가 기기마다 틀어지지 않게 했습니다.",
                },
                {
                    title: "상태 관리 구조 정리",
                    body: "서버 데이터는 TanStack Query, 로그인 세션과 전역 모달은 Context, 나머지는 각 화면에서 관리하도록 나눴습니다. Provider 순서에 따라 기능이 깨지는 부분을 문서로 정리했고, 기존 색상 코드 275곳을 그대로 둔 채 디자인 토큰을 도입했습니다.",
                },
            ],
            metrics: [
                { value: "100+", label: "화면" },
                { value: "1회", label: "동시 만료 시 토큰 갱신" },
                { value: "5가지", label: "출석 재시도 조건" },
            ],
            tech: [
                "React Native",
                "Expo (bare)",
                "TypeScript",
                "React Navigation",
                "TanStack Query",
                "Reanimated",
                "Firebase Messaging",
            ],
            link: "",
        },
        {
            title: "아이머그",
            color: "#e0a800",
            icon: "assets/imug-icon.webp",
            period: "2024.08 — 2025.05",
            role: "프론트엔드 · 초기 설계 · 주요 화면 · API 연동",
            org: "",
            platform: "모바일 웹 · 앱 WebView",
            summary:
                "보호자가 시청 규칙을 정하고 아이가 그 안에서 영상을 보는 키즈 영상 서비스입니다. 웹으로 개발했지만 iOS · Android 앱의 WebView 안에서도 동작합니다. 프론트엔드 초기 설계와 메인 · 영상 화면 개발을 맡았습니다.",
            points: [
                {
                    title: "보호자와 아이를 구분하는 토큰 4종 인증",
                    body: "계정 하나를 보호자와 아이가 함께 쓰기 때문에 Access · Refresh · 아이 프로필 · 보호자 2차 인증 토큰을 나눠 관리했습니다. 토큰 하나가 만료돼도 다른 기능에는 영향이 없고, 요청 직전에 남은 시간이 30초(2차 인증은 60초)보다 적으면 먼저 갱신합니다.",
                },
                {
                    title: "앱과 웹 사이의 영상 제어 통합",
                    body: "앱의 정지 명령, 시청 시간 초과, 시력 보호 기능처럼 영상을 멈추는 경로가 여러 개라서 제어 로직을 하나의 훅으로 모았습니다. iOS와 Android의 호출 방식 차이는 한 곳에서만 처리합니다.",
                },
                {
                    title: "멘션 · 영상 시간 댓글 입력",
                    body: "댓글 안의 @멘션과 영상 시간(01:23)을 하나의 블록으로 다루기 위해 contentEditable로 입력창을 만들었습니다. 변환 뒤 커서 위치를 되돌리고, 한글을 조합하는 중에는 변환을 멈춰 글자가 깨지지 않게 했습니다.",
                },
            ],
            metrics: [
                { value: "4종", label: "인증 토큰 분리" },
                { value: "1개", label: "영상 제어 훅" },
            ],
            tech: [
                "React",
                "TypeScript",
                "Vite",
                "TanStack Query",
                "Zustand",
                "styled-components",
                "Axios",
            ],
            link: "https://m.i-mug.co.kr",
        },
        {
            title: "Plus SMS",
            color: "#3d7ff0",
            period: "2024.11 — 2025.04",
            role: "프론트엔드 1인 · 설계부터 운영까지",
            org: "",
            platform: "웹",
            summary:
                "한 번에 최대 5만 건을 발송하는 대량 문자 웹 서비스입니다. 형식이 제각각인 전화번호를 정리해 중복과 오류를 걸러 내고, 포인트가 부족하면 발송 전에 막습니다. 하나의 코드로 두 개 브랜드를 운영합니다.",
            points: [
                {
                    title: "10,000건 렌더링 1,300.9ms → 32.6ms",
                    body: "렌더링 시간을 먼저 측정한 뒤 react-window로 화면에 보이는 줄만 그리도록 바꿨습니다. 번호 칩의 줄바꿈 때문에 줄 높이가 일정하지 않던 문제는 번호 세 개를 한 줄로 묶어 해결했습니다.",
                },
                {
                    title: "직접 입력과 엑셀 업로드의 검증 통합",
                    body: "010-, +82, 괄호 등 여러 형식의 번호를 정리하는 파서를 하나로 만들고, 엑셀 업로드도 같은 파서를 거치게 했습니다. 잘못된 번호가 있어도 전체 발송을 막지 않고, 해당 번호만 모아 복사하거나 엑셀로 내려받을 수 있습니다.",
                },
                {
                    title: "환경 변수 하나로 두 브랜드 빌드",
                    body: "Plus SMS와 Modoo SMS를 VITE_DOMAIN 값 하나로 나눠 빌드합니다. Jenkins로 배포할 때 index.html 파일명에 타임스탬프를 붙이고 심볼릭 링크로 연결해, 이전 파일이 캐시에 남지 않게 했습니다.",
                },
            ],
            metrics: [
                { value: "40배", label: "렌더링 속도 개선 (10,000건)" },
                { value: "50,000건", label: "1회 최대 발송" },
                { value: "2개", label: "운영 브랜드" },
            ],
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
            link: "https://www.plus-sms.com",
        },
        {
            title: "포트폴리오 사이트",
            color: "#8a7f6a",
            period: "2026.07 — 2026.09",
            role: "개인 프로젝트 · 기획 · 디자인 · 개발",
            org: "",
            platform: "웹",
            summary:
                "이 이력서의 내용을 담은 포트폴리오 사이트입니다. 스크롤에 따라 3D 공간을 이동하며 작업물을 보여 주고, 방문자의 질문에 답하면서 해당 화면으로 안내하는 AI 챗봇을 붙였습니다.",
            points: [
                {
                    title: "스크롤로 움직이는 3D 공간",
                    body: "Three.js 캔버스 하나에서 카메라의 위치 · 방향 · 화각을 스크롤 위치에 따라 계산합니다. 페이지를 이동할 때도 화면을 새로 그리지 않고 카메라가 이동하며, 동작 줄이기 설정을 켜면 움직임을 줄입니다.",
                },
                {
                    title: "AI 안내 챗봇",
                    body: "AI SDK와 Gemini로 섹션 이동 · 페이지 이동 · 정보 카드 표시 등 7가지 도구를 쓰는 챗봇을 만들었습니다. API 키는 서버에서만 사용하고, 요청 횟수 제한 · 프롬프트 주입 차단 · 과도한 요청 크기 차단을 적용했습니다. 챗봇 코드(534KB)는 버튼에 마우스를 올렸을 때만 불러옵니다.",
                },
            ],
            metrics: [
                { value: "7가지", label: "챗봇 도구" },
                { value: "1.3초", label: "배포 환경 응답 시간" },
            ],
            tech: ["React 19", "Vite 8", "Three.js", "GSAP", "Lenis", "AI SDK", "Vercel"],
            link: "https://portfolio-pi-nine-wt7bk929id.vercel.app",
        },
    ],

    // 타임라인에 그리는 외주 구간. 개별 날짜를 모르니 전체 기간 하나로 두고 점선 막대로 그린다.
    // 비워 두면("") 타임라인에서 사라진다.
    sideProjectsSpan: "2020.10 — 2024.03",

    // 외주 프로젝트 — 2025년 이력서(my-info/임정식_이력서_2025.pdf)에서 옮겼다.
    // 모과플레이부터 바움루트미 이전까지(2020.10 — 2024.03)의 외주 작업이고, 원래 이력서의 순서
    // (최근 것부터)를 그대로 따른다. 날짜가 적혀 있지 않아 회사별로 나누지 않았다.
    // role(역할)과 tech(기술)는 원문에 있을 때만 적는다. 링크는 넣지 않는다.
    sideProjects: [
        {
            title: "웹 POS 화면 구성",
            body: "반응형 웹 POS 화면을 구성하고 사용자 이벤트 스크립트를 작성했습니다.",
        },
        {
            title: "한화 · 초록우산 맘스퀘어 커뮤니티",
            role: "개발 PM",
            body: "웹 표준에 맞춰 커뮤니티 프론트엔드를 개발했습니다.",
            tech: "HTML, CSS, JavaScript",
        },
        {
            title: "바이블25 (성경 앱)",
            body: "Android · iOS 앱을 유지보수하고 API 연동 기능을 추가 개발했습니다. WebView · Next.js 기반 화면을 작업하고 CodePush로 업데이트를 배포했습니다.",
            tech: "React Native, Next.js, App Center CodePush",
        },
        {
            title: "엠그로브 NFT",
            body: "홈페이지를 고도화하고 회원가입 시 메타마스크 지갑 연동, 로그인, 토큰 지갑 정보와 입출금 내역, 토큰-원화 환산 기능을 개발했습니다.",
            tech: "MetaMask",
        },
        {
            title: "포들리 파트너스",
            body: "반려동물 미용 예약 서비스의 웹/앱 프론트엔드를 개발하고, 예약 시스템과 예약톡 연동을 테스트했습니다.",
        },
        {
            title: "와인보우",
            body: "와인 판매 · 경매 웹을 모바일 반응형으로 퍼블리싱하고, 매장용 POS 화면과 기능 스크립트를 개발했습니다.",
        },
        {
            title: "울트라 페스티벌 TKIT",
            body: "티켓 판매 앱을 퍼블리싱하고 티킷 앱과 SNS 서비스의 프론트엔드를 개발했습니다.",
        },
        {
            title: "모두한 한의원 웹사이트",
            body: "웹사이트 템플릿을 퍼블리싱하고 웹/앱 프론트엔드를 개발했습니다.",
        },
        {
            title: "Braille (아랍 시각장애인 점자 교육 앱)",
            body: "모바일부터 태블릿까지 대응하는 반응형 프론트엔드와 스크립트를 개발했습니다.",
        },
        {
            title: "한국기술시험원(KTL) 장애인 채용 시스템",
            body: "반응형 웹/앱을 퍼블리싱하고 기능 스크립트를 개발했습니다.",
        },
        {
            title: "픽플스 모두한",
            body: "웹/앱 페이지를 리뉴얼하고 퍼블리싱과 코드 정리를 맡았습니다.",
        },
        {
            title: "로오딘 (유기전자재료 개발 연구소)",
            body: "회사 홈페이지를 반응형 웹사이트로 제작했습니다.",
        },
        {
            title: "디지털네이티브스 미디어스위치",
            body: "광고 대행 사이트의 메인 · 서브 페이지를 퍼블리싱했습니다.",
        },
        {
            title: "Nternity 쇼핑몰",
            body: "카페24 기반 쇼핑몰을 퍼블리싱하고 개발했습니다.",
            tech: "Cafe24",
        },
        {
            title: "코스메핏",
            body: "맞춤형 화장품 제작 플랫폼을 퍼블리싱했습니다.",
        },
        {
            title: "반려동물보감",
            body: "견 진단 홈페이지를 리뉴얼했습니다.",
        },
    ],

    // 학력 · 교육 — 저장소에 정보가 없어 비워 뒀다. 예시 형식:
    // { title: "OO대학교 OO학과", period: "2014.03 — 2020.02", note: "졸업" }
    education: [],

    // 자격 · 수상 · 기타 — 예시 형식:
    // { title: "정보처리기사", period: "2021.06", note: "한국산업인력공단" }
    // 활동은 사이트의 src/data/activities.ts와 짝이다 — 한쪽만 고치면 두 이력이 갈린다.
    extras: [
        {
            title: "우아콘 2025 (WOOWACON) 참석",
            period: "2025",
            note: "우아한형제들 기술 컨퍼런스. AI를 활용한 코드 리뷰 흐름, 지라 티켓으로 오류 화면을 공유하는 방식, 디자인 시스템 설계에 관한 세션을 들었고, 이 중 리뷰 흐름은 이후 팀에 도입했습니다.",
        },
    ],
};
