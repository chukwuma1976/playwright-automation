import test, { expect } from "@playwright/test";
import { generateFullURL, practiceTestingApi } from "../../main/configuratons/config";
import { generateUserToRegister } from "../../main/utilities/UserCredentialsGenerator";
import { PracticeLandingPage } from "../../main/pages/PracticeLandingPage";
import { PracticeLoginPage } from "../../main/pages/PracticeLoginPage";
import { generateTaskToAdd } from "../../main/utilities/testDataGenerator";

test.describe("User and Tasks API Tests", () => {
    const loginURL = generateFullURL(practiceTestingApi, "users/login");
    const registerUserUrl = generateFullURL(practiceTestingApi, "users/register");
    const deleteUserUrl = generateFullURL(practiceTestingApi, "users/delete-account");
    const notesUrl = generateFullURL(practiceTestingApi, "notes");

    test("Register user, add task, login", async ({ page, request }) => {

        // Register a new user
        const { name, email, password } = generateUserToRegister();
        const registrationPayload = { name, email, password };

        const response = await request.post(registerUserUrl, { form: registrationPayload });
        expect(response.status()).toBe(201);

        const result = await response.json();
        expect(result.message).toBe("User account created successfully");
        expect(result.data.id).toBeTruthy();
        expect(result.data.name).toBe(name);
        expect(result.data.email).toBe(email);

        // Login with the registered user
        const loginPayload = { email, password };
        const loginResponse = await request.post(loginURL, { form: loginPayload });
        expect(loginResponse.status()).toBe(200);
        const loginResult = await loginResponse.json();
        const token = loginResult.data.token;
        expect(token).toBeTruthy();

        // Add task using API
        const taskToBeAdded = generateTaskToAdd();
        const { title, category, description } = taskToBeAdded;
        const addTaskResponse = await request.post(notesUrl, { form: taskToBeAdded, headers: { "x-auth-token": token } });
        expect(addTaskResponse.status()).toBe(200);
        const addedTaskResult = await addTaskResponse.json();
        expect(addedTaskResult.data.title).toBe(title);
        expect(addedTaskResult.data.category).toBe(category);
        expect(addedTaskResult.data.description).toBe(description);
        const taskID = addedTaskResult.data.id;
        expect(taskID).toBeTruthy();

        // Navigate to landing page and verify user is logged in
        const practiceLandingPage = new PracticeLandingPage(page);
        await practiceLandingPage.navigateToLandingPage();

        await page.evaluate((token) => {
            localStorage.setItem("token", token);
        }, token);

        await practiceLandingPage.navigateToLandingPage();
        await new PracticeLoginPage(page).verifyUserOnLandingPage();

        await practiceLandingPage.clickAllTab();
        await practiceLandingPage.verifyNoteIsDisplayed(title);

        // Perform task navigation here
        await practiceLandingPage.clickTab("Home");
        await practiceLandingPage.clickTab("Work");
        await practiceLandingPage.clickTab("Personal");
        await practiceLandingPage.gotoProfile();

        // Delete the user account
        const deleteUserResponse = await request.delete(deleteUserUrl, { headers: { "x-auth-token": token } });
        expect(deleteUserResponse.status()).toBe(200);
    });

});