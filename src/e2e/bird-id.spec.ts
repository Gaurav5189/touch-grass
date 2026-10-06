import { test, expect } from '@playwright/test';

test('Bird ID page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2').filter({ hasText: 'Bird Call Identification' })).toBeVisible();
});
