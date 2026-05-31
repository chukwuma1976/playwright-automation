import { expect, Locator, Page } from "@playwright/test";
import { generateFullURL, practiceTestingUi } from "../configuratons/config";

export class TestRegistrationPage {
    //use getByLabel if possible, let's see if that works
    usernameInput: Locator;
    passwordInput: Locator;
    confirmPasswordInput: Locator;
    registerButton: Locator;
    allFieldsRequiredMessage: Locator;
    passwordsNotMatchingMessage: Locator;
    URL: string;

    constructor(private page: Page) {
        this.page = page;
        this.URL = generateFullURL(practiceTestingUi, "register");
        this.usernameInput = page.getByLabel("Username");
        this.passwordInput = page.getByLabel("Password", { exact: true });
        this.confirmPasswordInput = page.getByLabel("Confirm Password");
        this.registerButton = page.getByRole("button", { name: "Register" });
        this.allFieldsRequiredMessage = page.getByText("All fields are required.");
        this.passwordsNotMatchingMessage = page.getByText("Passwords do not match.");
    }

    async navigateToRegister() {
        await this.page.goto(this.URL);
    }

    async registerUser(username: string, password: string, confirmPassword: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
        await this.registerButton.click();
    }

    async confirmAllFieldsRequired() {
        await expect(this.allFieldsRequiredMessage).toBeVisible();
    }

    async confirmPasswordsDoNotMatch() {
        await expect(this.passwordsNotMatchingMessage).toBeVisible();
    }

}