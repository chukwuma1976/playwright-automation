import { expect, Page } from '@playwright/test'

export class PaymentPage {

    async makePayment(page: Page, name: string, cardNumber: string, cvc: string, month: string, year: string) {

        await page.locator('input[name="name_on_card"]').fill(name);
        await page.locator('input.form-control.card-number').fill(cardNumber);
        await page.locator('input.form-control.card-cvc').fill(cvc);
        await page.locator('input.form-control.card-expiry-month').fill(month);
        await page.locator('input.form-control.card-expiry-year').fill(year);

        await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
    }

    async confirmSuccessfulPaymentMessage(page: Page) {
        await page.waitForURL("**/payment_done/**");
        const message = page.locator('h2[data-qa="order-placed"]');
        await message.isVisible();
        await expect(message).toBeVisible();
    }

    async downloadInvoice(page: Page) {
        const downloadPromise = page.waitForEvent('download');
        await page.getByText('Download Invoice').click();
        const download = await downloadPromise;
        expect(download.url()).toBeTruthy();
    }
}