// 이력서(index.html)에 들어가는 내용 전부. 화면은 이 파일만 읽어서 그린다.
// 문구를 고치려면 여기만 고치면 된다 — index.html은 건드리지 않아도 된다.
//
// 규칙
// - 기간은 "YYYY.MM — YYYY.MM" 또는 "YYYY.MM — 현재" 꼴로 적는다. 타임라인이 이 값을 읽는다.
// - 배열을 비워 두면([]) 그 섹션은 화면에서 통째로 사라진다(학력·자격 등).
// - 값이 "TODO"로 시작하면 화면에 점선 표시가 붙는다. 출력(PDF)에는 표시되지 않지만,
//   내보내기 전에 채우거나 지우자.
// - 수치는 포트폴리오 저장소(src/data/*.ts)에 적힌 것만 옮겼다. 새로 넣을 때도 실측값만 쓰자.
// - 이 파일은 "이력서"다. 모든 걸 보여 주는 자리가 아니라 고르는 자리다 — 깊은 설명은 포트폴리오
//   사이트로 넘기고, 여기서는 무엇을 했고 결과가 무엇인지만 곧바로 쓴다. 쪽수보다 "줄여서 필요한 것만".
//   (2026.09 외부 비판 반영: 경력 · 프로젝트 중복 제거, 외주 목록 · 행사 참석 삭제, 기술 목록 절반으로)

