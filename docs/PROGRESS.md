# 포트폴리오 진행 문서

> 최종 업데이트: 2026-09-02

프론트엔드 개발자 **포트폴리오 겸 이력서** 웹사이트. 원페이지 스크롤 + 프로젝트 상세 페이지 구조.
콘셉트는 **"편안한 갤러리(Calm Gallery)"** — 연한 베이지 지면에 프로젝트를 크게 전시하고, 개발자
정체성은 모노스페이스 메타로 인코딩.

이 문서는 **현재 상태·구조·규약·함정**을 담는다. 변경 이력은 git log가 담당하므로 여기에 중복
기록하지 않는다(`git log --oneline`).

---

## 1. 현재 상태

- **기능적으로 완성**. `bun run check` / `bun run build` 통과.
- 프로필·경력·스킬은 **실제 콘텐츠 반영 완료**(`profile.ts`·`experience.ts`·`skills.ts`).
- **실제 콘텐츠는 SafeOps · 침례교(전용앱) 둘**(`projects.ts`). 나머지 3개는 더미이고 이미지는
  `src/assets/hero.png` 자리표시자.

## 2. 구조

```
src/
  main.tsx                     # BrowserRouter로 App 래핑
  App.tsx                      # useLenis + ScrollToTop + Navbar + Routes + Footer
  lib/gsap.ts                  # gsap + ScrollTrigger + useGSAP 플러그인 등록
  lib/lenis.ts                 # Lenis 인스턴스 모듈 싱글톤(라우트 스크롤 리셋용)
  hooks/                       # useLenis(관성 스크롤 ↔ ScrollTrigger) · useMediaQuery
  routes/                      # Home(원페이지 조합) · ProjectDetail(slug 조회)
  components/
    layout/                    # Navbar · Footer · ScrollToTop
    sections/                  # Hero · About · Skills · Experience · Projects
    project/                   # ProjectCard · ProjectSheets(공용)
                               # SignalDetail  : ProjectHero · ProjectAmbient(canvas)
                               #                 ProjectScreens · ProjectGate · ProjectCases
                               # SanctuaryDetail: ProjectMasthead · ProjectAperture(canvas)
                               #                 ProjectProcession · ProjectAnatomy
                               #                 ProjectRuntime · ProjectStack
    ui/                        # SectionHeading · Reveal · Tag · CountUp
  data/                        # profile · experience · skills · projects · socials · nav (편집 지점)
  types/content.ts             # Profile · Experience · Project · SkillGroup · SocialLink
  styles/index.css             # Tailwind v4 @theme 토큰 + @font-face + reduced-motion
  assets/fonts/                # Pretendard 원본 OTF(gitignore) + 서브셋 woff2 3종(커밋)
scripts/
  subset-fonts.py              # OTF → 서브셋 woff2 (폰트 교체/콘텐츠 확장 시 재실행)
  optimize-images.py           # 원본 이미지 → 표시 크기 webp (에셋 교체 시 재실행)
```

SafeOps 스크린샷의 정본은 이 저장소가 아니라 **safeops 저장소의 `portpolio/`** 다. 교체할 때:

```bash
# 화면 4장 — 표시 높이 580px * DPR 2
for n in home notifications report settings; do
  sips -Z 1120 ~/Desktop/safeops/portpolio/screens/$n.png --out /tmp/s.png
  cwebp -q 82 /tmp/s.png -o src/assets/safeops-$n.webp
done
```

침례교(전용앱)의 정본은 **baptism_app 저장소의 `portfolio/images/`** 다(그 저장소의 `portfolio/_src`가
SVG로 생성한 것). PIL이 없는 환경이라 `optimize-images.py` 대신 `cwebp`로 뽑았다:

```bash
cd ~/Desktop/baptism_app/portfolio/images
OUT=~/Desktop/Portfolio/src/assets
cwebp -q 88 -resize 192 0 asset-app-icon-1024.png -o $OUT/baptist-icon.webp
for n in 01-splash 02-signin 03-home 04-membercard 05-attendance 06-bulletin 07-community 08-menus; do
  cwebp -q 80 -resize 480 0 screen-$n.png -o $OUT/baptist-screen-${n%%-*}.webp
done
cwebp -q 78 -resize 520 0 screen-09-home-full.png -o $OUT/baptist-home-full.webp
for b in 02-identity:identity 05-tokens:tokens 06-architecture:architecture; do
  cwebp -q 76 -resize 1440 0 board-${b%%:*}.png -o $OUT/baptist-board-${b##*:}.webp
done
```

