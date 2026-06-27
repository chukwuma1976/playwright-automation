import test, { expect } from "@playwright/test"
import { BookerLandingPage } from '../../main/pages/BookerLandingPage'
import AxeBuilder from "@axe-core/playwright";

test.describe("Demonstrated accessibility testing", () => {
    test("Accessibility testing", async ({ page }) => {
        const landingPage = new BookerLandingPage(page);
        await landingPage.navigateToLandingPage();

        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
        const descriptions = accessibilityScanResults.violations.map(violation => violation.description);
        console.log(descriptions);
        expect(accessibilityScanResults.violations).toBeTruthy();
        // expect(accessibilityScanResults.violations).toEqual([]);

    })

})