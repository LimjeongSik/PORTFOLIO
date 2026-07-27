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

- **번들 코드 스플리팅** (500KB 경고 해소·캐시 효율): 단일 청크 538KB(gzip 181KB)를 라우트·vendor 단위로 분할. ① **라우트 분리** — `App.tsx`에서 `ProjectDetail`을 `lazy` + `Suspense`로(`fallback`은 레이아웃 점프를 막는 `min-h-screen` 빈 영역). 홈은 첫 진입 경로라 지연 로드하면 요청 단계만 늘어나므로 eager 유지. ② **vendor 분리** — `vite.config.ts`에 `build.rolldownOptions.output.codeSplitting.groups`로 `react-vendor`(231KB) / `gsap-vendor`(114KB) / `motion-vendor`(124KB)를 갈랐다. **Vite 8은 rolldown 기반이라 `manualChunks`가 제거됨** — `codeSplitting.groups`(name + test 정규식)를 써야 한다. **결과와 한계**: 가장 큰 청크가 231KB가 되어 경고는 사라졌지만, **초기 로드 총량은 거의 그대로**(gzip 182KB → 홈에서 GSAP·motion·Lenis를 모두 쓰므로 뺄 수 있는 건 상세 페이지 5.8KB뿐). 실익은 ⓐ 앱 코드만 바뀌면 64KB짜리 `index` 청크만 다시 받고 vendor는 캐시 재사용 ⓑ 청크 병렬 다운로드. 초기 로드를 실제로 줄이려면 폰트 서브셋(Pretendard 2MB)이나 GSAP/motion 이중 사용 정리가 필요하다.
- **Projects를 그리드 → 지그재그 리스트로 재설계** (테스트 피드백 반영): 시작은 "PC에서 썸네일이 과하게 크다"였고, 그리드 안에서 4개 시안을 시도한 뒤 **레이아웃 형식 자체를 바꿔** 마무리. **최종 구조** — `ProjectCard`가 카드가 아니라 **한 행짜리 리스트 항목**: `md:grid-cols-12` 위에 썸네일 + 본문을 나란히 놓고, 항목마다 `reversed`(`index % 2 === 1`)로 좌우를 뒤집어 지그재그. 컬럼 비는 **md 6:6 → lg 5:6(+사이 1칸)**으로 2열 전환 직후 썸네일이 너무 쪼그라들지 않게 했다(md에서 바로 5칸이면 283px). 1열 구간(`<md`)에서 썸네일에 `max-w-sm` 상한을 걸어봤으나 **철회** — 왼쪽 정렬된 썸네일 오른쪽에 빈 여백이 크게 남아 어색했고, 사용자가 "차라리 큰 편이 낫다"고 판단. 1열에서는 썸네일이 컨테이너 폭을 그대로 쓴다. `Projects.tsx`는 그리드 대신 `flex flex-col gap-16 md:gap-24`. 썸네일 최대 약 **457×285**(`aspect-16/10`), 본문에는 인덱스·연도(모노, 사이에 `h-px w-8` 구분선)·제목(`2xl/3xl`)·요약·기술 4개·"자세히 보기 →"를 배치 — 이전에 이미지 위 hover 오버레이에 숨어 있던 정보를 밖으로 꺼내 정지 상태에서도 읽힌다. hover 시 이미지를 덮던 그라디언트 오버레이는 **제거**(그림자처럼 보여 불필요하다는 피드백). **인터랙션 — 통짜 리빌 → 요소별 스태거**: 처음엔 항목 전체가 한 덩어리로 슬라이드해 "대충 붙인 것처럼" 보였음. `motion` **variants**로 재구성 — 썸네일 프레임이 `y: 28 → 0`으로 떠오르면서 그 위를 덮은 `bg-surface` 패널이 `scaleY: 1 → 0`(`originY: 1`)으로 아래로 걷히며 이미지가 드러나고, 본문은 `delayChildren 0.22 + staggerChildren 0.07`로 메타 → 제목 → 요약 → 기술 → CTA가 줄 단위로 이어 올라온다. `reduced`면 전부 페이드만(`fadeVariants`). **좁은 화면(1열)용 분기** — 썸네일과 본문이 위아래로 쌓여 한 화면을 거의 채우는 구간에서는 커튼 리빌·긴 스태거가 굼떠 보여, 신설한 `useMediaQuery("(min-width: 768px)")` 훅으로 갈라 이동 거리·지연을 줄인 `compact*Variants`를 쓴다(트리거도 `-15%`→`-5%`). **커튼은 조건부 마운트가 아니라 CSS(`hidden md:block`)로만 감춘다** — 처음엔 `withCurtain && (...)`로 렌더를 갈랐는데, 창을 768px 위로 넓히면 패널이 그제야 마운트되면서 `viewport once`로 이미 끝난 리빌을 못 받아 `scaleY: 1`(이미지를 덮은 상태)로 굳어 **썸네일이 사라지는 버그**가 났다. **교훈: `viewport once` 트리를 반응형으로 조건부 마운트하지 말 것 — 나중에 붙는 자식은 이미 끝난 애니메이션을 상속받지 못한다.** 같은 이유로 1열 구간에서는 **틸트도 비활성** — 대부분 터치 기기라 탭할 때마다 카드가 기우는 게 어색하다. 레이아웃은 Tailwind 브레이크포인트로, CSS로 표현 못 하는 모션 분기만 이 훅으로 처리한다. **함정 2가지** — ① **`clipPath` 보간 금지**: 처음엔 썸네일 리빌을 `clipPath: inset(0% 0% 100% 0% round 1rem)`으로 구현했는데, `round` 키워드가 섞인 문자열은 motion이 보간하지 못해 중간 프레임 없이 최종값으로 점프한다("스크롤하면 툭 튀어나온다"는 피드백의 원인). 마스크 리빌은 clipPath 대신 **패널을 `scaleY`로 걷어내는 방식**으로 — transform이라 보간이 확실하다. ② **DOM 중첩 순서**: 틸트(`rotateX/Y`)가 바깥, 리빌이 안쪽이어야 한다. 반대면 `perspective`를 준 div의 *손자*가 회전 요소가 되어 원근이 사라진다(perspective는 직계 자식에만 적용). 더불어 `motion.article`에 빈 `rootVariants`(`{hidden:{}, show:{}}`)를 줘서 hidden/show 상태가 자식 트리로 확실히 전파되게 했다. 포인터 측정 기준도 `Link` 전체 → **썸네일 영역**으로 변경(본문 위에서 마우스를 움직여도 이미지가 과하게 기울지 않음). hover 디테일로 인덱스–연도 사이 구분선이 늘어나며 espresso로 물들고(`w-8`→`w-14`), 제목에 밑줄이 좌→우로 그려지고(`after:` 가상요소), CTA 화살표가 오른쪽으로 밀린다. **폐기한 그리드 시안들** — (a) 2열 + 비율 단계화(`lg:16/10`·`xl:16/9`) (b) 2열 + `mx-auto max-w-4xl`: 중앙 인셋이라 `max-w-6xl` 헤딩·설명과 좌우 여백이 어긋남 (c) 2열 + `lg:aspect-2/1`: 552×276이 가로로 퍼져 썸네일로 부적합 (d) 3열(3+1 배치): 항목이 4개라 둘째 줄이 빔. **교훈: 섹션 내부 요소는 헤딩과 같은 컨테이너 폭을 공유할 것, 썸네일 축소는 비율을 무너뜨리지 말고 레이아웃(열/구조)으로 할 것.** ② **패럴랙스 이동량은 % 비례** — 확대율 `scale-110`→`scale-[1.08]`(hover 1.16→1.13), 이동량은 처음에 고정 px(`±12`/`±9`)였으나 **Codex 리뷰 P2 반영**으로 크기 비례 `±3%`로 교체: 여백은 각 변 `(scale-1)/2 = 4%`라 320px 화면(272×187, 여유 7.5px)에서 9px 이동은 배경이 드러났음. %면 어떤 크기에서도 여백 안에 머문다. 확대율을 바꾸면 이동 비율(≤4%)도 같이 조정할 것. 여기에 **Codex P2 추가 반영** — 확대(Tailwind `scale-[1.08]`·`group-hover:scale-[1.13]`)와 이동(Motion `x`/`y`)을 **같은 요소에 두면 안 된다**: Motion이 인라인 `transform`을 직렬화해 클래스 transform을 덮어쓰므로 확대가 통째로 무효가 되고, 그러면 이동 여백이 0이라 배경이 드러나고 hover 줌도 안 먹는다. 확대는 wrapper div, 이동은 안쪽 `motion.img`로 분리. ③ 썸네일에 `loading="lazy"` 추가.
- **Claude Code 접근 정책: `ask`(승인형) + `deny`(시크릿 차단) 분리** (토큰 절약·시크릿 보호): 사용자가 `.claudeignore`로 불필요 파일 제외를 요청 → **Claude Code는 `.claudeignore`를 지원하지 않음**을 확인(claude-code-guide 검증). 공식 수단인 `.claude/settings.json` permissions로 대체. 처음엔 전부 `deny`로 넣었으나, `deny`는 프롬프트조차 없는 하드 차단이라 "필요 시 확인해서 읽기"가 불가 → 우선순위(`deny > ask > allow`)에 맞춰 재구성: **`ask`**(필요 시 승인 프롬프트로 접근) = `node_modules/**`·`dist/**`·`dist-ssr/**`·`coverage/**`·`**/*.tsbuildinfo`·`bun.lock`·`.git/**`(디버깅 등으로 가끔 볼 수 있는 대용량), **`deny`**(하드 차단 유지) = `.env`·`.env.*`·`.mcp.json`·`.claude/settings.local.json`(물어봐도 노출되면 안 되는 시크릿). 참고: Grep은 이미 `.gitignore`를 존중하므로 node_modules는 원래 검색 제외됨 — ask/deny는 Read 실수까지 봉쇄하고 시크릿 노출을 하네스 레벨에서 막는 이중 안전장치.
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