- **라우팅**: `/`(홈) · `/projects/:slug`(상세). 없는 slug는 홈으로 리다이렉트. 상세는 `lazy` 분리.
- **홈 섹션 순서**: Hero → About(프로필) → Skills → Experience → Projects.
- **스택**: React 19 + Vite 8 + TypeScript, Bun, Biome, Tailwind v4(@theme), react-router-dom v7,
  GSAP + @gsap/react, motion, Lenis.
- **팔레트 토큰**: paper `#f4eee3` / surface `#eae1d2` / ink `#2c2722` / muted `#8b8173` /
  line `#d8cdbb` / sand `#e4d3b2` / espresso `#3b372f`.
- **상세 페이지는 프로젝트 테마가 색 토큰을 덮어쓴다**. Tailwind v4가 `bg-paper`를
  `var(--color-paper)`로 컴파일하므로, `ProjectDetail`이 `:root`에 7개 값을 주입하면
  Navbar·Footer를 포함한 지면 전체가 그 프로젝트를 따라간다(언마운트 시 원복).
  SafeOps는 앱에서 그대로 가져왔다 — paper `#080d16`, espresso(액센트) `#f5441b`.
- **폰트**: Space Grotesk(디스플레이, @fontsource) · Pretendard(본문, 서브셋 woff2 self-host) ·
  JetBrains Mono(메타, @fontsource).
- **번들**: vendor 청크 분리 — react 231KB / motion 124KB / gsap 114KB / index 64KB /
  ProjectDetail 5.8KB(지연).

## 3. 결정사항

- **페이지는 2종만**: 홈 + 프로젝트 상세.
- **라이트/베이지 고정**: 다크 모드·다국어 미포함.
- **이력서 톤**: "연락하기/협업 가능" 문구 제거, 프로필 정보 강조.
- **콘텐츠 데이터 분리**: 로직 수정 없이 `src/data/*.ts`만 편집해 교체.
- **앱 프로젝트의 목록 썸네일은 사진이 아니라 타일이다**(`ProjectCard`의 `tiled`). 세로 화면을
  16:10 판에 잘라 넣으면 상태바와 탭 바가 날아가 무슨 화면인지 알아볼 수 없다(실제로 SafeOps는
  폰 4대가 뭉개졌고 침례교는 위아래가 잘렸다). 그래서 `platform === "mobile"`이고 `icon`이 있으면
  **프로젝트 테마 그라디언트 위에 아이콘과 화면 한 장**을 얹고, 화면은 세로 비를 지킨 채 판 아래로
  흘려보낸다. 따라서 앱 프로젝트의 `thumbnail`에는 **가로 합성 이미지가 아니라 세로 스크린샷 한 장**
  (보통 `screens[]`에 이미 있는 것)을 넣는다. 웹 프로젝트는 기존대로 가로 이미지를 채운다.
- **화면 이미지의 비율은 데이터가 정한다**: `Project.platform`이 `mobile`이면 세로 9:19.5,
  `web`이면 가로 16:10. 앱 프로젝트에 가로 대형 커버를 두면 실제로 존재할 수 없는 이미지가 되므로,
  상세 페이지에 커버는 없다.
- **상세의 화면 구간은 스크롤이 넘긴다**: `ProjectScreens`가 lg 이상 + 모션 허용일 때 무대를
  ScrollTrigger로 pin하고, 진행에 따라 화면·설명·진행 바가 함께 바뀐다. 그 밖(좁은 화면·
  reduced-motion·화면 1장)에서는 같은 내용을 그리드로 펼친다.
- **상세 본문은 Context · Approach · Cases · Craft 네 덩이**. `highlights` 나열 대신
  사례마다 **문제 → 판단 → 결과** 세 줄을 적는다(`ProjectCase`). 무엇을 했는지가 아니라
  무엇을 보고 그렇게 정했는지가 남아야 포트폴리오로 읽힌다.
