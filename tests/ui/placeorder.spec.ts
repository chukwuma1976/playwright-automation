import { test } from '@playwright/test'
import { HomePage } from '../../main/pages/HomePage'
import { ProductsPage } from '../../main/pages/ProductsPage';
import { CartPopupComponent } from '../../main/component/CartPopupComponent';
import { CartPage } from '../../main/pages/CartPage';
import { LoginPage } from '../../main/pages/LoginPage';
import { generateUserToRegister } from '../../main/utilities/UserCredentialsGenerator';
import { RegistrationPage } from '../../main/pages/RegistrationPage';
import { LandingPage } from '../../main/pages/LandingPage';
import { CheckOutPage } from '../../main/pages/CheckOutPage';
import { PaymentPage } from '../../main/pages/PaymentPage';
import { ProductSearchResultPage } from '../../main/pages/ProductSearchResultPage';

test.describe('Placing Orders UI tests', () => {
    let homePage: HomePage;
    let productsPage: ProductsPage;
    let popup: CartPopupComponent;
    let cartPage: CartPage;
    let loginPage: LoginPage;
    let registrationPage: RegistrationPage;
    let landingPage: LandingPage;
    let checkOutPage: CheckOutPage;
    let paymentPage: PaymentPage;
    let productSearchResultPage: ProductSearchResultPage;

    test.beforeEach(({ page }) => {
        homePage = new HomePage(page);
        productsPage = new ProductsPage(page);
        popup = new CartPopupComponent(page);
        cartPage = new CartPage(page);
        loginPage = new LoginPage(page);
        registrationPage = new RegistrationPage(page);
        landingPage = new LandingPage(page);
        checkOutPage = new CheckOutPage(page);
        paymentPage = new PaymentPage(page);
        productSearchResultPage = new ProductSearchResultPage(page);
    })

    test('Place Order: Register while Checkout', async ({ page }) => {

        await homePage.clickProducts();

        await productsPage.addProductToCart(0);
        await popup.continueShopping();
        await productsPage.addProductToCart(1);
        await popup.viewCart();

        await cartPage.confirmNumberOfProductsInCartToBe(2);
        await cartPage.proceedToCheckout();
        await popup.login();

        const userCredentials = generateUserToRegister();
        await loginPage.registerUser(userCredentials.name, userCredentials.email);

        await registrationPage.checkEnterAccountInformationHeaderIsVisible();
        await registrationPage.fillRegistrationForm(userCredentials);
        await registrationPage.checkAccountCreatedHeaderIsVisible();
        await registrationPage.clickContinueButton();

        await landingPage.userIsLoggedIn();
        await landingPage.clickCart();

        await cartPage.proceedToCheckout();

        await checkOutPage.confirmAddress(userCredentials)
        await checkOutPage.enterDescription("Making a purchase");
        await checkOutPage.submitOrder();

        await paymentPage.makePayment('Test User', '1234 5678 9101 1123', '123', '12', '2030');
        await paymentPage.confirmSuccessfulPaymentMessage();

        await landingPage.clickDeleteAccountButton();
        await registrationPage.checkAccountDeletedHeaderIsVisible();
        await registrationPage.clickContinueButton();
    })

    test('Place Order: Register before Checkout', async ({ page }) => {
        const userCredentials = generateUserToRegister();
        await loginPage.registerUser(userCredentials.name, userCredentials.email);

        await registrationPage.checkEnterAccountInformationHeaderIsVisible();
        await registrationPage.fillRegistrationForm(userCredentials);
        await registrationPage.checkAccountCreatedHeaderIsVisible();
        await registrationPage.clickContinueButton();

        await landingPage.userIsLoggedIn();

        await homePage.clickProducts();

        await productsPage.addProductToCart(0);
        await popup.continueShopping();
        await productsPage.addProductToCart(1);
        await popup.viewCart();

        await cartPage.confirmNumberOfProductsInCartToBe(2);
        await cartPage.proceedToCheckout();

        await checkOutPage.confirmAddress(userCredentials)
        await checkOutPage.enterDescription("Making a purchase");
        await checkOutPage.submitOrder();

        await paymentPage.makePayment('Test User', '1234 5678 9101 1123', '123', '12', '2030');
        await paymentPage.confirmSuccessfulPaymentMessage();
        await paymentPage.downloadInvoice();

        await landingPage.clickDeleteAccountButton();
        await registrationPage.checkAccountDeletedHeaderIsVisible();
        await registrationPage.clickContinueButton();
    })

    test('Search Products and Verify Cart After Login', async ({ page }) => {
        // const userCredentials = generateUser("sdet@automation.com", "sdetpassword31456");
        const email = "sdet@automation.com";
        const password = "sdetpassword31456";

        await homePage.clickProducts();

        await productsPage.searchForProduct('Tshirt');
        await productSearchResultPage.confirmThatSearchedProductsHeaderIsVisible();
        await productSearchResultPage.confirmThatProductsListIsVisible();

        await productsPage.addProductToCart(0);
        await popup.continueShopping();
        await productsPage.addProductToCart(1);
        await popup.viewCart();

        await cartPage.confirmNumberOfProductsInCartToBe(2);

        await loginPage.login(email, password);
        await landingPage.clickCart();

        await cartPage.confirmNumberOfProductsInCartToBe(2);
        await cartPage.proceedToCheckout();

        await checkOutPage.enterDescription("Making a purchase");
        await checkOutPage.submitOrder();

        await paymentPage.makePayment('Test User', '1234 5678 9101 1123', '123', '12', '2030');
        await paymentPage.confirmSuccessfulPaymentMessage();
        await paymentPage.downloadInvoice();

    })
})