import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoginPage } from '../../main/pages/LoginPage';
import { ContactUsPage } from '../../main/pages/ContactUsPage';

test.describe('Contact Us UI Tests', () => {

    test('Submit contact us form', async ({ page }) => {
        const loginPage = new LoginPage();
        await loginPage.clickContactUs(page);

        const contactUsPage = new ContactUsPage();
        await contactUsPage.getInTouchHeaderIsVisible(page);
        await contactUsPage.fillContactUsForm(
            page,
            "Test Automation with Playwright",
            "automate@playwright.com",
            "Automate Right With Playwright",
            "Read this message please"
        );

    });

});