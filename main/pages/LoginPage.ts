import { expect, Page } from "@playwright/test";

export class LoginPage {

    page: Page;
    baseURL: string = 'https://automationexercise.com/login';

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToLoginPage() {
        await this.page.goto(this.baseURL);
    }

    async login(email: string, password: string) {
        await this.navigateToLoginPage();
        await this.page.locator('input[data-qa="login-email"]').fill(email);
        await this.page.locator('input[data-qa="login-password"]').fill(password);
        await this.page.locator('button[data-qa="login-button"]').click();
    }

    async registerUser(email: string, password: string) {
        await this.navigateToLoginPage();
        await this.page.locator('input[data-qa="signup-name"]').fill(email);
        await this.page.locator('input[data-qa="signup-email"]').fill(password);
        await this.page.locator('button[data-qa="signup-button"]').click();
    }

    async invalidCredentialsErrorIsVisible() {
        const errorSelector = 'p:has-text("Your email or password")';
        const error = this.page.locator(errorSelector);
        await this.page.waitForSelector(errorSelector, { state: 'visible', timeout: 30000 });
        expect(error).toBeVisible();
    }

    async emailAddressExistsErrorIsVisble() {
        const errorMessage = this.page.locator('p:has-text("Email Address already exist!")');
        await errorMessage.isVisible();
        expect(errorMessage).toBeVisible();
    }

    async hasNavigatedToLoginPage() {
        await this.page.waitForURL(this.baseURL);
        expect(this.page.url()).toBe(this.baseURL);
    }

}