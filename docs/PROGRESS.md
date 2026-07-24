# 포트폴리오 진행 문서

> 최종 업데이트: 2026-07-23

프론트엔드 개발자 **포트폴리오 겸 이력서** 웹사이트. 원페이지 스크롤 + 프로젝트 상세 페이지 구조.

---

## 1. 프로젝트 진행사항

- 초기 스캐폴드(`Hello world!`) 상태에서 전체 사이트 구현 완료.
- 기획 콘셉트: **"편안한 갤러리(Calm Gallery)"** — 연한 베이지 지면 위에 프로젝트를 크게 전시하고, 개발자 정체성은 모노스페이스 메타로 인코딩.
- 핵심 요구사항 반영 완료: 원페이지 + 프로젝트 상세 분리, 스크롤 애니메이션/인터랙션, 연한 베이지 팔레트, 프로젝트 강조, 이력서 용도(연락 섹션 제거·프로필란 추가).

## 2. 현재 상태

- **기능적으로 완성** 상태. 빌드/린트 모두 통과.
- 콘텐츠는 전부 한국어 **더미**이며, 사용자가 `src/data/*.ts`만 수정하면 교체되도록 데이터 분리.
- 이미지는 `src/assets/hero.png` 하나를 모든 프로젝트 썸네일/커버/갤러리 및 프로필 사진의 플레이스홀더로 재사용 중 → 실제 에셋으로 교체 필요.
- 육안(브라우저) 확인은 세션에 브라우저 도구 미연결로 미수행. `bun run dev` 권장.

## 3. 완료된 작업 및 기능

- **라우팅**: `/` (홈 원페이지), `/projects/:slug` (프로젝트 상세). 없는 slug는 홈으로 리다이렉트.
- **홈 섹션**: Hero → About(프로필) → Skills → Experience → Projects.
- **프로필란(About)**: 사진 + 이름 + 이메일/생년월일/직군/위치 정보 + 소개 + 카운트업 통계.
- **프로젝트 강조**: 대형 2열 카드, 포인터 추종 3D 틸트 + 이미지 역시차 패럴랙스.
- **프로젝트 상세**: 커버 패럴랙스, 개요/역할/기간, 문제→해결, 하이라이트, 갤러리, 데모/레포 링크, 이전/다음 내비.
- **인터랙션**: Lenis 관성 스크롤, Navbar 진행 바 + 활성 섹션 하이라이트, Hero 글자 마스크 리빌 + 포인터 글로우 + 스크롤 페이드, 섹션 리빌, 경력 타임라인 스크롤 드로잉, 섹션 헤딩 라인 드로우.
- **연락 섹션/버튼 제거**: 이력서 용도에 맞게 Contact 섹션·CTA·네비 항목 삭제.
- **접근성**: `prefers-reduced-motion` 존중(틸트·패럴랙스·글로우·카운트업 비활성), focus-visible 링, aria 라벨.

## 4. 현재 구조

```
src/
  main.tsx                     # BrowserRouter로 App 래핑
  App.tsx                      # useLenis + ScrollToTop + Navbar + Routes + Footer
  lib/gsap.ts                  # gsap + ScrollTrigger + useGSAP 플러그인 등록
  hooks/useLenis.ts            # Lenis 관성 스크롤 ↔ ScrollTrigger 동기화
  routes/
    Home.tsx                   # Hero·About·Skills·Experience·Projects 조합
    ProjectDetail.tsx          # slug 조회 상세 페이지
  components/
    layout/                    # Navbar · Footer · ScrollToTop
    sections/                  # Hero · About · Skills · Experience · Projects
    project/                   # ProjectCard · ProjectHero · ProjectGallery
    ui/                        # SectionHeading · Reveal · Tag · CountUp
  data/                        # profile · experience · skills · projects · socials · nav (더미, 편집 지점)
  types/content.ts             # Profile · Experience · Project · SkillGroup · SocialLink
  styles/index.css             # Tailwind v4 @theme 토큰 + 폰트 + reduced-motion
docs/
  PROGRESS.md                  # 본 문서
```

