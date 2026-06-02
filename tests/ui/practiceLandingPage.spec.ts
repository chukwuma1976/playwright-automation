import test from "@playwright/test";
import { PracticeLandingPage } from "../../main/pages/PracticeLandingPage";
import { PracticeLoginPage } from "../../main/pages/PracticeLoginPage";
import { testUser } from "../../main/utilities/UserCredentialsGenerator";
import { PracticeProfileDetailsPage } from "../../main/pages/PracticeProfileDetailsPage";

test.describe("Practice landing page tasks tests", () => {

    let practiceLandingPage: PracticeLandingPage;

    test.beforeEach(async ({ page }) => {
        const { email, password } = testUser;
        new PracticeLoginPage(page).navigateToLoginPage();
        await new PracticeLoginPage(page).loginUser(email, password);
        practiceLandingPage = new PracticeLandingPage(page);
    });

    test("Test landing page title", async ({ page }) => {
        await practiceLandingPage.clickAllTab();
        await practiceLandingPage.clickTab("Home");
        await practiceLandingPage.clickTab("Work");
        await practiceLandingPage.clickTab("Personal");

        await practiceLandingPage.fillSearchInput("Another one");
        await practiceLandingPage.clickSearch();

        await practiceLandingPage.verifyNoteIsDisplayed("Another one");

        await practiceLandingPage.gotoProfile();

        const profilePage = new PracticeProfileDetailsPage(page);
        const { name, email } = testUser;
        await profilePage.verifyProfileDetailsAreCorrect(email, name, "", "");

        await practiceLandingPage.logout();

    });

});