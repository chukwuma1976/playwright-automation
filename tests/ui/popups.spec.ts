import test, { expect } from "@playwright/test";
import { generateFullURL, practiceAutomation } from "../../main/configuratons/config";

test.describe('Testing all sorts of popups', () => {
    const url = generateFullURL(practiceAutomation, "/popups");
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
    });

    test('Test alert popup', async ({ page }) => {
        const alertButton = page.locator("#alert");
        await alertButton.click();
        page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });
    });

    test('Test confirm popup', async ({ page }) => {
        const confirmButton = page.locator("#confirm");
        const confirmResult = page.locator("#confirmResult");
        const confirmStatement = await confirmResult.textContent();

        await confirmButton.click();
        page.on('dialog', async dialog => {
            await dialog.accept();
        })
        expect(confirmStatement, "OK it is!");

        await confirmButton.click();
        page.on('dialog', async dialog => {
            await dialog.dismiss();
        })
        expect(confirmStatement, "Cancel it is!");

    });

    test('Test prompt popup', async ({ page }) => {
        const promptButton = page.locator("#prompt");
        const promptResult = page.locator("#promptResult");

        page.on('dialog', async dialog => {
            dialog.accept("Mr. Playwright");
        })
        await promptButton.click();

        await promptResult.waitFor();
        const promptStatement = await promptResult.textContent();
        expect(promptStatement?.includes("Mr. Playwright")).toBe(true);
    });

    test('Test tooltip popup', async ({ page }) => {
        const tooltipButton = page.locator("div.tooltip_1");
        await tooltipButton.click();
        const tooltip = page.locator("#myTooltip");
        const tooltipText = await tooltip.textContent();
        expect(tooltipText?.trim()).toBe("Cool text");
    });
});