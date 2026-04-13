# 🚀 Getting Started

> Everything you need to set up a local development environment for Sentinel Nexus, from prerequisites to your first blog post.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development Workflow](#development-workflow)
- [Common Tasks](#common-tasks)
- [Project Structure](#project-structure)
- [Troubleshooting FAQ](#troubleshooting-faq)

---

## Prerequisites

Before you begin, ensure your system meets the following requirements:

### Required Software

| Software | Minimum Version | Recommended Version | Check Command |
|----------|----------------|---------------------|---------------|
| Node.js | 18.0.0 | 20.x LTS | `node --version` |
| npm | 9.0.0 | 10.x | `npm --version` |
| Git | 2.30.0 | 2.40+ | `git --version` |

### Optional Software

| Software | Purpose | Check Command |
|----------|---------|---------------|
| Docker | Containerized builds and testing | `docker --version` |
| Docker Compose | Multi-container orchestration | `docker-compose --version` |
| Browser | For Playwright E2E testing | `playwright --version` |
| VS Code | Recommended IDE with extensions | — |

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "yzhang.markdown-all-in-one",
    "ms-playwright.playwright",
    "orta.vscode-jest"
  ]
}
```

### System Requirements

- **RAM:** 4 GB minimum, 8 GB recommended
- **Disk Space:** 2 GB free for `node_modules` and build output
- **OS:** macOS 12+, Ubuntu 20.04+, Fedora 38+, or Windows 10/11 (WSL2 recommended on Windows)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/141stfighterwing-collab/personal-blog.git
cd personal-blog
```

### Step 2: Install Dependencies

```bash
npm install
```

This command reads `package.json` and `package-lock.json`, downloading all required dependencies into `node_modules/`.

> **Tip:** If you encounter permission errors on Linux/macOS, do **not** use `sudo`. Instead, fix your npm global prefix:
> ```bash
> mkdir ~/.npm-global
> npm config set prefix '~/.npm-global'
> export PATH=~/.npm-global/bin:$PATH
> ```

### Step 3: Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local configuration. See the table below for available variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SITE_URL` | Base URL for the site | `http://localhost:3000` | Yes |
| `NEXT_PUBLIC_SITE_TITLE` | Display name of the blog | `Sentinel Nexus` | No |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Meta description | — | No |
| `NEXT_PUBLIC_ANALYTICS_ID` | Analytics tracking ID | — | No |
| `NEXT_PUBLIC_SEARCH_ENABLED` | Enable client-side search | `true` | No |

### Step 4: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Sentinel Nexus homepage with sample blog posts.

### Step 5: Verify the Installation

Run the test suite to confirm everything is working:

```bash
# Run unit tests
npm run test

# Run E2E tests (requires Playwright browsers)
npx playwright install
npm run test:e2e
```

---

## Development Workflow

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload (port 3000) |
| `npm run build` | Create production build |
| `npm run start` | Serve production build locally (port 3000) |
| `npm run lint` | Run ESLint on all source files |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run Jest unit tests |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |
| `npm run test:all` | Run all test suites |
| `npm run type-check` | Run TypeScript type checking |

### Daily Development Cycle

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start development server
npm run dev

# 4. Make changes in src/ or content/

# 5. Run linting and formatting
npm run lint:fix && npm run format

# 6. Run tests before committing
npm run test

# 7. Commit and push
git add .
git commit -m "feat: description of changes"
git push origin your-branch-name
```

### Branch Naming Convention

| Type | Prefix | Example |
|------|--------|---------|
| Feature | `feat/` | `feat/dark-mode-toggle` |
| Bug fix | `fix/` | `fix/rss-date-format` |
| Documentation | `docs/` | `docs/api-reference` |
| Refactor | `refactor/` | `refactor/post-card-component` |
| Test | `test/` | `test/playwright-accessibility` |
| Chore | `chore/` | `chore/update-dependencies` |

---

## Common Tasks

### Creating a New Blog Post

1. Create a new `.md` file in `src/content/posts/`:

```bash
touch src/content/posts/2025-01-15-my-new-post.md
```

2. Add frontmatter and content:

```markdown
---
title: "My New Blog Post"
date: "2025-01-15"
tags:
  - tutorial
  - nextjs
excerpt: "A brief summary of what this post covers."
coverImage: "/images/my-post-cover.jpg"
---

# My New Blog Post

This is the introduction paragraph...

## Section One

Content goes here...

```typescript
const greeting = "Hello, World!";
console.log(greeting);
```
```

3. View it at `http://localhost:3000/posts/my-new-post` (slug auto-generated from filename).

### Adding a New Page

1. Create a new file in `src/pages/`:

```typescript
// src/pages/projects.tsx
import Layout from '../components/layout/Layout';

export default function ProjectsPage() {
  return (
    <Layout title="Projects">
      <h1>My Projects</h1>
      <p>A collection of things I've built.</p>
    </Layout>
  );
}
```

2. Visit `http://localhost:3000/projects`.

### Adding a New Component

1. Create the component file:

```typescript
// src/components/shared/Badge.tsx
interface BadgeProps {
  label: string;
  variant?: 'default' | 'primary' | 'success';
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${variants[variant]}`}>
      {label}
    </span>
  );
}
```

2. Use it in any page or component:

```typescript
import Badge from '../components/shared/Badge';

