import { test, expect } from '@playwright/test';

test.describe('SauceDemo Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/'); // Navigate to the SauceDemo website
    });

    test('standard user login', async ({ page }) => {
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
        await page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
        await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();
        await page.locator('[data-test="remove-sauce-labs-onesie"]').click();
        await page.locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]').click();
        await page.locator('[data-test="continue-shopping"]').click();
    });

    test('locked out user cannot login - saucedemo', async ({ page }) => {
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('locked_out_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Sorry, this user has been locked out.');
    });

    test('visual user makes a purchase', async ({ page }) => {
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('visual_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').click();
        await page.locator('[data-test="firstName"]').fill('test');
        await page.locator('[data-test="lastName"]').click();
        await page.locator('[data-test="lastName"]').fill('user');
        await page.locator('[data-test="postalCode"]').click();
        await page.locator('[data-test="postalCode"]').fill('00000');
        await page.locator('[data-test="continue"]').click();
        await page.locator('[data-test="finish"]').click();
        await expect(page.locator('[data-test="title"]')).toContainText('Checkout: Complete!');
        await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
        await page.locator('[data-test="back-to-products"]').click();
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="about-sidebar-link"]').click();
        await page.getByText('Developers', { exact: true }).click();
        // await page.getByText('Developers', { exact: true }).click();
        const page1Promise = page.waitForEvent('popup');
        await page.getByRole('link', { name: 'Documentation How to use' }).click();
        const page1 = await page1Promise;
    });

});