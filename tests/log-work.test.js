import { test, expect } from '@playwright/test';

test('Log working time 8hrs', async ({ page }) => {

  expect(process.env.HRWORKS_USERNAME).toBeDefined();
  expect(process.env.HRWORKS_PASS).toBeDefined();

  await page.goto('https://login.hrworks.de/?redirect=q%2Ftime-management%2Fworking-times', { waitUntil: 'domcontentloaded'});

  const companyElement = await page.$('input[name="company"]');
  const userIdelement = await page.$('input[name="login"]');
  const passwordElement = await page.$('input[type="password"]');  

  await companyElement.click();
  await page.waitForTimeout(500);
  await companyElement.fill('cid');
  await page.waitForTimeout(500);

  await userIdelement.click();
  await page.waitForTimeout(500);
  await userIdelement.fill(process.env.HRWORKS_USERNAME);
  await page.waitForTimeout(500);

  await passwordElement.click();
  await page.waitForTimeout(500);
  await passwordElement.fill(process.env.HRWORKS_PASS);
  await page.waitForTimeout(500);
  
  const buttonElement = await page.$('button[type="button"]');
  await buttonElement.click();

  await expect(page).toHaveURL('https://ssl6.hrworks.de/q/time-management/working-times');

  const addTimeButton = await page.locator('.hrw-me-working-time-day-header-row a:not(.disabled)').filter({has: page.locator('i.icon-streamline-add')}).first();

  await addTimeButton.scrollIntoViewIfNeeded();
  await addTimeButton.hover();
  await addTimeButton.click();
  await page.waitForTimeout(1000);

  const startTimeInput = await page.$(':nth-match(.me-object-holder-group input, 1)');
  const endTimeInput = await page.$(':nth-match(.me-object-holder-group input, 2)');
  const saveButton = await page.getByText('Save');

  await startTimeInput.scrollIntoViewIfNeeded();
  await startTimeInput.click();
  await page.waitForTimeout(500);
  await startTimeInput.fill('09:00');
  
  await endTimeInput.click();
  await page.waitForTimeout(500);
  await endTimeInput.fill('18:00');

  await page.waitForTimeout(500);
  await saveButton.click();
  await page.waitForTimeout(1000);

  const modalDialogYesButton = await page.locator('.modal-dialog button').first();
  modalDialogYesButton.click();
  await page.waitForTimeout(2000);

  const successSaveToast = await page.getByText("Working hours was saved");

  expect(successSaveToast.isVisible());
  

});