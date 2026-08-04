# Portfolio

프론트엔드 개발자 포트폴리오 겸 이력서 웹사이트. 원페이지 스크롤(`/`) + 프로젝트 상세
페이지(`/projects/:slug`) 구조.

**스택** — React 19 · Vite 8 · TypeScript · Tailwind CSS v4 · GSAP · motion · Lenis.
패키지 매니저는 Bun, 린트/포맷은 Biome.

## 개발

```bash
bun install
bun run dev        # 개발 서버 (HMR)
bun run build      # 타입 체크(tsc -b) + 프로덕션 빌드
bun run preview    # 빌드 결과 로컬 서빙
bun run check      # Biome 린트 + 포맷 검사
bun run check:fix  # 자동 수정
```

## 콘텐츠 편집

화면에 나오는 텍스트·목록은 전부 `src/data/*.ts`에 있다. 로직을 건드리지 않고 이 파일들만 고치면 된다.

| 파일 | 내용 |
|------|------|
| `profile.ts` | 이름·연락처·소개·프로필 사진 |
| `experience.ts` | 경력 |
| `skills.ts` | 기술 스택 |
| `projects.ts` | 프로젝트 목록 및 상세 |
| `socials.ts` · `nav.ts` | 소셜 링크 · 내비 항목 |

이미지와 폰트는 원본을 그대로 쓰지 않고 스크립트로 변환한 산출물을 번들한다:

```bash
python3 scripts/optimize-images.py   # 원본 이미지 → 표시 크기 webp (요구: Pillow)
python3 scripts/subset-fonts.py      # Pretendard OTF → 서브셋 woff2 (요구: fonttools[woff], brotli)
```

## 문서

- `docs/PROGRESS.md` — 현재 상태·구조·결정사항·함정 노트
- `CLAUDE.md` — Claude Code 작업 규약
