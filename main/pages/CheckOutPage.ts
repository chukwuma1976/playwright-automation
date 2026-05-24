import { expect, Locator, Page } from '@playwright/test'

export class CheckOutPage {
    addressInfo: Locator;
    description: Locator;
    placeOrderButton: Locator;

    constructor(page: Page) {
        this.addressInfo = page.locator('ul#address_delivery');
        this.description = page.locator('textarea[name="message"]');
        this.placeOrderButton = page.getByRole('link', { name: 'Place Order' });
    }

    async confirmAddress(user: any) {
        const addressInfo = await this.addressInfo.textContent();
        expect(addressInfo).toContain(user.firstname);
        expect(addressInfo).toContain(user.lastname);
        expect(addressInfo).toContain(user.address1);
        expect(addressInfo).toContain(user.city);
        expect(addressInfo).toContain(user.state);
        expect(addressInfo).toContain(user.country);
        expect(addressInfo).toContain(user.zipcode);
    }

    async enterDescription(description: string) {
        await this.description.fill(description);
    }

    async submitOrder() {
        await this.placeOrderButton.click();
    }
}