import { Page } from "@playwright/test";
import { generateFullURL, practiceAutomation } from "../configuratons/config";

export class FileDownloadPage {
    page: Page;
    fileDownLoadPageURL: string;

    constructor(page: Page) {
        this.page = page;
        this.fileDownLoadPageURL = generateFullURL(practiceAutomation, "/file-download");
    }

    async navigateToFileDownloadPage() {
        await this.page.goto(this.fileDownLoadPageURL);
    }

    async fileDownLoad() {
        const normalDownloadButton = this.page.locator("a").filter({ hasText: "Download" }).first();
        await normalDownloadButton.click();
    }

    async fileDownLoadWithPassword() {
        const downloadButtonWithPassword = this.page.locator("a[href='#unlock']");
        await downloadButtonWithPassword.click();
        const frame = this.page.frameLocator("#wpdm-lock-frame");
        await frame.locator("input[type='password']").fill("automateNow");
        await frame.locator("input[type='submit']").click();
    }

}