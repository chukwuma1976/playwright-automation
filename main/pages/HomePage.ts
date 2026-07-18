import { expect, Locator, Page, Route } from "@playwright/test";

export class HomePage {

    page: Page;
    baseURL: string = 'https://automationexercise.com';
    contactUsLink: Locator;
    testCasesLink: Locator
    apiListLink: Locator;
    productsLink: Locator;
    cartLink: Locator;
    subscriptionHeader: Locator;
    successfullySubscribed: Locator;
    recommendedItemsHeader: Locator;
    carousel: Locator;
    scrollToTopArrow: Locator;
    confirmationHeader: Locator;


    constructor(page: Page) {
        this.page = page;
        this.contactUsLink = page.getByRole("link", { name: "Contact us" });
        this.testCasesLink = page.locator('a[href="/test_cases"]').first();
        this.apiListLink = page.locator('a[href="/api_list"]').first();
        this.productsLink = page.locator('a[href="/products"]');
        this.cartLink = page.locator('a[href="/view_cart"]').first();
        this.subscriptionHeader = page.locator('h2:has-text("Subscription")');
        this.successfullySubscribed = page.locator('div#success-subscribe');
        this.recommendedItemsHeader = page.locator('h2').filter({ hasText: "recommended items" });
        this.carousel = page.locator("div.carousel-inner").nth(1);
        this.scrollToTopArrow = page.locator('a#scrollUp');
        this.confirmationHeader = page.getByAltText("Website for automation practice");
    }

    async navigateToHomePage() {
        await this.page.goto(this.baseURL);
    }
    async clickContactUs() {
        await this.navigateToHomePage();
        await this.contactUsLink.click();
    }

    async clickTestCases() {
        await this.navigateToHomePage();
        await this.testCasesLink.click();
    }

    async clickAPIList() {
        await this.navigateToHomePage();
        await this.apiListLink.click();
    }

    async clickProducts() {
        await this.navigateToHomePage();
        await this.productsLink.click();
        if (this.page.url().includes('google_vignette')) {
            await this.page.goBack(); // or reload
            await this.productsLink.click();
        }
    }

    async clickCart() {
        await this.navigateToHomePage();
        await this.cartLink.click();
    }

    async confirmSubscriptionHeader() {
        await this.navigateToHomePage();
        const subscriptionHeader = this.page.locator('h2:has-text("Subscription")');
        await subscriptionHeader.click();
        expect(subscriptionHeader).toBeVisible();
    }

    async subscribe(email: string) {
        await this.page.locator('input#susbscribe_email').fill(email);
        await this.page.locator('button#subscribe').click();
    }

    async confirmSuccessfulSubscription() {
        expect(this.successfullySubscribed).toBeVisible();
    }

    async hasRecommendedItemsHeader() {
        await this.page.goto(this.baseURL);
        await expect(this.recommendedItemsHeader).toBeVisible();
    }

    async selectRecommendedItem(item: string) {
        const recommendedItem = this.carousel.locator('div.single-products').filter({ hasText: item });
        const addRecommendedItemButton = recommendedItem.locator('a.add-to-cart');
        await addRecommendedItemButton.isVisible();
        await addRecommendedItemButton.click();
    }

    async scrollToTopWithArrowAndConfirm() {
        await this.scrollToTopArrow.click();
        expect(this.confirmationHeader).toBeVisible();
        await this.confirmationHeader.click();
    }

    async scrollToTopWithoutArrowAndConfirm() {
        expect(this.confirmationHeader).toBeVisible();
        await this.confirmationHeader.click();
    }

    async blockGooglePopup() {
        await this.page.route("**pagead**", (route) => {
            route.abort();
        })
    }
}