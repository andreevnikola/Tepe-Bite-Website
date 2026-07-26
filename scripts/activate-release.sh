#!/usr/bin/env bash
#
# Activates one uploaded release of TEPE bite. Runs as root, invoked ONLY via:
#   sudo /usr/local/bin/activate-release.sh <release-version>
# by the 'deploy' user, whose sudoers rule restricts it to exactly this
# script with no other args form. See scripts/bootstrap-vps.sh (sudoers stage).
#
# Steps: extract the uploaded release archive from /srv/tepebite/incoming,
# atomically swap the "current" symlink, restart the service, poll the health
# endpoint, and roll back automatically if the new release fails to come up
# healthy. On success, prune old releases (keep last 5).

set -euo pipefail

APP_DIR=/srv/tepebite
RELEASES_DIR="$APP_DIR/releases"
INCOMING_DIR="$APP_DIR/incoming"
CURRENT_LINK="$APP_DIR/current"
SERVICE=tepebite.service
HEALTH_URL="http://127.0.0.1:3000/api/health"
KEEP_RELEASES=5
HEALTH_RETRIES=10
HEALTH_DELAY=2

log()  { printf '\n[activate-release] %s\n' "$1"; }
die()  { printf '[activate-release] ERROR: %s\n' "$1" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "must run as root"

VERSION="${1:-}"
[ -n "$VERSION" ] || die "usage: $0 <release-version>"

# Strict allow-list: no slashes, no dots-only, no leading dash — the value
# becomes a directory name under $RELEASES_DIR, so this blocks path
# traversal (../..) and option injection into later commands.
case "$VERSION" in
  -*) die "invalid release version: $VERSION" ;;
esac
if ! [[ "$VERSION" =~ ^[A-Za-z0-9._-]{1,128}$ ]]; then
  die "invalid release version: $VERSION"
fi

ARCHIVE="$INCOMING_DIR/${VERSION}.tar.gz"
RELEASE_DIR="$RELEASES_DIR/$VERSION"

[ -f "$ARCHIVE" ] || die "release archive not found: $ARCHIVE"

PREVIOUS_TARGET=""
if [ -L "$CURRENT_LINK" ]; then
  PREVIOUS_TARGET="$(readlink -f "$CURRENT_LINK" || true)"
fi

if [ ! -d "$RELEASE_DIR" ]; then
  log "checking archive for path traversal"
  if tar -tzf "$ARCHIVE" | grep -E '(^|/)\.\.(/|$)|^/'; then
    die "archive contains unsafe paths (.. or absolute) — refusing to extract"
  fi

  log "extracting $ARCHIVE -> $RELEASE_DIR"
  install -d -m 750 -o deploy -g deploy "$RELEASE_DIR"
  tar -xzf "$ARCHIVE" -C "$RELEASE_DIR"
  chown -R deploy:deploy "$RELEASE_DIR"
else
  log "release dir already exists, reusing: $RELEASE_DIR"
fi

[ -f "$RELEASE_DIR/server.js" ] || die "extracted release has no server.js — refusing to activate"

switch_to() {
  local target_dir="$1"
  ln -sfn "$target_dir" "${CURRENT_LINK}.tmp"
  mv -T "${CURRENT_LINK}.tmp" "$CURRENT_LINK"
}

health_check() {
  local attempt
  for attempt in $(seq 1 "$HEALTH_RETRIES"); do
    if curl -fsS --max-time 5 "$HEALTH_URL" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$HEALTH_DELAY"
  done
  return 1
}

log "activating release $VERSION"
switch_to "$RELEASE_DIR"
systemctl restart "$SERVICE"

if health_check; then
  log "release $VERSION is healthy"
else
  log "health check FAILED for $VERSION — rolling back"
  if [ -n "$PREVIOUS_TARGET" ] && [ -d "$PREVIOUS_TARGET" ]; then
    switch_to "$PREVIOUS_TARGET"
    systemctl restart "$SERVICE"
    if health_check; then
      log "rollback to previous release succeeded"
    else
      log "rollback target also failed health check — manual intervention required"
    fi
  else
    log "no previous release to roll back to — manual intervention required"
  fi
  die "release $VERSION failed activation"
fi

log "pruning old releases (keeping last $KEEP_RELEASES)"
# shellcheck disable=SC2012
ls -1t "$RELEASES_DIR" 2>/dev/null | tail -n +$((KEEP_RELEASES + 1)) | while IFS= read -r old; do
  old_path="$RELEASES_DIR/$old"
  if [ -d "$old_path" ] && [ "$(readlink -f "$CURRENT_LINK")" != "$old_path" ]; then
    log "removing old release: $old"
    rm -rf -- "$old_path"
  fi
done

log "cleaning up archive $ARCHIVE"
rm -f -- "$ARCHIVE"

log "done."
