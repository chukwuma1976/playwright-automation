import test from "@playwright/test";
import { generateFullURL, practiceAutomation, selectorsHub } from "../../main/configuratons/config";

test.describe('Testing iframes', () => {


    test('Test iframe functionality', async ({ page }) => {
        const url = generateFullURL(selectorsHub, "/iframe-scenario/");
        await page.goto(url);

        const iframeSection = page.locator("section").first();

        const iframe = iframeSection.frameLocator("#pact1");
        await iframe.locator("#inp_val").fill("In outer iframe", { force: true });

        const iframeNestedOneLevelDeep = iframe.frameLocator("#pact2");
        await iframeNestedOneLevelDeep.locator("#jex").fill("In iframe nested one level deep", { force: true });

        const iframeNestedTwoLevelsDeep = iframeNestedOneLevelDeep.frameLocator("#pact3");
        await iframeNestedTwoLevelsDeep.locator("#glaf").fill("In iframe nested two levels deep", { force: true });
    })

    test('Test Playright and Selenium iframes', async ({ page }) => {
        const url = generateFullURL(practiceAutomation);
        await page.goto(url);
        await page.waitForTimeout(2000); // Wait for 2 seconds to observe the actions in the iframe

        await page.locator("a").filter({ hasText: "IFrames" }).click();

        const playwrightIframe = page.frameLocator("#iframe-1");
        await playwrightIframe.getByRole("button", { name: "Search" }).click();
        await playwrightIframe.locator("input#docsearch-input").fill("frames");
        await playwrightIframe.getByRole("option").filter({ hasText: "Frames" }).first().click();
        await playwrightIframe.locator("header").filter({ hasText: "Frames" }).click();
        await playwrightIframe.locator("h2").filter({ hasText: "Introduction" }).click();
        await playwrightIframe.locator("code").filter({ hasText: "Locate element inside frame" }).click();
        await page.waitForTimeout(2000); // Wait for 2 seconds to observe the actions in the iframe

        const seleniumIframe = page.frameLocator("#iframe-2");
        await seleniumIframe.getByRole("button", { name: "Search" }).click();
        await seleniumIframe.locator("input#docsearch-input").fill("frames");
        await seleniumIframe.getByRole("option").filter({ hasText: "iFrames" }).first().click();
        await seleniumIframe.locator("h1").filter({ hasText: "Working with IFrames" }).click();
        await seleniumIframe.locator("code").filter({ hasText: "seleniumhq.github.io" }).click();
        await seleniumIframe.locator("code").filter({ hasText: "This won't work" }).first().click();
        await seleniumIframe.locator("#using-a-webelement").click();
        await seleniumIframe.locator("#using-a-name-or-id").click();
        await seleniumIframe.locator("#using-an-index").click();
        await seleniumIframe.locator("#leaving-a-frame").click();
        await page.waitForTimeout(2000); // Wait for 2 seconds to observe the actions in the iframe 
    })

});