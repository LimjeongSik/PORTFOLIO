import baptistBoardArchitecture from "@/assets/baptist-board-architecture.webp";
import baptistBoardIdentity from "@/assets/baptist-board-identity.webp";
import baptistBoardTokens from "@/assets/baptist-board-tokens.webp";
import baptistHomeFull from "@/assets/baptist-home-full.webp";
import baptistIcon from "@/assets/baptist-icon.webp";
import baptistSplash from "@/assets/baptist-screen-01.webp";
import baptistSignin from "@/assets/baptist-screen-02.webp";
import baptistHome from "@/assets/baptist-screen-03.webp";
import baptistMemberCard from "@/assets/baptist-screen-04.webp";
import baptistAttendance from "@/assets/baptist-screen-05.webp";
import baptistBulletin from "@/assets/baptist-screen-06.webp";
import baptistCommunity from "@/assets/baptist-screen-07.webp";
import baptistMenus from "@/assets/baptist-screen-08.webp";
import imugIcon from "@/assets/imug-icon.webp";
import imugSplash from "@/assets/imug-screen-01.webp";
import imugSignin from "@/assets/imug-screen-02.webp";
import imugProfile from "@/assets/imug-screen-03.webp";
import imugHome from "@/assets/imug-screen-04.webp";
import imugVideo from "@/assets/imug-screen-05.webp";
import imugShorts from "@/assets/imug-screen-06.webp";
import imugSearch from "@/assets/imug-screen-07.webp";
import imugMypage from "@/assets/imug-screen-08.webp";
import imugProtect from "@/assets/imug-screen-09.webp";
import imugTimeLimit from "@/assets/imug-screen-10.webp";
import imugSheetBrand from "@/assets/imug-sheet-brand.webp";
import imugSheetCharacter from "@/assets/imug-sheet-character.webp";
import imugSheetPalette from "@/assets/imug-sheet-palette.webp";
import imugSheetStack from "@/assets/imug-sheet-stack.webp";
import safeopsIcon from "@/assets/safeops-icon.webp";
import safeopsHomeDark from "@/assets/safeops-screen-01-dark.webp";
import safeopsHomeLight from "@/assets/safeops-screen-01-light.webp";
import safeopsInboxDark from "@/assets/safeops-screen-02-dark.webp";
import safeopsInboxLight from "@/assets/safeops-screen-02-light.webp";
import safeopsResponseDark from "@/assets/safeops-screen-03-dark.webp";
import safeopsResponseLight from "@/assets/safeops-screen-03-light.webp";
import safeopsRejectDark from "@/assets/safeops-screen-04-dark.webp";
import safeopsRejectLight from "@/assets/safeops-screen-04-light.webp";
import safeopsNavigateDark from "@/assets/safeops-screen-05-dark.webp";
import safeopsNavigateLight from "@/assets/safeops-screen-05-light.webp";
import safeopsDoneDark from "@/assets/safeops-screen-06-dark.webp";
import safeopsDoneLight from "@/assets/safeops-screen-06-light.webp";
import safeopsNoticeDark from "@/assets/safeops-screen-07-dark.webp";
import safeopsNoticeLight from "@/assets/safeops-screen-07-light.webp";
import safeopsReportDark from "@/assets/safeops-screen-08-dark.webp";
import safeopsReportLight from "@/assets/safeops-screen-08-light.webp";
import safeopsSettingsDark from "@/assets/safeops-screen-09-dark.webp";
import safeopsSettingsLight from "@/assets/safeops-screen-09-light.webp";
import safeopsAlertDark from "@/assets/safeops-screen-10-dark.webp";
import safeopsAlertLight from "@/assets/safeops-screen-10-light.webp";
import safeopsSheetIcon from "@/assets/safeops-sheet-icon.webp";
import safeopsSheetSplash from "@/assets/safeops-sheet-splash.webp";
import safeopsSheetThemeHome from "@/assets/safeops-sheet-theme-home.webp";
import safeopsSheetThemeSignals from "@/assets/safeops-sheet-theme-signals.webp";

import type { Project } from "@/types/content";

