import { test, expect } from '@playwright/test';
import { HomePage } from '../../main/pages/HomePage';

test.describe('Verify Test Cases', () => {

    test('Verify that the test cases page is accessible', async ({ page }) => {
        const homePage = new HomePage();
        await homePage.clickTestCases(page);
        await page.waitForURL('https://automationexercise.com/test_cases');
        expect(page.url()).toBe('https://automationexercise.com/test_cases');
    });

    test('Verify that the API list page is accessible', async ({ page }) => {
        const homePage = new HomePage();
        await homePage.clickAPIList(page);
        await page.waitForURL('https://automationexercise.com/api_list');
        expect(page.url()).toBe('https://automationexercise.com/api_list');
    });

});