- **스택**: React 19 + Vite 8 + TypeScript, Bun, Biome, Tailwind v4(@theme), react-router-dom v7, GSAP + @gsap/react, motion, Lenis.
- **팔레트 토큰**: paper `#f4eee3` / surface `#eae1d2` / ink `#2c2722` / muted `#8b8173` / line `#d8cdbb` / sand `#e4d3b2` / espresso `#3b372f`.
- **폰트**: Space Grotesk(디스플레이) · Pretendard(본문) · JetBrains Mono(메타).

## 5. 최근 작업

- **Claude Code 읽기 차단(`permissions.deny`) 도입** (토큰 절약·시크릿 보호): 사용자가 `.claudeignore`로 불필요 파일 제외를 요청 → **Claude Code는 `.claudeignore`를 지원하지 않음**을 확인(claude-code-guide 검증). 실제 효과 있는 공식 수단인 `.claude/settings.json`의 `permissions.deny`로 대체. 차단 대상: `node_modules/**`·`dist/**`·`dist-ssr/**`·`coverage/**`·`**/*.tsbuildinfo`·`bun.lock`·`.git/**`(불필요 대용량) + `.env`·`.env.*`·`.mcp.json`·`.claude/settings.local.json`(시크릿 하드 차단). 참고: Grep은 이미 `.gitignore`를 존중하므로 node_modules는 원래 검색 제외됨 — deny는 Read 실수까지 봉쇄하고 시크릿 노출을 하네스 레벨에서 막는 이중 안전장치.
- **Bash 권한 자동승인 + Codex 리뷰 래퍼** (워크플로우 편의): `.claude/settings.json`에 `permissions.allow` 신설 — `bun run:*`, 읽기 전용 git·`git add`·`git commit`을 프롬프트 없이 자동 승인("로컬까지만" 경계, `git push`·`reset --hard`·`clean`·`rm`은 계속 확인). Codex 리뷰 호출은 인라인 `CODEX_SCRIPT="$(...)"; node` 형태가 변수할당+서브셸이라 prefix 규칙 매칭 불가 → **래퍼 `.claude/scripts/codex-review.sh`**(버전 디렉토리 글롭 해석 + node 실행 + 인자 전달)를 만들어 그것만 allow(`bash .claude/scripts/codex-review.sh:*`)에 등록, `node` 전체를 여는 위험 회피. `review-and-apply` 스킬도 래퍼 호출 형태로 갱신. **Codex 리뷰 반영(P2 1건)**: 래퍼의 `set -euo pipefail`에서 `ls` 조회 실패 시 할당문이 조기 종료돼 "플러그인 없음" 안내 경로가 죽던 문제 → `|| true`로 비치명화, 부재/정상 두 경로 검증 통과. 커밋·푸시는 자동 체이닝하지 않고 리뷰 후 채팅에서 물어보는 흐름 유지(결정사항 참고).
- **Navbar Hero 복귀 pill 잔상 버그 수정** (테스트 피드백 반영): 소개 섹션에서 스크롤을 위로 올려 Hero로 돌아가도 소개 pill(active fill)이 켜진 채 남던 문제. 원인 — Hero는 `navItems`에 없는데(about/skills/experience/projects만) `IntersectionObserver` 콜백이 **교차 진입 시에만** `setActive`하고 이탈 시 초기화하지 않아, 감지 밴드(`-45%/-50%`)에 걸리는 navItem이 없는 Hero 영역에서 마지막 값("about")이 유지됨. 수정 — 밴드 안 섹션을 `Set`으로 추적해 이탈 시 제거하고, 매 콜백마다 `navItems` 순서상 첫 교차 섹션을 active로, **집합이 비면 `""`로 초기화**. 겹침 시 위쪽 섹션 우선이라 동작도 안정화. Codex 리뷰 지적 0건.
- **Navbar 3종 수정** (테스트 피드백 반영): ① **색상 통일** — active pill을 Hero "프로젝트 보기" 버튼과 맞춰 `bg-sand/60`→`bg-espresso`, active 텍스트 `text-ink`→`text-paper`(어두운 배경 대비 확보). 진행바·scroll cue dot(둘 다 espresso)과 톤 일치. ② **상세→홈 복귀 시 pill 잔상 버그** — `IntersectionObserver` effect 진입부에 `setActive("")` 추가. 이전엔 `isHome` 전환 후에도 `active`가 이전 섹션("projects")에 남아 옵저버가 새 intersection 감지 전까지 pill이 프로젝트에 붙어 있었음. 의존성 `[isHome]`이라 일반 스크롤 중엔 재실행 없음(깜빡임 X). ③ **Tailwind 경고** — `translate-y-[5px]`/`-translate-y-[5px]` → `translate-y-1.25`/`-translate-y-1.25`. (Codex 리뷰는 사용자 요청으로 이번 턴 스킵.)
- **자동 리뷰 게이트 ↔ commit-push 겹침 해소** (Codex P2 반영): commit-push가 푸시 후 PROGRESS.md를 갱신하던 순서 때문에, 그 문서 편집이 marker를 남겨 매 푸시마다 자동 리뷰가 사소하게 재발동하던 문제. ① **Stop hook에 git-status 가드 추가**(`stop-auto-review.sh`): marker가 있어도 작업 트리가 clean(=전부 커밋됨)이면 리뷰 스킵. 마커 라인은 `--untracked-files=all`+`grep -v`로 제외해 gitignore·디렉토리 collapse에 비의존. ② **commit-push 순서 변경**: PROGRESS.md 갱신을 게이트 1(리뷰) **앞**으로 이동해 리뷰·검증·커밋 트리를 일치시키고 같은 커밋에 포함 → 푸시 후 트리 clean. 근본 원인은 "marker가 커밋 여부와 무관하게 편집만으로 찍힌다"는 점(Codex 지적을 넘어 hook 레벨에서 차단). 5개 시나리오(worst-case collapse·실제 구조·진짜 변경·재귀차단·dirty) 검증 통과.
- **자동 리뷰 게이트 훅 신설** (`.claude/hooks/` + `settings.json`): 코드 편집이 있는 작업 턴이 끝나면 `review-and-apply`가 자동 실행되도록 hook으로 구성. `mark-review-pending.sh`(PostToolUse: Edit/Write/MultiEdit)가 마커를 남기고, `stop-auto-review.sh`(Stop)가 마커 확인 후 리뷰 실행을 지시. 편집 없던 턴은 미발동, `stop_hook_active`로 재귀 리뷰 무한루프 차단. 마커 파일(`.claude/.review-pending.<session_id>`)은 gitignore. **Skill 대신 hook 선택 이유**: "작업 종료 시 자동"은 하니스가 실행하는 이벤트여야 보장되며, skill은 호출을 매번 판단해야 해 자동성 미보장. **자기 리뷰 반영(Codex P2 2건)**: ① 마커를 `session_id`로 스코프해 동시 세션 간 마커 오소비(편집이 리뷰 건너뜀) 경쟁 제거 ② settings.json의 hook 경로를 따옴표로 감싸 공백 포함 경로에서도 실행되게 방어. hook 시나리오(발동/미발동/동시성/재귀차단/gitignore) 스크립트 검증 통과.
- **Codex 리뷰 반영 — Hero reduced-motion 가드**: `review-and-apply`로 받은 P2 지적(GSAP 타임라인·무한 바운스가 `prefers-reduced-motion`에서 억제 안 됨)을 타당으로 판단해 반영. `Hero.tsx`의 `useGSAP`를 `if (reduced) return`으로 가드하고 의존성에 `reduced` 추가. CSS 미디어쿼리가 못 막는 GSAP 인라인 트윈을 JS에서 차단.
- **`commit-push` 스킬 신설** (`.claude/skills/commit-push/SKILL.md`): 검증된 변경만 GitHub(origin)에 커밋·푸시. 게이트 3중 — ① `review-and-apply` **수행** 확인(없으면 먼저 실행; 판단 결과 아무것도 반영 안 해도 통과) ② `bun run check && build` 통과 ③ 시크릿(`.env`·`.mcp.json`) 스테이징 차단. 하나라도 실패하면 커밋/푸시 안 함. 통과 시 커밋(Co-Authored-By 포함) → `git push origin HEAD` → PROGRESS 갱신. `/commit-push`로 호출.
- **`review-and-apply` 스킬 신설** (`.claude/skills/review-and-apply/SKILL.md`): 작업 완료 후 Codex 코드리뷰를 받아, 코드와 대조해 타당한 지적만 반영하는 워크플로우. 리뷰 실행(`codex-companion.mjs review --wait`) → Claude 판단 게이트(거짓 양성·규약 충돌·범위 밖 필터링) → 반영 → `check`/`build` 검증 → PROGRESS 갱신·보고 순. `/review-and-apply`로 호출.
- **Hero 스크롤 페이드 수정**: 엘리먼트 측정(`useScroll target`) → 전역 스크롤 픽셀값 매핑으로 교체. 내려갈 때 0 / 올라올 때 서서히 1로 단조 동작, 섹션 전환 시 튐 제거.
- **애니메이션 고도화**: 프로젝트 카드 3D 틸트 + 패럴랙스, Hero 글자 리빌 + 포인터 글로우, 통계 카운트업, 섹션 헤딩 라인 드로우 추가.
- **프로필란 신설**: About을 소개 위주에서 이력서형 프로필(사진·이메일·생년월일·직군·위치·통계)로 재구성.
- **About 레이아웃 반복 개선** (최종): 테두리 카드로 묶는 방식이 답답 → 폐기하고, 사진+이름 나란한 헤더 + 구분선만 있는 열린 4칸 정보 스트립 + 소개 + 통계의 **개방형 편집 레이아웃**으로 확정. 모바일에선 사진 가운데 정렬.

