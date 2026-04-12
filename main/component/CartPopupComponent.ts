import { Page } from '@playwright/test'

export class CartPopupComponent {
    continueShopping = async (page: Page) => await page.getByRole("button", { name: "Continue Shopping" }).click();

    viewCart = async (page: Page) => await page.getByRole("link", { name: "View Cart" }).click();

    login = async (page: Page) => await page.locator('a[href="/login"]').filter({ hasText: "Register" }).click();
}