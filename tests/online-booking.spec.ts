import { test, expect } from '@playwright/test';

test.describe('Online Booking Tests', () => {

    test('Reserve Room', async ({ page }) => {
        await page.goto('https://automationintesting.online/');
        await page.waitForSelector('#root-container', { timeout: 5000 });
        await page.getByRole('button', { name: 'Check Availability' }).click();
        await page.getByRole('link', { name: 'Book now', exact: true }).first().click();
        await page.getByRole('button', { name: '14' }).click();
        await page.getByRole('button', { name: 'Reserve Now' }).click();
        await page.getByRole('textbox', { name: 'Firstname' }).click();
        await page.getByRole('textbox', { name: 'Firstname' }).fill('Paul');
        await page.getByRole('textbox', { name: 'Lastname' }).click();
        await page.getByRole('textbox', { name: 'Lastname' }).fill('Uzoma');
        await page.getByRole('textbox', { name: 'Email' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill('paul.uzoma@yahoo.com');
        await page.getByRole('textbox', { name: 'Phone' }).click();
        await page.getByRole('textbox', { name: 'Phone' }).fill('12345678910');
        await page.getByRole('button', { name: 'Reserve Now' }).click();
        await page.getByText('Return Home').click();

        await page.getByTestId('ContactName').click();
        await page.getByTestId('ContactName').fill('Paul Uzoma');
        await page.getByTestId('ContactEmail').click();
        await page.getByTestId('ContactEmail').fill('paul.uzoma@yahoo.com');
        await page.getByTestId('ContactPhone').click();
        await page.getByTestId('ContactPhone').fill('12345678910');
        await page.getByTestId('ContactSubject').click();
        await page.getByTestId('ContactSubject').fill('Thank you');
        await page.getByTestId('ContactDescription').click();
        await page.getByTestId('ContactDescription').fill('Thank you for your help. I really appreciate it.');
        await page.getByRole('button', { name: 'Submit' }).click();
        const thankYou = page.getByText('Thanks for getting');
        await expect(thankYou).toContainText('Paul Uzoma');
    });

});