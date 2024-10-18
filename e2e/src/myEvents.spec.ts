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

test.describe('MyEventsComponent Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);

        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/myeveents`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded

        await page.evaluate(() => {
            localStorage.setItem('ID', '159'); // Set a key-value pair in local storage
            localStorage.setItem('Role', 'MANAGER'); // Add the Role key-value pair

            // Add other items as needed
        });
        
        // Navigate to the myEvents page
        await page.goto(`${BASE_URL}/myevents`);
    });

    test('Viewing MyEvents Page', async ({ page }) => {
        // Check that the component and its elements are present
        await expect(page.locator('app-my-events')).toBeVisible();
    });

    // test('Viewing hosted events', async ({ page }) => {
    //     // Check that the component and its elements are present
    //     // Check if skeletons are visible
    //     await expect(page.locator('app-my-events-card-skeleton').first()).toBeVisible();

    //     const employeeId = await page.evaluate(() => {
    //         return localStorage.getItem('ID');
    //     });

    //     // Wait for response from API
    //     await page.waitForResponse(`https://events-system-back.wn.r.appspot.com/api/events/host/${employeeId}`);

    //     // See if there are any events that are visible
    //     await expect(page.locator('app-my-events-card').first()).toBeVisible();
    // });

    test('Create Event button', async ({ page }) => {
        // Check that the component and its elements are present
        await page.click('button:has-text("Create event")');
        await page.waitForURL(`${BASE_URL}/createevent`)
    });
});