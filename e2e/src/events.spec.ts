import { test, expect } from '@playwright/test';

// Constants for the test
const BASE_URL = 'http://localhost:4200'; // Replace with your actual app URL

// Sample cookie to simulate login
const authCookie = {
  name: 'jwt', // Adjust the name to match your app's cookie
  value: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aG9tYXNkdWJvaXM0QGdtYWlsLmNvbSIsImlhdCI6MTcyMzMxODEyMiwiZXhwIjoxNzIzNDA0NTIyfQ.5ph1KdavNtFxxtMMJYEsz_Gz9Y2Il3NJ-mNggfM7KfQ', // Replace with a valid token or session ID
  domain: 'localhost', // Adjust domain if needed
  path: '/',
  httpOnly: true,
  secure: false, // Set to true if using HTTPS
  sameSite: 'Lax' as 'Lax',
};

test.describe('EventsComponent Tests', () => {
  // Before all tests, navigate to the events page
  test.beforeEach(async ({ page }) => {
    // Set the authentication cookie before each test
    await page.context().addCookies([authCookie]);

    // Navigate to a base page to access local storage
    await page.goto(`${BASE_URL}/events`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded

    await page.evaluate(() => {
        localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
        // Add other items as needed
      });
    
    // Navigate to the events page
    await page.goto(`${BASE_URL}/events`);
  });

  test('Test event page', async ({ page }) => {
    // Go to the page
    await page.goto(`${BASE_URL}/events`);

    // Check if the page loaded correctly
    // Check that the component and its elements are present
    await expect(page.locator('app-events')).toBeVisible();;

    // Test filter options
      await page.click('button:has-text("Refine by social club")');
      await page.click('button:has-text("Filter By:")');
  });

  test('Test booking for an event', async ({ page }) => {
    await page.click('button:has-text("BOOK")');
  });
});;