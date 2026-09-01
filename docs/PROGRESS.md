# 포트폴리오 진행 문서

> 최종 업데이트: 2026-09-01

프론트엔드 개발자 **포트폴리오 겸 이력서** 웹사이트. 원페이지 스크롤 + 프로젝트 상세 페이지 구조.
콘셉트는 **"편안한 갤러리(Calm Gallery)"** — 연한 베이지 지면에 프로젝트를 크게 전시하고, 개발자
정체성은 모노스페이스 메타로 인코딩.

이 문서는 **현재 상태·구조·규약·함정**을 담는다. 변경 이력은 git log가 담당하므로 여기에 중복
기록하지 않는다(`git log --oneline`).

---

## 1. 현재 상태

- **기능적으로 완성**. `bun run check` / `bun run build` 통과.
- 프로필·경력·스킬은 **실제 콘텐츠 반영 완료**(`profile.ts`·`experience.ts`·`skills.ts`).
- **SafeOps만 실제 콘텐츠**(`projects.ts`) — 실기기 스크린샷 4장과 앱 아이콘까지 반영 완료.
  나머지 4개는 더미이고 이미지는 `src/assets/hero.png` 자리표시자.

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
    project/                   # ProjectCard · ProjectHero · ProjectAmbient(canvas)
                               # ProjectScreens · ProjectCases · ProjectSheets
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
# 목록 카드 썸네일 — 폰 영역만 16:10으로 잘라낸다(제목 텍스트 제외)
cwebp -crop 80 400 2640 1650 -resize 960 0 -q 80 \
  ~/Desktop/safeops/portpolio/03-main-tabs.png -o src/assets/safeops-tabs.webp
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
- **`IntersectionObserver` 활성 섹션은 이탈 처리까지**: 교차 진입 시에만 `setActive`하면 감지 밴드에
  걸리는 항목이 없는 구간(Hero)에서 마지막 값이 남는다. 교차 집합을 추적해 비면 `""`로 초기화.

## 5. 마지막 검증 (2026-09-01)

- `bun run check` — 경고 0, 에러 0 (40 files). `bun run build` — 타입 통과 + 빌드 성공, 청크 경고 없음.
- **Codex 리뷰(상세 페이지 스크롤 리셋)**: P1 1건 타당 판단·반영 — 해시 이동 경로의 stale 치수
  클램프. `lenis.mjs`의 디바운스·`clamp` 구현을 직접 확인 후 `lenis.resize()` 선행 추가.
- **육안 QA(사용자)**: 홈 하단 → 프로젝트 클릭 시 상세가 맨 위에서 열림, 상세 → 목록 복귀 확인 통과.
- **Codex 리뷰(문서 정리)**: P2 2건 타당 판단·반영 — 함정 노트 제목이 본문과 모순("폴백을 지울 것"),
  `commit-push`의 `git add -A`가 커밋 분리 지시와 순서상 충돌.
- **GitHub 반영**: `74e0b19`까지 `origin/main` 푸시 완료.
- **프로젝트 상세 리디자인(2026-09-01)**: `bun run check` 43 files 무경고, `bun run build` 통과.
  헤드리스 Chrome(CDP)에 실제 휠 이벤트를 보내며 스크롤 단계별로 캡처해 육안 확인 —
  표지 신호 필드·핀 시퀀스 01~04 전환·Cases·Craft 시트까지 1440 데스크톱에서 확인했고,
  414 모바일 그리드 폴백과 밝은 테마(atlas-analytics)의 토큰 전환도 함께 봤다.
- **Codex 리뷰(상세 페이지 재작업)**: P2 1건 타당 판단·반영 — reduced-motion에서 리사이즈 후
  표지 canvas가 빈 채로 남던 문제(재측정과 정지 렌더를 한 핸들러로 묶음).

## 6. 다음 작업 (미착수)

- **나머지 더미 프로젝트 4개 교체 또는 삭제**. 카드 썸네일은 표시 폭 약 457px이고,
  각 프로젝트의 `theme` 7색도 함께 정해야 한다.
- (선택) 브라우저 육안 QA — 스크롤 애니메이션·프로젝트 호버·반응형·폰트 렌더링.
