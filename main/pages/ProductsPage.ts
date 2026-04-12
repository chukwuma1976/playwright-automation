import { expect, Locator, Page } from '@playwright/test';

export class ProductsPage {
    baseURL: string = 'https://automationexercise.com/products';
    productsListSelector: string;

    constructor() {
        this.productsListSelector = 'div.features_items';
    }

    async confirmThatProductsListIsVisible(page: Page) {
        const productsList = page.locator(this.productsListSelector);
        await productsList.isVisible();
    }

    async clickFirstProductViewButton(page: Page) {
        const productsList = page.locator(this.productsListSelector);
        const firstProductViewButton = productsList.locator('div.choose').first();
        await firstProductViewButton.click();
    }

    async searchForProduct(page: Page, productName: string) {
        await page.locator("input#search_product").fill(productName);
        await page.locator("button#submit_search").click();
    }

    async getProductPrice(page: Page, index: number) {
        const product = page.locator('div.single-products').nth(index);
        return await product.locator('h2').first().textContent();
    }

    async addProductToCart(page: Page, index: number) {
        const product = page.locator('div.single-products').nth(index);
        const addproductButton = product.locator('a.add-to-cart').first();
        await addproductButton.click();
    }

    async selectWomensCategoryThenDress(page: Page) {
        await page.locator('a[href="#Women"]').click();
        await page.getByRole('link', { name: 'Dress' }).click();
    }

    async selectMensCategoryThenTshirt(page: Page) {
        await page.locator('a[href="#Men"]').click();
        await page.getByRole('link', { name: 'Tshirts' }).click();
    }

    async checkCategoryTitle(page: Page, content: string) {
        const categoryTitle = page.locator('h2.title.text-center');
        expect(await categoryTitle.textContent()).toContain(content);
    }

    async selectBrand(page: Page, brand: string) {
        await page.getByRole('link', { name: brand }).click();
    }
}