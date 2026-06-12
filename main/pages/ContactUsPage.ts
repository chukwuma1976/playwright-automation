import { expect, Locator, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

export class ContactUsPage {

    page: Page;
    getInTouchHeader: Locator;
    nameInput: Locator;
    emailInput: Locator
    subjectInput: Locator;
    messageInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.getInTouchHeader = page.locator('h2:has-text("Get In Touch")');
        this.nameInput = page.locator('input[data-qa="name"]');
        this.emailInput = page.locator('input[data-qa="email"]');
        this.subjectInput = page.locator('input[data-qa="subject"]');
        this.messageInput = page.locator('textarea#message');
    }

    async getInTouchHeaderIsVisible() {
        await this.getInTouchHeader.isVisible();
        expect(this.getInTouchHeader).toBeVisible();
    }

    async fillContactUsForm(name: string, email: string, subject: string, message: string) {

        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.subjectInput.fill(subject);
        await this.messageInput.fill(message);

        //file upload
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        await this.page.locator('input[type="file"]').setInputFiles(path.join(__dirname, '../../main/resources/testUpload.txt'));

        await this.page.locator('input[data-qa="submit-button"]').click();

        this.page.once('dialog', async dialog => {
            await dialog.accept();
            await this.page.getByRole('button', { name: 'OK' }).click();
        });
    }

}