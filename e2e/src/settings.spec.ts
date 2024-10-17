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


test.describe('Settings Component', () => {
  test.beforeEach(async ({ page }) => {
    // Set the authentication cookie before each test
    await page.context().addCookies([refreshTokenCookie]);


    // Add a small delay to ensure the server is ready
    await page.waitForTimeout(1000);


    // Navigate to a base page to access local storage
    await page.goto(`${BASE_URL}/settings`, { waitUntil: 'domcontentloaded' }); // Ensure the document is fully loaded


    await page.evaluate(() => {
      localStorage.setItem('ID', '10'); // Set a key-value pair in local storage
      // Add other items as needed
    });


    // Navigate to the settings page
    await page.goto(`${BASE_URL}/settings`);
  });

  test('should navigate between tabs', async ({ page }) => {
    // Verify the default tab is 'My Details'
    const detailsTab = await page.locator('a.tab-active:has-text("My Details")');
    await expect(detailsTab).toBeVisible();


    // Click on the 'Security' tab
    const securityTab = await page.locator('a:has-text("Security")');
    await securityTab.click();


    // Verify the 'Security' tab is active
    const activeSecurityTab = await page.locator('a.tab-active:has-text("Security")');
    await expect(activeSecurityTab).toBeVisible();
  });


  // test('should display profile details section', async ({ page }) => {
  //   // Verify the profile details section
  //   const profileDetailsHeading = await page.locator('h3:has-text("Profile Details")');
  //   await expect(profileDetailsHeading).toBeVisible();


  //   // Verify the avatar
  //   const avatar = await page.locator('img[alt="Avatar"]');
  //   await expect(avatar).toBeVisible();


  //   // Verify the name input
  //   const nameInput = await page.locator('input[placeholder="Name"]');
  //   await expect(nameInput).toBeVisible();


  //   // Verify the surname input
  //   const surnameInput = await page.locator('input[placeholder="Surname"]');
  //   await expect(surnameInput).toBeVisible();


  //   // Verify the bio textarea
  //   const bioTextarea = await page.locator('textarea[placeholder="Bio"]');
  //   await expect(bioTextarea).toBeVisible();
  // });


  // test('should display social media links section', async ({ page }) => {
  //   // Verify the social media links section
  //   const socialMediaLinksHeading = await page.locator('h3:has-text("Social Media Links")');
  //   await expect(socialMediaLinksHeading).toBeVisible();


  //   // Verify the email input
  //   const emailInput = await page.locator('input[placeholder="E-mail"]');
  //   await expect(emailInput).toBeVisible();


  //   // Verify the Twitter input
  //   const twitterInput = await page.locator('input[placeholder="Twitter"]');
  //   await expect(twitterInput).toBeVisible();


  //   // Verify the LinkedIn input
  //   const linkedInInput = await page.locator('input[placeholder="LinkedIn"]');
  //   await expect(linkedInInput).toBeVisible();


  //   // Verify the GitHub input
  //   const gitHubInput = await page.locator('input[placeholder="Github"]');
  //   await expect(gitHubInput).toBeVisible();
  // });


  test('should display security section', async ({ page }) => {
    // Click on the 'Security' tab
    const securityTab = await page.locator('a:has-text("security")');
    await securityTab.click();


    // Verify the public information section
    const publicInfoHeading = await page.locator('h3:has-text("Public Information")');
    await expect(publicInfoHeading).toBeVisible();


// Verify the contact info privacy toggle
const contactInfoToggle = await page.locator('label:has-text("Make Contact Information Private") input[type="checkbox"]');
await expect(contactInfoToggle).toBeVisible();


// Verify the surname privacy toggle
const surnameToggle = await page.locator('label:has-text("Make Surname Private") input[type="checkbox"]');
await expect(surnameToggle).toBeVisible();
  });


  test('should display change password section', async ({ page }) => {
    // Click on the 'Security' tab
    const securityTab = await page.locator('a:has-text("Security")');
    await securityTab.click();


    // Verify the change password section
    const changePasswordHeading = await page.locator('h3:has-text("Change Password")');
    await expect(changePasswordHeading).toBeVisible();


    // Verify the current password input
    const currentPasswordInput = await page.locator('input[placeholder="Current Password"]');
    await expect(currentPasswordInput).toBeVisible();


    // Verify the new password input
    const newPasswordInput = await page.locator('input[placeholder="New Password"]');
    await expect(newPasswordInput).toBeVisible();


    // Verify the confirm password input
    const confirmPasswordInput = await page.locator('input[placeholder="Re-enter New Password"]');
    await expect(confirmPasswordInput).toBeVisible();
  });
});

