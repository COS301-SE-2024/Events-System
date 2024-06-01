import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:4200');

  // Check that the correct element is present (replace selector as needed)
  const element = page.locator('elementSelector');
  expect(element).toBeTruthy();
});
