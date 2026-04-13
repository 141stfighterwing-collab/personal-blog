import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Sentinel Nexus blog platform screenshot testing.
 *
 * - Targets localhost:3000
 * - Configures mobile, tablet, and desktop viewports
 * - Captures screenshots on failure
 * - Outputs artifacts to tests/screenshots/
 */
export default defineConfig({
  testDir: "./screenshots",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["html", { open: "never", outputFolder: "screenshots/report" }], ["list"]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "on",
    video: "off",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: "Mobile Chrome",
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "Tablet",
      use: {
        viewport: { width: 768, height: 1024 },
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
      },
    },
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  outputDir: "screenshots/results",
});
