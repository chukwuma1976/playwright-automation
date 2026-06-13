import { test } from "../../main/fixtures/loginFixture"

test.describe("Test login fixture", () => {
    test("User login fixture, happy path", async ({ loginPage }) => {
        await loginPage.loginUser("practice", "SuperSecretPassword!");
        await loginPage.verifyNavigation();
        await loginPage.confirmSuccessMessage();
        await loginPage.verifyLogoutButtonIsVisible();
        await loginPage.logout();
    })

    test("User login test, happy path", async ({ loggedInPage }) => {
        await loggedInPage.verifyNavigation();
        await loggedInPage.confirmSuccessMessage();
        await loggedInPage.verifyLogoutButtonIsVisible();
        await loggedInPage.logout();
    })

    test("User login test, invalid user", async ({ loginPage }) => {
        await loginPage.loginUser("invalidUser", "SuperSecretPassword!");
        await loginPage.verifyInvalidFieldMessage();
        await loginPage.verifyUserStillOnLoginPage();
    })

    test("User login test, invalid password", async ({ loginPage }) => {
        await loginPage.loginUser("practice", "invalidPassword!");
        await loginPage.verifyInvalidFieldMessage();
        await loginPage.verifyUserStillOnLoginPage();
    })
})