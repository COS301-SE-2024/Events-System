// tests/deleteEvent.spec.js
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

test.describe('Event Delete Page', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);
        
        await page.waitForTimeout(1000);
        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/deleteevent/1`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded
    
        await page.evaluate(() => {
            localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
            // Add other items as needed
        });
        
        // Navigate to the event delete page
        await page.goto(`${BASE_URL}/deleteevent/1`);
    });

    test('should display the social club delete form', async ({ page }) => {
        // Check if the heading is visible
        const heading = await page.locator('h1.text-4xl');
        await expect(heading).toBeVisible();

        // Check if the input field is visible
        const inputField = await page.locator('input[placeholder="Type here"]');
        await expect(inputField).toBeVisible();
    });

    test('should allow user to fill and submit the form', async ({ page }) => {
        // Fill out the name
        await page.fill('input[placeholder="Type here"]', 'Test Event');

        // Submit the form
        const deleteButton = await page.locator('button.btn-error:has-text("Delete event")');
        await expect(deleteButton).toBeVisible();
        //await deleteButton.click();
    });
});
