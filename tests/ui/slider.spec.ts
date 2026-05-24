import { expect, test } from '@playwright/test';
import { generateFullURL, practiceAutomation } from '../../main/configuratons/config';

test.describe('Testing slider element', () => {

    test('Test slider element functionality', async ({ page }) => {

        const url = generateFullURL(practiceAutomation, "/slider/");
        await page.goto(url);

        const sliderElement = page.locator("#slideMe");
        const sliderValue = page.locator("#value");
        await sliderElement.focus();
        while (await sliderValue.textContent() !== "100") {
            await sliderElement.press("ArrowRight");
        }
        await page.waitForTimeout(2000);

    })

    test('Test get anchor tags functionality', async ({ page }) => {
        const url = generateFullURL(practiceAutomation);
        await page.goto(url);

        const anchorTags = page.locator("a");
        console.log(await anchorTags.evaluateAll(links => links.map(link => link.textContent)));

    });

});