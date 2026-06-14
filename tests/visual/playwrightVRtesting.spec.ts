import { expect, Locator, test } from '@playwright/test';
import { generateFullURL, playwright_dev_locators } from '../../main/configuratons/config';

test.describe('Test playwright locators page with visual regression tesing', () => {

    const playwrightLocatorsURL = generateFullURL(playwright_dev_locators);

    test.beforeEach(async ({ page }) => {
        await page.goto(playwrightLocatorsURL);
    })

    test('visual regression testing of playwright locators page', async ({ page }) => {

        // allow page to load
        await page.waitForURL(/locators/);

        // compare page screenshot to baseline image
        await expect(page).toHaveScreenshot();

    });

    test('visual regression testing of an element', async ({ page }) => {

        // allow element to load
        const playwrightLogo: Locator = page.getByAltText("playwright logo").first();
        await playwrightLogo.isVisible();

        // compare element screenshot to baseline image
        await expect(playwrightLogo).toHaveScreenshot();

    });

    test.afterEach(async ({ page }, testInfo) => {
        // capture a screenshot for attachment
        const buffer = await page.screenshot();
        await testInfo.attach('screenshot', {
            body: buffer,
            contentType: 'image/png'
        });
    })

});
