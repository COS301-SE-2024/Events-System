import { test, expect } from '@playwright/test';

test.describe('UpdateEventComponent', () => {
  test.beforeEach(async ({ page }) => {
    // Mock session storage data
    await page.route('/api/events/*', async (route, request) => {
      const response = {
        status: 200,
        body: JSON.stringify({
          title: 'Test Event',
          description: 'Event Description',
          startTime: '10:00',
          endTime: '12:00',
          startDate: '2023-06-01',
          endDate: '2023-06-02',
          location: 'Test Location',
          socialClub: 'Test Club',
          eventPreparation: ['Prep Step 1', 'Prep Step 2'],
          eventAgendas: ['Agenda Item 1', 'Agenda Item 2'],
          dietaryAccommodations: ['Vegetarian', 'Vegan']
        })
      };
      route.fulfill(response);
    });

    // Go to the component's URL
    await page.goto('http://localhost:4200/updateevent/67');
  });
  test('should display the form with all fields', async ({ page }) => {
    // Check if all form fields are present
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="startTime"]')).toBeVisible();
    await expect(page.locator('input[name="endTime"]')).toBeVisible();
    await expect(page.locator('input[name="startDate"]')).toBeVisible();
    await expect(page.locator('input[name="endDate"]')).toBeVisible();
    await expect(page.locator('input[name="location"]')).toBeVisible();
    await expect(page.locator('input[name="socialClub"]')).toBeVisible();
    // Check for dietary accommodation checkboxes
    // await expect(page.locator('input[name="vegetarian"]')).toBeVisible();
    // await expect(page.locator('input[name="vegan"]')).toBeVisible();
    // await expect(page.locator('input[name="halal"]')).toBeVisible();
    // await expect(page.locator('input[name="glutenFree"]')).toBeVisible();
  });
  // test('should display the form with pre-filled data', async ({ page }) => {
  //   await expect(page.locator('input[name="name"]')).toHaveValue(/.+/); // Checks if value is not empty
  //   await expect(page.locator('textarea[name="description"]')).toHaveValue(/.+/);
  //   await expect(page.locator('input[name="startTime"]').first()).toHaveValue(/.+/);
  //   await expect(page.locator('input[name="endTime"]').last()).toHaveValue(/.+/);
  //   await expect(page.locator('input[name="endDate"]').first()).toHaveValue(/.+/);
  //   await expect(page.locator('input[type="date"]').last()).toHaveValue(/.+/);
  //   await expect(page.locator('input[name="location"]')).toHaveValue(/.+/);
  //   await expect(page.locator('input[name="socialClub"]')).toHaveValue(/.+/);
  // });



  // test('should toggle dietary accommodations', async ({ page }) => {
  //   await page.locator('button:has-text("Vegetarian")').click();
  //   await expect(page.locator('button:has-text("Vegetarian")')).toHaveClass(/btn-outline/);

  //   await page.locator('button:has-text("Vegan")').click();
  //   await expect(page.locator('button:has-text("Vegan")')).toHaveClass(/btn-outline/);

  //   await page.locator('button:has-text("Halal")').click();
  //   await expect(page.locator('button:has-text("Halal")')).toHaveClass(/btn-outline/);

  //   await page.locator('button:has-text("Gluten-free")').click();
  //   await expect(page.locator('button:has-text("Gluten-free")')).toHaveClass(/btn-outline/);
  // });

  // test('should show success toast on successful form submission', async ({ page }) => {
  //   // Mock the PUT request
  //   await page.route('https://events-system-back.wn.r.appspot.com/api/events/*', async (route, request) => {
  //     const response = {
  //       status: 200,
  //       body: JSON.stringify({ message: 'Event successfully updated' })
  //     };
  //     route.fulfill(response);
  //   });

  //   // Fill the form
  //   // await page.fill('input[name="name"]', 'Updated Event');
  //   await page.fill('textarea[name="description"]', 'Updated Description');
  //   // await page.fill('input[name="startTime"]', '11:00');
  //   // await page.fill('input[name="endTime"]', '13:00');
  //   // await page.fill('input[name="startDate"]', '2023-06-02');
  //   // await page.fill('input[name="endDate"]', '2023-06-03');
  //   // await page.fill('input[name="location"]', 'Updated Location');
  //   // await page.fill('input[name="socialClub"]', 'Updated Club');


  //   await page.click('button[name="updatebutton"]');

  //   // After waiting for the toast to appear
  //   await page.waitForSelector('.toast .alert-success', { state: 'visible' });

  //   // Add an assertion to ensure the toast is visible
  //   await expect(page.locator('.toast .alert-success')).toBeVisible();

  //   console.log('Success toast is visible.');

  //   //Wait for the toast to disappear after 5 seconds
  //   await page.waitForSelector('.toast .alert-success', { state: 'hidden', timeout: 6000 });

  //   // Add an assertion to ensure the toast has disappeared
  //   await expect(page.locator('.toast .alert-success')).toBeHidden();

  //   console.log('Success toast has disappeared.');
  // });

});