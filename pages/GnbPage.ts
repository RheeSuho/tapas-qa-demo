import { Page, expect } from '@playwright/test';

export class GnbPage {
  constructor(private page: Page) {}

  async clickTab(label: string) {
    switch (label) {
      case 'Comics':
        await this.page.locator('a[href^="/menu/2"]').first().click();
        break;
      case 'Novels':
        await this.page.locator('a[href^="/menu/3"]').first().click();
        break;
      case 'Login':
        // GNB Login button may not appear when already logged in
        const loginBtn = this.page.getByRole('button', { name: /^log ?in$/i }).last();
        if ((await loginBtn.count()) > 0) {
          await loginBtn.click();
        } else {
          await this.page.goto('/account/signin');
        }
        break;
      case 'Profile':
        await this.page.locator('button:has(img[alt="profile image"])').click();
        break;
      default:
        await this.page.getByRole('link', { name: label }).click();
    }
  }

  async clickLogo() {
    await this.page.locator('a[href="/"]').first().click();
  }

  async search(keyword: string) {
    // Tapas uses an input for search, not a button
    await this.page.getByPlaceholder('Search').click();
    await this.page.getByPlaceholder('Search').fill(keyword);
    await this.page.keyboard.press('Enter');
  }
}
