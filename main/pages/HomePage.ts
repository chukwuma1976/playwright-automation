import { expect, Page } from "@playwright/test";

export class HomePage {

    baseURL: string = 'https://automationexercise.com';

    async clickContactUs(page: Page) {
        await page.goto(this.baseURL);
        await page.locator('a[href="/contact_us"]').click();
    }

    async clickTestCases(page: Page) {
        await page.goto(this.baseURL);
        await page.locator('a[href="/test_cases"]').first().click();
    }

    async clickAPIList(page: Page) {
        await page.goto(this.baseURL);
        await page.locator('a[href="/api_list"]').first().click();
    }

    async clickProducts(page: Page) {
        await page.goto(this.baseURL);
        const productsLink = page.locator('a[href="/products"]');
        await productsLink.click();
        if (page.url().includes('google_vignette')) {
            await page.goBack(); // or reload
            await productsLink.click();
        }
    }

    async clickCart(page: Page) {
        await page.goto(this.baseURL);
        await page.locator('a[href="/view_cart"]').first().click();
    }

    async confirmSubscriptionHeader(page: Page) {
        await page.goto(this.baseURL);
        const subscriptionHeader = page.locator('h2:has-text("Subscription")');
        await subscriptionHeader.isVisible();
        await subscriptionHeader.click();
        expect(subscriptionHeader).toBeVisible();
    }

    async subscribe(page: Page, email: string) {
        await page.locator('input#susbscribe_email').fill(email);
        await page.locator('button#subscribe').click();
    }

    async confirmSuccessfulSubscription(page: Page) {
        const successfullySubscribed = page.locator('div#success-subscribe');
        await successfullySubscribed.isVisible();
        expect(successfullySubscribed).toBeVisible();
    }

    async hasRecommendedItemsHeader(page: Page) {
        await page.goto(this.baseURL);
        const header = page.locator('h2').filter({ hasText: "recommended items" });
        await header.isVisible();
        expect(header).toBeVisible();
    }

    async selectRecommendedItem(page: Page, item: string) {
        const carousel = page.locator("div.carousel-inner").nth(1);
        const recommendedItem = carousel.locator('div.single-products').filter({ hasText: item });
        const addRecommendedItemButton = recommendedItem.locator('a.add-to-cart');
        await addRecommendedItemButton.isVisible();
        await addRecommendedItemButton.click();
    }

    async scrollToTopWithArrowAndConfirm(page: Page) {
        await page.locator('a#scrollUp').click();
        const top = page.locator('h2').filter({ hasText: 'Full-Fledged practice website for Automation Engineers' }).first();
        await top.isVisible();
        expect(top).toBeVisible();
    }

    async scrollToTopWithoutArrowAndConfirm(page: Page) {
        const top = page.locator('h2').filter({ hasText: 'Full-Fledged practice website for Automation Engineers' }).first();
        await top.isVisible();
        await top.click();
        expect(top).toBeVisible();
    }
}