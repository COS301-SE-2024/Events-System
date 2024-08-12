import { test, expect } from '@playwright/test';


const BASE_URL = 'http://localhost:4200'; // Replace with your actual app URL


const refreshTokenCookie = {
  name: 'refresh',
  value: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aG9tYXNkdWJvaXM0QGdtYWlsLmNvbSIsImlhdCI6MTcyMzMxODEyMiwiZXhwIjoxNzIzNDA0NTIyfQ.5ph1KdavNtFxxtMMJYEsz_Gz9Y2Il3NJ-mNggfM7KfQ', // Replace with the actual refresh token value
  domain: 'localhost',
  path: '/',
  httpOnly: true,
  secure: false,
  sameSite: 'Lax' as 'Lax',
};
test.describe('My Series Component', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);
   
        await page.waitForTimeout(1000);
   
        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/myseries`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded
   
        await page.evaluate(() => {
            localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
            // Add other items as needed
        });
       
        // Navigate to the events page
        await page.goto(`${BASE_URL}/myseries`);
    });
  test('should display "Create series" button and navigate on click', async ({ page }) => {
    // Verify the "Create series" button is visible
    const createSeriesButton = await page.locator('button:has-text("Create series")');
    await expect(createSeriesButton).toBeVisible();


    // Click the "Create series" button
    await createSeriesButton.click();


    // Verify navigation to the create series page
    await expect(page).toHaveURL(`${BASE_URL}/createseries`);
  });
});

