import test from "@playwright/test";
import { generateFullURL, practiceAutomation } from "../../main/configuratons/config";

test.describe(() => {

    test('Test file upload functionality', async ({ page }) => {
        await page.goto(generateFullURL(practiceAutomation, "/file-upload/"));
        await page.setInputFiles("input[type='file']", "main/resources/testUpload.txt");
    })

});