## 6. 결정사항

- **페이지는 2종만**: 홈 + 프로젝트 상세 (과한 페이지 분리 지양).
- **라이트/베이지 고정**: 다크 모드 토글·다국어 미포함.
- **콘텐츠 데이터 분리**: 로직 수정 없이 `src/data/*.ts`만 편집해 교체.
- **이력서 톤**: 프리랜서식 "연락하기/협업 가능" 문구 제거, 대신 프로필 정보 강조.
- **애니메이션은 reduced-motion 필수 존중**, 프로젝트 강조는 항상 유지.
- **Biome 검사에서 `.claude` 제외**: 하네스 생성 설정 파일이 포맷 규칙에 걸려 `bun run check` 실패시키던 문제 해결.
- **무료 스택 선택**: 유료 GSAP ScrollSmoother 대신 Lenis 사용.
- **리뷰는 판단 게이트를 거쳐 반영**: Codex 리뷰를 그대로 따르지 않고, 코드와 대조해 타당한 것만 반영한다(`review-and-apply` 스킬). Codex 사용에는 `/codex:setup` 사전 설정 필요.
- **작업 후 리뷰는 hook으로 자동화**: `review-and-apply`를 매번 수동 호출하는 대신 Stop hook이 편집 있는 턴 종료 시 자동 발동. hook 설정은 개인 포트폴리오라 `settings.local.json`이 아닌 커밋되는 `settings.json`에 둠(팀 공유 불필요).

