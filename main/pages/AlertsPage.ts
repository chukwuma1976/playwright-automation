import { expect, Page } from "@playwright/test";
import { generateFullURL, practiceAutomation } from "../configuratons/config";

export class AlertsPage {
    page: Page;
    alertsPageURL: string;

    constructor(page: Page) {
        this.page = page;
        this.alertsPageURL = generateFullURL(practiceAutomation, "/popups");
    }

    async navigateToAlertsPage() {
        await this.page.goto(this.alertsPageURL);
    };

    async testAlertPopUp() {
        const alertButton = this.page.locator("#alert");
        await alertButton.click();
        this.page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });
    }

    async testConfirmPopUp() {
        const confirmButton = this.page.locator("#confirm");
        const confirmResult = this.page.locator("#confirmResult");
        const confirmStatement = await confirmResult.textContent();

        await confirmButton.click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        })
        expect(confirmStatement, "OK it is!");

        await confirmButton.click();
        this.page.on('dialog', async dialog => {
            await dialog.dismiss();
        })
        expect(confirmStatement, "Cancel it is!");
    }

    async testPromptPopUp() {
        const promptButton = this.page.locator("#prompt");
        const promptResult = this.page.locator("#promptResult");

        this.page.on('dialog', async dialog => {
            dialog.accept("Mr. Playwright");
        })
        await promptButton.click();

        await promptResult.waitFor();
        const promptStatement = await promptResult.textContent();
        expect(promptStatement?.includes("Mr. Playwright")).toBe(true);
    }

    async testTooltipPopUp() {
        const tooltipButton = this.page.locator("div.tooltip_1");
        await tooltipButton.click();
        const tooltip = this.page.locator("#myTooltip");
        const tooltipText = await tooltip.textContent();
        expect(tooltipText?.trim()).toBe("Cool text");
    };

}