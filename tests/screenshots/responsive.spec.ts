import { test, expect, type BrowserContext } from "@playwright/test";

/**
 * Responsive design screenshot tests for Sentinel Nexus.
 *
 * Loads the homepage at five common breakpoints and captures a full-page
 * screenshot at each. This makes it easy to visually verify that the layout
 * adapts correctly across screen sizes.
 *
 * Breakpoints:
 *   - iPhone SE   (375 × 667)
 *   - iPad        (768 × 1024)
 *   - Laptop      (1366 × 768)
 *   - Desktop     (1920 × 1080)
 *   - Ultrawide   (2560 × 1080)
 */

const BASE_URL = "http://localhost:3000";

const breakpoints = [
  { name: "iphone-se", width: 375, height: 667, label: "iPhone SE" },
  { name: "ipad", width: 768, height: 1024, label: "iPad" },
  { name: "laptop", width: 1366, height: 768, label: "Laptop" },
  { name: "desktop", width: 1920, height: 1080, label: "Desktop" },
  { name: "ultrawide", width: 2560, height: 1080, label: "Ultrawide" },
];

for (const bp of breakpoints) {
  test(`responsive – ${bp.label} (${bp.width}x${bp.height})`, async ({
    browser,
  }, testInfo) => {
    let context: BrowserContext | undefined;
    let page;

    try {
      context = await browser.newContext({
        viewport: { width: bp.width, height: bp.height },
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

      // Allow animations and lazy-loaded content to settle
      await page.waitForTimeout(1_000);

      const screenshotPath = testInfo.outputPath(
        `responsive-${bp.name}-${bp.width}x${bp.height}.png`
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
