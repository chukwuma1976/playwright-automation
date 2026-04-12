import { test } from '@playwright/test';
import { HomePage } from '../../main/pages/HomePage';
import { ContactUsPage } from '../../main/pages/ContactUsPage';

test.describe('Contact Us UI Tests', () => {

    test('Submit contact us form', async ({ page }) => {
        const homePage = new HomePage();
        await homePage.clickContactUs(page);

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