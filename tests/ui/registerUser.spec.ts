import { test } from '@playwright/test';
import { generateUserToRegister, generateUserWithExistingEmail } from '../../main/utilities/UserCredentialsGenerator';
import { LoginPage } from '../../main/pages/LoginPage';
import { LandingPage } from '../../main/pages/LandingPage';
import { RegistrationPage } from '../../main/pages/RegistrationPage';

test.describe('Register User UI Tests', () => {
    let loginPage: LoginPage;
    let registrationPage: RegistrationPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage();
        registrationPage = new RegistrationPage();
    });

    test('Register new user', async ({ page }) => {
        const userCredentials = generateUserToRegister();
        await loginPage.registerUser(page, userCredentials.name, userCredentials.email);

        await registrationPage.checkEnterAccountInformationHeaderIsVisible(page);
        await registrationPage.fillRegistrationForm(page, userCredentials);
        await registrationPage.checkAccountCreatedHeaderIsVisible(page);
        await registrationPage.clickContinueButton(page);

        const landingPage = new LandingPage();
        await landingPage.userIsLoggedIn(page);
        await landingPage.clickDeleteAccountButton(page);
    });

    test('Register user with existing email', async ({ page }) => {
        const userCredentials = generateUserWithExistingEmail();
        await loginPage.registerUser(page, userCredentials.name, userCredentials.email);
        await loginPage.emailAddressExistsErrorIsVisble(page);
    });


});