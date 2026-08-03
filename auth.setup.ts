import { test as setup, expect } from '@playwright/test';
import { existsSync, statSync, writeFileSync, mkdirSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const AUTH_FILE = '.auth/user.json';
const AUTH_MAX_AGE_HOURS = 24;

setup('authenticate', async ({ page }) => {
  // CI: restore session from base64-encoded environment variable
  // Generate with: cat .auth/user.json | base64 | tr -d '\n'
  if (process.env.AUTH_STATE_B64) {
    const decoded = Buffer.from(process.env.AUTH_STATE_B64, 'base64').toString('utf-8');
    mkdirSync('.auth', { recursive: true });
    writeFileSync(AUTH_FILE, decoded);
    return;
  }

  // Local: skip login if session is still fresh (< 24h)
  if (existsSync(AUTH_FILE)) {
    const ageHours = (Date.now() - statSync(AUTH_FILE).mtimeMs) / 36e5;
    if (ageHours < AUTH_MAX_AGE_HOURS) return;
  }

  // Perform login
  await page.goto('/account/signin');
  await page.getByPlaceholder('Email').fill(process.env.USER_EMAIL!);
  await page.getByPlaceholder('Password').fill(process.env.USER_PASSWORD!);

  // Tapas has two "Log In" buttons in DOM (GNB + form) — use .last() to target the form button
  await page.getByRole('button', { name: /^log ?in$/i }).last().click();

  await expect(page).not.toHaveURL(/signin/);

  mkdirSync('.auth', { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
