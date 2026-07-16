import test, { chromium, expect } from "@playwright/test"
import { generateFullURL, playwright_dev_locators } from "../../main/configuratons/config";
import { AlertsPage } from "../../main/pages/AlertsPage";

test.describe("Let's talk about remote browsers", () => {

    test.skip("Create remote connection with connect method, educational only", async () => {
        // This is for educational purposes only, the endpoint is fake
        const browser = await chromium.connect("ws://remote-host:9222");
        const context = browser.contexts()[0];
        const page = context.pages()[0];
        await page.goto(generateFullURL(playwright_dev_locators));

        const browser2 = await chromium.connectOverCDP("ws://remote-host:9222")
        const context2 = browser2.contexts()[0];
        const page2 = context2.pages()[0];
        await page2.goto(generateFullURL(playwright_dev_locators));
    })

    test("remote connection", async () => {
        const server = await chromium.launchServer();

        try {
            const browser = await chromium.connect(
                server.wsEndpoint()
            );

            const context = await browser.newContext();
            const page = await context.newPage();

            const alertsPage = new AlertsPage(page);

            await alertsPage.navigateToAlertsPage();

            await expect(page).toHaveURL(/popups/);

            await alertsPage.testAlertPopUp();
            await alertsPage.testConfirmPopUp();
            await alertsPage.testTooltipPopUp();

            await browser.close();
        }
        finally {
            await server.close();
        }
    });
})