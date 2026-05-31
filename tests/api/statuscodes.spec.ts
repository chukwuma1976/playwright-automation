import test, { expect } from "@playwright/test";
import { statusCodes } from "../../main/utilities/statusCodes";
import { generateFullURL, httpBinAPI } from "../../main/configuratons/config";

test.describe("Testing all status codes", () => {

    statusCodes.forEach((statusCode) => {
        test(`Testing status code ${statusCode}`, async ({ request }) => {
            const url = generateFullURL(httpBinAPI, `status/${statusCode}`);
            const response = await request.get(url);
            console.log(response.status(), ": ", response.statusText());
            expect(response.status()).toBe(parseInt(statusCode));
        })
    })

})