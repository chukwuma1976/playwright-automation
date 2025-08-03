import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Webdriver Tests', () => {

    test('Webdriver Form', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/Contact-Us/contactus.html');
        await page.getByRole('textbox', { name: 'First Name' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).fill('Charlie');
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Brown');
        await page.getByRole('textbox', { name: 'Email Address' }).click();
        await page.getByRole('textbox', { name: 'Email Address' }).fill('charlie.brown@peanuts.com');
        await page.getByRole('textbox', { name: 'Comments' }).click();
        await page.getByRole('textbox', { name: 'Comments' }).fill('I am Charlie Brown and I do automation right with Playwright');
        await page.getByRole('button', { name: 'SUBMIT' }).click();
        await expect(page.getByRole('heading')).toContainText('Thank You for your Message!');

    });

    test('Webdriver Login', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/Login-Portal/index.html?'); //expect failed validation
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('dummyuser');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('dummypassword');
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });
        await page.getByRole('button', { name: 'Login' }).click();
        await page.goto('https://webdriveruniversity.com/Login-Portal/index.html?');
    });

    test('Webdriver Todos', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/To-Do-List/index.html');
        await page.getByRole('textbox', { name: 'Add new todo' }).click({ delay: 1000 });
        await page.getByRole('textbox', { name: 'Add new todo' }).fill('Train upper body');
        await page.getByRole('listitem').filter({ hasText: 'Go to potion class' }).locator('i').click({ delay: 1000 });
        await page.getByRole('listitem').filter({ hasText: 'Buy new robes' }).locator('i').click({ delay: 1000 });
        await page.getByRole('listitem').filter({ hasText: 'Practice magic' }).locator('i').click({ delay: 1000 });
        await page.getByRole('listitem').filter({ hasText: 'Practice magic' }).locator('i').click({ delay: 1000 });
        await page.locator('#plus-icon').click({ delay: 1000 });
    });

    test('Webdriver POM', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/Page-Object-Model/index.html');
        await page.getByRole('link', { name: '' }).click();
        await page.getByRole('link', { name: '' }).click();
        await page.getByRole('button', { name: 'Find Out More!' }).click();
        await page.getByRole('button', { name: 'Find Out More', exact: true }).click();
        await page.getByRole('link', { name: 'Our Products' }).click();
        await page.getByRole('link', { name: 'Special Offers' }).click();
        await page.getByRole('button', { name: 'Proceed' }).click();
        await page.getByRole('link', { name: 'Cameras' }).click();
        await page.getByRole('button', { name: 'Close' }).click();
        await page.getByRole('link', { name: 'New Laptops' }).click();
        await page.getByRole('button', { name: '×' }).click();
        await page.getByRole('link', { name: 'Used Laptops' }).click();
        await page.getByRole('button', { name: 'Proceed' }).click();
        await page.getByRole('link', { name: 'Game Consoles' }).click();
        await page.getByRole('button', { name: 'Close' }).click();
        await page.getByRole('link', { name: 'Components' }).click();
        await page.getByRole('button', { name: '×' }).click();
        await page.getByRole('link', { name: 'Desktop Systems' }).click();
        await page.getByRole('button', { name: '×' }).click();
        await page.getByRole('link', { name: 'Audio' }).click();
        await expect(page.getByText('× SPECIAL OFFER! - GET 30%')).toBeVisible();
        await page.getByRole('button', { name: 'Close' }).click();
        await page.getByRole('link', { name: 'Contact Us' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).click();
        await page.getByRole('textbox', { name: 'First Name' }).fill('Joe');
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Cool');
        await page.getByRole('textbox', { name: 'Email Address' }).click();
        await page.getByRole('textbox', { name: 'Email Address' }).fill('joe.cool@thecoolones.com');
        await page.getByRole('textbox', { name: 'Comments' }).click();
        await page.getByRole('textbox', { name: 'Comments' }).fill('Automation with Playwright is friggin\' cool');
        await page.getByRole('button', { name: 'SUBMIT' }).click();
    });

    test('Webdriver Accordion', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/Accordion/index.html');
        await page.getByRole('button', { name: 'Manual Testing +' }).click();
        await page.getByRole('button', { name: 'Cucumber BDD +' }).click();
        await page.getByRole('button', { name: 'Automation Testing +' }).click();
        await page.getByRole('button', { name: 'Keep Clicking! - Text will' }).click({ delay: 5000 });
        await expect(page.locator('#timeout')).toContainText('This text has appeared after 5 seconds!');
        await page.waitForTimeout(5000);
    });

    test('Webdriver Dropdowns', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/Dropdown-Checkboxes-RadioButtons/index.html');
        await page.locator('#dropdowm-menu-1').click();
        await page.locator('#dropdowm-menu-1').selectOption('c#');
        await page.locator('#dropdowm-menu-2').click();
        await page.locator('#dropdowm-menu-2').selectOption('maven');
        await page.locator('#dropdowm-menu-3').click();
        await page.locator('#dropdowm-menu-3').selectOption('css');

        const checkedBox3 = page.getByRole('checkbox', { name: 'Option 3' });
        await expect(checkedBox3).toBeChecked();
        await page.getByRole('checkbox', { name: 'Option 1' }).check();
        await page.getByRole('checkbox', { name: 'Option 2' }).check();
        await page.getByRole('checkbox', { name: 'Option 4' }).check();

        await page.locator('input[name="color"]').first().check();
        const secondVeggie = page.locator('input[name="vegetable"]').nth(1);
        await expect(secondVeggie).toBeDisabled();
        await page.locator('input[name="vegetable"]').first().check();

        const secondFruit = page.locator('#fruit-selects option').nth(1);
        await expect(secondFruit).toBeDisabled();
        await page.locator('#fruit-selects').click();
        await page.locator('#fruit-selects').selectOption('apple');
    });

    test('Webdriver AJAX', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/Ajax-Loader/index.html');
        await page.waitForSelector('#button1', { state: 'visible' });
        await expect(page.getByRole('paragraph')).toContainText('CLICK ME!');
        await page.getByText('CLICK ME!').click();
        await expect(page.locator('#myModalClick')).toContainText('The waiting game can be a tricky one; this exercise will hopefully improve your understandings of the various types of waits.');
        await page.getByRole('button', { name: 'Close' }).click();
    });

    test('Webdriver Actions', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/Actions/index.html');
        const draggable = page.locator('#draggable');
        const droppable = page.locator('#droppable');
        await expect(droppable).toContainText('DROP HERE!');
        await draggable.dragTo(droppable);
        await expect(droppable).toContainText('Dropped!');

        const clickable = page.locator('#double-click');
        await clickable.dblclick();
        console.log('clickable element class: ', await clickable.getAttribute('class'));
        const hoverableButtons = page.locator('.dropdown').all();
        for (const button of await hoverableButtons) {
            await button.hover({ timeout: 5000 });
            await page.waitForTimeout(2000);
        }

        await page.locator('#click-box').click({ delay: 5000 });
        await page.waitForTimeout(5000);
    });

    test('Webdriver Scrolling', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/Scrolling/index.html');
        const zone1 = page.locator('#zone1');
        const zone2 = page.locator('#zone2');
        const zone3 = page.locator('#zone3');
        const zone4 = page.locator('#zone4');
        await zone1.scrollIntoViewIfNeeded({ timeout: 2000 });
        await zone2.scrollIntoViewIfNeeded({ timeout: 2000 });
        await zone3.scrollIntoViewIfNeeded({ timeout: 2000 });
        await zone4.scrollIntoViewIfNeeded({ timeout: 2000 });
        await zone1.scrollIntoViewIfNeeded({ timeout: 2000 });
        await zone4.scrollIntoViewIfNeeded({ timeout: 2000 });
    });

    test('Webdriver Autocomplete', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/Autocomplete-TextField/autocomplete-textfield.html');
        await page.getByRole('textbox', { name: 'Food Item' }).click();
        await page.getByRole('textbox', { name: 'Food Item' }).fill('Apple');
        await expect(page.getByRole('strong')).toContainText('Apple');
        await page.waitForTimeout(2000);

        await page.getByRole('textbox', { name: 'Food Item' }).click();
        await page.getByRole('textbox', { name: 'Food Item' }).fill('Ava');
        await expect(page.locator('#myInputautocomplete-list')).toContainText('Avacado');
        await page.waitForTimeout(2000);

        await page.getByRole('textbox', { name: 'Food Item' }).click();
        await page.getByRole('textbox', { name: 'Food Item' }).fill('P');
        await expect(page.locator('#myInputautocomplete-list')).toContainText('Pizza');
        await expect(page.locator('#myInputautocomplete-list')).toContainText('Pepperoni');
        await expect(page.locator('#myInputautocomplete-list')).toContainText('Pancakes');
        await page.waitForTimeout(2000);

        await page.getByRole('textbox', { name: 'Food Item' }).click();
        await page.getByRole('textbox', { name: 'Food Item' }).fill('Zuc');
        await expect(page.locator('#myInputautocomplete-list')).toContainText('Zucchini');
        await page.waitForTimeout(2000);

        await page.getByRole('textbox', { name: 'Food Item' }).click();
        await page.getByRole('textbox', { name: 'Food Item' }).fill('Pepp');
        await expect(page.locator('#myInputautocomplete-list')).toContainText('Pepperoni');
        await page.waitForTimeout(2000);

        await page.getByRole('textbox', { name: 'Food Item' }).click();
        await page.getByRole('textbox', { name: 'Food Item' }).fill('Ba');
        await expect(page.locator('#myInputautocomplete-list')).toContainText('Bacon');
        await expect(page.locator('#myInputautocomplete-list')).toContainText('Bagels');
        await expect(page.locator('#myInputautocomplete-list')).toContainText('Barley');
        await page.waitForTimeout(2000);

        await page.getByText('Bagels').click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByRole('link', { name: 'WebdriverUniversity.com (New' }).click();
        await page.waitForTimeout(2000);
    });

    test('Webdriver FileUpload', async ({ page }) => {
        await page.goto('https://webdriveruniversity.com/File-Upload/index.html');
        page.locator('#myFile').click();
        page.once('filechooser', async (fileChooser) => {
            await fileChooser.setFiles(path.join(__dirname, '../shared/testFile.txt'));
        });
        await page.locator('#submit-button').click();
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.accept().catch(() => { });
        });
        await page.waitForTimeout(2000);
    });

});