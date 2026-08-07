/* Visual regression screenshots at desktop/tablet/mobile breakpoints.
   Screenshots land in test/visual/. Compare against baselines manually
   or via an external diff tool; the suite asserts the captures succeed. */
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'visual');
fs.mkdirSync(OUT, { recursive: true });

async function startCareer(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.locator('#screen-setup:not(.hidden)')).toBeVisible();
  await page.locator('#inp-name').fill('Visual Test');
  await page.locator('.pitch-pos[data-pos="ST"]').click();
  await page.locator('.country-btn[data-country="AR"]').click();
  await page.locator('.start-btn').click();
  await expect(page.locator('#screen-game:not(.hidden)')).toBeVisible();
}

for (const [label, width, height] of [
  ['desktop', 1280, 720],
  ['tablet', 768, 1024],
  ['mobile', 375, 812],
] as const) {
  test(`screenshot ${label}: setup`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('#screen-setup:not(.hidden)')).toBeVisible();
    await page.screenshot({ path: path.join(OUT, `${label}-setup.png`), fullPage: true });
  });

  test(`screenshot ${label}: academy`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await startCareer(page);
    await expect(page.locator('.pick-grid .pick-card').first()).toBeVisible();
    await page.screenshot({ path: path.join(OUT, `${label}-academy.png`), fullPage: true });
  });

  test(`screenshot ${label}: decision`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await startCareer(page);
    await page.locator('.pick-grid .pick-card').first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, `${label}-decision.png`), fullPage: true });
  });
}
