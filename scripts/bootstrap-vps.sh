#!/usr/bin/env bash
#
# Idempotent VPS bootstrap for TEPE bite (Ubuntu 24.04, 1 CPU / 2GB RAM).
#
# Run as root, one stage at a time, from a directory that also contains this
# repo's infra/ folder (i.e. run it from an uploaded copy of the repo, or
# from a bundle that preserves the scripts/../infra/ layout):
#
#   sudo bash scripts/bootstrap-vps.sh packages
#   sudo bash scripts/bootstrap-vps.sh swap
#   sudo bash scripts/bootstrap-vps.sh users   --nikola-pubkey /root/nikola.pub
#   sudo bash scripts/bootstrap-vps.sh deploy-user --deploy-pubkey /root/deploy.pub
#   sudo bash scripts/bootstrap-vps.sh sudoers
#   sudo bash scripts/bootstrap-vps.sh firewall
#   sudo bash scripts/bootstrap-vps.sh systemd
#   sudo bash scripts/bootstrap-vps.sh nginx
#   sudo bash scripts/bootstrap-vps.sh journald
#   sudo bash scripts/bootstrap-vps.sh unattended-upgrades
#   sudo bash scripts/bootstrap-vps.sh env-template
#
# Every stage is safe to re-run. Nothing here disables root SSH login or
# password authentication, and nothing sets a password for "nikola" — those
# are deliberate manual/separate steps (see docs/deployment.md). The
# "ssh-harden" stage exists but refuses to run unless you explicitly export
# CONFIRM_SSH_HARDEN=yes, and it is never invoked by any other stage.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

APP_DIR=/srv/tepebite
RELEASES_DIR="$APP_DIR/releases"
INCOMING_DIR="$APP_DIR/incoming"
ENV_FILE=/etc/tepebite.env
ACTIVATE_SCRIPT_DST=/usr/local/bin/activate-release.sh
NODE_MAJOR=24

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }
die()  { printf '\033[1;31mERROR:\033[0m %s\n' "$1" >&2; exit 1; }

require_root() {
  [ "$(id -u)" -eq 0 ] || die "must run as root (use sudo)."
}

