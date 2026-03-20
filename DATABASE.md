# Database Options Guide

This document explains the best free SQL database options for this project.

## 🏆 Recommended: PostgreSQL

**Why PostgreSQL is the best choice:**
- ✅ **Most feature-rich** open-source database
- ✅ **Best Prisma support** - First-class citizen
- ✅ **Production-ready** - Used by major companies
- ✅ **Free forever** - Open source MIT-like license
- ✅ **Great Docker support** - Official images available
- ✅ **JSON support** - Can use as document store too
- ✅ **Full-text search** - Built-in search capabilities
- ✅ **Extensions** - PostGIS for geospatial, pgvector for AI

---

## 📊 Free SQL Database Comparison

| Database | Best For | Docker | Cloud Free Tier | Prisma Support | Production Ready |
|----------|----------|--------|-----------------|----------------|------------------|
| **PostgreSQL** ⭐ | Everything | ✅ Excellent | ✅ Multiple options | ✅ Best | ✅ Yes |
| **MySQL** | Web apps, WordPress | ✅ Good | ✅ Multiple options | ✅ Good | ✅ Yes |
| **MariaDB** | MySQL alternative | ✅ Good | ✅ Some options | ✅ Good | ✅ Yes |
| **SQLite** | Dev, small apps | ❌ Not needed | ❌ N/A (file-based) | ✅ Good | ⚠️ Limited |
| **CockroachDB** | Distributed apps | ✅ Good | ✅ Generous free tier | ✅ Good | ✅ Yes |

---

## 🐘 PostgreSQL Setup Options

### Option 1: Docker (Recommended for Development)

**Pros:**
- Complete control over your data
- No internet required
- Matches production environment
- Easy to reset/recreate

**Setup:**
```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Or with Docker directly
docker run -d \
  --name postgres-blog \
  -e POSTGRES_USER=bloguser \
  -e POSTGRES_PASSWORD=blogpass \
  -e POSTGRES_DB=blogdb \
  -p 5432:5432 \
  postgres:16-alpine
```

### Option 2: Supabase (Recommended for Production - FREE)

**Pros:**
- 500MB free database
- Built-in authentication
- Real-time subscriptions
- Auto backups
- Dashboard UI

**Setup:**
1. Go to [supabase.com](https://supabase.com)
2. Create free project
3. Get connection string from Settings > Database
4. Add to `.env`:
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
   ```

### Option 3: Neon (Serverless PostgreSQL - FREE)

**Pros:**
- 3GB free storage
- Serverless - scales to zero
- Branch feature (like git for DB)
- Auto-scaling

**Setup:**
1. Go to [neon.tech](https://neon.tech)
2. Create free project
3. Copy connection string
4. Add to `.env`

### Option 4: Railway (FREE Tier)

**Pros:**
- 1GB free PostgreSQL
- Easy deployment
- Good for hobby projects

**Setup:**
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Get connection string

---

## 💾 Current Setup

This project uses **PostgreSQL** with Docker for development and supports any PostgreSQL-compatible cloud provider for production.

### Local Development (Docker)
```bash
# Start database
docker-compose up -d

# Run migrations
bun run db:push

# Seed data
curl http://localhost:3000/api/seed
```

### Production (Cloud)
Just change the `DATABASE_URL` in your environment variables to point to your cloud database.

---

## 🔧 Database Schema

The current schema supports:
- **BlogPost** - Markdown blog posts
- **NewsItem** - News ticker items with categories
- **ExternalLink** - Links to external resources
- **User** - User accounts with roles (ADMIN, REVIEWER, USER)

---

## 🚀 Quick Start Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d

# View PostgreSQL logs
docker-compose logs postgres

# Connect to PostgreSQL CLI
docker exec -it postgres-blog psql -U bloguser -d blogdb
```

---

## 📈 When to Upgrade from SQLite

Consider upgrading from SQLite to PostgreSQL when:
- ✅ Multiple users writing simultaneously
- ✅ Need full-text search
- ✅ Production deployment
- ✅ Need JSON/JSONB queries
- ✅ Want connection pooling
- ✅ Need database extensions
