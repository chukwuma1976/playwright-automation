import { Page, expect } from '@playwright/test';

export class RegistrationPage {

    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async checkEnterAccountInformationHeaderIsVisible() {
        const enterAccountHeader = this.page.locator('h2:has-text("Enter Account Information")');
        await expect(enterAccountHeader).toBeVisible();
    }

    async fillRegistrationForm(userCredentials: any) {
        await this.page.locator('input#id_gender1').check(); //ensure that the "Mr." radio button is selected
        await this.page.locator('input#password').fill(userCredentials.password); //fill the password field

        //select date of birth
        await this.page.locator('select#days').selectOption(userCredentials.birth_date);
        await this.page.locator('select#months').selectOption(userCredentials.birth_month);
        await this.page.locator('select#years').selectOption(userCredentials.birth_year);

        await this.page.locator('input#newsletter').check(); //check the newsletter checkbox

        await this.page.locator('input#first_name').fill(userCredentials.firstname); //fill the first name field
        await this.page.locator('input#last_name').fill(userCredentials.lastname); //fill the last name field

        await this.page.locator('input#company').fill(userCredentials.company); //fill the company field
        await this.page.locator('input#address1').fill(userCredentials.address1); //fill the address field
        await this.page.locator('input#address2').fill(userCredentials.address2);

        await this.page.locator('select#country').selectOption(userCredentials.country); //select the country
        await this.page.locator('input#state').fill(userCredentials.state); //fill the state field
        await this.page.locator('input#city').fill(userCredentials.city);   //fill the city field
        await this.page.locator('input#zipcode').fill(userCredentials.zipcode); //fill the zipcode field
        await this.page.locator('input#mobile_number').fill(userCredentials.mobile_number); //fill the mobile number field

        await this.page.locator('button[data-qa="create-account"]').click(); //click the create account button
    }

    async checkAccountCreatedHeaderIsVisible() {
        const accountCreatedHeader = this.page.locator('h2:has-text("Account Created!")');
        await accountCreatedHeader.isVisible();
        expect(accountCreatedHeader).toBeVisible();
    }

    async checkAccountDeletedHeaderIsVisible() {
        const accountDeletedHeader = this.page.locator('h2:has-text("Account Deleted!")');
        await expect(accountDeletedHeader).toBeVisible();
    }

    async clickContinueButton() {
        await this.page.locator('a[data-qa="continue-button"]').click(); //click the continue button
    }

}