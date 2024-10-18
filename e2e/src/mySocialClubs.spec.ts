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
test.describe('Social Club Listing Page', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);
       
        await page.waitForTimeout(1000);
        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/socialclublisting`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded
   
        await page.evaluate(() => {
            localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
            localStorage.setItem('Role', 'MANAGER'); // Add the Role key-value pair

            // Add other items as needed
        });
       
        // Navigate to the events page
        await page.goto(`${BASE_URL}/socialclublisting`);
    });
   
  test('should display the page heading', async ({ page }) => {
    // Verify the page heading
    const heading = await page.locator('div.font-poppins > p');
    await expect(heading).toHaveText('My Clubs');
  });


  test('should display "Create club" button and navigate on click', async ({ page }) => {
    // Verify the "Create club" button is visible
    const createClubButton = await page.locator('button.btn[routerLink="/socialclubcreate"]');
    await expect(createClubButton).toBeVisible();

    
    // Click the "Create club" button
    await createClubButton.click();
    await page.context().addCookies([refreshTokenCookie]);

    await expect(page).toHaveURL(`${BASE_URL}/socialclubcreate`);
  });


});

