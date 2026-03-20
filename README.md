# Personal Blog with Multi-Category News Ticker

A modern, responsive personal blog built with Next.js 16, featuring a dynamic news ticker with multiple categories (AI, Geopolitics, Cybersecurity), markdown-based blog posts, and a role-based authentication system.

![Version](https://img.shields.io/badge/Version-1.3.1-brightgreen?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)
![RSS](https://img.shields.io/badge/RSS_Live-Feeds-orange?style=flat-square)
![Video](https://img.shields.io/badge/Video_Embeds-YouTube-red?style=flat-square&logo=youtube)

**[📖 Documentation](./README.md) • [📝 Changelog](./CHANGELOG.md) • [🗺️ Roadmap](./ROADMAP.md) • [🔄 Updates](./UPDATES.md) • [🗄️ Database Guide](./DATABASE.md)**

---

## 📸 Screenshots

### Home Page
![Home Page](./public/screenshots/home-page.png)

### News Ticker with Controls
![News Ticker Controls](./public/screenshots/news-ticker-controls.png)

### Blog Section
![Blog Section](./public/screenshots/blog-section.png)

### Dark Mode
![Dark Mode](./public/screenshots/dark-mode.png)

### Mobile Responsive
![Mobile View](./public/screenshots/mobile-view.png)

### Login Page
![Login Page](./public/screenshots/login-page.png)

### Admin Dashboard
![Admin Dashboard](./public/screenshots/admin-dashboard.png)

### PowerShell Setup Script
![PowerShell Setup](./public/screenshots/powershell-setup-demo.png)

### PowerShell Menu System
![PowerShell Menu](./public/screenshots/powershell-menu-demo.png)

### PowerShell Progress Tracking
![PowerShell Progress](./public/screenshots/powershell-progress-demo.png)

---

## 🚀 Features

### News Ticker Marquee
- **Multi-Category Support**: AI, Geopolitics, Cybersecurity, and General news
- **Color-Coded Categories**: Each category has unique colors and icons
- **Speed Controls**: Slow, Normal, and Fast scrolling options
- **Pause/Play**: Stop the ticker to read headlines at your own pace
- **Infinite Loop**: Seamless continuous scrolling animation
- **Responsive Design**: Works perfectly on desktop and mobile

### Blog System
- **Markdown Support**: Write posts in markdown with full syntax highlighting
- **Video Embeds**: Embed YouTube, Vimeo, and TikTok videos in posts
- **Expandable Cards**: Click to expand/collapse full post content
- **Code Blocks**: Syntax highlighting for code snippets
- **Publication Dates**: Automatic timestamps for each post
- **Excerpt Support**: Short previews for each post

### Links & Resources
- **Categorized Links**: Organize by GitHub, Blog, News, and Other
- **Visual Icons**: Category-specific icons for easy identification
- **External Link Support**: Opens in new tab with proper security attributes

### Authentication & Permissions
- **Role-Based Access Control (RBAC)**: Admin, Reviewer, and User roles
- **Hardcoded Admin**: Quick admin access without database setup
- **Session Management**: Secure session handling
- **Protected Routes**: Role-based route protection

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **shadcn/ui** | Beautiful UI components |
| **Prisma** | Database ORM |
| **PostgreSQL** | Production database (Docker ready) |
| **Docker Compose** | Container orchestration |
| **Lucide Icons** | Beautiful open-source icons |
| **react-markdown** | Markdown rendering |

---

## 📁 Project Structure

```
personal-blog/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication API routes
│   │   │   ├── posts/         # Blog posts API
│   │   │   ├── links/         # External links API
│   │   │   └── news/          # News ticker API
│   │   ├── login/             # Login page
│   │   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── NewsMarquee.tsx    # News ticker component
│   │   ├── BlogSection.tsx    # Blog posts display
│   │   ├── LinksSection.tsx   # External links
│   │   └── auth/              # Authentication components
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── auth.ts            # Auth utilities
│   │   └── permissions.ts     # Role permissions
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── .env                       # Environment variables
└── package.json               # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun**
- **Docker** (for PostgreSQL database)
- **PowerShell 5.1+** (for Windows auto-setup)
- npm, yarn, or bun

---

## ⚡ Quick Setup (Windows)

### Automated PowerShell Setup

Run the included PowerShell setup script for automatic configuration:

```powershell
# Run from the project directory
./setup.ps1
```

![PowerShell Setup Demo](./public/screenshots/powershell-setup-demo.png)

The script provides:
- **Quick Setup** - Fully automated with sensible defaults
- **Manual Setup** - Guided step-by-step configuration
- **Docker Management** - Start/stop/restart database
- **System Status** - View current setup state
- **Testing** - Verify installation
- **Progress Tracking** - Visual progress bar with real-time feedback

### Setup Features

| Feature | Description |
|---------|-------------|
| 🔐 **Credentials** | Auto-creates default admin/reviewer/user accounts |
| 🗄️ **Database** | Installs & configures PostgreSQL via Docker or standalone |
| ⚙️ **Configuration** | Generates .env with database connection |
| 📦 **Dependencies** | Installs npm/bun packages automatically |
| 🧪 **Testing** | Validates API endpoints and connectivity |
| 📊 **Logging** | Full setup log saved to `logs/` folder |

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

---

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/141stfighterwing-collab/personal-blog.git
   cd personal-blog
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   The default `.env` is pre-configured for Docker PostgreSQL.

4. **Start PostgreSQL database** (Docker)
   ```bash
   docker-compose up -d
   ```
   
   This starts:
   - **PostgreSQL** on port `5432`
   - **Adminer** (DB UI) on port `8080`

5. **Run database migrations**
   ```bash
   bun run db:push
   # or
   npx prisma db push
   ```

6. **Seed the database** (creates sample data)
   ```bash
   curl http://localhost:3000/api/seed
   ```

7. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

8. **Open in browser**
   - **App**: http://localhost:3000
   - **Database UI**: http://localhost:8080

---

## 🗄️ Database Options

### 🏆 PostgreSQL (Recommended - Included)

This project uses **PostgreSQL** as the primary database. It's the best choice for:
- ✅ Production-ready performance
- ✅ Full Prisma support
- ✅ JSON/JSONB queries
- ✅ Full-text search
- ✅ Concurrent connections

**Start with Docker:**
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
| [PlanetScale](https://planetscale.com) | 1 row | MySQL-compatible |

See [DATABASE.md](./DATABASE.md) for detailed setup instructions.

### SQLite (Development Only)

For quick local testing without Docker:
```env
DATABASE_URL="file:./db/custom.db"
```
Then run `bun run db:push`. **Not recommended for production.**

---

## 🔐 Authentication & Roles

### Default Users

The system comes with pre-configured users for immediate access. **Credentials are stored in `credentials.txt` which is generated during setup.**

> ⚠️ **IMPORTANT**: Delete `credentials.txt` immediately after changing the default passwords!

**Quick Reference:**

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features |
| **Reviewer** | Can view and edit content |
| **User** | Read-only access |

For complete credentials, check the `credentials.txt` file in your project directory.

### Role Permissions

| Permission | Admin | Reviewer | User |
|------------|:-----:|:--------:|:----:|
| View blog posts | ✅ | ✅ | ✅ |
| View news ticker | ✅ | ✅ | ✅ |
| View links | ✅ | ✅ | ✅ |
| Create posts | ✅ | ✅ | ❌ |
| Edit posts | ✅ | ✅ | ❌ |
| Delete posts | ✅ | ❌ | ❌ |
| Manage news items | ✅ | ✅ | ❌ |
| Manage links | ✅ | ✅ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Access admin panel | ✅ | ❌ | ❌ |

### Login

Navigate to `/login` and enter your credentials to access role-specific features.

---

## 📝 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/session` | Get current session |

### Blog Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all published posts | No |
| POST | `/api/posts` | Create a new post | Reviewer+ |
| PUT | `/api/posts/:id` | Update a post | Reviewer+ |
| DELETE | `/api/posts/:id` | Delete a post | Admin |

### News Items

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/news` | Get all active news | No |
| POST | `/api/news` | Create news item | Reviewer+ |
| PUT | `/api/news/:id` | Update news item | Reviewer+ |
| DELETE | `/api/news/:id` | Delete news item | Admin |

### External Links

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/links` | Get all links | No |
| POST | `/api/links` | Create a link | Reviewer+ |
| PUT | `/api/links/:id` | Update a link | Reviewer+ |
| DELETE | `/api/links/:id` | Delete a link | Admin |

---

## 📰 Live RSS News Feeds

The news ticker now pulls **real-time news** from RSS feeds instead of hardcoded content!

### RSS Sources

| Category | Sources |
|----------|---------|
| 🤖 **AI** | TechCrunch AI, VentureBeat AI, OpenAI Blog, Google AI Blog |
| 🌍 **Geopolitics** | BBC World, Reuters World, Al Jazeera |
| 🛡️ **Cybersecurity** | BleepingComputer, The Record, Dark Reading, Krebs on Security |
| ✨ **General** | Hacker News, Dev.to |

### RSS API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rss` | Get all RSS news items |
| DELETE | `/api/rss` | Clear RSS cache |

### Customize RSS Sources

Edit `src/lib/rss/config.ts` to add/remove feeds:

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
  // Add your own feeds here...
]
```

### RSS Features
- ⏱️ **5-minute cache** - Reduces API calls
- 🔄 **Auto-refresh** - Feeds update automatically
- 🎯 **Manual refresh** - Click refresh button
- 🛡️ **Graceful fallback** - Shows cached data if feeds fail

---

## 🎨 Customization

### Adding News Headlines

**Via API:**
```bash
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "🚀 Your headline here",
    "category": "ai",
    "url": "https://optional-link.com"
  }'
```

**Via Database:**
Edit the seed file at `src/app/api/seed/route.ts` and run the seed endpoint.

### Adding Blog Posts

**Via API:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "slug": "my-new-post",
    "content": "# Hello World\n\nThis is markdown content!",
    "excerpt": "A brief description",
    "published": true
  }'
```

### Changing News Ticker Speed

Edit `src/components/NewsMarquee.tsx`:
```typescript
const speedOptions = [
  { label: 'Slow', value: 60 },    // 60 seconds per loop
  { label: 'Normal', value: 35 },  // 35 seconds per loop
  { label: 'Fast', value: 20 },    // 20 seconds per loop
]
```

### Modifying Role Permissions

Edit `src/lib/permissions.ts` to customize what each role can access.

---

## 🌙 Dark Mode

The application supports dark mode out of the box using `next-themes`. The theme automatically follows the user's system preference, and can be toggled manually.

---

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** controls
- **Adaptive layouts** for all screen sizes

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# PostgreSQL (Docker - Default)
DATABASE_URL="postgresql://bloguser:blogpass@localhost:5432/blogdb?schema=public"
DIRECT_DATABASE_URL="postgresql://bloguser:blogpass@localhost:5432/blogdb?schema=public"

# Session Secret (generate a random 32+ char string)
SESSION_SECRET="your-super-secret-key-change-in-production"

# Production (Supabase example)
# DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
# DIRECT_DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
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

### Manual Deployment

```bash
bun run build
bun run start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

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
