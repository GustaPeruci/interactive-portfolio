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
  // Use a fresh document: Tab must reach the skip link as the first focusable element.
  await page.goto('/');
  const skip = page.locator('.skip-link');
  const initialBox = await skip.boundingBox();
  expect(initialBox, 'Skip link should exist in the layout').not.toBeNull();
  expect(initialBox.y + initialBox.height, 'Skip link must start above the viewport').toBeLessThanOrEqual(0);
  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  await expect.poll(async () => (await skip.boundingBox())?.y ?? -999).toBeGreaterThanOrEqual(0);
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
});

test('language and theme preferences survive a reload', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('portfolio-language')) localStorage.setItem('portfolio-language', 'pt');
    if (!localStorage.getItem('portfolio-theme')) localStorage.setItem('portfolio-theme', 'dark');
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#lang').click();
  await page.locator('#theme').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('portfolio-language'))).toBe('en');
  expect(await page.evaluate(() => localStorage.getItem('portfolio-theme'))).toBe('light');
});

test('resume download and professional contact links are available', async ({ page, request }) => {
  await page.addInitScript(() => { localStorage.setItem('portfolio-language', 'pt'); });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  const resume = page.locator('#contact a[download]');
  await expect(resume).toHaveAttribute('href', 'CRV_GCPA.pdf');
  await expect(resume).toHaveAttribute('download', 'Curriculo_Gustavo_Assis.pdf');
  const response = await request.get('/CRV_GCPA.pdf');
  expect(response.ok(), 'Resume PDF must be publicly served').toBeTruthy();
  expect(response.headers()['content-type']).toContain('pdf');
  const pdf = await response.body();
  expect(pdf.subarray(0, 5).toString('ascii'), 'Resume must contain actual PDF bytes').toBe('%PDF-');
  const downloadPromise = page.waitForEvent('download');
  await resume.click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Curriculo_Gustavo_Assis.pdf');
  expect(await download.failure()).toBeNull();
  await expect(page.locator('#contact a[href*="linkedin.com/in/"]')).toHaveCount(1);
  await page.locator('#lang').click();
  await expect(resume).toContainText('Download résumé');
});

test('public professional profile metadata is consistent', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://gustaperuci.github.io/interactive-portfolio/');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Gustavo Assis/);
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /Full Stack/);
  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  const profile = JSON.parse(jsonLd);
  expect(profile['@type']).toBe('Person');
  expect(profile.name).toBe('Gustavo Assis');
  expect(profile.sameAs).toContain('https://github.com/GustaPeruci');
  expect(profile.sameAs).toContain('https://www.linkedin.com/in/gustavo-conceição-peruci-de-assis');
});
