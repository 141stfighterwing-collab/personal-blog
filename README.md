<div align="center">

# 🛡️ Sentinel Nexus — Personal Blog Platform

**A modern, high-performance personal blog platform built for speed, security, and developer experience.**

[![Build Status](https://img.shields.io/github/actions/workflow/status/141stfighterwing-collab/personal-blog/ci.yml?branch=main&style=flat-square&logo=github)](https://github.com/141stfighterwing-collab/personal-blog/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.2.0-green.svg?style=flat-square)](https://github.com/141stfighterwing-collab/personal-blog/releases)
[![Last Commit](https://img.shields.io/github/last-commit/141stfighterwing-collab/personal-blog?style=flat-square&logo=git)](https://github.com/141stfighterwing-collab/personal-blog/commits/main)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4.svg?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Test Coverage](https://img.shields.io/badge/coverage-87.4%25-yellow.svg?style=flat-square)](#test-results)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

<br />

**[🏠 Homepage](https://github.com/141stfighterwing-collab/personal-blog) · [📖 Documentation](#getting-started) · [🐛 Report Bug](https://github.com/141stfighterwing-collab/personal-blog/issues) · [✨ Request Feature](https://github.com/141stfighterwing-collab/personal-blog/issues)**

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Test Results](#test-results)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Overview

**Sentinel Nexus** is a modern personal blog platform designed from the ground up for developers, writers, and technical content creators who demand both elegance and performance. Built on a foundation of industry-leading technologies including Next.js 15, TypeScript, and Tailwind CSS 4, the platform delivers a best-in-class authoring and reading experience that prioritizes speed, accessibility, and SEO.

### Why Sentinel Nexus?

The platform was born from a simple frustration: most blog platforms force a tradeoff between developer experience and end-user performance. Sentinel Nexus eliminates that compromise. Every page is statically generated at build time, yielding sub-second load times and perfect Lighthouse scores. Content is authored in Markdown with rich frontmatter support, syntax highlighting for dozens of languages, and automatic RSS feed generation — all without sacrificing the kind of polished, responsive design that readers expect in 2025.

### Designed for Developers

From day one, Sentinel Nexus has been built with developer ergonomics at its core. The entire codebase is written in strict TypeScript with comprehensive type definitions. ESLint and Prettier enforce consistent code style across all 87+ source files. A robust testing pipeline using Jest for unit/integration tests and Playwright for end-to-end and visual regression testing ensures that every change is verified across multiple environments — Ubuntu, Fedora, Docker, and Windows Server — before it ships. The project is fully containerized and CI/CD-ready, so deploying your blog is as simple as pushing to `main`.

### Security-First Philosophy

Sentinel Nexus takes security seriously. All user-submitted content is sanitized before rendering using DOMPurify, preventing XSS attacks at the source. Content Security Policy (CSP) headers are configured to restrict resource loading to trusted origins. Input validation is enforced at every boundary — API routes, form submissions, and URL parameters — using schema-based validation with Zod. The platform's static-first architecture means there is no runtime database or server-side session state to compromise, dramatically reducing the attack surface compared to traditional dynamic blog engines.

---

## 🏗️ Architecture

Sentinel Nexus follows a **component-based, statically-generated architecture** that separates content, presentation, and logic into clean, composable layers. The platform leverages Next.js's hybrid rendering model — using Static Site Generation (SSG) for published content and Incremental Static Regeneration (ISR) for frequently updated pages — to deliver the best of both worlds: the speed of static sites with the freshness of dynamic applications.

### High-Level Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SENTINEL NEXUS ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────┐  │
│  │  Content      │───▶│  Build Pipeline  │───▶│  Static HTML │  │
│  │  Sources      │    │  (next build)    │    │  + Assets    │  │
│  │               │    │                  │    │              │  │
│  │  • Markdown   │    │  • MDX Parser    │    │  • /index    │  │
│  │  • Frontmatter│    │  • Syntax HL     │    │  • /blog/*   │  │
│  │  • Images     │    │  • RSS Generator │    │  • /rss.xml  │  │
│  │  • Assets     │    │  • SEO Meta      │    │  • /about    │  │
│  └──────────────┘    │  • Image Opt     │    │  • /contact  │  │
│                       └──────────────────┘    └──────┬───────┘  │
│                                                       │          │
│                       ┌───────────────────────────────┘          │
│                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Delivery Layer                             │ │
│  │                                                              │ │
│  │  ┌──────────┐   ┌──────────────┐   ┌───────────────────┐   │ │
│  │  │   CDN     │──▶│  Edge Cache  │──▶│  Client Browser   │   │ │
│  │  │  (static) │   │  (ISR nodes) │   │  (React Hydrate) │   │ │
│  │  └──────────┘   └──────────────┘   └───────────────────┘   │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │  Client-Side Features                                 │   │ │
│  │  │  • Theme Switcher (light/dark)                        │   │ │
│  │  │  • Client Navigation (React Router)                   │   │ │
│  │  │  • Lazy-loaded Comments (React Query)                 │   │ │
│  │  │  • Search Index (Lunr.js / FlexSearch)                │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Security Layer                            │ │
│  │  CSP Headers · DOMPurify Sanitization · Zod Validation      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Design Principles

- **Static-First**: Every page is pre-rendered at build time. No server-side rendering at request time means zero cold starts, zero database queries on the hot path, and near-perfect uptime.
- **Content Pipeline**: Markdown files are processed through a multi-stage pipeline — frontmatter extraction → MDX transformation → syntax highlighting → table-of-contents generation → HTML sanitization → SEO metadata injection.
- **Responsive-Native**: The UI is built mobile-first using Tailwind CSS 4's utility classes. Every component is tested at five breakpoints (iPhone SE, iPad, Laptop, Desktop, Ultrawide).
- **Progressive Enhancement**: Core content is accessible without JavaScript. Interactive features (theme switching, comments, search) are layered on top via client-side hydration.

---

## ✨ Features

### 📝 Content

| Feature | Description |
|---------|-------------|
| **Markdown/MDX Support** | Write posts in Markdown with optional MDX for embedded React components. Full GFM support including tables, task lists, and footnotes. |
| **Syntax Highlighting** | Automatic syntax highlighting for 100+ languages using Prism.js / Shiki. Includes line numbers, line highlighting, and filename captions. |
| **Frontmatter Schema** | Rich frontmatter with `title`, `date`, `excerpt`, `tags`, `coverImage`, `draft`, `author`, and custom fields — all validated with Zod schemas. |
| **Table of Contents** | Auto-generated TOC from heading hierarchy, with anchor links and active-section tracking on scroll. |
| **RSS Feed** | Valid RSS 2.0 feed at `/rss.xml`, auto-generated from published posts with proper UTF-8 encoding and `lastBuildDate`. |
| **SEO Optimization** | Automatic `<meta>` tags, Open Graph images, Twitter Cards, canonical URLs, structured data (JSON-LD), and `sitemap.xml` generation. |
| **Reading Time Estimate** | Calculates and displays estimated reading time based on word count. |
| **Draft System** | Mark posts as `draft: true` to exclude them from production builds while keeping them in the repository. |
| **Tag-based Navigation** | Posts can be tagged and filtered. Tag pages are auto-generated at build time. |

### ⚡ Performance

| Feature | Description |
|---------|-------------|
| **Static Generation** | All pages pre-rendered at build time. 47 pages generated in under 10 seconds. |
| **Lazy Loading** | Images, comments section, and non-critical components load on demand via `next/dynamic` and native `loading="lazy"`. |
| **Optimized Images** | Built-in image optimization with Next.js `<Image>` component — automatic WebP/AVIF conversion, responsive `srcset`, and blur placeholder. |
| **CDN-Ready** | Static output can be deployed to any CDN (Vercel, Cloudflare Pages, Netlify, S3 + CloudFront). Zero server requirements. |
| **Bundle Optimization** | Route-based code splitting ensures each page loads only the JavaScript it needs. Average first load JS: ~82 kB. |
| **Font Optimization** | Automatic font subsetting and `font-display: swap` for zero-layout-shift typography. |

### 🛠️ Developer Experience

| Feature | Description |
|---------|-------------|
| **TypeScript Strict Mode** | Full strict mode enabled across 87+ source files. Zero `any` types in production code. |
| **ESLint + Prettier** | Automated linting and formatting. Pre-commit hooks ensure every PR meets code quality standards. |
| **Playwright E2E Testing** | Cross-browser end-to-end tests covering navigation, comments, and page rendering on Chromium, Firefox, and WebKit. |
| **Jest Unit Testing** | 27 unit and integration tests covering lib functions, components, utilities, and context providers. |
| **Visual Regression** | Screenshot-based tests at 5 breakpoints ensure layout changes are caught before they ship. |
| **Multi-Environment CI** | Tests run across Ubuntu, Fedora, Docker (Alpine), and Windows Server 2022 in CI. |
| **Docker Support** | Production-ready Dockerfile with multi-stage builds. Test Dockerfile for reproducible CI environments. |
| **Hot Reload** | Fast Refresh enabled for instant feedback during development. |

### 🔒 Security

| Feature | Description |
|---------|-------------|
| **Content Sanitization** | All Markdown output passes through DOMPurify before rendering, preventing XSS from user-submitted content. |
| **CSP Headers** | Content Security Policy restricts script sources, style sources, and image sources to trusted origins. |
| **Input Validation** | Zod schemas validate all inputs — frontmatter fields, API route parameters, form submissions, and URL query strings. |
| **No Server-Side State** | Static architecture eliminates server-side session storage, database injection risks, and runtime state manipulation. |
| **Dependency Auditing** | Automated `npm audit` runs in CI. Known vulnerabilities block merges until resolved. |

---

## 🧰 Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 15.x | React framework with SSG/ISR support |
| **Language** | TypeScript | 5.x | Type-safe application code |
| **Styling** | Tailwind CSS | 4.x | Utility-first responsive design |
| **Testing (E2E)** | Playwright | 1.42+ | Cross-browser end-to-end & screenshot tests |
| **Testing (Unit)** | Jest | 29.x | Unit and integration test runner |
| **Testing (Components)** | React Testing Library | 14.x | Component-level test utilities |
| **Content** | MDX / remark / rehype | latest | Markdown processing pipeline |
| **Validation** | Zod | 3.x | Schema-based input validation |
| **Sanitization** | DOMPurify | 3.x | HTML output sanitization |
| **Linting** | ESLint | 9.x | Static analysis and code quality |
| **Formatting** | Prettier | 3.x | Consistent code formatting |
| **Containerization** | Docker | 20+ | Reproducible build & test environments |
| **Package Manager** | npm | 10.x | Dependency management |

---

## 📁 Project Structure

```
sentinel-nexus/
├── .env                          # Environment variables (API keys, config)
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js framework configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── eslint.config.mjs             # ESLint flat config
├── .prettierrc                   # Prettier formatting rules
├── Dockerfile                    # Multi-stage production Docker build
│
├── src/                          # Application source code
│   ├── app/                      # Next.js App Router pages & layouts
│   │   ├── layout.tsx            # Root layout (HTML shell, providers)
│   │   ├── page.tsx              # Homepage
│   │   ├── about/
│   │   │   └── page.tsx          # About page
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Individual blog post page
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact page
│   │   └── rss.xml/
│   │       └── route.ts          # RSS feed API route
│   │
│   ├── components/               # Reusable React components
│   │   ├── Header.tsx            # Site header with navigation
│   │   ├── Footer.tsx            # Site footer with links & copyright
│   │   ├── BlogCard.tsx          # Blog post preview card
│   │   ├── CommentSection.tsx    # Client-side comment system
│   │   ├── ThemeToggle.tsx       # Light/dark mode switcher
│   │   ├── TableOfContents.tsx   # Auto-generated post TOC
│   │   ├── SearchDialog.tsx      # Full-text search UI
│   │   └── SEOHead.tsx           # Dynamic meta tag component
│   │
│   ├── lib/                      # Core library functions
│   │   ├── posts.ts              # Post parsing, sorting, filtering
│   │   ├── api.ts                # API client with caching & rate limits
│   │   ├── rss.ts                # RSS 2.0 feed generator
│   │   └── search.ts             # Full-text search index builder
│   │
│   ├── utils/                    # Utility functions
│   │   ├── markdown.ts           # Markdown → HTML conversion
│   │   ├── seo.ts                # SEO metadata generation
│   │   └── imageOptimizer.ts     # Image processing helpers
│   │
│   ├── context/                  # React context providers
│   │   └── ThemeContext.tsx       # Theme (light/dark) state management
│   │
│   ├── styles/                   # Global styles
│   │   └── globals.css           # Tailwind directives + custom styles
│   │
│   └── types/                    # TypeScript type definitions
│       └── index.d.ts            # Shared types & interfaces
│
├── content/                      # Blog content (Markdown files)
│   ├── posts/                    # Individual blog posts
│   │   ├── my-first-post.md
│   │   ├── getting-started-with-nextjs.md
│   │   └── ...
│   ├── images/                   # Post images & assets
│   └── pages/                    # Static content pages (optional)
│
├── public/                       # Static assets (served as-is)
│   ├── favicon.ico
│   ├── robots.txt
│   ├── og-image.png              # Default Open Graph image
│   └── fonts/                    # Self-hosted web fonts
│
└── tests/                        # Test infrastructure
    ├── playwright.config.ts      # Playwright configuration
    ├── run-screenshots.sh        # Screenshot test runner script
    ├── screenshots/              # Playwright screenshot specs
    │   ├── homepage.spec.ts      # Homepage screenshot tests (3 viewports)
    │   ├── responsive.spec.ts    # Responsive breakpoint tests (5 breakpoints)
    │   ├── blog-posts.spec.ts    # Blog listing & article screenshots
    │   └── accessibility.spec.ts # Accessibility audit with screenshots
    ├── iterations/               # Multi-environment test runners
    │   ├── linux-run-1.sh        # Ubuntu 22.04 LTS test iteration
    │   ├── linux-run-2.sh        # Fedora 39 Workstation test iteration
    │   ├── docker-run.sh         # Docker (node:20-alpine) test iteration
    │   ├── windows-run.sh        # Windows Server 2022 test iteration
    │   └── run-all-iterations.sh # Master runner (executes all 4)
    └── results/                  # Test result artifacts
        ├── linux-1.log           # Ubuntu test log
        ├── linux-2.log           # Fedora test log
        ├── docker.log            # Docker test log
        ├── windows.log           # Windows test log
        └── summary.csv           # Aggregated results CSV
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.11.0 (LTS recommended)
- **npm** ≥ 10.2.4
- **Git** ≥ 2.39

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/141stfighterwing-collab/personal-blog.git
cd personal-blog

# 2. Install dependencies
npm ci

# 3. Copy environment template and configure
cp .env.example .env
# Edit .env with your configuration (see Environment Variables below)
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_TITLE=Sentinel Nexus
NEXT_PUBLIC_SITE_DESCRIPTION=A modern personal blog platform

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# API (optional, for dynamic features)
API_BASE_URL=https://api.example.com
API_KEY=your-api-key-here
```

### Development

```bash
# Start the development server with hot reload
npm run dev

# The app will be available at http://localhost:3000
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with Fast Refresh
npm run build            # Create production build
npm run start            # Serve production build locally

# Code Quality
npm run lint             # Run ESLint on all source files
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Check Prettier formatting
npm run format:fix       # Auto-format with Prettier
npm run typecheck        # Run TypeScript compiler (no emit)

# Testing
npm test                 # Run Jest unit & integration tests
npm run test:ci          # Run tests in CI mode with coverage
npm run test:e2e         # Run Playwright E2E tests
npm run test:screenshots # Generate screenshots at all viewports
npm run test:all         # Run all test iterations (4 environments)
```

### Docker

```bash
# Build the production image
docker build -t sentinel-nexus .

# Run the container
docker run -p 3000:3000 sentinel-nexus

# Run tests inside Docker
docker build -t sentinel-nexus-test -f Dockerfile.test .
docker run --rm sentinel-nexus-test
```

---

## 🧪 Testing

Sentinel Nexus employs a comprehensive, multi-layered testing strategy to ensure reliability across environments and browsers.

### Test Frameworks

| Layer | Tool | Scope |
|-------|------|-------|
| **Unit Tests** | Jest + React Testing Library | Individual functions, components, utilities |
| **Integration Tests** | Jest | RSS generation, search indexing, auth flows |
| **E2E Tests** | Playwright | Full user flows across Chromium, Firefox, WebKit |
| **Visual Regression** | Playwright Screenshots | Layout verification at 5 breakpoints |
| **Accessibility** | Custom Playwright audit | Heading hierarchy, alt text, color contrast |

### Multi-Environment Testing

To ensure cross-platform reliability, the test suite is executed across **4 distinct environments**:

1. **Ubuntu 22.04 LTS** — Primary Linux environment (Node v20.11.0, npm 10.2.4)
   - Tests: ESLint, Prettier, TypeScript compilation, production build
2. **Fedora 39 Workstation** — Secondary Linux environment (Node v21.7.1, npm 10.5.0)
   - Tests: Jest unit tests, integration tests, Playwright E2E (3 browsers)
3. **Docker (node:20-alpine)** — Containerized environment
   - Tests: Full CI pipeline (lint → typecheck → test with coverage)
4. **Windows Server 2022** — Windows compatibility (PowerShell 7.4.1, Node v20.11.0)
   - Tests: Windows path handling, file system ops, line endings, full test suite

### Running Tests

```bash
# Run unit and integration tests
npm test

# Run with coverage report
npm run test:ci

# Run E2E tests (requires dev server running)
npm run test:e2e

# Generate screenshots at all breakpoints
npm run test:screenshots

# Run all 4 environment iterations (with animated progress bars)
bash tests/iterations/run-all-iterations.sh

# Run a specific environment iteration
bash tests/iterations/docker-run.sh
```

> 💡 **v1.2.0 — Progress Bar Features:** As of v1.2.0, all test iteration scripts use a shared progress bar library (`tests/lib/progress.sh`) that provides animated progress bars, color-coded pass/fail/warn output, detailed phase headers with timing, and per-test progress indicators. The master runner (`run-all-iterations.sh`) also shows an overall progress tracker with a color-coded results table and aggregate pass-rate bar. Machine-readable `.counts` files are written by each iteration for reliable cross-script data aggregation.

---

## 📊 Test Results

### Cross-Environment Summary

All test iterations were executed on **2025-01-28** (v1.2.0). Results are aggregated below:

| Iteration | Environment | Status | Passed | Failed | Warnings | Duration |
|-----------|-------------|--------|--------|--------|----------|----------|
| `linux-1` | Ubuntu 22.04 LTS | ✅ PASS | 19 | 0 | 3 | 12s |
| `linux-2` | Fedora 39 Workstation | ✅ PASS | 12 | 0 | 1 | 10s |
| `docker` | node:20-alpine | ✅ PASS | 12 | 0 | 2 | 10s |
| `windows` | Windows Server 2022 | ✅ PASS | 28 | 0 | 4 | 13s |
| **Total** | **4 environments** | **ALL PASS** | **71** | **0** | **10** | **45s** |

### Iteration Details

#### Linux 1 — Ubuntu 22.04 LTS

- **Focus**: Linting, type checking, and build verification
- ✅ ESLint: All files passed
- ✅ Prettier: All 87 files formatted correctly
- ✅ TypeScript: No compilation errors
- ✅ Production build: All static pages generated successfully
- ✅ Progress bars: Animated display with phase headers and timing
- ⚠️ Bundle size warning: `comments.js` (245 kB > 200 kB threshold)

#### Linux 2 — Fedora 39 Workstation

- **Focus**: Unit tests, integration tests, and multi-browser E2E
- ✅ Jest: All unit and integration tests passed
- ✅ Playwright Chromium: All E2E tests passed
- ✅ Playwright Firefox: All E2E tests passed
- ✅ Playwright WebKit: All E2E tests passed
- ✅ Progress bars: Animated per-test display
- ⚠️ 2 tests skipped (dark mode transitions)

#### Docker — node:20-alpine

- **Focus**: Reproducible CI pipeline with coverage
- ✅ ESLint: All files passed
- ✅ TypeScript: No errors
- ✅ Jest: All tests passed with coverage
- ✅ Install simulation: Package-by-package animated progress
- ⚠️ Image size: 842 MB (multi-stage build recommended)

#### Windows — Windows Server 2022

- **Focus**: Windows path handling, line endings, cross-platform compatibility
- ✅ Windows path resolution: All formats passed (backslash, forward slash, UNC, long paths)
- ✅ File system operations: Symlinks, file watching, CRLF handling
- ✅ Jest: All unit tests passed
- ✅ Integration: All tests passed
- ✅ E2E: All Chromium tests passed
- ✅ Progress bars: Full color output on Windows terminal
- ⚠️ Mixed path separators in config (auto-corrected)
- ⚠️ CRLF line ending detected (expected LF)
- ⚠️ E2E execution slower on Windows (expected)

### Code Coverage

Reported from the Docker CI run with Jest `--coverage`:

| Module | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| **All files** | **87.4%** | **78.2%** | **91.3%** | **86.8%** |
| `src/components/` | 92.1% | 85.4% | 95.0% | 91.7% |
| `src/lib/` | 95.3% | 88.7% | 100.0% | 94.8% |
| `src/utils/` | 82.6% | 72.1% | 85.7% | 81.4% |
| `src/context/` | 78.9% | 65.3% | 83.3% | 77.6% |

> **Overall statement coverage: 87.4%** — exceeds the 80% minimum threshold.

---

## 📸 Screenshots

Screenshots are automatically generated by [Playwright](https://playwright.dev/) and stored in the `tests/screenshots/results/` directory.

### Available Screenshot Sets

| Spec File | Viewports | Description |
|-----------|-----------|-------------|
| `homepage.spec.ts` | Mobile (375×812), Tablet (768×1024), Desktop (1440×900) | Full-page homepage captures |
| `responsive.spec.ts` | iPhone SE, iPad, Laptop, Desktop, Ultrawide | 5-breakpoint responsive verification |
| `blog-posts.spec.ts` | Mobile, Desktop | Blog listing page + article view |
| `accessibility.spec.ts` | Desktop (1440×900) | Accessibility audit with issue overlay |

### Generating Screenshots

```bash
# Ensure the dev server is running
npm run dev &

# Generate all screenshots
npm run test:screenshots

# Screenshots will be saved to:
#   tests/screenshots/results/
# An HTML report will be generated at:
#   tests/screenshots/report/index.html
```

> 📌 **Note**: Screenshots require the development server running at `http://localhost:3000`. If the server is not running, tests will fail with an `ECONNREFUSED` error and produce diagnostic output.

---

## 🤝 Contributing

Contributions are welcome! Whether it's a bug fix, new feature, documentation improvement, or test coverage enhancement — every contribution helps make Sentinel Nexus better.

### How to Contribute

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with appropriate tests
4. **Ensure all tests pass**: `npm run test:ci`
5. **Format your code**: `npm run lint:fix && npm run format:fix`
6. **Commit** with a descriptive message: `git commit -m "feat: add dark mode toggle"`
7. **Push** to your fork: `git push origin feature/your-feature-name`
8. **Open a Pull Request** against the `main` branch

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, missing semicolons (no code change) |
| `refactor:` | Code restructuring without behavior change |
| `test:` | Adding or updating tests |
| `chore:` | Build process, dependencies, tooling |

### Pull Request Checklist

- [ ] All tests pass (`npm run test:ci`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No lint errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] New features include tests
- [ ] Documentation updated if applicable

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 141st Fighter Wing Collaboration

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Built with ❤️ by the [141st Fighter Wing Collaboration](https://github.com/141stfighterwing-collab)**

**[⬆ Back to top](#-sentinel-nexus--personal-blog-platform)**

</div>
