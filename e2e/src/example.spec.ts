import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  // Expect h1 to contain a substring.
  expect(await page.locator('a:has-text("Events System")').innerText()).toContain('Events System');
});
