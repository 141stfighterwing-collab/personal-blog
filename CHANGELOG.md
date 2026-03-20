# Changelog

All notable changes to the Personal Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-03-17

### 🎬 Added - Video Embed Support & Admin Enhancements
- **Video Embeds**: Full support for YouTube, Vimeo, and TikTok videos in blog posts
- **Video URL Field**: Added `videoUrl` field to BlogPost model and API
- **VideoEmbed Component**: 
  - Click-to-play video thumbnails
  - YouTube thumbnail preview before play
  - Platform detection (YouTube, Vimeo, TikTok)
  - Embedded player with full controls
  - External link to original video
- **Admin Dashboard Enhancements**:
  - Post creation form with video URL input
  - Live post management (create/delete)
  - Video post indicator in post list
  - Dialog-based post creation UI
- **BlogSection Updates**:
  - Video embed display in expanded posts
  - Video icon badge for posts with videos
  - "Video Post" badge for video content

### 📁 New Files
- `src/components/VideoEmbed.tsx` - Video embed component with platform detection
- `src/app/api/posts/[id]/route.ts` - Individual post CRUD operations

### 📝 Changed
- **BlogSection Component**: Integrated VideoEmbed for video posts
- **Admin Dashboard**: Complete rewrite with post creation form
- **Posts API**: Added videoUrl support to POST handler

---

## [1.2.0] - 2026-03-17

### 📰 Added - Live RSS News Feeds
- **RSS Feed Integration**: Real-time news from external sources (no more hardcoded news)
- **Multiple RSS Sources**:
  - **AI News**: TechCrunch AI, VentureBeat AI, OpenAI Blog, Google AI Blog
  - **Geopolitics**: BBC World, Reuters World, Al Jazeera
  - **Cybersecurity**: BleepingComputer, The Record, Dark Reading, Krebs on Security
  - **General**: Hacker News, Dev.to
- **RSS Parser**: Using `rss-parser` library for reliable feed parsing
- **Smart Caching**: 5-minute cache to reduce API calls
- **Auto-Refresh**: Feeds refresh automatically every 5 minutes
- **Manual Refresh**: Button to force refresh news
- **Cache Management**: DELETE endpoint to clear cache

### 🔧 Changed
- **NewsMarquee Component**: Now fetches from RSS feeds instead of database
- **Removed Database Dependency**: News no longer stored in database
- **Improved Error Handling**: Graceful fallback when feeds fail

### 📁 New Files
- `src/lib/rss/config.ts` - RSS feed source configuration
- `src/lib/rss/parser.ts` - RSS parsing and caching logic
- `src/app/api/rss/route.ts` - RSS API endpoint

---

## [1.1.0] - 2026-03-17

### 🐘 Changed
- **Database Migration**: Switched from SQLite to PostgreSQL
- **Prisma Schema**: Updated for PostgreSQL with connection pooling support
- **Environment Config**: Added `DIRECT_DATABASE_URL` for Prisma migrations
- **DB Client**: Improved logging (query logs only in development)

### ✨ Added
- **Docker Compose**: PostgreSQL 16 + Adminer UI containers
- **DATABASE.md**: Comprehensive database options guide
- **.env.example**: Environment variable template
- **NPM Scripts**: `docker:up`, `docker:down`, `docker:reset`, `docker:logs`, `db:studio`, `db:seed`
- **Database Indexes**: Added indexes on frequently queried columns

### 📚 Documentation
- Updated README with PostgreSQL setup instructions
- Added free cloud database options (Supabase, Neon, Railway)
- Documented Adminer database UI access

---

## [1.0.0] - 2026-03-17

### 🔐 Added - Authentication System
- **Role-Based Access Control (RBAC)**: Admin, Reviewer, User roles
- **Hardcoded Users**: Demo accounts for immediate testing
  - `admin` / `admin123` - Full access
  - `reviewer` / `review123` - Create/Edit access
  - `user` / `user123` - Read-only access
- **Login Page**: `/login` with demo credentials display
- **User Menu Component**: Shows username, role badge, logout
- **Admin Dashboard**: `/admin` with stats and quick actions
- **Protected Routes**: Role-based route protection
- **Permission Helpers**: `canCreate()`, `canUpdate()`, `canDelete()`, `canAccessAdmin()`

### 📰 Added - News Ticker (Enhanced)
- **Multi-Category Support**: AI, Geopolitics, Cybersecurity, General
- **Color-Coded Categories**: Each with unique colors and icons
  - 🤖 AI (Purple) - Brain icon
  - 🌍 Geopolitics (Orange) - Globe icon
  - 🛡️ Cybersecurity (Green) - Shield icon
  - ✨ General (Blue) - Sparkles icon
- **Speed Controls**: Slow (60s), Normal (35s), Fast (20s)
- **Pause/Play Button**: Stop ticker to read headlines
- **Animated Glow Bar**: Colorful gradient pulse effect
- **21 Sample Headlines**: Across all categories

### 📝 Added - Blog System
- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Expandable Cards**: Click to expand/collapse posts
- **Code Blocks**: Syntax highlighting for multiple languages
- **Publication Dates**: Automatic timestamps
- **Excerpt Support**: Short previews

### 🔗 Added - Links Section
- **Categorized Links**: GitHub, Blog, News, Other
- **Visual Icons**: Category-specific icons
- **External Links**: Opens in new tab with security attributes

### 🛠️ Tech Stack
- Next.js 16 with App Router
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components
- Prisma ORM
- PostgreSQL
- Lucide Icons
- react-markdown

---

## [0.1.0] - 2026-03-17

### ✨ Added - Initial Release
- **Project Scaffolding**: Next.js 16 project setup
- **Basic Layout**: Header, main content, footer
- **Simple News Ticker**: Scrolling headlines
- **Basic Blog Display**: Static blog post cards
- **GitHub Integration**: Link to user's GitHub profile
- **Dark Mode Support**: Theme switching capability
- **Responsive Design**: Mobile-first approach

---

## Version History Summary

| Version | Date | Key Changes |
|---------|------|-------------|
| **1.3.0** | 2026-03-17 | Video embeds, enhanced admin dashboard |
| **1.2.0** | 2026-03-17 | Live RSS news feeds |
| **1.1.0** | 2026-03-17 | PostgreSQL database, Docker support |
| **1.0.0** | 2026-03-17 | Authentication, multi-category news, RBAC |
| **0.1.0** | 2026-03-17 | Initial project setup |

---

## Upcoming Features (Roadmap)

### [1.4.0] - Planned
- [ ] Edit post functionality
- [ ] Comment system on blog posts
- [ ] Social media sharing buttons
- [ ] Email notifications

### [2.0.0] - Future
- [ ] User registration with email verification
- [ ] Password hashing with bcrypt
- [ ] Two-factor authentication (2FA)
- [ ] Multi-tenant support
- [ ] Custom themes
- [ ] Plugin system
- [ ] API rate limiting
