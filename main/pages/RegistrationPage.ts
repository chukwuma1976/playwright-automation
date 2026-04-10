import { Page, expect } from '@playwright/test';

export class RegistrationPage {

    async checkEnterAccountInformationHeaderIsVisible(page: Page) {
        const enterAccountHeader = page.locator('h2:has-text("Enter Account Information")');
        await enterAccountHeader.isVisible();
        expect(enterAccountHeader).toBeVisible();
    }

    async fillRegistrationForm(page: Page, userCredentials: any) {
        await page.locator('input#id_gender1').check(); //ensure that the "Mr." radio button is selected
        await page.locator('input#password').fill(userCredentials.password); //fill the password field

        //select date of birth
        await page.locator('select#days').selectOption(userCredentials.birth_date);
        await page.locator('select#months').selectOption(userCredentials.birth_month);
        await page.locator('select#years').selectOption(userCredentials.birth_year);

        await page.locator('input#newsletter').check(); //check the newsletter checkbox

        await page.locator('input#first_name').fill(userCredentials.firstname); //fill the first name field
        await page.locator('input#last_name').fill(userCredentials.lastname); //fill the last name field

        await page.locator('input#company').fill(userCredentials.company); //fill the company field
        await page.locator('input#address1').fill(userCredentials.address1); //fill the address field
        await page.locator('input#address2').fill(userCredentials.address2);

        await page.locator('select#country').selectOption(userCredentials.country); //select the country
        await page.locator('input#state').fill(userCredentials.state); //fill the state field
        await page.locator('input#city').fill(userCredentials.city);   //fill the city field
        await page.locator('input#zipcode').fill(userCredentials.zipcode); //fill the zipcode field
        await page.locator('input#mobile_number').fill(userCredentials.mobile_number); //fill the mobile number field

        await page.locator('button[data-qa="create-account"]').click(); //click the create account button
    }

    async checkAccountCreatedHeaderIsVisible(page: Page) {
        const accountCreatedHeader = page.locator('h2:has-text("Account Created!")');
        await accountCreatedHeader.isVisible();
        expect(accountCreatedHeader).toBeVisible();
    }

    async checkAccountDeletedHeaderIsVisible(page: Page) {
        const accountDeletedHeader = page.locator('h2:has-text("Account Deleted!")');
        await accountDeletedHeader.isVisible();
        expect(accountDeletedHeader).toBeVisible();
    }

    async clickContinueButton(page: Page) {
        await page.locator('a[data-qa="continue-button"]').click(); //click the continue button
    }

}