import { test, expect } from '@playwright/test';

// Constants for the test
const BASE_URL = 'http://localhost:4200'; // Replace with your actual app URL
// const USERNAME = 'myUsername';
// const PASSWORD = 'myPassword';

// Sample cookie to simulate login
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

test.describe('HomeComponent Tests', () => {
  // Before all tests, navigate to the home page
  test.beforeEach(async ({ page }) => {
    // Set the authentication cookie before each test
    await page.context().addCookies([refreshTokenCookie]);

    // Navigate to a base page to access local storage
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded

    await page.evaluate(() => {
        localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
        // Add other items as needed
      });
    
    // Navigate to the home page
    await page.goto(`${BASE_URL}`);
  });

  test('Should display HomeComponent with elements', async ({ page }) => {
    // Check that the component and its elements are present
    await expect(page.locator('app-home')).toBeVisible();
  });

//   test('should log in and show events', async ({ page }) => {
//     // Navigate to login page
//     await page.goto(`${BASE_URL}/login`);
    
//     // Log in with credentials
//     await page.fill('input[name="username"]', USERNAME);
//     await page.fill('input[name="password"]', PASSWORD);
//     await page.click('button[type="submit"]');
    
//     // Verify login was successful by checking if redirected to home page
//     await expect(page).toHaveURL(`${BASE_URL}/home`);
    
//     // Check if events are displayed
//     const events = await page.$$('.event-card'); // Adjust selector to match your event cards
//     expect(events.length).toBeGreaterThan(0);
//   });

  test('Interact with the carousel', async ({ page }) => {
    // Navigate to home page (if not already there)
    await page.goto(`${BASE_URL}`);
    
    // Simulate carousel interactions
    await page.click('a.btn.btn-circle');
    await page.click('button:has-text("See")');
  });
});
