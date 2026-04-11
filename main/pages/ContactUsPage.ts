import { expect, Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

export class ContactUsPage {

    async getInTouchHeaderIsVisible(page: Page) {
        const getInTouchHeader = page.locator('h2:has-text("Get In Touch")');
        await getInTouchHeader.isVisible();
        expect(getInTouchHeader).toBeVisible();
    }

    async fillContactUsForm(page: Page, name: string, email: string, subject: string, message: string) {

        await page.locator('input[data-qa="name"]').fill(name);
        await page.locator('input[data-qa="email"]').fill(email);
        await page.locator('input[data-qa="subject"]').fill(subject);
        await page.locator('textarea#message').fill(message);

        //file upload
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, '../../main/resources/testUpload.txt'));

        await page.locator('input[data-qa="submit-button"]').click();

        page.on('dialog', async dialog => {
            await dialog.accept();
            await page.getByRole('button', { name: 'OK' }).click();
        });
    }

}