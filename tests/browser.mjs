import { serveBuiltSite } from './offline-site.mjs';
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || (existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe') ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined),
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
});
const out = "docs/screenshots";
await mkdir(out, { recursive: true });
const url = process.argv[2] || process.env.EXPLORER_URL || "http://127.0.0.1:3000";
async function open(page) {
  await serveBuiltSite(page, url);
  await page.goto(url + "/architecture");
}
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  await page.locator("canvas[data-ready]").waitFor();
  await page.waitForFunction(
    () => document.querySelector("canvas")?.width > 300,
  );
  await page.waitForTimeout(1100);
  await page.screenshot({ path: out + "/desktop.png" });

  // Experience 1: 3D Organization Explorer, skippable intro, layer & unit selection
  const canvas = page.locator("canvas");
  const anchor = page.locator(".callout").filter({ hasText: "Governance" });
  const point = await anchor.evaluate((el) => {
    const rect = el.getBoundingClientRect(),
      css = getComputedStyle(el);
    return {
      x: rect.x - parseFloat(css.left),
      y: rect.y - parseFloat(css.top),
    };
  });
  await page.mouse.click(point.x, point.y);
  await page
    .getByRole("heading", { name: "Governance", exact: true })
    .waitFor();
  await canvas.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("+");
  await page.getByRole("button", { name: "↺ Reset view" }).click();

  const layers = page
    .getByRole("navigation", { name: "Organizational layers" })
    .getByRole("button");
  for (const layer of await layers.all()) {
    await layer.click();
    assert.equal(await layer.getAttribute("aria-pressed"), "true");
    assert.ok(
      await page
        .getByRole("complementary")
        .getByText("Units & mandates")
        .isVisible(),
    );
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: out + "/selected.png" });
  await page.keyboard.press("Escape");
  await page.getByRole("heading", { name: "Organizational model" }).waitFor();

  // 2D representation
  await page.getByRole("button", { name: "2D", exact: true }).click();
  await page.locator(".outline button").nth(1).click();
  await page.getByText("design principle", { exact: true }).waitFor();

  // Experience 2: Agency Agents Source Catalogue (search & filter)
  await page.getByRole("button", { name: "Source catalogue" }).click();
  assert.equal(await page.locator(".catalog-grid article").count(), 18);
  await page.screenshot({ path: out + "/catalog.png" });
  const searchInput = page.getByRole("searchbox", {
    name: "Search capability divisions",
  });
  await searchInput.fill("Spatial Computing");
  assert.equal(await page.locator(".catalog-grid article").count(), 1);
  await searchInput.fill("");
  assert.equal(await page.locator(".catalog-grid article").count(), 18);

  // Experience 3: Mission Simulator (3 scenarios + execution steps + human approval gates)
  await page.getByRole("button", { name: "Missions", exact: true }).click();
  await page
    .getByRole("heading", {
      name: "Launch a digital learning product in two markets",
    })
    .waitFor();
  assert.equal(await page.locator(".scenario-btn").count(), 3);
  await page.locator(".step-card").nth(4).click();
  await page.getByText("Finance & Legal Sign-Off Authority").waitFor();
  await page.screenshot({ path: out + "/missions.png" });
  await page.locator(".scenario-btn").nth(1).click();
  await page
    .getByRole("heading", {
      name: "Orchestrate a multi-channel thought-leadership and growth campaign",
    })
    .waitFor();

  // Experience 4: Business Simulator (deterministic inputs & immediate recalculation)
  await page
    .getByRole("button", { name: "Business simulator", exact: true })
    .click();
  await page.locator(".preset-buttons button").first().click();
  assert.equal(
    await page.getByTestId("kpi-gross-revenue").textContent(),
    "$144,000",
  );
  const custInput = page.getByRole("spinbutton", {
    name: "Customers numeric input",
  });
  await custInput.fill("200");
  assert.equal(
    await page.getByTestId("kpi-gross-revenue").textContent(),
    "$240,000",
  );
  await page.screenshot({ path: out + "/finance.png" });
  await page.getByRole("button", { name: "↺ Reset preset inputs" }).click();
  assert.equal(
    await page.getByTestId("kpi-gross-revenue").textContent(),
    "$144,000",
  );

  // Experience 5: Ventures & Innovation (5 Labs + Venture Studio, stage gates)
  await page
    .getByRole("button", { name: "Ventures & labs", exact: true })
    .click();
  assert.equal(await page.locator(".venture-card").count(), 6);
  await page.screenshot({ path: out + "/ventures.png" });
  await page.locator(".stage-gate-card").nth(1).click(); // 02 / Research
  assert.equal(await page.locator(".venture-card").count(), 2);
  await page
    .getByRole("button", {
      name: /Show all Labs & Venture Studio/,
    })
    .click();
  assert.equal(await page.locator(".venture-card").count(), 6);

  // Return to Organization 3D & test WebGL context loss fallback
  await page.getByRole("button", { name: "Organization", exact: true }).click();
  await page.getByRole("button", { name: "3D", exact: true }).click();
  await page.locator("canvas[data-ready]").waitFor();
  await page.evaluate(() =>
    document
      .querySelector("canvas")
      .getContext("webgl2")
      .getExtension("WEBGL_lose_context")
      .loseContext(),
  );
  await page
    .getByRole("status")
    .filter({ hasText: "3D is unavailable" })
    .waitFor();
  await page.screenshot({ path: out + "/fallback.png" });

  // Mobile viewport (390x844, reduced motion, touch, no horizontal overflow)
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    isMobile: true,
    hasTouch: true,
  });
  await open(mobile);
  await mobile.locator(".outline button").first().tap();
  await mobile
    .getByRole("heading", { name: "Governance", exact: true })
    .waitFor();
  assert.equal(await mobile.locator("canvas").count(), 0);
  assert.equal(
    await mobile
      .getByRole("button", { name: "Reduced motion · On" })
      .getAttribute("aria-pressed"),
    "true",
  );
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await mobile.screenshot({ path: out + "/mobile.png", fullPage: true });

  // Tablet viewport (768x1024)
  const tablet = await browser.newPage({
    viewport: { width: 768, height: 1024 },
  });
  await open(tablet);
  await tablet.locator(".outline button").last().click();
  await tablet.screenshot({ path: out + "/tablet.png", fullPage: true });

  // Blocked WebGL2 initialization fallback
  const blocked = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await blocked.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === "webgl2" ? null : original.call(this, type, ...args);
    };
  });
  await open(blocked);
  await blocked
    .getByRole("status")
    .filter({ hasText: "3D is unavailable" })
    .waitFor();
  assert.equal(await blocked.locator(".outline button").count(), 5);
  assert.deepEqual(errors, []);
  console.log(
    "PASS all 5 experiences (3D/2D Organization, 18/283 Catalogue search/filter, 3 Missions + Human Gates, Deterministic Business Simulator, 5 Labs + Ventures), context loss, mobile touch and reduced motion",
  );
} finally {
  await browser.close();
}
