import { test, expect } from '@playwright/test';

test.describe('LetCode Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://letcode.in/test'); // Navigate to the LetCode website
    });

    test('Navigate LetCode Website', async ({ page }) => {
        await page.getByText('Products').click();
        await page.getByRole('link', { name: 'Ortoni Report' }).click();
        await page.getByRole('link', { name: 'LetXPath' }).click();
        await page.getByRole('link', { name: 'Playwright Runner' }).click();
        await page.getByText('Grooming').click();
        await page.getByRole('link', { name: 'Test Practice' }).click();
        await page.getByRole('link', { name: 'Interview Q & A' }).click();
        await page.getByRole('link', { name: 'Playwright Quiz' }).click();
        await page.getByRole('link', { name: 'Courses' }).click();
        await page.locator('div:nth-child(6) > .card > .card-footer > .card-footer-item').click();
        await page.getByRole('figure').locator('iframe').contentFrame().getByRole('button', { name: 'Play', exact: true }).click();
        await page.getByRole('figure').locator('iframe').contentFrame().getByRole('button', { name: 'Pause keyboard shortcut k' }).click({ delay: 10000 });
    });

    test('Page Object Model', async ({ page }) => {
        await page.getByRole('link', { name: 'Page Object Model' }).click();
        await page.getByRole('button', { name: '₹ 55.99' }).click();
        await page.getByRole('button', { name: ' Add to Cart' }).click();
        await page.getByRole('button', { name: ' Products' }).click();
        await page.getByRole('button', { name: '₹ 109.95' }).click();
        await page.getByRole('button', { name: ' Add to Cart' }).click();
        await page.getByRole('button', { name: '' }).click();
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });
        await page.getByRole('button', { name: 'Checkout' }).click();
    });

    test('Letcode Input', async ({ page }) => {
        await page.getByRole('link', { name: 'Edit' }).click();
        await page.getByRole('textbox', { name: 'Enter first & last name' }).click();
        await page.getByRole('textbox', { name: 'Enter first & last name' }).fill('Chukwuma Anyadike');
        await page.locator('#join').click();
        await page.locator('#join').fill('I am good, are you');
        await page.locator('#getMe').click();
        await page.locator('#clearMe').click();
        await page.locator('#clearMe').fill('');
        const disabledField = page.getByPlaceholder('Enter', { exact: true });
        await expect(disabledField).toBeDisabled();
        const readOnlyField = page.locator('#dontwrite');
        await expect(readOnlyField).not.toBeEditable();
    });

    test('Letcode Button', async ({ page }) => {
        await page.getByRole('link', { name: 'Click' }).click();
        await page.getByRole('button', { name: 'Goto Home and come back here' }).click();
        await page.getByRole('link', { name: 'Work-Space' }).click();
        await page.getByRole('link', { name: 'Click' }).click();

        const location = await page.getByRole('button', { name: 'Find Location' }).boundingBox();
        console.log(`Location of the button: x=${location?.x}, y=${location?.y}`);
        await page.getByRole('button', { name: 'Find Location' }).click();

        const color = await page.getByRole('button', { name: 'Find the color of the button' }).evaluate(el => {
            return window.getComputedStyle(el).backgroundColor;
        });
        console.log(`Color of the button: ${color}`);
        await page.getByRole('button', { name: 'Find the color of the button' }).click();

        const size = await page.getByRole('button', { name: 'How tall & fat I am?' }).boundingBox();
        console.log(`Size of the button: width=${size?.width}, height=${size?.height}`);
        await page.getByRole('button', { name: 'How tall & fat I am?' }).click();

        const disabledButton = page.getByRole('button', { name: 'Disabled' });
        await expect(disabledButton).toBeDisabled();
        await page.getByRole('button', { name: 'Button Hold!' }).click();
        await page.getByRole('button', { name: 'Button Hold!' }).click();
    });

    test('Letcode Select', async ({ page }) => {
        await page.getByRole('link', { name: 'Drop-Down' }).click();
        await page.locator('#fruits').click();
        await page.locator('#fruits').selectOption('1');
        await page.locator('#superheros').click();
        await page.locator('#superheros').selectOption('sm');
        await page.locator('#lang').click();
        await page.locator('#lang').selectOption('sharp');
        const languages = await page.locator('#lang').textContent();
        console.log(`Selected languages: ${languages}`);
        await page.locator('#country').click();
        await page.locator('#country').selectOption('India');
        const india = await page.locator('//*[@id="country"]/option[7]').textContent();
        console.log(`Selected country: ${india}`);
    });

    test('Letcode Alert', async ({ page }) => {
        await page.getByRole('link', { name: 'Dialog' }).click();

        page.once('dialog', dialog => {
            dialog.accept().catch(() => { });
        });
        await page.getByRole('button', { name: 'Simple Alert' }).click();

        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });
        await page.getByRole('button', { name: 'Confirm Alert' }).click();

        page.once('dialog', dialog => {
            dialog.accept('My name is CA Smooth');
        });
        await page.getByRole('button', { name: 'Prompt Alert' }).click();

        await page.getByRole('button', { name: 'Modern Alert' }).click();
        await page.getByRole('button', { name: 'close', exact: true }).click();
    });

    test('Letcode Frame', async ({ page }) => {
        await page.getByRole('link', { name: 'Inner HTML' }).click();
        await page.locator('iframe[name="firstFr"]').contentFrame().getByRole('textbox', { name: 'Enter name' }).click();
        await page.locator('iframe[name="firstFr"]').contentFrame().getByRole('textbox', { name: 'Enter name' }).fill('Clark');
        await page.locator('iframe[name="firstFr"]').contentFrame().getByRole('textbox', { name: 'Enter email' }).click();
        await page.locator('iframe[name="firstFr"]').contentFrame().getByRole('textbox', { name: 'Enter email' }).fill('Kent');
        await page.locator('iframe[name="firstFr"]').contentFrame().locator('app-frame-content iframe').contentFrame().getByRole('textbox', { name: 'Enter email' }).click();
        await page.locator('iframe[name="firstFr"]').contentFrame().locator('app-frame-content iframe').contentFrame().getByRole('textbox', { name: 'Enter email' }).fill('clark.kent@dailyplanet.com');
    });

    test('Letcode Radio', async ({ page }) => {
        await page.getByRole('link', { name: 'Toggle' }).click();
        await page.locator('#yes').check();
        await page.locator('#one').check();
        await page.locator('#two').check();
        await page.locator('#bug').check();
        const bugButtonChecked = page.locator('#bug').getAttribute('checked');
        expect(bugButtonChecked).toBeTruthy(); // Ensure the bug button is checked
        await page.locator('#bug').check();
        await page.getByRole('radio', { name: 'Bar' }).check();
        const disabledButton = page.getByText('Maybe');
        expect(disabledButton).toBeDisabled();
        const checkedBox = page.getByRole('checkbox', { name: 'Remember me' })
        expect(checkedBox).toBeChecked();
        await page.getByRole('checkbox', { name: 'I agree to the FAKE terms and' }).check();
    });

    test('Letcode Windows', async ({ page }) => {
        await page.getByRole('link', { name: 'Tabs' }).click();
        const page1Promise = page.waitForEvent('popup');
        await page.getByRole('button', { name: 'Goto Home Open muiltple' }).click();
        const page1 = await page1Promise;
        const page1header = page1.getByRole('heading');
        console.log(`Page 1 header: ${await page1header.textContent()}`);
        await page1.waitForTimeout(5000); // Wait for 5 seconds to observe the page
        await page1.close();
        const page3Promise = page.waitForEvent('popup');
        await page.getByRole('button', { name: 'Muiltiple windows' }).click();
        const page3 = await page3Promise;
        const page3header = page3.getByRole('heading');
        console.log(`Page 3 header: ${await page3header.textContent()}`);
        await page3.waitForTimeout(5000); // Wait for 5 seconds to observe the page
        await page3.close();
    });

    test('Letcode Elements', async ({ page }) => {
        await page.getByRole('link', { name: 'Find Elements' }).click();
        // Enter username
        await page.getByRole('textbox', { name: 'Enter your git user name eg' }).click();
        await page.getByRole('textbox', { name: 'Enter your git user name eg' }).fill('chukwuma1976');
        await page.getByRole('button', { name: 'Search' }).click();

        // Find image, print name and description
        await expect(page.getByRole('img', { name: 'User avatar' })).toBeVisible();
        const name = await page.locator('p.title').first().textContent();
        const description = await page.locator('p.ng-star-inserted').textContent();
        console.log(`Name: ${name}`);
        console.log(`Description: ${description}`);

        // Find and print number of repositories
        const numberLabel = await page.locator('p.title.is-5').first().textContent();
        const numberOfRepos = parseInt(numberLabel?.trim() || '0');
        console.log(`Number of repositories: ${numberOfRepos}`);

        // verify count of repositories
        let count = 0;
        const nextButton = page.getByRole('button', { name: 'Next' });
        while (true) {
            await page.waitForTimeout(200); // Wait for 1 second to ensure the page is loaded
            const reposPerPage = await page.locator('div.box.ng-star-inserted').count();
            count += reposPerPage;
            console.log(`Repositories on this page: ${reposPerPage} - Total count so far: ${count}`);
            if (await nextButton.isDisabled())
                break; // Exit the loop if there are no more pages
            else await nextButton.click();
        }
        console.log(`Number of repositories per page: ${count}`);
        expect(count).toBe(numberOfRepos);
    });

    test('Letcode Drop', async ({ page }) => {
        await page.getByRole('link', { name: 'AUI - 2' }).click();
        await page.locator('#draggable').dragTo(page.locator('#droppable'));
    });

    test('Letcode Multi-Select', async ({ page }) => {
        await page.getByRole('link', { name: 'AUI - 4' }).click();
        const boxes = page.locator('div.ng-star-inserted');
        for (const box of await boxes.all()) {
            box.click();
        }
        await page.waitForTimeout(5000); // Wait for 5 seconds to observe the selections
    });

    test('Letcode Slider', async ({ page }) => {
        await page.getByRole('link', { name: 'AUI - 5' }).click();
        await page.locator('#generate').fill('30');
        await page.getByRole('button', { name: 'Get Countries' }).click();
        const countryList = await page.locator('div.notification.is-primary').textContent();
        const numberOfCountries = countryList?.split('-').length || 0;
        console.log(`Number of countries: ${numberOfCountries}`);
        expect(numberOfCountries).toBe(30);
    });

    test('Letcode Wait', async ({ page }) => {
        await page.getByRole('link', { name: 'Timeout' }).click();
        await page.getByRole('button', { name: 'Simple Alert' }).click();
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.accept().catch(() => { });
        });
    });

    test('Letcode Simple Table', async ({ page }) => {
        await page.getByRole('link', { name: 'Simple table' }).click();
        const num1 = await page.getByRole('cell', { name: '150' }).textContent();
        const num2 = await page.getByRole('cell', { name: '180' }).textContent();
        const num3 = await page.getByRole('cell', { name: '180' }).textContent();
        const num4 = await page.getByRole('cell', { name: '480' }).textContent();
        const nums = [num1, num2, num3, num4];
        const sum = nums.map((num: string | null) => parseInt(num || '0')).reduce((acc: number, current: number) => acc + current);
        const total = parseInt(await page.getByText('858').textContent() || '0');
        console.log('Do all numbers add up? ', sum === total ? 'Yes' : 'No');
        await page.locator('#second').check();
        await page.getByRole('button', { name: 'Calories' }).click();
        await page.getByRole('button', { name: 'Calories' }).click();
        await page.getByRole('button', { name: 'Fat (g)' }).click();
        await page.getByRole('button', { name: 'Fat (g)' }).click();
        await page.getByRole('button', { name: 'Carbs (g)' }).click();
        await page.getByRole('button', { name: 'Carbs (g)' }).click();
        await page.getByRole('button', { name: 'Protein (g)' }).click();
        await page.getByRole('button', { name: 'Protein (g)' }).click();
        await page.getByRole('button', { name: 'Cholesterol(mg)' }).click();
        await page.getByRole('button', { name: 'Cholesterol(mg)' }).click();
    });

    test('Letcode Advanced Table', async ({ page }) => {
        await page.getByRole('link', { name: 'Advance table' }).click();
        await page.waitForSelector('.table-container');
        await page.getByText('S.NO').click();
        await page.getByText('S.NO').click();
        await page.getByText('UNIVERSITY NAME').click();
        await page.getByText('UNIVERSITY NAME').click();
        await page.getByText('COUNTRY').click();
        await page.getByText('COUNTRY').click();
        await page.getByText('WEBSITE').click();
        await page.getByText('WEBSITE').click();
        await page.getByLabel('entries per page').selectOption('10');
        await page.getByLabel('entries per page').selectOption('25');
        await page.locator('.columns > div:nth-child(3)').click();
        await page.getByRole('link', { name: 'Next' }).click();
        await page.getByRole('searchbox', { name: 'Search:' }).click();
        await page.getByRole('searchbox', { name: 'Search:' }).fill('Middlesex');
    });

    test('Letcode Calendar', async ({ page }) => {
        await page.getByRole('link', { name: 'Date & Time' }).click();
        await page.getByRole('textbox', { name: 'Select your Birthday:' }).fill('2008-05-30');
        await page.waitForTimeout(5000);
    });

    test('Letcode Form', async ({ page }) => {
        await page.getByRole('link', { name: 'All in One' }).click();
        await page.locator('#firstname').click();
        await page.locator('#firstname').fill('Paul');
        await page.locator('#lasttname').click();
        await page.locator('#lasttname').fill('Uzoma');
        await page.getByRole('textbox', { name: 'Email input' }).click();
        await page.getByRole('textbox', { name: 'Email input' }).fill('paul.uzoma@yahoo.com');
        await page.getByRole('textbox', { name: 'Phone Number' }).click();
        await page.getByRole('textbox', { name: 'Phone Number' }).fill('123456789');
        await page.getByRole('textbox', { name: 'Address Line-1' }).click();
        await page.getByRole('textbox', { name: 'Address Line-1' }).fill('1000 Broadway');
        await page.getByRole('textbox', { name: 'Address Line-2' }).click();
        await page.getByRole('textbox', { name: 'Address Line-2' }).fill('Apt 314');
        await page.getByRole('textbox', { name: 'State' }).click();
        await page.getByRole('textbox', { name: 'State' }).fill('New York');
        await page.getByRole('textbox', { name: 'Postal-Code' }).click();
        await page.getByRole('textbox', { name: 'Postal-Code' }).fill('11111');
        await page.locator('form div').filter({ hasText: 'Postal-CodeCountryAfghanistan' }).getByRole('combobox').selectOption('United States');
        await page.locator('#Date').fill('2001-01-01');
        await page.getByRole('radio', { name: 'Male', exact: true }).check();
        await page.getByRole('checkbox', { name: 'I agree to the terms and' }).check();
        await page.getByRole('button', { name: 'Submit' }).click();
    });

    test('Letcode Shadow DOM', async ({ page }) => {
        await page.getByRole('link', { name: 'DOM' }).click();
        await page.locator('#fname').click();
        await page.locator('#fname').fill('Paul');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Tab')
        await page.keyboard.type('Uzoma');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Tab')
        await page.keyboard.type('paul.uzoma@yahoo.com');
        await page.waitForTimeout(1000);
    });
});