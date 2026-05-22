import { expect, Locator, Page } from '@playwright/test'

export class CartPage {
    page: Page;
    subscriptionHeader: Locator;
    subscriptionEmail: Locator;
    subscribeButton: Locator;
    successfullySubscribed: Locator;
    productsInCart: Locator;
    proceedToCheckoutButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.subscriptionHeader = page.locator('h2:has-text("Subscription")');
        this.subscriptionEmail = page.locator('input#susbscribe_email');
        this.subscribeButton = page.locator('button#subscribe');
        this.successfullySubscribed = page.locator('div#success-subscribe');
        this.productsInCart = page.locator('tbody tr');
        this.proceedToCheckoutButton = page.locator('a').filter({ hasText: 'Proceed To Checkout' });
    }

    async confirmSubscriptionHeader() {
        await this.subscriptionHeader.isVisible();
        expect(this.subscriptionHeader).toBeVisible();
    }

    async subscribe(email: string) {
        await this.subscriptionEmail.fill(email);
        await this.subscribeButton.click();
    }

    async confirmSuccessfulSubscription() {
        await this.successfullySubscribed.isVisible();
        expect(this.successfullySubscribed).toBeVisible();
    }

    async confirmNumberOfProductsInCartToBe(count: number) {
        expect(await this.productsInCart.count()).toBe(count);
    }

    async confirmQuantityOfProductIs(index: number, quantity: string) {
        const productQuantity = await this.productsInCart.nth(index).locator('td.cart_quantity button').textContent();
        expect(productQuantity).toBe(quantity);
    }

    async confirmContentOfProduct(index: number, quantity: string, price: string | null, totalPrice: string | null) {
        const productTotalPrice = await this.productsInCart.nth(index).locator('td.cart_total p').textContent();
        const productPrice = await this.productsInCart.nth(index).locator('td.cart_price p').textContent();
        const productQuantity = await this.productsInCart.nth(index).locator('td.cart_quantity button').textContent();
        expect(productPrice).toContain(price);
        expect(productQuantity).toBe(quantity);
        expect(productTotalPrice).toContain(totalPrice);
    }

    async confirmPresenceOfProductInCart(name: string) {
        const productsInCart = await this.productsInCart.textContent();
        expect(productsInCart).toContain(name);
    }

    async deleteProduct(index: number) {
        const productToDeleteButton = this.productsInCart.nth(index).locator('td.cart_delete a');
        await productToDeleteButton.click();
        await this.page.reload();
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }
}