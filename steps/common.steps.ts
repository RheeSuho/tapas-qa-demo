import { createBdd, Before } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { GnbPage } from '../pages/GnbPage';
import { TEST_DATA } from '../data/testData';

const { Given, When, Then } = createBdd();

Before(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

Given('홈 화면에 접속한다', async ({ page }) => {
  if (!page.url().endsWith('/') && !page.url().includes('tapas.io/')) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  }
});

When('GNB에서 {string} 탭을 클릭한다', async ({ page }, label: string) => {
  const gnb = new GnbPage(page);
  await gnb.clickTab(label);
});

When('Tapas 로고를 클릭한다', async ({ page }) => {
  const gnb = new GnbPage(page);
  await gnb.clickLogo();
});

Then('홈 화면으로 이동된다', async ({ page }) => {
  await expect(page).toHaveURL(/tapas\.io\/?$/);
  await expect(page.locator('a[href^="/menu/"]').first()).toBeVisible();
});

Then('Comics 홈 화면으로 이동된다', async ({ page }) => {
  await expect(page).toHaveURL(/\/menu\/2/);
});

Then('Novels 홈 화면으로 이동된다', async ({ page }) => {
  await expect(page).toHaveURL(/\/menu\/3/);
});

Then('작품 목록이 노출된다', async ({ page }) => {
  await expect(page.locator('a[href*="/series/"]').first()).toBeVisible();
});
