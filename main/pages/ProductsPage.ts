import { expect, Locator, Page } from '@playwright/test';

export class ProductsPage {
    baseURL: string = 'https://automationexercise.com/products';
    productsList: Locator;
    products: Locator;
    page: Page;
    constructor(page: Page) {
        this.page = page;
        this.productsList = page.locator('div.features_items');
        this.products = page.locator('div.single-products');
    }

    async confirmThatProductsListIsVisible() {
        await expect(this.productsList).toBeVisible();
    }

    async clickFirstProductViewButton() {
        const firstProductViewButton = this.productsList.locator('div.choose').first();
        await firstProductViewButton.click();
    }

    async searchForProduct(productName: string) {
        await this.page.locator("input#search_product").fill(productName);
        await this.page.locator("button#submit_search").click();
    }

    async getProductPrice(index: number) {
        const product = this.products.nth(index);
        return await product.locator('h2').first().textContent();
    }

    async addProductToCart(index: number) {
        const product = this.products.nth(index);
        const addproductButton = product.locator('a.add-to-cart').first();
        await addproductButton.click();
    }

    async selectWomensCategoryThenDress() {
        await this.page.locator('a[href="#Women"]').click();
        await this.page.getByRole('link', { name: 'Dress' }).click();
    }

    async selectMensCategoryThenTshirt() {
        await this.page.locator('a[href="#Men"]').click();
        await this.page.getByRole('link', { name: 'Tshirts' }).click();
    }

    async checkCategoryTitle(content: string) {
        const categoryTitle = this.page.locator('h2.title.text-center');
        expect(await categoryTitle.textContent()).toContain(content);
    }

    async selectBrand(brand: string) {
        await this.page.getByRole('link', { name: brand }).click();
    }
}