# 🏗️ Architecture

> A deep dive into the system architecture, component hierarchy, data flow, content pipeline, and deployment topology of Sentinel Nexus.

---

## Table of Contents

- [System Overview](#system-overview)
- [Component Hierarchy](#component-hierarchy)
- [Data Flow](#data-flow)
- [Content Pipeline](#content-pipeline)
- [Deployment Architecture](#deployment-architecture)
- [Design Decisions](#design-decisions)
- [Performance Considerations](#performance-considerations)

---

## System Overview

Sentinel Nexus is a statically-generated personal blog built on Next.js. It follows the **Jamstack** architecture pattern, generating pre-rendered HTML at build time and serving it via a CDN or lightweight web server. There is no runtime database or server-side application logic.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SENTINEL NEXUS — SYSTEM OVERVIEW                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────────┐    ┌──────────────────────┐  │
│  │   Content     │───▶│   Build Pipeline  │───▶│   Static Output      │  │
│  │   Sources     │    │   (Next.js SSG)   │    │   (HTML/CSS/JS)     │  │
│  │               │    │                    │    │                      │  │
│  │  • Markdown   │    │  • gray-matter    │    │  • Pre-rendered     │  │
│  │  • Frontmatter│    │  • remark/rehype  │    │    HTML pages       │  │
│  │  • Images     │    │  • Tailwind CSS   │    │  • Optimized assets │  │
│  │  • Metadata   │    │  • TypeScript     │    │  • Search index     │  │
│  └──────────────┘    └──────────────────┘    └──────────┬───────────┘  │
│                                                           │              │
│                                                           ▼              │
│                                                    ┌──────────────┐     │
│                                                    │   CDN /      │     │
│                                                    │   Web Server │     │
│                                                    │              │     │
│                                                    │  • Nginx     │     │
│                                                    │  • Vercel    │     │
│                                                    │  • Docker    │     │
│                                                    └──────┬───────┘     │
│                                                           │              │
│                                                           ▼              │
│                                                    ┌──────────────┐     │
│                                                    │   Visitors   │     │
│                                                    │              │     │
│                                                    │  • Browsers  │     │
│                                                    │  • RSS       │     │
│                                                    │  • Crawlers  │     │
│                                                    └──────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

The application is organized into logical layers, each with a clear responsibility.

### Directory Structure

```
src/
├── components/           # UI component library
│   ├── layout/           # Structural layout components
│   │   ├── Header.tsx    # Navigation bar and branding
│   │   ├── Footer.tsx    # Site footer with links
│   │   ├── Sidebar.tsx   # Optional sidebar widget
│   │   └── Layout.tsx    # Root layout wrapper
│   ├── blog/             # Blog-specific components
│   │   ├── PostCard.tsx  # Blog post preview card
│   │   ├── PostList.tsx  # Grid/list of post cards
│   │   ├── PostBody.tsx  # Rendered markdown content
│   │   ├── TagList.tsx   # Tag badges and filtering
│   │   └── Pagination.tsx# Page navigation controls
│   ├── search/           # Search functionality
│   │   ├── SearchBar.tsx # Search input widget
│   │   └── SearchResults.tsx # Results dropdown
│   └── shared/           # Reusable primitives
│       ├── Button.tsx    # Button variants
│       ├── Card.tsx      # Generic card container
│       ├── SEO.tsx       # Meta tag management
│       └── ThemeToggle.tsx # Dark/light mode switch
├── content/              # Markdown blog posts
│   └── posts/            # Individual .md files
├── lib/                  # Core utilities
│   ├── markdown.ts       # Markdown parsing and rendering
│   ├── posts.ts          # Post retrieval and sorting
│   ├── search.ts         # Search index builder
│   └── rss.ts            # RSS feed generator
├── pages/                # Next.js page routes
│   ├── index.tsx         # Homepage (post list)
│   ├── posts/
│   │   ├── [slug].tsx    # Individual post page
│   │   └── index.tsx     # All posts listing
│   ├── about.tsx         # About page
│   ├── 404.tsx           # Custom 404 page
│   └── api/              # API routes
│       ├── rss.xml.ts    # RSS feed endpoint
│       └── search.ts     # Search API endpoint
└── styles/               # Global styles
    ├── globals.css       # Tailwind base + custom
    └── typography.css    # Prose content styling
```

### Component Dependency Graph

```
Layout
  ├── Header
  │     ├── ThemeToggle
  │     └── SearchBar ──▶ SearchResults
  ├── Main Content Area
  │     ├── PostList
  │     │     └── PostCard (×N)
  │     ├── PostBody
  │     ├── TagList
  │     └── Pagination
  ├── Sidebar (optional)
  │     ├── TagCloud
  │     └── RecentPosts
  └── Footer
```

---

## Data Flow

Sentinel Nexus follows a **unidirectional data flow** pattern. Content originates from Markdown files, is processed at build time, and rendered as static HTML.

### Build-Time Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    BUILD-TIME DATA FLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Markdown Files (.md)                                       │
│       │                                                     │
│       ▼                                                     │
│  ┌─────────────┐                                           │
│  │ gray-matter  │  Extract YAML frontmatter (title,         │
│  │              │  date, tags, excerpt, etc.)                │
│  └──────┬──────┘                                           │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │ Post Object  │  { slug, title, date, content,            │
│  │              │    tags, excerpt, coverImage }             │
│  └──────┬──────┘                                           │
│         │                                                   │
│         ├──────────────────┐                                │
│         ▼                  ▼                                │
│  ┌─────────────┐   ┌──────────────┐                        │
│  │  remark /    │   │  Sort &      │                        │
│  │  rehype      │   │  Filter      │                        │
│  │  Pipeline    │   │  Posts       │                        │
│  └──────┬──────┘   └──────┬───────┘                        │
│         │                  │                                │
│         ▼                  ▼                                │
│  ┌─────────────┐   ┌──────────────┐                        │
│  │  HTML +     │   │  Search      │                        │
│  │  Syntax     │   │  Index (JSON)│                        │
│  │  Highlight  │   │              │                        │
│  └──────┬──────┘   └──────┬───────┘                        │
│         │                  │                                │
│         ▼                  ▼                                │
│  ┌─────────────────────────────────┐                       │
│  │   Static HTML Pages + Assets    │                       │
│  │   (ready for deployment)         │                       │
│  └─────────────────────────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Runtime Data Flow (Client-Side)

```
User Action (click, search, navigate)
       │
       ▼
┌─────────────┐
│ React State  │  Theme preference, search query, page state
│ Management   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Component    │  Re-render affected UI components only
│ Re-render    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ DOM Update   │  Virtual DOM diff → minimal real DOM changes
└─────────────┘
```

---

## Content Pipeline

The content pipeline transforms raw Markdown files into optimized, ready-to-serve HTML pages.

### Pipeline Stages

| Stage | Tool | Input | Output | Purpose |
|-------|------|-------|--------|---------|
| 1. Parse Frontmatter | gray-matter | `.md` file | metadata + raw body | Extract structured metadata |
| 2. Parse Markdown | unified / remark | Markdown text | MDAST (Markdown AST) | Build abstract syntax tree |
| 3. Transform | remark plugins | MDAST | MDAST (modified) | Apply enhancements |
| 4. Convert to HTML | remark-rehype + rehype | MDAST | HAST (HTML AST) | Switch to HTML representation |
| 5. Serialize | rehype-stringify | HAST | HTML string | Produce final HTML |
| 6. Syntax Highlight | rehype-highlight | Code blocks | Styled `<pre><code>` | Apply syntax coloring |
| 7. Optimize Images | next/image | Image URLs | Optimized formats | WebP/AVIF conversion |
| 8. Generate Sitemap | next-sitemap | Page list | sitemap.xml | SEO sitemap |
| 9. Generate RSS | custom RSS lib | Post metadata | rss.xml | Feed syndication |
| 10. Build Search Index | flexsearch / lunr | Post content | search-index.json | Client-side search |

### Remark Plugin Chain

```
Markdown Input
    │
    ├── remark-parse          Parse to MDAST
    ├── remark-gfm            GitHub Flavored Markdown
    ├── remark-frontmatter    Preserve frontmatter nodes
    ├── remark-smartypants    Smart quotes & dashes
    ├── remark-heading-slug   Auto-generate heading IDs
    ├── remark-autolink-headings  Linkify headings
    ├── remark-code-titles    Captioned code blocks
    │
    ▼
    remark-rehype             Convert MDAST → HAST
    │
    ├── rehype-highlight      Syntax highlighting
    ├── rehype-slug           ID generation for elements
    ├── rehype-autolink-headings  Anchor links
    ├── rehype-external-links    Security attrs on ext links
    │
    ▼
HTML Output
```

### Frontmatter Schema

Every Markdown post includes YAML frontmatter with the following schema:

```yaml
---
title: "How to Build a Static Blog"       # Required: Post title
date: "2025-01-15"                         # Required: Publication date
slug: "building-static-blog"               # Optional: URL slug (auto-generated from filename)
excerpt: "A comprehensive guide..."         # Optional: Short description (auto-generated)
coverImage: "/images/blog-cover.jpg"       # Optional: Hero image path
tags:                                      # Optional: Array of tags
  - tutorial
  - web-development
  - nextjs
draft: false                                # Optional: Exclude from build if true
author: "Sentinel"                          # Optional: Author name override
seoTitle: "Static Blog Guide | Sentinel"   # Optional: Custom SEO title
seoDescription: "Learn how..."             # Optional: Meta description
canonicalUrl: "https://..."                # Optional: Canonical URL
---
```

---

## Deployment Architecture

### Production Topology

```
                        ┌──────────────┐
                        │   Visitors    │
                        │   (Browsers)  │
                        └──────┬───────┘
                               │
                               ▼
                        ┌──────────────┐
                        │   CDN Layer   │
                        │   (optional)  │
                        └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
            ┌──────────────┐     ┌──────────────┐
            │   Vercel     │     │   Docker /   │
            │   Edge       │     │   Nginx      │
            │   Network    │     │   Container  │
            └──────┬───────┘     └──────┬───────┘
                   │                    │
                   └──────────┬─────────┘
                              │
                              ▼
                    ┌──────────────┐
                    │  Static HTML │
                    │  / CSS / JS  │
                    │  / Assets    │
                    └──────────────┘
```

### Docker Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│               Docker Host                        │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │         Docker Container                    │ │
│  │                                              │ │
│  │  ┌────────────────────────────────────────┐ │ │
│  │  │  Multi-stage Build                     │ │ │
│  │  │                                        │ │ │
│  │  │  Stage 1: deps     — Install deps      │ │ │
│  │  │  Stage 2: build    — Next.js build     │ │ │
│  │  │  Stage 3: runner   — Nginx serve       │ │ │
│  │  └────────────────────────────────────────┘ │ │
│  │                                              │ │
│  │  Ports: 3000 → 80                           │ │
│  │  Volumes: ./content → /app/content           │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
└─────────────────────────────────────────────────┘
```

See [[Deployment]] for detailed setup instructions for each deployment method.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Static Site Generation (SSG) | Maximum performance, security, and reliability. No server runtime needed. |
| Next.js | Mature SSG framework with excellent DX, image optimization, and routing. |
| TypeScript | Type safety catches bugs early and improves IDE tooling. |
| Tailwind CSS | Utility-first approach enables rapid, consistent styling without context-switching. |
| Markdown Content | Authors write in plain text; version-controlled alongside code. |
| No Database | Content lives as files; eliminates migration complexity and database attacks. |
| Client-Side Search | Search index is pre-built at compile time; no server query needed. |
| Multi-Stage Docker | Minimal final image size; only the compiled static output is shipped. |

---

## Performance Considerations

### Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | Pre-rendered HTML, optimized images, CDN caching |
| FID (First Input Delay) | < 100ms | Minimal JavaScript, deferred loading |
| CLS (Cumulative Layout Shift) | < 0.1 | Explicit image dimensions, font-display swap |
| TTFB (Time to First Byte) | < 200ms | Static hosting, CDN edge caching |

### Optimization Techniques

- **Image Optimization:** Next.js `<Image>` component with automatic WebP/AVIF conversion
- **Code Splitting:** Automatic per-page bundle splitting via Next.js
- **Font Optimization:** `next/font` with `display: swap` for zero layout shift
- **CSS Purging:** Tailwind CSS removes unused styles at build time
- **Compression:** Brotli/Gzip at the CDN or web server level
- **Prefetching:** Next.js link prefetching for faster navigations
- **Lazy Loading:** Below-the-fold images and heavy components load on demand

---

*For build and deployment details, see [[Deployment]]. For local development setup, see [[Getting-Started]].*
