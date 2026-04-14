import { test } from '@playwright/test';
import { credentials, invalidCredentials } from '../../main/utilities/LoginCredentials';
import { LoginPage } from '../../main/pages/LoginPage';
import { LandingPage } from '../../main/pages/LandingPage';

test.describe('Login UI Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage();
    });

    test('UI Login with credentials', async ({ page }) => {
        await loginPage.login(page, credentials.email, credentials.password);

        const landingPage = new LandingPage();
        await landingPage.userIsLoggedIn(page);
    });

    test('UI Login with invalid credentials', async ({ page }) => {
        await loginPage.login(page, invalidCredentials.email, invalidCredentials.password);
        await loginPage.invalidCredentialsErrorIsVisible(page);
    });
});