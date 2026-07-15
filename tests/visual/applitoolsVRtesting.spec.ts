import test, { expect } from "@playwright/test"
import { ApplitoolsPage } from "../../main/pages/ApplitoolsPage"
import { vrTestingOptions } from "../../main/utilities/vrTestingOptions";

test.describe("Visual Regression testing", () => {
    test("Visual regression testing of a login page", async ({ page }) => {
        const loginPage = new ApplitoolsPage(page);

        await loginPage.navigateToLogin();
        await expect(page).toHaveScreenshot(vrTestingOptions);

        await loginPage.login();
        await loginPage.verifyOnLandingPage();
        await expect(page).toHaveScreenshot(vrTestingOptions);
    })
})