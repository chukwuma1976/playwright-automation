import { expect, Locator, Page } from "@playwright/test";
import { generateFullURL, practiceTestingUi } from "../configuratons/config";

export class TestLoginPage {
    //use getByRole when possible here, let's see if that works
    usernameInput: Locator;
    passwordInput: Locator;
    loginButton: Locator;
    successMessage: Locator;
    logoutButton: Locator;
    URL: string;
    invalidUsernameMessage: Locator;
    invalidPasswordMessage: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.URL = generateFullURL(practiceTestingUi, "login");
        this.usernameInput = page.getByRole("textbox", { name: "username" });
        this.passwordInput = page.getByRole("textbox", { name: "password" });
        this.loginButton = page.getByRole("button", { name: "login" });
        this.successMessage = page.getByText("You logged into a secure area!");
        this.logoutButton = page.getByRole("link", { name: "logout" });
        this.invalidUsernameMessage = page.getByText("Your username is invalid!");
        this.invalidPasswordMessage = page.getByText("Your password is invalid!");
    }

    async navigateToLoginPage() {
        await this.page.goto(this.URL);
    }

    async loginUser(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyNavigation() {
        expect(this.page.url()).toContain("/secure");
    }

    async confirmSuccessMessage() {
        await expect(this.successMessage).toBeVisible();
    }

    async verifyLogoutButtonIsVisible() {
        await expect(this.logoutButton).toBeVisible();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async verifyInvalidUsernameMessage() {
        await this.invalidUsernameMessage.isVisible();
        await expect(this.invalidUsernameMessage).toBeVisible();
    }

    async verifyInvalidPasswordMessage() {
        await this.invalidPasswordMessage.isVisible();
        await expect(this.invalidPasswordMessage).toBeVisible();
    }

    async verifyInvalidFieldMessage() {
        await this.invalidUsernameMessage.or(this.invalidPasswordMessage).isVisible();
        await expect(this.invalidUsernameMessage.or(this.invalidPasswordMessage)).toBeVisible();
    }

    async verifyUserStillOnLoginPage() {
        expect(this.page.url()).toContain("/login");
    }
}