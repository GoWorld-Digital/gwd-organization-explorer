import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { serveBuiltSite } from './offline-site.mjs';
const base = process.argv[2] || process.env.EXPLORER_URL || 'http://127.0.0.1:3000';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || (existsSync(chrome) ? chrome : undefined), args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const out = 'docs/screenshots/immersion';
await mkdir(out, { recursive: true });
const errors = [];
const checks = [];
async function createPage(options) {
  const page = await browser.newPage({ reducedMotion: 'reduce', ...options });
  await serveBuiltSite(page, base);
  page.on('pageerror', error => errors.push(error.message));
  return page;
}
async function ready(page, scene) {
  await page.waitForFunction(id => { const img = document.querySelector('.scene-art[src="/scenes/' + id + '.webp"]'); return img?.complete && img.naturalWidth > 0; }, scene);
}
try {
  const page = await createPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(base + '/?lang=pt#governance'); await ready(page, 'governance');
  await page.getByRole('button', { name: 'Explorar o conselho', exact: true }).click();
  await page.getByRole('dialog', { name: 'Governança', exact: true }).waitFor();
  await page.locator('.dossier-index').getByRole('button', { name: /Conselho de Administração/ }).click();
  assert.ok(await page.locator('details[open]').getByText(/Definir propósito institucional/).isVisible());
  await page.getByRole('button', { name: 'Leitura ampliada', exact: true }).click();
  assert.ok(await page.locator('.comfort-reading').isVisible());
  await page.screenshot({ path: out + '/dossier-pt.png' });
  await page.keyboard.press('Escape');
  await page.getByRole('combobox').filter({ visible: true }).selectOption('fr');
  assert.equal(await page.locator('html').getAttribute('lang'), 'fr');
  assert.ok(page.url().includes('lang=fr'));
  await page.getByRole('button', { name: 'Rechercher dans l’expérience', exact: true }).click();
  await page.getByRole('searchbox').fill('securite');
  await page.getByRole('button', { name: /Sécurité et Gouvernance des Données/ }).click();
  await page.getByRole('dialog', { name: 'Services partagés', exact: true }).waitFor();
  assert.ok(await page.locator('details[open]').getByText(/Assurer l’architecture de cybersécurité/).isVisible());
  await page.keyboard.press('Escape');
  await page.reload();
  assert.equal(await page.getByRole('combobox').filter({ visible: true }).inputValue(), 'fr');
  checks.push('PT/FR dossiers, accent-insensitive search, URL and preference persistence');

  await page.goto(base + '/architecture?lang=fr#finance');
  await page.getByRole('heading', { name: 'Simulateur d’Architecture d’Entreprise', exact: true }).waitFor();
  const revenue = await page.locator('.kpi-card').first().innerText();
  await page.getByRole('spinbutton', { name: 'Nombre de clients', exact: true }).fill('150');
  assert.notEqual(await page.locator('.kpi-card').first().innerText(), revenue);
  await page.getByRole('combobox').selectOption('en');
  await page.getByRole('heading', { name: 'Business Architecture Simulator', exact: true }).waitFor();
  assert.equal(await page.getByRole('spinbutton', { name: 'Customers numeric input', exact: true }).inputValue(), '150');
  await page.screenshot({ path: out + '/analysis-en.png', fullPage: true });
  checks.push('French/English analysis, interactive inputs and unchanged state on language switch');

  for (const scene of ['governance', 'executive', 'shared-services', 'business-units', 'labs']) {
    await page.goto(base + '/?lang=en#' + scene); await ready(page, scene);
    await page.getByRole('button', { name: 'Explore in 3D', exact: false }).filter({ visible: true }).click();
    await page.locator('.spatial-stage canvas[data-ready]').waitFor();
    await page.getByRole('button', { name: 'Top view', exact: true }).click();
    await page.getByRole('button', { name: 'Close view', exact: true }).click();
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await page.getByRole('button', { name: 'Reset camera', exact: true }).click();
    await page.locator('.spatial-details nav button').first().click();
    await page.screenshot({ path: out + '/spatial-' + scene + '.png' });
    await page.getByRole('button', { name: /Open dossier/ }).click();
    await page.locator('.unit-list details[open]').waitFor();
    await page.keyboard.press('Escape');
  }
  checks.push('All five WebGL architectural studies, camera controls, selection and dossier transition');

  for (const [name, width, height] of [['phone', 390, 844], ['tablet', 768, 1024], ['tablet-landscape', 1180, 820], ['small-phone', 320, 640]]) {
    const touch = await createPage({ viewport: { width, height }, isMobile: true, hasTouch: true });
    await touch.goto(base + '/?lang=pt#labs'); await ready(touch, 'labs');
    assert.ok(await touch.locator('.mobile-content').isVisible());
    assert.ok(await touch.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await touch.getByRole('button', { name: 'Todos os ambientes', exact: true }).tap();
    await touch.locator('.environment-menu').getByRole('button', { name: /Câmara do Conselho/ }).tap();
    await ready(touch, 'governance');
    await touch.getByRole('button', { name: 'Explorar o conselho', exact: true }).tap();
    await touch.getByRole('dialog', { name: 'Governança', exact: true }).waitFor();
    assert.ok(await touch.locator('dialog').evaluate(el => el.scrollWidth <= el.clientWidth));
    await touch.getByRole('button', { name: 'Fechar painel', exact: true }).tap();
    await touch.screenshot({ path: out + '/' + name + '.png', fullPage: true });
    await touch.close();
  }
  checks.push('Touch navigation and readable dossiers at 320/390/768/1180 widths');

  const fallback = await createPage({ viewport: { width: 1440, height: 900 } });
  await fallback.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
  await fallback.goto(base + '/?lang=fr#labs'); await ready(fallback, 'labs');
  await fallback.getByRole('button', { name: /Explorer en 3D/ }).filter({ visible: true }).click();
  await fallback.getByText(/Le rendu spatial est indisponible/).waitFor();
  await fallback.locator('.spatial-details nav button').first().click();
  await fallback.getByRole('button', { name: /Ouvrir le dossier/ }).click();
  await fallback.locator('details[open]').waitFor();
  checks.push('No-WebGL French fallback retains unit selection and dossiers');
  assert.deepEqual(errors, []);
  await writeFile(out + '/verification.json', JSON.stringify({ date: '2026-11-09', mode: process.env.EXPLORER_BUILD_FILES === '1' ? 'offline production files in Chrome' : 'HTTP server in Chrome', checks, errors }, null, 2) + '\n');
  console.log('PASS ' + checks.join('; '));
} finally { await browser.close(); }
