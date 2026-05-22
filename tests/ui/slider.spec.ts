import { expect, test } from '@playwright/test';
import { generateFullURL, practiceAutomation } from '../../main/configuratons/config';

test.describe('Testing slider element', () => {

    test('Test slider element functionality', async ({ page }) => {

        const url = generateFullURL(practiceAutomation, "/slider/");
        await page.goto(url);

        const sliderElement = page.locator("#slideMe");
        await sliderElement.focus();
        for (let i = 0; i < 40; i++) {
            await sliderElement.press("ArrowRight");
            await page.waitForTimeout(100); // Wait for 0.5 seconds to observe the slider movement
        }
        await page.waitForTimeout(2000);

    })

});