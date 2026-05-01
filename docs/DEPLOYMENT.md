# Deployment Guide

How the three apps are deployed and how to push updates.

## Server overview

| | |
|---|---|
| **Provider** | AWS Lightsail (Singapore, ap-southeast-1) |
| **Instance** | Ubuntu, ~416MB RAM (Nano) |
| **Public IP** | `13.213.143.89` |
| **Domain** | `salusmedical.co`, `www.salusmedical.co` |
| **SSH user** | `ubuntu` |
| **SSH key** | `~/.ssh/lightsail_default.pem` |

```bash
ssh -i ~/.ssh/lightsail_default.pem ubuntu@13.213.143.89
```

## Architecture

```
                         ┌─────────────────────────────┐
Internet → :80 nginx ─┬─►│ /                           │ proxy_pass → 127.0.0.1:3000  (Main app, PM2)
                      ├─►│ /skin/explorer/             │ alias → /var/www/static/skin-explorer/
                      ├─►│ /sexual-wellness/interactive│ alias → /var/www/static/sexual-wellness-interactive/
                      └─►│ /api/*                      │ proxy_pass → 127.0.0.1:3000  (handled by Main)
                         └─────────────────────────────┘
```

- **One Node process** (Main app) running under PM2, listening on `127.0.0.1:3000`.
- **Two static sites** served as flat files by nginx — zero memory cost.
- The Dermatology Explorer's AI analyser button calls `/api/skin-analyse` on the Main app (same origin, so no CORS).

## Server file layout

```
/var/www/salusmedical/                          # Main app source + .next build
├── src/, public/, package.json, ...
├── .env.local                                  # ANTHROPIC_API_KEY (do NOT commit)
└── .next/                                      # Build output

/var/www/static/skin-explorer/                  # Dermatology static export
├── index.html
├── _next/
└── images/

/var/www/static/sexual-wellness-interactive/    # Sexual Health static export
├── index.html
├── _next/
└── images/

/etc/nginx/sites-enabled/salusmedical           # nginx config
```

## Nginx configuration

Located at `/etc/nginx/sites-enabled/salusmedical`:

```nginx
server {
    listen 80;
    server_name salusmedical.co www.salusmedical.co _;

    # Dermatology Explorer — static files at /skin/explorer
    location /skin/explorer/_next/ {
        alias /var/www/static/skin-explorer/_next/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    location /skin/explorer {
        alias /var/www/static/skin-explorer;
        index index.html;
        try_files $uri $uri/ $uri.html /skin/explorer/index.html;
    }

    # Sexual Wellness Interactive — static files at /sexual-wellness/interactive
    location /sexual-wellness/interactive/_next/ {
        alias /var/www/static/sexual-wellness-interactive/_next/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    location /sexual-wellness/interactive {
        alias /var/www/static/sexual-wellness-interactive;
        index index.html;
        try_files $uri $uri/ $uri.html /sexual-wellness/interactive/index.html;
    }

    # Main app — proxy everything else to Next.js on port 3000
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reload after edits:
```bash
sudo nginx -t && sudo nginx -s reload
```

## PM2

The Main app is managed by PM2:

```bash
pm2 list                          # show processes
pm2 logs salusmedical             # tail logs
pm2 restart salusmedical          # restart after env change use --update-env
pm2 monit                         # interactive monitor
pm2 save                          # persist process list across reboots
```

## Deploying changes

### Main app (`Main/`)

The Main app is server-built directly on the Lightsail instance. **Note**: builds run cleanly on Linux — the exFAT `EISDIR` issue is local-only.

```bash
# 1. From your local machine, sync the source
scp -i ~/.ssh/lightsail_default.pem -r \
  Main/src \
  ubuntu@13.213.143.89:/var/www/salusmedical/

scp -i ~/.ssh/lightsail_default.pem \
  Main/package.json Main/next.config.mjs Main/tailwind.config.ts \
  Main/tsconfig.json Main/postcss.config.mjs \
  ubuntu@13.213.143.89:/var/www/salusmedical/

scp -i ~/.ssh/lightsail_default.pem -r \
  Main/public \
  ubuntu@13.213.143.89:/var/www/salusmedical/

