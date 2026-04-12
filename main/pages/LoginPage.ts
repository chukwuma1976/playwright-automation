import { expect, Page } from "@playwright/test";

export class LoginPage {

    baseURL: string = 'https://automationexercise.com/login';

    async login(page: Page, email: string, password: string) {
        await page.goto(this.baseURL);
        await page.locator('input[data-qa="login-email"]').fill(email);
        await page.locator('input[data-qa="login-password"]').fill(password);
        await page.locator('button[data-qa="login-button"]').click();
    }

    async registerUser(page: Page, email: string, password: string) {
        await page.goto(this.baseURL);
        await page.locator('input[data-qa="signup-name"]').fill(email);
        await page.locator('input[data-qa="signup-email"]').fill(password);
        await page.locator('button[data-qa="signup-button"]').click();
    }

    async invalidCredentialsErrorIsVisible(page: Page) {
        const errorSelector = 'p:has-text("Your email or password")';
        const error = page.locator(errorSelector);
        await page.waitForSelector(errorSelector, { state: 'visible', timeout: 5000 });
        expect(error).toBeVisible();
    }

    async emailAddressExistsErrorIsVisble(page: Page) {
        const errorMessage = page.locator('p:has-text("Email Address already exist!")');
        await errorMessage.isVisible();
        expect(errorMessage).toBeVisible();
    }

    async hasNavigatedToLoginPage(page: Page) {
        await page.waitForURL(this.baseURL);
        expect(page.url()).toBe(this.baseURL);
    }

}