import test from "@playwright/test";
import { FileUploadPage } from "../../main/pages/FileUploadPage";

test.describe(() => {

    test('Test file upload functionality', async ({ page }) => {
        const fileUploadPage = new FileUploadPage(page);
        await fileUploadPage.navigateToFileUploadPage();
        await fileUploadPage.fileUpload();
    })

});