arg_value() {
  # arg_value --flag "$@" — prints the value following --flag, or empty.
  local flag="$1"; shift
  while [ $# -gt 0 ]; do
    if [ "$1" = "$flag" ]; then
      echo "${2:-}"
      return 0
    fi
    shift
  done
}

stage_packages() {
  log "Updating apt and installing base packages"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y --no-install-recommends \
    curl ca-certificates gnupg rsync ufw nginx unattended-upgrades apt-listchanges

  if ! command -v node >/dev/null 2>&1 || [ "$(node -v | sed 's/^v//' | cut -d. -f1)" != "$NODE_MAJOR" ]; then
    log "Installing Node.js ${NODE_MAJOR}.x (NodeSource apt repo, GPG-verified)"
    # Deliberately NOT NodeSource's setup_*.x script (curl | bash, executes an
    # arbitrary remote script as root). Instead we add their apt repo directly:
    # the key is fetched once, and apt then verifies every package's signature
    # against it on every install/upgrade — an ongoing check, not a one-time
    # trust decision. A frozen checksum-pinned tarball was considered instead,
    # but that pins one exact patch build and needs a manual script edit for
    # every future security release; tracking NODE_MAJOR via the signed apt
    # repo gets patch updates through normal unattended-upgrades instead.
    install -d -m 755 /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
      | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    chmod 644 /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
      > /etc/apt/sources.list.d/nodesource.list
    apt-get update -y
    apt-get install -y nodejs
  else
    log "Node.js ${NODE_MAJOR}.x already installed ($(node -v))"
  fi
}

stage_swap() {
  log "Ensuring 2GB swapfile"
  if swapon --show=NAME --noheadings | grep -q '^/swapfile$'; then
    log "swap already active, skipping"
    return
  fi
  if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  # Small VPS: prefer keeping the app in RAM, swap only under real pressure.
  sysctl -w vm.swappiness=10 >/dev/null
  grep -q '^vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf
}

stage_users() {
  local pubkey_file
  pubkey_file="$(arg_value --nikola-pubkey "$@")"
  [ -n "$pubkey_file" ] || die "usage: users --nikola-pubkey /path/to/tepebite_vps.pub"
  [ -f "$pubkey_file" ] || die "pubkey file not found: $pubkey_file"

  log "Creating human admin user 'nikola'"
  if ! id -u nikola >/dev/null 2>&1; then
    useradd -m -s /bin/bash -G sudo nikola
  else
    usermod -a -G sudo nikola
    log "user already exists, ensured sudo group membership"
  fi

  install -d -m 700 -o nikola -g nikola /home/nikola/.ssh
  install -m 600 -o nikola -g nikola "$pubkey_file" /home/nikola/.ssh/authorized_keys

  log "nikola created with SSH key auth and sudo group membership."
  log "No password has been set — sudo will not work over SSH yet."
  log "NEXT STEP (manual, on the server, as root): run 'passwd nikola' and choose a strong password interactively."
  log "Then verify: a SEPARATE ssh session as nikola succeeds, and 'sudo -v' works, before touching root SSH access."
}

stage_deploy_user() {
  local pubkey_file
  pubkey_file="$(arg_value --deploy-pubkey "$@")"
  [ -n "$pubkey_file" ] || die "usage: deploy-user --deploy-pubkey /path/to/tepebite_github_actions.pub"
  [ -f "$pubkey_file" ] || die "pubkey file not found: $pubkey_file"

  log "Creating automation user 'deploy'"
  if ! id -u deploy >/dev/null 2>&1; then
    useradd -m -s /bin/bash deploy
  else
    log "user already exists"
  fi

  # Locked/disabled password — SSH key auth only. `passwd -l` prefixes the
  # shadow hash with '!' so password login is refused regardless of the
  # global sshd PasswordAuthentication setting.
  passwd -l deploy >/dev/null

  install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
  install -m 600 -o deploy -g deploy "$pubkey_file" /home/deploy/.ssh/authorized_keys

  log "Creating /srv/tepebite layout"
  install -d -m 750 -o deploy -g deploy "$APP_DIR" "$RELEASES_DIR" "$INCOMING_DIR"

  log "deploy user ready: locked password, key-only SSH, no sudo group membership."
}

stage_sudoers() {
  log "Installing activate-release.sh + restricted sudoers rule for 'deploy'"
  [ -f "$REPO_ROOT/scripts/activate-release.sh" ] || die "scripts/activate-release.sh not found next to this script"

  install -m 755 -o root -g root "$REPO_ROOT/scripts/activate-release.sh" "$ACTIVATE_SCRIPT_DST"

  local sudoers_file=/etc/sudoers.d/tepebite-deploy
  local rule="deploy ALL=(root) NOPASSWD: $ACTIVATE_SCRIPT_DST"
  echo "$rule" > "${sudoers_file}.tmp"
  chmod 440 "${sudoers_file}.tmp"
  visudo -cf "${sudoers_file}.tmp" || { rm -f "${sudoers_file}.tmp"; die "generated sudoers rule failed validation"; }
  mv "${sudoers_file}.tmp" "$sudoers_file"

  log "deploy may now run exactly: sudo $ACTIVATE_SCRIPT_DST <release-version> — nothing else."
}

stage_firewall() {
  log "Configuring UFW (SSH, HTTP, HTTPS only)"
  ufw allow OpenSSH
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
  ufw status verbose
}

stage_systemd() {
  log "Installing systemd units"
  install -m 644 "$REPO_ROOT/infra/systemd/tepebite.service" /etc/systemd/system/tepebite.service
  install -m 644 "$REPO_ROOT/infra/systemd/tepebite-watchdog.service" /etc/systemd/system/tepebite-watchdog.service
  install -m 644 "$REPO_ROOT/infra/systemd/tepebite-watchdog.timer" /etc/systemd/system/tepebite-watchdog.timer
  systemctl daemon-reload
  systemctl enable tepebite.service
  systemctl enable --now tepebite-watchdog.timer
  log "tepebite.service enabled (will start once a release is activated)."
  log "tepebite-watchdog.timer enabled and started."
}

stage_nginx() {
  log "Installing Nginx site config"
  install -m 644 "$REPO_ROOT/infra/nginx/tepebite.conf" /etc/nginx/sites-available/tepebite.conf
  ln -sf /etc/nginx/sites-available/tepebite.conf /etc/nginx/sites-enabled/tepebite.conf
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl reload nginx
}

stage_journald() {
  log "Capping journald disk usage"
  install -d -m 755 /etc/systemd/journald.conf.d
  cat > /etc/systemd/journald.conf.d/tepebite.conf <<'EOF'
[Journal]
SystemMaxUse=200M
SystemMaxFileSize=50M
EOF
  systemctl restart systemd-journald
}

stage_unattended_upgrades() {
  log "Enabling unattended security updates (no automatic reboot)"
  cat > /etc/apt/apt.conf.d/51tepebite-unattended-upgrades <<'EOF'
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
EOF
  cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF
  systemctl enable --now unattended-upgrades
}

stage_env_template() {
  log "Seeding /etc/tepebite.env placeholder (will NOT overwrite an existing file)"
  if [ -f "$ENV_FILE" ]; then
    log "$ENV_FILE already exists — leaving it untouched."
    return
  fi
  install -m 640 -o root -g deploy "$REPO_ROOT/.env.production.example" "$ENV_FILE"
  log "Created $ENV_FILE from .env.production.example — fill in real values before starting tepebite.service."
}

stage_ssh_harden() {
  [ "${CONFIRM_SSH_HARDEN:-}" = "yes" ] || die \
    "refusing to run: this disables root SSH login and password auth. Only run after nikola SSH+sudo and deploy SSH are verified working, and only with explicit approval. Re-run as: CONFIRM_SSH_HARDEN=yes $0 ssh-harden"

  log "Hardening sshd_config (root login off, password auth off)"
  install -d -m 755 /etc/ssh/sshd_config.d
  cat > /etc/ssh/sshd_config.d/99-tepebite-hardening.conf <<'EOF'
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
EOF
  sshd -t
  systemctl reload ssh
  log "SSH hardened. Root and password login are now disabled."
}

usage() {
  cat <<EOF
Usage: $0 <stage> [options]

Stages (run one at a time, in this order):
  packages              apt packages + Node ${NODE_MAJOR}.x
  swap                  2GB swapfile
  users --nikola-pubkey <file>       create human admin 'nikola'
  deploy-user --deploy-pubkey <file> create automation user 'deploy' + /srv/tepebite
  sudoers                install activate-release.sh + scoped sudo rule
  firewall               UFW: SSH, HTTP, HTTPS only
  systemd                 install/enable tepebite + watchdog units
  nginx                   install Nginx site config
  journald                cap journal disk usage
  unattended-upgrades      security-only auto updates, no auto-reboot
  env-template             seed /etc/tepebite.env placeholder (won't overwrite)

  ssh-harden              (manual approval only, see script) disable root/password SSH
EOF
}

require_root
case "${1:-}" in
  packages) shift; stage_packages "$@" ;;
  swap) shift; stage_swap "$@" ;;
  users) shift; stage_users "$@" ;;
  deploy-user) shift; stage_deploy_user "$@" ;;
  sudoers) shift; stage_sudoers "$@" ;;
  firewall) shift; stage_firewall "$@" ;;
  systemd) shift; stage_systemd "$@" ;;
  nginx) shift; stage_nginx "$@" ;;
  journald) shift; stage_journald "$@" ;;
  unattended-upgrades) shift; stage_unattended_upgrades "$@" ;;
  env-template) shift; stage_env_template "$@" ;;
  ssh-harden) shift; stage_ssh_harden "$@" ;;
  *) usage; exit 1 ;;
esac
