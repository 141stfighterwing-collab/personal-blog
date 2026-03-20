import { test, Page } from '@playwright/test'
import path from 'path'

const screenshotDir = path.join(process.cwd(), 'public', 'themes')

// Helper to save screenshots
async function saveScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: path.join(screenshotDir, `${name}.png`),
    fullPage: true
  })
}

test.describe('Theme Screenshots', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    
    // Navigate and wait for app to be ready
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await page.waitForTimeout(3000) // Wait for seed and RSS to load
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('capture Twenty Ten theme', async () => {
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(2000)
    
    // Click theme button to open dialog
    await page.click('button:has-text("Theme")')
    await page.waitForTimeout(500)
    
    // Click on Twenty Ten theme
    await page.click('button:has-text("Twenty Ten")')
    await page.waitForTimeout(1000)
    
    // Close dialog by clicking outside or pressing escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    
    // Take screenshot
    await saveScreenshot(page, 'twenty-ten-screenshot')
    console.log('✓ Twenty Ten screenshot captured')
  })

  test('capture Twenty Eleven theme', async () => {
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(2000)
    
    // Click theme button to open dialog
    await page.click('button:has-text("Theme")')
    await page.waitForTimeout(500)
    
    // Click on Twenty Eleven theme
    await page.click('button:has-text("Twenty Eleven")')
    await page.waitForTimeout(1000)
    
    // Close dialog
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    
    // Take screenshot
    await saveScreenshot(page, 'twenty-eleven-screenshot')
    console.log('✓ Twenty Eleven screenshot captured')
  })

  test('capture Twenty Twelve theme', async () => {
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(2000)
    
    // Click theme button to open dialog
    await page.click('button:has-text("Theme")')
    await page.waitForTimeout(500)
    
    // Click on Twenty Twelve theme
    await page.click('button:has-text("Twenty Twelve")')
    await page.waitForTimeout(1000)
    
    // Close dialog
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    
    // Take screenshot
    await saveScreenshot(page, 'twenty-twelve-screenshot')
    console.log('✓ Twenty Twelve screenshot captured')
  })
})
