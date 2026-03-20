# Changelog

All notable changes to the Personal Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.5.0] - 2026-03-21

### 🎨 Added - Classic WordPress Theme System
- **Three Classic Themes**: Twenty Ten (2010), Twenty Eleven (2011), Twenty Twelve (2012)
- **Theme Switcher**: Visual dialog with theme previews
- **Theme-Specific Layouts**: Each theme has unique header, sidebar, and typography
- **Twenty Ten Features**:
  - Full-width header image with tree-lined path
  - Right sidebar with calendar widget
  - Search box and archives
  - Georgia serif headings
- **Twenty Eleven Features**:
  - Featured posts section with star highlights
  - Left sidebar with archives
  - Industrial/modern header image
  - Shadow card style
- **Twenty Twelve Features**:
  - Centered header with clean typography
  - "Meet the Team" section
  - Right sidebar with recent posts
  - Flat design style

### 🎨 Theme Configuration
- **CSS Variables**: Dynamic theme colors and typography
- **localStorage Persistence**: Theme choice saved locally
- **Dark Mode Toggle**: Works with all themes
- **Preview Images**: Generated AI header images for each theme

### 📁 New Files
- `src/components/themes/` - Theme layout components
- `src/contexts/ThemeContext.tsx` - Theme state management
- `src/lib/themes/config.ts` - Theme configuration
- `public/themes/` - Theme header and preview images

### 🗄️ Database
- **SiteSettings Model**: Store theme preferences
- **TeamMember Model**: Team members for Twenty Twelve theme

---

## [1.4.0] - 2026-03-21

### 📸 Added - Playwright Screenshots & Documentation
- **Playwright Configuration**: Automated browser testing setup
- **Screenshot Tests**: 10 tests capturing all app features
- **Fresh Screenshots**: Updated all screenshots via Playwright
- **README Redesign**: Modern layout with comprehensive documentation

### 🏗️ Page Builder Enhancement
- **WordPress-Style Editor**: Block-based content creation
- **12 Block Types**: Hero, Text, Image, Gallery, Video, Quote, etc.
- **Free Image Sources**: Links to Unsplash, Pexels, Pixabay, Burst, StockSnap
- **Drag & Drop**: Reorder blocks with controls

---

## [1.3.1] - 2026-03-21

### 🔒 Security
- **Removed Credentials from UI**: Demo credentials no longer displayed on login page
- **Credentials File**: Created `credentials.txt` with security warning message
- **Git Ignore**: Added `credentials.txt` to `.gitignore` to prevent accidental commits
- **Clear Warning**: Added prominent "DELETE THIS FILE" warning in credentials file

### 📸 Documentation
- **Playwright Screenshots**: Added automated screenshot capture with Playwright
- **Application Screenshots**: Home page, news ticker, blog section, dark mode, mobile view
- **PowerShell Demos**: Generated AI images showing setup script in action
- **README Updates**: Integrated screenshots throughout documentation

### 🛠️ Changed
- **PowerShell Script**: Updated to generate credentials file instead of displaying on screen
- **Login Page**: Removed demo credentials section for cleaner, more secure interface
- **Menu Options**: Simplified to single "Generate Credentials" option

### 📁 New Files
- `credentials.txt` - Default credentials with security warnings (git-ignored)
- `public/screenshots/` - Application and PowerShell demo screenshots

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
| **1.5.0** | 2026-03-21 | Classic WordPress themes (Twenty Ten, Eleven, Twelve) |
| **1.4.0** | 2026-03-21 | Playwright screenshots, README redesign, page builder |
| **1.3.1** | 2026-03-21 | Security: Credentials removed from UI, screenshots added |
| **1.3.0** | 2026-03-17 | Video embeds, enhanced admin dashboard |
| **1.2.0** | 2026-03-17 | Live RSS news feeds |
| **1.1.0** | 2026-03-17 | PostgreSQL database, Docker support |
| **1.0.0** | 2026-03-17 | Authentication, multi-category news, RBAC |
| **0.1.0** | 2026-03-17 | Initial project setup |

---

## Upgrade Guide

### From 1.4.0 to 1.5.0
1. Pull latest changes
2. Run `bun run db:push` to add new models
3. Click Theme button to select your preferred theme
4. Theme preference is saved automatically

### From 1.3.1 to 1.4.0
1. Pull latest changes
2. Run `./setup.ps1` and select `[5] Generate Credentials`
3. Review `credentials.txt` and change default passwords
4. Delete `credentials.txt` after changing passwords

### From 1.2.0 to 1.3.0
1. Pull latest changes
2. Run `bunx prisma generate` to update Prisma client
3. Run `bunx prisma db push` to add videoUrl field
4. Restart application

### From 1.1.0 to 1.2.0
1. Pull latest changes
2. Run `bun install` to add `rss-parser`
3. Restart application (RSS feeds work automatically)

---

See [ROADMAP.md](./ROADMAP.md) for planned future features.
