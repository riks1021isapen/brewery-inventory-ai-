import { test, expect } from '@playwright/test';

test('home page has app name', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Brewery Inventory AI')).toBeVisible();
});
