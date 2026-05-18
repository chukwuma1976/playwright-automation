import { test } from '@playwright/test';
import { generateFullURL, practiceAutomation } from '../../main/configuratons/config';

test.describe('File Download', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(generateFullURL(practiceAutomation, "/file-download"));
    });

    test('Test normal file download', async ({ page }) => {

        const normalDownloadButton = page.locator("a").filter({ hasText: "Download" }).first();
        await normalDownloadButton.click();

    });

    test('Test file download with password', async ({ page }) => {

        const downloadButtonWithPassword = page.locator("a[href='#unlock']");
        await downloadButtonWithPassword.click();

        const frame = page.frameLocator("#wpdm-lock-frame");
        await frame.locator("input[type='password']").fill("automateNow");
        await frame.locator("input[type='submit']").click();

    });
});