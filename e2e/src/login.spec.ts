import { test, expect } from '@playwright/test';

test.describe('Login and Registration', () => {
  test('has title', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await expect(page).toHaveTitle("Events-System");
  });

  test('register new user', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    // Click on the Sign up link to open the registration modal
    await page.click('a:has-text("Sign up")');

    // Wait for the registration modal to appear
    await page.waitForSelector('dialog#my_modal_3');

    // Fill the registration form
    await page.fill('dialog#my_modal_3 input[name="firstName"]', 'John');
    await page.fill('dialog#my_modal_3 input[name="lastName"]', 'Doe');
    await page.fill('dialog#my_modal_3 input[name="email"]', 'john.doe@example.com');
    await page.fill('dialog#my_modal_3 input[name="password"]', 'password123');
    await page.check('dialog#my_modal_3 input[value="Employee"]');

    // Submit the registration form
    await page.click('dialog#my_modal_3 button[type="submit"]');

    // Wait for registration response and check for login form appearance
    await page.waitForResponse('https://events-system-back.wn.r.appspot.com/api/v1/auth/register');
    await expect(page.locator('dialog#my_modal_2')).toBeVisible(); // Assuming the login form modal id is my_modal_2
  });

  test('login with registered user', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    // Fill the login form
    await page.fill('input[name="email"]', 'greatsage@gmail.com');
    await page.fill('input[name="password"]', 'heavensequal');

    // Check if the fields were filled correctly
    const emailValue = await page.evaluate(() => document.querySelector('input[name="email"]')?.value);
    const passwordValue = await page.evaluate(() => document.querySelector('input[name="password"]')?);

    if (emailValue === 'greatsage@gmail.com' && passwordValue === 'heavensequal') {
        console.log('The email and password fields were filled correctly.');
    } else {
        console.log('The email and password fields were not filled correctly.');
    }

    // Submit the login form
    await Promise.all([
      page.waitForResponse('https://events-system-back.wn.r.appspot.com/api/v1/auth/authenticate'),
      page.click('button:has-text("Login")')
    ]);

    // Optionally, wait for any necessary UI changes or redirects
    await page.waitForNavigation(); // Wait for navigation to home page or other expected page
    await expect(page).toHaveURL('http://localhost:4200'); // Check if navigation is successful
  });

  test('forgot password', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    // Click on the Forgot password link to open the recovery modal
    await page.click('a:has-text("Forgot password?")');

    // Wait for the forgot password modal to appear
    await page.waitForSelector('dialog#my_modal_2');

    // Fill the forgot password form
    await page.fill('dialog#my_modal_2 input[name="name"]', 'John Doe');
    await page.fill('dialog#my_modal_2 input[name="email"]', 'john.doe@example.com');

    // Submit the forgot password form
    await page.click('dialog#my_modal_2 button[type="submit"]');

    // Optionally, add checks for any confirmation message
    await expect(page.locator('dialog#my_modal_2')).not.toBeVisible();
  });
});
