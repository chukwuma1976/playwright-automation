import { test } from '@playwright/test';
import { credentials, invalidCredentials } from '../../main/utilities/LoginCredentials';
import { LoginPage } from '../../main/pages/LoginPage';
import { LandingPage } from '../../main/pages/LandingPage';

test.describe('Login UI Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
    });

    test('UI Login with credentials', async ({ page }) => {
        await loginPage.login(credentials.email, credentials.password);

        const landingPage = new LandingPage(page);
        await landingPage.userIsLoggedIn();
    });

    test('UI Login with invalid credentials', async ({ page }) => {
        await loginPage.login(invalidCredentials.email, invalidCredentials.password);
        await loginPage.invalidCredentialsErrorIsVisible();
    });
});