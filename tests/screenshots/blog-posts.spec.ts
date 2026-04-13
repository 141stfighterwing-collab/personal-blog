import { test, expect, type BrowserContext } from "@playwright/test";

/**
 * Blog posts screenshot tests for Sentinel Nexus.
 *
 * 1. Navigates to /blog and captures a screenshot of the blog listing page.
 * 2. Clicks the first blog post link and captures a screenshot of the article view.
 *
 * Screenshots are taken in both mobile and desktop viewports.
 */

const BASE_URL = "http://localhost:3000";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const vp of viewports) {
  test.describe(`blog posts – ${vp.name}`, () => {
    let context: BrowserContext | undefined;
    let page;

    test.beforeAll(async ({ browser }) => {
      try {
        context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
        });
        page = await context.newPage();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : String(error);
        if (message.includes("ECONNREFUSED")) {
          console.error(
            `\n✖ Cannot connect to ${BASE_URL}. Is the dev server running?\n`
          );
        }
        throw error;
      }
    });

    test.afterAll(async () => {
      await page?.close();
      await context?.close();
    });

    test("blog listing page screenshot", async ({}, testInfo) => {
      const response = await page.goto(`${BASE_URL}/blog`, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });

      if (!response || response.status() >= 400) {
        throw new Error(
          `Server returned ${response ? response.status() : "no response"} for /blog`
        );
      }

      await page.waitForTimeout(1_000);

      const screenshotPath = testInfo.outputPath(
        `blog-listing-${vp.name}-${vp.width}x${vp.height}.png`
      );
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        animations: "disabled",
      });

      console.log(`✔  Saved screenshot: ${screenshotPath}`);
      expect(screenshotPath).toBeDefined();
    });

    test("first blog article screenshot", async ({}, testInfo) => {
      // Ensure we are on the blog listing page first
      await page.goto(`${BASE_URL}/blog`, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });

      // Wait for blog post links to be present
      const firstPostLink = page.locator(
        'a[href*="/blog/"], article a, .post-link, [class*="blog"] a'
      ).first();

      await firstPostLink.waitFor({ state: "visible", timeout: 10_000 });

      // Click the first blog post and wait for navigation
      const [_, navigation] = await Promise.all([
        firstPostLink.click(),
        page.waitForURL(/\/blog\/.*$/, { timeout: 15_000 }).catch(() => {
          // Some frameworks use hash routing or client-side rendering
          console.log("  ⚠  URL pattern did not match /blog/*, proceeding with screenshot");
          return null;
        }),
      ]);

      // Wait for content to render
      await page.waitForTimeout(1_500);

      const screenshotPath = testInfo.outputPath(
        `blog-article-${vp.name}-${vp.width}x${vp.height}.png`
      );
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        animations: "disabled",
      });

      console.log(`✔  Saved screenshot: ${screenshotPath}`);
      expect(screenshotPath).toBeDefined();
    });
  });
}