- **사례 지표(`metrics`)에는 세어서 확인되는 값만 적는다**. SafeOps는 아직 스토어 배포 전이라
  전환율·개선률 같은 운영 지표가 없다 — 전송 주기(5초/60초), 딥링크 경로(9개), 테스트
  (81 suites·890개)처럼 저장소에서 직접 세지는 값으로 채웠다. 지어낸 퍼센트는 넣지 않는다.
- **canvas는 표지 뒤 한 겹만 쓴다**(`ProjectAmbient`). 격자 위 여덟 지점이 저마다의 주기로
  파동을 내보내는 신호 필드로, 이 앱이 하는 일(좌표 발신) 자체의 그림이다 — 장식 파티클이 아니다.
  reduced-motion에서는 한 프레임만 그리고 멈춘다.
- **본문을 따라 내려가는 경로선은 시도했다가 걷어냈다.** 좌우로 오가면 글을 가리거나(뒤로 지날 때)
  튀어 보였고(대각선), 직각 배선으로 꺾어도, 한쪽 여백에 고정해도 본문 옆에 선이 계속 붙어 있는
  것 자체가 거슬렸다. **본문 영역에는 배경 애니메이션을 두지 않는다** — 놀 자리가 필요하면
  콘텐츠가 중앙에 모이는 화면 무대 쪽이 낫다.
- **상세 페이지 연출은 프로젝트마다 갈린다**(`Project.variant`, 생략 시 `signal`).
  `ProjectDetail`은 껍데기(테마 주입 · 목록 링크 · 외부 링크 · 이전/다음)만 들고 본문은
  `SignalDetail` / `SanctuaryDetail`이 각자 조립한다. 프로젝트가 늘어도 공용 컴포넌트를
  분기로 부풀리지 않기 위해서다.
  - `signal`(SafeOps) — 제목이 잡히는 표지(디코드) · 제자리 크로스페이드 전시 · 좌표 파이프라인 ·
    사례 대장(sticky 인덱스 레일).
  - `sanctuary`(침례교) — 빛이 드는 표지 · 가로 행렬 · 화면 해부 · 런타임 지도 · 사례 스택.
- **침례교 지면은 앱의 조판 규칙을 그대로 적용한다**. 제목은 Space Grotesk가 아니라 Pretendard
  Bold에 `tracking-[-0.03em]`, 숫자는 전부 `tabular-nums`. 앱이 SUITE 한 패밀리로만 조판했다는
  사실이 이 페이지의 서체 선택 근거다.
- **SafeOps 시그니처는 좌표 파이프라인(`ProjectGate`)이다**. 상황 넷을 고르면 관문 여섯이
  위에서부터 판정하고 왼쪽 레일이 좌표가 실제로 닿은 지점까지만 차오른다. 침례교의 런타임 지도가
  **멈춰 있는 구조**를 눌러 보는 것이라면 이쪽은 **흘러가는 한 건**을 따라가는 것 — 두 페이지가
  같은 도구를 두 번 쓰지 않도록 축을 갈랐다. 관문 수치(낡음 10분 · 중복 재전송 60초 · 실내 갱신
  7~185초)는 safeops 저장소 `docs/PROGRESS.md`의 실측이다.
- **`signal` 사례는 대장처럼 읽는다**(`ProjectCases`). 왼쪽 목록이 sticky로 따라오며 지금 읽는
  사례를 표시하고, 누르면 그 사례로 건너뛴다. 건너뛰기는 반드시 Lenis 경유(폴백 포함).
- **컨테이너 폭은 성격으로 가른다** — 읽는 구간은 `max-w-4xl`, 전시·조작 구간은 `max-w-5xl`.
  섞어 쓰면 섹션마다 왼쪽 선이 어긋나 페이지가 흔들려 보인다(사례 구간을 5xl로 뒀다가 Craft와
  64px 어긋난 것을 발견해 4xl로 내렸다).
- **침례교 액센트는 브랜드색이 아니라 앱의 `primaryDeep`이다**. 브랜드 `#3A64F0`은 이 지면
  (paper `#edf0f6`)의 작은 글자에서 **4.32:1로 AA 미달**이라, 앱이 이미 갖고 있던 한 단계 깊은
  `#2B5FDE`(4.85:1)를 썼다. 액센트를 밝게 되돌리지 말 것.
