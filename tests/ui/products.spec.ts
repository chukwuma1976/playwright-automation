import { test, expect } from '@playwright/test';
import { HomePage } from '../../main/pages/HomePage';
import { ProductsPage } from '../../main/pages/ProductsPage';
import { ProductDetailPage } from '../../main/pages/ProductDetailPage';
import { ProductSearchResultPage } from '../../main/pages/ProductSearchResultPage';
import { CartPage } from '../../main/pages/CartPage';
import { CartPopupComponent } from '../../main/component/CartPopupComponent';
import { LandingPage } from '../../main/pages/LandingPage';

test.describe('Product UI Test Cases', () => {
    let homePage: HomePage;
    let productsPage: ProductsPage;
    let popup: CartPopupComponent;
    let cartPage: CartPage;
    let productDetailPage: ProductDetailPage;


    test.beforeEach(async ({ page }) => {
        homePage = new HomePage();
        productsPage = new ProductsPage();
        popup = new CartPopupComponent();
        cartPage = new CartPage();
        productDetailPage = new ProductDetailPage();
    });

    test('Verify that products are displayed and select first product', async ({ page }) => {

        await homePage.clickProducts(page);
        expect(page.url()).toContain('/products');

        await productsPage.confirmThatProductsListIsVisible(page);

        await productsPage.clickFirstProductViewButton(page);
        expect(page.url()).toContain('/product_details');

        await productDetailPage.confirmThatProductDetailsAreVisible(page);

    });

    test('Verify that search functionality works', async ({ page }) => {

        await homePage.clickProducts(page);
        expect(page.url()).toBe('https://automationexercise.com/products');

        await productsPage.searchForProduct(page, 'Dress');

        const productSearchResultPage = new ProductSearchResultPage();
        await productSearchResultPage.confirmThatSearchedProductsHeaderIsVisible(page);
        await productSearchResultPage.confirmThatProductsListIsVisible(page);

    });


    test('Add products', async ({ page }) => {

        await homePage.clickProducts(page);

        const firstProductPrice = await productsPage.getProductPrice(page, 0);
        await productsPage.addProductToCart(page, 0);

        await popup.continueShopping(page);

        const secondProductPrice = await productsPage.getProductPrice(page, 1);
        await productsPage.addProductToCart(page, 1)

        await popup.viewCart(page);

        await cartPage.confirmNumberOfProductsInCartToBe(page, 2);
        await cartPage.confirmContentOfProduct(page, 0, "1", firstProductPrice, firstProductPrice);
        await cartPage.confirmContentOfProduct(page, 1, "1", secondProductPrice, secondProductPrice);

    });

    test('Increase number of product and add to cart', async ({ page }) => {
        await homePage.clickProducts(page);
        await productsPage.clickFirstProductViewButton(page);

        await productDetailPage.confirmThatProductDetailsAreVisible(page);
        await productDetailPage.changeProductQuantity(page, '4');
        await productDetailPage.addProductToCart(page);

        await popup.viewCart(page);

        await cartPage.confirmQuantityOfProductIs(page, 0, '4')

    });

    test('Add and then delete a product', async ({ page }) => {
        await homePage.clickProducts(page);

        const firstProductPrice = await productsPage.getProductPrice(page, 0);
        await productsPage.addProductToCart(page, 0);

        await popup.continueShopping(page);

        const secondProductPrice = await productsPage.getProductPrice(page, 1);
        await productsPage.addProductToCart(page, 1)

        await popup.viewCart(page);

        await cartPage.confirmNumberOfProductsInCartToBe(page, 2);
        await cartPage.deleteProduct(page, 0);
        await cartPage.confirmNumberOfProductsInCartToBe(page, 1);
    });

    test('Select product categories', async ({ page }) => {
        const womensCategory = "Women - Dress Products";
        const menCategory = "Men - Tshirts Products";

        await homePage.clickProducts(page);

        await productsPage.selectWomensCategoryThenDress(page);
        await productsPage.checkCategoryTitle(page, womensCategory);
        await productsPage.selectMensCategoryThenTshirt(page);
        await productsPage.checkCategoryTitle(page, menCategory);
    });

    test('Select brands', async ({ page }) => {
        const brand1 = "Polo";
        const brand2 = "H&M";

        await homePage.clickProducts(page);

        await productsPage.selectBrand(page, brand1);
        await productsPage.checkCategoryTitle(page, brand1);

        await productsPage.selectBrand(page, brand2);
        await productsPage.checkCategoryTitle(page, brand2);
    })

    test('Select a product and write a review', async ({ page }) => {
        await homePage.clickProducts(page);

        await productsPage.clickFirstProductViewButton(page);

        await productDetailPage.confirmWriteYourReviewIsPresent(page);
        await productDetailPage.writeReview(page, "some tester", "sometester@email.com", "The produce is GREAT!");
        await productDetailPage.confirmReviewReceivedMessage(page);
    })

    test('Select a recommended item from landing page', async ({ page }) => {
        const item = "Stylish Dress";

        await homePage.hasRecommendedItemsHeader(page);
        await homePage.selectRecommendedItem(page, item);

        await popup.viewCart(page);

        await cartPage.confirmPresenceOfProductInCart(page, item);
    })
});