<Badge label="New" variant="primary" />
```

### Updating Styles

Sentinel Nexus uses Tailwind CSS. To customize the theme:

1. Edit `tailwind.config.ts` to extend colors, fonts, spacing, etc.
2. Use utility classes directly in your components.
3. For global styles, edit `src/styles/globals.css`.
4. For typography, edit `src/styles/typography.css`.

---

## Project Structure

For a detailed breakdown of the component hierarchy, see [[Architecture]].

```
personal-blog/
├── src/
│   ├── components/       # React UI components
│   ├── content/          # Markdown blog posts (.md)
│   ├── lib/              # Utility functions and helpers
│   ├── pages/            # Next.js pages and API routes
│   └── styles/           # CSS and Tailwind config
├── public/               # Static assets (images, favicon, etc.)
├── tests/                # Test suites (Playwright, iteration runners)
├── docs/wiki/            # This documentation (GitHub Wiki source)
├── .env.example          # Template environment variables
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── next.config.js        # Next.js configuration
├── Dockerfile            # Docker build configuration
├── docker-compose.yml    # Docker Compose services
├── vercel.json           # Vercel deployment configuration
├── playwright.config.ts  # Playwright test configuration
└── package.json          # Project manifest and scripts
```

---

## Troubleshooting FAQ

### Installation Issues

**Q: `npm install` fails with `EACCES` permission error**

A: Do not use `sudo`. Fix npm ownership:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```
Add the export line to `~/.bashrc` or `~/.zshrc` to make it permanent.

**Q: `node-gyp` build errors on Linux**

A: Install the build toolchain:
```bash
sudo apt-get install build-essential
```

**Q: `npm install` is very slow**

A: Switch to a faster registry mirror:
```bash
npm config set registry https://registry.npmmirror.com
```

### Development Server Issues

**Q: Port 3000 is already in use**

A: Kill the existing process or use a different port:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a custom port
PORT=4000 npm run dev
```

**Q: Changes are not reflecting in the browser**

A: Try clearing the Next.js cache:
```bash
rm -rf .next
npm run dev
```

**Q: Hot reload is not working after installing a new package**

A: Restart the development server after installing new dependencies.

### Build Issues

**Q: TypeScript compilation errors after pulling changes**

A: Run type checking and fix issues:
```bash
npm run type-check
npm run lint:fix
```

**Q: Production build fails with out-of-memory error**

A: Increase Node.js memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Test Issues

**Q: Playwright browser not found**

A: Install Playwright browsers:
```bash
npx playwright install --with-deps
```

**Q: E2E tests fail on different screen sizes**

A: Ensure your Playwright config includes the correct viewport sizes. See [[Testing]] for details.

**Q: Flaky tests that pass/fail intermittently**

A: Increase test timeouts in `playwright.config.ts`:
```typescript
use: {
  timeout: 30000,  // 30 seconds
}
```

### Docker Issues

**Q: Docker build fails at the `npm install` step**

A: Clear Docker cache and rebuild:
```bash
docker builder prune
docker compose build --no-cache
```

**Q: Container starts but site is unreachable**

A: Check port mapping and container logs:
```bash
docker compose logs sentinel-nexus
curl http://localhost:3000
```

---

*For architecture details, see [[Architecture]]. For testing, see [[Testing]]. For deployment, see [[Deployment]].*
