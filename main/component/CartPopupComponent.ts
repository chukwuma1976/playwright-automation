import { Page } from '@playwright/test'

export class CartPopupComponent {

    page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    continueShopping = async () => await this.page.getByRole("button", { name: "Continue Shopping" }).click();

    viewCart = async () => await this.page.getByRole("link", { name: "View Cart" }).click();

    login = async () => await this.page.locator('a[href="/login"]').filter({ hasText: "Register" }).click();
}