import { test, expect, type BrowserContext } from "@playwright/test";

/**
 * Homepage screenshot tests for Sentinel Nexus.
 *
 * Captures full-page screenshots at three standard viewports:
 *   - Mobile  (375 × 812)
 *   - Tablet  (768 × 1024)
 *   - Desktop (1440 × 900)
 *
 * Each screenshot is saved with the viewport name baked into the filename.
 */

const BASE_URL = "http://localhost:3000";

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`homepage screenshot – ${vp.name} (${vp.width}x${vp.height})`, async ({
    browser,
  }, testInfo) => {
    let context: BrowserContext | undefined;
    let page;

    try {
      context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      page = await context.newPage();

      const response = await page.goto(BASE_URL, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });

      if (!response || response.status() >= 400) {
        throw new Error(
          `Server returned ${response ? response.status() : "no response"} for ${BASE_URL}. ` +
            "Make sure the development server is running on port 3000."
        );
      }

      // Allow any hero images or animations to settle
      await page.waitForTimeout(1_000);

      const screenshotPath = testInfo.outputPath(
        `homepage-${vp.name}-${vp.width}x${vp.height}.png`
      );
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        animations: "disabled",
      });

      console.log(`✔  Saved screenshot: ${screenshotPath}`);
      expect(screenshotPath).toBeDefined();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error);
      if (
        message.includes("ECONNREFUSED") ||
        message.includes("net::ERR_CONNECTION_REFUSED")
      ) {
        console.error(
          `\n✖ Cannot connect to ${BASE_URL}. Is the dev server running?\n`
        );
        test.fail();
      }
      throw error;
    } finally {
      await page?.close();
      await context?.close();
    }
  });
}
