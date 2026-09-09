#!/usr/bin/env python3
"""Pretendard OTF 원본을 웹용 서브셋 woff2로 변환한다.

원본 OTF(각 ~1.5MB)는 웹 전송에 부적합해 git에서 제외하고(.gitignore),
이 스크립트가 만들어낸 woff2만 커밋해 self-host 한다.

**굵기마다 두 벌을 만든다.**

- `core` — 이 저장소의 소스에 실제로 등장하는 한글만. 굵기당 60KB 남짓.
- `subset` — KS X 1001 완성형 2350자. 굵기당 170KB 남짓. **평소에는 받지 않는다.**

CSS에서 `subset`을 먼저, `core`를 나중에 선언하고 `core`에만 `unicode-range`를 준다.
브라우저는 겹치는 글자에 대해 **나중에 선언된 쪽**을 쓰므로 지금 쓰는 글자는 전부 `core`로
그려지고, `subset`은 아예 내려받지 않는다. 나중에 콘텐츠에 없던 글자가 들어오면 그 글자만
`core`의 범위를 벗어나 `subset`이 그때 받아진다 — 이 스크립트를 다시 돌리는 것을 잊어도
**글자가 시스템 폰트로 튀지 않는다.** 세 굵기 518KB를 첫 로드에 통째로 받던 것을
205KB로 줄이면서 안전망을 남기는 방법이다.

`@font-face` 선언과 `unicode-range`는 손으로 적지 않는다 — 폰트와 어긋나면 그대로 버그가
되므로 이 스크립트가 `src/styles/fonts.generated.css`에 함께 써 낸다.

사용법:
    python3 scripts/subset-fonts.py

요구사항: fonttools[woff] (pyftsubset), brotli
    pip install "fonttools[woff]" brotli
"""

from __future__ import annotations

import sys
from pathlib import Path

from fontTools.subset import main as pyftsubset

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / "src" / "assets" / "fonts"
CSS_OUT = ROOT / "src" / "styles" / "fonts.generated.css"

# 실제 사용하는 굵기만 변환한다(본문 400 / font-medium 500 / font-bold 700).
# 700은 라틴 표제 폰트(Space Grotesk)에 한글이 없어 한글 표제가 여기로 떨어지므로 필요하다.
WEIGHTS = [
    ("Pretendard-Regular.otf", 400),
    ("Pretendard-Medium.otf", 500),
    ("Pretendard-Bold.otf", 700),
]

# 한글 음절은 KS X 1001 완성형 2350자만 남긴다. 11172자 전체를 넣으면
# 굵기당 550KB를 넘겨 서브셋의 의미가 옅어진다.
# 파이썬의 "euc-kr" 코덱은 실제로 CP949(확장 완성형)라 11172자를 모두
# 인코딩한다 → 리드 바이트가 KS X 1001 영역(0xB0-0xC8)인지로 걸러낸다.
def ks_x_1001_syllables() -> str:
    syllables = []
    for code in range(0xAC00, 0xD7A4):
        char = chr(code)
        try:
            encoded = char.encode("euc-kr")
        except UnicodeEncodeError:
            continue
        if len(encoded) == 2 and 0xB0 <= encoded[0] <= 0xC8:
            syllables.append(char)
    return "".join(syllables)


# 2350자 밖 글자(똠·뷁 등)를 콘텐츠에서 쓰면 fallback 폰트로 렌더되므로,
# 현재 소스에 실제로 등장하는 한글을 합집합으로 더해 그 구멍을 메운다.
# 콘텐츠(src/data/*.ts)를 교체했다면 이 스크립트를 다시 실행할 것.
def syllables_used_in_source() -> set[str]:
    targets = [*(ROOT / "src").rglob("*.ts"), *(ROOT / "src").rglob("*.tsx")]
    targets.append(ROOT / "index.html")

    used = set()
    for path in targets:
        if not path.is_file():
            continue
        for char in path.read_text(encoding="utf-8"):
            if "가" <= char <= "힣":
                used.add(char)
    return used


