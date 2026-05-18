import test from "@playwright/test";

test.describe('Testing shadow DOM', () => {

    test('Test shadow DOM functionality', async ({ page }) => {
        await page.goto("https://practice.expandtesting.com/shadowdom");
        //Outside shadow DOM
        await page.locator("#my-btn.btn").click(); //Click on the button outside shadow DOM
        //Inside shadow DOM
        const shadowHost = page.locator("#shadow-host");
        await shadowHost.locator("#my-btn").click(); //click on the button inside shadow DOM
    });

    test('Test nested shadow DOM', async ({ page }) => {
        await page.goto("https://selectorshub.com/iframe-in-shadow-dom/");
        //Shadow DOM
        const outerShadowHost = page.locator("#userName");
        await outerShadowHost.locator("#kils").fill("I am in shadow DOM"); //fill the input field inside the shadow DOM
        //Nested shadow DOM
        const shadowHost = outerShadowHost.locator("#app2");
        await shadowHost.locator("#pizza").fill("I am inside the nested shadow DOM"); //fill the input field inside the nested shadow DOM
    });
});