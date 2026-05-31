import test from "@playwright/test"
import { TestLoginPage } from "../../main/pages/TestLoginPage"
import { log } from "console";

test.describe("Test login scenarios", () => {
    let loginPage: TestLoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new TestLoginPage(page);
        await loginPage.navigateToLoginPage();
    })

    test("User login test, happy path", async ({ page }) => {
        await loginPage.loginUser("practice", "SuperSecretPassword!");
        await loginPage.verifyNavigation();
        await loginPage.confirmSuccessMessage();
        await loginPage.verifyLogoutButtonIsVisible();
        await loginPage.logout();
    })

    test("User login test, invalid user", async ({ page }) => {
        await loginPage.loginUser("invalidUser", "SuperSecretPassword!");
        // await loginPage.verifyInvalidUsernameMessage();
        await loginPage.verifyInvalidPasswordMessage();
        await loginPage.verifyUserStillOnLoginPage();
    })

    test("User login test, invalid password", async ({ page }) => {
        await loginPage.loginUser("practice", "invalidPassword!");
        await loginPage.verifyInvalidPasswordMessage();
        await loginPage.verifyUserStillOnLoginPage();
    })
})