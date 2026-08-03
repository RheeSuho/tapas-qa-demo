import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { TEST_DATA } from '../data/testData';

const { Given, When, Then } = createBdd();

Given('{string} 시리즈 페이지에 접속한다', async ({ page }, title: string) => {
  const url = TEST_DATA.SERIES_URLS[title as keyof typeof TEST_DATA.SERIES_URLS];
  await page.goto(url, { waitUntil: 'domcontentloaded' });
});

Then('작품 제목이 노출된다', async ({ page }) => {
  await expect(page.locator('h1, h2').first()).toBeVisible();
});

Then('회차 목록이 노출된다', async ({ page }) => {
  await expect(page.locator('.episode-item, [class*="episode"]').first()).toBeVisible();
});

Then('구독 버튼이 노출된다', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: /subscribe/i }).or(
      page.locator('button[class*="subscribe"]')
    ).first()
  ).toBeVisible();
});

When('첫 번째 에피소드를 클릭한다', async ({ page }) => {
  await page.locator('.episode-item, [class*="episode"]').first().click();
});

Then('에피소드 뷰어로 이동된다', async ({ page }) => {
  await expect(page).toHaveURL(/\/episode\//i);
  await expect(page.locator('.viewer, [class*="viewer"], [class*="episode-viewer"]').first()).toBeVisible();
});
