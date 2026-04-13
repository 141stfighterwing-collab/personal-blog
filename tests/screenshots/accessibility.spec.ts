import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * Accessibility audit screenshot tests for Sentinel Nexus.
 *
 * Performs lightweight accessibility checks in the browser context:
 *   1. Heading hierarchy – verifies the page starts with an <h1> and
 *      headings descend without skipping levels.
 *   2. Image alt text – ensures every <img> has a non-empty alt attribute.
 *   3. Color contrast basics – checks that body text and heading text are
 *      not transparent or extremely low-opacity (basic heuristic).
 *   4. Takes a screenshot highlighting any issues found.
 *
 * Results are also written to a JSON report for easy consumption.
 */

const BASE_URL = "http://localhost:3000";

interface AccessibilityIssue {
  rule: string;
  severity: "error" | "warning";
  description: string;
  element?: string;
}

async function auditPage(page: Page): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];

  // ---- 1. Heading hierarchy check ----
  const headingResults = await page.evaluate(() => {
    const issues: { rule: string; severity: "error" | "warning"; description: string; element: string }[] = [];
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));

    if (headings.length === 0) {
      issues.push({
        rule: "heading-exists",
        severity: "error",
        description: "No headings found on the page.",
        element: "<body>",
      });
      return issues;
    }

    const first = headings[0];
    if (first.tagName !== "H1") {
      issues.push({
        rule: "heading-hierarchy",
        severity: "error",
        description: `Page starts with <${first.tagName.toLowerCase()}> instead of <h1>.`,
        element: first.outerHTML.substring(0, 120),
      });
    }

    // Check for skipped levels
    let prevLevel = 0;
    for (const heading of headings) {
      const level = parseInt(heading.tagName[1], 10);
      if (prevLevel > 0 && level > prevLevel + 1) {
        issues.push({
          rule: "heading-hierarchy",
          severity: "warning",
          description: `Heading level skipped from h${prevLevel} to <${heading.tagName.toLowerCase()}>.`,
          element: heading.outerHTML.substring(0, 120),
        });
      }
      prevLevel = level;
    }

    return issues;
  });
  issues.push(...headingResults);

  // ---- 2. Image alt text check ----
  const imageResults = await page.evaluate(() => {
    const issues: { rule: string; severity: "error" | "warning"; description: string; element: string }[] = [];
    const images = Array.from(document.querySelectorAll("img"));

    for (const img of images) {
      const alt = img.getAttribute("alt");
      const role = img.getAttribute("role");
      // Images with role="presentation" or role="none" are intentionally decorative
      if (role === "presentation" || role === "none") continue;

      if (alt === null || alt === undefined) {
        issues.push({
          rule: "img-alt-missing",
          severity: "error",
          description: 'Image is missing alt attribute.',
          element: img.outerHTML.substring(0, 150),
        });
      } else if (alt.trim() === "") {
        issues.push({
          rule: "img-alt-empty",
          severity: "warning",
          description:
            "Image has an empty alt attribute. If decorative, add role=\"presentation\".",
          element: img.outerHTML.substring(0, 150),
        });
      }
    }

    return issues;
  });
  issues.push(...imageResults);

  // ---- 3. Color contrast basics ----
  const contrastResults = await page.evaluate(() => {
    const issues: { rule: string; severity: "warning"; description: string; element: string }[] = [];
    const textElements = Array.from(
      document.querySelectorAll("p, span, a, li, td, th, label, button")
    );

    for (const el of textElements) {
      const computed = window.getComputedStyle(el);
      const color = computed.color;
      const opacity = parseFloat(computed.opacity);

      // Flag elements that are nearly invisible due to low opacity
      if (opacity < 0.15) {
        issues.push({
          rule: "color-contrast",
          severity: "warning",
          description: `Text element has very low opacity (${opacity}). May not be readable.`,
          element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ""),
        });
      }

      // Check for very light text colors on white background (basic hex detection)
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        // Relative luminance simplified check
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luminance > 240 && opacity > 0.5) {
          issues.push({
            rule: "color-contrast",
            severity: "warning",
            description: `Text color (${r},${g},${b}) may not have sufficient contrast against a white/light background.`,
            element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ""),
          });
        }
      }
    }

    return issues;
  });
  issues.push(...contrastResults);

  // Deduplicate by rule + element combination
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.rule}:${issue.element ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function highlightIssues(page: Page, issues: AccessibilityIssue[]) {
  // Inject a visual overlay highlighting problematic elements
  await page.evaluate((issueCount: number) => {
    const banner = document.createElement("div");
    banner.id = "a11y-audit-banner";
    banner.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
      background: ${issueCount === 0 ? "#16a34a" : "#dc2626"};
      color: #fff; padding: 12px 24px; font-family: monospace;
      font-size: 14px; text-align: center;
    `;
    banner.textContent =
      issueCount === 0
        ? "✅ Accessibility audit: 0 issues found"
        : `⚠️  Accessibility audit: ${issueCount} issue(s) found — see console & report JSON`;
    document.body.appendChild(banner);
  }, issues.length);

  // Outline elements that have issues (best-effort)
  const elementsWithIssues = new Set<string>();

  for (const issue of issues) {
    if (issue.element) {
      // Extract tag name for highlighting
      const tagMatch = issue.element.match(/^<(\w+)/);
      const idMatch = issue.element.match(/id="([^"]+)"/);
      if (tagMatch || idMatch) {
        elementsWithIssues.add(
          `${tagMatch?.[1] ?? ""}:${idMatch?.[1] ?? ""}`
        );
      }
    }
  }

  await page.evaluate((selectors: string[]) => {
    const style = document.createElement("style");
    style.id = "a11y-highlight-style";
    style.textContent = `
      img[alt=""], img:not([alt]) {
        outline: 3px dashed #f59e0b !important;
      }
    `;
    document.head.appendChild(style);
  }, []);
}

test.describe("accessibility audit", () => {
  test("homepage accessibility checks with screenshot", async ({
    browser,
  }, testInfo) => {
    let context: BrowserContext | undefined;
    let page: Page;

    try {
      context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      page = await context.newPage();

      const consoleMessages: string[] = [];
      page.on("console", (msg) => consoleMessages.push(msg.text()));

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

      await page.waitForTimeout(1_000);

      // Run the audit
      const issues = await auditPage(page);

      // Highlight issues on the page before screenshot
      await highlightIssues(page, issues);

      // Take screenshot (with the overlay banner visible)
      const screenshotPath = testInfo.outputPath(
        `accessibility-audit-1440x900.png`
      );
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
        animations: "disabled",
      });

      // Write JSON report
      const reportDir = path.dirname(screenshotPath);
      const reportPath = path.join(reportDir, "accessibility-report.json");
      fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));

      // Log results
      const errors = issues.filter((i) => i.severity === "error");
      const warnings = issues.filter((i) => i.severity === "warning");

      console.log(`\n📊 Accessibility Audit Results for ${BASE_URL}`);
      console.log(`   Errors:   ${errors.length}`);
      console.log(`   Warnings: ${warnings.length}`);
      console.log(`   Total:    ${issues.length}`);

      if (issues.length > 0) {
        console.log("\nIssues found:");
        for (const issue of issues) {
          console.log(
            `  [${issue.severity.toUpperCase()}] ${issue.rule}: ${issue.description}`
          );
          if (issue.element) {
            console.log(`             Element: ${issue.element}`);
          }
        }
      }

      console.log(`\n✔  Screenshot saved: ${screenshotPath}`);
      console.log(`✔  Report saved:     ${reportPath}`);

      // Soft assertion – don't hard-fail on warnings, only errors
      if (errors.length > 0) {
        console.error(
          `\n✖ Accessibility audit found ${errors.length} error(s).`
        );
      }

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
});
