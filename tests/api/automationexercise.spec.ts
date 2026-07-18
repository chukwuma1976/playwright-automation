import { test, expect } from '@playwright/test';
import { Ajv } from 'ajv';
import addFormats from 'ajv-formats';

import { Product } from '../../main/interfaces/product';
import { Brand } from '../../main/interfaces/brand';
import { brandSchema } from '../../main/schemas/brandSchema';
import { productSchema } from '../../main/schemas/productSchema';
import { generateUser, generateUserCredentials } from '../../main/utilities/UserCredentialsGenerator';
import { userSchema } from '../../main/schemas/userSchema';
import { User } from '../../main/interfaces/user';

import { credentials, blankLoginCredentials, listOfInvalidOrMissingCredentials } from '../../main/utilities/LoginCredentials';

const ajv = new Ajv();
addFormats(ajv);

test.describe('Automation Exercise API Tests', () => {
    const baseURL = 'https://automationexercise.com/api';

    test('GET/products', async ({ request }) => {

        const start = Date.now();
        const startPrime = performance.now();

        const response = await request.get(`${baseURL}/productsList`);

        //check response times using both Date.now() and performance.now()
        const responseTime = Date.now() - start;
        const responseTimePrime = performance.now() - startPrime;

        const products = await response.json();

        //note that using performance now adds more precision
        console.log(`response time 1 = ${responseTime} and response time 2 = ${responseTimePrime}`);

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toEqual(200);
        expect(Array.isArray(products.products)).toBeTruthy();
        expect(products.products.length).toBeGreaterThan(0);

        // Validate the structure of the first product
        validateProductSchema(products.products[0]);
        validateWithAjvProductSchema(products.products[0]);

    })

    test('POST /addProduct', async ({ request }) => {

        const product = {
            "name": "Some product",
            "price": "Some",
            "brand": "Polo",
            "category": {
                "usertype": {
                    "usertype": "Women"
                },
                "category": "Tops"
            }
        }

        const response = await request.post(`${baseURL}/productList`, { data: product });
        expect(response.status()).toBe(404);
        expect(response.statusText()).toEqual("Not Found");

    });

    test('GET/brands', async ({ request }) => {

        const response = await request.get(`${baseURL}/brandsList`);
        const brands = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(Array.isArray(brands.brands)).toBeTruthy();
        expect(brands.brands.length).toBeGreaterThan(0);

        //Validate the structure of the first brand
        validateBrandSchema(brands.brands[0]);
        validateWithAjvBrandSchema(brands.brands[0]);

    })

    test('PUT /brands', async ({ request }) => {

        const brand = {
            "id": 1,
            "brand": "New Brand"
        }

        const response = await request.put(`${baseURL}/brandsList/1`, { data: brand });
        expect(response.status()).toBe(404);
        expect(response.statusText()).toEqual("Not Found");
    });

    test('POST /searchProduct', async ({ request }) => {
        const searchQuery = {
            search_product: "T-Shirt"
        }

        const response = await request.post(`${baseURL}/searchProduct`, { form: searchQuery });
        const searchResults = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(searchResults.products.length).toBeGreaterThan(0);
    });

    test('POST /searchProduct with missing query paramters', async ({ request }) => {
        const searchQuery = {
            // search_product: ""
        }

        const response = await request.post(`${baseURL}/searchProduct`, { form: searchQuery });
        const searchResults = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(searchResults.responseCode).toBe(400);
        expect(searchResults.message).toBe('Bad request, search_product parameter is missing in POST request.')
    });

    test('API login with valid credentials', async ({ request }) => {

        const response = await request.post(`${baseURL}/verifyLogin`, { form: credentials });
        const responseJson = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        expect(responseJson.responseCode).toBe(200);
        expect(responseJson.message).toBe('User exists!');
    });

    listOfInvalidOrMissingCredentials.forEach((credentials, index) => {
        test(`APT login with invalid credentials test number ${index + 1}"`, async ({ request }) => {

            const response = await request.post(`${baseURL}/verifyLogin`, { form: credentials });
            const responseJson = await response.json();

            expect(response.status()).toBe(200);
            expect(responseJson.responseCode).toBe(404)
            expect(responseJson.message).toBe("User not found!")
        });
    })

    test('Delete login', async ({ request }) => {

        const response = await request.delete(`${baseURL}/verifyLogin`);
        const responseJson = await response.json();

        expect(response.status()).toBe(200);
        expect(responseJson.responseCode).toBe(405);
        expect(responseJson.message).toBe('This request method is not supported.');

    });

    blankLoginCredentials.forEach((credentials) => {
        test(`login with blank credentials: email="${credentials.email}", password="${credentials.password}"`, async ({ request }) => {
            const response = await request.post(`${baseURL}/verifyLogin`, { form: credentials });
            const responseJson = await response.json();

            expect(response.status()).toBe(200);

            expect(responseJson.responseCode).toBe(404);
            expect(responseJson.message).toBe('User not found!');
        });
    });

    test('POST /createAccount', async ({ request }) => {
        const email = generateUserCredentials().email;
        const password = generateUserCredentials().password;
        const newUser = generateUser(email, password);

        const response = await request.post(`${baseURL}/createAccount`, { form: newUser });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        expect(responseJson.responseCode).toBe(201);
        expect(responseJson.message).toBe('User created!');

        // Delete the created user to maintain test idempotency, also test delete account flow
        const deleteResponse = await request.delete(`${baseURL}/deleteAccount`, { form: { email, password } });
        const deletedResponseJson = await deleteResponse.json()
        expect(deletedResponseJson.responseCode).toBe(200);
        expect(deletedResponseJson.message).toBe('Account deleted!')
    });

    test('PUT /updateAccount with existing email', async ({ request }) => {
        const email = generateUserCredentials().email;
        const password = generateUserCredentials().password;
        const newUser = generateUser(email, password);

        // Create a new user
        await request.post(`${baseURL}/createAccount`, { form: newUser });

        const updatedUser = { ...newUser, name: "updatedName", address1: "updatedAddress" };

        // Update the user with the same email
        const response = await request.put(`${baseURL}/updateAccount`, { form: updatedUser });
        const responseJson = await response.json();

        expect(response.status()).toBe(200);
        expect(responseJson.responseCode).toBe(200);
        expect(responseJson.message).toBe('User updated!');

        // Delete the created user to maintain test idempotency
        await request.delete(`${baseURL}/deleteAccount`, { form: { email, password } });
    });

    test('GET /by user email', async ({ request }) => {
        const email = generateUserCredentials().email;
        const password = generateUserCredentials().password;
        const newUser = generateUser(email, password);

        // Create a new user
        await request.post(`${baseURL}/createAccount`, { form: newUser });

        // Get user details by email
        // const response = await request.get(`${baseURL}/getUserDetailByEmail?email=${encodeURIComponent(email)}`);
        const response = await request.get(`${baseURL}/getUserDetailByEmail`, { params: { email } });
        const responseJson = await response.json();

        expect(response.status()).toBe(200);
        expect(responseJson.user.email).toBe(email);
        expect(responseJson.user.name).toBe(newUser.name);
        validateUserSchema(responseJson.user);
        validateWithAJVUserSchema(responseJson.user);

        // Delete the created user to maintain test idempotency
        await request.delete(`${baseURL}/deleteAccount`, { form: { email, password } });
    })

    test('GET /by user with invalid email', async ({ request }) => {

        const response = await request.get(`${baseURL}/getUserDetailByEmail`, { params: { email: "invalidEmail" } });
        const responseJson = await response.json();

        expect(response.status()).toBe(200);
        expect(responseJson.responseCode).toBe(404);
        expect(responseJson.message).toBe('Account not found with this email, try another email!');
    })

    listOfInvalidOrMissingCredentials.forEach((credentials, index) => {
        test(`attempt to delete using invalid credentials returns error #${index}`, async ({ request }) => {
            const response = await request.delete(`${baseURL}/deleteAccount`, { form: credentials });
            expect(response.status()).toBe(200);
            const result = await response.json();
            expect(result.responseCode).toBe(404);
            expect(result.message).toBe("Account not found!");
        })
    })
});


