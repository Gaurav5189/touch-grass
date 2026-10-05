import { test, expect } from '@playwright/test';

test('Bird ID page loads', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.locator('h2').filter({ hasText: 'Bird Call Identification' })).toBeVisible();
});
