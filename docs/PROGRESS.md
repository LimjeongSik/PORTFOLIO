# 포트폴리오 진행 문서

> 최종 업데이트: 2026-09-23 (30차 — 인터랙션을 걷어내고 다시 짰다)

프론트엔드 개발자 **포트폴리오 겸 이력서** 웹사이트. 원페이지 스크롤 + 프로젝트 상세 페이지 구조.

이 문서는 **현재 상태·구조·규약·함정**을 담는다. 변경 이력은 git log가 담당한다(`git log --oneline`).
29차까지의 3D 무대(three.js)·GSAP·Lenis 시절 기록은 git 히스토리의 이전 판에 있다.

---

## 1. 현재 상태

- **기능적으로 완성**. `bun run check` / `bun run build` 통과.
- **30차에 표현 계층을 통째로 다시 썼다**(사용자 지시 — "인터랙션을 너무 이것저것 넣어서
  난잡하다, 가독성을 살리고 촌스럽지 않게"). 3D 무대 · 관성 스크롤 · 커스텀 커서 · 페이지
  디졸브 · 스크롤 연동 연출 · 지면색 트윈을 전부 걷어냈고 `three` · `gsap` · `@gsap/react` ·
  `lenis` · `motion` · `@fontsource/*`를 의존성에서 뺐다. 데이터(`src/data`)·타입·AI 안내자·
  API는 그대로다.
- **콘셉트: 사이트는 무채색, 색은 프로젝트에만.** 흰 지면 · 잉크 · 선 하나로 조판하고,
  프로젝트의 `theme`은 두 곳에서만 나온다 — 홈 목록 줄의 hover/focus(그 줄이 프로젝트의
  지면색으로 칠해진다)와 상세의 표지 띠(같은 색으로 시작해 화면 선반까지 그 위에 놓인다).
- **서체는 Pretendard 하나.** 위계는 크기와 굵기로만 가른다. 대문자 모노 라벨, 디스플레이
  서체, 모노 서체 패키지는 없다. 코드 식별자(헤더 이름 · 호출 · 번호)만 시스템 `font-mono`로 적는다.
- **남은 움직임은 이것뿐이다.** 새 모션을 넣기 전에 이 목록을 늘릴 이유가 있는지 먼저 볼 것.
  1. 첫 화면 헤드라인이 한 번 떠오르는 등장(`.rise`, CSS)
  2. 프로젝트 줄 hover/focus 때 그 프로젝트 색으로 칠해짐(CSS transition)
  3. 상세의 화면 선반 — 브라우저 가로 스크롤 그대로 + 이전/다음 버튼, SafeOps 라이트/다크 전환
  4. 눌러야 의미가 있는 데모 둘(Plus SMS의 번호 체 `Sieve` · 가상화 목록 `Windowing`)과
     해부 그림의 안에서 굴리는 스크롤샷, 안내 패널이 열릴 때의 짧은 등장
  동작 줄이기에서는 전부 즉시 끝난다(`styles/index.css` 미디어쿼리).
- **홈 순서: 히어로 → 프로젝트 → 경력(+활동) → 기술 → 소개·연락.** 채용 담당자가 먼저 볼 것을
  위로 올렸다. `data/nav.ts`도 같은 순서다(안내자의 `scroll_to_section`이 이 id를 쓴다).
- **상세의 설명 그림은 펼쳐 놓고 읽힌다.** 예전에 스크롤·타이머로 돌던 것(파이프라인 · 해부 ·
  런타임 · 열쇠 · 브릿지)은 정적으로 바꿨다 — 파이프라인은 상황마다 관문별 판정 칩, 런타임은
  주의를 본문에 바로 달고, 열쇠는 항목별 표, 브릿지는 방향별 목록. 그래서 데이터의 `lede`에서
  "눌러 보세요" 류 문구를 걷었다. `keyring.life`·`burst`, `anatomy.notes[].at`, `bridge.applies`는
  타입에만 남고 화면에서 쓰지 않는다.
- **활동(`activities.ts`)은 섹션이 아니라 경력의 꼬리다.** 참석 사실만 적힌 줄은 아무것도
  증명하지 않으므로 `takeaways`를 적는다. 같은 내용이 `resume/content.js`의 `extras`에도 있다.
- **프로젝트는 SafeOps · 침례교(전용앱) · 아이머그 · Plus SMS 넷**(`projects.ts`). Plus SMS만
  `platform: "web"`이라 화면 선반이 가로 비율로 선다.
- **AI 안내자(채팅 위젯) 동작함.** 우측 하단 버튼 → 질문 → 답하면서 화면까지 옮긴다.
  로컬은 `bun run dev` 하나로 API까지 뜨고, Vercel 배포도 연결돼 있다(§5).
- **프로필 사진의 배경은 흰색으로 바꿨다**(원래 크림색이 구워져 있었다). 가장자리(위·좌·우)에서
  이어진 배경만 옮기고 머리카락 경계는 부드럽게 섞었다 — 흰 셔츠가 아래 가장자리에 닿아 있어서
  아래에서는 채우지 않는다. `profile.png`가 바뀐 원본이고 처음 사진은 git 히스토리에 있다.
  화면에서는 `border-line` 테두리로 영역을 가른다. `resume/assets/`의 복사본은 그대로다.
- **안내자가 읽는 자료에 아이머그의 열쇠(`keyring`)·브릿지(`bridge`)를 넣었다.** 화면 연출용 값
  (`life`·`burst`·`applies`·`anatomy.notes[].at`)은 뺀다. 자리표시자 소셜 링크는 프롬프트에서 뺐다 —
  물으면 아직 공개하지 않았다고 답하고 이메일로 안내한다.
- **README의 화면 캡처(`docs/screenshots/`)와 스택 배지·구조 설명은 아직 3D 시절 것이다.**

## 2. 구조

루트의 `resume/`는 사이트와 별개인 **이력서 문서**다(빌드·배포 대상 아님). `index.html`이
`content.js`를 읽어 A4 이력서를 그리고, `resume.md`(긴 원고)·`evaluation.md`(평가·보완점)가 곁에
있다. `content.js`는 `src/data`를 **복사**한 것이라 콘텐츠를 고치면 손으로 맞춰야 한다(`resume/README.md`).
이력서는 **A4 4쪽**이다(2026-09-23, 외부 비판을 받아 7쪽에서 줄였다 — 외주 목록 · 행사 참석 · 생년월일 ·
포트폴리오 프로젝트 항목 삭제, 경력과 프로젝트의 중복 제거, 기술 목록 절반). 편집 원칙은 `resume/README.md`.
팀 규모 등 사실이 필요한 칸은 `TODO`로 남아 있다(화면에만 보이고 PDF에서는 숨는다).
이력서의 한글 서체는 사이트의 Pretendard 서브셋(`src/assets/fonts/*.subset.woff2`)을 상대 경로로 읽는다 —
폰트 파일 이름을 바꾸면 이력서도 함께 고칠 것. 사진 · 앱 아이콘은 `resume/assets/`에 **복사본**을 둔다
(원본 `src/assets`를 바꿔도 이력서는 따라가지 않는다).
PDF에 브라우저 기본 머리글·바닥글(날짜·제목·URL·쪽번호)이 찍히지 않도록 `@page` 안에
비워 둔 `@top-center`·`@bottom-center` 여백 박스를 둔다. Chrome은 여백 박스가 있는 **가장자리만**
기본 머리글·바닥글을 끄므로 위·아래 둘 다 있어야 한다. 이 방식이 안 먹는 Safari에서는 인쇄 창에서
머리말·꼬리말 체크를 해제한다.
핵심 역량은 소개글과 같은 오른쪽 열에 **한 장씩 세로로** 쌓는다. 쪽수를 맞추려고 세 칸으로 나누거나
(한 줄이 열몇 자로 좁아져 읽기 힘듦) 음수 여백으로 왼쪽 열까지 넓히면(섹션 정렬 축이 뒤틀림) 가독성
불만이 나왔다. 4쪽에 담을 여유는 글자 크기가 아니라 여백(연락처 한 줄 배치 · 출력 전용 섹션/항목 간격)에서
찾는다. 크롬 격자는 쪽 사이에서 잘 안 끊기므로 출력에서는 `.strengths`를 block으로 둔다.
레이아웃을 고친 뒤엔 PDF로 뽑아 쪽 경계를 확인할 것 — 역량 셋째 장이 20pt만 넘쳐도 뒤쪽이 줄줄이 밀려 5쪽이 된다.

README의 화면 캡처는 `docs/screenshots/*.webp`에 있다(6장 260KB). 프로덕션 빌드를 띄우고

```
src/
  main.tsx                     # BrowserRouter로 App 래핑
  App.tsx                      # ScrollManager + Header + Routes + Footer + AssistantLauncher
  lib/typography.ts            # 조판 규약(DISPLAY/RAIL/HEADING/LEAD/BODY/SMALL/META/DASH/MEASURE/CONTAINER)
  lib/scroll.ts                # scrollToSection / scrollToTop — 네이티브 스크롤
  lib/text.ts                  # withRo(로/으로) · shortCompany · firstSentence
  lib/url.ts                   # hostOf
  lib/assistant/               # bridge(navigate·close 다리) · toolkit(모델이 부르는 툴 정의)
  hooks/useMediaQuery.ts
  routes/                      # Home(원페이지 조합) · ProjectDetail(slug 조회, 없으면 홈으로)
  components/
    layout/                    # Header · Footer · ScrollManager(해시 이동 · 새 페이지는 맨 위)
    ui/                        # Section(왼쪽 레일 제목 + 오른쪽 기둥) · TextLink
    home/                      # Hero · ProjectIndex · Experience · Skills · About
    project/                   # palette(프로젝트 색 → CSS 변수) · ProjectMark(아이콘/첫 글자)
                               # ProjectRow(홈 목록 · 상세의 다음 프로젝트 공용)
                               # ProjectCover(표지 띠) · ScreenShelf(화면 선반)
                               # Figure(설명 그림 틀 · Choice 버튼)
                               # figures/ Pipeline · Anatomy · Runtime · Keyring · Bridge
                               #          Sieve(원 코드의 parsePhones 이식) · Windowing
    assistant/                 # AssistantLauncher · AssistantWidget · Thread · ToolCards
  data/                        # profile · experience · activities · skills · projects · socials · nav
  types/content.ts
  styles/index.css             # @theme 토큰 + 한글 줄바꿈 + .rise/.panel-in/.shelf + reduced-motion
  styles/fonts.generated.css   # Pretendard @font-face — 스크립트가 쓴다
api/                           # chat.ts(재export) · _lib/(handler · prompt · types · knowledge.generated)
vite-plugin-chat-api.ts        # 개발 서버에서 /api/chat을 같은 핸들러로 처리
scripts/                       # build-knowledge.ts · subset-fonts.py · optimize-images.py
```

## 3. 결정사항

- **색 토큰 이름은 예전 것을 그대로 둔다**(`paper`/`surface`/`ink`/`muted`/`line`/`sand`/`espresso`).
  안내자 컴포넌트가 이 이름을 쓰고, 프로젝트 `theme`도 같은 일곱 키다. 사이트의 `espresso`는
  이제 잉크와 같은 값이다.
- **프로젝트 색은 CSS 변수로 싣는다**(`project/palette.ts`의 `paint` → `--p-paper`·`--p-ink`·
  `--p-muted`·`--p-accent`). 클래스는 `bg-(--p-paper)`처럼 읽는다. `:root`를 갈아 끼우지 않는다 —
  상세에서도 헤더·본문은 무채색 그대로다.
- **상세 본문에 프로젝트 액센트를 쓰지 않는다.** 아이머그의 노랑(#ffc702)처럼 흰 바탕에서
  대비가 안 나오는 색이 있어서, 색은 표지 띠 안에서만 쓴다.
- **숫자 매김은 실제 순서에만**: 파이프라인 관문 · 부팅 순서 · 해부 주석(위에서부터). 사례와
  작업물에는 번호를 달지 않는다.
- **연락처는 자동 복사하지 않고 복사 버튼을 준다**(§4 클립보드).
- **본문 용어는 풀어 쓴다**(30차 문구 전면 점검, 사용자 지적 — "한글이 어색하다"). 조어·은유 대신
  흔한 말을 쓴다: 닿다 → 받다/전달되다, 침묵 판정 → 끊김 판정, 열쇠 → 토큰, 창구 → 브릿지,
  밴드 → 탭, 단일 비행 → 하나로 묶었다(single-flight), 래치 → 플래그, 굴려 보세요 → 스크롤해 보세요,
  태우다 → 거치다/띄우다. "~를 통해 ~ 향상", "기술적 방향성을 주도" 같은 번역투와 대시(—)로
  두 문장을 이어 붙이는 것도 피한다(제목의 "A — B" 구분은 괜찮다). 콘텐츠를 새로 쓸 때 이 목록으로
  한 번 훑을 것.
- **`socials.ts`는 자리표시자(@username)라 화면에 올리지 않는다.** 실제 계정이 생기면 소개의
  연락처 목록에 더한다.
- **Pretendard는 굵기당 두 벌을 굽는다**(`python3 scripts/subset-fonts.py`, 요구:
  `fonttools[woff]`·`brotli`, 원본 OTF는 커밋하지 않음). `core`는 **소스에 실제로 쓰는 한글
  859자**만 담아 76KB, `subset`은 KS X 1001 2350자로 170KB다. CSS는 `subset`을 먼저,
  `core`를 나중에 선언하고 `core`에만 `unicode-range`를 준다 — 브라우저는 겹치는 글자에서
  나중 선언을 쓰므로 지금 쓰는 글자는 전부 `core`로 그려지고 `subset`은 **아예 받지 않는다**.
  세 굵기 518KB를 첫 로드에 통째로 받던 것이 229KB가 됐다. 콘텐츠에 없던 글자가 들어오면
  그 글자만 `core`의 범위를 벗어나 `subset`이 그때 받아지므로, **스크립트 재실행을 잊어도
  글자가 시스템 폰트로 튀지 않는다** — 다만 잊으면 그 페이지가 170KB를 더 받는다.
  `@font-face` 선언과 `unicode-range`는 손으로 적지 않는다(폰트와 어긋나면 그대로 버그).
  스크립트가 `src/styles/fonts.generated.css`에 함께 써 낸다.
- **첫 화면의 한글 폰트는 HTML에서 미리 받는다**(`vite.config.ts`의 `preloadKoreanFonts`).
  `@font-face`는 글자가 그려질 때 비로소 받아지고 CSR에서 그 시점은 엔트리 JS 뒤라, 7rem
  제목이 시스템 폰트로 그려진 뒤 인트로 한가운데서 폭이 통째로 바뀌었다. 해시가 붙은
  파일명이라 손으로 적을 수 없어 번들에서 찾아 넣는다. 본문(400)·표제(700)만 — 셋을 다
  걸면 229KB가 엔트리 JS와 대역폭을 다툰다.
- **이미지는 표시 크기에 맞춘 webp를 번들**: 원본은 저장소에 백업으로 두되 코드는
  `scripts/optimize-images.py` 산출물을 import. 에셋 교체 시 `TARGETS` 갱신 후 재실행(요구: Pillow).
- **Tailwind 임의값은 스케일 유틸이 있으면 그쪽 사용**: `left-[3px]` → `left-0.75`. `clamp()`·`em`·
  비율(`leading-[0.95]`)처럼 대응 유틸이 없는 것만 임의값으로 남긴다.

## 4. 함정 노트 (재발 방지)

- **뒤로 가기 스크롤 복원은 브라우저에 맡기지 않는다**: 브라우저는 popstate 순간, 아직 이전
  페이지가 그려져 있을 때 위치를 되돌린다. 긴 상세에서 홈으로 돌아오면 그 값이 홈 높이에 잘려
  맨 아래로 떨어졌다(사용자 지적). `ScrollManager`가 `history.scrollRestoration = "manual"`로 두고
  항목(`pathname + hash + key`)마다 위치를 sessionStorage에 적어 두었다가, POP이면 새 화면이 커밋된 뒤
  되돌린다(이미지로 높이가 늦게 차면 몇 프레임 더 시도). 키에 주소를 붙이는 이유는 새로 연 탭의
  첫 항목 key가 늘 `"default"`이기 때문이다.
- **해시 링크는 라우터가 스크롤해 주지 않는다**: `<Link to="/#projects">`는 pushState만 한다.
  `ScrollManager`가 `hash`·`key`를 보고 `scrollIntoView`를 부른다 — 같은 해시를 다시 눌러도
  `key`가 바뀌어 다시 간다. 새 페이지로 갈 때는 `behavior: "instant"`로 올린다. CSS의
  `scroll-behavior: smooth` 때문에 그냥 두면 이전 페이지 위치에서 위로 굴러 올라가는 게 보인다.
- **상세 → 상세 이동은 같은 인스턴스를 재사용한다**: 라우트와 트리 위치가 같아서 화면 선반의
  라이트/다크 선택과 가로 스크롤 위치가 다음 프로젝트로 넘어갔다(Codex 리뷰). `ProjectDetail`의
  `<article key={project.slug}>`가 프로젝트마다 새로 그리게 한다.
- **고정 헤더만큼의 여백은 `scroll-padding-top`**(`html`, 5rem). 섹션마다 `scroll-mt`를 달지 않는다.
- **`hidden` 속성과 `flex` 클래스를 같이 써도 된다**: Tailwind v4 preflight가 `[hidden]`을
  `display: none !important`로 둔다. 안내 패널은 한 번 마운트하면 닫아도 내리지 않고
  `hidden`으로 숨긴다(내리면 대화가 사라진다).
- **헤드리스 스크린샷에서 `loading="lazy"` 이미지가 비어 보인다**: 실제로는 로드된다
  (`complete: true` 확인). 찍을 때는 `img.loading = "eager"`로 바꾸고 전부 로드를 기다린다.
- **콘텐츠에 새 한글을 넣었으면 `subset-fonts.py`를 다시 돌린다**: 안 돌려도 글자가 튀지는
  않지만(안전망 subset) 그 페이지가 170KB를 더 받는다. 요구 패키지 `fonttools[woff]`·`brotli`가
  시스템 파이썬에 없으면 임시 venv에서 돌려도 된다.
- **새 시그니처 필드는 `scripts/build-knowledge.ts`와 `api/_lib/types.ts`에도 넣을 것**: 넣지 않으면
  안내자의 `get_project_detail`이 그 그림을 모른다. `sieve`·`windowing`은 넣었다.
  일곱 그림 모두 들어가 있다(30차).
- **`bun run knowledge` 뒤에는 `bun run check:fix`를 다시 돌릴 것**: 생성기가 만드는
  `api/_lib/knowledge.generated.ts`는 키를 따옴표로 감싼 JSON 꼴이라 Biome 포맷과 어긋난다.
  콘텐츠만 고치고 검사를 건너뛰면, 정작 손대지도 않은 생성 파일 때문에 `bun run check`가
  깨진다. 순서는 **knowledge → check:fix**다.
- **프레임 안에서 화면만 미끄러뜨릴 때는 `PhoneShot`을 쓸 수 없다**: 이 컴포넌트는 기기 테두리를
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
- **Vercel의 서버 함수는 개발 서버와 실행 방식이 다르다 — 배포본에서만 깨지는 것이 세 가지 있었다.**
  전부 로컬에서는 멀쩡하고 배포 후에만 드러났으니, 서버 코드를 손대면 배포본에서 한 번 찔러 본다.
  1. **번들하지 않고 하나씩 트랜스파일해 Node ESM으로 돌린다** — 확장자 없는 상대 import가 그대로
     남아 `ERR_MODULE_NOT_FOUND`. `api/` 안의 상대 import에는 **`.js`를 붙인다**(TS와 Vite가
     `.ts`로 해석해 준다).
  2. **핸들러에 Web `Request`가 아니라 Node `IncomingMessage`를 넘긴다** —
     `req.headers.get is not a function`. 변환은 `api/_lib/node-adapter.ts`가 맡고,
     개발 플러그인도 같은 어댑터를 쓴다.
  3. **요청 본문을 미리 읽어 `req.body`에 파싱해 둔다** — 그 뒤 스트림을 다시 읽으면 데이터도
     `done`도 오지 않아 함수가 통째로 매달린다(`FUNCTION_INVOCATION_TIMEOUT`). 이미 읽힌 본문이
     있으면 그것으로 `Request`를 만든다.
  여기에 응답 스트리밍은 `supportsResponseStreaming`으로 켜야 하고, `maxDuration` 기본값(10초)은
  모델이 말을 마치기 전에 끊긴다.
- **개발 서버(`ssrLoadModule`)는 모듈을 다시 평가한다**: 모듈 스코프에 둔 카운터가 요청마다
  초기화돼 레이트리밋이 전혀 걸리지 않았다(21번째에 429가 나와야 하는데 계속 400). 프로세스가
  살아 있는 동안 이어져야 하는 상태는 `globalThis`에 붙인다.
- **Gemini 모델 이름과 한도는 확인하고 쓴다**: `gemini-2.5-flash`·`gemini-2.5-flash-lite`는
  신규 사용자에게 404다("no longer available to new users"). 무료 티어 일일 한도도 계열마다
  달라서, Flash를 기본값으로 뒀다가 검증 중에 하루치(20건)를 두 모델 연속으로 태웠다.
  쓸 수 있는 모델은 `models.list`로 확인하고, 공개용 기본값은 Lite 계열로 둔다.
- **Tailwind v4에서 bare value가 되는 곳에 대괄호를 쓰지 말 것**: `z-[80]`·`aspect-[9/19.5]`는
  v4에서 `z-80`·`aspect-9/19.5`로 그냥 써진다. 대괄호로 쓰면 CSS는 똑같이 나오지만 에디터의

## 5. AI 안내자 — 키와 배포

- **배포됨**: https://limjeongsik-portfolio.vercel.app (Vercel 프로젝트
  `limjeongsiks-projects/portfolio`). GitHub `main`에 push하면 자동 배포된다.
- 키는 Vercel 환경변수 `GOOGLE_GENERATIVE_AI_API_KEY`(Production · Preview)에 있고,
  로컬은 `.env.local`을 쓴다(`.env.example` 참고).
- `vercel.json`이 빌드 커맨드(`bun run build`) · 출력(`dist`) · SPA rewrite(`/api/*` 제외) ·
  함수 `maxDuration`(60초)을 들고 있어 대시보드에서 따로 설정할 것은 없다.
- **배포별 URL(`portfolio-<해시>-...`)은 Deployment Protection이 걸려 401이다.** 공개로 열리는 건
  프로덕션 별칭뿐이니, 링크를 공유할 때 배포 URL을 주지 말 것.

**한도가 차면 `GEMINI_MODEL`을 갈아끼운다.** 이 키로 쓸 수 있는 모델(2026-09 확인):

| 넉넉함 | 모델 |
|---|---|
| Lite — 기본값 계열 | `gemini-3.5-flash-lite` · `gemini-3.1-flash-lite` · `gemini-flash-lite-latest` |
| Flash — 하루 20건 | `gemini-3.5-flash` · `gemini-3.6-flash` · `gemini-3.7-flash` · `gemini-3-flash-preview` |

`gemini-2.5-*` 계열은 신규 사용자에게 404다("no longer available to new users").
남은 한도는 https://aistudio.google.com/rate-limit 에서 본다. 한도를 넘기면 채팅에는
"답을 받아오지 못했습니다"로 나타나고 서버 로그에 429 `RESOURCE_EXHAUSTED`가 찍힌다.


## 6. 마지막 검증 (2026-09-23, 30차)

- `bun run check` · `bun run build` 통과. 첫 로드 JS는 index 39KB + react 74KB(gzip) —
  three·gsap·motion 청크가 사라졌다. assistant 묶음은 여전히 버튼에 닿을 때 받는다.
- 헤드리스 Chromium(1440×900 · 390×844)으로 홈과 네 상세를 찍어 확인. 콘솔 에러 0,
  가로 넘침 없음. `/#about` 직접 진입 시 그 구간으로 이동.
- 이력서: 헤드리스 Chrome `--print-to-pdf`로 뽑아 A4 4쪽 · 쪽 경계(제목만 남는 쪽 없음) 확인.

## 7. 다음 작업 (미착수)

- README 화면 캡처 · 스택 배지 · 구조 설명을 새 화면에 맞춰 다시 쓰기.
- **`safeops-dashboard`(관제 백오피스, React SPA + Django)는 아직 올리지 않는다.** 센티언트
  시스템즈의 같은 제품 라인이고 리팩터링 파이프라인(`.claude/agents`)이 거기 서 있지만,
  **완료된 프로젝트가 아니고 혼자 만든 것도 아니다.** 올린다면 먼저 **내가 한 몫과 팀이 한 몫을
  가를 수 있어야** 한다 — 그 구분 없이 프로젝트 카드로 세우면 공동 작업을 단독 작업처럼
  보이게 만든다. 그래서 센티언트 경력의 `summary`도 앱(SafeOps) 얘기로 둔 채 넓히지 않았다.
  단, 대시보드에서 **직접 세우고 운영한 개발 흐름**(리뷰 게이트 · 읽기 전용 에이전트
  파이프라인)은 제품이 아니라 일하는 방식이라 경력의 `achievements`에 이미 올라 있다.
- **프로젝트를 더 넣는다면** `theme` 7색과 **그 프로젝트만의 시그니처 데이터**를 함께 정한다
  기존 시그니처를 재탕하지 말고 하나 더 만든다 — `components/project/figures/`에 그림 하나,
  `ProjectDetail`의 `figuresOf`에 한 줄.
  콘텐츠를 고친 뒤에는 `bun run knowledge`를 잊지 말 것 — 안내자는 `projects.ts`를 그대로 읽는다.
- (선택) 공유 저장소 기반 레이트리밋. 지금의 분당 20요청 카운터는 인메모리라 서버리스
  인스턴스마다 따로 센다.
