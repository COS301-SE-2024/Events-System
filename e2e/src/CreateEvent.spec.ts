const { test, expect } = require('@playwright/test');

test.describe('Event Creation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200'); // Replace with your application's URL
  });

  test('should navigate through steps and fill out the form', async ({ page }) => {
    // Step 1: Name
    await page.fill('input[placeholder="Type here"]', 'Event Title');
    await page.click('button:has-text("Next")');

    // Step 2: Description
    await page.fill('textarea[placeholder="Description"]', 'Event Description');
    await page.click('button:has-text("Next")');

    // Step 3: Details
    await page.fill('input[placeholder="Start Time"]', '10:00');
    await page.fill('input[placeholder="End Time"]', '12:00');
    await page.fill('input[placeholder="Start Date"]', '2024-06-23');
    await page.fill('input[placeholder="End Date"]', '2024-06-24');
    await page.fill('input[placeholder="Location"]', 'Event Location');
    await page.fill('input[placeholder="Social club"]', 'Social Club');
    await page.click('button:has-text("Next")');

    // Step 4: Prep & Agenda
    await page.click('button:has-text("+")'); // Add a preparation input
    await page.fill('input[placeholder="Preparation Details"]', 'Preparation Detail');
    await page.click('button:has-text("+")'); // Add an agenda input
    await page.fill('input[placeholder="Agenda Details"]', 'Agenda Detail');
    await page.click('button:has-text("Next")');

    // Step 5: Summary and Create Event
    await page.click('button:has-text("Create event")');

    // Verify success toast message
    const successToast = await page.locator('.alert-success');
    await expect(successToast).toBeVisible();
  });

  test('should display error message for missing required fields', async ({ page }) => {
    // Step 1: Name
    await page.click('button:has-text("Next")'); // Try to go to the next step without filling the name

    // Verify error tooltip
    const nameErrorTooltip = await page.locator('[data-tip="please enter a Title"]');
    await expect(nameErrorTooltip).toBeVisible();
  });
});
