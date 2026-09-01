#!/usr/bin/env python3
"""원본 이미지를 실제 표시 크기에 맞춘 webp로 변환한다.

프로필 사진 원본(1122x1440 PNG, 1.6MB)은 About 섹션에서 최대 144px(`sm:w-36`)로
표시되므로 그대로 번들하면 초기 로드가 크게 낭비된다. 고해상도(DPR 3) 여유를 둔
폭으로 줄이고 webp로 변환한다. 원본은 백업 겸 저장소에 남기되 코드는 webp를 참조한다.

사용법:
    python3 scripts/optimize-images.py

요구사항: Pillow
    pip install Pillow
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ASSET_DIR = Path(__file__).resolve().parent.parent / "src" / "assets"

# (원본, 결과, 최대 폭, 품질)
# 프로필: 표시 144px * DPR 3 = 432px
TARGETS = [
    ("profile.png", "profile.webp", 432, 82),
    ("safeops-icon.png", "safeops-icon.webp", 192, 88),
]


def main() -> int:
    missing = [src for src, _, _, _ in TARGETS if not (ASSET_DIR / src).exists()]
    if missing:
        print(f"원본 이미지를 찾을 수 없습니다: {', '.join(missing)}", file=sys.stderr)
        print(f"  기대 경로: {ASSET_DIR}", file=sys.stderr)
        return 1

    for src, out, max_width, quality in TARGETS:
        src_path = ASSET_DIR / src
        out_path = ASSET_DIR / out

        with Image.open(src_path) as image:
            image = image.convert("RGB")
            if image.width > max_width:
                height = round(image.height * max_width / image.width)
                image = image.resize((max_width, height), Image.LANCZOS)
            image.save(out_path, "WEBP", quality=quality, method=6)

        before = src_path.stat().st_size / 1024
        after = out_path.stat().st_size / 1024
        with Image.open(out_path) as result:
            size = f"{result.width}x{result.height}"
        print(f"  {src} {before:,.0f}KB → {out} {size} {after:,.0f}KB")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