function validateProductSchema(product: Product) {
    const productSchema = {
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(String),
        brand: expect.any(String),
        category: {
            usertype: {
                usertype: expect.any(String)
            },
            category: expect.any(String)
        }
    };
    expect(product).toMatchObject(productSchema);
}

function validateBrandSchema(brand: Brand) {
    const brandSchema = {
        id: expect.any(Number),
        brand: expect.any(String)
    }
    expect(brand).toMatchObject(brandSchema);
}

function validateUserSchema(user: User) {
    const userSchema = {
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        address1: expect.any(String),
        address2: expect.any(String),
        country: expect.any(String),
        state: expect.any(String),
        city: expect.any(String),
        zipcode: expect.any(String)
    }
    expect(user).toMatchObject(userSchema);
}

function validateWithAjvProductSchema(data: Product) {
    const validate = ajv.compile(productSchema);
    const valid = validate(data);
    expect(valid).toBeTruthy();
}

function validateWithAjvBrandSchema(data: Brand) {
    const validate = ajv.compile(brandSchema);
    const valid = validate(data);
    expect(valid).toBeTruthy();
}

function validateWithAJVUserSchema(user: User) {
    const validate = ajv.compile(userSchema);
    const valid = validate(user);
    expect(valid).toBeTruthy();
}

function contractValidation(data: Brand | Product | User, schema: any) {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        console.log(validate.errors);
    }
    expect(valid).toBeTruthy();
}