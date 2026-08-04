# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 먼저 읽을 것 — 진행 문서

작업 시작 전 **`docs/PROGRESS.md`를 먼저 읽으세요.** 현재 상태·디렉토리 구조·결정사항·**함정 노트**(한 번씩 밟았던 재발 방지 항목)·마지막 검증이 정리된 단일 소스입니다. 이 CLAUDE.md는 **바뀌지 않는 규약(명령어·코딩 규칙·보안)** 만 다루고, 그때그때의 상태/구조는 중복 기재하지 않습니다.

의미 있는 작업을 마칠 때마다 `docs/PROGRESS.md`의 관련 섹션을 갱신하되, **변경 이력을 나열하지 마세요** — 그건 git log가 담당합니다. 남길 것은 바뀐 현재 상태와, 다음에 같은 실수를 막아줄 함정뿐입니다.

## 명령어

이 프로젝트는 패키지 매니저로 **Bun**(`bun.lock`), 린트/포맷 도구로 **Biome**를 사용합니다(기본 Vite README가 언급하는 ESLint/Prettier가 아님).

- `bun run dev` — HMR이 적용된 Vite 개발 서버 시작
- `bun run build` — 타입 체크(`tsc -b`) 후 프로덕션 빌드. 타입 에러가 있으면 빌드 실패
- `bun run preview` — 프로덕션 빌드를 로컬에서 서빙
- `bun run check` — Biome 린트 + 포맷 검사 (개별 lint/format 대신 이 명령 사용)
- `bun run check:fix` — 린트 + 포맷 이슈 자동 수정
- `bun run lint` / `bun run format` — 린트 전용 / 포맷 쓰기 전용 변형

아직 테스트 러너는 설정되어 있지 않습니다.

## 아키텍처 규약

**Vite 8** 번들링, React 19 SPA. 진입 흐름: `index.html` → `src/main.tsx`(`<BrowserRouter>` + `<StrictMode>`) → `src/App.tsx`. 섹션·라우팅·데이터 계층의 전체 구조와 스택은 `docs/PROGRESS.md` "현재 구조"를 참고하세요. 코드를 추가할 때 지킬 규약:

- **경로 별칭**: `@/*` → `src/*`. 예: `import { Hero } from "@/components/sections/Hero"`. `tsconfig.app.json`에 설정되어 Vite `tsconfigPaths`로 동작합니다.
- **콘텐츠는 데이터로**: 화면 텍스트/목록은 컴포넌트에 하드코딩하지 말고 `src/data/*.ts`(타입은 `src/types/content.ts`)에서 가져옵니다. 사용자가 로직 없이 콘텐츠만 교체할 수 있어야 합니다.
- **스타일링**: `@tailwindcss/vite` 기반 Tailwind CSS v4. `tailwind.config.js`가 없으므로 색상/폰트 토큰은 `src/styles/index.css`의 `@theme` 블록에서 관리합니다(예: `bg-paper`, `text-espresso`, `font-display`). 새 디자인 토큰이 필요하면 이곳에 추가하세요.
- **애니메이션**: GSAP은 `@/lib/gsap`에서 import(플러그인 등록 완료), 컴포넌트에서는 `useGSAP({ scope })`로 사용. 뷰포트 리빌·인터랙션은 `motion` 사용. 새 모션은 반드시 `prefers-reduced-motion`을 존중해야 합니다(`useReducedMotion` 또는 CSS 미디어쿼리 — GSAP 인라인 트윈은 CSS로 막히지 않으니 JS에서 가드).
- **스크롤 이동**: 관성 스크롤(Lenis)이 window 스크롤을 소유합니다. 프로그래매틱 이동은 `window.scrollTo()`가 아니라 `@/lib/lenis`의 `getLenisInstance()`를 거쳐야 하며, Lenis가 없을 때(reduced-motion·최초 마운트)를 위한 폴백을 함께 둡니다. 자세한 이유는 PROGRESS.md 함정 노트 참고.
- **SVG**: `vite-plugin-svgr` 활성화 — `?react` 접미사로 React 컴포넌트 import 가능. 타입 참조는 `src/types/vite-env.d.ts`.

## 코드 작성에 영향을 주는 Biome 규칙

설정은 `biome.json`에 있습니다. 포매터는 **4칸 들여쓰기**, **큰따옴표**, **세미콜론 항상 사용**, **100자 줄 너비**, 트레일링 콤마(JS는 `all`, JSON은 `none`)를 사용합니다. 자주 걸리는 린트 규칙:

- `useImportType`(error), `separatedType` 스타일 — 타입 전용 임포트는 인라인 `import { type X }`가 아니라 별도의 `import type { ... }` 문으로 작성해야 합니다.
- `noUnusedImports`(error, 자동 수정).
- 리액트 훅에 대한 `useHookAtTopLevel`(error)와 `useExhaustiveDependencies`(warn).
- `tsconfig.app.json`이 `noUnusedLocals` / `noUnusedParameters`를 설정하므로, 사용하지 않는 변수도 빌드를 깨뜨립니다.

작업을 마치기 전에 `bun run check:fix`를 실행하세요.

## 보안 주의사항

`.env`(`GITHUB_PAT` 포함)와 `.mcp.json`(context7 API 키 포함)에는 실제 시크릿이 들어 있으며 git에서 무시됩니다. 이들을 커밋하거나, 내용을 출력하거나, 추적되는 파일로 시크릿을 옮기지 마세요.
