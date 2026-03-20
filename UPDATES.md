# Update Notes

Detailed notes for each update, including migration guides, breaking changes, and new features.

---

## Update 1.1.0 - PostgreSQL Migration

**Release Date:** March 17, 2026  
**Type:** Major Database Change

### 🚨 Breaking Changes

#### Database Migration Required
If you were using SQLite, you need to migrate your data:

```bash
# Option 1: Export data from SQLite before migrating
# (Manual export/import required)

# Option 2: Start fresh with PostgreSQL
docker-compose up -d
bun run db:push
bun run db:seed
```

#### Environment Variables Changed
Update your `.env` file:

```env
# OLD (SQLite)
DATABASE_URL="file:./db/custom.db"

# NEW (PostgreSQL)
DATABASE_URL="postgresql://bloguser:blogpass@localhost:5432/blogdb?schema=public"
DIRECT_DATABASE_URL="postgresql://bloguser:blogpass@localhost:5432/blogdb?schema=public"
```

### 🆕 New Features

#### Docker Compose Setup
PostgreSQL and Adminer are now available via Docker:

```bash
# Start services
bun run docker:up

# Stop services
bun run docker:down

# Reset everything (WARNING: deletes all data)
bun run docker:reset
```

#### Adminer Database UI
Access your database visually:
- URL: http://localhost:8080
- Login with credentials from `.env`

#### New NPM Scripts
| Script | Description |
|--------|-------------|
| `docker:up` | Start PostgreSQL container |
| `docker:down` | Stop PostgreSQL container |
| `docker:reset` | Reset database (delete all data) |
| `docker:logs` | View PostgreSQL logs |
| `db:studio` | Open Prisma Studio |
| `db:seed` | Seed sample data via API |

### 📊 Database Improvements

#### Added Indexes
Performance indexes on frequently queried columns:
- `BlogPost`: `published`, `createdAt`
- `NewsItem`: `isActive`, `category`
- `ExternalLink`: `category`

#### Schema Updates
```prisma
// Added directUrl support for connection pooling
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

### 🔄 Migration Guide

#### From SQLite to PostgreSQL

1. **Backup your data** (if needed)
   ```bash
   # Export your SQLite data manually
   ```

2. **Update dependencies**
   ```bash
   bun install
   ```

3. **Start PostgreSQL**
   ```bash
   docker-compose up -d
   ```

4. **Update environment**
   ```bash
   cp .env.example .env
   # Edit .env if using different credentials
   ```

5. **Push schema and seed**
   ```bash
   bun run db:push
   bun run db:seed
   ```

#### From Cloud Database

Just update your `.env` with your cloud database URL:
```env
DATABASE_URL="your-cloud-database-url"
DIRECT_DATABASE_URL="your-cloud-database-direct-url"
```

---

## Update 1.0.0 - Authentication System

**Release Date:** March 17, 2026  
**Type:** Major Feature Release

### 🆕 New Features

#### Authentication System
- Login page at `/login`
- Session management with cookies
- Secure logout functionality

#### Role-Based Access Control
Three user roles with different permissions:

| Role | Create | Edit | Delete | Admin Panel |
|------|--------|------|--------|-------------|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Reviewer | ✅ | ✅ | ❌ | ❌ |
| User | ❌ | ❌ | ❌ | ❌ |

#### Hardcoded Demo Users
```
admin / admin123     → Full access
reviewer / review123 → Create & Edit
user / user123       → Read only
```

#### Admin Dashboard
- View statistics (posts, news, links counts)
- Quick action cards
- Permission overview
- Access at `/admin` (admin only)

### 🔧 Technical Changes

#### New Files
```
src/
├── app/
│   ├── login/page.tsx
│   ├── admin/page.tsx
│   └── api/auth/
│       ├── login/route.ts
│       ├── logout/route.ts
│       └── session/route.ts
├── components/auth/
│   ├── UserMenu.tsx
│   └── RequireAuth.tsx
├── contexts/
│   └── AuthContext.tsx
└── lib/
    ├── auth/index.ts
    └── permissions.ts
```

#### New Dependencies
- No new npm packages (uses built-in Next.js features)

### 🎨 UI Changes

#### Header
- Added user menu button (replaces "Welcome" text)
- Shows username and role badge when logged in
- "Sign In" button when logged out

#### User Menu
- Dropdown with user info
- Role badge with color coding
- Quick links to admin (if applicable)
- Logout button

#### Login Page
- Clean login form
- Demo credentials displayed
- Error handling with visual feedback
- Loading states

---

## Update 0.1.0 - Initial Release

**Release Date:** March 17, 2026  
**Type:** Initial Release

### 🆕 Initial Features

#### News Ticker
- Scrolling headlines marquee
- Color gradient background
- Basic animation

#### Blog Section
- Static blog post cards
- Expandable content
- Basic styling

#### Links Section
- External link cards
- Category grouping
- GitHub link

#### Core Setup
- Next.js 16 with App Router
- TypeScript configuration
- Tailwind CSS
- shadcn/ui components
- Prisma ORM with SQLite
- Basic project structure

---

## Version Upgrade Guide

### Checking Your Version

Check your current version in `package.json`:
```json
{
  "version": "1.1.0"
}
```

### Upgrading from Any Version

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Update environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Update database**
   ```bash
   docker-compose up -d
   bun run db:push
   bun run db:seed
   ```

5. **Restart application**
   ```bash
   bun run dev
   ```

---

## Support

If you encounter issues during an update:

1. Check the [CHANGELOG.md](./CHANGELOG.md) for breaking changes
2. Review this UPDATES.md for migration guides
3. Check [GitHub Issues](https://github.com/141stfighterwing-collab/personal-blog/issues)
4. Create a new issue if needed
