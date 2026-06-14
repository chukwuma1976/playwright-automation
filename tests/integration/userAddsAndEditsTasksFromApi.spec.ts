import test, { APIRequestContext, expect } from "@playwright/test";
import { generateFullURL, practiceTestingApi, practiceTestingUi } from "../../main/configuratons/config";
import { testUser1 } from "../../main/utilities/UserCredentialsGenerator";
import { generateTaskToAdd } from "../../main/utilities/testDataGenerator";
import { PracticeLandingPage } from "../../main/pages/PracticeLandingPage";
import { PracticeLoginPage } from "../../main/pages/PracticeLoginPage";

test.describe("User adding tasks", () => {

    const loginURL: string = generateFullURL(practiceTestingApi, "users/login");
    const notesUrl = generateFullURL(practiceTestingApi, "notes");

    let token: string;
    let task: { [key: string]: string };
    let taskId: string;

    let practiceLandingPage: PracticeLandingPage;
    let updatedTask: any;

    test("User adds and edits task through API and verifies it in UI", async ({ page, request }) => {

        await test.step("Login user through API", async () => {
            token = await loginAndRetrieveToken(request, testUser1);
        })

        await test.step("Add task using token", async () => {
            task = generateTaskToAdd();
            const response = await request.post(notesUrl, { form: task, headers: { "x-auth-token": token } });
            expect(response.status()).toBe(200);
            const result = await response.json();
            taskId = result.data.id;
            expect(taskId).toBeTruthy();
        })

        await test.step(" Navigate to landing page", async () => {
            practiceLandingPage = new PracticeLandingPage(page);
            await practiceLandingPage.navigateToLandingPage();

            await page.evaluate((token: string) => {
                localStorage.setItem("token", token);
            }, token);
        })

        await test.step("Verify presence of added task", async () => {
            await practiceLandingPage.navigateToLandingPage();
            await new PracticeLoginPage(page).verifyUserOnLandingPage();

            await practiceLandingPage.clickTab(task.category);
            await practiceLandingPage.verifyNoteIsDisplayed(task.title);

            await practiceLandingPage.clickAllTab();
            await practiceLandingPage.verifyNoteIsDisplayed(task.title);
        })

        await test.step("Edit task by updating completed status to true and updating all fields except id", async () => {
            const update = generateTaskToAdd();
            updatedTask = { ...update, id: taskId, completed: true };
            await editTaskWithAPI(request, updatedTask);
        })

        await test.step("Verify task is updated", async () => {
            await page.reload();
            await practiceLandingPage.clickAllTab();
            await practiceLandingPage.verifyNoteIsDisplayed(updatedTask.title);
        })

        await test.step("Cleanup by deleting all tasks", async () => {
            await deleteAllTasks(request);
        })

    })

    async function loginAndRetrieveToken(request: APIRequestContext, credentials: { [key: string]: string }): Promise<string> {
        const response = await request.post(loginURL, { form: credentials });
        const result = await response.json();
        return result.data.token;
    }

    async function deleteTaskWithAPI(request: APIRequestContext): Promise<void> {
        const deleteNotesUrl = generateFullURL(practiceTestingApi, `notes/${taskId}`);
        const response = await request.delete(deleteNotesUrl, { headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
    }

    async function editTaskWithAPI(request: APIRequestContext, payload: any): Promise<void> {
        const editNotesUrl = generateFullURL(practiceTestingApi, `notes/${taskId}`)
        const response = await request.put(editNotesUrl, { form: payload, headers: { "x-auth-token": token } });
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