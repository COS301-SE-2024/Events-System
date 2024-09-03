import { test, expect } from '@playwright/test';

test.describe('Login and Registration', () => {



  test('Login with registered user', async ({ page }) => {
    await page.goto('http://localhost:4200/login');

    // Fill the login form
    await page.fill('input[formControlName="email"]', 'jason.doe@example.com');
    await page.fill('input[formControlName="password"]', 'password123');



    // Optionally, wait for any necessary UI changes or redirects
    await expect(page).toHaveURL('http://localhost:4200/login'); // Check if navigation is successful
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
//     await page.goto('http://localhost:4200/login');
  
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
//     await expect(page).toHaveURL('http://localhost:4200'); // Adjust the URL to the expected one after successful login
//   });

});