- `bun run check` — Biome 린트/포맷 **경고 0, 에러 0** (39 files, `useMediaQuery` 추가분 포함).
- `bun run build` — `tsc -b` 타입 통과 + 프로덕션 빌드 성공 (코드 스플리팅 반영 후 재검증, 청크 크기 경고 없음).
- **Codex 리뷰**: Projects 재설계 과정에서 **8회 수행 → P2 3건 타당 판단·반영, 나머지 0건** — ① 좁은 화면에서 세로 패럴랙스가 scale 여백 초과(px → % 비례) ② 항목 4개에 3열이면 3+1 고아 행(당시 3열 철회) ③ Motion 인라인 transform이 Tailwind `scale`을 덮어써 확대·hover 줌 무효(확대/이동을 다른 요소로 분리). 최종 지그재그 리스트 안은 "레이아웃·모션 variants·reduced-motion 처리·미디어쿼리 구독이 일관되고 기능 회귀 없음"으로 지적 0건. (직전: `ask`/`deny` 재구성 0건 / deny 최초 도입 0건 / Navbar Hero 복귀 pill 0건 / 래퍼 P2 1건 `|| true` 반영.)
- **육안 QA(사용자)**: 브레이크포인트 왕복 확인에서 발견된 2건 반영 — 768px 위로 넓힐 때 썸네일이 사라지던 버그(커튼 조건부 마운트 → CSS 제어), 1열 구간 `max-w-sm` 상한의 어색한 여백(철회).
- **Codex 리뷰(코드 스플리팅)**: 1회 수행 → 지적 0건("라우트 지연 로딩과 rolldown vendor 청크 설정이 현재 의존성과 호환되고 라우팅 동작을 보존함"). 리뷰어가 `node_modules`에서 `codeSplitting` 지원 여부를 직접 확인한 뒤 내린 결론.
- **GitHub 반영**: 직전 커밋 `409b98d` (`refactor: 프로젝트 목록을 그리드에서 지그재그 리스트로 재설계`) → `origin/main` 푸시 완료. 이번 코드 스플리팅은 `commit-push`로 커밋·푸시 진행.
- 참고: JS는 스플리팅 후 `react-vendor` 231KB / `motion-vendor` 124KB / `gsap-vendor` 114KB / `index` 64KB / `ProjectDetail` 5.8KB(지연) — **500KB 경고 해소**. 남은 최적화 여지는 Pretendard 가변 폰트 약 2MB(dynamic-subset).

## 8. 다음 작업 (미착수)

- 실제 이력/프로젝트 콘텐츠 및 이미지 에셋으로 더미 교체 (사용자 직접).
- (선택) 번들 코드 스플리팅, Pretendard dynamic-subset로 폰트 경량화.
- (선택) 브라우저 육안 QA — 스크롤 애니메이션·프로젝트 호버·반응형.
