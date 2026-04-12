import { expect, Page } from '@playwright/test';

export class ProductSearchResultPage {

    async confirmThatSearchedProductsHeaderIsVisible(page: Page) {
        const searchedProductsHeader = page.locator('h2:has-text("Searched Products")');
        await expect(searchedProductsHeader).toBeVisible();
    }

    async confirmThatProductsListIsVisible(page: Page) {
        const featuredItems = page.locator('div.features_items');
        expect(featuredItems).toBeVisible();
        const productCount = await featuredItems.locator('div.single-products').count();
        expect(productCount).toBeGreaterThan(0);
    }

}