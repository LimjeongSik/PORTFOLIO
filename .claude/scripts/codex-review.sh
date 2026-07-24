#!/usr/bin/env bash
# Codex 리뷰 실행 래퍼.
#
# 목적: codex-companion.mjs의 버전 디렉토리(예: .../codex/1.0.6/...)를 글롭으로 자동
#       해석하되, 항상 `bash .claude/scripts/codex-review.sh <args>`라는 안정된 커맨드
#       형태로 호출되게 한다. 인라인 `CODEX_SCRIPT="$(...)"; node "$CODEX_SCRIPT"` 형태는
#       변수 할당 + 서브셸이 섞여 Bash 권한 자동승인(allow) 규칙으로 안전하게 매칭할 수
#       없다. 이 래퍼 하나만 allow에 등록하면 `node`를 통째로 여는 위험 없이 리뷰 호출을
#       자동 승인할 수 있다.
#
# 사용: bash .claude/scripts/codex-review.sh review --wait
#       bash .claude/scripts/codex-review.sh adversarial-review --wait
set -euo pipefail

# `|| true`: 매칭 파일이 없으면 ls가 실패하고 pipefail로 파이프라인이 비정상 종료되는데,
# set -e가 이 할당에서 스크립트를 즉시 끝내버리면 아래 -z 안내 경로에 도달하지 못한다.
# 조회 실패를 비치명적으로 만들어 -z 검사가 안내 메시지를 내도록 한다.
script="$(ls -t ~/.claude/plugins/cache/openai-codex/codex/*/scripts/codex-companion.mjs 2>/dev/null | head -1)" || true
if [ -z "${script:-}" ]; then
    echo "codex-companion.mjs를 찾을 수 없습니다. Codex 플러그인이 설치되어 있는지 확인하세요(/codex:setup)." >&2
    exit 1
fi

exec node "$script" "$@"
