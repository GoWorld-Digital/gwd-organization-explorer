import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader"],
});
const out = "docs/screenshots";
await mkdir(out, { recursive: true });
const url = process.env.EXPLORER_URL || "http://127.0.0.1:3000";
async function open(page) {
  if (process.env.EXPLORER_BUILD_FILES === "1") {
    await page.route(url + "/**", async (route) => {
      const pathname = new URL(route.request().url()).pathname;
      const file =
        pathname === "/"
          ? ".next/server/app/index.html"
          : pathname.startsWith("/_next/static/")
            ? ".next/static/" + pathname.slice(14)
            : null;
      if (!file) return route.fulfill({ status: 404, body: "" });
      const contentType = file.endsWith(".js")
        ? "application/javascript"
        : file.endsWith(".css")
          ? "text/css"
          : "text/html";
      await route.fulfill({ body: await readFile(file), contentType });
    });
  }
  await page.goto(url);
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
  await page.getByRole("button", { name: "Reset view" }).click();
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
  await page.getByRole("button", { name: "2D", exact: true }).click();
  await page.locator(".outline button").nth(1).click();
  await page.getByText("design principle", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Source catalogue" }).click();
  assert.equal(await page.locator("article").count(), 18);
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
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    isMobile: true,
    hasTouch: true,
  });
  await open(mobile);
  await mobile.locator(".outline button").first().tap();
  await mobile.getByRole("heading", { name: "Governance" }).waitFor();
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
  const tablet = await browser.newPage({
    viewport: { width: 768, height: 1024 },
  });
  await open(tablet);
  await tablet.locator(".outline button").last().click();
  await tablet.screenshot({ path: out + "/tablet.png", fullPage: true });
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
    "PASS desktop WebGL, five layers, keyboard reset, 2D, attribution, context loss, mobile touch and reduced motion",
  );
} finally {
  await browser.close();
}
