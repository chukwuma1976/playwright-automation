import test from "@playwright/test";
import { MultiplePage } from "../../main/pages/MultiplePage"
import { DonationPage } from "../../main/pages/DonationPage";

test.describe("Test opening of multiple pages", () => {
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
    })

    test("Open donation and buy me a coffee pages", async ({ page }) => {
        const [donationPage] = await Promise.all([
            page.waitForEvent("popup"),
            multiplePages.openDonationPage()
        ]);

        const masterDonationPage = new DonationPage(donationPage);
        await masterDonationPage.verifyOnDonationPage();

        const [buyMeACoffeePg] = await Promise.all([
            donationPage.waitForEvent("popup"),
            masterDonationPage.clickToBuyMeACoffee()
        ]);

        const buyMeACoffeePage = new DonationPage(buyMeACoffeePg);
        await buyMeACoffeePage.verifyOnBuyMeACoffeePage();
    })

    test("Open donation and patreon pages", async ({ page }) => {

        const context = page.context();

        const [donationPage] = await Promise.all([
            context.waitForEvent("page"),
            multiplePages.openDonationPage()
        ]);

        const masterDonationPage = new DonationPage(donationPage);
        await masterDonationPage.verifyOnDonationPage();

        const [patreonPg] = await Promise.all([
            context.waitForEvent("page"),
            masterDonationPage.clickPatreonPage()
        ]);

        const patreonPage = new DonationPage(patreonPg);
        await patreonPage.verifyOnPatreonPage();
    })

    test("Open donation and dollar donation pages and enter dollar amount", async ({ page }) => {

        const context = page.context();

        const [donationPage] = await Promise.all([
            context.waitForEvent("page"),
            multiplePages.openDonationPage()
        ]);

        const masterDonationPage = new DonationPage(donationPage);
        await masterDonationPage.verifyOnDonationPage();

        const [dollarDonationPg] = await Promise.all([
            context.waitForEvent("page"),
            masterDonationPage.clickToDonateInDollars()
        ]);

        const dollarDonationPage = new DonationPage(dollarDonationPg);
        await dollarDonationPage.verifyOnStripePage();
        await dollarDonationPage.enterDollarAmount("10000");
    })

    test("Open donation and rupee donation pages and enter rupee amount", async ({ page }) => {

        const context = page.context();

        const [donationPage] = await Promise.all([
            context.waitForEvent("page"),
            multiplePages.openDonationPage()
        ]);

        const masterDonationPage = new DonationPage(donationPage);
        await masterDonationPage.verifyOnDonationPage();

        const [rupeeDonationPg] = await Promise.all([
            context.waitForEvent("page"),
            masterDonationPage.clickToDonateInDollars()
        ]);

        const rupeeDonationPage = new DonationPage(rupeeDonationPg);
        await rupeeDonationPage.verifyOnStripePage();
        await rupeeDonationPage.enterDollarAmount("10000");
    })

    test("Open donation and paypal donation page", async ({ page }) => {

        const context = page.context();

        const [donationPage] = await Promise.all([
            context.waitForEvent("page"),
            multiplePages.openDonationPage()
        ]);

        const masterDonationPage = new DonationPage(donationPage);
        await masterDonationPage.verifyOnDonationPage();

        const [paypalPg] = await Promise.all([
            context.waitForEvent("page"),
            masterDonationPage.clickToDonateByPayPal()
        ]);

        const paypalDonationPage = new DonationPage(paypalPg);
        await paypalDonationPage.verifyOnPaypalPage()
    })

    test("Open donation and open multiple pages", async ({ page }) => {

        const context = page.context();

        const [donationPage] = await Promise.all([
            context.waitForEvent("page"),
            multiplePages.openDonationPage()
        ]);

        const masterDonationPage = new DonationPage(donationPage);
        await masterDonationPage.verifyOnDonationPage();

        await masterDonationPage.clickPatreonPage();
        await masterDonationPage.clickToBuyMeACoffee();
        await masterDonationPage.clickToDonateByPayPal();
        await masterDonationPage.clickToDonateInDollars();
        await masterDonationPage.clickToDonateInRupees();

        const pages = context.pages();
        for (let page of pages) {
            if (page.url().includes("buy.stripe.com")) {
                await new DonationPage(page).enterAmount("10000");
            };
        }
    })
})