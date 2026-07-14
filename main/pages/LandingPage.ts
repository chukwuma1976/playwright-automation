import { Locator, Page, expect } from "@playwright/test";

export class LandingPage {

    page: Page;
    baseURL: string = 'https://automationexercise.com';
    loggedInSelector: string;
    logOutLink: Locator;
    deleteAccountLink: Locator;
    cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loggedInSelector = 'a:has-text("Logged in as")';
        this.logOutLink = this.page.locator('a[href="/logout"]');
        this.deleteAccountLink = this.page.locator('a[href="/delete_account"]');
        this.cartLink = this.page.locator('a[href="/view_cart"]');
    }

    async waitForPageToLoad() {
        await this.page.waitForURL(this.baseURL);
    }

    async userIsLoggedIn() {
        await this.waitForPageToLoad();
        const loggedInUser = this.page.locator(this.loggedInSelector);
        await expect(loggedInUser).toBeVisible();
    }

    async logOut() {
        await this.waitForPageToLoad();
        await this.logOutLink.click();
    }

    async clickDeleteAccountButton() {
        await this.deleteAccountLink.click(); //click delete account button
    }

    async clickCart() {
        await this.page.goto(this.baseURL);
        await this.cartLink.first().click();
    }

}