import test, { expect } from "@playwright/test"
import path from "path";
import fs from 'fs';
import { automationTestingUIUrl, generateFullURL } from "../../main/configuratons/config";
import { PDFParse } from "pdf-parse";

test.describe('PDF Download', () => {

    test("download pdf and check content", async ({ page }) => {

        // wait for download event prior to download button action
        const downloadPromise = page.waitForEvent("download");
        const downloadBtn = page.getByRole("link", { name: "Download" });
        await page.route("**pagead**", async route => route.abort());

        // navigate to page and download PDF
        await page.goto(generateFullURL(automationTestingUIUrl, "FileDownload.html"));
        await expect(downloadBtn).toBeVisible();
        await downloadBtn.click();

        // get PDF and save to downloads folder in root directory
        const download = await downloadPromise;
        const directory = path.join("./downloads/", download.suggestedFilename());
        await download.saveAs(directory);
        expect(fs.existsSync(directory)).toBeTruthy();

        //extract data as buffer, parse data with PDFParse (may need to run npm install pdf-parse), and get text
        const buffer = fs.readFileSync(directory);
        const parser = new PDFParse({ data: buffer });
        const pdfText = await parser.getText();

        const numberOfLines = pdfText.text.split("\n").length;
        const fieldsToValidate =
            ["Selenium Overview", "WebDriver", "Grid", "IE Driver Server", "Selenium IDE", "Test Practices", "Legacy", "About this documentation"];

        // validate PDF content
        expect(numberOfLines).toBeGreaterThan(0);
        fieldsToValidate.forEach(section => expect(pdfText.text).toContain(section));
    });

})
