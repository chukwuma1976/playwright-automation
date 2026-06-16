import { expect, Locator, Page } from "@playwright/test";
import { applitoolsUiUrl } from "../configuratons/config";

export class ApplitoolsPage {

    pageURL: string;
    usernameInput: Locator;
    passwordInput: Locator;
    signinBtn: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.pageURL = applitoolsUiUrl;
        this.usernameInput = page.getByPlaceholder("Enter your username");
        this.passwordInput = page.getByPlaceholder("Enter your password");
        this.signinBtn = page.getByRole("link", { name: "Sign in" });
    }

    async navigateToLogin() {
        await this.page.goto(this.pageURL);
        await this.page.waitForURL("**demo.applitools.com**")
    }

    async login(username: string = "visualRegressionTester", password: string = "visualRegressionPassword") {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signinBtn.click();
    }

    async verifyOnLandingPage() {
        await expect(this.page.url()).toContain("/app.html");
    }

}