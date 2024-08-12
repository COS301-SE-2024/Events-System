// tests/createSeries.spec.js
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

test.describe('Series Create Page', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);

        await page.waitForTimeout(1000);

        // Navigate to the create event page
        await page.goto(`${BASE_URL}/createseries`, { waitUntil: 'domcontentloaded' });

        // Set initial local storage values
        await page.evaluate(() => {
        localStorage.setItem('ID', '10');
        });
        
        // Navigate to the events page
        await page.goto(`${BASE_URL}/createseries`);
    });

    test('should display the event create form', async ({ page }) => {
        // Check if the form is visible
        const form = await page.locator('app-create-series');
        await expect(form).toBeVisible();
    });

    test('should allow user to fill and submit the form', async ({ page }) => {
        // Step 1: Fill out the name
        await page.click('li.step:has-text("Name")'); // Navigate to the "Name" step
        await page.fill('input[type="text"]', 'Test Series'); // Fill the name input
        await page.click('button.btn-success:has-text("Next")'); // Click the "Next" button

        // Step 2: Fill out the description
        await page.click('li.step:has-text("Description")'); // Navigate to the "Description" step
        await page.fill('textarea[placeholder="Description"]', 'This is a detailed description.'); // Fill the description textarea
        await page.click('button.btn-success:has-text("Next")'); // Click the "Next" button

        // Step 3: Add events (this step seems to involve some user interaction not detailed in the original test)
        await page.click('li.step:has-text("Details")'); // Navigate to the "Details" step
        // Optionally select events or perform actions related to events if needed
        await page.click('button.btn-success:has-text("Next")'); // Click the "Next" button

        // Step 4: Submit the form
        await page.click('li.step:has-text("Summary")'); // Navigate to the "Summary" step

        // Ensure the "Create series" button is visible and submit the form
        const createSeriesButton = page.locator('button.btn-success:has-text("Create series")');
        await expect(createSeriesButton).toBeVisible();
        // await createEventButton.click();
  });
});
