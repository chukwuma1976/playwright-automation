import { expect, Page, Response } from "@playwright/test";
import { generateFullURL, practiceAutomation, selectorsHub } from "../configuratons/config";

export class IFramePage {
    page: Page;


    constructor(page: Page) {
        this.page = page;
    }

    async testIFrameInSelectorsHub() {
        await this.page.goto(generateFullURL(selectorsHub, "/iframe-scenario/"));
        const iframeSection = this.page.locator("section").first();

        const iframe = iframeSection.frameLocator("#pact1");
        await iframe.locator("#inp_val").fill("In outer iframe", { force: true });

        const iframeNestedOneLevelDeep = iframe.frameLocator("#pact2");
        await iframeNestedOneLevelDeep.locator("#jex").fill("In iframe nested one level deep", { force: true });

        const iframeNestedTwoLevelsDeep = iframeNestedOneLevelDeep.frameLocator("#pact3");
        await iframeNestedTwoLevelsDeep.locator("#glaf").fill("In iframe nested two levels deep", { force: true });
    }

    async testIFrameInPracticeAutomation() {
        await this.page.goto(generateFullURL(practiceAutomation));

        await this.page.locator("a").filter({ hasText: "IFrames" }).click();

        const playwrightIframe = this.page.frameLocator("#iframe-1");
        await playwrightIframe.getByRole("button", { name: "Search" }).click();
        await playwrightIframe.locator("input#docsearch-input").fill("frames");
        await playwrightIframe.getByRole("option").filter({ hasText: "Frames" }).first().click();
        await playwrightIframe.locator("header").filter({ hasText: "Frames" }).click();
        await playwrightIframe.locator("h2").filter({ hasText: "Introduction" }).click();
        await playwrightIframe.locator("code").filter({ hasText: "Locate element inside frame" }).click();

        const seleniumIframe = this.page.frameLocator("#iframe-2");
        await expect(this.page.getByRole("button", { name: "Search" })).toBeVisible();
        await seleniumIframe.getByRole("button", { name: "Search" }).click();
        await seleniumIframe.locator("input#docsearch-input").fill("iframes");
        await seleniumIframe.getByRole("option").filter({ hasText: "iFrames" }).first().click();
        await seleniumIframe.locator("h1").filter({ hasText: "Working with IFrames" }).click();
        await seleniumIframe.locator("code").filter({ hasText: "seleniumhq.github.io" }).click();
        await seleniumIframe.locator("code").filter({ hasText: "This won't work" }).first().click();
        await seleniumIframe.locator("#using-a-webelement").click();
        await seleniumIframe.locator("#using-a-name-or-id").click();
        await seleniumIframe.locator("#using-an-index").click();
        await seleniumIframe.locator("#leaving-a-frame").click();
    }

}