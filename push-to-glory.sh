#!/usr/bin/env bash
#
# push-to-glory.sh
#
# Push the contents of a git bundle (glory.bundle) to the Glory GitHub repo.
#
# Usage:
#   # put glory.bundle + push-to-glory.sh in the same folder, then:
#   chmod +x push-to-glory.sh
#   ./push-to-glory.sh                 # defaults to https://github.com/Lasgidi-ux/Glory.git
#   ./push-to-glory.sh git@github.com:Lasgidi-ux/Glory.git   # or pass an SSH/HTTPS remote
#
# Optional environment variables:
#   BUNDLE   Path to the bundle file        (default: <script dir>/glory.bundle)
#   FORCE=1  Force-push refs (overwrites remote history — use with care)
#
set -euo pipefail

# --- pretty output -----------------------------------------------------------
if [ -t 1 ]; then
  RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; BOLD=''; RESET=''
fi
info()  { printf '%s==>%s %s\n' "$GREEN$BOLD" "$RESET" "$*"; }
warn()  { printf '%s==>%s %s\n' "$YELLOW$BOLD" "$RESET" "$*" >&2; }
die()   { printf '%serror:%s %s\n' "$RED$BOLD" "$RESET" "$*" >&2; exit 1; }

# --- resolve paths -----------------------------------------------------------
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd -P)"
REMOTE_URL="${1:-https://github.com/Lasgidi-ux/Glory.git}"
BUNDLE="${BUNDLE:-$SCRIPT_DIR/glory.bundle}"
FORCE="${FORCE:-0}"

command -v git >/dev/null 2>&1 || die "git is not installed or not on PATH."
[ -f "$BUNDLE" ] || die "bundle not found: $BUNDLE
Place glory.bundle next to this script, or set BUNDLE=/path/to/glory.bundle."

# --- scratch workspace -------------------------------------------------------
WORKDIR="$(mktemp -d "${TMPDIR:-/tmp}/glory-push.XXXXXX")"
cleanup() { rm -rf "$WORKDIR"; }
trap cleanup EXIT

# --- verify the bundle -------------------------------------------------------
# `git bundle verify` needs a repository context, and this script is meant to be
# run from a plain folder that just holds the bundle. Verify from a scratch repo;
# treat failure as a warning since the mirror clone below is the real gate.
info "Verifying bundle: $BUNDLE"
git -C "$WORKDIR" init -q "verify-repo"
if ! git -C "$WORKDIR/verify-repo" bundle verify "$BUNDLE" >/dev/null 2>&1; then
  warn "Could not fully verify the bundle (it may reference prerequisite commits); relying on the clone step."
fi

# --- clone the bundle into a scratch mirror ----------------------------------
MIRROR="$WORKDIR/glory.git"
info "Extracting bundle into a temporary mirror clone"
git clone --mirror "$BUNDLE" "$MIRROR" >/dev/null 2>&1 \
  || die "'$BUNDLE' is not a valid or complete git bundle (clone failed)."

cd "$MIRROR"

# Drop refs that should not be republished (e.g. remote-tracking refs baked
# into the bundle). We only push branches and tags.
BRANCHES="$(git for-each-ref --format='%(refname)' refs/heads/ || true)"
TAGS="$(git for-each-ref --format='%(refname)' refs/tags/ || true)"

[ -n "$BRANCHES$TAGS" ] || die "Bundle contains no branches or tags to push."

info "Bundle contents:"
git for-each-ref --format='  %(refname:short)  ->  %(objectname:short)' \
  refs/heads/ refs/tags/ || true

# --- push to the target remote ----------------------------------------------
PUSH_OPTS=()
[ "$FORCE" = "1" ] && { warn "FORCE=1 set — refs will be force-pushed."; PUSH_OPTS+=(--force); }

info "Pushing branches to $REMOTE_URL"
git push "${PUSH_OPTS[@]}" "$REMOTE_URL" 'refs/heads/*:refs/heads/*'

if [ -n "$TAGS" ]; then
  info "Pushing tags to $REMOTE_URL"
  git push "${PUSH_OPTS[@]}" "$REMOTE_URL" 'refs/tags/*:refs/tags/*'
fi

info "${BOLD}Done.${RESET} Pushed bundle contents to $REMOTE_URL"
