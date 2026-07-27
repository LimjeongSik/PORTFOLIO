#!/usr/bin/env python3
"""Pretendard OTF 원본을 웹용 서브셋 woff2로 변환한다.

원본 OTF(각 ~1.5MB)는 웹 전송에 부적합해 git에서 제외하고(.gitignore),
이 스크립트가 만들어낸 woff2만 커밋해 self-host 한다.

사용법:
    python3 scripts/subset-fonts.py

요구사항: fonttools[woff] (pyftsubset), brotli
    pip install "fonttools[woff]" brotli
"""

from __future__ import annotations

import sys
from pathlib import Path

from fontTools.subset import main as pyftsubset

FONT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "fonts"

# 실제 사용하는 굵기만 변환한다(본문 400 / font-medium 500 / font-bold 700).
WEIGHTS = [
    ("Pretendard-Regular.otf", "pretendard-400.subset.woff2"),
    ("Pretendard-Medium.otf", "pretendard-500.subset.woff2"),
    ("Pretendard-Bold.otf", "pretendard-700.subset.woff2"),
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
def syllables_used_in_source() -> str:
    root = Path(__file__).resolve().parent.parent
    targets = [*(root / "src").rglob("*.ts"), *(root / "src").rglob("*.tsx")]
    targets.append(root / "index.html")

    used = set()
    for path in targets:
        if not path.is_file():
            continue
        for char in path.read_text(encoding="utf-8"):
            if "가" <= char <= "힣":
                used.add(char)
    return "".join(sorted(used))


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


def main() -> int:
    missing = [src for src, _ in WEIGHTS if not (FONT_DIR / src).exists()]
    if missing:
        print(f"원본 OTF를 찾을 수 없습니다: {', '.join(missing)}", file=sys.stderr)
        print(f"  기대 경로: {FONT_DIR}", file=sys.stderr)
        return 1

    base = ks_x_1001_syllables()
    extra = "".join(sorted(set(syllables_used_in_source()) - set(base)))
    hangul = base + extra
    print(f"한글 음절 {len(base)}자(KS X 1001) + 소스 전용 {len(extra)}자 + 라틴/기호 범위로 서브셋")

    for src, out in WEIGHTS:
        src_path = FONT_DIR / src
        out_path = FONT_DIR / out
        pyftsubset(
            [
                str(src_path),
                f"--output-file={out_path}",
                "--flavor=woff2",
                f"--unicodes={UNICODE_RANGES}",
                f"--text={hangul}",
                "--layout-features=kern,liga,calt,ccmp,locl,mark,mkmk",
                "--no-hinting",
                "--desubroutinize",
                "--drop-tables+=DSIG",
            ]
        )
        before = src_path.stat().st_size / 1024
        after = out_path.stat().st_size / 1024
        print(f"  {src} {before:,.0f}KB → {out} {after:,.0f}KB")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
