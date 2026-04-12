import { expect, Page } from '@playwright/test'

export class CheckOutPage {

    async confirmAddress(page: Page, user: any) {
        const addressInfo = await page.locator('ul#address_delivery').textContent();
        expect(addressInfo).toContain(user.firstname);
        expect(addressInfo).toContain(user.lastname);
        expect(addressInfo).toContain(user.address1);
        expect(addressInfo).toContain(user.city);
        expect(addressInfo).toContain(user.state);
        expect(addressInfo).toContain(user.country);
        expect(addressInfo).toContain(user.zipcode);
    }

    async enterDescription(page: Page, description: string) {
        await page.locator('textarea[name="message"]').fill(description);
    }

    async submitOrder(page: Page) {
        await page.getByRole('link', { name: 'Place Order' }).click();
    }
}