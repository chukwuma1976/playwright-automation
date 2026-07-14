import test, { expect } from "@playwright/test";
import { BookerLandingPage } from "../../main/pages/BookerLandingPage";

test.describe("Let's learn about service workers", () => {

    test("Listen to service worker", async ({ context }) => {
        context.on("serviceworker", sw => {
            console.log("Service worker: ", sw.url());
            expect(sw).toBeTruthy();
        });

        const page = await context.newPage();
        await page.goto("https://www.youtube.com");
        await page.getByPlaceholder("search").fill("Service workers in progressive web applications");

        await page.waitForTimeout(10000);

        console.log(context.serviceWorkers());
    })

    test('wait for service worker registration', async ({ context }) => {

        const swPromise =
            context.waitForEvent('serviceworker');

        const page = await context.newPage();

        await page.goto('https://www.youtube.com');
        await page.getByPlaceholder("search").fill("Wait for service worker event in Playwright");

        const sw = await swPromise;

        console.log(sw.url());
        expect(sw).toBeTruthy();
    });

});