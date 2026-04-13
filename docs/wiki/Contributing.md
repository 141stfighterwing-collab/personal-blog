# 🤝 Contributing

> Guidelines for contributing to Sentinel Nexus. We welcome contributions of all kinds — code, documentation, bug reports, and ideas.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Convention](#commit-message-convention)
- [Issue Reporting](#issue-reporting)
- [Recognition](#recognition)

---

## Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members
- Helping others learn and grow

**Examples of unacceptable behavior:**

- The use of sexualized language or imagery
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project maintainers. All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances.

---

## How to Contribute

### Ways to Contribute

| Type | Description | Effort |
|------|-------------|--------|
| 🐛 Bug Reports | Report issues you find | Low |
| 📖 Documentation | Improve wiki, README, code comments | Low |
| 🎨 Design | Improve UI/UX, accessibility | Medium |
| 💻 Code | Fix bugs, add features, optimize | Medium–High |
| 🧪 Testing | Write new tests, improve coverage | Medium |
| 🌍 Translation | Translate content to other languages | Medium |
| 💡 Ideas | Propose features and improvements | Low |

### Getting Started

1. **Fork the repository**

   ```bash
   # On GitHub, click "Fork" on the repository page
   # Then clone your fork:
   git clone https://github.com/YOUR_USERNAME/personal-blog.git
   cd personal-blog
   ```

2. **Add the upstream remote**

   ```bash
   git remote add upstream https://github.com/141stfighterwing-collab/personal-blog.git
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

4. **Make your changes and commit** (follow [Commit Convention](#commit-message-convention))

   ```bash
   git add .
   git commit -m "feat: add dark mode toggle"
   ```

5. **Keep your branch up to date**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push and create a Pull Request**

   ```bash
   git push origin feat/your-feature-name
   # Then open a PR on GitHub
   ```

### Finding Good First Issues

Look for issues labeled:
- `good first issue` — Great for newcomers
- `help wanted` — The maintainers need community help
- `documentation` — Documentation improvements
- `bug` — Confirmed bugs to fix
- `enhancement` — New feature requests

---

## Pull Request Process

### PR Checklist

Before submitting a PR, ensure all of the following:

- [ ] The branch name follows the [naming convention](#getting-started)
- [ ] All existing tests pass (`npm run test:all`)
- [ ] New features include appropriate tests
- [ ] Code follows the [coding standards](#coding-standards)
- [ ] Commit messages follow the [convention](#commit-message-convention)
- [ ] Documentation is updated (README, wiki, code comments)
- [ ] No `console.log` or debug statements remain
- [ ] No new linting warnings are introduced

### PR Template

When creating a Pull Request, use this template:

```markdown
## Description

Brief description of what this PR does and why.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would break existing functionality)
- [ ] Documentation update
- [ ] Refactor (code change that neither fixes a bug nor adds a feature)
- [ ] Test coverage improvement

## Related Issues

Closes #ISSUE_NUMBER

## Testing

Describe the testing performed:
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Screenshots

If applicable, add screenshots demonstrating the change.

## Checklist

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No secrets or sensitive data committed
```

### Review Process

1. **Automated Checks** — CI runs type checking, linting, and all tests
2. **Code Review** — At least one maintainer reviews the code
3. **Feedback** — Reviewer may request changes, which should be addressed
4. **Approval** — PR is approved and merged by a maintainer
5. **Squash Merge** — PRs are typically squash-merged to `main` for clean history

### Merge Policies

| Scenario | Policy |
|----------|--------|
| Bug fixes | Squash merge to `main` |
| New features | Squash merge to `main` after review |
| Documentation | Squash merge to `main` |
| Breaking changes | Requires discussion in issue first, then PR |
| Hotfixes | Direct merge to `main`, backport if needed |

---

## Coding Standards

### TypeScript

```typescript
// ✅ DO: Use explicit types for function parameters and return values
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US');
}

// ✅ DO: Use interfaces for object shapes
interface Post {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  tags: string[];
  content: string;
}

// ❌ DON'T: Use `any` type
function processData(data: any) { ... }

// ✅ DO: Use proper generic types
function processData<T>(data: T): T { ... }
```

### React / JSX

```typescript
// ✅ DO: Use functional components with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-${variant}`}
      onClick={onClick}
      aria-label={label}
    >
      {label}
    </button>
  );
}

// ✅ DO: Use semantic HTML
<article>
  <header>
    <h1>Post Title</h1>
    <time dateTime="2025-01-15">January 15, 2025</time>
  </header>
  <p>Post content...</p>
</article>

