# 🏠 Sentinel Nexus — Wiki Home

> **Welcome to the Sentinel Nexus documentation.**  
> A modern, blazing-fast personal blog platform built for performance, accessibility, and developer experience.

---

## 📋 Table of Contents

| Page | Description |
|------|-------------|
| [[Architecture]] | System architecture, component hierarchy, data flow, and deployment topology |
| [[Getting-Started]] | Prerequisites, installation, development workflow, and troubleshooting |
| [[Testing]] | Test framework overview, running tests, CI/CD integration, and adding new tests |
| [[Deployment]] | Docker, Vercel, self-hosting, environment variables, SSL, and performance |
| [[Contributing]] | Code of conduct, PR process, coding standards, and issue reporting |
| [[Changelog]] | Version history, feature list, known issues, and roadmap |
| [[API-Reference]] | Content API endpoints, RSS feeds, search API, and webhook integrations |

---

## 🚀 Project Overview

**Sentinel Nexus** is a static-site personal blog platform designed from the ground up for speed, security, and simplicity. It transforms Markdown content into beautifully rendered static pages using a modern build pipeline.

### Key Features

- **⚡ Lightning Fast** — Static HTML output with near-zero server-side overhead
- **♿ Accessible** — WCAG 2.1 AA compliant out of the box
- **📱 Responsive** — Mobile-first design that looks great on every screen
- **🔒 Secure** — No database, no runtime server — fewer attack surfaces
- **🔍 Searchable** — Client-side search powered by a pre-built index
- **📊 Observable** — Built-in analytics hooks and performance monitoring
- **🧪 Well Tested** — Comprehensive Playwright E2E and Jest unit test suites
- **🐳 Containerized** — Docker-first deployment with Vercel cloud option

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (Static Site Generation) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Testing | Playwright + Jest |
| Linting | ESLint + Prettier |
| Package Manager | npm |
| CI/CD | GitHub Actions |
| Deployment | Docker / Vercel |

---

## 🏗️ At a Glance

```
sentinel-nexus/
├── src/                  # Source code
│   ├── components/       # React components
│   ├── content/          # Markdown blog posts
│   ├── pages/            # Page routes
│   ├── styles/           # Global styles
│   └── utils/            # Helper functions
├── public/               # Static assets (images, fonts, etc.)
├── tests/                # Test suites
│   ├── screenshots/      # Playwright E2E tests
│   ├── iterations/       # Multi-environment test runners
│   └── results/          # Test result logs
├── docs/wiki/            # This wiki (GitHub Wiki source)
├── Dockerfile            # Container build
├── docker-compose.yml    # Local development stack
├── vercel.json           # Vercel deployment config
└── package.json          # Project manifest
```

---

## 🛠️ Quick Start

New to Sentinel Nexus? Head over to the [[Getting-Started]] guide for step-by-step installation and setup instructions. Here's the TL;DR:

```bash
# Clone the repository
git clone https://github.com/141stfighterwing-collab/personal-blog.git
cd personal-blog

# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## 📖 Documentation Navigation

### For Developers
- Start with [[Getting-Started]] to set up your local environment
- Review [[Architecture]] to understand how the system is built
- Read [[Testing]] to learn how to run and write tests
- Check [[API-Reference]] for programmatic access to content

### For DevOps / SysAdmins
- Follow [[Deployment]] for Docker, Vercel, and self-hosting guides
- Review the environment variables section in [[Deployment]]
- Check [[Testing]] for CI/CD integration details

### For Contributors
- Read [[Contributing]] for guidelines on submitting changes
- Review [[Changelog]] to see what's changed and what's planned
- Check open issues on the GitHub repository

---

## 📌 Repository Links

- **Repository:** [https://github.com/141stfighterwing-collab/personal-blog](https://github.com/141stfighterwing-collab/personal-blog)
- **Issues:** [GitHub Issues](https://github.com/141stfighterwing-collab/personal-blog/issues)
- **Pull Requests:** [GitHub Pull Requests](https://github.com/141stfighterwing-collab/personal-blog/pulls)

---

## 📜 License

Sentinel Nexus is open-source software released under the [MIT License](https://opensource.org/licenses/MIT). See the LICENSE file in the repository root for full details.

---

*Last updated: 2025 | Maintained by the Sentinel Nexus team*
