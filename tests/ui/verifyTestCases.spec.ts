import { test, expect } from '@playwright/test';
import { LoginPage } from '../../main/pages/LoginPage';

test.describe('Verify Test Cases', () => {

    test('Verify that the test cases are running', async ({ page }) => {
        new LoginPage().clickTestCases(page);
        await page.waitForURL('https://automationexercise.com/test_cases');
        expect(page.url()).toBe('https://automationexercise.com/test_cases');
    });

});