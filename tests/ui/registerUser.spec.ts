import { test } from '@playwright/test';
import { generateUserToRegister, generateUserWithExistingEmail } from '../../main/utilities/UserCredentialsGenerator';
import { LoginPage } from '../../main/pages/LoginPage';
import { LandingPage } from '../../main/pages/LandingPage';
import { RegistrationPage } from '../../main/pages/RegistrationPage';

test.describe.parallel('Register User UI Tests', () => {
    let loginPage: LoginPage;
    let registrationPage: RegistrationPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        registrationPage = new RegistrationPage(page);
    });

    test('Register new user', async ({ page }) => {
        const userCredentials = generateUserToRegister();
        await loginPage.registerUser(userCredentials.name, userCredentials.email);

        await registrationPage.checkEnterAccountInformationHeaderIsVisible();
        await registrationPage.fillRegistrationForm(userCredentials);
        await registrationPage.checkAccountCreatedHeaderIsVisible();
        await registrationPage.clickContinueButton();

        const landingPage = new LandingPage(page);
        await landingPage.userIsLoggedIn();
        await landingPage.clickDeleteAccountButton();
    });

    test('Register user with existing email', async ({ page }) => {
        const userCredentials = generateUserWithExistingEmail();
        await loginPage.registerUser(userCredentials.name, userCredentials.email);
        await loginPage.emailAddressExistsErrorIsVisble();
    });


});