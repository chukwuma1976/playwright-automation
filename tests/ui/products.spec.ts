import { test, expect } from '@playwright/test';
import { HomePage } from '../../main/pages/HomePage';
import { ProductsPage } from '../../main/pages/ProductsPage';
import { ProductDetailPage } from '../../main/pages/ProductDetailPage';
import { ProductSearchResultPage } from '../../main/pages/ProductSearchResultPage';
import { CartPage } from '../../main/pages/CartPage';
import { CartPopupComponent } from '../../main/component/CartPopupComponent';

test.describe('Product UI Test Cases', () => {
    let homePage: HomePage;
    let productsPage: ProductsPage;
    let popup: CartPopupComponent;
    let cartPage: CartPage;
    let productDetailPage: ProductDetailPage;


    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productsPage = new ProductsPage(page);
        popup = new CartPopupComponent(page);
        cartPage = new CartPage(page);
        productDetailPage = new ProductDetailPage(page);
    });

    test('Verify that products are displayed and select first product', async ({ page }) => {

        await homePage.clickProducts();
        expect(page.url()).toContain('/products');

        await productsPage.confirmThatProductsListIsVisible();

        await productsPage.clickFirstProductViewButton();
        expect(page.url()).toContain('/product_details');

        await productDetailPage.confirmThatProductDetailsAreVisible();

    });

    test('Verify that search functionality works', async ({ page }) => {

        await homePage.clickProducts();
        expect(page.url()).toBe('https://automationexercise.com/products');

        await productsPage.searchForProduct('Dress');

        const productSearchResultPage = new ProductSearchResultPage(page);
        await productSearchResultPage.confirmThatSearchedProductsHeaderIsVisible();
        await productSearchResultPage.confirmThatProductsListIsVisible();

    });


    test('Add products', async ({ page }) => {

        await homePage.clickProducts();

        const firstProductPrice = await productsPage.getProductPrice(0);
        await productsPage.addProductToCart(0);

        await popup.continueShopping();

        const secondProductPrice = await productsPage.getProductPrice(1);
        await productsPage.addProductToCart(1)

        await popup.viewCart();

        await cartPage.confirmNumberOfProductsInCartToBe(2);
        await cartPage.confirmContentOfProduct(0, "1", firstProductPrice, firstProductPrice);
        await cartPage.confirmContentOfProduct(1, "1", secondProductPrice, secondProductPrice);

    });

    test('Increase number of product and add to cart', async ({ page }) => {
        await homePage.clickProducts();
        await productsPage.clickFirstProductViewButton();

        await productDetailPage.confirmThatProductDetailsAreVisible();
        await productDetailPage.changeProductQuantity('4');
        await productDetailPage.addProductToCart();

        await popup.viewCart();

        await cartPage.confirmQuantityOfProductIs(0, '4')

    });

    test('Add and then delete a product', async ({ page }) => {
        await homePage.clickProducts();

        const firstProductPrice = await productsPage.getProductPrice(0);
        await productsPage.addProductToCart(0);

        await popup.continueShopping();

        const secondProductPrice = await productsPage.getProductPrice(1);
        await productsPage.addProductToCart(1)

        await popup.viewCart();

        await cartPage.confirmNumberOfProductsInCartToBe(2);
        await cartPage.deleteProduct(0);
        await cartPage.confirmNumberOfProductsInCartToBe(1);
    });

    test('Select product categories', async ({ page }) => {
        const womensCategory = "Women - Dress Products";
        const menCategory = "Men - Tshirts Products";

        await homePage.clickProducts();

        await productsPage.selectWomensCategoryThenDress();
        await productsPage.checkCategoryTitle(womensCategory);
        await productsPage.selectMensCategoryThenTshirt();
        await productsPage.checkCategoryTitle(menCategory);
    });

    test('Select brands', async ({ page }) => {
        const brand1 = "Polo";
        const brand2 = "H&M";

        await homePage.clickProducts();

        await productsPage.selectBrand(brand1);
        await productsPage.checkCategoryTitle(brand1);

        await productsPage.selectBrand(brand2);
        await productsPage.checkCategoryTitle(brand2);
    })

    test('Select a product and write a review', async ({ page }) => {
        await homePage.clickProducts();

        await productsPage.clickFirstProductViewButton();

        await productDetailPage.confirmWriteYourReviewIsPresent();
        await productDetailPage.writeReview("some tester", "sometester@email.com", "The produce is GREAT!");
        await productDetailPage.confirmReviewReceivedMessage();
    })

    test('Select a recommended item from landing page', async ({ page }) => {
        const item = "Stylish Dress";

        await homePage.hasRecommendedItemsHeader();
        await homePage.selectRecommendedItem(item);

        await popup.viewCart();

        await cartPage.confirmPresenceOfProductInCart(item);
    })
});