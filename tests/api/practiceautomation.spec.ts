import test, { expect } from "@playwright/test";
import { generateFullURL, practiceAutomation } from "../../main/configuratons/config";

test.describe('Testing broken link', () => {

    test('Test broken link functionality', async ({ request }) => {
        const url = generateFullURL(practiceAutomation, "/broken-links/missing-page.html");
        const response = await request.get(url);
        expect(response.status()).toBe(404);
    });

    test('Test working link functionality', async ({ request }) => {
        const url = generateFullURL(practiceAutomation);
        const response = await request.get(url);
        expect(response.status()).toBe(200);
    });

})