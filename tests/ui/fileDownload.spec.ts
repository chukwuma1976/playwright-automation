import { test } from '@playwright/test';
import { FileDownloadPage } from '../../main/pages/FileDownloadPage';

test.describe('File Download', () => {
    let fileDownLoadPage: FileDownloadPage;

    test.beforeEach(async ({ page }) => {
        fileDownLoadPage = new FileDownloadPage(page);
        await fileDownLoadPage.navigateToFileDownloadPage();
    });

    test('Test normal file download', async ({ page }) => {
        await fileDownLoadPage.fileDownLoad();
    });

    test('Test file download with password', async ({ page }) => {
        await fileDownLoadPage.fileDownLoadWithPassword();
    });
});