/**
 * 지면의 조판 규약 — **홈과 상세가 같은 것을 쓴다.**
 *
 * 구간마다 줄간과 측정 폭을 따로 적어 두었더니 같은 페이지 안에서 문단이 다닥다닥 붙은 곳과
 * 헐렁한 곳이 섞였다(사용자 지적). 여기 한 곳에서만 정한다. 상세에만 있던 규약을 홈까지
 * 끌어올린 것도 같은 이유다 — 홈은 `leading-relaxed`(1.625)로 라틴 기준이었고, 상세로
 * 넘어오면 갑자기 줄이 벌어져 두 지면이 다른 책처럼 읽혔다.
 *
 * 줄간은 **한글 본문 1.9**를 바닥으로 잡는다 — 라틴보다 글자 속이 빽빽해 같은 크기에서
 * 더 벌려야 같은 밀도로 읽힌다. 본문 크기는 17px에서 시작해 `sm`부터 18px다. 측정 폭은
 * `MEASURE`(38rem ≈ 한글 33자 · 라틴 66자)로 묶는다. 컨테이너가 아무리 넓어도 읽는 덩이는
 * 이 폭을 넘지 않는다.
 *
 * 색은 세 단이다 — 본문 `ink/90`, 딸린 설명 `ink/70`, 각주 `muted`. 예전에는 딸린 설명까지
 * `muted`로 내려 긴 문단이 지면에서 떠 보였다. `muted`는 **한 줄짜리 메타**에만 쓴다.
 *
 * 컨테이너 폭은 성격으로 가른다 — 읽는 구간은 `READING`, 전시·조작 구간은 `SHOWCASE`.
 * 섞어 쓰면 섹션마다 왼쪽 선이 어긋나 페이지가 흔들려 보인다.
 */

/** 구간 이름표. 액센트로 찍는다 — 이 지면에서 색을 가진 건 프로젝트뿐이다. */
export const LABEL = "font-mono text-[0.6875rem] tracking-[0.22em] text-espresso uppercase";
/** 표·목록 안의 작은 이름표. 액센트를 남발하지 않으려고 여기서는 죽인다. */
export const LABEL_MUTED = "font-mono text-[0.6875rem] tracking-[0.22em] text-muted uppercase";

/** 구간 제목 */
export const TITLE =
    "font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.28] font-medium tracking-tight text-ink";
/** 구간 제목 아래 한 문단 */
export const LEDE = "text-[1.0625rem] leading-[1.88] text-ink/70 sm:text-[1.125rem]";

/** 본문 */
export const BODY = "text-[1.0625rem] leading-[1.9] text-ink/90 sm:text-[1.125rem]";
/** 첫 문단 — 한 단계 크고 밝다 */
export const BODY_LEAD = "text-[1.125rem] leading-[1.88] text-ink sm:text-[1.1875rem]";
/** 조작 장치 안의 짧은 설명 — 본문보다 한 단 작지만 줄간은 한글 기준을 지킨다 */
export const BODY_TIGHT = "text-[1rem] leading-[1.85] text-ink/80";
/** 각주·수치 메모 */
export const NOTE = "text-[0.9375rem] leading-[1.85] text-muted";

/** 읽는 덩이의 최대 폭 */
export const MEASURE = "max-w-[38rem]";
/** 읽는 구간의 컨테이너 */
export const READING = "mx-auto w-full max-w-4xl px-6";
/** 전시·조작 구간의 컨테이너 */
export const SHOWCASE = "mx-auto w-full max-w-5xl px-6";
/** 문단 사이 */
export const STACK = "flex flex-col gap-7";
