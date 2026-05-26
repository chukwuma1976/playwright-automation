import { Page } from "@playwright/test";
import { generateFullURL, practiceAutomation } from "../configuratons/config";

export class FileUploadPage {
    page: Page;
    fileUploadPageURL: string;

    constructor(page: Page) {
        this.page = page;
        this.fileUploadPageURL = generateFullURL(practiceAutomation, "/file-upload");
    }

    async navigateToFileUploadPage() {
        await this.page.goto(this.fileUploadPageURL);
    }

    async fileUpload() {
        await this.page.setInputFiles("input[type='file']", "main/resources/testUpload.txt");
    }

}