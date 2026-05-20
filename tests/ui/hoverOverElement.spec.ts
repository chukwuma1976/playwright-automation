import { expect, test } from '@playwright/test';
import { generateFullURL, practiceAutomation } from '../../main/configuratons/config';

test.describe('Testing hover over element', () => {

    test('Test hover over element functionality', async ({ page }) => {

        const url = generateFullURL(practiceAutomation, "/hover/");
        await page.goto(url);

        const hoverElement = page.locator("#mouse_over");
        const hoverText = await hoverElement.textContent();
        expect(hoverText?.trim()).toBe("Mouse over me");

        await hoverElement.hover();
        await page.waitForTimeout(2000); // Wait for 2 seconds to observe the hover effect
        const hoverTextAfterHover = await hoverElement.textContent();
        expect(hoverTextAfterHover?.trim()).toBe("You did it!");

    })

});