- **침례교 시그니처는 런타임 지도(`ProjectRuntime`)다**. 부팅 5단계와 App.tsx의 Provider 8겹을
  실제 중첩 순서 그대로 그리고, 자리를 바꾸면 **에러 없이 기능만 사라지는** 네 곳에 표시를 달아
  눌러 보게 한다. 데이터(`runtime`)는 `index.js`·`App.tsx`·`instance.ts`를 직접 읽고 적은 것이라,
  앱이 바뀌면 여기도 같이 고쳐야 한다.
- **본문의 무게중심은 개발이다**(사용자 지시, 2026-09-02). **두 프로젝트 모두 적용했다.**
  프론트엔드 개발자 포트폴리오이므로 Context·Approach·Cases는 상태 관리 · 플랫폼 분기 · 인증 ·
  데이터 계층으로 쓴다. SafeOps는 파생 상태 단일화 · 낙관적 업데이트와 되돌림 조건 · 모달 스택 ·
  콜드스타트 딥링크 · 세션 격리 다섯으로 다시 썼다. 디자인 판단은
  걷어내는 게 아니라 **화면 해부 구간 안에서 기술적 맥락과 함께** 다룬다(대비 실측기는 그래서
  걷어냈다). 문장은 문어체·번역투 대신 말하듯 쓴다 — "읽히는가" 같은 어색한 명사화를 피할 것.
- **`sanctuary` 사례는 넘기지 않고 쌓는다**(`ProjectStack`). 카드가 같은 부모 안에서 전부
  `sticky`라 앞 카드가 자리에 남고, `top`을 항목마다 14px씩 내려 몇 장째인지 위 테두리로 보인다.
- **애니메이션은 reduced-motion 필수 존중**, 프로젝트 강조는 항상 유지.
- **무료 스택**: 유료 GSAP ScrollSmoother 대신 Lenis.
- **Pretendard는 서브셋 woff2 self-host**: 폰트 파일을 바꾸거나 KS X 1001 2350자 밖 한글을 쓰는
  콘텐츠로 교체하면 `python3 scripts/subset-fonts.py` 재실행(요구: `fonttools[woff]`, `brotli`).
  원본 OTF는 커밋하지 않는다.
- **이미지는 표시 크기에 맞춘 webp를 번들**: 원본은 저장소에 백업으로 두되 코드는
  `scripts/optimize-images.py` 산출물을 import. 에셋 교체 시 `TARGETS` 갱신 후 재실행(요구: Pillow).
- **Tailwind 임의값은 스케일 유틸이 있으면 그쪽 사용**: `left-[3px]` → `left-0.75`. `clamp()`·`em`·
  비율(`leading-[0.95]`)처럼 대응 유틸이 없는 것만 임의값으로 남긴다.
- **Biome 검사에서 `.claude` 제외**: 하네스 생성 설정 파일이 포맷 규칙에 걸려 `check`를 깨뜨렸다.
- **리뷰는 판단 게이트를 거쳐 반영**: Codex 리뷰를 그대로 따르지 않고 코드와 대조해 타당한 것만
  반영(`review-and-apply` 스킬). Codex는 `/codex:setup` 사전 설정 필요.
- **작업 후 리뷰는 hook으로 자동화**: Stop hook이 편집 있는 턴 종료 시 `review-and-apply`를 발동.
  개인 저장소라 설정은 `settings.local.json`이 아닌 커밋되는 `settings.json`에 둔다.
- **커밋·푸시는 자동 체이닝하지 않는다**: 리뷰 후 채팅에서 사용자에게 확인하고 진행.

## 4. 함정 노트 (재발 방지)

실제로 한 번씩 밟았던 것들. 관련 코드를 건드릴 때 먼저 읽을 것.

