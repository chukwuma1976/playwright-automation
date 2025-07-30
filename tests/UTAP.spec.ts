import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('UI Test Automation Playground Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://www.uitestingplayground.com/'); // Navigate to the UI Testing Playground
    });

    test('Dynamic ID', async ({ page }) => {
        await page.getByRole('link', { name: 'Dynamic ID' }).click();
        await page.getByRole('button', { name: 'Button with Dynamic ID' }).click();
        await expect(page.getByRole('button')).toContainText('Button with Dynamic ID');

        const button = await page.getByRole('button', { name: 'Button with Dynamic ID' }).getAttribute('id');
        console.log(`Button ID: ${button}`);
    });

    test('Class Attribute', async ({ page }) => {
        await page.getByRole('link', { name: 'Class Attribute' }).click();

        const buttonClass = await page.locator('//button[contains(@class, "btn-primary")]').getAttribute('class');
        console.log(`Button Class: ${buttonClass}`);

        await page.locator('//button[contains(@class, "btn-primary")]').click();

        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });
    });

    test('Hidden Layers', async ({ page }) => {
        await page.getByRole('link', { name: 'Hidden Layers' }).click();
        await page.locator('#greenButton').click();
        await page.locator('#blueButton').click();
    });

    test('Load Delay', async ({ page }) => {
        await page.getByRole('link', { name: 'Load Delay' }).click();
        await page.getByRole('button', { name: 'Button Appearing After Delay' }).click();
    });

    test('AJAX Data', async ({ page }) => {
        await page.getByRole('link', { name: 'AJAX Data' }).click();
        await page.getByRole('button', { name: 'Button Triggering AJAX Request' }).click();
        await page.locator('#content').waitFor({ state: 'visible' });
        await expect(page.getByText('Data loaded with AJAX get')).toBeVisible();
        await expect(page.locator('#content')).toContainText('Data loaded with AJAX get request.');
    });

    test('Client Side Delay', async ({ page }) => {
        await page.getByRole('link', { name: 'Client Side Delay' }).click();
        await page.getByRole('button', { name: 'Button Triggering Client Side' }).click();
        await page.locator('#content').waitFor({ state: 'visible' });
        await page.getByText('Data calculated on the client').click();
        await expect(page.getByText('Data calculated on the client')).toBeVisible();
        await expect(page.locator('#content')).toContainText('Data calculated on the client side.');
    });

    test('Click Not Working', async ({ page }) => {
        await page.getByRole('link', { name: 'Click' }).click();
        await page.getByRole('button', { name: 'Button That Ignores DOM Click' }).click();
        const buttonClass = await page.locator('#badButton').getAttribute('class');
        expect(buttonClass).toContain('btn-success'); // Verify the button class changed to 'btn-success'
    });

    test('Text Input', async ({ page }) => {
        await page.getByRole('link', { name: 'Text Input' }).click();
        await page.getByRole('textbox', { name: 'Set New Button Name' }).click();
        await page.getByRole('textbox', { name: 'Set New Button Name' }).fill('A New Button Name');
        await page.locator('#updatingButton').click();
        expect(page.locator('#updatingButton')).toContainText('A New Button Name');
    });

    test('Scrollbars', async ({ page }) => {
        await page.getByRole('link', { name: 'Scrollbars' }).click();
        await page.getByRole('button', { name: 'Hiding Button' }).scrollIntoViewIfNeeded();  //May not be necessary
        await page.getByRole('button', { name: 'Hiding Button' }).click();

    });

    test('Dynamic Table', async ({ page }) => {
        await page.getByRole('link', { name: 'Dynamic Table' }).click();
        const chromeCPUText = await page.getByText('Chrome CPU:').textContent();
        const chromeCPU = chromeCPUText ? chromeCPUText.split('Chrome CPU: ')[1].trim() : '';
        await page.getByRole('cell', { name: chromeCPU }).click();
    });

    test('Verify Text', async ({ page }) => {
        await page.getByRole('link', { name: 'Verify Text' }).click();
        await page.locator("//span[normalize-space(.)='Welcome UserName!']").click();
        await expect(page.locator('section')).toContainText('Welcome');
    });

    test('Progress Bar', async ({ page }) => {
        await page.getByRole('link', { name: 'Progress Bar' }).click();
        await page.getByRole('button', { name: 'Start' }).click();
        while (true) {
            const progressBar = await page.locator('#progressBar').getAttribute('aria-valuenow');
            if (progressBar && parseInt(progressBar) >= 75) break;
        }
        console.log(`Progress Bar Value: 75% or more reached`);
        await page.getByRole('button', { name: 'Stop' }).click();
    });

    test('Visibility', async ({ page }) => {
        await page.getByRole('link', { name: 'Visibility' }).click();
        await page.getByRole('button', { name: 'Hide' }).click({ delay: 2000 });
        const removedBtn = page.locator('#removedButton');
        const zeroWidthBtn = page.locator('#zeroWidthButton');
        const overLappedBtn = page.locator('#overlappedButton');
        const zeroOpacityBtn = page.locator('#transparentButton');
        const visibilityHiddenBtn = page.locator('#invisibleButton');
        const displayNoneBtn = page.locator('#notdisplayedButton');
        const offScreenBtn = page.locator('#offscreenButton');

        const buttons = {
            removedBtn, zeroWidthBtn, overLappedBtn,
            zeroOpacityBtn, visibilityHiddenBtn, displayNoneBtn, offScreenBtn
        }

        Object.keys(buttons).forEach(async (btn) => {
            const isVisible = await buttons[btn].isVisible();
            console.log(`Button ${btn} is visible: ${isVisible}`);
        });
    });

    test('Sample App', async ({ page }) => {
        await page.getByRole('link', { name: 'Sample App' }).click();
        await page.getByRole('textbox', { name: 'User Name' }).click();
        await page.getByRole('textbox', { name: 'User Name' }).fill('testUser');
        await page.getByRole('textbox', { name: '********' }).click();
        await page.getByRole('textbox', { name: '********' }).fill('wrongPassword');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.locator('#loginstatus')).toContainText('Invalid username/password');

        await page.getByRole('textbox', { name: 'User Name' }).click();
        await page.getByRole('textbox', { name: 'User Name' }).fill('testUser');
        await page.getByRole('textbox', { name: '********' }).click();
        await page.getByRole('textbox', { name: '********' }).fill('pwd');
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page.locator('#loginstatus')).toContainText('Welcome, testUser!');
    });

    test('Mouse Over', async ({ page }) => {
        await page.getByRole('link', { name: 'Mouse Over' }).click();
        await page.getByText('Click me').click();
        await page.getByText('Click me').click();
        await expect(page.locator('section')).toContainText('The link above clicked 2 times.');
        await page.getByText('Click me').hover({ timeout: 5000 });

        await page.getByText('Link Button').click();
        await page.getByText('Link Button').click();
        await page.getByText('Link Button').click();
        await page.getByText('Link Button').click();
        await expect(page.locator('section')).toContainText('The link above clicked 4 times.');
        await page.getByText('Link Button').hover({ timeout: 5000 });
    });

    test('Non-Breaking Space', async ({ page }) => {
        await page.getByRole('link', { name: 'Non-Breaking Space' }).click();
        await page.getByRole('button', { name: 'My Button' }).click();
        await page.getByText('//button[text()=\'My Button\']').click();
    });

    test('Overlapped Element', async ({ page }) => {
        await page.getByRole('link', { name: 'Overlapped Element' }).click();
        await page.getByRole('textbox', { name: 'Id' }).click();
        await page.getByRole('textbox', { name: 'Id' }).fill('test');
        await page.getByRole('textbox', { name: 'Name' }).click();
        await page.getByRole('textbox', { name: 'Name' }).fill('scrolling');
    });

    test('Shadow DOM', async ({ page }) => {
        await page.getByRole('link', { name: 'Shadow DOM' }).click();
        await page.getByRole('button', { name: '' }).click();
        await page.waitForSelector('#editField', { state: 'visible' });
        expect(page.locator('#editField')).toBeVisible();
    });

    test('Alerts', async ({ page }) => {
        await page.getByRole('link', { name: 'Alerts' }).click();

        await page.locator('#alertButton').click({ delay: 2000 });
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });

        await page.locator('#confirmButton').click({ delay: 2000 });
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });

        await page.locator('#promptButton').click({ delay: 2000 });
        page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.dismiss().catch(() => { });
        });

    });

    test('File Upload', async ({ page }) => {
        await page.getByRole('link', { name: 'File Upload' }).click();
        await page.locator('iframe').contentFrame().getByText('Browse files').click();

        page.on('filechooser', async (fileChooser) => {
            await fileChooser.setFiles(path.join(__dirname, '../shared/testFile.txt'));
        });
        await page.locator('iframe').contentFrame().getByText('Browse files').click();
        await page.screenshot();
    });

    test('Animated Button', async ({ page }) => {
        await page.getByRole('link', { name: 'Animated Button' }).click();
        await page.getByRole('button', { name: 'Start Animation' }).click();
        expect(page.locator('#opstatus')).toContainText('Animating the button...');
        while (true) {
            const movingTarget = await page.locator('#movingTarget').getAttribute('class');
            if (movingTarget && !movingTarget.includes('spin')) break;
        };
        expect(page.locator('#opstatus')).toContainText('Animation done');
        await page.getByRole('button', { name: 'Moving Target' }).click();
        expect(page.locator('#movingTarget').getAttribute('class')).not.toContain('spin');
        expect(page.locator('#opstatus')).toContainText('Moving Target clicked. It\'s class name is \'btn btn-primary\'');
    });

    test('Disabled Input', async ({ page }) => {
        await page.getByRole('link', { name: 'Disabled Input' }).click();
        await page.getByRole('button', { name: 'Enable Edit Field with 5' }).click();
        await expect(page.locator('#opstatus')).toContainText('Input Disabled...');
        while (true) {
            const textBoxDisabled = await page.locator('#inputField').isDisabled();
            if (!textBoxDisabled) break;
        }
        await expect(page.locator('#opstatus')).toContainText('Input Enabled...');
        await page.getByRole('textbox', { name: 'Edit Field' }).click();
        await page.getByRole('textbox', { name: 'Edit Field' }).fill('I can now enter text');
        await page.waitForTimeout(5000); // Wait for 5 seconds to observe the input
    });

    test('Auto Wait', async ({ page }) => {
        await page.getByRole('link', { name: 'Auto Wait' }).click();
        await page.getByRole('button', { name: 'Apply 3s' }).click();
        setInterval(() => { console.log('Waiting for 3 seconds...'); }, 3000);
        await page.getByRole('button', { name: 'Button' }).click();

        await page.getByRole('button', { name: 'Apply 5s' }).click();
        setInterval(() => { console.log('Waiting for 5 seconds...'); }, 5000);
        await page.getByRole('button', { name: 'Button' }).click();

        await page.getByRole('button', { name: 'Apply 10s' }).click();
        setInterval(() => { console.log('Waiting for 10 seconds...'); }, 10000);
        await page.getByRole('button', { name: 'Button' }).click();
    });
});