// ❌ DON'T: Use divs for everything
<div>
  <div>Post Title</div>
  <div>January 15, 2025</div>
  <div>Post content...</div>
</div>
```

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase `.tsx` | `PostCard.tsx` |
| Utilities | camelCase `.ts` | `formatDate.ts` |
| Test files | Same as source + `.test` | `formatDate.test.ts` |
| Styles | kebab-case `.css` | `typography.css` |
| Markdown posts | kebab-case `.md` | `2025-01-15-my-post.md` |
| Pages | camelCase or kebab-case `.tsx` | `about.tsx`, `rss.xml.ts` |

### Import Order

```typescript
// 1. React / Next.js imports
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 2. Third-party libraries
import { motion } from 'framer-motion';

// 3. Internal components (absolute paths)
import Layout from '@/components/layout/Layout';
import PostCard from '@/components/blog/PostCard';

// 4. Internal utilities
import { formatDate } from '@/lib/formatDate';
import { getPosts } from '@/lib/posts';

// 5. Types
import type { Post } from '@/types/post';

// 6. Styles
import styles from '@/styles/page.module.css';
```

### Tailwind CSS Conventions

```typescript
// ✅ DO: Use Tailwind utility classes
<div className="flex items-center gap-4 p-6 rounded-lg bg-white dark:bg-gray-900 shadow-md">

// ✅ DO: Use responsive prefixes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ✅ DO: Use dark mode variant
<h1 className="text-2xl font-bold text-gray-900 dark:text-white">

// ❌ DON'T: Use arbitrary values when standard utilities exist
<div className="mt-[16px]">       // Bad
<div className="mt-4">            // Good

// ❌ DON'T: Use inline styles when Tailwind covers it
<div style={{ color: 'red' }}>    // Bad
<div className="text-red-500">   // Good
```

---

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(search): add client-side search` |
| `fix` | Bug fix | `fix(rss): correct date format in feed` |
| `docs` | Documentation only | `docs(readme): update installation steps` |
| `style` | Formatting, no logic change | `style(button): add spacing classes` |
| `refactor` | Code restructuring | `refactor(posts): extract sorting logic` |
| `perf` | Performance improvement | `perf(images): add lazy loading` |
| `test` | Adding or updating tests | `test(e2e): add navigation tests` |
| `chore` | Build, tooling, deps | `chore(deps): update Next.js to 14.1` |
| `ci` | CI/CD changes | `ci(github): add Docker test job` |

### Examples

```bash
feat(dark-mode): implement theme toggle with localStorage persistence

The theme toggle now saves user preference to localStorage
and respects system preferences via prefers-color-scheme.

Closes #42

fix(pagination): prevent duplicate posts on page boundaries

When filtering by tag, pagination was including posts from
the previous page due to an off-by-one error in the slice
calculation.

docs(wiki): add deployment guide with Docker and Vercel instructions
```

---

## Issue Reporting

### Bug Reports

When reporting a bug, include the following:

```markdown
## Bug Description

Clear description of the bug.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- OS: [e.g., Ubuntu 22.04, macOS 14, Windows 11]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node.js version: [e.g., 20.10.0]
- Project version/commit: [e.g., v1.0.0, abc1234]

## Screenshots

If applicable, add screenshots to help explain the problem.

## Additional Context

Any other context about the problem (logs, error messages, etc.).
```

### Feature Requests

```markdown
## Feature Description

Clear description of the proposed feature.

## Problem It Solves

Why is this feature needed? What problem does it solve?

## Proposed Solution

How would you like this feature to work? Include any API designs,
UI mockups, or configuration examples.

## Alternatives Considered

Any alternative approaches you've considered.

## Additional Context

Any other context (references, prior art, etc.).
```

### Issue Labels

| Label | Meaning |
|-------|---------|
| `bug` | Confirmed bug |
| `enhancement` | Feature request |
| `good first issue` | Great for first-time contributors |
| `help wanted` | Community help needed |
| `documentation` | Documentation improvement |
| `question` | Support question |
| `wontfix` | Issue will not be addressed |
| `duplicate` | Duplicate of another issue |
| `priority: high` | High priority |
| `priority: low` | Low priority |

---

## Recognition

We deeply appreciate every contribution, no matter how small. Contributors are recognized in:

- **CHANGELOG.md** — Listed alongside the changes they contributed
- **GitHub Contributors page** — Automatically tracked by GitHub
- **Release Notes** — Credited for specific features and fixes

Thank you for helping make Sentinel Nexus better! 🎉

---

*For development setup, see [[Getting-Started]]. For testing, see [[Testing]]. For the project overview, see [[Home]].*
