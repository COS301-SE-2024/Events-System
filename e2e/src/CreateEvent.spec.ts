import { test, expect } from '@playwright/test';


test.describe('Event Creation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/createevent'); // Replace with your application's URL
  });

  test('should navigate through steps and fill out the form', async ({ page }) => {
    // Step 1: Name
    await page.fill('input[name="name"]', 'Updated Event');
    await page.click('button[name="namenext"]');

    // Step 2: Description
    // Wait for the description textarea to be visible
    await page.waitForSelector('textarea[name="desription"]', { state: 'visible' });

    // Fill the description textarea with information
    await page.fill('textarea[name="desription"]', 'This is the description of the event.');
    await page.click('button[name="descriptionnext"]');

    // Step 3: Details
    // Wait for the location input to be visible
    await page.waitForSelector('input[name="location"]', { state: 'visible' });
    await page.fill('input[name="starttime"]', '10:00');
    await page.fill('input[name="endtime"]', '12:00');
    await page.fill('input[name="startdate"]', '2024-06-23');
    await page.fill('input[name="enddate"]', '2024-06-24');
    await page.fill('input[name="location"]', 'Event Location');
    await page.fill('input[name="socialclub"]', 'Social Club');
    await page.click('button[name="details1next"]');

    // Step 4: Prep & Agenda
    // Wait for the prep and agenda input to be visible
    await page.waitForSelector('text="Preparation Details"', { state: 'visible' });
    await page.click('button[name="details2next"]');

    await page.waitForSelector('button[name="createbutton"]', { state: 'visible' });


    await expect(page.locator('button[name="createbutton"]')).toBeVisible();
  });

});