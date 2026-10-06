import { test, expect } from '@playwright/test';

test('Bird ID page loads and allows identification', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2').filter({ hasText: 'Bird Call Identification' })).toBeVisible();
});

test('Photo ID page loads with camera and gallery controls', async ({ page }) => {
  await page.goto('/#photo');
  await expect(page.locator('h2').filter({ hasText: 'Plant & Insect Identification' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Open Camera/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Import Photo/i })).toBeVisible();
});

test('Model Manager page loads with available models', async ({ page }) => {
  await page.goto('/#models');
  await expect(page.locator('h2').filter({ hasText: 'Model Manager' })).toBeVisible();
  await expect(page.getByText('BirdNET-ONNX')).toBeVisible();
  await expect(page.getByText('MobileNetV2 Plants & Insects')).toBeVisible();
});
