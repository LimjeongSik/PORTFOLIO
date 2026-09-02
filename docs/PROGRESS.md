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
- **AI 안내자(채팅 위젯) 동작함.** 우측 하단 플로팅 버튼 → 질문 → 답하면서 화면까지 옮긴다.
  로컬은 `bun run dev` 하나로 API까지 뜨고, **배포(Vercel)는 아직 연결 전**이다(§7).

## 2. 구조

```
src/
  main.tsx                     # BrowserRouter로 App 래핑
  App.tsx                      # useLenis + ScrollToTop + Navbar + Routes + Footer
  lib/gsap.ts                  # gsap + ScrollTrigger + useGSAP 플러그인 등록
  lib/lenis.ts                 # Lenis 인스턴스 모듈 싱글톤(라우트 스크롤 리셋용)
  lib/scroll.ts                # scrollToSection / scrollToTop — 프로그래매틱 스크롤의 정본
  lib/assistant/               # bridge(navigate·close 다리) · toolkit(모델이 부르는 툴 정의)
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
    assistant/                 # AssistantLauncher(첫 화면에 남는 버튼 하나)
                               # AssistantWidget(패널·런타임, 누를 때 받아 온다)
                               # Thread(primitives 조판) · ToolCards(툴이 그리는 카드들)
  data/                        # profile · experience · skills · projects · socials · nav (편집 지점)
  types/content.ts             # Profile · Experience · Project · SkillGroup · SocialLink
  styles/index.css             # Tailwind v4 @theme 토큰 + @font-face + reduced-motion
  assets/fonts/                # Pretendard 원본 OTF(gitignore) + 서브셋 woff2 3종(커밋)
api/
  chat.ts                      # Vercel 서버리스 진입점(한 줄 재export)
  _lib/handler.ts              # 실제 핸들러 — 남용 방어 · streamText · 툴 병합
  _lib/prompt.ts               # 시스템 프롬프트 조립 · get_project_detail 조회
  _lib/types.ts                # 지식의 형태(content.ts에서 파생)
  _lib/knowledge.generated.ts  # 자동 생성 — 고치지 말 것(`bun run knowledge`)
vite-plugin-chat-api.ts        # 개발 서버에서 /api/chat을 같은 핸들러로 처리
scripts/
  build-knowledge.ts           # src/data/*.ts → api/_lib/knowledge.generated.ts
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
- **번들**: vendor 청크 분리 — react 232KB / assistant 534KB / motion 124KB / gsap 114KB /
  index 99KB / ProjectDetail 43KB(지연) / AssistantWidget 12KB(지연).
  assistant 묶음(assistant-ui + AI SDK + zod)은 위젯을 열기 전까지 받지 않는다.

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
- **AI 안내자는 답하면서 화면을 움직인다**(`src/components/assistant`). 채팅으로 답만 하면
  포트폴리오에 굳이 있을 이유가 없다 — 물어본 자리로 데려가고(스크롤·라우팅), 프로젝트·경력·기술은
  카드로 그려 준다. 모델이 부르는 도구는 `src/lib/assistant/toolkit.tsx` 한 곳에 모여 있고,
  UI를 만지는 것과 카드를 그리는 것 전부 **브라우저에서** 실행된다.
- **AI가 읽는 지식은 `src/data/*.ts`가 원본이다**. 서버가 그 파일을 직접 읽을 수 없어
  (`@/` 별칭 + `.webp` import) `bun run knowledge`가 이미지 필드를 뺀
  `api/_lib/knowledge.generated.ts`를 만들어 커밋한다. **콘텐츠를 고치면 반드시 다시 돌린다.**
- **프로필·경력·기술·프로젝트 요약만 시스템 프롬프트에 싣는다**. 전체 콘텐츠는 약 19,000자라
  매 요청에 다 실으면 낭비다. 상세 사례·런타임 지도·파이프라인은 서버 툴 `get_project_detail`로
  필요할 때만 꺼낸다.
- **모델은 Lite 계열을 쓴다**(`GEMINI_MODEL` 환경변수, 기본 `gemini-3.5-flash-lite`).
  **무료 티어 일일 한도가 계열마다 다르다** — Flash는 모델당 하루 20건(3.6·3.7 실측)이라 공개
  사이트에는 금방 마르고, Lite는 훨씬 넉넉하다. 안내자가 하는 일은 짧은 답과 도구 호출이라
  Lite로 충분하고, **도구 일곱 개를 모두 정확히 부르는 것까지 확인했다**(품질 차이가 보이지 않았다).
  한도가 차거나 결제를 붙여 올리고 싶으면 환경변수만 바꾼다.
- **엔드포인트는 방문자의 질문과 도구 결과만 받는다**. `convertToModelMessages`가
  `role: "system"`을 그대로 시스템 메시지로 넘기므로, 걸러내지 않으면 누구든 POST 한 번으로
  안내자의 역할을 갈아치우고 이 API 키를 범용 모델 프록시로 쓸 수 있다. user·assistant만 통과시킨다.
- **공개 엔드포인트라 방어는 인프라 없이 코드로**: 본문 32KB(스트림을 읽으며 자른다) · 대화 24턴 · 질문 1,000자 ·
  출력 900토큰 · 툴 스텝 5 · 툴만 부르는 왕복 3회 상한, 그리고 **주소당 분당 20요청**
  (인메모리 카운터, Gemini를 부르기 전에 막는다). 시스템 프롬프트가 주제도 이력·프로젝트로
  묶는다(무관한 요청은 한 문장으로 거절하고 포트폴리오 질문을 하나 건넨다).
  인메모리라 서버리스 인스턴스마다 따로 세어진다 — 스크립트로 두드리는 쪽을 막는 첫 문턱이지
  정확한 방벽은 아니다(정확히 묶으려면 공유 저장소가 필요하다).
- **패널을 닫아도 대화는 남는다 — 비우는 길은 헤더의 '새 대화'다**. 닫기는 표시만 접을 뿐
  런타임과 기록이 그대로라, 대화가 길이 상한(24턴)에 걸리면 다시 열어도 같은 기록을 또 보내
  계속 실패한다. 그래서 `threads.switchToNewThread()`를 버튼으로 꺼내 뒀고, 상한 안내 문구도
  그 버튼을 가리킨다.
- **첫 화면에 남는 건 버튼 하나뿐이다**(`AssistantLauncher`). assistant 묶음이 534KB라
  `lazy`로 갈랐는데, `lazy`는 **컴포넌트가 렌더될 때** import를 실행하므로 패널을 무조건 그려 두면
  방문자가 열든 말든 첫 렌더 직후 받아 온다. 누르기 전까지 마운트하지 않고, 커서가 버튼에 닿으면
  미리 받는다. 한 번 마운트한 뒤에는 닫아도 내리지 않는다 — 내리면 대화가 사라진다.
- **위젯은 지면 토큰만 쓴다**. 색을 따로 정하지 않았으므로 프로젝트 상세에 들어가면
  `--color-*` 주입을 그대로 받아 그 프로젝트의 옷을 입는다 — 의도한 동작이다.
- **연락처는 자동 복사하지 않고 복사 버튼을 준다**(§4 함정 참고).
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
- **서버 코드에서 `src/data/*.ts`를 직접 import할 수 없다**: `@/` 별칭과 `.webp` import는
  Vite 밖에서 풀리지 않는다. Bun으로 한 번 읽어 텍스트만 뽑아 두는 이유이고, 그래서
  **콘텐츠를 고치면 `bun run knowledge`를 다시 돌려야** AI 답변이 따라온다.
- **Bun은 `tsconfig.app.json`의 `paths`를 보지 않는다**: 루트 `tsconfig.json`을 읽으므로
  거기에도 `@/*` 별칭을 둔다(`files: []`라 tsc 빌드에는 영향이 없다).
- **`api/` 안의 `_` 접두사 파일은 Vercel 라우트가 아니다**: 공용 로직은 거기에 두고,
  `api/chat.ts`는 한 줄 재export만 한다. 개발 서버는 `vercel dev`가 아니라
  `vite-plugin-chat-api.ts`가 같은 핸들러를 태운다(Vite 8은 rolldown이라 래핑이 불확실하다).
- **transport를 렌더마다 `new`로 만들지 말 것**: 라우트가 바뀌면 위젯도 다시 그려지는데,
  그때 연결이 갈아끼워져 **진행 중이던 답변이 통째로 끊긴다**(툴로 상세 페이지를 연 직후
  말이 안 이어지던 원인). `useState(() => new ...)`로 한 번만 만든다.
- **`sendAutomaticallyWhen`이 없으면 카드만 뜨고 말이 없다**: 클라이언트 툴은 브라우저에서
  실행되므로, 결과를 들고 서버로 한 번 더 다녀와야 모델이 그 결과를 보고 문장을 잇는다.
- **클라이언트 툴 왕복은 `stopWhen`이 못 막는다**: `stepCountIs`는 한 요청 안의 스텝만 센다.
  브라우저 툴은 매번 새 요청이라, 말 없이 도구만 부른 턴이 연속 3회면 서버가
  `toolChoice: "none"`으로 말을 끝내게 만든다.
- **클립보드는 사용자 제스처가 있어야 열린다**: 모델이 툴을 부르는 시점에는 클릭·입력에서 이미
  시간이 지나 있어 `clipboard.writeText`가 거부되거나, 문서에 포커스가 없으면 **응답하지 않고
  매달린다**(대화가 그대로 멈췄다). 연락처는 값을 그려 주고 복사는 버튼에 맡긴다.
- **모델은 "이동할게요"라고 말만 하고 도구를 부르지 않을 때가 있다**: 예고 문장을 쓰면서 호출은
  빠뜨리면 화면이 그대로라 방문자에게는 고장으로 보인다. 시스템 프롬프트에 "말로 예고하지 말고
  실제로 부르라 — 부를 생각이 없으면 그런 문장도 쓰지 말라"를 명시해야 한다. Lite 모델은 편차가
  있어서, 도구 관련 지시를 바꾸면 같은 질문을 두세 번 넣어 호출률을 확인한다.
- **요청 크기는 다 읽고 재면 늦다**: `await req.text()` 뒤에 길이를 보면 이미 전부 버퍼링한
  뒤다(게다가 문자 수는 바이트가 아니다). `content-length`를 먼저 보고, 없으면 스트림을 읽으며
  바이트를 세다 상한에서 끊는다.
- **개발 서버(`ssrLoadModule`)는 모듈을 다시 평가한다**: 모듈 스코프에 둔 카운터가 요청마다
  초기화돼 레이트리밋이 전혀 걸리지 않았다(21번째에 429가 나와야 하는데 계속 400). 프로세스가
  살아 있는 동안 이어져야 하는 상태는 `globalThis`에 붙인다.
- **Gemini 모델 이름과 한도는 확인하고 쓴다**: `gemini-2.5-flash`·`gemini-2.5-flash-lite`는
  신규 사용자에게 404다("no longer available to new users"). 무료 티어 일일 한도도 계열마다
  달라서, Flash를 기본값으로 뒀다가 검증 중에 하루치(20건)를 두 모델 연속으로 태웠다.
  쓸 수 있는 모델은 `models.list`로 확인하고, 공개용 기본값은 Lite 계열로 둔다.
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

### AI 안내자 검증 (2026-09-02)

- **헤드리스 Chrome(Playwright)으로 실제 대화**: 도구 일곱을 전부 태워 확인했다 —
  섹션 스크롤(0 → 2877px) · 상세 라우팅(`/projects/safeops`, 스크롤 최상단) · 프로젝트/경력/기술
  카드 · 연락처 카드의 복사 버튼 · 사례 조회(`get_project_detail`). 콘솔 에러 0.
- **툴 왕복은 질문당 2회**로 끝난다(측정). 도구 호출 → 브라우저 실행 → 결과를 들고 한 번 더.
- **지연 로딩 실측**(프로덕션 빌드): 첫 로드에서 받는 JS는 index · react · motion · gsap뿐이고
  assistant 청크(534KB)는 **버튼에 커서가 닿을 때** 받는다. 누르지 않으면 끝까지 받지 않는다.
- **주제 제한**: "파이썬으로 퀵소트 짜줘"에 한 문장으로 거절하고 포트폴리오 질문을 건넸다.
- **레이트리밋**: 21번째 요청부터 429(Gemini는 호출되지 않는다).
- 1440×900 · 414×896 · `prefers-reduced-motion` · 두 프로젝트 상세에서 패널 렌더 확인.
  상세에서는 위젯이 그 프로젝트 테마를 그대로 입는다.
- **잡은 것**: 툴 실행 후 말이 안 이어지던 문제(`sendAutomaticallyWhen` 누락), 라우트 이동 시
  답변이 끊기던 문제(transport 재생성), 연락처에서 대화가 멈추던 문제(클립보드가 제스처 없이
  매달림), 개발 서버에서 레이트리밋이 안 걸리던 문제(모듈 재평가), 답변에 마크다운 별표가
  그대로 보이던 문제.
- **Codex 리뷰 3회, 지적 5건 전부 타당 판단·반영**: 레이트리밋 없음 · 대화 상한에 걸리면 복구
  불가 · `lazy`인데 무조건 렌더해 첫 렌더 직후 받아 옴 · 클라이언트가 보낸 `system` 메시지를
  그대로 신뢰 · 본문 크기를 다 읽은 뒤에 검사.
- **주입·과대 요청 차단 실증**: `role: "system"`을 섞은 요청 400, 240KB 본문은
  `content-length`가 있든(413) `Transfer-Encoding: chunked`든(413) 차단된다.

## 6. AI 안내자 — 키와 배포

로컬은 `.env.local`에 키만 있으면 `bun run dev` 하나로 돈다(개발 서버가 `/api/chat`을 직접 처리).
**배포는 아직 연결하지 않았다.** Vercel에 올릴 때:

```bash
# 1) 키 — https://aistudio.google.com/apikey 에서 발급해 .env.local에 둔다
#    GOOGLE_GENERATIVE_AI_API_KEY=...   (.env.example 참고)

# 2) Vercel 연결 (브라우저 로그인이 필요해 셸에서 직접 실행)
bunx vercel login
bunx vercel link
bunx vercel env add GOOGLE_GENERATIVE_AI_API_KEY production
bunx vercel env add GOOGLE_GENERATIVE_AI_API_KEY preview
bunx vercel --prod
```

`vercel.json`이 빌드 커맨드(`bun run build`) · 출력(`dist`) · SPA rewrite(`/api/*` 제외)를 들고
있으므로 대시보드에서 따로 설정할 것은 없다. GitHub 저장소를 연결하면 push마다 배포된다.

**한도가 차면 `GEMINI_MODEL`을 갈아끼운다.** 이 키로 쓸 수 있는 모델(2026-09 확인):

| 넉넉함 | 모델 |
|---|---|
| Lite — 기본값 계열 | `gemini-3.5-flash-lite` · `gemini-3.1-flash-lite` · `gemini-flash-lite-latest` |
| Flash — 하루 20건 | `gemini-3.5-flash` · `gemini-3.6-flash` · `gemini-3.7-flash` · `gemini-3-flash-preview` |

`gemini-2.5-*` 계열은 신규 사용자에게 404다("no longer available to new users").
남은 한도는 https://aistudio.google.com/rate-limit 에서 본다. 한도를 넘기면 채팅에는
"답을 받아오지 못했습니다"로 나타나고 서버 로그에 429 `RESOURCE_EXHAUSTED`가 찍힌다.

## 7. 다음 작업 (미착수)

- **나머지 더미 프로젝트 3개 교체 또는 삭제**(Atlas · Muse · Cadence · Prism 중 남은 것).
  카드 썸네일은 표시 폭 약 457px이고, `theme` 7색과 `variant`도 함께 정해야 한다.
  세 번째 프로젝트를 넣는다면 `signal`·`sanctuary`를 재탕하지 말고 갈래를 하나 더 만든다.
- (선택) 실제 브라우저에서의 관성 스크롤 감각 확인 — CDP 캡처는 정지 화면이라 Lenis의
  감속 곡선과 pin 전환의 매끄러움까지는 보지 못했다.
- **AI 안내자 배포 연결**(§6). 키는 로컬에만 있고 Vercel 프로젝트는 아직 없다.
- (선택) 공유 저장소 기반 레이트리밋. 지금의 분당 20요청 카운터는 인메모리라 서버리스
  인스턴스마다 따로 센다 — Vercel KV 등을 하나 붙이면 인스턴스를 가로질러 정확히 묶을 수 있다.
