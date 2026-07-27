# Deployment — TEPE bite production (tepebite.eu)

Single VPS (Ubuntu 24.04, 1 CPU / 2GB RAM), no Docker, no in-VPS database, no
blue-green (RAM doesn't allow two app instances at once). Databases and file
storage are all external: Postgres via Neon, MongoDB via Atlas, files via
UploadThing.

## Architecture

```
GitHub push to main
  -> GitHub Actions (hosted runner)
       npm ci, lint, tsc, next build (standalone)
       tar the release, scp to /srv/tepebite/incoming
       ssh: sudo /usr/local/bin/activate-release.sh <version>
            -> extract to /srv/tepebite/releases/<version>
            -> atomically swap /srv/tepebite/current symlink
            -> systemctl restart tepebite.service
            -> poll /api/health, rollback + restart previous on failure
            -> prune old releases (keep last 5)
  -> Nginx (port 80) reverse-proxies to 127.0.0.1:3000
  -> systemd keeps the app alive; a 2-minute watchdog timer force-restarts
     it if /api/health stops responding even though the process is alive
```

The app is never built or `npm install`ed on the VPS — only the prebuilt
standalone output is shipped there.

## Users on the VPS

- **root** — initial access only. Stays enabled with key+password login until
  the SSH-hardening step is explicitly approved (see "SSH hardening" below).
- **nikola** — human admin. SSH key only (no password set by the bootstrap
  script — set interactively on the server), member of `sudo`.
- **deploy** — CI automation only. Password locked (`passwd -l`), SSH key
  only, no general sudo. The only privileged command it can run is:
  `sudo /usr/local/bin/activate-release.sh <version>` (enforced by
  `/etc/sudoers.d/tepebite-deploy`).

## Bootstrap (Phase 2, run manually, one stage at a time)

`scripts/bootstrap-vps.sh` is idempotent and stage-based. Run stages in this
order, verifying output after each one:

```bash
sudo bash scripts/bootstrap-vps.sh packages
sudo bash scripts/bootstrap-vps.sh swap
sudo bash scripts/bootstrap-vps.sh users --nikola-pubkey /root/tepebite_vps.pub
sudo bash scripts/bootstrap-vps.sh deploy-user --deploy-pubkey /root/tepebite_github_actions.pub
sudo bash scripts/bootstrap-vps.sh sudoers
sudo bash scripts/bootstrap-vps.sh firewall
sudo bash scripts/bootstrap-vps.sh systemd
sudo bash scripts/bootstrap-vps.sh nginx
sudo bash scripts/bootstrap-vps.sh journald
sudo bash scripts/bootstrap-vps.sh unattended-upgrades
sudo bash scripts/bootstrap-vps.sh env-template
```

After `users`: **on the server, as root**, run `passwd nikola` interactively
and choose a strong password. Then, from a separate terminal, verify:

1. `ssh nikola@<host>` succeeds with the key.
2. `sudo -v` works for nikola (will prompt for the password just set).
3. `ssh deploy@<host>` succeeds with the GitHub Actions key (deploy has no
   password — key auth only).

Only after all three are verified should SSH hardening even be discussed.

`env-template` seeds `/etc/tepebite.env` from `.env.production.example` **only
if it doesn't already exist** — it will not clobber real values. Fill in real
secrets on the server directly; they are never committed or transmitted
through this repo.

## SSH hardening (separate, explicit approval only)

`scripts/bootstrap-vps.sh ssh-harden` disables root login and password
authentication. It refuses to run unless `CONFIRM_SSH_HARDEN=yes` is set, and
no other stage calls it. Do not run it until nikola SSH+sudo and deploy SSH
are both verified working, DNS/TLS are irrelevant to this step, and you have
explicit approval.

## TLS

Not configured yet. `infra/nginx/tepebite.conf` is HTTP-only on purpose —
adding a 443 server block and running certbot is a separate future step that
requires DNS for tepebite.eu to already point at the VPS.

## Nginx: rate limiting, compression, upstream keep-alive

`infra/nginx/tepebite.conf` is the source of truth and **includes the 443
blocks**. `bootstrap-vps.sh nginx` overwrites
`/etc/nginx/sites-available/tepebite.conf` wholesale, so that file must never be
allowed to drift back to an HTTP-only version — doing so takes TLS down on the
next run of that stage.

Three problems were found and fixed here after mobile users reported slow and
occasionally failing navigation:

1. **Rate limiting applied to static assets.** `limit_req` sat at `server`
   level (`20r/s`, `burst=40`), so it covered `/_next/static/` and
   `/_next/image` as well as the app. One cold page load requests ~44 files in
   a single burst; a measured 60-request burst returned **16× 503**. Mobile
   carriers also place many subscribers behind one CGNAT address, so they share
   a single bucket. `limit_req` now lives per-location: `tepebite_dynamic`
   (30r/s, burst 60) guards the app, `tepebite_assets` (200r/s, burst 100–200)
   effectively lets content-hashed assets through. `= /api/health` is
   deliberately unthrottled so a traffic burst can never make the watchdog
   believe the app is down and force-restart it.

2. **Static JS/CSS served uncompressed.** The Next standalone server gzips only
   what it *renders* (HTML/RSC), not files under `.next/static`. Ubuntu's stock
   `nginx.conf` has `gzip on` but leaves `gzip_types` at `text/html` and
   `gzip_proxied` at `off` ("never compress a proxied response"), so every
   bundle crossed the wire raw — ~350 KB per cold load. The app server block now
   sets `gzip_proxied any` plus explicit `gzip_types`. Measured: the main CSS
   file went **44,352 → 8,317 bytes**.

3. **`Connection: "upgrade"` sent unconditionally**, which defeated keep-alive to
   Node on every request. Replaced with the standard `$connection_upgrade` map
   plus an `upstream` block with `keepalive 32`.

Note that nginx on Ubuntu 24.04 is 1.24, which predates the separate `http2 on;`
directive — keep `listen 443 ssl http2;`.

## Why there's no build-time database credential

Four public pages (`/`, `/about`, `/impact`, `/initiatives`) export
`revalidate = 300`, which looks like ISR. In practice it has no effect: the
root layout's and these pages' `generateMetadata` call `getRequestLang()`
(`src/lib/i18n/metadata.ts`), which reads `headers()`/`cookies()` — Next.js
dynamic APIs. Using either one anywhere in a route forces that route to
per-request dynamic rendering, overriding `revalidate`. Verified against a
real `npm run build`: every route in the app builds as `ƒ (Dynamic)`, not
static/ISR.

Practical consequence: `next build` never executes these pages' MongoDB
queries at all — they only run at request time, on the VPS, against the
runtime `MONGODB_URI` in `/etc/tepebite.env`. So the GitHub Actions build
step needs no database credential of any kind, and there's no
`MONGODB_BUILD_URI` secret in this workflow.

The `revalidatePath` calls added to the admin mutation routes
(`src/app/api/admin/initiatives/*`, `src/app/api/admin/partners/*`) are
harmless no-ops against fully-dynamic routes — left in place as free
insurance in case the dynamic-API dependency is ever removed and these pages
start actually prerendering.

If static ISR generation for these 4 pages is wanted later, it requires
restructuring language resolution so `generateMetadata`/layout don't call
`headers()`/`cookies()` for them — a separate, larger change, not part of
this deployment setup.

### Measured: ISR is not worth that change

Before attempting the restructure, the per-request render cost was measured on
the VPS itself (`curl` against `127.0.0.1:3000`, so no network in the numbers):

| request | warm render |
|---|---|
| RSC navigation payload for `/product`, `/impact`, `/about` | **7 ms** |
| full HTML for `/about`, `/cart`, `/initiatives`, `/legal` | 14–26 ms |
| full HTML for `/`, `/product`, `/news`, `/order` | 60–115 ms |

The public data layer is already memoised: `src/lib/public/initiatives.ts`
wraps every MongoDB query in `unstable_cache` with a 300 s TTL and a shared
`revalidateTag` tag, and the Sanity client uses the CDN in production. A
"dynamic" request therefore does **not** talk to Atlas or Sanity — it only
re-runs the React render.

So converting these routes to ISR would remove ~7 ms from a client-side
navigation, in exchange for restructuring i18n into path segments (`/[lang]/…`
with `generateStaticParams` and a proxy rewrite) so that `<html lang>` and
`generateMetadata` stop needing per-request data. That is a large refactor with
real hydration and SEO risk, for a saving that is invisible next to mobile
round-trip time. **Not recommended.** The navigation latency users actually feel
came from asset compression, the rate limiter, and the absence of any prefetch
or loading boundary — all addressed directly instead.

## Release layout on the VPS

```
/srv/tepebite/
  incoming/          uploaded .tar.gz release archives (consumed + deleted on activation)
  releases/<version>/  extracted standalone build, one dir per release
  current -> releases/<version>   atomic symlink, swapped by activate-release.sh
```

`activate-release.sh` validates its version argument against
`^[A-Za-z0-9._]{1,128}$` before using it in any path, extracts the archive,
atomically swaps the symlink (`ln -sfn` + `mv -T`), restarts
`tepebite.service`, polls `http://127.0.0.1:3000/api/health` up to 10 times
(2s apart), and rolls back to the previous release + restarts again if the
new one never becomes healthy. On success it keeps the 5 most recent release
directories and deletes older ones, then deletes the consumed archive.

## GitHub repository configuration (Phase 3 — commands only, no values entered)

Secrets (`gh secret set <name> --repo <owner>/<repo>`, values pasted
interactively or piped, never typed into chat):

- `VPS_HOST`, `VPS_PORT`, `VPS_USER` (`deploy`)
- `VPS_SSH_KEY` (private half of `~/.ssh/tepebite_github_actions`)
- `VPS_KNOWN_HOSTS` (output of `ssh-keyscan -p <port> <host>`)

Repository Variables (`gh variable set <name> --repo <owner>/<repo>`):

- `NEXT_PUBLIC_TEPE_DELIVERY_BASE_LOCKER_CENTS`
- `NEXT_PUBLIC_TEPE_DELIVERY_OFFICE_SURCHARGE_CENTS`
- `NEXT_PUBLIC_TEPE_DELIVERY_ADDRESS_SURCHARGE_CENTS`
- `NEXT_PUBLIC_TEPE_FREE_DELIVERY_THRESHOLD_CENTS`
- `NEXT_PUBLIC_WEB_ORDERS_AVAILABLE`
- `NEXT_PUBLIC_IMPACT_FORM_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

The four `NEXT_PUBLIC_*` delivery-pricing variables must have the exact same
numeric values as their non-`NEXT_PUBLIC_` counterparts in
`/etc/tepebite.env` on the VPS — `validateCheckoutConfig()` checks this at
order-creation time and will report a mismatch instead of silently drifting.

## Environment reference

See `.env.production.example` (runtime, VPS) and `.env.example` (local dev)
for the full annotated variable list.
