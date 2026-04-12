import { expect, Page } from '@playwright/test';

export class ProductDetailPage {

    async confirmThatProductDetailsAreVisible(page: Page) {

        const productDetails = page.locator('div.product-details');

        const productName = productDetails.locator('h2').first();
        await expect(productName).toBeVisible();

        const productCategory = productDetails.locator('p:has-text("Category")');
        await expect(productCategory).toBeVisible();

        const productPrice = productDetails.locator('span:has-text("Rs.")').first();
        await expect(productPrice).toBeVisible();

        const productQuantity = productDetails.locator('label:has-text("Quantity")');
        await expect(productQuantity).toBeVisible();

        const productAvailability = productDetails.locator('p:has-text("Availability")');
        await expect(productAvailability).toBeVisible();

        const productCondition = productDetails.locator('p:has-text("Condition")');
        await expect(productCondition).toBeVisible();

        const productBrand = productDetails.locator('p:has-text("Brand")');
        await expect(productBrand).toBeVisible();
    }

    async changeProductQuantity(page: Page, quantity: string) {
        await page.locator('input#quantity').fill(quantity);
    }

    async addProductToCart(page: Page) {
        const productDetails = page.locator('div.product-details');
        const addproductButton = productDetails.getByRole('button', { name: 'Add to cart' });
        await addproductButton.click();
    }

    async confirmWriteYourReviewIsPresent(page: Page) {
        const header = page.locator('a[href="#reviews"]');
        await header.isVisible();
        expect(header).toBeVisible();
    }

    async writeReview(page: Page, name: string, email: string, review: string) {
        await page.locator('input#name').fill(name);
        await page.locator('input#email').fill(email);
        await page.locator('textarea#review').fill(review);
        await page.locator('button#button-review').click();
    }

    async confirmReviewReceivedMessage(page: Page) {
        const reviewReceived = page.locator('div#review-section .alert-success');
        await reviewReceived.isVisible();
        expect(reviewReceived).toBeVisible();
    }

}