def to_unicode_ranges(chars: set[str]) -> str:
    """글자 집합을 CSS `unicode-range` 문법으로. 이어지는 코드포인트는 한 범위로 묶는다."""
    codes = sorted(ord(char) for char in chars)
    spans: list[tuple[int, int]] = []
    start = previous = codes[0]
    for code in codes[1:]:
        if code == previous + 1:
            previous = code
            continue
        spans.append((start, previous))
        start = previous = code
    spans.append((start, previous))
    return ",".join(f"U+{a:04X}" if a == b else f"U+{a:04X}-{b:04X}" for a, b in spans)


UNICODE_RANGES = ",".join(
    [
        "U+0020-007E",  # 기본 라틴
        "U+00A0-00FF",  # 라틴-1 보충(°, ×, ÷ 등)
        "U+2010-2027",  # 하이픈·대시·인용부호·… ·•
        "U+2030-2044",  # ‰, ′, ″, ⁄
        "U+20A9",  # ₩
        "U+20AC",  # €
        "U+2190-2199",  # 화살표(← ↑ → ↓) — CTA에서 사용
        "U+2212",  # 마이너스
        "U+3000-303F",  # CJK 구두점(「」『』〈〉 등)
        "U+3130-318F",  # 한글 호환 자모
        "U+FF01-FF60",  # 전각 영숫자·구두점
    ]
)


def cut(src_path: Path, out_path: Path, text: str) -> None:
    pyftsubset(
        [
            str(src_path),
            f"--output-file={out_path}",
            "--flavor=woff2",
            f"--unicodes={UNICODE_RANGES}",
            f"--text={text}",
            "--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk",
            "--no-hinting",
            "--desubroutinize",
            "--drop-tables+=DSIG",
        ]
    )


def face(weight: int, file: str, ranges: str | None) -> str:
    lines = [
        "@font-face {",
        '    font-family: "Pretendard";',
        "    font-style: normal;",
        f"    font-weight: {weight};",
        "    font-display: swap;",
        f'    src: url("../assets/fonts/{file}") format("woff2");',
    ]
    if ranges:
        lines.append(f"    unicode-range: {ranges};")
    lines.append("}")
    return "\n".join(lines)


def main() -> int:
    missing = [src for src, _ in WEIGHTS if not (FONT_DIR / src).exists()]
    if missing:
        print(f"원본 OTF를 찾을 수 없습니다: {', '.join(missing)}", file=sys.stderr)
        print(f"  기대 경로: {FONT_DIR}", file=sys.stderr)
        return 1

    base = set(ks_x_1001_syllables())
    used = syllables_used_in_source()
    full = "".join(sorted(base | used))
    core = "".join(sorted(used))
    core_ranges = f"{UNICODE_RANGES},{to_unicode_ranges(used)}"
    print(f"core: 소스에 실제로 쓰는 한글 {len(used)}자 · subset(안전망): {len(base | used)}자")

    blocks = [
        "/* 이 파일은 `python3 scripts/subset-fonts.py`가 만든다 — 손으로 고치지 말 것.",
        "   두 벌을 선언하는 이유와 순서(subset 먼저 · core 나중)는 그 스크립트의 주석 참고. */",
        "",
    ]

    for src, weight in WEIGHTS:
        src_path = FONT_DIR / src
        subset_file = f"pretendard-{weight}.subset.woff2"
        core_file = f"pretendard-{weight}.core.woff2"
        cut(src_path, FONT_DIR / subset_file, full)
        cut(src_path, FONT_DIR / core_file, core)
        blocks.append(face(weight, subset_file, None))
        blocks.append("")
        blocks.append(face(weight, core_file, core_ranges))
        blocks.append("")
        origin = src_path.stat().st_size / 1024
        big = (FONT_DIR / subset_file).stat().st_size / 1024
        small = (FONT_DIR / core_file).stat().st_size / 1024
        print(f"  {src} {origin:,.0f}KB → core {small:,.0f}KB · subset {big:,.0f}KB")

    CSS_OUT.write_text("\n".join(blocks), encoding="utf-8")
    print(f"@font-face 선언을 {CSS_OUT.relative_to(ROOT)}에 썼습니다")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
