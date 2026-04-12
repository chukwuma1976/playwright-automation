import { test } from '@playwright/test'
import { HomePage } from '../../main/pages/HomePage'

test.describe('Scrolling UI tests', () => {
    let homePage: HomePage;

    test.beforeEach(() => {
        homePage = new HomePage();
    })

    test('Verify Scroll Up using Arrow button and Scroll Down functionality', async ({ page }) => {
        await homePage.confirmSubscriptionHeader(page);
        await homePage.scrollToTopWithArrowAndConfirm(page);
    })

    test('Verify Scroll Up without Arrow button and Scroll Down functionality', async ({ page }) => {
        await homePage.confirmSubscriptionHeader(page);
        await homePage.scrollToTopWithoutArrowAndConfirm(page);
    })

})