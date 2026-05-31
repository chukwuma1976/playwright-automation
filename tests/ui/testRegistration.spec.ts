import test from "@playwright/test"
import { TestRegistrationPage } from "../../main/pages/TestRegistrationPage";
import { generateUserToRegister } from "../../main/utilities/UserCredentialsGenerator";
import { TestLoginPage } from "../../main/pages/TestLoginPage";

test.describe('User registration tests', () => {
    let registrationPage: TestRegistrationPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new TestRegistrationPage(page);
        await registrationPage.navigateToRegister();
    })

    test("Test registration page, happy path", async ({ page }) => {
        const user = generateUserToRegister();
        await registrationPage.registerUser(user.name, user.password, user.password);
        // new TestLoginPage(page).verifyUserStillOnLoginPage();
    })

    test("Test registration page with missing username", async ({ page }) => {
        const user = generateUserToRegister();
        await registrationPage.registerUser("", user.password, user.password);
        await registrationPage.confirmAllFieldsRequired();
    })

    test("Test registration page with missing password", async ({ page }) => {
        const user = generateUserToRegister();
        await registrationPage.registerUser(user.name, "", user.password);
        await registrationPage.confirmAllFieldsRequired();
    })

    test("Test registration page with mismatch between password and confirmation password", async ({ page }) => {
        const user = generateUserToRegister();
        await registrationPage.registerUser(user.name, user.password, "mismatchedPassword");
        await registrationPage.confirmPasswordsDoNotMatch();
    })
})