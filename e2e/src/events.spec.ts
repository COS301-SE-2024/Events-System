import { test, expect } from '@playwright/test';

// Constants for the test
const BASE_URL = 'https://events-system.org'; // Replace with your actual app URL

// Sample cookies to simulate login
const refreshTokenCookie = {
  name: 'refresh',
  value: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0aG9tYXNkdWJvaXM0QGdtYWlsLmNvbSIsImlhdCI6MTcyMzMxODEyMiwiZXhwIjoxNzIzNDA0NTIyfQ.5ph1KdavNtFxxtMMJYEsz_Gz9Y2Il3NJ-mNggfM7KfQ', // Replace with the actual refresh token value
  domain: 'localhost',
  path: '/',
  httpOnly: true,
  secure: false,
  sameSite: 'Lax' as 'Lax',
  // expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getTime(), // 24 hours
};

test.describe('EventsComponent Tests', () => {
  // Before all tests, navigate to the events page
  test.beforeEach(async ({ page }) => {
    // Set the authentication cookie before each test
    await page.context().addCookies([refreshTokenCookie]);

    // Navigate to a base page to access local storage
    await page.goto(`${BASE_URL}/events`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded

    await page.evaluate(() => {
        localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
        // Add other items as needed
      });
    
    // Navigate to the events page
    await page.goto(`${BASE_URL}/events`);
  });

  test('Viewing events page', async ({ page }) => {
    // Check that the component and its elements are present
    await expect(page.locator('app-events')).toBeVisible();
  });

  test('Viewing available events', async ({ page }) => {
    // wait for API response
    await page.waitForResponse('https://events-system-back.wn.r.appspot.com/api/events');
    // Check that the component and its elements are present
    await expect(page.locator('app-event-card').first()).toBeVisible();
  });

  test('Filtering', async ({ page }) => {
    // Test filter options
      await page.click('button:has-text("Refine by social club")');
      await page.click('button:has-text("Filter By:")');
  });


  test('Test booking for an event', async ({ page }) => {
    await page.click('button:has-text("BOOK")');
  });
});;