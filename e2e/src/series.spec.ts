import { test, expect } from '@playwright/test';

// Constants for the test
const BASE_URL = 'http://localhost:4200'; // Replace with your actual app URL

// Sample cookies to simulate login
const refreshTokenCookie = {
  name: 'refresh',
  value: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aG9tYXNkdWJvaXM0QGdtYWlsLmNvbSIsImlhdCI6MTcyMzMxODEyMiwiZXhwIjoxNzIzNDA0NTIyfQ.5ph1KdavNtFxxtMMJYEsz_Gz9Y2Il3NJ-mNggfM7KfQ', // Replace with the actual refresh token value
  domain: 'localhost',
  path: '/',
  httpOnly: false,
  secure: false,
  sameSite: 'Lax' as 'Lax',
//   expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getTime(), // 24 hours
};

test.describe('SeriesCenterComponent Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);

        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/seriescenter`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded

        await page.evaluate(() => {
            localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
            // Add other items as needed
        });
        
        // Navigate to the events page
        await page.goto(`${BASE_URL}/seriescenter`);
    });

    test('Viewing Series Center', async ({ page }) => {
        // Check that the component and its elements are present
        await expect(page.locator('app-series-center')).toBeVisible();
    });

    // test('Viewing available Series', async ({ page }) => {
    //     // wait for API response
    //     await page.waitForResponse('https://events-system-back.wn.r.appspot.com/api/eventseries');

    //     // Check that the component and its elements are present
    //     await expect(page.locator('app-seriescentercard').first()).toBeVisible();
    // });
    
    test('Selecting Series', async ({ page }) => {
        // Check that the component and its elements are present
        await page.click('a.block h2:has-text("Agriculture")');
    });

    test('Filtering', async ({ page }) => {
        // Check that the component and its elements are present
        await page.click('button:has-text("Filter By:")');
    });
});