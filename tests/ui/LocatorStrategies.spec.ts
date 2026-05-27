import test from "@playwright/test";
import { generateLocatorURL, playwright_dev_locators } from "../../main/configuratons/config";
import { LocatorStrategiesPage } from "../../main/pages/LocatorStrategiesPage";

test.describe('Testing locator strategies', () => {
    let locatorStrategiesPage: LocatorStrategiesPage;

    test.beforeEach('Test locator strategies on Playwright documentation page', async ({ page }) => {
        locatorStrategiesPage = new LocatorStrategiesPage(page);
        await page.goto(generateLocatorURL(playwright_dev_locators));
    })

    test('Demonstrate getByRole locator strategy', async ({ page }) => {
        await locatorStrategiesPage.getByRoleLocator();
    })

    test('Demonstrate getByLabel locator strategy', async ({ page }) => {
        await locatorStrategiesPage.getByLabelLocator();
    })

    test('Demonstrate getByPlaceholder locator strategy', async ({ page }) => {
        await locatorStrategiesPage.getByPlaceholderLocator();
    })

    test('Demonstrate getByText locator strategy', async ({ page }) => {
        await locatorStrategiesPage.getByTextLocator();
    })

    test('Demonstrate getByAltText locator strategy', async ({ page }) => {
        await locatorStrategiesPage.getByAltTextLocator();
    })

    test('Demonstrate getByTitle locator strategy', async ({ page }) => {
        await locatorStrategiesPage.getByTitleLocator();
    })

    test('Demonstrate getByTestId locator strategy', async ({ page }) => {
        await locatorStrategiesPage.getByTestIdLocator();
    })

})