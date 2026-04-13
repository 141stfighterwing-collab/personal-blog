# 🚢 Deployment

> Complete deployment guide for Sentinel Nexus covering Docker, Vercel, self-hosting, environment configuration, SSL/HTTPS setup, and performance optimization.

---

## Table of Contents

- [Deployment Overview](#deployment-overview)
- [Docker Deployment](#docker-deployment)
- [Vercel Deployment](#vercel-deployment)
- [Self-Hosting Options](#self-hosting-options)
- [Environment Variables](#environment-variables)
- [SSL / HTTPS Setup](#ssl--https-setup)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Deployment Overview

Sentinel Nexus is a statically-generated site, which means the **build output is just HTML, CSS, and JavaScript files**. This makes deployment exceptionally simple — you just need a web server that can serve static files.

### Deployment Options Comparison

| Method | Difficulty | Cost | Performance | Best For |
|--------|-----------|------|-------------|----------|
| **Vercel** | ⭐ Easy | Free tier available | Excellent (global edge) | Quick setup, automatic deploys |
| **Docker** | ⭐⭐ Medium | VPS cost ($5-20/mo) | Very good | Full control, custom server |
| **Nginx (self-host)** | ⭐⭐ Medium | VPS cost ($5-20/mo) | Very good | Lightweight, maximum control |
| **Netlify** | ⭐ Easy | Free tier available | Excellent (global CDN) | Alternative to Vercel |
| **GitHub Pages** | ⭐ Easy | Free | Good | Open-source, no custom domain SSL |
| **AWS S3 + CloudFront** | ⭐⭐⭐ Hard | Pay-per-use | Excellent | Enterprise scale, existing AWS |

---

## Docker Deployment

### Dockerfile

Sentinel Nexus uses a **multi-stage build** to minimize the final image size:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production (serve static files)
FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Enable Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        application/json
        application/javascript
        image/svg+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback for Next.js pages
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # Custom 404 page
    error_page 404 /404.html;
}
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  sentinel-nexus:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
    labels:
      - "com.sentinel-nexus.description=Personal Blog Platform"
      - "com.sentinel-nexus.version=1.0.0"
```

### Quick Docker Commands

```bash
# Build the image
docker build -t sentinel-nexus:latest .

# Run the container
docker run -d -p 3000:80 --name blog sentinel-nexus:latest

# Build and run with Docker Compose
docker compose up -d --build

# View logs
docker compose logs -f sentinel-nexus

# Stop the container
docker compose down

# Rebuild without cache
docker compose build --no-cache && docker compose up -d
```

### Docker Health Checks

```dockerfile
# Add to your Dockerfile (runner stage)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
```

---

## Vercel Deployment

### Step-by-Step Setup

1. **Connect Repository**

   Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository:
   ```
   https://github.com/141stfighterwing-collab/personal-blog
   ```

2. **Configure Project**

   Vercel auto-detects Next.js. Verify the settings:

   | Setting | Value |
   |---------|-------|
   | Framework Preset | Next.js |
   | Build Command | `npm run build` |
   | Output Directory | `.next` |
   | Install Command | `npm ci` |
   | Node.js Version | 20.x |

3. **Set Environment Variables**

   In the Vercel dashboard, navigate to **Settings → Environment Variables**:

   | Variable | Production | Preview | Development |
   |----------|-----------|---------|-------------|
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | `https://preview.vercel.app` | `http://localhost:3000` |
   | `NEXT_PUBLIC_SITE_TITLE` | `Sentinel Nexus` | `Sentinel Nexus (Preview)` | `Sentinel Nexus (Dev)` |

4. **Deploy**

   Click **Deploy**. Vercel will build and deploy automatically. Each push to `main` triggers a new production deployment.

### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Vercel CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Link to existing project
vercel link

# Pull environment variables
vercel env pull .env.local
```

---

## Self-Hosting Options

### Nginx on a VPS

After building the static output:

```bash
# Build the site
npm run build

# Copy output to Nginx
sudo cp -r out/* /var/www/sentinel-nexus/
sudo chown -R www-data:www-data /var/www/sentinel-nexus
```

Nginx site configuration:

```nginx
# /etc/nginx/sites-available/sentinel-nexus
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/sentinel-nexus;
    index index.html;

    # Enable Brotli (if module installed)
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css application/json application/javascript image/svg+xml;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # HTML files - no cache (always serve latest)
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    location / {
        try_files $uri $uri.html $uri/ =404;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/sentinel-nexus /etc/nginx/sites-enabled/
sudo nginx -t          # Test configuration
sudo systemctl reload nginx
```

### Caddy (Automatic HTTPS)

```Caddyfile
# Caddyfile
yourdomain.com {
    root * /var/www/sentinel-nexus
    file_server

    # Automatic HTTPS with Let's Encrypt
    # No additional SSL configuration needed!

    encode gzip zstd

    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        -Server
    }
}
```

---

## Environment Variables

### Complete Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL of the deployed site | `http://localhost:3000` | Yes |
| `NEXT_PUBLIC_SITE_TITLE` | Site name displayed in header and meta | `Sentinel Nexus` | No |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Default meta description | — | No |
| `NEXT_PUBLIC_AUTHOR_NAME` | Author name for RSS feed and meta | `Sentinel` | No |
| `NEXT_PUBLIC_AUTHOR_EMAIL` | Author email for RSS feed | — | No |
| `NEXT_PUBLIC_ANALYTICS_ID` | Google Analytics / Umami / Plausible ID | — | No |
| `NEXT_PUBLIC_SEARCH_ENABLED` | Enable client-side search | `true` | No |
| `NEXT_PUBLIC_THEME` | Default color theme (`light`/`dark`/`system`) | `system` | No |
| `NEXT_PUBLIC_POSTS_PER_PAGE` | Number of posts per page | `10` | No |
| `NEXT_PUBLIC_RSS_ENABLED` | Enable RSS feed generation | `true` | No |

### Environment File Priority

```
.env.production.local    # Highest priority (production only, git-ignored)
.env.local               # Local overrides (all environments, git-ignored)
.env.production          # Production defaults (committed)
.env.development         # Development defaults (committed)
.env                     # Shared defaults (committed)
```

---

## SSL / HTTPS Setup

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate (Nginx plugin)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Certbot auto-renews via systemd timer (verify)
sudo systemctl status certbot.timer
```

### Cloudflare SSL

1. Set DNS records to point to your server via Cloudflare proxy (orange cloud)
2. Set SSL mode to **Full (Strict)** in Cloudflare dashboard
3. Cloudflare handles certificate renewal automatically
4. Enable **Always Use HTTPS** and **Auto Minify** in Cloudflare rules

### SSL Best Practices

- Use **TLS 1.2+** minimum (TLS 1.3 preferred)
- Disable SSLv2, SSLv3, TLS 1.0, TLS 1.1
- Use strong cipher suites (ECDHE, AES-256, CHACHA20)
- Enable HSTS (HTTP Strict Transport Security):
  ```nginx
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  ```
- Submit your domain to [hstspreload.org](https://hstspreload.org)

---

## Performance Optimization

### Build-Time Optimizations

```bash
# Analyze bundle size
ANALYZE=true npm run build

# Enable SWC minification (default in Next.js 13+)
# Already configured in next.config.js:
module.exports = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
```

### Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96],
  },
};
```

### CDN Configuration

| Header | Value | Purpose |
|--------|-------|---------|
| `Cache-Control: public, max-age=31536000, immutable` | Static assets (JS, CSS, images) | Long-term browser caching |
| `Cache-Control: no-cache` | HTML pages | Always serve fresh content |
| `Vary: Accept-Encoding` | All responses | Serve correct compressed version |
| `ETag` | Auto-generated | Conditional requests |

### Performance Budget

| Metric | Budget | Enforced By |
|--------|--------|-------------|
| Total JS bundle (per page) | < 100 KB gzipped | Bundle analyzer |
| LCP | < 2.5 seconds | Lighthouse CI |
| CLS | < 0.1 | Lighthouse CI |
| FID | < 100 ms | Lighthouse CI |
| Total page weight | < 500 KB | Build script |

---

## Monitoring and Maintenance

### Health Check Endpoint

```bash
# Basic health check
curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/
# Expected: 200

# Check SSL certificate expiry
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Recommended Monitoring Tools

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| [UptimeRobot](https://uptimerobot.com) | Uptime monitoring + alerts | 50 monitors |
| [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) | Automated performance audits | Yes |
| [Sentry](https://sentry.io) | Error tracking | 5K errors/month |
| [Plausible](https://plausible.io) | Privacy-friendly analytics | No (self-host free) |
| [Umami](https://umami.is) | Self-hosted analytics | Yes |

### Deployment Checklist

- [ ] Build completes without errors
- [ ] All tests pass (`npm run test:all`)
- [ ] Environment variables are set correctly
- [ ] SSL certificate is valid and auto-renewing
- [ ] Security headers are present (test at [securityheaders.com](https://securityheaders.com))
- [ ] Lighthouse score > 90 for all categories
- [ ] RSS feed is accessible and valid
- [ ] Sitemap is submitted to Google Search Console
- [ ] Monitoring alerts are configured
- [ ] Backup process is in place

---

*For architecture details, see [[Architecture]]. For testing, see [[Testing]]. For API reference, see [[API-Reference]].*
