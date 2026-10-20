import { test, expect } from '@playwright/test';

test('renders without horizontal overflow and captures both themes', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('#experience')).toContainText('InfoSoft Sistemas');
  await expect(page.locator('#experience')).toContainText('WEG');
  await expect(page.locator('#pryzor-case')).toBeVisible();
  await expect(page.locator('#forge-case')).toBeVisible();
  await expect(page.locator('#opspilot-case')).toBeVisible();

  for (const theme of ['light', 'dark']) {
    const current = await page.locator('html').getAttribute('data-theme');
    if (current !== theme) await page.locator('#theme').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const dimensions = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(dimensions.document, 'No horizontal page overflow at ' + theme).toBeLessThanOrEqual(dimensions.viewport + 2);
    await page.screenshot({ path: testInfo.outputPath('portfolio-' + theme + '.png'), fullPage: true, animations: 'disabled' });
  }
  expect(errors).toEqual([]);
});

test('translation, project filters and skip link work', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('portfolio-language', 'pt'); });
  await page.goto('/');
  await page.locator('#lang').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#experience')).toContainText('Software Engineering Intern');
  await page.getByRole('button', { name: 'Data / ML' }).click();
  await expect(page.locator('.project[data-category="data"]')).toBeVisible();
  await expect(page.locator('.project[data-category="design"]')).toBeHidden();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.project[data-category="design"]')).toBeVisible();
  const skip = page.locator('.skip-link');
  await expect(skip).toBeHidden();
  await skip.focus();
  await expect(skip).toBeVisible();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
});
