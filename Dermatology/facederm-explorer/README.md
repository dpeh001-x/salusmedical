# FaceDerm Explorer

An educational AI-assisted skin guide for Salus Medical patients. Standalone Next.js 16 app, deployed as a **static export** under the path `/skin/explorer/` on the main site.

> **Looking for the bigger picture?** See the [top-level README](../../README.md) for the full monorepo layout.

## What's inside

Four tabs:
- **AI Analyser** — questionnaire + optional photo → AI dermatologist-style report (powered by Anthropic Claude)
- **Routines** — evidence-based AM/PM routines for different skin types and ethnicities
- **Treatments** — aesthetic medicine treatments organised by invasiveness
- **Conditions** — atlas of common facial skin conditions

## Tech stack

- **Next.js 16.2** (App Router, Turbopack, **breaking changes from Next 14/15**)
- **React 19**
- **Tailwind CSS 4**
- **Static export** — produces a flat `out/` directory, served by nginx in production

## Prerequisites

- **Node.js 20.x** (Next 16 requires ≥18.18)
- npm

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000/skin/explorer](http://localhost:3000/skin/explorer) (note the basePath).

> When developing locally and you want the AI analyser to actually work end-to-end, you have two options:
>
> 1. **Run the Main app on port 3000** in a separate terminal, then run this app on a different port (`npm run dev -- -p 3001`). For full-stack testing, temporarily change the fetch URL in `src/app/components/analyser/Analyser.tsx` to `http://localhost:3000/api/skin-analyse` (revert before commit).
>
> 2. **Standalone with the bundled API route** — temporarily edit `next.config.ts` to remove `basePath` and `output: "export"`, change the analyser fetch to `/api/analyse`, and add an `.env.local` with `ANTHROPIC_API_KEY`. The bundled `src/app/api/analyse/route.ts` will then work locally.

## Production behaviour

In production, the analyser button calls **the Main app's `/api/skin-analyse` endpoint** (same origin, behind nginx). The bundled `src/app/api/analyse/route.ts` is **not deployed** — it exists only for local standalone testing.

## Build (static export)

```bash
npm run build
```

Outputs `./out/` — the entire deployable artifact. All asset paths are prefixed with `/skin/explorer` (configured in `next.config.ts`).

## Deploy

See [`../../docs/DEPLOYMENT.md`](../../docs/DEPLOYMENT.md) for the canonical guide.

Quick reference:
```bash
npm run build
ssh -i ~/.ssh/lightsail_default.pem ubuntu@13.213.143.89 "rm -rf /var/www/static/skin-explorer/*"
scp -i ~/.ssh/lightsail_default.pem -r out/. ubuntu@13.213.143.89:/var/www/static/skin-explorer/
```

No service restart needed — nginx serves the static files directly.

## Configuration

`next.config.ts`:
```ts
const nextConfig: NextConfig = {
  basePath: "/skin/explorer",
  output: "export",
};
```

If you change `basePath`, you must also update the matching nginx `location` block on the server — see [`../../docs/DEPLOYMENT.md`](../../docs/DEPLOYMENT.md).

## Project structure

```
src/app/
├── api/analyse/                # Standalone-mode API route (NOT used in prod)
├── components/
│   ├── analyser/               # AI Analyser tab + sub-components
│   ├── routines/               # Routines tab
│   ├── treatments/             # Treatments tab
│   ├── atlas/                  # Conditions tab
│   └── theme.ts                # Shared colour tokens
├── globals.css
├── layout.tsx
└── page.tsx                    # Tab container

public/
└── images/
    └── Salus Medical Logo1 png.png
```

## Notes

`AGENTS.md` and `CLAUDE.md` in this directory are warnings for AI assistants that this app uses Next.js 16 with breaking changes from older versions — refer to `node_modules/next/dist/docs/` if you need API specifics.
