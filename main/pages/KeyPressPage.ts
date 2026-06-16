import { expect, Locator, Page } from "@playwright/test";
import { generateFullURL, practiceAutomation, practiceTestingUi } from "../configuratons/config";
import { keyPresses } from "../utilities/testDataGenerator";

export class KeyPressPage {

    URL: string;
    keypressInput: Locator;
    result: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.URL = generateFullURL(practiceTestingUi, "key-presses?");
        this.keypressInput = page.locator("#target");
        this.result = page.locator("#result");
    }

    async navigateToKeyPressPage() {
        await this.page.goto(this.URL);
    }

    async enterKeyPress(keypress: string) {
        await this.keypressInput.press(keypress);
    }

    async verifyKeypressEntered(text: any) {
        const verificationText = await this.result.textContent();
        expect(verificationText).toContain(text);
    }

}