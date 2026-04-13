# 🧪 Testing

> Comprehensive testing documentation for Sentinel Nexus. Covers the test framework stack, running tests locally, multi-environment iteration testing, result interpretation, writing new tests, and CI/CD integration.

---

## Table of Contents

- [Test Framework Overview](#test-framework-overview)
- [Running Tests Locally](#running-tests-locally)
- [Test Iteration Environments](#test-iteration-environments)
- [Test Results Interpretation](#test-results-interpretation)
- [Adding New Tests](#adding-new-tests)
- [CI/CD Integration Guide](#cicd-integration-guide)
- [Test Strategy](#test-strategy)

---

## Test Framework Overview

Sentinel Nexus uses a dual testing strategy combining **unit tests** (Jest) and **end-to-end tests** (Playwright).

### Testing Stack

| Layer | Framework | Purpose | Location |
|-------|-----------|---------|----------|
| Unit Tests | Jest + React Testing Library | Component logic, utilities, pure functions | `src/**/*.test.ts(x)` |
| E2E Tests | Playwright | Full page rendering, user flows, accessibility | `tests/screenshots/*.spec.ts` |
| Integration Tests | Playwright | API endpoints, RSS feeds, search | `tests/screenshots/*.spec.ts` |
| Lint Tests | ESLint | Code quality, style enforcement | All `src/` files |
| Type Tests | TypeScript Compiler | Type safety validation | All `.ts`/`.tsx` files |

### Test Pyramid

```
            ╱╲
           ╱  ╲            E2E Tests
          ╱    ╲           (Playwright)
         ╱──────╲          Few, slow, high confidence
        ╱        ╲
       ╱ Integration╲     Integration Tests
      ╱              ╲    (Playwright API)
     ╱────────────────╲
    ╱                  ╲
   ╱    Unit Tests      ╲  Unit Tests
  ╱                       ╲ (Jest + RTL)
 ╱─────────────────────────╲ Many, fast, focused
```

### Jest Configuration

The Jest configuration is defined in `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Playwright Configuration

The Playwright configuration is defined in `tests/playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './screenshots',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Running Tests Locally

### Unit Tests (Jest)

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npx jest src/lib/posts.test.ts

# Run tests matching a pattern
npx jest --testNamePattern="should sort posts by date"

# Run tests and update snapshots
npx jest --updateSnapshot
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install --with-deps

# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI mode (interactive)
npm run test:e2e:ui

# Run a specific test file
npx playwright test tests/screenshots/homepage.spec.ts

# Run tests in a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=mobile

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run with trace viewer
npx playwright show-trace trace.zip
```

### Run All Tests

```bash
# Run every test suite sequentially
npm run test:all

# This typically runs:
# 1. TypeScript type checking
# 2. ESLint linting
# 3. Jest unit tests
# 4. Playwright E2E tests
```

---

## Test Iteration Environments

Sentinel Nexus is tested across multiple environments to ensure consistent behavior. The `tests/iterations/` directory contains scripts that simulate different deployment targets.

### Environment Matrix

| Environment | Script | OS Simulation | Purpose |
|-------------|--------|---------------|---------|
| Ubuntu 22.04 | `linux-run-1.sh` | Ubuntu 22.04 LTS | Primary Linux target |
| Fedora 39 | `linux-run-2.sh` | Fedora 39 | Secondary Linux target |
| Docker | `docker-run.sh` | Alpine-based container | Container runtime verification |
| Windows | `windows-run.sh` | Windows Server 2022 | Windows compatibility |

### Running Iteration Tests

```bash
# Run a single iteration
bash tests/iterations/linux-run-1.sh

# Run all iterations sequentially
bash tests/iterations/run-all-iterations.sh
```

### Iteration Test Structure

Each iteration script follows this pattern:

```bash
#!/usr/bin/env bash
# tests/iterations/linux-run-1.sh — Ubuntu 22.04 simulation

set -euo pipefail

echo "=== Sentinel Nexus Test Iteration: Ubuntu 22.04 ==="
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# 1. Environment checks (Node.js, npm, git)
# 2. Dependency installation
# 3. Build verification
# 4. Unit test execution
# 5. E2E test execution
# 6. Result collection
# 7. Summary report
```

### Test Results

Results are collected in `tests/results/`:

```
tests/results/
├── linux-1.log        # Ubuntu 22.04 results
├── linux-2.log        # Fedora 39 results
├── docker.log         # Docker container results
├── windows.log        # Windows results
└── summary.csv        # Aggregated results in CSV format
```

### CSV Summary Format

```csv
Environment,Status,Unit Tests,E2E Tests,Build Time,Total Time
Ubuntu 22.04,PASSED,42/42,18/18,12.3s,45.7s
Fedora 39,PASSED,42/42,18/18,11.8s,43.2s
Docker,PASSED,42/42,18/18,14.1s,48.5s
Windows,PASSED,42/42,18/18,15.6s,52.1s
```

---

## Test Results Interpretation

### Jest Output

```
PASS  src/lib/posts.test.ts
  getPostsByTag()
    ✓ should return posts matching the given tag (5 ms)
    ✓ should return empty array for non-existent tag (1 ms)
    ✓ should be case-insensitive (2 ms)
  sortPostsByDate()
    ✓ should sort posts in descending date order (1 ms)
    ✓ should handle posts with the same date (1 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.245 s
```

### Playwright Output

```
Running 18 tests using 3 workers

  ✓ [chromium] › homepage.spec.ts:14:3 › should display the site title (2s)
  ✓ [chromium] › homepage.spec.ts:21:3 › should show recent blog posts (3s)
  ✓ [chromium] › blog-posts.spec.ts:12:3 › should render post content (4s)
  ✗ [firefox]  › accessibility.spec.ts:8:3 › should pass WCAG checks (5s)

  1) [firefox] accessibility.spec.ts:8:3 › should pass WCAG checks
     Error: expect(received).toHaveAttribute("alt")
       Received: <img src="/images/cover.jpg">

  17 passed | 1 failed
  18 total
  Time:     12.456s
```

### Coverage Report

After running `npm run test:coverage`, open `coverage/index.html` in your browser:

| Metric | Target | Description |
|--------|--------|-------------|
| Statement Coverage | ≥ 80% | Percentage of statements executed |
| Branch Coverage | ≥ 80% | Percentage of `if/else` branches taken |
| Function Coverage | ≥ 80% | Percentage of functions called |
| Line Coverage | ≥ 80% | Percentage of source lines hit |

---

## Adding New Tests

### Writing a Unit Test

```typescript
// src/lib/formatDate.test.ts
import { formatDate, formatReadingTime } from './formatDate';

describe('formatDate', () => {
  it('should format a date string to human-readable form', () => {
    const result = formatDate('2025-01-15');
    expect(result).toBe('January 15, 2025');
  });

  it('should handle different date formats', () => {
    expect(formatDate('2025-01-15T10:30:00Z')).toBe('January 15, 2025');
  });

  it('should throw on invalid input', () => {
    expect(() => formatDate('not-a-date')).toThrow('Invalid date');
  });
});

describe('formatReadingTime', () => {
  it('should calculate reading time from word count', () => {
    const text = 'word '.repeat(300);
    expect(formatReadingTime(text)).toBe('2 min read');
  });

  it('should return 1 min for short content', () => {
    expect(formatReadingTime('Hello world')).toBe('1 min read');
  });
});
```

### Writing an E2E Test

```typescript
// tests/screenshots/blog-navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Blog Navigation', () => {
  test('should navigate from homepage to a blog post', async ({ page }) => {
    await page.goto('/');
    
    // Click the first blog post card
    const firstPost = page.locator('.post-card').first();
    const postTitle = await firstPost.locator('h2').textContent();
    await firstPost.click();
    
    // Verify the post page loaded
    await expect(page.locator('h1')).toContainText(postTitle!);
    await expect(page).toHaveURL(/\/posts\//);
  });

  test('should filter posts by tag', async ({ page }) => {
    await page.goto('/');
    
    // Click a tag filter
    const tagButton = page.locator('.tag-filter', { hasText: 'tutorial' });
    await tagButton.click();
    
    // Verify only matching posts are shown
    const visiblePosts = page.locator('.post-card');
    const count = await visiblePosts.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      await expect(visiblePosts.nth(i)).toContainText('tutorial');
    }
  });

  test('should have working pagination', async ({ page }) => {
    await page.goto('/posts');
    
    // Go to next page
    const nextButton = page.locator('[aria-label="Next page"]');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await expect(page).toHaveURL(/page=2/);
    }
  });
});
```

### Writing an Accessibility Test

```typescript
// tests/screenshots/accessibility.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('homepage should have valid heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    
    // First heading should be h1
    await expect(headings.first()).toHaveText(/.+/);
    await expect(headings.first()).toHaveAttribute('aria-level', '1');
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should be navigable by keyboard', async ({ page }) => {
    await page.goto('/');
    
    // Tab through the page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Verify navigation occurred
    await expect(page).toHaveURL(/\/posts\//);
  });
});
```

---

## CI/CD Integration Guide

### GitHub Actions Workflow

Sentinel Nexus uses GitHub Actions for continuous integration. The workflow runs on every push and pull request:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test -- --coverage
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-${{ matrix.node-version }}
          path: coverage/
      
      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Multi-Environment CI Matrix

```yaml
jobs:
  multi-env-test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-22.04, ubuntu-latest]
        node-version: [20.x]
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test:all
```

### Docker CI Testing

```yaml
jobs:
  docker-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t sentinel-nexus:test .
      
      - name: Run tests in container
        run: |
          docker run --rm \
            -e CI=true \
            sentinel-nexus:test \
            npm run test:all
```

---

## Test Strategy

### What to Test

| Area | Test Type | Priority |
|------|-----------|----------|
| Markdown → HTML pipeline | Unit | High |
| Post sorting and filtering | Unit | High |
| Date formatting utilities | Unit | High |
| RSS feed generation | Unit + Integration | High |
| Search index building | Unit | Medium |
| Page rendering | E2E | High |
| Navigation flows | E2E | High |
| Responsive layouts | E2E | High |
| Accessibility (a11y) | E2E | High |
| Dark/light theme toggle | E2E | Medium |
| Performance metrics | E2E | Medium |
| SEO meta tags | E2E | Medium |
| External link attributes | Unit + E2E | Low |

### What NOT to Test

- Third-party library internals (e.g., how Tailwind generates CSS)
- Next.js framework behavior (trust the framework)
- Static asset file existence (covered by build step)
- Browser rendering specifics beyond your control

---

*For development setup, see [[Getting-Started]]. For deployment, see [[Deployment]]. For contributing, see [[Contributing]].*
