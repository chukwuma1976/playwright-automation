import test from "@playwright/test"
import { PracticeLoginPage } from "../../main/pages/PracticeLoginPage"
import { testUser } from "../../main/utilities/UserCredentialsGenerator";

test.describe('Practice Login Page', () => {
    let practiceLoginPage: PracticeLoginPage;

    test.beforeEach(async ({ page }) => {
        practiceLoginPage = new PracticeLoginPage(page);
        await practiceLoginPage.navigateToLoginPage();
    })

    test('should allow user to login with valid credentials', async ({ page }) => {
        const user = testUser;
        await practiceLoginPage.loginUser(user.email, user.password);
        await practiceLoginPage.verifyUserOnLandingPage();
    })
})