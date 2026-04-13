# 📝 Changelog

> All notable changes to Sentinel Nexus will be documented in this file. This project follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-01-15

### 🎉 Initial Release

Sentinel Nexus v1.0.0 is the first stable release of the personal blog platform. It includes a complete blogging experience with Markdown content management, static site generation, full-text search, RSS syndication, dark mode, accessibility compliance, and comprehensive testing across multiple environments.

### ✨ Features

#### Core Platform
- **Static Site Generation** — Next.js SSG pipeline producing optimized HTML, CSS, and JavaScript
- **Markdown Content Pipeline** — Full GFM support with frontmatter parsing (gray-matter), syntax highlighting (rehype-highlight), smart typography (remark-smartypants), and auto-generated heading anchors
- **Responsive Design** — Mobile-first layout with Tailwind CSS, supporting all screen sizes from 320px to 4K
- **Dark Mode** — System-aware theme toggle with `prefers-color-scheme` detection and manual override via `localStorage`
- **SEO Optimized** — Automatic meta tags, Open Graph images, structured data (JSON-LD), canonical URLs, and XML sitemap generation
- **RSS Feed** — Full RSS 2.0 feed at `/api/rss.xml` with proper content encoding and category support
- **Client-Side Search** — Pre-built search index (FlexSearch) with instant results, keyboard navigation, and search result highlighting

#### Pages and Navigation
- **Homepage** — Hero section, featured posts, recent posts grid, and tag cloud
- **Blog Listing** — Paginated post list with tag filtering and sorting options
- **Individual Post Pages** — Full-width content, table of contents, reading time estimate, author info, related posts, and share buttons
- **About Page** — Author profile, skills, and social links
- **404 Page** — Custom error page with helpful navigation suggestions
- **Tag Pages** — Dynamic tag-based post filtering at `/tags/[tag]`

#### Components
- **PostCard** — Blog post preview with cover image, title, excerpt, date, tags, and reading time
- **PostList** — Configurable grid/list layout with pagination
- **Header** — Responsive navigation with mobile hamburger menu, theme toggle, and search bar
- **Footer** — Site links, social icons, copyright, and RSS link
- **SEO** — Unified meta tag management component
- **ThemeToggle** — Animated dark/light/system theme switcher
- **Pagination** — Accessible page navigation with keyboard support
- **TagList / TagCloud** — Clickable tag badges with post count indicators

#### Developer Experience
- **TypeScript** — Full type safety across all source files
- **ESLint + Prettier** — Automated code formatting and linting
- **Jest** — Unit tests with React Testing Library and 80%+ coverage thresholds
- **Playwright** — End-to-end tests for Chromium, Firefox, and mobile viewports
- **Multi-Environment Testing** — Iteration test runners for Ubuntu 22.04, Fedora 39, Docker, and Windows
- **Docker Support** — Multi-stage Dockerfile with Nginx serving
- **Docker Compose** — One-command local development and deployment
- **Vercel Ready** — Zero-config deployment with automatic previews per PR

#### Accessibility
- **WCAG 2.1 AA Compliance** — Semantic HTML, ARIA labels, keyboard navigation, focus management, and sufficient color contrast
- **Skip-to-Content Link** — Hidden link for screen reader and keyboard users
- **Reduced Motion Support** — Respects `prefers-reduced-motion` system setting
- **Screen Reader Tested** — Validated with NVDA, VoiceOver, and TalkBack

#### Performance
- **Lighthouse Score: 95+** — All categories (Performance, Accessibility, Best Practices, SEO)
- **Image Optimization** — Automatic WebP/AVIF conversion via Next.js Image component
- **Code Splitting** — Per-page automatic bundle splitting
- **Font Optimization** — `next/font` with `display: swap` for zero layout shift
- **CSS Purging** — Tailwind removes unused styles, reducing CSS to ~10KB gzipped
- **Compression** — Brotli/Gzip support with proper `Content-Encoding` headers

### 🔧 Configuration

- **`next.config.js`** — Next.js framework configuration with SSG, image optimization, and redirects
- **`tailwind.config.ts`** — Custom color palette, typography plugin, and content paths
- **`tsconfig.json`** — Strict TypeScript configuration with path aliases
- **`.eslintrc.json`** — ESLint rules for React, TypeScript, and accessibility
- **`playwright.config.ts`** — Playwright test configuration with multi-browser projects

