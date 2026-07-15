import { Locator, Page } from "@playwright/test";
import { generateFullURL, selectorsHub } from "../configuratons/config";

export class MultiplePage {

    baseUrl: string;
    donationButton: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.baseUrl = generateFullURL(selectorsHub, "xpath-practice-page/");
        this.donationButton = page.getByTitle("Click to donate");

    }

    async navigateToLandingPage() {
        await this.page.goto(this.baseUrl);
    }

    async openDonationPage() {
        await this.donationButton.click();
    }

}