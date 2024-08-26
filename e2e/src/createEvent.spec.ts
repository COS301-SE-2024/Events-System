// tests/createEvent.spec.js
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
test.describe('Event Create Page', () => {
    test.beforeEach(async ({ page }) => {
        // Set the authentication cookie before each test
        await page.context().addCookies([refreshTokenCookie]);
       
        await page.waitForTimeout(1000);
        // Navigate to a base page to access local storage
        await page.goto(`${BASE_URL}/createevent`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded
   
        await page.evaluate(() => {
            localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
            // Add other items as needed
        });
       
        // Navigate to the events page
        await page.goto(`${BASE_URL}/createevent`);
    });
    test('should display the event create form', async ({ page }) => {
      // Check if the form is visible
      const form = await page.locator('app-create-event'); // Use a more specific locator
      await expect(form).toBeVisible();
    });


    test('should allow user to fill and submit the form', async ({ page }) => {
        // Step 1: Fill out the name
        await page.click('li:has-text("Name")');
        await page.fill('input[placeholder="Type here"]', 'Test Event');
        await page.click('button:has-text("Next")');

        // Step 2: Fill out the description
        await page.click('li:has-text("Description")');
        await page.fill('textarea[placeholder="Description"]', 'This is a detailed description.');
        await page.click('button:has-text("Next")');

        // Step 3: Fill out the details
        await page.click('li:has-text("Details")');
        await page.fill('input[placeholder="Enter your location"]', 'Test Location');
        //await page.selectOption('select', { label: 'Literature Club' }); // Adjust this according to your options
        await page.click('button:has-text("Next")');

        // Step 4: Fill out the prep & agenda
        await page.click('li:has-text("Prep & Agenda")');
        // Add prep inputs
        // for (let i = 0; i < 3; i++) {
        //     await page.click('button:has-text("+")');
        //     await page.fill(`input[formcontrolname="${i}"]`, `Prep Item ${i + 1}`);
        // }
        // Add agenda inputs
        // for (let i = 0; i < 3; i++) {
        //     await page.click('button:has-text("+")');
        //     await page.fill(`input[formcontrolname="${i}"]`, `Agenda Item ${i + 1}`);
        // }
        // await page.click('button:has-text("Next")');

        // Step 5: Submit the form
        await page.click('li:has-text("Summary")');
        await expect(page.locator('button:has-text("Create event")')).toBeVisible();
        //await page.click('button:has-text("Create event")');
    });
});

