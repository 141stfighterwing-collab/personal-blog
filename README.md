# Personal Blog Platform

A modern, full-featured personal blog built with Next.js 16, featuring a dynamic RSS-powered news ticker, markdown blog posts, layered page builder, and role-based authentication.

![Version](https://img.shields.io/badge/Version-1.5.0-brightgreen?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

**[📝 Changelog](./CHANGELOG.md) • [🗺️ Roadmap](./ROADMAP.md) • [🗄️ Database Guide](./DATABASE.md)**

---

## 📸 Application Screenshots

### Home Page with News Ticker
The home page features a live RSS-powered news ticker with multiple categories (AI, Geopolitics, Cybersecurity) and a tabbed interface for blog posts and links.

![Home Page](./public/screenshots/home-page.png)

### News Ticker Controls
Interactive controls allow you to pause/play the ticker and adjust scrolling speed.

![News Ticker Controls](./public/screenshots/news-ticker-controls.png)

### Blog Posts Section
Markdown-powered blog posts with expandable content, code syntax highlighting, and video embed support.

![Blog Section](./public/screenshots/blog-section.png)

### Links & Resources
Organize your favorite links by category with visual icons for easy identification.

![Links Section](./public/screenshots/links-section.png)

### Dark Mode
Full dark mode support with automatic system preference detection.

![Dark Mode](./public/screenshots/dark-mode.png)

### Mobile Responsive
Touch-friendly design that works perfectly on all screen sizes.

![Mobile View](./public/screenshots/mobile-view.png)

### Login Page
Secure authentication with role-based access control.

![Login Page](./public/screenshots/login-page.png)

### Admin Dashboard
Full administrative control panel for managing content.

![Admin Dashboard](./public/screenshots/admin-dashboard.png)

### Page Builder
WordPress-style layered page builder with drag-and-drop content blocks and free image source integration.

![Page Builder](./public/screenshots/page-builder.png)

---

## ✨ Key Features

### 📰 Live RSS News Ticker
- **Multi-Category Feeds**: AI, Geopolitics, Cybersecurity, and General news
- **Real-Time Updates**: Pulls live headlines from RSS sources
- **Interactive Controls**: Pause/play, speed adjustment (Slow/Normal/Fast)
- **Color-Coded Categories**: Visual distinction for each news type
- **5-Minute Cache**: Optimized performance with automatic refresh

### 📝 Blog System
- **Markdown Support**: Full markdown syntax with code highlighting
- **Video Embeds**: YouTube, Vimeo, and TikTok integration
- **Expandable Cards**: Click to reveal full post content
- **Publication Dates**: Automatic timestamping
- **SEO-Friendly**: Meta descriptions and slug-based URLs

### 🔗 Links Management
- **Categorized Links**: GitHub, Blog, News, and Other categories
- **Visual Icons**: Category-specific icons for quick identification
- **External Link Support**: Opens in new tab with security attributes

### 🏗️ Page Builder (NEW!)
- **WordPress-Style Editor**: Familiar block-based content creation
- **12 Block Types**: Hero, Text, Image, Gallery, Video, Quote, Divider, Columns, Sidebar, CTA, Code, Embed
- **Drag & Drop**: Reorder blocks with up/down controls
- **Banner Images**: Full-width page banners with alt text
- **Sidebar Support**: Toggle sidebar with custom menu items
- **Free Image Sources**: Quick links to Unsplash, Pexels, Pixabay, Burst, StockSnap

### 🔐 Authentication & Roles
- **Role-Based Access Control**: Admin, Reviewer, and User roles
- **Secure Sessions**: Encrypted session management
- **Protected Routes**: Role-based route protection
- **Hardcoded Admin**: Quick access for development

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 16 | React framework with App Router |
| Language | TypeScript | Type-safe JavaScript |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| UI Components | shadcn/ui | Beautiful, accessible components |
| Database ORM | Prisma | Type-safe database access |
| Database | PostgreSQL / SQLite | Production / Development |
| Container | Docker Compose | PostgreSQL containerization |
| Icons | Lucide React | Beautiful open-source icons |
| Animation | Framer Motion | Smooth UI animations |
| Markdown | react-markdown | Markdown rendering |
| RSS | rss-parser | Feed parsing |

---

## 📁 Project Structure

```
personal-blog/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── posts/         # Blog posts CRUD
│   │   │   ├── pages/         # Custom pages CRUD
│   │   │   ├── links/         # External links CRUD
│   │   │   ├── news/          # News items CRUD
│   │   │   ├── rss/           # RSS feed parser
│   │   │   └── seed/          # Database seeding
│   │   ├── login/             # Login page
│   │   ├── admin/             # Admin dashboard
│   │   │   └── pages/new/     # Page builder
│   │   ├── [slug]/page/       # Dynamic page rendering
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── page-builder/      # Page builder components
│   │   ├── themes/            # Theme layouts and switcher
│   │   ├── NewsMarquee.tsx    # News ticker
│   │   ├── BlogSection.tsx    # Blog display
│   │   ├── LinksSection.tsx   # Links display
│   │   ├── VideoEmbed.tsx     # Video embeds
│   │   └── auth/              # Auth components
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── auth/              # Auth utilities
│   │   ├── permissions.ts     # Role permissions
│   │   ├── themes/            # Theme configuration
│   │   └── rss/               # RSS configuration
│   └── hooks/                 # Custom React hooks
├── public/
│   ├── themes/                # Theme header images
│   └── screenshots/           # Application screenshots
├── tests/                     # Playwright tests
├── setup.ps1                  # Windows auto-configuration
├── docker-compose.yml         # PostgreSQL container
└── .env                       # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun**
- **Docker** (for PostgreSQL database)
- **PowerShell 5.1+** (Windows auto-setup)

---

## ⚡ Quick Setup (Windows)

Run the included PowerShell script for automatic configuration:

```powershell
./setup.ps1
```

### Setup Menu Options

```
[1] Quick Setup      - Automated setup with defaults
[2] Manual Setup     - Guided configuration
[3] Docker Manager   - Manage database container
[4] System Status    - View current setup status
[5] Generate Credentials - Create credentials.txt file
[6] Test Application - Run functionality tests
[7] View Logs        - Open setup log file
[Q] Quit
```

### Setup Features

| Feature | Description |
|---------|-------------|
| 🔐 **Credentials** | Auto-creates admin/reviewer/user accounts |
| 🗄️ **Database** | Installs & configures PostgreSQL via Docker |
| ⚙️ **Configuration** | Generates .env with database connection |
| 📦 **Dependencies** | Installs npm/bun packages automatically |
| 🧪 **Testing** | Validates API endpoints and connectivity |
| 📊 **Logging** | Full setup log saved to `logs/` folder |
| 📈 **Progress Bar** | Visual progress tracking with percentage |

---

## 🔧 Manual Installation

### 1. Clone & Install

```bash
git clone https://github.com/141stfighterwing-collab/personal-blog.git
cd personal-blog
bun install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

For SQLite (development):
```env
DATABASE_URL="file:./db/custom.db"
```

For PostgreSQL (production):
```env
DATABASE_URL="postgresql://bloguser:blogpass@localhost:5432/blogdb?schema=public"
DIRECT_DATABASE_URL="postgresql://bloguser:blogpass@localhost:5432/blogdb?schema=public"
```

### 3. Database Setup

**SQLite:**
```bash
bun run db:push
```

**PostgreSQL with Docker:**
```bash
docker-compose up -d
bun run db:push
```

### 4. Seed Database

```bash
curl http://localhost:3000/api/seed
```

### 5. Start Development Server

```bash
bun run dev
```

Open http://localhost:3000

---

## 🗄️ Database Options

### PostgreSQL (Production Recommended)

Start with Docker:
```bash
docker-compose up -d
```

**Access Adminer UI:**
- URL: http://localhost:8080
- System: PostgreSQL
- Server: postgres
- Username: bloguser
- Password: blogpass
- Database: blogdb

### Free Cloud Database Options

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| [Supabase](https://supabase.com) | 500MB | Production apps with auth |
| [Neon](https://neon.tech) | 3GB | Serverless, scaling to zero |
| [Railway](https://railway.app) | 1GB | Quick deployment |

### SQLite (Development Only)

For quick local testing:
```env
DATABASE_URL="file:./db/custom.db"
```

---

## 🔐 Authentication

### Default Users

Credentials are generated in `credentials.txt` during setup.

> ⚠️ **IMPORTANT**: Delete `credentials.txt` after changing default passwords!

### Role Permissions

| Permission | Admin | Reviewer | User |
|------------|:-----:|:--------:|:----:|
| View blog posts | ✅ | ✅ | ✅ |
| View news ticker | ✅ | ✅ | ✅ |
| Create/Edit posts | ✅ | ✅ | ❌ |
| Delete posts | ✅ | ❌ | ❌ |
| Manage pages | ✅ | ✅ | ❌ |
| Access admin panel | ✅ | ❌ | ❌ |

---

## 📰 RSS Feed Configuration

Edit `src/lib/rss/config.ts` to customize feeds:

```typescript
export const RSS_FEED_SOURCES: RSSFeedSource[] = [
  {
    id: 'ai-techcrunch',
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'ai',
    enabled: true,
    maxItems: 5,
  },
  // Add your own feeds...
]
```

### Default RSS Sources

| Category | Sources |
|----------|---------|
| 🤖 **AI** | TechCrunch AI, VentureBeat AI, OpenAI Blog |
| 🌍 **Geopolitics** | BBC World, Reuters World, Al Jazeera |
| 🛡️ **Cybersecurity** | BleepingComputer, The Record, Krebs on Security |
| ✨ **General** | Hacker News, Dev.to |

---

## 🏗️ Page Builder

### Block Types

| Block | Description |
|-------|-------------|
| **Hero** | Full-width banner with title and background |
| **Text** | Rich text paragraph with alignment options |
| **Image** | Single image with alt text and caption |
| **Gallery** | Multi-image grid layout |
| **Video** | YouTube/Vimeo/TikTok embed |
| **Quote** | Blockquote with author |
| **Divider** | Horizontal separator |
| **Columns** | Multi-column layout |
| **CTA** | Call-to-action button |
| **Code** | Syntax-highlighted code block |
| **Embed** | Custom iframe embed |

### Free Image Sources

The page builder includes quick links to:
- [Unsplash](https://unsplash.com) - Free high-quality photos
- [Pexels](https://pexels.com) - Free stock photos
- [Pixabay](https://pixabay.com) - Free images & videos
- [Burst](https://burst.shopify.com) - Shopify free photos
- [StockSnap](https://stocksnap.io) - CC0 photos

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/session` | Get current session |

### Blog Posts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/posts` | Get all published posts | No |
| POST | `/api/posts` | Create a new post | Reviewer+ |
| PUT | `/api/posts/:id` | Update a post | Reviewer+ |
| DELETE | `/api/posts/:id` | Delete a post | Admin |

### Custom Pages

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/pages` | Get all pages | No |
| POST | `/api/pages` | Create a page | Reviewer+ |
| PUT | `/api/pages/:id` | Update a page | Reviewer+ |
| DELETE | `/api/pages/:id` | Delete a page | Admin |

### RSS News

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rss` | Get parsed RSS items |
| DELETE | `/api/rss` | Clear RSS cache |

---

## 🌙 Dark Mode

Built-in dark mode support using `next-themes`. Automatically follows system preference or can be toggled manually.

---

## 🎨 Classic WordPress Themes

The blog includes three classic WordPress-inspired themes, each with distinct layouts, typography, and features:

### Theme Selection

Click the **Theme** button in the header to open the theme selector with visual previews. Your choice is saved to localStorage.

### Twenty Ten (2010)

The classic WordPress default theme featuring:
- **Full-width header image** with landscape photography
- **Right sidebar** with calendar widget
- **Search box** and archives
- **Recent posts** widget
- **Georgia serif headings** for classic feel

![Twenty Ten Theme](./public/themes/twenty-ten-preview.png)

### Twenty Eleven (2011)

A sophisticated theme with:
- **Featured posts section** with star highlights
- **Left sidebar** with archives
- **Industrial/modern header image**
- **Search in header**
- **Shadow card style**

![Twenty Eleven Theme](./public/themes/twenty-eleven-preview.png)

### Twenty Twelve (2012)

A modern, responsive theme featuring:
- **Centered header** with clean typography
- **"Meet the Team" section** for team members
- **Right sidebar** with recent posts
- **Flat design** style
- **Open Sans typography**

![Twenty Twelve Theme](./public/themes/twenty-twelve-preview.png)

### Theme Features Comparison

| Feature | Twenty Ten | Twenty Eleven | Twenty Twelve |
|---------|:----------:|:-------------:|:-------------:|
| Calendar Widget | ✅ | ❌ | ❌ |
| Featured Posts | ❌ | ✅ | ❌ |
| Team Section | ❌ | ❌ | ✅ |
| Search Box | ✅ | ✅ | ❌ |
| Archives | ✅ | ✅ | ❌ |
| Left Sidebar | ❌ | ✅ | ❌ |
| Right Sidebar | ✅ | ❌ | ✅ |
| Dark Mode | ✅ | ✅ | ✅ |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual

```bash
bun run build
bun run start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Shootre21**
- GitHub: [@Shootre21](https://github.com/Shootre21)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Database ORM
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Playwright](https://playwright.dev/) - Browser automation
