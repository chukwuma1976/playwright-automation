import { expect, test } from '@playwright/test';
import { generateFullURL, selectorsHub } from '../../main/configuratons/config';

test.describe('Test canvas element with with relative coordinates', () => {

    const URL = generateFullURL(selectorsHub, "xpath-practice-page");

    test('drag and drop testing of canvas element', async ({ page }) => {

        await page.goto(URL);
        const canvasElement = page.locator("canvas");
        await canvasElement.click({ position: { x: 100, y: 100 } });
        await page.mouse.move(50, 500);
        await page.mouse.down();
        await page.mouse.move(200, 200);
        await page.mouse.up();

    });

});