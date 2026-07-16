import { expect, Locator, Page } from "@playwright/test";
import { generateFullURL, practiceTestingUi } from "../configuratons/config";

export class PracticeProfileDetailsPage {
    URL: string;
    profileID: Locator;
    email: Locator;
    name: Locator;
    phone: Locator;
    company: Locator;
    updateProfileButton: Locator;
    deleteAccountButton: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.URL = generateFullURL(practiceTestingUi, "notes/profile");
        this.updateProfileButton = page.getByRole("button", { name: "Update profile" });
        this.deleteAccountButton = page.getByRole("button", { name: "Delete Account" });

        this.profileID = page.getByLabel("User ID");
        this.email = page.getByLabel("Email address");
        this.name = page.getByTestId("user-name");
        this.phone = page.getByTestId("user-phone");
        this.company = page.getByTestId("user-company");
    }

    async navigateToProfileDetails() {
        await this.page.goto(this.URL);
    }

    async verifyProfileDetailsAreCorrect(email: string, name: string, phone: string, company: string) {
        await expect.soft(this.email).toHaveValue(email);
        await expect.soft(this.name).toHaveValue(name);
        await expect.soft(this.phone).toHaveValue(phone);
        await expect.soft(this.company).toHaveValue(company);
    }

    async verifyProfileDetailsAreCorrectWithId(id: string, email: string, name: string, phone: string, company: string) {
        await expect(this.profileID).toHaveValue(id);
        await this.verifyProfileDetailsAreCorrect(email, name, phone, company);
    }

    async editProfileDetails(name: string, phone: string, company: string) {
        await this.name.fill(name);
        await this.phone.fill(phone);
        await this.company.fill(company);
    }

    async clickUpdateProfile() {
        await this.updateProfileButton.click();
    }

    async clickDeleteAccount() {
        await this.deleteAccountButton.click();
    }

}