import { test, expect } from '@playwright/test';

test('Test event page', async ({ page }) => {
  // Go to the page
  await page.goto('http://localhost:4200/events');

  // Check if the page loaded correctly
  expect(await page.locator('a:has-text("Events System")').innerText()).toContain('Events System');

  // Test filter options
    await page.click('button:has-text("Refine by social club")');
    await page.click('button:has-text("Filter By:")');
});