import test, { expect } from "@playwright/test";
import { AlertsPage } from "../../main/pages/AlertsPage";

test.describe('Testing all sorts of popups', () => {
    let alertsPage: AlertsPage;

    test.beforeEach(async ({ page }) => {
        alertsPage = new AlertsPage(page);
        await alertsPage.navigateToAlertsPage();
    });

    test('Test alert popup', async ({ page }) => {
        await alertsPage.testAlertPopUp();
    });

    test('Test confirm popup', async ({ page }) => {
        await alertsPage.testConfirmPopUp();
    });

    test('Test prompt popup', async ({ page }) => {
        await alertsPage.testPromptPopUp();
    });

    test('Test tooltip popup', async ({ page }) => {
        await alertsPage.testTooltipPopUp();
    });
});