window.RESUME = {
    updated: "2026.09.23",

    profile: {
        name: "임정식",
        role: "프론트엔드 개발자 · React Native · React",
        // 머리 판에서 이름 아래 한 줄. 비워 두면("") 줄이 사라진다.
        current: "센티언트 시스템즈 재직 중 · React Native 앱 개발",
        // 사진 파일은 assets/ 에 둔다. 배경을 투명하게 뺀 PNG라 종이색이 그대로 비친다. 3:4 비율. 비워 두면 사진 칸이 사라진다.
        photo: "assets/profile.png",
        // 태도 문장이 아니라 실제로 일하는 방식을 쓴다.
        tagline: "웹부터 앱 · 네이티브까지, 운영에서 생기는 문제를 해결합니다.",
        intro: [
            "6년간 React와 React Native로 웹 · 앱 서비스를 개발해 온 프론트엔드 개발자입니다. 웹에서 시작해 React Native 앱과 네이티브 모듈까지 맡는 범위를 넓혀 왔고, 두 회사에서 프론트엔드 팀 리드로 공통 구조와 코드 리뷰 기준을 맡았습니다.",
            "지금은 센티언트 시스템즈에서 근무 앱 SafeOps를 설계부터 iOS · Android 출시와 운영까지 맡고 있습니다. 화면을 만드는 것보다 인증, 백그라운드 동작, 푸시 알림, WebView 연동처럼 서비스를 운영하며 생기는 문제를 푸는 데 강합니다.",
        ],
        // 한 줄로 늘어놓는다(넘치면 다음 줄로) — 포트폴리오 · GitHub · 이메일 · 전화 · 거주
        contacts: [
            {
                label: "포트폴리오",
                value: "limjeongsik-portfolio.vercel.app",
                href: "https://limjeongsik-portfolio.vercel.app",
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
        // 생년월일은 뺐다 — 개발 역량을 판단하는 데 쓰이지 않는 정보다.
        facts: [{ label: "거주", value: "서울" }],
    },

    // 핵심 역량 — 프로젝트에서 반복해서 드러난 것만. evidence는 근거가 된 프로젝트 이름.
    strengths: [
        {
            title: "앱 · 웹 · 네이티브를 함께 다룹니다",
            body: "React 웹과 React Native(Expo managed · bare) 앱을 모두 출시했고, 라이브러리로 안 되는 긴급 알림 채널은 Kotlin Expo 모듈로 직접 만들었습니다.",
            evidence: ["SafeOps", "아이머그", "침례교 전용앱"],
        },
        {
            title: "인증과 세션 흐름을 설계합니다",
            body: "동시에 만료된 요청의 토큰 갱신을 한 번으로 묶고, 로그아웃 때 토큰 · 캐시 · 위치 상태를 함께 비우는 흐름을 만들었습니다.",
            evidence: ["침례교 전용앱", "SafeOps"],
        },
        {
            title: "측정하고, 실기기에서 검증합니다",
            body: "목록 가상화의 효과를 10,000건 기준 1,300.9ms → 32.6ms로 재서 확인했고, 알림 · 위치처럼 OS가 걸린 기능은 실기기에서 상태별로 확인합니다.",
            evidence: ["Plus SMS", "SafeOps"],
        },
    ],

    // 기술 — 지금 이 사람을 무엇으로 뽑아야 하는지 보여 주는 목록. 한 번 써 본 것은 넣지 않는다.
    // core: true인 항목은 굵게 표시된다.
    skills: [
        {
            label: "Frontend",
            items: [
                { name: "React", core: true },
                { name: "TypeScript", core: true },
                { name: "Next.js" },
                { name: "Vite" },
            ],
        },
        {
            label: "Mobile",
            items: [
                { name: "React Native", core: true },
                { name: "Expo (managed · bare)", core: true },
                { name: "Expo Modules (Kotlin)" },
                { name: "React Navigation" },
            ],
        },
        {
            label: "Native · Push",
            items: [{ name: "Kotlin" }, { name: "FCM" }, { name: "Notifee" }],
        },
        {
            label: "Data",
            items: [{ name: "TanStack Query", core: true }, { name: "Zustand" }],
        },
        {
            label: "Styling",
            items: [{ name: "styled-components" }, { name: "Tailwind CSS" }],
        },
        {
            label: "Test · Delivery",
            items: [
                { name: "Jest" },
                { name: "Vitest" },
                { name: "EAS Update" },
                { name: "Jenkins" },
            ],
        },
    ],

    // 경력 — 최근 것부터. short는 타임라인 막대에 붙는 짧은 이름.
    // 경력에는 조직 안에서의 역할과 영향을, 기술 문제와 해결은 프로젝트에 쓴다(같은 이야기를 두 번 하지 않는다).
    experience: [
        {
            company: "센티언트 시스템즈 (Sentient Systems)",
            short: "센티언트 시스템즈",
            position: "플랫폼 엔지니어 · React Native 앱 개발",
            period: "2026.07 — 현재",
            summary:
                "플랫폼 엔지니어링 팀에서 행사 경비 인력용 근무 앱 SafeOps의 앱 개발을 맡고 있습니다. 설계부터 App Store · Google Play 출시, 1.0.2까지의 운영을 담당합니다.",
            achievements: [
                "SafeOps 앱 설계 · 개발, 양대 스토어 출시와 OTA(EAS Update) 배포 · 운영",
                "긴급 알림 여부를 앱이 아닌 서버 payload가 정하도록 앱과 서버의 역할을 나눔",
                "사람 리뷰와 CodeRabbit 자동 리뷰를 모두 통과해야 코드가 반영되는 리뷰 절차를 프론트엔드 팀에 도입",
                "앱 1명 · 백엔드 1명 팀에서 앱 전체를 맡음",
                "TODO: 사용 규모(운영 행사 수, 동시 근무 인원 등)",
            ],
            stack: [
                "React Native",
                "Expo",
                "TypeScript",
                "TanStack Query",
                "Expo Modules (Kotlin)",
            ],
        },
        {
            company: "준진소프트 주식회사 및 외주 프로젝트",
            short: "준진소프트",
            position: "프론트엔드 개발 팀 리드",
            period: "2025.04 — 2026.07",
            summary:
                "앱 개발 팀의 프론트엔드 리드로 React Native 앱의 구조와 코드 리뷰 기준을 맡았습니다. 웹 리드에서 앱까지 맡는 범위를 넓힌 시기입니다.",
            achievements: [
                "웹과 앱에서 함께 쓰는 공통 API 인스턴스 설계 · 개발",
                "코드 리뷰와 멘토링으로 팀의 코드 작성 기준 정립",
                "TODO: 리드한 팀 규모와 맡은 결정(리뷰 규칙 · 온보딩 · 일정 조율 등)",
            ],
            stack: ["React Native", "React", "TypeScript", "Vite", "TanStack Query"],
        },
        {
            company: "바움루트미 주식회사",
            short: "바움루트미",
            position: "프론트엔드 개발 팀 리드",
            period: "2024.04 — 2025.04",
            summary: "웹 서비스(React · Next.js)의 프론트엔드 팀 리드로 공통 구조를 설계했습니다.",
            achievements: [
                "영상 목록 · 스와이프 · 탭을 합성 컴포넌트로 만들어 화면마다 반복하던 구현을 줄임",
                "개발 3 · 디자인 1 · 백엔드 1명 팀의 리드로 코드 리뷰(필요한 곳은 직접 수정)",
                "주말 줌 개발 스터디 운영",
            ],
            stack: [
                "React",
                "Next.js",
                "TypeScript",
                "Zustand",
                "TanStack Query",
                "styled-components",
            ],
        },
        {
            company: "프리랜서",
            short: "프리랜서",
            position: "프론트엔드 개발자",
            period: "2022.08 — 2024.03",
            summary: "React · Next.js · React Native로 웹과 앱 외주 프로젝트를 개발했습니다.",
            achievements: [],
            stack: [],
        },
        {
            company: "주식회사 피씨유스토어",
            short: "피씨유스토어",
            position: "주니어 프론트엔드 개발자",
            period: "2022.03 — 2022.07",
            summary:
                "회사 홈페이지를 만들고 쇼핑몰을 유지보수했습니다(반응형 · 웹 접근성 WCAG AA).",
            achievements: [],
            stack: [],
        },
        {
            company: "모과플레이 주식회사 및 외주 프로젝트",
            short: "모과플레이",
            position: "웹 퍼블리셔",
            period: "2020.10 — 2022.02",
            summary:
                "웹 퍼블리셔로 일을 시작해 회사 홈페이지 개발과 아이머그 웹/앱 리뉴얼을 맡았습니다.",
            achievements: [],
            stack: [],
        },
    ],

    // 프로젝트 — 최근 것부터. color는 앱의 브랜드 색(타임라인 막대).
    // 한 프로젝트에 문제 · 해결은 세 개까지, 수치는 채용 판단에 의미 있는 것만.
    projects: [
        {
            title: "SafeOps",
            color: "#f5441b",
            icon: "assets/safeops-icon.webp",
            period: "2026.07 — 현재",
            role: "앱 개발 1인(백엔드 1명과 협업) · 설계 · 구현",
            org: "센티언트 시스템즈",
            platform: "iOS · Android",
            summary:
                "행사 현장의 경비 인력과 관제실을 잇는 근무 앱입니다. 요원이 근무 중 화면을 거의 보지 않는다는 전제에서, 앱을 열지 않아도 위치가 올라가고 무음 상태에서도 긴급 지시가 울리게 만들었습니다.",
            points: [
                {
                    title: "무음 · 방해 금지 모드에서도 울리는 긴급 지시",
                    body: "알림 라이브러리로 만든 채널은 벨소리 무음을 뚫지 못했습니다. Kotlin Expo 모듈로 알람 스트림을 쓰는 긴급 채널을 직접 만들고 긴급 여부는 서버 payload가 정하게 해, 양 플랫폼 실기기에서 포그라운드 · 백그라운드 · 앱 종료 상태를 모두 확인했습니다.",
                },
                {
                    title: "다음 요원이 앞사람의 화면도, 자격도 물려받지 않게",
                    body: "한 기기를 교대로 쓰는데 로그아웃은 토큰만 지웠고, 앱이 죽어도 남는 OS 위치 작업이 로그인 전에 좌표를 보냈습니다. 세션이 끝나면 토큰 · 캐시 · 위치 상태를 함께 비우고 근무를 맡은 앱만 좌표를 보내게 해, 근무 밖 전송을 0건으로 만들었습니다.",
                },
                {
                    title: "좌표가 끊기면 화면이 먼저 알리게",
                    body: "전송 상태를 실패 횟수로만 판정해서, 측위가 멈춰 보낼 좌표가 없으면 화면이 계속 정상이었습니다. 관제실이 마지막으로 받은 시각을 기준으로 바꿔 끊기면 바로 드러나게 하고, 오래되거나 되돌아간 좌표는 걸러 냈습니다.",
                },
            ],
            metrics: [
                { value: "10초", label: "근무 중 위치 전송 주기" },
                { value: "1,050개", label: "테스트 (88 suites)" },
            ],
            tech: [
                "React Native",
                "Expo",
                "TypeScript",
                "TanStack Query",
                "FCM · Notifee",
                "Expo Modules (Kotlin)",
                "EAS Update",
            ],
            link: "",
        },
        {
            title: "침례교 전용앱",
            color: "#2b5fde",
            icon: "assets/baptist-icon.webp",
            period: "2025.04 — 현재",
            role: "앱 개발 (2인) · 설계 · 구현 · 2026.07부터 유지보수",
            org: "준진소프트",
            platform: "iOS · Android",
            summary:
                "출석 · 헌금 · 주보 · 증명서 발급을 앱 하나로 모은 교회 앱입니다. 화면이 100개가 넘는 Expo bare 프로젝트에서 iOS · Android 네이티브 설정을 직접 관리하며 딥링크 출석 · 푸시 알림 · 결제 웹뷰를 맡았습니다.",
            points: [
                {
                    title: "동시에 만료돼도 토큰 갱신은 한 번만",
                    body: "갱신을 시작한 요청이 이미 비워진 대기열을 기다리다 멈췄고, 갱신이 실패하면 로그아웃이 요청 수만큼 반복됐습니다. 진행 중인 갱신 하나를 모든 요청이 함께 기다리게 바꾸고, 세션 만료 처리는 한 번만 돌게 막았습니다.",
                },
                {
                    title: "NFC · QR 출석의 중복 처리",
                    body: "태그마다 URL이 같아 주소로는 중복을 가릴 수 없어, 처리 상태로 거르게 바꿨습니다. 출시 뒤 OTA 리로드 직후 출석이 두 번 나가는 문제도 양 플랫폼에서 재현해 고쳤습니다.",
                },
                {
                    title: "Android targetSdk 36 대응",
                    body: "edge-to-edge가 강제되면서, Android 상단 여백을 0으로 보고 고정 10dp만 비우던 헤더가 상태바와 겹쳤습니다. 플랫폼이 아니라 SDK 35를 기준으로 네이티브와 JS가 같은 상수를 보도록 바꿔 헤더 높이가 기기마다 틀어지지 않게 했습니다.",
                },
            ],
            metrics: [{ value: "100+", label: "화면" }],
            tech: [
                "React Native",
                "Expo (bare)",
                "TypeScript",
                "React Navigation",
                "TanStack Query",
                "Firebase Messaging",
            ],
            link: "",
        },
        {
            title: "아이머그",
            color: "#e0a800",
            icon: "assets/imug-icon.webp",
            period: "2024.08 — 2025.05",
            role: "개발 리드(개발 3 · 디자인 1 · 백엔드 1) · 초기 설계 · 주요 화면",
            org: "바움루트미 · 준진소프트(모과플레이 계열)",
            platform: "모바일 웹 · 앱 WebView",
            summary:
                "보호자가 시청 규칙을 정하고 아이가 그 안에서 영상을 보는 키즈 영상 서비스입니다. 웹으로 만들었지만 iOS · Android 앱의 WebView 안에서도 동작합니다.",
            points: [
                {
                    title: "시청 시간 판정을 서버에 맡겨 보는 도중에도 멈추게",
                    body: "본 시간을 영상을 나갈 때만 보내고 응답을 버려, 보는 도중 한도가 끝나도 몰랐습니다. 재생 중 5초마다 보내고 서버 응답으로 멈추게 바꿨습니다.",
                },
                {
                    title: "앱의 정지 명령을 받는 곳을 한 곳으로",
                    body: "쇼츠 슬라이드마다 같은 window 함수를 덮어써 마지막에 마운트된 슬라이드만 명령을 받았습니다. 페이지가 한 번 받아 Context로 내려주고 보이는 슬라이드만 반응하게 했습니다.",
                },
            ],
            metrics: [],
            tech: ["React", "TypeScript", "Vite", "TanStack Query", "Zustand", "styled-components"],
            link: "https://m.i-mug.co.kr",
        },
        {
            title: "Plus SMS",
            color: "#3d7ff0",
            period: "2024.11 — 2025.05",
            role: "프론트엔드 1인(백엔드 1명과 협업) · 설계 · 개발 · 배포",
            org: "개인 외주",
            platform: "웹",
            summary:
                "한 번에 최대 5만 건을 발송하는 대량 문자 웹 서비스입니다. 형식이 제각각인 번호를 정리해 중복과 오류를 걸러 내고, 포인트가 부족하면 발송 전에 막습니다.",
            points: [
                {
                    title: "10,000건 렌더링 1,300.9ms → 32.6ms",
                    body: "react-window로 보이는 줄만 그리게 하고, 전부 그리는 방식과 같은 10,000건으로 performance.now로 각각 재어 비교했습니다. 번호 칩의 줄바꿈 때문에 줄 높이가 일정하지 않던 문제는 번호 세 개를 한 줄로 묶어 해결했습니다.",
                },
                {
                    title: "직접 입력과 엑셀 업로드의 검증을 하나로",
                    body: "010- · +82 · 괄호 등 여러 형식을 정리하는 파서를 하나로 만들고 엑셀 업로드도 같은 파서를 거치게 했습니다. 잘못된 번호가 있어도 전체 발송을 막지 않고 그 번호만 모아 복사하거나 내려받을 수 있습니다.",
                },
                {
                    title: "환경 변수 하나로 두 브랜드 빌드",
                    body: "Plus SMS와 Modoo SMS를 VITE_DOMAIN 값 하나로 나누고, Jenkins가 브랜드마다 자기 .env로 따로 빌드합니다.",
                },
            ],
            metrics: [
                { value: "40배", label: "렌더링 속도 (10,000건)" },
                { value: "50,000건", label: "1회 최대 발송" },
            ],
            tech: [
                "React",
                "TypeScript",
                "Vite",
                "TanStack Query",
                "Zustand",
                "react-window",
                "Jenkins",
            ],
            link: "https://www.plus-sms.com",
        },
    ],

    // 외주 목록은 2026.09에 걷어냈다(외부 비판 — 마지막 인상이 퍼블리싱 목록이 되어 현재의
    // 정체성을 흐린다). 되살리려면 git 히스토리의 sideProjects를 참고. 비워 두면 섹션과 타임라인 막대가 사라진다.
    sideProjectsSpan: "",
    sideProjects: [],

    // 학력 · 교육 — 예시 형식: { title: "OO대학교 OO학과", period: "2014.03 — 2020.02", note: "졸업" }
    education: [],

    // 자격 · 수상 · 기타 — 예시 형식: { title: "정보처리기사", period: "2021.06", note: "한국산업인력공단" }
    // 행사 참석(우아콘)은 뺐다. 거기서 가져와 팀에 도입한 리뷰 절차는 센티언트 경력에 들어 있다.
    extras: [],
};
