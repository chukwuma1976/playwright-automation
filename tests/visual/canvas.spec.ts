import { expect, test } from '@playwright/test';
import { generateFullURL, selectorsHub } from '../../main/configuratons/config';

test.describe('Test canvas element with visual regression tesing', () => {

    const URL = generateFullURL(selectorsHub, "xpath-practice-page");

    test('visual regression testing of canvas element', async ({ page }) => {

        await page.goto(URL);
        const canvasElement = page.locator("canvas");
        /* baseline screen shot: await canvasElement.screenshot({ path: "main/resources/screenshots/canvas-element.png" });
        To refresh screenshot use --update-snapshots flag
        */

        // allow canvas element to fully render
        await canvasElement.isVisible();

        // compare canvas screenshot to baseline image
        await expect(canvasElement).toHaveScreenshot("main/resources/screenshots/canvas-element.png", { maxDiffPixels: 100 });

    });

});