- **스크롤 이동은 전부 Lenis 경유**: Lenis는 rAF 루프로 매 프레임 `targetScroll`을 window에 다시
  적용하므로 `window.scrollTo()` 직접 호출은 되돌려지고, 새 페이지가 더 짧으면 최하단으로 클램프된다.
  `scrollTo` 전에 **`lenis.resize()` 선행** — 리사이즈 감지가 250ms 디바운스라 라우트 이동 직후
  `limit`은 이전 페이지 기준이고 `scrollTo`는 그 값으로 clamp한다.
- **`ScrollToTop`의 `window.scrollTo` 폴백은 지우지 말 것**: React는 자식 → 부모 순으로 effect를 실행해
  **최초 마운트 때는 `useLenis`(App)보다 먼저 돌아 인스턴스가 `null`**이다. reduced-motion 환경에도
  Lenis가 없다.
- **GSAP 인라인 트윈은 CSS 미디어쿼리로 못 막는다**: `prefers-reduced-motion`은 `useGSAP` 안에서
  `if (reduced) return`으로 직접 가드해야 한다.
- **motion에서 `clipPath` 보간 금지**: `round` 키워드가 섞인 문자열은 보간되지 않아 중간 프레임 없이
  점프한다. 마스크 리빌은 패널을 `scaleY`로 걷어내는 방식(transform)으로.
- **motion 인라인 transform은 Tailwind `scale`을 덮어쓴다**: 확대와 이동을 같은 요소에 두면 확대가
  통째로 무효가 된다. 확대는 wrapper, 이동은 안쪽 요소로 분리.
- **`viewport once` 트리를 반응형으로 조건부 마운트하지 말 것**: 나중에 붙는 자식은 이미 끝난
  애니메이션을 상속받지 못해 초기 상태로 굳는다(썸네일이 커튼에 덮인 채 사라졌던 원인). 감추려면
  CSS(`hidden md:block`)로.
- **`perspective`는 직계 자식에만 적용**: 틸트(`rotateX/Y`)가 바깥, 리빌이 안쪽이어야 원근이 산다.
- **패럴랙스 이동량은 % 비례로**: 여백은 각 변 `(scale-1)/2`뿐이라 고정 px은 좁은 화면에서 배경을
  드러낸다. 확대율을 바꾸면 이동 비율도 함께 조정.
- **Vite 8은 rolldown 기반이라 `manualChunks`가 없다**: vendor 분리는
  `build.rolldownOptions.output.codeSplitting.groups`(name + test 정규식).
- **파이썬 `euc-kr` 코덱은 실제로 CP949**: 한글 11172자를 전부 인코딩하므로 `try/except`로는 KS X
  1001을 못 거른다. 인코딩 결과의 **리드 바이트가 0xB0–0xC8인지**로 판별해야 2350자가 된다.
- **Tailwind 임의값은 표준 스케일이 있으면 쓰지 않는다**: `w-[19rem]`·`max-w-[172px]`·
  `rounded-[2rem]`은 각각 `w-76`·`max-w-43`·`rounded-4xl`이다(에디터가 경고로 알려준다).
  `text-[0.6875rem]`처럼 스케일에 없는 값만 임의값으로 남긴다.
- **reduced-motion에서도 리사이즈에는 다시 그려야 한다**: canvas의 `width`/`height`를 다시 넣으면
  비트맵이 지워지는데, 정지 렌더는 rAF가 없어 아무도 다시 그려주지 않는다 — 창 크기를 바꾸는 순간
  배경이 사라진다. 리사이즈 핸들러가 재측정과 정지 렌더를 함께 하도록 묶는다.
- **본문 옆에 상시로 움직이는 장치를 두지 않는다**: 스크롤을 따라 그려지는 경로선을 네 가지 방식
  (글 뒤 통과 · 차선 전환 · 단일 트랙 · 직각 배선)으로 만들어 봤지만, 읽는 자리 옆에서 무언가
  계속 움직이면 어떤 형태든 방해가 됐다. 모션은 읽기를 멈추는 자리(표지·전시 구간)에 둔다.
- **테마의 `sand`를 액센트와 같은 값으로 두지 않는다**: `Tag`가 `bg-sand/40`을 쓰므로 스택 칩이
  통째로 액센트 색 판이 된다. `sand`는 지면보다 한 단계 밝은(어두운 테마) 중간색으로 둔다.