export const projects: Project[] = [
    {
        slug: "safeops",
        title: "SafeOps",
        summary:
            "행사 현장의 경비 요원과 관제실을 잇는 근무 앱. 요원이 화면을 보고 있지 않아도 좌표는 스스로 올라가고, 지시는 OS 알림으로 내려옵니다 — 벨소리를 꺼 뒀어도 뚫고서요. 화면은 라이트·다크 두 벌이고 기본은 라이트입니다. React Native로 설계부터 구현까지 맡았고, 1.0.0이 양 스토어에 나갔습니다.",
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
            "FCM · Notifee",
            "Expo Modules (Kotlin)",
            "네이버 지도 SDK",
            "EAS Update",
        ],
        thumbnail: safeopsHomeLight,
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
            "경비 요원은 근무 내내 무전기를 들고 걷습니다. 앱은 주머니 안에 있고 화면은 거의 보지 않습니다. 그래서 이 앱은 보통 앱과 전제가 반대입니다. 사용자가 열어야 도는 게 아니라, 열지 않아도 돌아야 합니다.",
            "계정도 요원이 만들지 않습니다. 관제실이 발급하고 근무가 끝나면 닫습니다. 회원가입도 비밀번호 재설정도 없는 대신 앱이 스스로 판단할 게 늘었습니다. 근무가 아직 열려 있는지, 좌표가 실제로 닿고 있는지, 지금 화면에 뜬 상태가 진짜인지.",
            "화면도 한 벌이 아닙니다. 한낮의 야외와 해가 진 뒤는 조명이 전혀 다르고, 야간 근무가 절반이라 테마를 두 벌 만들었습니다. 다만 시스템 설정을 따라가지는 않습니다 — 그걸 켜려면 네이티브를 다시 빌드해야 하고, 그러면 이미 나간 빌드에는 영영 닿지 않거든요. 두 벌 사이를 설정에서 고르는 것은 JS만 바뀌어서 OTA로 갑니다.",
        ],
        approach: [
            "제일 경계한 건 “도는 것처럼 보이는데 아무 일도 안 일어나는” 상태입니다. 그래서 화면은 보내는 중인지가 아니라 닿고 있는지를 봅니다. 못 재면 침묵하고, 그 침묵을 화면이 먼저 말합니다.",
            "파생 상태는 한 곳에서만 계산합니다. 홈과 설정이 같은 배지를 각자 조립하다가 한쪽만 근무 종료를 모르는 일이 있었습니다. 조건을 화면마다 다시 짜면 언젠가 한쪽만 고치게 됩니다.",
            "실패를 삼키지 않습니다. 빈 catch 하나 때문에 안드로이드 포그라운드 알림이 통째로 사라진 걸 실기기에 올려 보고서야 알았습니다. 그 뒤로 알림과 좌표 경로의 에러는 릴리스 빌드 로그에도 남깁니다.",
            "앱과 서버 사이에도 경계를 긋습니다. 어떤 알림이 무음을 뚫을지는 앱이 정하지 않고 서버가 payload로 정합니다. 앱이 종류를 보고 스스로 판단하던 때는, 서버가 일반으로 보낸 지시도 앱이 떠 있을 때만 긴급으로 떴습니다 — 같은 알림이 상황 따라 다르게 울리는 셈입니다.",
        ],
        cases: [
            {
                label: "보내는 중과 닿고 있다는 다른 말이다",
                problem:
                    "전송 성공 여부만 보면 앱은 늘 정상입니다. 그런데 측위가 실패하면 보낼 좌표 자체가 없어서, 관제실은 최신 위치를 못 받는데 화면은 멀쩡합니다. 게다가 홈과 설정이 같은 배지를 각자 계산하고 있어서 근무가 닫힌 뒤에도 설정만 재시도 중을 경고색으로 띄웠습니다.",
                approach:
                    "화면이 보는 값을 전송 시도 여부에서 마지막으로 관제실에 닿은 시각으로 바꿨습니다. 첫 측위 전과 이후의 임계 시간을 따로 두고, 근무가 닫히면 전송과 GPS를 함께 멈춥니다. 두 화면이 각자 하던 계산은 파생 함수 하나로 모아 같은 값을 보게 했습니다.",
                result: "좌표가 끊기면 홈이 먼저 위치를 보내지 못한다고 말합니다. 근무가 닫히면 홈과 설정이 동시에 근무 종료로 바뀝니다.",
                metrics: [
                    { label: "침묵 판정", value: "3분" },
                    { label: "전송 주기", value: "10초 고정" },
                    { label: "파생 계산", value: "1곳" },
                ],
            },
            {
                label: "무음을 뚫는 건 채널이 아니라 스트림의 문제였다",
                problem:
                    "현장 대응 지시만은 벨소리를 꺼 뒀어도 들려야 합니다. 안드로이드는 방해 금지 우회가 알림이 아니라 채널의 속성이라 채널을 둘로 갈랐는데, 실기기에 쏴 보니 방해 금지는 뚫렸지만 벨소리 무음은 못 뚫었습니다. 무음이 죽이는 건 알림 스트림이고, 살아남으려면 소리를 알람 스트림에 실어야 합니다. 그런데 쓰던 알림 라이브러리의 채널 타입에는 오디오 속성을 넣을 자리가 없었습니다.",
                approach:
                    "긴급 채널만 로컬 Expo 모듈(Kotlin)에서 알람 용도로 직접 만듭니다. 채널의 오디오 속성은 만든 뒤에 바꿀 수 없어서 — 지우고 같은 id로 다시 만들어도 옛 설정이 되살아납니다 — id부터 갈아야 했습니다. 삼성은 그래도 벨소리 모드 단계에서 먼저 막길래, 무음·진동일 때만 앱이 알람 용도로 소리와 진동을 직접 냅니다. 벨소리가 정상이면 빠집니다. 안 그러면 OS 소리와 겹쳐 두 번 울립니다.",
                result: "안드로이드와 iOS 실기기에서 무음 상태의 포그라운드·백그라운드·프로세스 없음 세 경우를 모두 확인했습니다. 채널 생성이 실패하면 조용히 넘어가지 않고 홈이 다시 시도 배너를 띄웁니다 — 아직 모른다와 실패했다를 한 값으로 뭉개면 경고가 영영 안 뜹니다.",
                metrics: [
                    { label: "긴급 판정", value: "서버 payload" },
                    { label: "뚫는 수단", value: "채널 · 알람 스트림" },
                    { label: "검증", value: "양 플랫폼 실기기" },
                ],
            },
            {
                label: "라이트는 다크를 뒤집은 색이 아니다",
                problem:
                    "테마를 한 벌 더 만든다는 건 색을 반전하는 일이 아니었습니다. 같은 색상의 명도만 내리면 흰 면 위에서 잉크처럼 탁해집니다. 게다가 색을 쓰는 스타일이 상수를 곧바로 참조하고 있어서, 팔레트를 갈아 끼울 자리 자체가 없었습니다.",
                approach:
                    "색을 쓰는 스타일을 전부 팔레트를 인자로 받는 팩토리로 바꿨습니다. 두 벌은 같은 토큰 이름을 갖고, 신호색은 색상을 지킨 채 명도만 뒤집습니다. 대비는 테스트가 고정합니다 — 중립 글자 셋은 AA(4.5:1)를 지키고, 채움 면 위의 글자는 UI 요소 기준(3:1)으로 둡니다. 4.5를 강제하면 신호색이 전부 어두워져 화면이 통째로 탁해집니다. 고른 값은 SecureStore에 남깁니다. 비밀이라서가 아니라 네이티브를 더 붙이지 않는 유일한 저장소라서요.",
                result: "설정에서 고르면 지도 타일까지 야간 팔레트로 뒤집힙니다. 라이트 바탕은 순백으로 두고 깊이는 그림자가 만듭니다 — 바탕을 옅게 내려 카드를 갈라내는 안은 헤더와 탭바가 불투명 흰색이라 가운데만 회색 띠가 생겨 되돌렸습니다.",
                metrics: [
                    { label: "팔레트", value: "2벌 · 같은 토큰" },
                    { label: "대비", value: "테스트가 고정" },
                    { label: "저장", value: "SecureStore" },
                ],
            },
            {
                label: "서버를 기다리지 않고 먼저 반영하되, 되돌릴 줄은 알아야 한다",
                problem:
                    "알림 상태를 서버 응답 뒤에 바꾸면 목록이 한 박자 늦게 반응합니다. 현장에서 그 한 박자는 “안 눌렸나”가 되고, 요원은 다시 누릅니다.",
                approach:
                    "상태를 캐시에 먼저 반영하고 실패하면 되돌립니다. 대신 되돌리는 조건을 좁혔습니다. 되돌림은 요청이 idle일 때만 합니다. 방금 도착 처리한 완료 상태는 아직 낙관 캐시값이라, 조건 없이 되돌리면 서버가 거절해도 완료 화면이 떠 버립니다.",
                result: "목록은 누른 즉시 반응하고, 끝난 대응을 다시 열었을 때 승인·거절 버튼이 번쩍인 뒤 완료 화면으로 튀던 것도 없어졌습니다.",
                metrics: [
                    { label: "알림 갈래", value: "공지 · 지시 · 대응" },
                    { label: "목록", value: "무한 스크롤" },
                    { label: "되돌림 조건", value: "idle일 때만" },
                ],
            },
            {
                label: "콜드스타트에서 사라지던 푸시 링크",
                problem:
                    "푸시를 탭해 앱이 처음 뜨는 경우, React Navigation은 대상 화면이 아직 없는 링크를 조용히 버립니다. 지시 알림을 눌렀는데 홈만 열리는 일이 생겼습니다.",
                approach:
                    "링크를 곧바로 열지 않고 보류함에 넣었습니다. 라우트가 준비되고 뒤로가기 탭이 정해진 뒤에 꺼내 씁니다. 서버가 보낸 주소로 앱을 아무 데나 끌고 갈 수 없도록, 스킴이 붙은 전체 URL은 받지 않습니다.",
                result: "콜드스타트나 권한 요청 단계에서 도착한 링크도 목적지까지 살아남습니다. 알림 상세에서 뒤로 가면 그 밴드가 열린 알림함으로, 지시 상세에서는 홈으로 돌아갑니다.",
                metrics: [
                    { label: "딥링크 경로", value: "9개" },
                    { label: "알림 종류", value: "3종" },
                    { label: "받는 프리픽스", value: "2개" },
                ],
            },
            {
                label: "다음 요원이 앞사람 화면을 물려받지 않게",
                problem:
                    "쿼리 키에 요원 식별자가 없습니다. 한 기기를 교대로 쓰는 앱이라, 로그아웃하고 다음 요원이 로그인하면 캐시에 남은 앞사람 지시가 그대로 보입니다.",
                approach:
                    "세션이 끝나면 토큰과 쿼리 캐시, 위치 상태를 한 번에 비웁니다. 401과 403도 같은 경로를 탑니다. 그리고 시작을 배선할 때 정지도 함께 만드는 걸 규칙으로 뒀습니다. 추적처럼 혼자 살아남는 게 있으면 그대로 다음 요원에게 넘어갑니다.",
                result: "계정이 바뀌면 화면에 남는 게 없습니다. 앱 상태와 OS 권한이 어긋날 때 무엇을 믿을지도 함께 정했습니다 — 진실은 언제나 OS 쪽입니다.",
                metrics: [
                    { label: "비우는 것", value: "토큰 · 캐시 · 위치" },
                    { label: "폐기 트리거", value: "401 · 403" },
                    { label: "테스트", value: "84 suites · 1006개" },
                ],
            },
        ],
        pipeline: {
            title: "좌표 하나가 관제실까지 가는 길",
            lede: "10초에 한 번은 반드시 닿아야 하는데, 그렇다고 들어오는 좌표를 다 보낼 수는 없습니다. 쓸 수 없는 것을 걸러야 하고, 너무 촘촘히 걸러도 전송이 통째로 멈춥니다. 상황을 골라 어디서 걸리는지 보세요.",
            stages: [
                {
                    name: "측위",
                    detail: "10초 주기로 좌표가 들어옵니다. 정지 검출은 껐습니다 — 정지 상태로 내려가는 순간 양 OS가 좌표를 삼켜서, 배터리를 내주고 끊기지 않는 쪽을 택했습니다. 근무가 닫혀 있으면 추적 자체를 시작하지 않습니다.",
                },
                {
                    name: "낡음",
                    detail: "측정 시각이 10분을 넘으면 버립니다. 원래 90초였는데, 실내에서 network 측위 갱신이 7~185초로 들쭉날쭉해 전량 걸렸습니다.",
                },
                {
                    name: "역전",
                    detail: "이전보다 뒤로 간 좌표는 연속 3회 들어오고 측정 시각이 단조 증가할 때만 받습니다. 한 건만 보고 받으면 캐시된 옛 좌표에 관제실 위치가 과거로 되돌아갑니다.",
                },
                {
                    name: "중복",
                    detail: "같은 측위가 되풀이되면 버리되, 주기의 절반인 5초가 지나면 같은 좌표라도 다시 내보냅니다. 주기와 같게 두면 경계에서 좌표가 하나 걸러 버려집니다.",
                },
                {
                    name: "전송",
                    detail: "관제실에 닿은 시각을 갱신합니다. 화면이 보는 건 전송 시도가 아니라 이 시각입니다.",
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
                    hint: "GPS가 죽고 network 측위만 남습니다. 같은 캐시 좌표가 시각까지 똑같이 되풀이됩니다.",
                    verdicts: ["pass", "pass", "pass", "drop", "skip"],
                    outcome:
                        "이 좌표는 중복으로 버려집니다. 다만 5초가 지나면 같은 좌표라도 내보내고, 그마저 없으면 10초 타이머가 마지막 좌표를 다시 올립니다. 전량 버리면 닿은 시각이 멈춰서, 실제로는 앱이 멀쩡한데 3분 침묵 판정에 걸립니다.",
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
                    hint: "관제실이 근무를 종료하면 앱은 복귀할 때마다 그 사실을 확인합니다.",
                    verdicts: ["drop", "skip", "skip", "skip", "skip"],
                    outcome:
                        "관문을 태우기 전에 추적을 멈춥니다. 전송과 GPS를 함께 내리고 홈과 설정이 동시에 근무 종료로 바뀝니다.",
                },
            ],
            note: "관문 수치는 실기기에서 관측한 값으로 조정한 것입니다. 실내 갱신 7~185초는 실측이고, 낡음 한계 10분과 중복 재전송 5초가 거기서 나왔습니다. 관문을 아무도 통과하지 못한 10초에도 마지막 좌표가 다시 올라갑니다 — 어떤 상태에서도 10초마다 닿는 것이 이 앱의 계약입니다.",
        },
        screens: [
            {
                src: safeopsHomeLight,
                srcAlt: safeopsHomeDark,
                name: "홈",
                note: "근무 상태와 관제실에 닿은 시각, 마지막으로 보낸 좌표를 찍은 지도",
            },
            {
                src: safeopsInboxLight,
                srcAlt: safeopsInboxDark,
                name: "알림함",
                note: "공지 · 지시 · 대응 세 밴드와 미확인 건수, 무한 스크롤",
            },
            {
                src: safeopsResponseLight,
                srcAlt: safeopsResponseDark,
                name: "대응 상세",
                note: "본문을 여는 것 자체가 확인이고, 승인과 거절이 아래에 선다",
            },
            {
                src: safeopsRejectLight,
                srcAlt: safeopsRejectDark,
                name: "거절 사유",
                note: "사유 없는 거절은 올리지 않는다 — 관제실이 판단할 근거가 없다",
            },
            {
                src: safeopsNavigateLight,
                srcAlt: safeopsNavigateDark,
                name: "이동 안내",
                note: "현장 특이사항을 적고, 관제실로 바로 전화한다",
            },
            {
                src: safeopsDoneLight,
                srcAlt: safeopsDoneDark,
                name: "완료",
                note: "수신부터 도착까지 걸린 시간과 남긴 특이사항",
            },
            {
                src: safeopsNoticeLight,
                srcAlt: safeopsNoticeDark,
                name: "공지 상세",
                note: "종류 배지 · 확인 상태 · 본문",
            },
            {
                src: safeopsReportLight,
                srcAlt: safeopsReportDark,
                name: "현장 신고",
                note: "탭에 들어서면 구역 시트가 저절로 열리고, 유형은 여섯 가지",
            },
            {
                src: safeopsSettingsLight,
                srcAlt: safeopsSettingsDark,
                name: "설정",
                note: "관제실 전화와 GPS 백그라운드 전송, 그리고 이 두 벌을 고르는 자리",
            },
            {
                src: safeopsAlertLight,
                srcAlt: safeopsAlertDark,
                name: "긴급 알림",
                note: "무음과 방해 금지를 뚫고 앱 위에 뜬 순간",
            },
        ],
        screenModes: {
            labels: ["라이트", "다크"],
            note: "앱의 기본은 라이트입니다. 두 벌이 같은 토큰 이름을 쓰고, 신호색은 색상을 지킨 채 명도만 뒤집습니다 — 눌러서 같은 화면의 다른 한 벌을 보세요.",
        },
        sheets: [
            {
                src: safeopsSheetThemeHome,
                title: "테마 두 벌 — 홈",
                note: "같은 화면, 같은 토큰. 지도 타일까지 함께 뒤집힙니다 — 다크에서는 네이버 야간 팔레트로 갈아 끼우고, 그 위의 컨트롤도 팔레트를 따라갑니다. 밝은 색으로 고정해 두면 어두운 타일 위에 흰 원판만 떠 있습니다.",
            },
            {
                src: safeopsSheetThemeSignals,
                title: "테마 두 벌 — 신호색",
                note: "미확인·처리 완료·거절함은 색상을 지킨 채 명도만 뒤집습니다. 그래도 색 하나에 신호를 걸지는 않습니다 — 레일 굵기와 행 배경이 함께 말하고, 모든 줄이 상태 라벨을 답니다.",
            },
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
        slug: "korea-baptist",
        title: "침례교(전용앱)",
        summary:
            "출석 · 헌금 · 주보 · 증명서를 앱 하나에 모은 교회 앱. Expo bare 워크플로우로 iOS · 안드로이드 네이티브를 직접 들고 가면서, 딥링크 출석부터 푸시 알림 · 결제 웹뷰까지 앱 쪽을 맡았습니다.",
        year: "2026",
        role: "앱 개발 (2인 · 설계 · 구현)",
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
        thumbnail: baptistHome,
        icon: baptistIcon,
        theme: {
            paper: "#edf0f6",
            surface: "#e1e6f0",
            ink: "#0d1526",
            muted: "#59637a",
            line: "#ccd5e6",
            espresso: "#2b5fde",
            sand: "#dae2f2",
        },
        context: [
            "교회 생활에 필요한 기능이 여기저기 흩어져 있었습니다. 앱 하나로 모으는 게 시작이었는데, 화면이 백 개를 넘어가면서 어려운 쪽은 기능을 만드는 게 아니라 상태를 어디서 들고 있느냐가 됐습니다. 로그인 세션과 전역 모달, 서버 캐시가 서로 물려 있어서 한 곳을 잘못 두면 엉뚱한 화면에서 터집니다.",
            "게다가 Expo bare라 ios · android 폴더를 저장소에 그대로 들고 있습니다. prebuild 한 번이면 손으로 쌓아 온 네이티브 설정이 전부 날아가기 때문에, 플랫폼 정책이 바뀔 때마다 네이티브와 JS 양쪽을 같이 맞춰야 했습니다.",
        ],
        approach: [
            "상태는 성격별로 세 군데에만 뒀습니다. 서버에서 온 건 TanStack Query, 세션과 전역 모달은 Context 두 개, 나머지는 화면 안에서 끝냅니다. 어디를 봐야 하는지 헷갈리지 않아야 화면이 백 개여도 굴러갑니다.",
            "앱 밖에서 들어오는 입력은 한 곳을 통과시킵니다. NFC · QR 딥링크, 푸시 알림 탭, 결제 웹뷰 복귀 모두 언제 열지와 어디로 돌아갈지를 훅이 정합니다. 아무 데서나 화면을 열면 사용자가 돌아갈 자리를 잃습니다.",
            "플랫폼이 갈리는 자리는 경계를 하나만 둡니다. edge-to-edge처럼 네이티브와 JS가 같은 기준을 봐야 하는 건 상수 하나로 묶고, 한쪽만 고치면 어긋나는 지점은 문서에 남겼습니다.",
        ],
        cases: [
            {
                label: "URL이 늘 똑같아서, 중복을 주소로는 못 걸렀다",
                problem:
                    "교회에 붙인 NFC 태그와 QR에는 파라미터 없는 같은 주소가 들어 있습니다. iOS는 앱이 꺼진 상태에서 열리면 초기 URL과 url 이벤트가 같이 들어오고, 안드로이드는 재진입할 때마다 인텐트를 다시 던집니다. 링크 문자열이 늘 같으니 무엇이 중복인지 주소로는 가릴 수가 없었습니다.",
                approach:
                    "판정을 주소가 아니라 상태로 옮겼습니다. 대기 중인 태그 한 건, 처리 중 플래그, 쿨다운 3초, 유효시간 10분으로 거르고 재개 트리거를 다섯 개 달았습니다. 그중 30초 타이머는 연결은 붙어 있는데 타임아웃만 계속 나는 상황에서 유일하게 남는 퇴로입니다. 오늘 이미 출석했는지는 앱이 미리 막지 않습니다. 회원 정보가 부팅 시점 스냅샷이라, 앱을 끄지 않고 자정을 넘긴 사람은 영영 출석을 못 하게 되거든요.",
                result: "네트워크가 끊긴 자리에서 태그해도 모달 없이 들고 있다가 연결되는 순간 올라갑니다. 콜드 스타트, 백그라운드 복귀, 연속 태그, 미로그인까지 안드로이드와 iOS 실기기에서 확인했습니다.",
                metrics: [
                    { label: "재개 트리거", value: "5개" },
                    { label: "유효시간", value: "10분" },
                    { label: "중복 가드", value: "4경로" },
                ],
            },
            {
                label: "401이 동시에 다섯 개 떠도 갱신은 한 번만",
                problem:
                    "화면 하나가 뜰 때 요청이 여러 개 같이 나갑니다. 액세스 토큰이 막 만료된 순간이면 그게 전부 401로 돌아오는데, 각자 갱신을 시도하면 리프레시 토큰이 여러 번 소모되고 마지막 응답만 살아남습니다. 어느 쪽이 이겼는지에 따라 어떤 요청은 통과하고 어떤 요청은 로그아웃됩니다.",
                approach:
                    "갱신을 단일 비행으로 묶었습니다. 진행 중인 갱신 프로미스가 있으면 뒤따라온 요청은 새로 시도하지 않고 그걸 그대로 기다립니다. 요청 인터셉터가 만료 5분 전에 미리 갱신해서 401 자체를 줄이고, 그래도 401이 오면 원본 요청에 재시도 표시를 남겨 두 번은 시도하지 않습니다. 세션 만료 처리에도 래치를 걸었습니다. 안 그러면 만료 모달이 실패한 요청 수만큼 뜹니다.",
                result: "동시에 401이 몇 개가 오든 리프레시 요청은 한 번만 나가고, 갱신에 성공하면 원래 요청이 새 토큰으로 그대로 이어집니다. 갱신이 끝내 실패하면 서버가 준 메시지를 덮어쓰지 않고 호출한 화면까지 그대로 올려 보냅니다.",
                metrics: [
                    { label: "리프레시 요청", value: "1회" },
                    { label: "선제 갱신", value: "만료 5분 전" },
                    { label: "재시도", value: "1회" },
                ],
            },
            {
                label: "targetSdk 한 줄이 상태바 구조를 통째로 바꿨다",
                problem:
                    "Play 정책 때문에 targetSdk를 35에서 36으로 올렸습니다. API 35부터는 edge-to-edge가 강제되고 옵트아웃 수단이 사라져서 statusBarColor도 setDecorFitsSystemWindows도 그냥 무시됩니다. “안드로이드의 상단 인셋은 0”이라고 보고 짠 코드가 앱 전체에 깔려 있었는데, 그 전제가 한 줄에 무너졌습니다.",
                approach:
                    "한쪽으로 통일하는 대신 경계를 하나만 공유하기로 했습니다. 네이티브가 SDK 35로 갈라지고 JS는 같은 기준을 상수 하나로 봅니다. edge-to-edge에서는 헤더가 상태바 자리를 직접 비우고, 그 미만에서는 비우면 안 됩니다. 시스템이 이미 비워 둔 자리에 여백을 한 번 더 주면 내용이 헤더 가운데에서 아래로 내려앉거든요.",
                result: "드로어 헤더와 뒤로가기 헤더가 같은 공식을 쓰니 높이가 어긋나지 않습니다. 구버전 경로는 최신 기기에서 강제로 재현해 픽셀 단위로 다시 쟀습니다.",
                metrics: [
                    { label: "분기 경계", value: "SDK 35" },
                    { label: "헤더 높이", value: "86.71 / 62" },
                    { label: "함께 고칠 곳", value: "2군데" },
                ],
            },
            {
                label: "목록을 마지막 페이지부터 거꾸로 읽고 있었다",
                problem:
                    "주보에 오래된순이 필요했는데 서버가 정렬을 받지 않았습니다. 그래서 총 페이지 수를 시작점으로 잡고 뒤에서부터 읽었고, 결국 최신순을 한 번 받아 본 뒤에야 오래된순을 시작할 수 있는 구조가 됐습니다. 목록 아래 페이지 번호 버튼도 화면을 계속 차지했습니다.",
                approach:
                    "서버에 sort를 요청해 정렬을 넘기고, 역순 읽기와 그걸 지탱하던 상태 · 유틸을 같이 걷어냈습니다. 번호 버튼은 무한 스크롤로 바꿨습니다. 끝 표시는 항목 수가 아니라 스크롤이 실제로 생겼는지로 판단합니다. 글자 크기 설정과 기기 높이에 따라 기준이 달라지기 때문입니다.",
                result: "정렬이 무엇이든 1페이지부터 앞으로 읽습니다. 한 건짜리 목록에 “마지막 글입니다”가 붙던 것도 사라졌고, 페이지네이션 컴포넌트와 훅 · 유틸을 저장소에서 지웠습니다.",
                metrics: [
                    { label: "지운 모듈", value: "3개" },
                    { label: "정렬 판정", value: "서버" },
                    { label: "테스트", value: "167 → 164" },
                ],
            },
        ],
        screens: [
            { src: baptistSplash, name: "스플래시", note: "앱 시작 · 폰트 로딩 게이트" },
            { src: baptistSignin, name: "로그인", note: "생체 인증으로 자동 진입" },
            { src: baptistHome, name: "홈", note: "성도증 · 바로가기 · 헌금" },
            { src: baptistMemberCard, name: "성도증", note: "회전 QR · 캡처 방지" },
            { src: baptistAttendance, name: "출석체크", note: "전역 모달 큐가 띄우는 바텀시트" },
            { src: baptistBulletin, name: "교회주보", note: "무한 스크롤 · 서버 정렬" },
            { src: baptistCommunity, name: "커뮤니티", note: "성도 게시판 피드" },
            { src: baptistMenus, name: "전체", note: "교회 · 제휴 · 고객지원" },
        ],
        anatomy: {
            src: baptistHomeFull,
            ratio: 3334 / 780,
            title: "홈 한 화면에 뭐가 물려 있나",
            lede: "세션, 캡처 방지, 웹뷰, 전역 모달이 한 화면에서 동시에 돕니다. 위에서부터 훑어보면 이렇습니다.",
            notes: [
                {
                    at: 0,
                    title: "성도증 카드 — 캡처가 막힌 화면으로 가는 입구",
                    body: "누르면 일정 시간마다 새로 그려지는 QR 화면으로 들어갑니다. 캡처와 녹화를 막는 레이어가 얹혀 있어서 화면을 켜는 순간 그 레이어가 다시 합성되고, 그 찰나가 눈에 띄어 전환 구간을 따로 손봤습니다.",
                },
                {
                    at: 0.22,
                    title: "바로가기 8칸 — 목적지는 전부 라우트 상수",
                    body: "타일이 가리키는 화면 이름은 상수 파일에만 있습니다. 문자열을 직접 적으면 오타가 타입 검사를 지나 런타임까지 살아남습니다. 칸을 8개로 묶은 건 스크롤 없이 한 화면에 들어오는 상한이기도 합니다.",
                },
                {
                    at: 0.45,
                    title: "헌금 카드 — 여기서부터는 웹뷰",
                    body: "금액을 누르면 결제는 앱 화면이 아니라 웹뷰에서 이어집니다. iOS만 웹뷰였던 걸 안드로이드까지 통일하면서 하드웨어 백키를 갈랐습니다. 같은 호스트 안이면 페이지 뒤로, 밖으로 나가면 웹뷰를 닫습니다. 이 규칙이 모달의 백키 처리와 겹쳐서, 등록 순서를 잡는 게 실제로 제일 까다로웠습니다.",
                },
                {
                    at: 0.68,
                    title: "생일 — 서버가 다음 페이지를 알려주지 않는다",
                    body: "목록 응답에 next가 없어서 누적 건수가 전체 수에 닿거나 빈 페이지가 오면 끝으로 봅니다. 오늘 생일인 사람이 없는 날이 대부분이라, 비면 다가오는 생일 목록으로 갈아 끼워 섹션이 사라졌다 나타나지 않게 했습니다.",
                },
                {
                    at: 0.86,
                    title: "가운데 탭 — 화면 이동이 아니라 전역 모달",
                    body: "누르면 라우트가 바뀌는 게 아니라 전역 모달 큐가 바텀시트를 올립니다. 출석은 어느 화면에서 시작하든 같은 동작이어야 하는데, 탭 전환으로 만들면 보고 있던 자리를 빼앗깁니다.",
                },
            ],
            footnote:
                "RootNavigator — Auth · Main(Drawer) · WebView · Camera · Offline / MainTab 5",
        },
        runtime: {
            title: "순서를 지키지 않으면 조용히 깨지는 곳",
            lede: "부팅은 다섯 단계, Provider는 여덟 겹입니다. 대부분은 자리를 바꿔도 아무 일이 없지만 몇 군데는 에러 없이 기능만 사라집니다. 표시가 붙은 자리를 눌러 보세요.",
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
                        "폰트 게이트를 빼면 첫 프레임이 기본 서체로 그려졌다가 한 번 갈아엎어집니다.",
                },
                {
                    name: "AppContent",
                    role: "인증 상태를 보고 어떤 내비게이터를 태울지 정하고, 상태바 색과 안전 영역을 맞춥니다.",
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
        sheets: [
            {
                src: baptistBoardIdentity,
                title: "아이덴티티",
                note: "iOS 아이콘 · 안드로이드 적응형 아이콘 · 스플래시 원본. 적응형은 바깥이 잘려 나가서 안전 영역을 따로 잡습니다.",
            },
            {
                src: baptistBoardTokens,
                title: "디자인 토큰",
                note: "색 · 서체 · 간격 · 터치 영역을 코드 한 곳에 모으고 화면은 이름으로만 부릅니다. 기존 hex 키 275곳은 그대로 두고 의미 계층만 얹어서 회귀 없이 넘어갔습니다.",
            },
            {
                src: baptistBoardArchitecture,
                title: "구조",
                note: "부팅 순서와 내비게이션 트리를 한 장으로 편 것. 위의 Runtime 구간이 이 그림을 눌러 볼 수 있게 만든 것입니다.",
            },
        ],
        links: {},
    },
    {
        slug: "imug",
        title: "아이머그",
        summary:
            "보호자가 울타리를 세우고 아이가 그 안에서 보는 키즈 영상 앱. 계정 하나에 사용자가 둘이라 열쇠를 넷으로 나눴고, 웹이지만 앱 WebView 안에서도 돌아 재생 명령이 바깥에서 내려옵니다. 프론트엔드 초기 설계와 메인·영상 화면을 맡았습니다.",
        year: "2025",
        role: "프론트엔드 (초기 설계 · 주요 화면 · API 연동)",
        period: "2024.08 — 2025.05",
        // 배포는 모바일 웹이지만 화면은 앱 그대로다(앱 WebView에서도 돈다). 카드·무대가 세로
        // 화면을 가로 판에 잘라 넣지 않도록 mobile로 둔다 — 자르면 상태바와 탭 바가 날아간다.
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
        thumbnail: imugHome,
        icon: imugIcon,
        theme: {
            paper: "#191023",
            surface: "#241733",
            ink: "#f6ebda",
            muted: "#a290b0",
            line: "#392a4a",
            espresso: "#ffc702",
            sand: "#2c1d3d",
        },
        context: [
            "이 앱에는 사용자가 둘입니다. 규칙을 정하는 보호자와, 그 규칙 안에서 영상을 보는 아이. 계정은 하나인데 화면은 둘로 갈립니다. 시청 시간을 정하는 사람과 그 시간에 걸리는 사람이 다르니, 로그인 한 번으로 앱 전체를 여는 방식은 처음부터 맞지 않았습니다.",
            "게다가 웹으로 만들었지만 실제로는 iOS · 안드로이드 앱의 WebView 안에서 돕니다. 영상을 멈추라는 말이 웹 바깥에서 들어오고, 지금 재생 중인지는 웹이 앱에 알려 줘야 합니다. 브라우저에만 뜨는 페이지였다면 없었을 통로를 하나 더 들고 있는 셈입니다.",
        ],
        approach: [
            "열쇠를 넷으로 나눴습니다. 서비스를 여는 것, 고른 아이 프로필의 콘텐츠를 여는 것, 보호자의 민감한 설정을 여는 것이 각각 다른 토큰입니다. 하나가 만료돼도 나머지가 같이 죽지 않고, 아이 화면에서 보호자 설정으로 넘어갈 때만 2차 인증이 걸립니다.",
            "갱신은 요청이 실패한 뒤가 아니라 나가기 직전에 합니다. 인터셉터가 만료까지 남은 시간을 재고 임계 아래면 그 자리에서 새로 받아 헤더를 갈아 끼웁니다. 401을 보고 나서 고치면 사용자는 이미 한 번 실패한 화면을 봅니다.",
            "영상을 멈춰야 하는 이유가 여러 개입니다. 앱이 내린 명령, 다 써 버린 시청 시간, 화면에 너무 가까이 붙은 얼굴. 페이지마다 각자 처리하면 그중 하나는 반드시 빠지기 때문에, 제어를 훅 하나로 모아 무엇이 멈추라고 했든 같은 자리에서 멈추게 했습니다.",
        ],
        keyring: {
            title: "열쇠 네 개를 한꺼번에 들고 다닌다",
            lede: "로그인 한 번으로 문을 다 열지 않습니다. 여는 곳이 다른 열쇠가 넷이고 수명도 갱신 시점도 각자입니다. 아래 시간축은 코드에 있는 임계(30초 · 60초)를 그대로 쓰되, 읽히도록 시간만 빠르게 감은 것입니다.",
            keys: [
                {
                    name: "Access Token",
                    header: "Authorization",
                    opens: "서비스 전체",
                    life: 300,
                    renewAt: 30,
                    renewVia: "/token/refresh",
                    note: "요청이 나가기 직전에 남은 시간을 잽니다. 30초 아래면 그 자리에서 새로 받아 헤더를 갈아 끼우고 원래 요청을 이어 보냅니다.",
                },
                {
                    name: "Refresh Token",
                    header: "encrypt_refresh_token_id",
                    opens: "위의 열쇠를 다시 만드는 일",
                    life: 1200,
                    renewAt: 0,
                    note: "이것만은 스스로 갱신하지 않습니다. 여기가 만료되면 더 물어볼 데가 없어서 저장소를 비우고 로그인 화면으로 돌려보냅니다.",
                },
                {
                    name: "Sub-Profile Token",
                    header: "Sub-Profile-Token",
                    opens: "고른 아이 프로필의 콘텐츠",
                    life: 300,
                    renewAt: 30,
                    renewVia: "/token/refresh",
                    note: "Access와 같은 응답에 실려 옵니다. 그런데 응답에 이게 빠져 있으면 프로필 선택 화면으로 보냅니다. 계정은 열렸지만 아직 누가 보는지 정해지지 않은 상태니까요.",
                },
                {
                    name: "Two-Factor Key",
                    header: "Two-Factor-Key",
                    opens: "보호자의 민감 정보",
                    life: 180,
                    renewAt: 60,
                    renewVia: "/two-factor/token/refresh",
                    note: "임계가 60초로 다르고 갱신 경로도 따로입니다. 만료되면 조용히 지우기만 합니다. 아이가 보는 화면에는 이 열쇠가 필요 없어서, 없다고 로그아웃시키면 안 됩니다.",
                },
            ],
            burst: 4,
            note: "임계 30초 · 60초와 갱신 경로는 코드 그대로입니다. 수명은 화면에서 읽히도록 줄였습니다.",
        },
        bridge: {
            title: "웹이 앱 안에서 돌 때 오가는 말",
            lede: "같은 화면이 브라우저에도 뜨고 앱의 WebView 안에도 뜹니다. 앱이 멈추라고 하면 웹이 받아야 하고, 웹에서 영상이 멈추면 앱이 알아야 합니다. 오가는 말을 눌러 보세요.",
            calls: [
                {
                    from: "app",
                    label: "앱이 영상을 멈춘다",
                    call: "window.handleAppVideoPause()",
                    effects: [
                        "플레이어에 pauseVideo()를 보낸다",
                        "스크롤을 잠근다",
                        "시력보호가 켜져 있으면 오버레이를 덮는다",
                        "쇼츠가 들고 있는 정지 상태도 함께 돌린다",
                    ],
                    applies: { playing: false, locked: true, protect: true },
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
                    applies: { playing: true, locked: false, protect: false },
                },
                {
                    from: "web",
                    label: "웹에서 재생 상태가 바뀐다",
                    ios: "window.webkit.messageHandlers.Imug.postMessage({ … })",
                    android: "window.Imug.handleAppVideoIsPlay(true)",
                    effects: [
                        "플레이어의 onStateChange를 받는다",
                        "지금 재생 중인지만 추려 앱에 넘긴다",
                        "창구가 플랫폼마다 달라 여기서 갈린다",
                    ],
                },
                {
                    from: "web",
                    label: "앱이 아니라 브라우저다",
                    call: "window.Imug?.handleAppVideoIsPlay?.(true)",
                    effects: [
                        "창구 자체가 없다",
                        "옵셔널 체이닝으로 조용히 지나간다",
                        "브라우저에서도 영상은 그대로 재생된다",
                    ],
                },
            ],
            note: "앱에서 웹을 부르는 두 함수는 window에 걸어 두고, 웹에서 앱으로 나갈 때만 플랫폼이 갈립니다.",
        },
        cases: [
            {
                label: "멈추라는 말은 한 군데서만 듣는다",
                problem:
                    "앱에서 일시정지를 눌러도 웹의 플레이어 상태와 시력보호 오버레이가 서로 어긋났습니다. 영상은 멈췄는데 오버레이는 안 덮이거나, 그 반대였습니다. 게다가 iOS와 안드로이드의 브릿지 호출 방식이 달라 같은 기능을 화면마다 두 벌씩 들고 있었습니다.",
                approach:
                    "페이지마다 흩어져 있던 영상 제어를 훅 하나로 모았습니다. 앱이 부를 함수를 window에 걸어 두고, 그 함수가 재생·스크롤 잠금·시력보호 오버레이·쇼츠 정지 상태를 한 번에 돌립니다. 반대 방향은 플레이어의 상태 변화 이벤트를 받아 재생 중인지만 앱에 넘깁니다.",
                result: "멈추라는 말이 어디서 오든 같은 자리에서 처리됩니다. 브라우저에서 열면 창구가 없어 그냥 지나가고, 영상은 평소대로 재생됩니다.",
                metrics: [
                    { label: "제어 진입점", value: "훅 1개" },
                    { label: "브릿지", value: "양방향" },
                    { label: "함께 도는 것", value: "4가지" },
                ],
            },
            {
                label: "갱신이 네 번 나가면 리프레시가 타 버린다",
                problem:
                    "화면 하나가 뜰 때 요청이 여러 개 같이 나갑니다. 액세스 토큰 만료가 코앞인 순간이면 그게 전부 각자 갱신을 시도합니다. 리프레시 토큰이 여러 번 소모되고, 마지막 응답만 살아남아 어떤 요청은 통과하고 어떤 요청은 로그아웃됩니다.",
                approach:
                    "진행 중인 갱신을 프로미스 하나에 담아 두고, 뒤따라온 요청은 새로 시도하지 않고 그걸 그대로 기다립니다. 갱신이 끝나면 저장소에서 새 토큰을 다시 읽어 요청 헤더의 Authorization과 Sub-Profile-Token을 함께 갈아 끼웁니다. 2차 인증 키는 임계도 경로도 달라서 따로 뒀습니다.",
                result: "동시에 몇 개가 나가든 갱신 요청은 한 번입니다. 갱신이 끝내 실패하면 저장소를 비우고 로그인으로 돌려보냅니다.",
                metrics: [
                    { label: "갱신 요청", value: "1회" },
                    { label: "선제 임계", value: "30초 · 60초" },
                    { label: "갈아 끼우는 헤더", value: "2개" },
                ],
            },
            {
                label: "입력창이 텍스트가 아니어야 했다",
                problem:
                    "댓글 하나에 답글 멘션과 영상 타임라인이 같이 들어갑니다. input이나 textarea로는 @닉네임과 01:23을 다른 모양으로 보여줄 수도, 지울 때 한 덩어리로 다룰 수도 없었습니다. contentEditable로 바꾸니 이번엔 입력 도중 DOM을 건드릴 때마다 커서가 맨 뒤로 튀고, 한글 조합 중이면 글자가 깨졌습니다.",
                approach:
                    "시간 형식이 감지되면 그 문자열을 편집 불가 요소로 바꿔 하나의 토큰처럼 다룹니다. 바꾸기 전에 커서 위치를 저장해 두고 변환이 끝나면 범위를 다시 만들어 제자리로 돌려놓습니다. 한글은 조합이 시작되면 변환을 멈추고, 조합이 끝난 뒤에만 다시 돕니다. 지울 때는 커서가 선 자리의 부모가 그 토큰인지 보고, 맞으면 멘션·타임라인 상태까지 같이 비웁니다.",
                result: "멘션과 타임라인이 글자가 아니라 덩어리로 움직입니다. 한글을 치는 도중에 토큰이 끼어들어 조합을 끊는 일도 없어졌습니다.",
                metrics: [
                    { label: "토큰 종류", value: "멘션 · 타임라인" },
                    { label: "커서 복구", value: "Range 재생성" },
                    { label: "조합 가드", value: "composition" },
                ],
            },
            {
                label: "같은 검색어가 목록에 계속 쌓였다",
                problem:
                    "같은 말을 여러 번 검색하면 최근 검색어에 같은 항목이 그만큼 늘어났습니다. 앞뒤 공백만 다른 것도 다른 검색어로 저장됐습니다. 한글을 치다 Enter를 누르면 조합이 끝나기 전 상태가 그대로 저장되기도 했습니다.",
                approach:
                    "저장 전에 앞뒤 공백을 떼고, 이미 있는 값이면 넣지 않습니다. 서버에서 온 목록도 그대로 그리지 않고 검색어를 키로 삼아 한 번 걸러 냅니다. Enter는 조합 중이 아닐 때만 검색으로 칩니다.",
                result: "같은 검색어는 목록에 한 줄만 남습니다. 한글을 치다 Enter를 눌러도 조합이 끝난 말로 검색됩니다.",
                metrics: [
                    { label: "거르는 곳", value: "저장 · 렌더" },
                    { label: "중복 판정", value: "검색어 자체" },
                    { label: "Enter", value: "조합 끝난 뒤" },
                ],
            },
            {
                label: "쇼츠는 지금 보는 것만 재생돼야 한다",
                problem:
                    "일반 영상은 플레이어 하나만 다루면 됐지만 쇼츠는 세로로 이어진 슬라이드마다 플레이어가 있습니다. 지금 보는 것만 재생하고 나머지는 멈춰야 하는데, 스크롤을 내리는 동안 다음 목록도 미리 받아 와야 했습니다. 여기에 시청 시간 제한과 시력보호까지 같이 걸립니다.",
                approach:
                    "목록은 무한 쿼리로 페이지 단위로 잇고, 슬라이드 제어는 별도 훅이 맡습니다. 활성 인덱스가 기준에 닿으면 다음 페이지를 미리 요청하고, 각 슬라이드는 자기가 활성인지만 보고 재생하거나 멈춥니다. 시청 시간이 남지 않았으면 재생 대신 제한 모달을 열고, 시력보호는 일반 영상과 같은 오버레이를 그대로 씁니다.",
                result: "넘기는 즉시 앞 영상이 멈추고 다음이 재생됩니다. 다음 목록은 도착하기 전에 요청돼 있어서 스크롤이 끊기지 않습니다.",
                metrics: [
                    { label: "목록", value: "무한 스크롤" },
                    { label: "재생 판정", value: "활성 슬라이드" },
                    { label: "함께 걸리는 것", value: "시간 · 시력보호" },
                ],
            },
        ],
        screens: [
            { src: imugSplash, name: "스플래시", note: "앱 시작 · 모리가 먼저 나온다" },
            { src: imugSignin, name: "로그인", note: "카카오 · 애플 · 통합 로그인" },
            { src: imugProfile, name: "프로필 선택", note: "누가 보는지를 여기서 정한다" },
            { src: imugHome, name: "홈", note: "남은 시청 시간 · 구독 채널 · 영상" },
            { src: imugVideo, name: "영상", note: "플레이어 · 댓글 · 이전/다음" },
            { src: imugShorts, name: "쇼츠", note: "세로 스와이프 · 활성 슬라이드만 재생" },
            { src: imugSearch, name: "검색", note: "최근 검색어 · 추천 채널" },
            { src: imugMypage, name: "설정", note: "보호자 전용 · 2차 인증 뒤" },
            { src: imugProtect, name: "시력보호", note: "화면이 가까우면 덮인다" },
            { src: imugTimeLimit, name: "시청 종료", note: "시간을 다 쓰면 여기서 멈춘다" },
        ],
        sheets: [
            {
                src: imugSheetBrand,
                title: "로고",
                note: "밝은 바탕에서도 어두운 바탕에서도 같은 무게로 서야 해서 네 벌을 씁니다.",
            },
            {
                src: imugSheetCharacter,
                title: "모리와 친구들",
                note: "아이가 먼저 알아보는 건 글자가 아니라 이 얼굴입니다. 시력보호 안내도 모리가 대신 말합니다.",
            },
            {
                src: imugSheetPalette,
                title: "색",
                note: "주황 #FF6032가 브랜드 색이고, 이 페이지의 강조로 쓴 #FFC702는 모리의 노랑입니다.",
            },
            {
                src: imugSheetStack,
                title: "스택",
                note: "React · Vite · React Query · Zustand · styled-components. 배포는 Jenkins에서 빌드해 Nginx로 내립니다.",
            },
        ],
        links: { demo: "https://m.i-mug.co.kr" },
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
