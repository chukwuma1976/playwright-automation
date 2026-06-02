import test, { expect } from "@playwright/test";
import { generateFullURL, practiceTestingApi } from "../../main/configuratons/config";
import { generateUserToRegister, testUser } from "../../main/utilities/UserCredentialsGenerator";

test.describe("Authentication and authorization", () => {
    const loginURL = generateFullURL(practiceTestingApi, "users/login");
    const logoutURL = generateFullURL(practiceTestingApi, "users/logout");
    const registerUserUrl = generateFullURL(practiceTestingApi, "users/register");
    const deleteUserUrl = generateFullURL(practiceTestingApi, "users/delete-account");
    const notesUrl = generateFullURL(practiceTestingApi, "notes");

    const payload = {
        email: testUser.email,
        password: testUser.password
    }

    test.beforeEach(async ({ request }) => {
        await registerUser(request);
    });

    test("Health check", async ({ request }) => {
        const healthCheckUrl = generateFullURL(practiceTestingApi, "health-check");

        const start = Date.now();
        const response = await request.get(healthCheckUrl);
        const duration = Date.now() - start;

        expect(response.status()).toBe(200);
        expect(duration < 1000).toBe(true);

        const result = await response.json();
        expect(result.message).toBe('Notes API is Running');

        const headers = response.headers();
        expect(headers['content-type']).toContain("application/json");
    })

    test("Register user", async ({ request }) => {
        const user = generateUserToRegister();
        const registrationPayload = {
            name: user.name,
            email: user.email,
            password: user.password
        };

        const response = await request.post(registerUserUrl, { form: registrationPayload });
        expect(response.status()).toBe(201);

        const headers = response.headers();
        expect(headers['content-type']).toContain("application/json");

        const result = await response.json();
        expect(result.message).toBe("User account created successfully");
        expect(result.data.id).toBeTruthy();
        expect(result.data.name).toBe(user.name);
        expect(result.data.email).toBe(user.email);

        // Cleanup - delete the user after registration
        const token = await loginAndRetrieveToken(request);
        const deleteUserResponse = await request.delete(deleteUserUrl, { headers: { "x-auth-token": token } });
        expect(deleteUserResponse.status()).toBe(200);
    });

    test("Login user", async ({ request }) => {
        const response = await request.post(loginURL, { form: payload });
        expect(response.status()).toBe(200);

        const result = await response.json();
        expect(response.status).toBeTruthy();
        expect(result.message).toBe("Login successful")

        const token = result.data.token;
        expect(token).toBeTruthy(); //verify a token is generated

        // Retrieve user profile
        const profileURL = generateFullURL(practiceTestingApi, "users/profile");
        const usersProfile = await request.get(profileURL, { headers: { "x-auth-token": token } });

        expect(usersProfile.status()).toBe(200);
        const usersProfileResult = await usersProfile.json();
        expect(usersProfileResult.data.name).toBe(testUser.name);
        expect(usersProfileResult.data.email).toBe(testUser.email);

        // Logout user
        const logoutResponse = await request.delete(logoutURL, { headers: { "x-auth-token": token } });
        expect(logoutResponse.status()).toBe(200);

    })

    test("Login user and update profile", async ({ request }) => {
        const token = await loginAndRetrieveToken(request);

        //Randomly generate updated fields
        const phone = Date.now().toString().slice(-10);
        const company = `Company${Date.now()}`;

        const updatedPayload = { name: testUser.name, phone, company };

        const profileURL = generateFullURL(practiceTestingApi, "users/profile");
        const usersProfile = await request.patch(profileURL, { form: updatedPayload, headers: { "x-auth-token": token } });
        expect(usersProfile.status()).toBe(200);

        const usersProfileResult = await usersProfile.json();
        expect(usersProfileResult.data.phone).toBe(phone);
        expect(usersProfileResult.data.company).toBe(company);

    });

    test("Login user and update profile without token", async ({ request }) => {
        await request.post(loginURL, { form: payload });

        //Randomly generate updated fields
        const phone = Date.now().toString().slice(-10);
        const company = `Company${Date.now()}`;

        const updatedPayload = { name: testUser.name, phone, company };

        const profileURL = generateFullURL(practiceTestingApi, "users/profile");
        const usersProfile = await request.patch(profileURL, { form: updatedPayload });
        expect(usersProfile.status()).toBe(401);

    });

    test("Login user and update profile without username", async ({ request }) => {
        const token = await loginAndRetrieveToken(request);

        //Randomly generate updated fields
        const phone = Date.now().toString().slice(-10);
        const company = `Company${Date.now()}`;

        const profileURL = generateFullURL(practiceTestingApi, "users/profile");
        const usersProfile = await request.patch(profileURL, { form: { phone, company }, headers: { "x-auth-token": token } });
        expect(usersProfile.status()).toBe(400);

    });

    test("Login user and get notes", async ({ request }) => {
        const token = await loginAndRetrieveToken(request);
        const response = await request.get(notesUrl, { headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(Array.isArray(result.data)).toBe(true);
        console.log(result.data);

    });

    async function loginAndRetrieveToken(request: any): Promise<string> {
        const response = await request.post(loginURL, { form: payload });
        const result = await response.json();
        return result.data.token;
    }

    async function registerUser(request: any, payload: any = testUser): Promise<void> {
        await request.post(registerUserUrl, { form: payload });
    }

})