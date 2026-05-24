import { expect, Page } from '@playwright/test';

export class ProductSearchResultPage {

    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async confirmThatSearchedProductsHeaderIsVisible() {
        const searchedProductsHeader = this.page.locator('h2:has-text("Searched Products")');
        await expect(searchedProductsHeader).toBeVisible();
    }

    async confirmThatProductsListIsVisible() {
        const featuredItems = this.page.locator('div.features_items');
        await expect(featuredItems).toBeVisible();
        const productCount = await featuredItems.locator('div.single-products').count();
        expect(productCount).toBeGreaterThan(0);
    }

}