#!/usr/bin/env bash
# Stop 훅 — 작업 턴이 끝나는 순간 실행된다.
#
# 목적: 코드 편집이 있었던 턴이 끝나면 자동으로 review-and-apply 스킬을 돌리게 만든다.
# 안전장치:
#   1) 편집이 없던 턴(단순 질답 등)에는 발동하지 않는다  -> 마커 파일 유무로 판단
#   2) 리뷰가 수정을 적용해 다시 Stop이 발생해도 재귀 리뷰로 무한루프 돌지 않는다
#      -> stop_hook_active 플래그로 차단
#   3) 마커는 session_id로 스코프 -> 동시 세션 간 마커 오소비 방지
set -uo pipefail

proj="${CLAUDE_PROJECT_DIR:-.}"
input="$(cat)"

if command -v jq >/dev/null 2>&1; then
    active="$(printf '%s' "$input" | jq -r '.stop_hook_active // false')"
    sid="$(printf '%s' "$input" | jq -r '.session_id // "default"')"
else
    case "$input" in
        *'"stop_hook_active":true'* | *'"stop_hook_active": true'*) active="true" ;;
        *) active="false" ;;
    esac
    sid="$(printf '%s' "$input" | sed -n 's/.*"session_id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
    [ -n "$sid" ] || sid="default"
fi

marker="$proj/.claude/.review-pending.$sid"

# 이미 훅 유발 재진입 중(=리뷰 실행 후 종료)이면: 마커만 정리하고 조용히 종료.
if [ "$active" = "true" ]; then
    rm -f "$marker"
    exit 0
fi

# 이번 세션에 미리뷰 편집이 있었으면: 마커 소거 후 review-and-apply 실행을 지시.
if [ -f "$marker" ]; then
    rm -f "$marker"
    cat <<'JSON'
{"decision":"block","reason":"[자동 리뷰 게이트] 코드 편집이 있는 작업 턴이 끝났습니다. 지금 review-and-apply 스킬을 실행해 Codex 코드리뷰를 받고, 이 코드베이스에서 실제로 타당한 지적만 골라 반영하세요. 리뷰/반영이 끝나면 그대로 응답을 마치면 됩니다(재리뷰 불필요)."}
JSON
    exit 0
fi

# 편집 없음: 정상 종료.
exit 0