- **canvas 격자는 `line` 색을 거의 불투명하게 찍는다**: 어두운 지면에서 `line`은 배경과 밝기 차가
  작아, 알파를 0.3대로 두면 화면에 아무것도 보이지 않는다.
- **본문 데이터는 평문이다**: 마크다운 렌더러가 없으므로 백틱을 적으면 백틱이 그대로 보인다.
- **프레임 안 이미지를 패럴랙스로 밀지 않는다**: 기기 프레임에 넣은 앱 스크린샷을 `yPercent`로
  흘리면 상태바와 탭 바가 잘려 화면 소개로서 성립하지 않는다. 시차는 **기기 전체**에 아주 작게
  주고(`y: 18 → -18`), 이미지는 프레임을 정확히 채운다.
- **같은 요소에 진입 트윈과 scrub 트윈이 같은 속성을 잡으면 싸운다**: 기기의 `y`는 scrub이
  소유하므로 진입 연출은 `opacity`·`scale`만 건드린다.
- **pin된 무대의 머리글은 Navbar 아래로**: Navbar가 `fixed`·`z-50`·반투명이라, pin으로 뷰포트
  상단에 붙은 무대의 `top-10` 머리글은 그 뒤에 깔려 보이지 않는다. Navbar 높이(4rem)를 피해
  `top-24`부터 둔다.
- **flex로 나란히 둔 설명 목록에는 `shrink-0`**: 옆의 프레임이 `min(vw)` 폭을 먼저 가져가면 목록이
  줄어들어 한 줄짜리 문장이 두 줄로 깨진다. 폭을 고정할 쪽에 `shrink-0`을 준다.
- **sticky의 클램프 기준은 부모의 padding이 아니라 content box다**: 쌓이는 카드가 다 모인 뒤
  화면에 머물게 하려고 `ol`에 `pb-[60vh]`를 줬지만 붙어 있는 시간이 1px도 늘지 않았다. 실측하니
  **마지막 카드가 자기 자리(top 138)에 닿기도 전에** 넷이 모두 풀렸다. 여백이 아니라 **자리를
  차지하는 요소**(끝에 둔 빈 `li`)를 넣어야 그만큼 더 붙어 있는다.
- **쌓이는 카드는 높이를 통일한다**: 뒤 카드가 앞 카드보다 짧으면 그 차이만큼 앞 카드 밑단이
  삐져나와 테두리가 두 겹으로 보인다(측정값 516 / 492 / 492 / 492 → 10px 노출). 제일 큰 높이를
  재서 `min-height`로 맞추고, 잰 뒤에는 `ScrollTrigger.refresh()`로 트리거 위치를 다시 잡는다.
  측정은 `offsetHeight`로 — `getBoundingClientRect()`는 GSAP이 건 `scale`이 섞인다.
  서브셋 폰트가 늦게 붙으면 줄 수가 달라지므로 `document.fonts.ready`에서 한 번 더 잰다.
- **scrub이 크기를 재는 이미지에는 비율을 못 박는다**: `loading="lazy"` 이미지는 화면 밖에서
  `offsetHeight`가 0이라 `() => -(img.offsetHeight - frame.clientHeight)`가 0으로 굳는다
  (`invalidateOnRefresh`는 리사이즈/로드 이벤트에만 걸려 늦다). 홈 해부 구간의 스크린샷이
  프레임 안에서 아무 데도 안 흐르던 원인 — `style={{ aspectRatio: 1 / ratio }}`로 로드 전부터
  높이가 정해지게 한다.
- **pin·sticky 무대의 크기는 뷰포트 높이에 묶는다**: 고정 폭(`w-56`·`w-65`)으로 두면 1280×720
  노트북에서 머리글·진행 바와 겹치거나 마지막 주석이 잘린다. `w-[clamp(11rem,25vh,14rem)]`처럼
  높이에 비례시키면 창이 낮아도 무대가 한 화면에 들어온다.
- **가로 pin 트랙 위의 항목을 다시 트리거하려면 `containerAnimation`**: 가로로 흐르는 트윈을
  기준으로 넘겨야 항목이 화면을 가로지르는 동안의 진행률이 나온다. 이때 트랙 트윈은
  `ease: "none"` + 스크럽이어야 한다.
