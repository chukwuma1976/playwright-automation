import { expect, Page } from '@playwright/test'

export class CartPage {

    async confirmSubscriptionHeader(page: Page) {
        const subscriptionHeader = page.locator('h2:has-text("Subscription")');
        await subscriptionHeader.isVisible();
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

    async confirmNumberOfProductsInCartToBe(page: Page, count: number) {
        const productsInCart = page.locator('tbody tr');
        expect(await productsInCart.count()).toBe(count);
    }

    async confirmQuantityOfProductIs(page: Page, index: number, quantity: string) {
        const productsInCart = page.locator('tbody tr');
        const productQuantity = await productsInCart.nth(index).locator('td.cart_quantity button').textContent();
        expect(productQuantity).toBe(quantity);
    }

    async confirmContentOfProduct(page: Page, index: number, quantity: string, price: string | null, totalPrice: string | null) {
        const productsInCart = page.locator('tbody tr');
        const productPrice = await productsInCart.nth(index).locator('td.cart_price p').textContent();
        const productQuantity = await productsInCart.nth(index).locator('td.cart_quantity button').textContent();
        const productTotalPrice = await productsInCart.nth(index).locator('td.cart_total p').textContent();
        expect(productPrice).toContain(price);
        expect(productQuantity).toBe(quantity);
        expect(productTotalPrice).toContain(totalPrice);
    }

    async confirmPresenceOfProductInCart(page: Page, name: string) {
        const productsInCart = await page.locator('tbody').textContent();
        expect(productsInCart).toContain(name);
    }

    async deleteProduct(page: Page, index: number) {
        const productsInCart = page.locator('tbody tr');
        const productToDeleteButton = productsInCart.nth(index).locator('td.cart_delete a');
        await productToDeleteButton.click();
        await page.reload();
    }

    async proceedToCheckout(page: Page) {
        await page.locator('a').filter({ hasText: 'Proceed To Checkout' }).click();
    }
}