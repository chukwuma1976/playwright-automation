import test, { expect } from "@playwright/test";
import { generateFullURL, practiceTestingUi } from "../../main/configuratons/config";

test.describe('Drag and Drop UI Tests', () => {

    const URL = generateFullURL(practiceTestingUi, "drag-and-drop");

    test('Test drag and drop', async ({ page }) => {
        await page.goto(URL);
        const box1 = page.locator("#column-a");
        const box2 = page.locator("#column-b");

        await box1.dragTo(box2);
        expect(await box1.textContent()).toContain("B");
        expect(await box2.textContent()).toContain("A");

        await box2.dragTo(box1);
        expect(await box1.textContent()).toContain("A");
        expect(await box2.textContent()).toContain("B");
    });

});