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
import { User } from '../../main/interfaces/user';
import { PaymentPage } from '../../main/pages/PaymentPage';

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

    test.beforeEach(() => {
        homePage = new HomePage();
        productsPage = new ProductsPage();
        popup = new CartPopupComponent();
        cartPage = new CartPage();
        loginPage = new LoginPage();
        registrationPage = new RegistrationPage();
        landingPage = new LandingPage();
        checkOutPage = new CheckOutPage();
        paymentPage = new PaymentPage();
    })

    test('Place Order: Register while Checkout', async ({ page }) => {

        await homePage.clickProducts(page);

        await productsPage.addProductToCart(page, 0);
        await popup.continueShopping(page);
        await productsPage.addProductToCart(page, 1);
        await popup.viewCart(page);

        await cartPage.confirmNumberOfProductsInCartToBe(page, 2);
        await cartPage.proceedToCheckout(page);
        await popup.login(page);

        const userCredentials = generateUserToRegister();
        await loginPage.registerUser(page, userCredentials.name, userCredentials.email);

        await registrationPage.checkEnterAccountInformationHeaderIsVisible(page);
        await registrationPage.fillRegistrationForm(page, userCredentials);
        await registrationPage.checkAccountCreatedHeaderIsVisible(page);
        await registrationPage.clickContinueButton(page);

        await landingPage.userIsLoggedIn(page);
        await landingPage.clickCart(page);

        await cartPage.proceedToCheckout(page);

        await checkOutPage.confirmAddress(page, userCredentials)
        await checkOutPage.enterDescription(page, "Making a purchase");
        await checkOutPage.submitOrder(page);

        await paymentPage.makePayment(page, 'Test User', '1234 5678 9101 1123', '123', '12', '2030');
        await paymentPage.confirmSuccessfulPaymentMessage(page);

        await landingPage.clickDeleteAccountButton(page);
        await registrationPage.checkAccountDeletedHeaderIsVisible(page);
        await registrationPage.clickContinueButton(page);
    })

    test('Place Order: Register before Checkout', async ({ page }) => {
        const userCredentials = generateUserToRegister();
        await loginPage.registerUser(page, userCredentials.name, userCredentials.email);

        await registrationPage.checkEnterAccountInformationHeaderIsVisible(page);
        await registrationPage.fillRegistrationForm(page, userCredentials);
        await registrationPage.checkAccountCreatedHeaderIsVisible(page);
        await registrationPage.clickContinueButton(page);

        await landingPage.userIsLoggedIn(page);

        await homePage.clickProducts(page);

        await productsPage.addProductToCart(page, 0);
        await popup.continueShopping(page);
        await productsPage.addProductToCart(page, 1);
        await popup.viewCart(page);

        await cartPage.confirmNumberOfProductsInCartToBe(page, 2);
        await cartPage.proceedToCheckout(page);

        await checkOutPage.confirmAddress(page, userCredentials)
        await checkOutPage.enterDescription(page, "Making a purchase");
        await checkOutPage.submitOrder(page);

        await paymentPage.makePayment(page, 'Test User', '1234 5678 9101 1123', '123', '12', '2030');
        await paymentPage.confirmSuccessfulPaymentMessage(page);
        await paymentPage.downloadInvoice(page);

        await landingPage.clickDeleteAccountButton(page);
        await registrationPage.checkAccountDeletedHeaderIsVisible(page);
        await registrationPage.clickContinueButton(page);
    })

})