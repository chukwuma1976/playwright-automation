import { test } from '@playwright/test';
import { HomePage } from '../../main/pages/HomePage';
import { CartPage } from '../../main/pages/CartPage';

test.describe('Subscription UI tests', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
    })

    test('Subscribe in home page', async ({ page }) => {

        await homePage.confirmSubscriptionHeader();
        await homePage.subscribe("tester@email.com");
        await homePage.confirmSuccessfulSubscription();

    })

    test('Subscribe in cart page', async ({ page }) => {

        await homePage.clickCart();

        const cartPage = new CartPage(page);
        await cartPage.confirmSubscriptionHeader();
        await cartPage.subscribe("anothertest@email.com");
        await cartPage.confirmSuccessfulSubscription();

    })

})