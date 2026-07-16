import { expect, Page } from '@playwright/test'
import path from 'path';
import fs from 'fs';

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
        // wait for download event prior to download button action
        const downloadPromise = this.page.waitForEvent('download');
        const downloadButton = this.page.getByText('Download Invoice');
        await expect(downloadButton).toBeVisible();
        await downloadButton.click();
        const download = await downloadPromise;

        // save download to downloads folder in root directory
        const directory = path.join("./downloads/", download.suggestedFilename());
        await download.saveAs(directory);
        expect(fs.existsSync(directory)).toBeTruthy();

        // extract data and validate
        const buffer = fs.readFileSync(directory);
        const invoice = buffer.toString();
        expect(invoice).toContain("Your total purchase amount");
    }
}