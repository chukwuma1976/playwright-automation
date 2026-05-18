import test, { expect } from "@playwright/test";
import { generateFullURL, practiceAutomation } from "../../main/configuratons/config";

test.describe(() => {
    test('Test spinner functionality', async ({ page }) => {
        await page.goto(generateFullURL(practiceAutomation, "/spinners/"));
        const spinner = page.locator(".spinner-hidden");
        await spinner.waitFor({ state: "hidden" });
    });
})