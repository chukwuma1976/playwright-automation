import { test } from '@playwright/test';
import { credentials } from '../../main/utilities/LoginCredentials';
import { LoginPage } from '../../main/pages/LoginPage';
import { LandingPage } from '../../main/pages/LandingPage';

test.describe('Logout UI Tests', () => {

    test('Logout after logging in with credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(credentials.email, credentials.password);

        const landingPage = new LandingPage(page);
        await landingPage.logOut();

        await loginPage.hasNavigatedToLoginPage();
    });
});