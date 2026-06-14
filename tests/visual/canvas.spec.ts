import { expect, test } from '@playwright/test';
import { generateFullURL, selectorsHub } from '../../main/configuratons/config';

test.describe('Test canvas element with visual regression tesing', () => {

    const URL = generateFullURL(selectorsHub, "xpath-practice-page");

    test('visual regression testing of canvas element', async ({ page }) => {

        await page.goto(URL);
        const canvasElement = page.locator("canvas");
        // await canvasElement.screenshot({ path: "main/resources/screenshots/canvas-element.png" });
        await canvasElement.isVisible();
        await expect(canvasElement).toHaveScreenshot("main/resources/screenshots/canvas-element.png", { maxDiffPixels: 100 });

    });

});