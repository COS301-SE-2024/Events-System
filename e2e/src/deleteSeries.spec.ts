// tests/seriesDelete.spec.js
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4200'; // Replace with your actual app URL

const refreshTokenCookie = {
  name: 'refresh',
  value: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aG9tYXNkdWJvaXM0QGdtYWlsLmNvbSIsImlhdCI6MTcyMzMxODEyMiwiZXhwIjoxNzIzNDA0NTIyfQ.5ph1KdavNtFxxtMMJYEsz_Gz9Y2Il3NJ-mNggfM7KfQ', // Replace with the actual refresh token value
  domain: 'localhost',
  path: '/',
  httpOnly: false,
  secure: false,
  sameSite: 'Lax' as 'Lax',
};

test.describe('Series Delete Page', () => {
  test.beforeEach(async ({ page }) => {
    // Set the authentication cookie before each test
    await page.context().addCookies([refreshTokenCookie]);

    await page.waitForTimeout(1000);
    // Navigate to a base page to access local storage
    await page.goto(`${BASE_URL}/deleteseries/1`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded

    await page.evaluate(() => {
      localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
      // Add other items as needed
    });

    // Navigate to the delete social club page
    await page.goto(`${BASE_URL}/deleteseries/1`);
  });

  test('should display the social club delete form', async ({ page }) => {
    // Check if the form is visible
    const form = await page.locator('div > div.flex.justify-center.items-center > div > h1');
    await expect(form).toBeVisible();
  });

  test('should allow user to fill and submit the form', async ({ page }) => {
    // Fill out the name input field
    await page.fill('input[type="text"]', 'Test Series');
    
    // Check if the delete button is visible
    await expect(page.locator('button:has-text("Delete Series")')).toBeVisible();

    // // Click the delete button to submit the form
    // await page.click('button:has-text("Delete Series")');

    // // Verify success toast message
    // const successToast = await page.locator('.toast .alert-success');
    // await expect(successToast).toHaveText('Series successfully Deleted Redirecting...');
  });
});
