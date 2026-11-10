import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080/';

// TEST FIXTURE:
// 1. A Chromium browser is launched.
// 2. The URL http://localhost:8080/ is open on the web browser.
// 3. The values of cookies "1", "2", and "3" are set to "false" (no cats are rented).
test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
  await page.evaluate(() => {
    document.cookie = '1=false';
    document.cookie = '2=false';
    document.cookie = '3=false';
  });
});

test('TEST-1-RESET', async ({ page }) => {
  // PRECONDITIONS: cookies "1", "2", and "3" are set to "true".
  await page.evaluate(() => {
    document.cookie = '1=true';
    document.cookie = '2=true';
    document.cookie = '3=true';
  });

  // Press the "Reset" link.
  await page.getByRole('link', { name: 'Reset' }).click();

  const catNames = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem');
  await expect(catNames.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(catNames.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(catNames.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  // Press the "Catalog" link.
  await page.getByRole('link', { name: 'Catalog' }).click();

  const secondCatPhoto = page
    .getByRole('list', { name: 'Cat photos' })
    .getByRole('listitem')
    .nth(1)
    .getByRole('img');
  await expect(secondCatPhoto).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  // Press the "Catalog" link.
  await page.getByRole('link', { name: 'Catalog' }).click();

  const catNames = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem');
  await expect(catNames).toHaveCount(3);
  await expect(catNames.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  // Press the "Rent-A-Cat" link.
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

  await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  // Press the "Rent-A-Cat" link.
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

  // Enter "1" into the input box for the rented cat ID.
  await page.getByLabel('Enter the ID of the cat to rent:', { exact: true }).fill('1');

  // Press the "Rent" button.
  await page.getByRole('button', { name: 'Rent', exact: true }).click();

  const catNames = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem');
  await expect(catNames.nth(0)).toHaveText('Rented out');
  await expect(catNames.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(catNames.nth(2)).toHaveText('ID 3. Mistoffelees');
  await expect(page.getByText('Success!')).toBeVisible();
});

test('TEST-6-RETURN', async ({ page }) => {
  // PRECONDITIONS: cookies "2" and "3" are set to "true".
  await page.evaluate(() => {
    document.cookie = '2=true';
    document.cookie = '3=true';
  });

  // Press the "Rent-A-Cat" link.
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();

  // Enter "2" into the input box for the returned cat ID.
  await page.getByLabel('Enter the ID of the cat to return:', { exact: true }).fill('2');

  // Press the "Return" button.
  await page.getByRole('button', { name: 'Return' }).click();

  const catNames = page.getByRole('list', { name: 'Cat names' }).getByRole('listitem');
  await expect(catNames.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(catNames.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(catNames.nth(2)).toHaveText('Rented out');
  await expect(page.getByText('Success!')).toBeVisible();
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  // Press the "Feed-A-Cat" link.
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

  await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  // Press the "Feed-A-Cat" link.
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

  // Enter "6" into the input box for number of catnips.
  await page.getByLabel('Number of catnips to feed:', { exact: true }).fill('6');

  // Press the "Feed" button.
  await page.getByRole('button', { name: 'Feed' }).click();

  // Cats jostle each other for 7 seconds before they eat, so allow extra time.
  await expect(page.getByText('Nom, nom, nom.')).toBeVisible({ timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  // Press the "Greet-A-Cat" link.
  await page.getByRole('link', { name: 'Greet-A-Cat' }).click();

  await expect(page.getByText('Meow!Meow!Meow!', { exact: true })).toBeVisible();
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  // Navigate to the "/greet-a-cat/Jennyanydots" URL.
  await page.goto(BASE_URL + 'greet-a-cat/Jennyanydots');

  await expect(page.getByText('Meow! from Jennyanydots.', { exact: true })).toBeVisible();
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
  // PRECONDITIONS: cookies "1", "2", and "3" are set to "true".
  await page.evaluate(() => {
    document.cookie = '1=true';
    document.cookie = '2=true';
    document.cookie = '3=true';
  });

  // Press the "Feed-A-Cat" link.
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

  await expect(page.locator('body')).toHaveScreenshot();
});
