#!/bin/bash
# Keeps the redesign preview in step with main:
#   merge origin/main → redesign, push, deploy a preview, re-point the fixed alias.
# Run after every production deploy. Safe to run from any branch; uses a temp worktree.
set -euo pipefail

BRANCH=redesign
ALIAS=blueme-ai-redesign.vercel.app
ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

git fetch -q origin
if ! git show-ref -q "refs/remotes/origin/$BRANCH"; then
  echo "sync-preview: no origin/$BRANCH — nothing to sync"; exit 0
fi

WT=$(mktemp -d)/wt
cleanup() { git -C "$ROOT" worktree remove --force "$WT" 2>/dev/null || true; }
trap cleanup EXIT

git worktree add -q --detach "$WT" "origin/$BRANCH"
cd "$WT"
if ! git merge -q --no-edit origin/main; then
  git merge --abort || true
  echo "sync-preview: ❌ merge conflict between main and $BRANCH — resolve manually"; exit 1
fi
git push -q origin "HEAD:$BRANCH"

mkdir -p .vercel && cp "$ROOT/.vercel/project.json" .vercel/
URL=$(npx vercel --yes 2>/dev/null | grep -Eo 'https://[a-z0-9-]+\.vercel\.app' | tail -1)
[ -n "$URL" ] || { echo "sync-preview: ❌ preview deploy failed"; exit 1; }
npx vercel alias set "$URL" "$ALIAS" >/dev/null
echo "sync-preview: ✅ $ALIAS → $URL ($(git rev-parse --short HEAD))"
