#!/usr/bin/env bash
# Stop 훅 — 작업 턴이 끝나는 순간 실행된다.
#
# 목적: 코드 편집이 있었던 턴이 끝나면 자동으로 review-and-apply 스킬을 돌리게 만든다.
# 안전장치:
#   1) 편집이 없던 턴(단순 질답 등)에는 발동하지 않는다  -> 마커 파일 유무로 판단
#   2) 리뷰가 수정을 적용해 다시 Stop이 발생해도 재귀 리뷰로 무한루프 돌지 않는다
#      -> stop_hook_active 플래그로 차단
#   3) 마커는 session_id로 스코프 -> 동시 세션 간 마커 오소비 방지
#   4) 작업 트리가 clean이면(=이미 커밋 완료, 리뷰할 대상 없음) 발동하지 않는다
#      -> marker는 "편집 발생"만 표시하므로, commit-push가 전부 커밋한 뒤에도 marker가 남아
#         재발동하는 문제를 git status로 차단한다. (커밋된 트리는 이미 게이트를 통과함)
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

# 이번 세션에 편집이 없었으면(마커 없음): 리뷰할 게 없다. 정상 종료.
if [ ! -f "$marker" ]; then
    exit 0
fi

# 편집은 있었지만 작업 트리가 clean이면(전부 커밋됨): 리뷰 대상 없음. 마커 정리 후 종료.
# commit-push가 PROGRESS까지 포함해 모두 커밋한 경우가 여기에 해당한다.
# 마커 파일 자신은 clean 판정에서 제외한다 — gitignore가 없어도 마커가 트리를 dirty로
# 오염시켜 가드가 영영 동작 못 하는 일을 막는다(gitignore에 의존하지 않는 방어).
if git -C "$proj" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    # --untracked-files=all: untracked 디렉토리를 접지 않고 파일 단위로 나열해,
    # 마커 라인을 grep으로 확실히 제외할 수 있게 한다.
    changes="$(git -C "$proj" status --porcelain --untracked-files=all 2>/dev/null \
        | grep -v '\.claude/\.review-pending' || true)"
    if [ -z "$changes" ]; then
        rm -f "$marker"
        exit 0
    fi
fi

# 미리뷰 편집 + 커밋 안 된 변경이 남아 있음: 마커 소거 후 review-and-apply 실행을 지시.
rm -f "$marker"
cat <<'JSON'
{"decision":"block","reason":"[자동 리뷰 게이트] 코드 편집이 있는 작업 턴이 끝났습니다. 지금 review-and-apply 스킬을 실행해 Codex 코드리뷰를 받고, 이 코드베이스에서 실제로 타당한 지적만 골라 반영하세요. 리뷰/반영이 끝나면 그대로 응답을 마치면 됩니다(재리뷰 불필요)."}
JSON
exit 0
