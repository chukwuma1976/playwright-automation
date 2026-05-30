import { expect, Locator, Page } from "@playwright/test";
import { generateFullURL, practiceAutomation, selectorsHub } from "../configuratons/config";

export class TablePage {
    page: Page;
    tablePageURL: string;
    tableRows: Locator;
    displayedRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.tablePageURL = generateFullURL(practiceAutomation, "tables/");
        this.tableRows = this.page.locator("figure table tbody tr");
        this.displayedRows = this.page.locator("table#tablepress-1 tbody tr");
    }

    async navigateToTablePage() {
        await this.page.goto(this.tablePageURL);
    }

    async getTableRowNumber() {
        return await this.tableRows.count();
    }

    async printTableRows() {
        (await this.tableRows.allTextContents()).forEach((row, index) => {
            console.log(`Row ${index + 1}: ${row}`);
        });
    }

    async expectRowToContainText(rowIndex: number, expectedText: string) {
        const tableRow = this.tableRows.nth(rowIndex);
        await expect(tableRow).toContainText(expectedText);
    }

    async sortByCountry(countryName: string = "Nigeria") {
        await this.page.getByLabel("Search:").fill(countryName);
        expect(await this.displayedRows.count()).toBe(1);
        await expect(this.displayedRows.first()).toContainText(countryName);
    }

    async sortByColumns() {
        const tableHeader = this.page.locator("table#tablepress-1 thead tr th");
        const toptableRow = this.displayedRows.first();
        await tableHeader.first().getByRole("button").click();

        for (let i = 0; i < await tableHeader.count(); i++) {
            console.log("before sorting:", await toptableRow.locator("td").nth(i).textContent());
            const headerColumn = tableHeader.nth(i);
            await headerColumn.getByRole("button").click();
            await this.page.waitForTimeout(1000);
            console.log("after sorting:", await toptableRow.locator("td").nth(i).textContent());
        }
    }

    async selectNumberOfRowsToDisplay() {
        expect(await this.displayedRows.count()).toBe(10);

        const dropdown = this.page.locator("select[aria-controls='tablepress-1']");
        await dropdown.click();
        await dropdown.selectOption("25");

        expect(await this.displayedRows.count()).toBe(25);
    }

    async testPagination() {
        let totalNumberOfRows = await this.displayedRows.count();
        const nextButton = this.page.getByLabel("Next");
        while (!(await nextButton.getAttribute("class"))?.includes("disabled")) {
            await this.page.waitForTimeout(100);
            await nextButton.click();
            totalNumberOfRows += await this.displayedRows.count();
        }
        expect(totalNumberOfRows).toBe(25);
    }
}