# Salus Medical — Monorepo

This repository contains **three independent Next.js applications** that together make up the Salus Medical web presence. They are deployed behind a single nginx reverse proxy on AWS Lightsail and share the domain `salusmedical.co`.

```
Salusmedical Main Website/
├── Main/                              → Main marketing site (Next.js 14)
├── Dermatology/facederm-explorer/     → AI Skin Analyser (Next.js 16, static)
└── Sexual Health/sexual-health-guide/ → Sexual Health Guide (Next.js 16, static)
```

## Production routes

| Route | App | Type |
|---|---|---|
| `/` | Main | SSR (Node, port 3000) |
| `/skin`, `/health`, `/sexual-wellness`, etc. | Main | SSR |
| `/api/*` | Main | API routes (used by static apps too) |
| `/skin/explorer/` | Dermatology | Static export |
| `/sexual-wellness/interactive/` | Sexual Health | Static export |

The two static apps call the Main app's `/api/skin-analyse` endpoint for AI features — no separate Node processes needed for them.

## Prerequisites

- **Node.js 20.x** (the two new apps use Next 16, which requires ≥18.18 — Node 20 is recommended)
- **npm** 10+
- **Git**
- An **Anthropic API key** (for AI skin analyser & health chat features)

> **Windows + exFAT note**: Next.js's webpack resolver calls `readlinkSync` on every file. On exFAT drives this throws `EISDIR` and breaks the build. If your project is on an exFAT drive, see [Local quirks](#local-quirks) below. Move the project to an NTFS drive (typically `C:`) for the easiest experience.

## First-time setup

Each app is independent. Install + build each one separately.

### 1. Main app (`Main/`)

```bash
cd Main
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev                  # → http://localhost:3000
```

Required `.env.local` keys:
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Dermatology Explorer (`Dermatology/facederm-explorer/`)

```bash
cd "Dermatology/facederm-explorer"
npm install
npm run dev                  # → http://localhost:3000
```

> When developing standalone, the AI analyser will fail unless an API server is running. To test the full flow, run the Main app on port 3000 in a separate terminal — the static frontend calls `/api/skin-analyse` on the same origin.

For local-only API testing, you can temporarily change `next.config.ts` to remove `basePath` and `output: "export"`, and add an `.env.local` with `ANTHROPIC_API_KEY` so the bundled `/api/analyse` route works.

### 3. Sexual Health Guide (`Sexual Health/sexual-health-guide/`)

```bash
cd "Sexual Health/sexual-health-guide"
npm install
npm run dev                  # → http://localhost:3000
```

Pure frontend — no API key required.

## Common dev workflow

When you're working on **one** app, just `cd` into it and run `npm run dev`. Each app runs on its own port 3000 by default — only run one dev server at a time, or override the port with `npm run dev -- -p 3001`.

When you're working on a **cross-app feature** (e.g. the Dermatology Explorer's analyser button calling Main's API), you need both running:

```bash
# Terminal 1
cd Main && npm run dev          # port 3000

# Terminal 2 — override port
cd "Dermatology/facederm-explorer" && npm run dev -- -p 3001
```

Then update the fetch URL in the Dermatology app to `http://localhost:3000/api/skin-analyse` for local testing (revert before commit).

## Production builds

Each app builds independently:

```bash
# Main (server-rendered)
cd Main && npm run build && npm start

# Dermatology (static export → out/)
cd "Dermatology/facederm-explorer" && npm run build

# Sexual Health (static export → out/)
cd "Sexual Health/sexual-health-guide" && npm run build
```

The two static apps produce an `out/` directory which is the entire deployable artifact.

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full server architecture, nginx config, and deploy commands.

Quick reference:
- **Server**: AWS Lightsail Ubuntu, IP `13.213.143.89`
- **SSH**: `ssh -i ~/.ssh/lightsail_default.pem ubuntu@13.213.143.89`
- **Main app**: `/var/www/salusmedical` (managed by PM2)
- **Static apps**: `/var/www/static/skin-explorer`, `/var/www/static/sexual-wellness-interactive`
- **Nginx**: `/etc/nginx/sites-enabled/salusmedical`

