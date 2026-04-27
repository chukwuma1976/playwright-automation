import { Page, expect } from "@playwright/test";

export class LandingPage {

    baseURL: string = 'https://automationexercise.com';

    async userIsLoggedIn(page: Page) {
        await page.waitForURL(this.baseURL);
        const loggedInSelector = 'a:has-text("Logged in as")';
        const loggedInUser = page.locator(loggedInSelector);
        await page.waitForSelector(loggedInSelector, { state: 'visible', timeout: 30000 });
        expect(loggedInUser).toBeVisible();
    }

    async logOut(page: Page) {
        await page.waitForURL(this.baseURL);
        await page.locator('a[href="/logout"]').click();
    }

    async clickDeleteAccountButton(page: Page) {
        await page.locator('a[href="/delete_account"]').click(); //click delete account button
    }

    async clickCart(page: Page) {
        await page.goto(this.baseURL);
        await page.locator('a[href="/view_cart"]').first().click();
    }

}