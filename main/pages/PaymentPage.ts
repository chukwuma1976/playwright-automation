import { expect, Page } from '@playwright/test'

export class PaymentPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async makePayment(name: string, cardNumber: string, cvc: string, month: string, year: string) {

        await this.page.locator('input[name="name_on_card"]').fill(name);
        await this.page.locator('input.form-control.card-number').fill(cardNumber);
        await this.page.locator('input.form-control.card-cvc').fill(cvc);
        await this.page.locator('input.form-control.card-expiry-month').fill(month);
        await this.page.locator('input.form-control.card-expiry-year').fill(year);

        await this.page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
    }

    async confirmSuccessfulPaymentMessage() {
        await this.page.waitForURL("**/payment_done/**");
        const message = this.page.locator('h2[data-qa="order-placed"]');
        await message.isVisible();
        await expect(message).toBeVisible();
    }

    async downloadInvoice() {
        const downloadPromise = this.page.waitForEvent('download');
        await this.page.getByText('Download Invoice').click();
        const download = await downloadPromise;
        expect(download.url()).toBeTruthy();
    }
}