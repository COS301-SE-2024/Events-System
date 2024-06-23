import { test, expect } from '@playwright/test';

test.describe('UpdateEventComponent', () => {
  test.beforeEach(async ({ page }) => {
    // Mock session storage data
    await page.route('**/api/events/*', async (route, request) => {
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
    await page.goto('http://localhost:4200/update-event/1');
  });

  test('should display the form with pre-filled data', async ({ page }) => {
    await expect(page.locator('input[placeholder="Type here"]')).toHaveValue('Test Event');
    await expect(page.locator('textarea[placeholder="Bio"]')).toHaveValue('Event Description');
    await expect(page.locator('input[type="time"]').first()).toHaveValue('10:00');
    await expect(page.locator('input[type="time"]').last()).toHaveValue('12:00');
    await expect(page.locator('input[type="date"]').first()).toHaveValue('2023-06-01');
    await expect(page.locator('input[type="date"]').last()).toHaveValue('2023-06-02');
    await expect(page.locator('input[placeholder="Location"]')).toHaveValue('Test Location');
    await expect(page.locator('input[placeholder="Social club"]')).toHaveValue('Test Club');
  });

  test('should add and remove preparation and agenda inputs', async ({ page }) => {
    // Add preparation input
    await page.locator('button:has-text("+")').first().click();
    await expect(page.locator('input[placeholder="Type here"]').first()).toBeVisible();

    // Remove preparation input
    await page.locator('button:has-text("-")').first().click();
    await expect(page.locator('input[placeholder="Type here"]').first()).not.toBeVisible();

    // Add agenda input
    await page.locator('button:has-text("+")').nth(1).click();
    await expect(page.locator('input[placeholder="Type here"]').nth(1)).toBeVisible();

    // Remove agenda input
    await page.locator('button:has-text("-")').nth(1).click();
    await expect(page.locator('input[placeholder="Type here"]').nth(1)).not.toBeVisible();
  });

  test('should toggle dietary accommodations', async ({ page }) => {
    await page.locator('button:has-text("Vegetarian")').click();
    await expect(page.locator('button:has-text("Vegetarian")')).toHaveClass(/btn-outline/);

    await page.locator('button:has-text("Vegan")').click();
    await expect(page.locator('button:has-text("Vegan")')).toHaveClass(/btn-outline/);

    await page.locator('button:has-text("Halal")').click();
    await expect(page.locator('button:has-text("Halal")')).toHaveClass(/btn-outline/);

    await page.locator('button:has-text("Gluten-free")').click();
    await expect(page.locator('button:has-text("Gluten-free")')).toHaveClass(/btn-outline/);
  });

  test('should show success toast on successful form submission', async ({ page }) => {
    // Mock the PUT request
    await page.route('https://events-system-back.wn.r.appspot.com/api/events/*', async (route, request) => {
      const response = {
        status: 200,
        body: JSON.stringify({ message: 'Event successfully updated' })
      };
      route.fulfill(response);
    });

    // Fill the form
    await page.fill('input[placeholder="Type here"]', 'Updated Event');
    await page.fill('textarea[placeholder="Bio"]', 'Updated Description');
    await page.fill('input[type="time"]', '11:00');
    await page.fill('input[type="time"]', '13:00');
    await page.fill('input[type="date"]', '2023-06-02');
    await page.fill('input[type="date"]', '2023-06-03');
    await page.fill('input[placeholder="Location"]', 'Updated Location');
    await page.fill('input[placeholder="Social club"]', 'Updated Club');

    // Submit the form
    await page.locator('button:has-text("Update event")').click();

    // Verify success toast
    await expect(page.locator('span:has-text("Event successfully updated Redirecting...")')).toBeVisible();
  });

  test('should show error toast on failed form submission', async ({ page }) => {
    // Mock the PUT request failure
    await page.route('https://events-system-back.wn.r.appspot.com/api/events/*', async (route, request) => {
      route.abort('failed');
    });

    // Fill the form
    await page.fill('input[placeholder="Type here"]', 'Updated Event');
    await page.fill('textarea[placeholder="Bio"]', 'Updated Description');
    await page.fill('input[type="time"]', '11:00');
    await page.fill('input[type="time"]', '13:00');
    await page.fill('input[type="date"]', '2023-06-02');
    await page.fill('input[type="date"]', '2023-06-03');
    await page.fill('input[placeholder="Location"]', 'Updated Location');
    await page.fill('input[placeholder="Social club"]', 'Updated Club');

    // Submit the form
    await page.locator('button:has-text("Update event")').click();

    // Verify error toast
    await expect(page.locator('span:has-text("error updating event")')).toBeVisible();
  });
});
