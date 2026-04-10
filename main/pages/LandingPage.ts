import { Page, expect } from "@playwright/test";

export class LandingPage {

    baseURL: string = 'https://automationexercise.com/';

    async userIsLoggedIn(page: Page) {
        await page.waitForURL(this.baseURL);
        const loggedInUser = page.locator('a:has-text("Logged in as")');
        await loggedInUser.isVisible();
        expect(loggedInUser).toBeVisible();
    }

    async logOut(page: Page) {
        await page.waitForURL(this.baseURL);
        await page.locator('a[href="/logout"]').click();
    }

    async clickDeleteAccountButton(page: Page) {
        await page.locator('a[href="/delete_account"]').click(); //click delete account button
    }

}