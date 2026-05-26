import test from "@playwright/test";
import { IFramePage } from "../../main/pages/IFramePage";

test.describe('Testing iframes', () => {


    test('Test iframe functionality', async ({ page }) => {
        await new IFramePage(page).testIFrameInSelectorsHub();
    })

    test('Test Playright and Selenium iframes', async ({ page }) => {
        await new IFramePage(page).testIFrameInPracticeAutomation();
    })
});