import test, { expect } from "@playwright/test";
import { generateFullURL, practiceTestingApi } from "../../main/configuratons/config";
import { testUser } from "../../main/utilities/UserCredentialsGenerator";
import { generateTaskToAdd } from "../../main/utilities/testDataGenerator";
import { PracticeLandingPage } from "../../main/pages/PracticeLandingPage";
import { PracticeLoginPage } from "../../main/pages/PracticeLoginPage";

test("Demo API and UI Integration Test", async ({ page, request }) => {
    const loginURL: string = generateFullURL(practiceTestingApi, "users/login");
    const notesUrl = generateFullURL(practiceTestingApi, "notes");
    let token: string;
    let practiceLandingPage: PracticeLandingPage;
    let task: any;
    let taskId: string;

    await test.step("Login user through API using testUser credentials and get token", async () => {
        const loginResponse = await request.post(loginURL, { form: testUser });
        const LoginResult = await loginResponse.json();
        token = LoginResult.data.token;

    })

    await test.step("Add task through API using token and obtain id of task for further api requests", async () => {
        task = generateTaskToAdd();
        const response = await request.post(notesUrl, { form: task, headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        taskId = result.data.id;
        expect(taskId).toBeTruthy();
    })

    await test.step("Navigate to landing page directly with web token and verify successful navigation", async () => {
        practiceLandingPage = new PracticeLandingPage(page);

        await practiceLandingPage.navigateToLandingPage();
        await page.evaluate((token: string) => {
            localStorage.setItem("token", token);
        }, token);
        await practiceLandingPage.navigateToLandingPage();
        await new PracticeLoginPage(page).verifyUserOnLandingPage();
    })

    await test.step("Verify presence of added task in UI", async () => {
        await practiceLandingPage.verifyNoteIsDisplayed(task.title);
    })

    await test.step("Cleanup by deleting task", async () => {
        const deleteNotesUrl = generateFullURL(practiceTestingApi, `notes/${taskId}`);
        const deleteResponse = await request.delete(deleteNotesUrl, { headers: { "x-auth-token": token } });
        expect(deleteResponse.status()).toBe(200);
    })

})
