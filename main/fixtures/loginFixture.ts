import { test as base } from '@playwright/test'
import { TestLoginPage } from '../pages/TestLoginPage';

// Declare the type of my fixtures
type MyFixtures = {
    loginPage: TestLoginPage;
    loggedInPage: TestLoginPage;
}

export const test = base.extend<MyFixtures>({

    loginPage: async ({ page }, use) => {
        const loginPage = new TestLoginPage(page);
        await loginPage.navigateToLoginPage();
        await use(loginPage);
    },

    loggedInPage: async ({ page }, use) => {
        const loginPage = new TestLoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.loginUser("practice", "SuperSecretPassword!");

        await use(loginPage);
    }

})

export { expect } from '@playwright/test'