import test, { expect } from "@playwright/test"
import { generateFullURL, httpBinAPI } from "../../main/configuratons/config";

test.describe("We will test a gamut of API polling scenarios", () => {

    const pollingTimes = [0, 1, 5, 10, 15, 30, 45, 60];

    for (let time of pollingTimes) {
        const pollingURL = generateFullURL(httpBinAPI, `delay/${time}`);

        test(`Test expect.poll() with a time of ${time} seconds`, async ({ request }) => {

            await expect.poll(async () => {
                const response = await request.get(pollingURL);
                return response.status();
            },
                {
                    timeout: 30000,
                    intervals: [500, 1000, 2000, 5000, 10000, 20000],
                    message: 'The server took too long to respond.'
                }).toBe(200);
        })
    }


})