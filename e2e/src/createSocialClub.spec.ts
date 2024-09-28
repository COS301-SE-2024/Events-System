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
test.describe('Social Club Create Page', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);
       
        await page.waitForTimeout(1000);
        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/socialclubcreate`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded
   
        await page.evaluate(() => {
            localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
            // Add other items as needed
        });
       
        // Navigate to the events page
        await page.goto(`${BASE_URL}/socialclubcreate`);
    });
    test('should display the social club create form', async ({ page }) => {
      // Check if the form is visible
      const form = await page.locator('form.card-body'); // Use a more specific locator
      await expect(form).toBeVisible();
    });


    test('should allow user to fill and submit the form', async ({ page }) => {
      // Step 1: Fill out the name
      await page.click('li:has-text("Name")');
      await page.fill('input[formControlName="name"]', 'Test Club');
      await page.click('button:has-text("Next")');


      // Step 2: Fill out the description and category
      await page.click('li:has-text("Description")');
      await page.fill('textarea[formControlName="summaryDescription"]', 'This is a summary.');
      await page.fill('textarea[formControlName="description"]', 'This is a detailed description.');
      await page.click('button:has-text("Next")');


      // Step 3: Submit the form
      await page.click('li:has-text("Summary")');


      await expect(page.locator('button:has-text("Create Club")')).toBeVisible();


    });
});

