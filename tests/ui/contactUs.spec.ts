import { test } from '@playwright/test';
import { HomePage } from '../../main/pages/HomePage';
import { ContactUsPage } from '../../main/pages/ContactUsPage';

test.describe('Contact Us UI Tests', () => {

    test('Submit contact us form', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.clickContactUs();

        const contactUsPage = new ContactUsPage(page);
        await contactUsPage.getInTouchHeaderIsVisible();
        await contactUsPage.fillContactUsForm(
            "Test Automation with Playwright",
            "automate@playwright.com",
            "Automate Right With Playwright",
            "Read this message please"
        );

    });

});