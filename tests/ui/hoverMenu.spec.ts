import test from "@playwright/test";
import { MultiplePage } from "../../main/pages/MultiplePage"
import { DonationPage } from "../../main/pages/DonationPage";

test.describe("Test hover menu", () => {
    let multiplePages: MultiplePage;

    test.beforeEach(async ({ page }) => {
        multiplePages = new MultiplePage(page);
        await multiplePages.navigateToLandingPage();
    })


    test("Open donation page", async ({ page }) => {
        const [donationPage] = await Promise.all([
            page.waitForEvent("popup"),
            multiplePages.openDonationPage()
        ]);

        const masterDonationPage = new DonationPage(donationPage);
        await masterDonationPage.verifyOnDonationPage();

        await masterDonationPage.hoverOverPricing();
        await masterDonationPage.hoverOverProducts();
        await masterDonationPage.hoverOverResources();
    })

})