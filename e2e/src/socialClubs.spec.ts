import { test, expect } from '@playwright/test';

// Constants for the test
const BASE_URL = 'https://events-system.org/'; // Replace with your actual app URL

// Sample cookies to simulate login
const refreshTokenCookie = {
  name: 'refresh',
  value: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aG9tYXNkdWJvaXM0QGdtYWlsLmNvbSIsImlhdCI6MTcyMzMxODEyMiwiZXhwIjoxNzIzNDA0NTIyfQ.5ph1KdavNtFxxtMMJYEsz_Gz9Y2Il3NJ-mNggfM7KfQ', // Replace with the actual refresh token value
  domain: 'localhost',
  path: '/',
  httpOnly: true,
  secure: false,
  sameSite: 'Lax' as 'Lax',
//   expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getTime(), // 24 hours
};

test.describe('SocialClubsComponent Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);

        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/socialclubs`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded

        await page.evaluate(() => {
            localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
            // Add other items as needed
        });
        
        // Navigate to the events page
        await page.goto(`${BASE_URL}/socialclubs`);
    });

    test('Viewing social clubs page', async ({ page }) => {
        // Check that the component and its elements are present
        await expect(page.locator('app-social-clubs')).toBeVisible();
    });

    test('Viewing available social clubs', async ({ page }) => {
        // Check if skeletons are visible
        await expect(page.locator('app-social-club-card-skeleton').first()).toBeVisible();

        // Wait for response from API
        await page.waitForResponse('https://events-system-back.wn.r.appspot.com/api/socialclubs');

        // See if there is any social club that is visible
        await expect(page.locator('app-social-club-card').first()).toBeVisible();
    })
});