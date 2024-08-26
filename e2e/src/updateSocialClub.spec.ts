// tests/socialClubCreate.spec.js
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
test.describe('Social Club Delete Page', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);
       
        await page.waitForTimeout(1000);
        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/updatesocialclub/1`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded
   
        await page.evaluate(() => {
            localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
            // Add other items as needed
        });
       
        // Navigate to the events page
        await page.goto(`${BASE_URL}/updatesocialclub/1`);
    });
    test('should display the social club delete form', async ({ page }) => {
      // Check if the form is visible
      const form = await page.locator('form.card-body'); // Use a more specific locator
      await expect(form).toBeVisible();
    });
    test('should allow user to fill and submit the form', async ({ page }) => {
        // Fill out the name
        await page.fill('input[placeholder="Type club name..."]', 'Updated Club Name');


        // Select a category
        await page.selectOption('select[formControlName="categories"]', 'Literature');


        // Fill out the summary description
        await page.fill('textarea[formControlName="summaryDescription"]', 'This is an updated summary.');


        // Fill out the detailed description
        await page.fill('textarea[formControlName="description"]', 'This is an updated detailed description.');


        // Submit the form
        await expect(page.locator('button:has-text("Save changes")')).toBeVisible();
    });
});

