/**
 * 조판 규약 — 홈과 상세가 같은 것을 쓴다.
 *
 * 서체는 Pretendard 하나이고 위계는 크기와 굵기로만 가른다. 한글 본문은 라틴보다 글자 속이
 * 빽빽해 줄간을 1.85로 넉넉히 두고, 읽는 덩이는 `MEASURE`(한글 33자 안팎)를 넘기지 않는다.
 * 색은 두 단이다 — 본문 `ink/85`, 한 줄짜리 메타 `muted`.
 */

/** 첫 화면의 큰 제목 */
export const DISPLAY =
    "text-[clamp(2.25rem,5.6vw,4.25rem)] leading-[1.18] font-bold tracking-[-0.03em] text-ink";
/** 섹션 이름 — 왼쪽 레일에 서는 이정표라 작고 굵다 */
export const RAIL = "text-[0.9375rem] font-bold text-ink";
/** 항목 제목(프로젝트 · 회사 · 사례) */
export const HEADING = "text-[1.3125rem] leading-[1.45] font-bold tracking-[-0.015em] text-ink";
/** 도입 문단 */
export const LEAD = "text-[1.125rem] leading-[1.8] text-ink sm:text-[1.1875rem]";
/** 본문 */
export const BODY = "text-[1.0625rem] leading-[1.85] text-ink/85";
/** 딸린 설명 · 캡션 */
export const SMALL = "text-[0.9375rem] leading-[1.75] text-ink/75";
/** 한 줄짜리 메타(기간 · 역할 · 기술) */
export const META = "text-[0.875rem] leading-[1.6] text-muted tabular-nums";

/** 목록 앞의 짧은 가로선 — 불릿 대신 쓴다 */
export const DASH =
    "relative pl-5 before:absolute before:top-[0.8em] before:left-0 before:h-px before:w-2.5 before:bg-ink/40";

/** 읽는 덩이의 최대 폭 */
export const MEASURE = "max-w-[38rem]";
/** 페이지 컨테이너 */
export const CONTAINER = "mx-auto w-full max-w-6xl px-5 sm:px-8";