## Local quirks

### exFAT drive: `EISDIR: illegal operation on a directory, readlink`

If your project lives on an exFAT-formatted drive (USB sticks, some external SSDs, sometimes `D:`/`E:` on Windows), the Main app build will fail. Reason: webpack calls `fs.readlinkSync` on every regular file expecting `EINVAL` if it's not a symlink, but exFAT throws `EISDIR`.

Two options:

**A. Move the project to an NTFS drive (recommended)** — typically `C:\`. Check with PowerShell:
```powershell
Get-Volume -DriveLetter E | Select-Object FileSystemType
```

**B. Use the fs-patch shim** for builds. Save this to a path **without spaces** (e.g. `C:\temp\fs-patch.js`):

```js
// C:\temp\fs-patch.js
const fs = require('fs');
const origSync = fs.readlinkSync, origAsync = fs.readlink, origPromise = fs.promises.readlink.bind(fs.promises);
const makeEINVAL = p => Object.assign(new Error(`EINVAL: invalid argument, readlink '${p}'`),
  { code: 'EINVAL', errno: -22, syscall: 'readlink', path: String(p) });

fs.readlinkSync = (p, o) => { try { return origSync.call(fs, p, o); } catch (e) { if (e.code === 'EISDIR') throw makeEINVAL(p); throw e; } };
fs.readlink = (p, o, cb) => { if (typeof o === 'function') { cb = o; o = undefined; } origAsync.call(fs, p, o, (e, r) => e?.code === 'EISDIR' ? cb(makeEINVAL(p)) : cb(e, r)); };
fs.promises.readlink = async (p, o) => { try { return await origPromise(p, o); } catch (e) { if (e.code === 'EISDIR') throw makeEINVAL(p); throw e; } };
```

Then build with:
```bash
NODE_OPTIONS="--require C:\\temp\\fs-patch.js" npm run build
```

(Static-export builds for the two sub-apps run cleanly on exFAT — only the Main app's full SSR build trips this.)

### Spaces in the project path

The folder name `Salusmedical Main Website` contains spaces, which breaks Node's `NODE_OPTIONS` parser. Always pass paths to `--require` from a directory **without** spaces (the example above uses `C:\temp`).

### Node version drift

- `Main/` was originally written for Next 14 / Node 18. It still builds on Node 20.
- `Dermatology/` and `Sexual Health/` use Next 16 + React 19. **Node 20+ required.**

If you have `nvm`, switch with:
```bash
nvm use 20
```

## Repository layout reference

```
.
├── Main/
│   ├── src/app/                    # Next.js App Router pages
│   │   ├── api/                    # Server API routes (Anthropic-backed)
│   │   ├── skin/, health/, ...     # Service pages
│   │   └── page.tsx                # Homepage
│   ├── src/components/             # Shared React components
│   ├── public/images/              # Logos, banner, etc.
│   └── scripts/setup-server.sh     # One-shot Lightsail provision script
│
├── Dermatology/facederm-explorer/
│   ├── src/app/                    # Single-page Next.js app
│   │   ├── components/             # Analyser, Routines, Treatments, Atlas
│   │   └── page.tsx                # Tab container
│   ├── public/images/              # Logo (synced from Main)
│   └── next.config.ts              # basePath: "/skin/explorer", output: "export"
│
└── Sexual Health/sexual-health-guide/
    ├── app/                        # Next.js app (note: not under src/)
    ├── components/                 # Male tabs, Female tabs, Quiz, etc.
    ├── data/                       # Conditions, contraceptives, PE stats
    ├── public/images/              # Logo (synced from Main)
    └── next.config.ts              # basePath: "/sexual-wellness/interactive", output: "export"
```

## Need help?

- Server access / deployment issues → see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- API keys / env vars → contact the project owner
- For an end-to-end deploy walkthrough → see [`docs/DEPLOYMENT.md#deploying-changes`](docs/DEPLOYMENT.md#deploying-changes)
