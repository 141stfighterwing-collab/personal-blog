import { test, Page } from '@playwright/test'
import path from 'path'

const screenshotDir = path.join(process.cwd(), 'public', 'screenshots')

// Helper to save screenshots
async function saveScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: path.join(screenshotDir, `${name}.png`),
    fullPage: true
  })
}

test.describe('Blog Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for app to be ready
    await page.goto('/', { waitUntil: 'networkidle' })
    // Wait for seed to complete
    await page.waitForTimeout(2000)
  })

  test('capture home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="news-marquee"]', { timeout: 10000 }).catch(() => {})
    await page.waitForTimeout(1000)
    await saveScreenshot(page, 'home-page')
  })

  test('capture news ticker', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1500)
    // Close the marquee to show the controls
    const ticker = page.locator('[data-testid="news-marquee"]')
    if (await ticker.isVisible()) {
      await saveScreenshot(page, 'news-ticker')
    }
  })

  test('capture news ticker controls', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1500)
    // Try to find and click pause button to show controls
    const pauseBtn = page.locator('button').filter({ hasText: /pause|play/i }).first()
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click()
    }
    await page.waitForTimeout(500)
    await saveScreenshot(page, 'news-ticker-controls')
  })

  test('capture blog section', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    // Make sure blog tab is active
    const blogTab = page.locator('[data-state="inactive"][value="blog"]').first()
    if (await blogTab.isVisible()) {
      await blogTab.click()
    }
    await page.waitForTimeout(500)
    await saveScreenshot(page, 'blog-section')
  })

  test('capture links section', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)
    // Click on links tab - use the button with text "Links & Resources"
    const linksTab = page.getByRole('tab', { name: /links/i })
    await linksTab.click()
    await page.waitForTimeout(500)
    await saveScreenshot(page, 'links-section')
  })

  test('capture dark mode', async ({ page }) => {
    // Set dark mode preference
    await page.addStyleTag({
      content: `
        html { color-scheme: dark; }
        body { background-color: rgb(17, 24, 39); }
      `
    })
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.waitForTimeout(2000)
    await saveScreenshot(page, 'dark-mode')
  })

  test('capture mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForTimeout(2000)
    await saveScreenshot(page, 'mobile-view')
  })

  test('capture login page', async ({ page }) => {
    await page.goto('/login')
    await page.waitForTimeout(1000)
    await saveScreenshot(page, 'login-page')
  })

  test('capture admin dashboard', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.waitForTimeout(500)
    
    // Fill login form
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Wait for redirect to home
    await page.waitForTimeout(2000)
    
    // Go to admin
    await page.goto('/admin')
    await page.waitForTimeout(1500)
    await saveScreenshot(page, 'admin-dashboard')
  })

  test('capture page builder', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.waitForTimeout(500)
    
    await page.fill('input[type="text"]', 'admin')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
    
    // Go to page builder
    await page.goto('/admin/pages/new')
    await page.waitForTimeout(1500)
    await saveScreenshot(page, 'page-builder')
  })
})
