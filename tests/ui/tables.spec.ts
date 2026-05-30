import test, { expect } from "@playwright/test";
import { TablePage } from "../../main/pages/TablePage";

test.describe('Product Table Tests', () => {
    let tablePage: TablePage;

    test.beforeEach(async ({ page }) => {
        tablePage = new TablePage(page);
        await tablePage.navigateToTablePage();
    });

    test('Verify product details in the table', async ({ page }) => {
        const rowCount = await tablePage.getTableRowNumber();
        console.log(`Number of rows in the table: ${rowCount}`);
        await tablePage.printTableRows();
        await tablePage.expectRowToContainText(0, "Item");
    });

    test('Verify sorting by country', async ({ page }) => {
        await tablePage.sortByCountry("China");
    });

    test('Verify sorting by columns', async ({ page }) => {
        await tablePage.sortByColumns();
    });

    test('Verify selecting number of rows to display', async ({ page }) => {
        await tablePage.selectNumberOfRowsToDisplay();
    });

    test('Verify pagination', async ({ page }) => {
        await tablePage.testPagination();
    })
});