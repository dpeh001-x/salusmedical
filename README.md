# Salus Medical Website

Official website for **Salus Medical** — a Singapore-based healthcare provider offering comprehensive medical care across five specialised disciplines.

## Services

| Discipline | Route | Description |
|---|---|---|
| Child (Paediatrics) | `/child` | Home vaccination and growth review |
| General Health (Primary Care) | `/health` | Holistic primary care, screenings, telemedicine |
| Sexual Wellness (Intimate Health) | `/sexual-wellness` | Confidential, evidence-based sexual health consultations |
| Legacy (Longevity) | `/legacy` | LPA, AMD, ACP, and will writing |
| Skin (Dermatology) | `/skin` | Evidence-based skincare, in-clinic treatments, routines |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4 with HSL CSS variable theming
- **Language**: TypeScript
- **Fonts**: Georgia serif (display), system sans-serif (body)
- **Theme**: Dark navy (#0B1A33) / Gold (#C9A84C) healthcare palette

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    page.tsx                # Homepage
    layout.tsx              # Root layout (Header, Footer, SEO metadata)
    globals.css             # Tailwind base + CSS variables
    sitemap.ts              # Dynamic sitemap generation
    robots.ts               # Robots.txt configuration
    sexual-wellness/        # Sexual Wellness service page
    skin/                   # Skin & Dermatology service page
    terms/                  # Terms of service
  components/
    Header.tsx              # Fixed nav with logo, links, mobile menu
    Hero.tsx                # Full-viewport hero with banner image
    Services.tsx            # 5 service cards (3+2 grid)
    Mission.tsx             # Mission statement section
    Philosophy.tsx          # Philosophy quote section
    CTA.tsx                 # Call-to-action section
    Schedule.tsx            # Appointment booking form
    Contact.tsx             # General enquiry form
    Footer.tsx              # Site footer with service links
    Divider.tsx             # Gold decorative divider
    StructuredData.tsx      # JSON-LD (MedicalBusiness schema)
public/
  images/                   # Logo files + hero banner
  manifest.json             # PWA manifest
scripts/
  setup-server.sh           # Ubuntu 22.04 Lightsail server setup
```

## Deployment

Hosted on **AWS Lightsail** (Nano instance, ap-southeast-1).

- **Reverse proxy**: Nginx
- **Process manager**: PM2
- **SSL**: Certbot (Let's Encrypt)

### Deploy steps

```bash
# On the server
cd /var/www/salusmedical
git pull origin feature/initial-site
node ./node_modules/.bin/next build
pm2 restart salusmedical
```

## SEO

- Open Graph + Twitter Card metadata
- JSON-LD structured data (MedicalBusiness + WebSite schemas)
- Dynamic sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`
- Canonical URLs

## License

Proprietary. All rights reserved by Salus Medical Pte Ltd.
