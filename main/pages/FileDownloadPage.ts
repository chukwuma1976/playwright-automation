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
        const normalDownloadButton = this.page.getByRole("link", { name: "Download", exact: true }).first();
        const downloadPromise = this.page.waitForEvent("download");

        await normalDownloadButton.click();

        const download = await downloadPromise;
        const path = "./downloads/" + download.suggestedFilename();
        await download.saveAs(path);
    }

    async fileDownLoadWithPassword() {
        const downloadPromise = this.page.waitForEvent("download");
        const downloadButtonWithPassword = this.page.locator("a[href='#unlock']");

        await downloadButtonWithPassword.click();
        const frame = this.page.frameLocator("#wpdm-lock-frame");
        await frame.locator("input[type='password']").fill("automateNow");
        await frame.locator("input[type='submit']").click();

        const download = await downloadPromise;
        const path = "./downloads/" + download.suggestedFilename();
        await download.saveAs(path);
    }

}