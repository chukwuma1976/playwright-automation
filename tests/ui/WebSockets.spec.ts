import { expect, test } from "../../main/fixtures/loginFixture"

test.describe("Work with websockets", () => {

    test("Detect a websocket upon login", async ({ loggedInPage, page }) => {
        page.on("websocket", ws => {
            console.log("Websocket detected: ", !!ws);
        })
        await loggedInPage.verifyNavigation();
    })

    test("Wait for a websocket upon login", async ({ loggedInPage, page }) => {
        const ws = await page.waitForEvent("websocket");
        await loggedInPage.verifyNavigation();
        console.log("This is a websocket URL: ", ws.url());
    })

    test("Detect a message sent by websocket upon login", async ({ loggedInPage, page }) => {
        const ws = await page.waitForEvent("websocket");
        await loggedInPage.verifyNavigation();
        ws.on("framesent", frame => {
            console.log("This is a websocket message that was sent: ", frame.payload);
        })
    })

    test("Detect a message received by websocket upon login", async ({ loggedInPage, page }) => {
        const ws = await page.waitForEvent("websocket");
        await loggedInPage.verifyNavigation();
        ws.on("framereceived", frame => {
            console.log("This is a websocket message that was received: ", frame.payload);
        })
    })

    test("Putting it all together for websocket upon login", async ({ loggedInPage, page }) => {
        const ws = await page.waitForEvent("websocket");
        await loggedInPage.verifyNavigation();
        // Validate the presence of a websocket URL
        expect(ws.url()).toBeTruthy();
        // Validate that a message is sent through the websocket
        ws.on("framesent", frame => {
            expect(frame.payload).toBeTruthy();
        })
        // Validate that a message is received throught the websocket
        ws.on("framereceived", frame => {
            expect(frame.payload).toBeTruthy()
        });

    })

})