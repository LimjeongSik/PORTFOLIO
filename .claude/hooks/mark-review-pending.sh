#!/usr/bin/env bash
# PostToolUse(Edit|Write|MultiEdit) 훅.
# 이번 세션에 "아직 리뷰받지 않은 코드 편집"이 발생했음을 마커 파일로 기록한다.
# Stop 훅이 이 마커를 보고 review-and-apply 자동 실행 여부를 결정한다.
#
# 마커는 session_id로 스코프한다 — 같은 체크아웃에서 여러 세션이 동시에 돌 때
# 한 세션의 마커를 다른 세션이 소비/삭제해 편집이 리뷰를 건너뛰는 경쟁을 막는다.
set -euo pipefail

proj="${CLAUDE_PROJECT_DIR:-.}"
input="$(cat)"

if command -v jq >/dev/null 2>&1; then
    sid="$(printf '%s' "$input" | jq -r '.session_id // "default"')"
else
    sid="$(printf '%s' "$input" | sed -n 's/.*"session_id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
    [ -n "$sid" ] || sid="default"
fi

mkdir -p "$proj/.claude"
touch "$proj/.claude/.review-pending.$sid"
exit 0
