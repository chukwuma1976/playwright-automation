import { expect, Locator, Page } from "@playwright/test";
import { generateFullURL, practiceTestingUi } from "../configuratons/config";

export class PracticeLoginPage {
    URL: string;
    emailInput: Locator;
    passwordInput: Locator;
    loginButton: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.URL = generateFullURL(practiceTestingUi, "notes/app/login");
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.loginButton = page.getByRole("button", { name: "Login" });
    }

    async navigateToLoginPage() {
        await this.page.goto(this.URL);
    }

    async loginUser(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyUserOnLandingPage() {
        await this.page.getByRole("link", { name: "MyApp" }).isVisible();
        expect(this.page.url()).toBe("https://practice.expandtesting.com/notes/app");
    }

    async verifyUserStillOnLoginPage() {
        expect(this.page.url()).toContain("/login");
    }

    async verifyUnauthorizedAccess() {
        const unauthorized = this.page.getByText("Unauthorized Request");
        await expect(unauthorized).toBeVisible();
    }

    async verifyForbiddenAccess() {
        const forbidden = this.page.getByText("Forbidden");
        await expect(forbidden).toBeVisible();
    }
}