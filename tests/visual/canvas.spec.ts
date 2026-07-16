import { expect, test } from '@playwright/test';
import { generateFullURL, selectorsHub } from '../../main/configuratons/config';
import { vrTestingOptions } from '../../main/utilities/vrTestingOptions';

test.describe('Test canvas element with visual regression tesing', () => {
    test.skip(!!process.env.CI, 'Skipping visual tests in CI environment');

    const URL = generateFullURL(selectorsHub, "xpath-practice-page");

    test('visual regression testing of canvas element', async ({ page }) => {

        await page.goto(URL);
        const canvasElement = page.locator("canvas");
        /* baseline screen shot: await canvasElement.screenshot({ path: "main/resources/screenshots/canvas-element.png" });
        To refresh screenshot use --update-snapshots flag
        */

        // allow canvas element to fully render
        await expect(canvasElement).toBeVisible();

        // compare canvas screenshot to baseline image
        await expect(canvasElement).toHaveScreenshot("main/resources/screenshots/canvas-element.png", vrTestingOptions);

    });

});