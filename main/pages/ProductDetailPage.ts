import { expect, Locator, Page } from '@playwright/test';

export class ProductDetailPage {

    page: Page;
    productDetails: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productDetails = page.locator('div.product-details');
    }

    async confirmThatProductDetailsAreVisible() {

        const productName = this.productDetails.locator('h2').first();
        await expect(productName).toBeVisible();

        const productCategory = this.productDetails.locator('p:has-text("Category")');
        await expect(productCategory).toBeVisible();

        const productPrice = this.productDetails.locator('span:has-text("Rs.")').first();
        await expect(productPrice).toBeVisible();

        const productQuantity = this.productDetails.locator('label:has-text("Quantity")');
        await expect(productQuantity).toBeVisible();

        const productAvailability = this.productDetails.locator('p:has-text("Availability")');
        await expect(productAvailability).toBeVisible();

        const productCondition = this.productDetails.locator('p:has-text("Condition")');
        await expect(productCondition).toBeVisible();

        const productBrand = this.productDetails.locator('p:has-text("Brand")');
        await expect(productBrand).toBeVisible();
    }

    async changeProductQuantity(quantity: string) {
        await this.page.locator('input#quantity').fill(quantity);
    }

    async addProductToCart() {
        const addproductButton = this.productDetails.getByRole('button', { name: 'Add to cart' });
        await addproductButton.click();
    }

    async confirmWriteYourReviewIsPresent() {
        const header = this.page.locator('a[href="#reviews"]');
        await expect(header).toBeVisible();
    }

    async writeReview(name: string, email: string, review: string) {
        await this.page.locator('input#name').fill(name);
        await this.page.locator('input#email').fill(email);
        await this.page.locator('textarea#review').fill(review);
        await this.page.locator('button#button-review').click();
    }

    async confirmReviewReceivedMessage() {
        const reviewReceived = this.page.locator('div#review-section .alert-success');
        await expect(reviewReceived).toBeVisible();
    }

}