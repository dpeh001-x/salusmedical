# Main — Salus Medical Website

The primary marketing and service site for **Salus Medical**, a Singapore-based healthcare provider. Hosts service pages, the contact form, the health chatbot, and serves API routes used by the two static sub-apps.

> **Looking for the bigger picture?** See the [top-level README](../README.md) for the full monorepo layout and how this app fits with the Dermatology and Sexual Health static apps.

## Services / routes

| Discipline | Route | Description |
|---|---|---|
| Child (Paediatrics) | `/child` | Home vaccination and growth review |
| General Health (Primary Care) | `/health` | Holistic primary care, screenings, telemedicine |
| Sexual Wellness (Intimate Health) | `/sexual-wellness` | Confidential, evidence-based sexual health consultations |
| Legacy (Longevity) | `/legacy` | LPA, AMD, ACP, and will writing (external link) |
| Skin (Dermatology) | `/skin` | Evidence-based skincare overview, links to `/skin/explorer` |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4 with HSL CSS variable theming
- **Language**: TypeScript
- **Theme**: Dark navy (#0B1A33) / Gold (#C9A84C) healthcare palette

## Getting started

### Prerequisites

- Node.js 20.x recommended (works on 18+)
- npm

### Install + dev

```bash
npm install
cp .env.example .env.local           # then fill in ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

> **Heads up — Windows/exFAT**: if your project lives on an exFAT-formatted drive, `npm run build` will fail with `EISDIR: illegal operation on a directory, readlink ...`. See the [top-level README](../README.md#local-quirks) for the fs-patch workaround, or move the project to an NTFS drive.

## Environment variables

Create `.env.local` (it's gitignored). See `.env.example` for the schema.

| Var | Used by | Required for |
|---|---|---|
| `ANTHROPIC_API_KEY` | `/api/skin-analyse`, `/api/skin-analyser`, `/api/health-chat` | AI features (skin analyser, health chat) |

The site renders fine without the key — only the AI-backed endpoints will return fallback responses.

## API routes

| Endpoint | Purpose | Consumer |
|---|---|---|
| `/api/skin-analyse` | Multimodal Anthropic call for FaceDerm Explorer | Dermatology Explorer (static) |
| `/api/skin-analyser` | Older single-prompt Anthropic call | (legacy, kept for reference) |
| `/api/health-chat` | Anthropic-backed health chatbot | `/health/dashboard` page |

Because all three apps are served on the same origin behind the Lightsail nginx proxy, the static sub-apps can call these endpoints directly with no CORS setup.

## Project structure

```
src/
  app/
    page.tsx                # Homepage (horizontal panel layout)
    layout.tsx              # Root layout (Header, Footer, SEO metadata)
    globals.css             # Tailwind base + CSS variables
    sitemap.ts              # Dynamic sitemap
    robots.ts               # Robots.txt
    api/
      skin-analyse/         # AI skin analyser (multimodal)
      skin-analyser/        # Older AI skin analyser
      health-chat/          # Health chatbot
    sexual-wellness/        # Service page (links out to /sexual-wellness/interactive)
    skin/                   # Service page (links out to /skin/explorer)
    health/                 # Service page + dashboard
    terms/                  # Terms of service
  components/
    Header.tsx              # Fixed nav, logo, mobile menu
    Hero.tsx                # Full-viewport hero
    Services.tsx            # 5 service cards
    CustomFormElements.tsx  # Reusable navy/gold dropdown, date picker, number input
    ...
public/
  images/                   # Logos, banner
scripts/
  setup-server.sh           # One-shot Ubuntu/Lightsail provisioning
```

## Deployment

Production deploys go to AWS Lightsail. See [`../docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md) for full instructions.

Quick reference:
```bash
# From the Main/ directory:
scp -i ~/.ssh/lightsail_default.pem -r src public package.json next.config.mjs tailwind.config.ts tsconfig.json postcss.config.mjs \
  ubuntu@13.213.143.89:/var/www/salusmedical/

ssh -i ~/.ssh/lightsail_default.pem ubuntu@13.213.143.89 \
  "cd /var/www/salusmedical && npm install && npm run build && pm2 restart salusmedical --update-env"
```

## SEO

- Open Graph + Twitter Card metadata
- JSON-LD structured data (MedicalBusiness + WebSite schemas)
- Dynamic sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`

## License

Proprietary. All rights reserved by Salus Medical Pte Ltd.
