import { test } from '@playwright/test';
import { HomePage } from '../../main/pages/HomePage';
import { CartPage } from '../../main/pages/CartPage';

test.describe('Subscription UI tests', () => {
    let homePage: HomePage;

    test.beforeEach(() => {
        homePage = new HomePage();
    })

    test('Subscribe in home page', async ({ page }) => {

        await homePage.confirmSubscriptionHeader(page);
        await homePage.subscribe(page, "tester@email.com");
        await homePage.confirmSuccessfulSubscription(page);

    })

    test('Subscribe in cart page', async ({ page }) => {

        await homePage.clickCart(page);

        const cartPage = new CartPage();
        await cartPage.confirmSubscriptionHeader(page);
        await cartPage.subscribe(page, "anothertest@email.com");
        await cartPage.confirmSuccessfulSubscription(page);

    })

})