## 7. 마지막 검증

- `bun run check` — Biome 린트/포맷 **경고 0, 에러 0** (38 files).
- `bun run build` — `tsc -b` 타입 통과 + 프로덕션 빌드 성공.
- **Codex 리뷰**: `permissions.deny` 도입(설정 파일 변경) 대상 1회 수행 → 지적 0건("유효·타겟된 read-deny 규칙, 문서 갱신 정상 — 기능 회귀·버그 없음"). (직전: Navbar Hero 복귀 pill 0건 / 래퍼 P2 1건 `|| true` 반영 / Navbar 3종 0건.)
- **GitHub 반영**: 직전 커밋 `a94a32f` (`fix: Navbar Hero 복귀 시 active pill 잔상 제거`) → `origin/main` 푸시 완료. 이번 `permissions.deny` 변경은 `commit-push`로 커밋·푸시 진행.
- 참고: JS 번들 약 537KB(>500KB 경고), Pretendard 가변 폰트 약 2MB — 포트폴리오 규모에서 허용, 필요 시 코드 스플리팅/폰트 서브셋으로 최적화 여지.

## 8. 다음 작업 (미착수)

- 실제 이력/프로젝트 콘텐츠 및 이미지 에셋으로 더미 교체 (사용자 직접).
- (선택) 번들 코드 스플리팅, Pretendard dynamic-subset로 폰트 경량화.
- (선택) 브라우저 육안 QA — 스크롤 애니메이션·프로젝트 호버·반응형.