- **`IntersectionObserver` 활성 섹션은 이탈 처리까지**: 교차 진입 시에만 `setActive`하면 감지 밴드에
  걸리는 항목이 없는 구간(Hero)에서 마지막 값이 남는다. 교차 집합을 추적해 비면 `""`로 초기화.

## 5. 마지막 검증 (2026-09-02)

- `bun run check` — 52 files 무경고. `bun run build` — 타입 통과 + 빌드 성공.
- **헤드리스 Chrome(CDP) 육안 QA** — 실제 휠 이벤트를 보내며 단계별 캡처. Chrome은 설치돼 있지
  않고 `~/Library/Caches/ms-playwright/chromium-*/chrome-mac-x64/`의 Chrome for Testing을 썼다.
  확인 범위: 두 상세 페이지 전 구간(1440×900 · 1280×720 · 414×896) · `prefers-reduced-motion` ·
  런타임 지도 클릭 · 파이프라인 시나리오 전환 · 사례 레일 추적 · 홈 목록 카드.
- **표지 디코드는 DOM 텍스트를 90ms 간격으로 읽어 확인**했다 — 공백 → 잡음 → 앞에서부터 확정 →
  최종 제목. 폭이 흔들리지 않도록 미확정 자리는 non-breaking space로 채운다.
- **콘텐츠 문자 점검**: 새 한글은 전부 KS X 1001 2350자 안, 기호도 서브셋의 기존 유니코드 범위
  안 — 폰트 재생성 불필요. 표시용 점(U+25CF)은 범위 밖이라 **글리프 대신 CSS 원**으로 찍는다.
- **잡은 것**: 해부 구간 스크린샷이 흐르지 않던 문제(lazy 이미지 `offsetHeight` 0), 낮은 창에서
  pin 무대가 잘리던 문제, 좁은 화면에서 런타임 설명이 화면 밖에 있던 문제, 본문 데이터에 백틱을
  적어 그대로 보이던 문제, 목록 썸네일이 세로 화면을 가로로 잘라 알아볼 수 없던 문제(사용자 지적),
  파이프라인 점이 행 패딩과 어긋나던 문제, 사례 구간 폭이 다른 섹션과 어긋나던 문제,
  침례교 사례 스택이 다 쌓이기 전에 풀리고 앞 카드 밑단이 삐져나오던 문제(사용자 지적 →
  높이 통일 + 스페이서). 전부 반영 완료.
- **Codex 리뷰 2회**: 1차는 지적 없음, 2차에서 P2 1건 타당 판단·반영 —
  `ProjectCases`의 IntersectionObserver 의존성이 비어 있어, **signal 프로젝트끼리 이전/다음으로
  오갈 때**(atlas → muse → cadence → prism은 언마운트되지 않는다) 옵저버가 떨어져 나간 노드를
  계속 보고 왼쪽 목록이 굳었다. 관찰 대상을 `cases`에서 끌어와 의존성을 실제 의존성으로 만들고
  `ProjectStack`의 높이 측정에도 같은 형태를 적용했다(같은 잠재 결함). 클라이언트 이동 후
  레일이 새 프로젝트 기준으로 갱신되는 것까지 확인.
- 두 차례 모두 Codex 셸에서 `npm run build`가 exit 1로 찍혔으나, Codex가 직접 돌린 `tsc`는
  통과했고 로컬 `bun run build`도 `dist`·tsbuildinfo를 지운 상태로 통과한다 — 이 저장소는 Bun을
  쓰므로 npm 경로의 환경 문제로 판단했다.

## 6. 다음 작업 (미착수)

- **나머지 더미 프로젝트 3개 교체 또는 삭제**(Atlas · Muse · Cadence · Prism 중 남은 것).
  카드 썸네일은 표시 폭 약 457px이고, `theme` 7색과 `variant`도 함께 정해야 한다.
  세 번째 프로젝트를 넣는다면 `signal`·`sanctuary`를 재탕하지 말고 갈래를 하나 더 만든다.
- (선택) 실제 브라우저에서의 관성 스크롤 감각 확인 — CDP 캡처는 정지 화면이라 Lenis의
  감속 곡선과 pin 전환의 매끄러움까지는 보지 못했다.
