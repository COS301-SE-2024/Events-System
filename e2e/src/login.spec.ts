import { test, expect } from '@playwright/test';

test.describe('Login and Registration', () => {
  test('has title', async ({ page }) => {
    await page.goto('http://localhost:4200/');
    expect(await page.locator('a:has-text("Events System")').innerText()).toContain('Events System');
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

  // test('login with registered user', async ({ page }) => {
  //   await page.goto('http://localhost:4200/login');

  //   // Fill the login form
  //   await page.fill('input[name="email"]', 'greatsage@gmail.com');
  //   await page.fill('input[name="password"]', 'heavensequal');

  //   // Check if the fields were filled correctly
  //   const emailValue = await page.evaluate(() => (document.querySelector('input[name="email"]') as HTMLInputElement)?.value);
  //   const passwordValue = await page.evaluate(() => (document.querySelector('input[name="password"]') as HTMLInputElement)?.value);
  //   if (emailValue === 'greatsage@gmail.com' && passwordValue === 'heavensequal') {
  //       console.log('The email and password fields were filled correctly.');
  //   } else {
  //       console.log('The email and password fields were not filled correctly.');
  //   }

  //   // Submit the login form
  //   await Promise.all([
  //     page.waitForResponse('https://events-system-back.wn.r.appspot.com/api/v1/auth/authenticate'),
  //     page.click('button:has-text("Login")')
  //   ]);

  //   // Optionally, wait for any necessary UI changes or redirects
  //   await page.waitForNavigation(); // Wait for navigation to home page or other expected page
  //   await expect(page).toHaveURL('http://localhost:4200'); // Check if navigation is successful
  // });
  // test('simulate login for a registered user', async ({ page }) => {
  //   // Intercept the authentication request and mock the response
  //   const formData = {
  //     email: 'greatsage@gmail.com',
  //     password: 'heavensequal'
  //   };
  //   await page.route('https://events-system-back.wn.r.appspot.com/api/v1/auth/authenticate', route => route.fulfill({
  //     status: 200, // HTTP status code for a successful request
  //     contentType: 'application/json',
  //     body: JSON.stringify({formData}),
  //   }));
  
  //   // Navigate to the login page
  //   await page.goto('http://localhost:4200/login');
  
  //   // Fill in the login form with the credentials of the registered user
  //   await page.fill('input[name="email"]', 'greatsage@gmail.com');
  //   await page.fill('input[name="password"]', 'heavensequal');
  
  //     // Simplify the waitForResponse condition to ensure it matches the mocked response
  // const responsePromise = page.waitForResponse(response =>
  //   response.url().includes('authenticate') && response.status() === 200
  // );
  // // Submit the login form
  // await page.click('button:has-text("Login")');

  // // Wait for the response after clicking the login button
  // await responsePromise;

  //   // Add assertions to verify the outcome, such as checking if the user is redirected to a dashboard or home page
  //   await expect(page).toHaveURL('http://localhost:4200/'); // Adjust the URL to the expected one after successful login
  // });
});