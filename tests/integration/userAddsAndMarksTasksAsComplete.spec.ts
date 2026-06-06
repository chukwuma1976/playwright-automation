import test, { APIRequest, APIRequestContext, expect } from "@playwright/test";
import { generateFullURL, practiceTestingApi, practiceTestingUi } from "../../main/configuratons/config";
import { testUser2 } from "../../main/utilities/UserCredentialsGenerator";
import { generateTaskToAdd } from "../../main/utilities/testDataGenerator";
import { PracticeLandingPage } from "../../main/pages/PracticeLandingPage";
import { PracticeLoginPage } from "../../main/pages/PracticeLoginPage";

test.describe("User adding and completing tasks", () => {

    const loginURL: string = generateFullURL(practiceTestingApi, "users/login");
    const notesUrl = generateFullURL(practiceTestingApi, "notes");

    let token: string;
    let task: { [key: string]: string };
    let taskId: string;

    test("User adds and marks task as complete through API and verifies it in UI", async ({ page, request }) => {
        //Login user through API
        token = await loginAndRetrieveToken(request, testUser2);

        //Add task using token
        task = generateTaskToAdd();
        const response = await request.post(notesUrl, { form: task, headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        taskId = result.data.id;
        expect(taskId).toBeTruthy();

        // Navigate to landing page
        const practiceLandingPage = new PracticeLandingPage(page);
        await practiceLandingPage.navigateToLandingPage();

        await page.evaluate((token: string) => {
            localStorage.setItem("token", token);
        }, token);

        // Verify presence of added task
        await practiceLandingPage.navigateToLandingPage();
        await new PracticeLoginPage(page).verifyUserOnLandingPage();

        await practiceLandingPage.clickAllTab();
        await practiceLandingPage.verifyNoteIsDisplayed(task.title);

        // Edit task by updating completed status to true and updating all fields except id
        const completeTaskPayload: any = { completed: true };
        await completeTaskWithAPI(request, completeTaskPayload);

        // Verify task is completed
        await page.reload();
        await practiceLandingPage.clickAllTab();
        await practiceLandingPage.verifyAllTasksCompleted();
    })

    test.afterEach("Cleanup by deleting all tasks", async ({ request }) => {
        await deleteAllTasks(request);
    })

    async function loginAndRetrieveToken(request: APIRequestContext, credentials: { [key: string]: string }): Promise<string> {
        const response = await request.post(loginURL, { form: credentials });
        const result = await response.json();
        return result.data.token;
    }

    async function completeTaskWithAPI(request: APIRequestContext, payload: any): Promise<void> {
        const editNotesUrl = generateFullURL(practiceTestingApi, `notes/${taskId}`)
        const response = await request.patch(editNotesUrl, { form: payload, headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
    }

    async function deleteAllTasks(request: APIRequestContext): Promise<void> {
        const response = await request.get(generateFullURL(practiceTestingApi, "notes"), { headers: { "x-auth-token": token } });
        const result = await response.json();
        const taskIds = result.data?.map((task: any) => task.id);
        for (let id of taskIds) {
            await request.delete(generateFullURL(practiceTestingApi, `notes/${id}`), { headers: { "x-auth-token": token } });
        }

    }

})