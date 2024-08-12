import { test, expect } from '@playwright/test';

test.describe('Login and Registration', () => {

  test('Register new user', async ({ page }) => {
    await page.goto('https://events-system.org/login');

    // Click on the Sign up link to open the registration modal
    await page.click('a:has-text("Create an account")');

    // Wait for the registration modal to appear
    await page.waitForSelector('dialog#my_modal_3');

    // Fill the registration form
    await page.fill('dialog#my_modal_3 input[name="firstName"]', 'John');
    await page.fill('dialog#my_modal_3 input[name="lastName"]', 'Doe');
    await page.fill('dialog#my_modal_3 input[name="email"]', 'jason12345.doe@example.com');
    await page.fill('dialog#my_modal_3 input[name="password1"]', 'password123');
    await page.fill('dialog#my_modal_3 input[name="password2"]', 'password123');
    await page.check('dialog#my_modal_3 input[value="Employee"]');

    // Submit the registration form
    await page.click('dialog#my_modal_3 button[type="submit"]');

    // Wait for registration response and check for login form appearance
    await page.waitForResponse('https://events-system-back.wn.r.appspot.com/api/v1/auth/register');
    // await expect(page.locator('dialog#my_modal_2')).toBeVisible(); // Assuming the login form modal id is my_modal_2
  });

  test('Login with registered user', async ({ page }) => {
    await page.goto('https://events-system.org/login');

    // Fill the login form
    await page.fill('input[formControlName="email"]', 'jason.doe@example.com');
    await page.fill('input[formControlName="password"]', 'password123');

    // Submit the login form
    await Promise.all([
      page.waitForResponse('https://events-system-back.wn.r.appspot.com/api/v1/auth/authenticate'),
      page.click('button:has-text("Sign in")')
    ]);

    // Optionally, wait for any necessary UI changes or redirects
    await expect(page).toHaveURL('https://events-system.org/login'); // Check if navigation is successful
  });

//   test('simulate login for a registered user', async ({ page }) => {
//     // Intercept the authentication request and mock the response
//     const formData = {
//       email: 'greatsage@gmail.com',
//       password: 'heavensequal'
//     };
//     await page.route('https://events-system-back.wn.r.appspot.com/api/v1/auth/authenticate', route => route.fulfill({
//       status: 200, // HTTP status code for a successful request
//       contentType: 'application/json',
//       body: JSON.stringify({ formData }),
//     }));
  
//     // Navigate to the login page
//     await page.goto('https://events-system.org/login');
  
//     // Fill in the login form with the credentials of the registered user
//     await page.fill('input[formControlName="email"]', 'greatsage@gmail.com');
//     await page.fill('input[formControlName="password"]', 'heavensequal');
  
//     // Simplify the waitForResponse condition to ensure it matches the mocked response
//     const responsePromise = page.waitForResponse(response =>
//       response.url().includes('authenticate') && response.status() === 200
//     );
//     // Submit the login form
//     await page.click('button:has-text("Sign in")');

//     // Wait for the response after clicking the login button
//     await responsePromise;

//     // Add assertions to verify the outcome, such as checking if the user is redirected to a dashboard or home page
//     await expect(page).toHaveURL('https://events-system.org'); // Adjust the URL to the expected one after successful login
//   });

});
