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
test.describe('Search Component', () => {
  test.beforeEach(async ({ page }) => {
    // Set the authentication cookie before each test
    await page.context().addCookies([refreshTokenCookie]);


    await page.waitForTimeout(1000);


    // Navigate to a base page to access local storage
    await page.goto(`${BASE_URL}/search`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded


    await page.evaluate(() => {
        localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
        // Add other items as needed
    });
   
    // Navigate to the events page
    await page.goto(`${BASE_URL}/search`);
});




  test('should display the search page heading', async ({ page }) => {
    // Verify the page heading
    const heading = await page.locator('text=Search and Explore');
    await expect(heading).toBeVisible();
  });


  test('should display the search bar and checkboxes', async ({ page }) => {
    // Verify the search bar
    const searchBar = await page.locator('input[placeholder="Search for events, hosts and social clubs..."]');
    await expect(searchBar).toBeVisible();


    // Verify the checkboxes
    const eventsCheckbox = await page.locator('input[aria-label="Events"]');
    const hostsCheckbox = await page.locator('input[aria-label="Employees"]');
    const socialClubsCheckbox = await page.locator('input[aria-label="Social Clubs"]');


    await expect(eventsCheckbox).toBeVisible();
    await expect(hostsCheckbox).toBeVisible();
    await expect(socialClubsCheckbox).toBeVisible();
  });
});