# 2. Build + restart on the server
ssh -i ~/.ssh/lightsail_default.pem ubuntu@13.213.143.89 \
  "cd /var/www/salusmedical && npm install && npm run build && pm2 restart salusmedical --update-env"
```

### Dermatology Explorer (static)

Built locally, then uploaded as static files:

```bash
# 1. Build locally
cd "Dermatology/facederm-explorer"
npm run build                      # outputs to ./out/

# 2. Upload to server (clear-then-replace)
ssh -i ~/.ssh/lightsail_default.pem ubuntu@13.213.143.89 \
  "rm -rf /var/www/static/skin-explorer/*"

scp -i ~/.ssh/lightsail_default.pem -r \
  out/. \
  ubuntu@13.213.143.89:/var/www/static/skin-explorer/
```

No service restart needed — nginx serves the files directly.

### Sexual Health Guide (static)

Same flow as Dermatology:

```bash
cd "Sexual Health/sexual-health-guide"
npm run build

ssh -i ~/.ssh/lightsail_default.pem ubuntu@13.213.143.89 \
  "rm -rf /var/www/static/sexual-wellness-interactive/*"

scp -i ~/.ssh/lightsail_default.pem -r \
  out/. \
  ubuntu@13.213.143.89:/var/www/static/sexual-wellness-interactive/
```

## Health checks

After any deploy, verify all routes:

```bash
ssh -i ~/.ssh/lightsail_default.pem ubuntu@13.213.143.89 << 'EOF'
curl -s -o /dev/null -w 'Homepage:        %{http_code}\n' http://localhost/
curl -s -o /dev/null -w 'Skin Explorer:   %{http_code}\n' http://localhost/skin/explorer/
curl -s -o /dev/null -w 'Sexual Wellness: %{http_code}\n' http://localhost/sexual-wellness/interactive/
curl -s -o /dev/null -w 'Skin (main):     %{http_code}\n' http://localhost/skin
curl -s -o /dev/null -w 'API:             %{http_code}\n' -X POST -H 'Content-Type: application/json' -d '{}' http://localhost/api/skin-analyse
pm2 status
EOF
```

All should return `200`.

## Environment variables

The Main app reads from `/var/www/salusmedical/.env.local`. After editing it, you **must** restart PM2 with `--update-env`:

```bash
ssh -i ~/.ssh/lightsail_default.pem ubuntu@13.213.143.89
nano /var/www/salusmedical/.env.local
pm2 restart salusmedical --update-env
```

Required keys:
- `ANTHROPIC_API_KEY` — used by `/api/skin-analyse`, `/api/skin-analyser`, `/api/health-chat`

## Memory budget

The instance has only 416MB RAM. Current usage:
- nginx: ~10MB
- Main app (Node/Next): ~75MB
- System: ~100MB
- Free/buffers: ~230MB

**Do not add additional Node processes** without first upgrading the instance — the kernel will OOM-kill the smallest process under load. If you need server-rendering for one of the static apps in the future, upgrade the Lightsail plan first.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `502 Bad Gateway` on `/` | Main app crashed or not running | `pm2 logs salusmedical`, then `pm2 restart salusmedical` |
| Static asset 404 inside sub-app | basePath mismatch in `next.config.ts` | Confirm `basePath` matches the nginx location, rebuild & re-upload |
| AI analyser returns generic fallback | `ANTHROPIC_API_KEY` missing or invalid | Update `.env.local`, `pm2 restart --update-env` |
| Skin Explorer fonts/images broken | Old `_next/` chunks cached | Clear `/var/www/static/skin-explorer/*` before re-upload |
| nginx config change not taking effect | Forgot to reload | `sudo nginx -t && sudo nginx -s reload` |

## Initial server provisioning

If you ever need to rebuild from scratch, the steps roughly are:

```bash
# On a fresh Ubuntu Lightsail instance:
sudo apt update && sudo apt install -y nginx nodejs npm
sudo npm install -g pm2
sudo mkdir -p /var/www/salusmedical /var/www/static/skin-explorer /var/www/static/sexual-wellness-interactive
sudo chown -R ubuntu:ubuntu /var/www
# ... then deploy each app as above
# ... and copy the nginx config from this doc into /etc/nginx/sites-enabled/salusmedical
```

The Main app's `scripts/setup-server.sh` covers most of this for the original single-app setup.