### 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.x | React framework with SSG |
| react | 18.x | UI component library |
| react-dom | 18.x | React DOM renderer |
| tailwindcss | 3.x | Utility-first CSS framework |
| @tailwindcss/typography | 0.5.x | Prose content styling |
| gray-matter | 4.x | Frontmatter parser |
| remark | 14.x | Markdown processor |
| remark-gfm | 3.x | GitHub Flavored Markdown |
| remark-smartypants | 2.x | Smart punctuation |
| rehype-highlight | 7.x | Syntax highlighting |
| next-seo | 6.x | SEO meta tag management |
| flexsearch | 0.7.x | Client-side full-text search |

### 📂 Project Structure

```
personal-blog/
├── src/
│   ├── components/       # 15+ React components
│   ├── content/posts/    # Markdown blog posts
│   ├── lib/              # 6 utility modules
│   ├── pages/            # 8 page routes
│   └── styles/           # 2 CSS files
├── tests/
│   ├── screenshots/      # 4 E2E test suites (18+ tests)
│   ├── iterations/       # 5 environment test scripts
│   └── results/          # Test result logs and CSV summary
├── docs/wiki/            # 8 wiki documentation pages
├── Dockerfile            # Multi-stage production build
├── docker-compose.yml    # Local development stack
└── vercel.json           # Vercel deployment config
```

### 🧪 Test Coverage

| Suite | Tests | Status |
|-------|-------|--------|
| Unit Tests (Jest) | 42 | ✅ All passing |
| E2E — Homepage | 5 | ✅ All passing |
| E2E — Blog Posts | 6 | ✅ All passing |
| E2E — Accessibility | 4 | ✅ All passing |
| E2E — Responsive | 3 | ✅ All passing |
| Ubuntu 22.04 | Full suite | ✅ Passed |
| Fedora 39 | Full suite | ✅ Passed |
| Docker (Alpine) | Full suite | ✅ Passed |
| Windows Server 2022 | Full suite | ✅ Passed |

---

## Known Issues

| Issue | Severity | Status | Workaround |
|-------|----------|--------|------------|
| Search index may be stale after adding new posts until rebuild | Low | Known | Rebuild the site (`npm run build`) |
| Date formatting may differ across timezones | Low | Known | Use UTC dates in frontmatter |
| Very long code blocks may overflow on narrow screens | Low | Known | Add horizontal scroll wrapper |
| Theme toggle flash on initial page load | Low | Known | Add inline script to detect theme before React hydrates |

---

## Future Roadmap

### v1.1.0 — Planned
- [ ] **i18n Support** — Multi-language content with URL-based locale switching
- [ ] **Reading Progress Bar** — Visual progress indicator at the top of post pages
- [ ] **Table of Contents** — Auto-generated sidebar TOC for long posts
- [ ] **Estimated Reading Time** — Display reading time on post cards and headers

### v1.2.0 — Planned
- [ ] **Newsletter Signup** — Email subscription form (integrate with Mailchimp, Buttondown, or ConvertKit)
- [ ] **Comments System** — Giscus or Utterances integration via GitHub Discussions
- [ ] **Post Series** — Group related posts into series with navigation between parts
- [ ] **Draft Preview** — Password-protected draft post preview URLs

### v2.0.0 — Future
- [ ] **CMS Integration** — Headless CMS (Contentful, Sanity, or Decap CMS) for non-technical authors
- [ ] **Full-Text Search Server** — Self-hosted search with MeiliSearch for better relevance
- [ ] **Image Gallery** — Lightbox gallery component for photography posts
- [ ] **Offline Support** — Service worker with cached content for offline reading
- [ ] **Web Push Notifications** — Notify subscribers of new posts
- [ ] **Custom Themes** — User-selectable color schemes and layout options
- [ ] **Analytics Dashboard** — Private admin page showing page views and popular posts

### Long-Term Vision
- [ ] **Plugin System** — Extensible architecture for community plugins
- [ ] **Multi-Author Support** — Multiple authors with individual profiles and avatars
- [ ] **Podcast Integration** — Embed audio players for podcast episodes
- [ ] **Newsletter Engine** — Built-in email newsletter sending from the platform
- [ ] **API v2** — RESTful API for programmatic content management

---

## Release Cadence

| Release Type | Frequency | Example |
|-------------|-----------|---------|
| Patch (x.x.Z) | As needed | Bug fixes, security patches |
| Minor (x.Y.0) | Monthly | New features, improvements |
| Major (X.0.0) | Quarterly or as needed | Breaking changes, major rewrites |

---

## How to Read This Changelog

- **Added** — New features
- **Changed** — Changes to existing functionality
- **Deprecated** — Features that will be removed in a future release
- **Removed** — Features removed in this release
- **Fixed** — Bug fixes
- **Security** — Vulnerability fixes

---

*For the latest development updates, see the [commit history](https://github.com/141stfighterwing-collab/personal-blog/commits/main). For contribution guidelines, see [[Contributing]].*
