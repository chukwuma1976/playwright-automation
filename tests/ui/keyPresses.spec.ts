import test from "@playwright/test";
import { KeyPressPage } from "../../main/pages/KeyPressPage"
import { keyPresses } from "../../main/utilities/testDataGenerator";

test.describe("Demonstrate keypresses in Playwright", () => {

    for (const press of keyPresses) {
        const keypress = Object.keys(press)[0];
        const text = Object.values(press)[0];

        test(`Test the keypress of ${keypress}`, async ({ page }) => {
            const keypressPage = new KeyPressPage(page);
            await keypressPage.navigateToKeyPressPage();
            await keypressPage.enterKeyPress(keypress);
            await keypressPage.verifyKeypressEntered(text);
        })
    }

})