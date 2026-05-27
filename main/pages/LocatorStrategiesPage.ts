import { expect, Page } from "@playwright/test";
import { generateLocatorURL, playwright_dev_locators } from "../configuratons/config";

export class LocatorStrategiesPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getByRoleLocator() {
        await this.page.goto(generateLocatorURL(playwright_dev_locators, "#locate-by-role"));
        await this.page.waitForURL("**#locate-by-role");
        const header = this.page.getByRole("heading", { name: "Sign Up" });
        await expect(header).toBeVisible();
        const checkBox = this.page.getByRole("checkbox", { name: "Subscribe" });
        await checkBox.check();
        await expect(checkBox).toBeChecked();
        const button = this.page.getByRole("button", { name: "Submit" });
        await button.click();
    }

    async getByLabelLocator() {
        await this.page.goto(generateLocatorURL(playwright_dev_locators, "#locate-by-label"));
        await this.page.getByLabel("Password").fill("located by label");
    }

    async getByPlaceholderLocator() {
        await this.page.goto(generateLocatorURL(playwright_dev_locators, "#locate-by-placeholder"));
        await this.page.getByPlaceholder("name@example.com").fill("located by placeholder");
    }

    async getByTextLocator() {
        await this.page.goto(generateLocatorURL(playwright_dev_locators, "#locate-by-text"));
        const welcomeMessage = this.page.getByText("Welcome, John").nth(1);
        await expect(welcomeMessage).toBeVisible();
    }

    async getByAltTextLocator() {
        await this.page.goto(generateLocatorURL(playwright_dev_locators, "#locate-by-alt-text"));
        const image = this.page.getByAltText("playwright logo").first();
        await expect(image).toBeVisible();
    }

    async getByTitleLocator() {
        await this.page.goto(generateLocatorURL(playwright_dev_locators, "#locate-by-title"));
        const issuesCount = this.page.getByTitle("Issues count");
        await expect(issuesCount).toContainText("25");
    }

    async getByTestIdLocator() {
        await this.page.goto(generateLocatorURL(playwright_dev_locators, "#locate-by-test-id"));
        const button = this.page.getByTestId("directions");
        await expect(button).toBeVisible();
    }
}