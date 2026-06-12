import { expect, Page } from "@playwright/test";

export class DonationPage {

    constructor(private page: Page) {
        this.page = page;
    }

    async verifyOnDonationPage() {
        expect(this.page.url()).toContain("donate");
    }

    async verifyOnPatreonPage() {
        expect(this.page.url()).toContain("www.patreon.com");
    }

    async verifyOnBuyMeACoffeePage() {
        expect(this.page.url()).toContain("buymeacoffee.com");
    }

    async verifyOnPaypalPage() {
        expect(this.page.url()).toContain("www.paypal.com");
    }

    async verifyOnStripePage() {
        expect(this.page.url()).toContain("buy.stripe.com");
    }

    async clickToDonateInDollars() {
        await this.page.getByRole("link", { name: "Click to Donate in $" }).click();
    }

    async clickToDonateInRupees() {
        await this.page.getByRole("link", { name: "Click to Donate in INR" }).click();
    }

    async clickToDonateByPayPal() {
        await this.page.getByRole("link", { name: "PAYPAL" }).click();
    }

    async clickToBuyMeACoffee() {
        await this.page.getByRole("link", { name: "Buy Me a coffee" }).click();
    }

    async clickPatreonPage() {
        await this.page.getByRole("link", { name: "Click to be a Patron" }).click();
    }

    async enterDollarAmount(dollarAmount: string) {
        await this.page.getByPlaceholder("$0.00").fill(dollarAmount);
    }

    async enterRupeeAmount(rupeeAmount: string) {
        await this.page.getByPlaceholder("₹0.00").fill(rupeeAmount);
    }

    async enterAmount(amount: string) {
        await this.page.locator("#customUnitAmount").fill(amount);
    }
}