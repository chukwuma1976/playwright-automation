import { test } from '@playwright/test';
import { credentials } from '../../main/utilities/LoginCredentials';
import { LoginPage } from '../../main/pages/LoginPage';
import { LandingPage } from '../../main/pages/LandingPage';

test.describe('Logout UI Tests', () => {

    test('Logout after logging in with credentials', async ({ page }) => {
        const loginPage = new LoginPage();
        await loginPage.login(page, credentials.email, credentials.password);

        const landingPage = new LandingPage();
        await landingPage.logOut(page);

        await loginPage.hasNavigatedToLoginPage(page);
    });
});