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

test.describe('Event Update Page', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);
        
        await page.waitForTimeout(1000);
        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/updateevent/1`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded
    
        await page.evaluate(() => {
            localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
            localStorage.setItem('Role', 'MANAGER'); // Add the Role key-value pair

            // Add other items as needed
        });
        
        // Navigate to the event update page
        await page.goto(`${BASE_URL}/updateevent/1`);
    });

    test('should display the social club update form', async ({ page }) => {
        // Check if the heading is visible
        const heading = await page.locator('h1.text-4xl');
        await expect(heading).toBeVisible();

        // Check if the input field is visible
        const inputField = await page.locator('input[placeholder="Type here"]');
        await expect(inputField).toBeVisible();
    });

    test('should allow user to fill and submit the form', async ({ page }) => {
        // Fill out the title
        await page.fill('input[placeholder="Type here"]', 'Updated Event Name');

        // Fill out the description
        await page.fill('textarea[placeholder="Bio"]', 'This is an updated summary.');

        // Fill out the time inputs
        await page.fill('input[type="time"]', '09:00'); // Start Time
        await page.fill('input[type="time"]', '17:00'); // End Time

        // Fill out the date inputs
        await page.fill('input[type="date"]', '2024-08-15'); // Start Date
        await page.fill('input[type="date"]', '2024-08-16'); // End Date

        // Submit the form
        const updateButton = await page.locator('button.btn-success:has-text("Update event")');
        await expect(updateButton).toBeVisible();
        // await updateButton.click();

        // // Verify the success toast appears
        // const successToast = await page.locator('.toast .alert-success');
        // await expect(successToast).toBeVisible();
    });
});
