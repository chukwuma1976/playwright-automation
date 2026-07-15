import { test } from '@playwright/test'
import { HomePage } from '../../main/pages/HomePage'

test.describe('Scrolling UI tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
    })

    test('Verify Scroll Up using Arrow button and Scroll Down functionality', async ({ page }) => {
        await homePage.blockGooglePopup();
        await homePage.confirmSubscriptionHeader();
        await homePage.scrollToTopWithArrowAndConfirm();
    })

    test('Verify Scroll Up without Arrow button and Scroll Down functionality', async ({ page }) => {
        await homePage.blockGooglePopup();
        await homePage.confirmSubscriptionHeader();
        await homePage.scrollToTopWithoutArrowAndConfirm();
    })

})