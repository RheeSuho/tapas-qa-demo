import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { GnbPage } from '../pages/GnbPage';

const { When, Then } = createBdd();

When('검색창에 {string}을 입력한다', async ({ page }, keyword: string) => {
  const gnb = new GnbPage(page);
  await gnb.search(keyword);
});

When('검색창에 {string}을 입력한다', async ({ page }, keyword: string) => {
  const gnb = new GnbPage(page);
  await gnb.search(keyword);
});

When('검색 결과에서 첫 번째 작품을 클릭한다', async ({ page }) => {
  // Click the first series link in results — excludes banner/ad links
  await page.locator('a[href*="/series/"]').first().click();
});

Then('검색 결과 페이지로 이동된다', async ({ page }) => {
  await expect(page).toHaveURL(/\/search/);
});

Then('검색 결과 목록이 노출된다', async ({ page }) => {
  await expect(page.locator('a[href*="/series/"]').first()).toBeVisible();
});

Then('시리즈 페이지로 이동된다', async ({ page }) => {
  // Clicking a series may redirect directly to the viewer — verify /series/ path
  await expect(page).toHaveURL(/\/series\//i);
});
