# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

이 프로젝트는 패키지 매니저로 **Bun**(`bun.lock`), 린트/포맷 도구로 **Biome**를 사용합니다(기본 Vite README가 언급하는 ESLint/Prettier가 아님).

- `bun run dev` — HMR이 적용된 Vite 개발 서버 시작
- `bun run build` — 타입 체크(`tsc -b`) 후 프로덕션 빌드. 타입 에러가 있으면 빌드 실패
- `bun run preview` — 프로덕션 빌드를 로컬에서 서빙
- `bun run check` — Biome 린트 + 포맷 검사 (개별 lint/format 대신 이 명령 사용)
- `bun run check:fix` — 린트 + 포맷 이슈 자동 수정
- `bun run lint` / `bun run format` — 린트 전용 / 포맷 쓰기 전용 변형

아직 테스트 러너는 설정되어 있지 않습니다.

## 아키텍처

**Vite 8**로 번들링되는 단일 페이지 React 19 포트폴리오 앱입니다. 진입 흐름: `index.html` → `src/main.tsx`(`<StrictMode>`로 `<App />` 마운트) → `src/App.tsx`. 현재는 스캐폴드 상태입니다(`App.tsx`가 "Hello world!"만 렌더링).

코드를 추가할 때 따라야 할 주요 규약:

- **경로 별칭**: `@/*`로 임포트하며 `src/*`에 매핑됩니다. 예: `import App from "@/App"`. `tsconfig.app.json`에 설정되어 있고 Vite의 `tsconfigPaths`를 통해 사용됩니다.
- **스타일링**: `@tailwindcss/vite` 플러그인을 통한 Tailwind CSS v4. 전역 스타일은 `src/styles/index.css`에 있으며, 내용은 `@import "tailwindcss";` 한 줄뿐입니다. `tailwind.config.js`가 없으므로 v4 규약에 따라 CSS에서 Tailwind를 설정하세요.
- **SVG**: `vite-plugin-svgr`가 활성화되어 있어 SVG를 React 컴포넌트로 임포트할 수 있습니다(`?react` 접미사 사용). 타입 참조는 `src/types/vite-env.d.ts`에 있습니다.
- **애니메이션 라이브러리**: 애니메이션을 위해 `gsap`(+ `@gsap/react`)와 `motion`이 설치되어 있습니다.

## 코드 작성에 영향을 주는 Biome 규칙

설정은 `biome.json`에 있습니다. 포매터는 **4칸 들여쓰기**, **큰따옴표**, **세미콜론 항상 사용**, **100자 줄 너비**, 트레일링 콤마(JS는 `all`, JSON은 `none`)를 사용합니다. 자주 걸리는 린트 규칙:

- `useImportType`(error), `separatedType` 스타일 — 타입 전용 임포트는 인라인 `import { type X }`가 아니라 별도의 `import type { ... }` 문으로 작성해야 합니다.
- `noUnusedImports`(error, 자동 수정).
- 리액트 훅에 대한 `useHookAtTopLevel`(error)와 `useExhaustiveDependencies`(warn).
- `tsconfig.app.json`이 `noUnusedLocals` / `noUnusedParameters`를 설정하므로, 사용하지 않는 변수도 빌드를 깨뜨립니다.

작업을 마치기 전에 `bun run check:fix`를 실행하세요.

## 보안 주의사항

`.env`(`GITHUB_PAT` 포함)와 `.mcp.json`(context7 API 키 포함)에는 실제 시크릿이 들어 있으며 git에서 무시됩니다. 이들을 커밋하거나, 내용을 출력하거나, 추적되는 파일로 시크릿을 옮기지 마세요.
