import { expect, Locator, Page } from "@playwright/test";
import { generateFullURL, selectorsHub } from "../configuratons/config";

export class DonationPage {
    URL: string;
    productsTab: Locator;
    proPlansTab: Locator;
    resourcesTab: Locator;
    menuContent: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.URL = generateFullURL(selectorsHub, "donate");
        this.productsTab = page.getByText("Products", { exact: true });
        this.proPlansTab = page.getByText("Pro Plans", { exact: true });
        this.resourcesTab = page.getByText("Resources", { exact: true }).first();
        this.menuContent = page.locator(".e-n-menu-content");
    }

    async navigateToDonationPage() {
        this.page.goto(this.URL);
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

    async hoverOverProducts() {
        await this.productsTab.hover();
        await this.verifyHoverMenuIsActive("SelectorsHubXPath & Selectors")
    }

    async hoverOverProPlans() {
        await this.proPlansTab.hover();
        await this.verifyHoverMenuIsActive("PROPRO SelectorsHub Pro Free")
    }

    async hoverOverResources() {
        await this.resourcesTab.hover();
        await this.verifyHoverMenuIsActive("Generative AI")
    }

    async verifyHoverMenuIsActive(content: string) {
        const className = await this.menuContent.filter({ hasText: content }).getAttribute("class");
        expect(className).toContain("active");
    }
}