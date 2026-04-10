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
        const error = page.locator('p:has-text("Your email or password")');
        await error.isVisible();
        expect(error).toBeVisible();
    }

    async hasNavigatedToLoginPage(page: Page) {
        await page.waitForURL(this.baseURL);
        expect(page.url()).toBe(this.baseURL);
    }
}