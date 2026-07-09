import test, { expect } from "@playwright/test"
import { PracticeLoginPage } from "../../main/pages/PracticeLoginPage";
import { generateFullURL, practiceTestingUi } from "../../main/configuratons/config";
import { testUser, testUser1, testUser2, testUser3 } from "../../main/utilities/UserCredentialsGenerator";
import { PracticeLandingPage } from "../../main/pages/PracticeLandingPage";

test.describe("Mock API", () => {

    const notesUIUrl = generateFullURL(practiceTestingUi, "notes/app/login")
    const notesLandingPageURl = generateFullURL(practiceTestingUi, "notes");

    test("User login with mock api call", async ({ page }) => {

        // Mock login to generate fake token from login API
        await page.route("**/users/login", async route => {

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    success: true,
                    status: 200,
                    message: "Login successful",
                    data: {
                        id: "64189a74314e9f0218a5213c",
                        email: "mock@email.com",
                        name: "mockingpractice",
                        token: "fake-token",
                    }
                })
            });

        });

        // Mock return of a note from notes API
        await page.route("**/notes/api/notes", async route => {

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    success: true,
                    status: 200,
                    message: "Notes successfully retrieved",
                    data: [
                        {
                            id: "642a09c16a35ca02115ea354",
                            title: "Work note title",
                            description: "Work note description",
                            category: "Work",
                            completed: false,
                            created_at: "2023-04-02T23:03:29.259Z",
                            updated_at: "2023-04-03T08:11:41.518Z",
                            user_id: "64189a74314e9f0218a5213c"
                        }
                    ]
                })
            });

        });

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser("mock@email.com", "mockpassword");

        await page.goto(notesLandingPageURl);
        await page.evaluate(() => {
            localStorage.setItem("token", "fake-token");
        })
        await page.goto(notesLandingPageURl);

    })

    test("Login with mock note creation", async ({ page }) => {

        // Mock return of notes from notes API
        await page.route("**/notes/api/notes", async route => {

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    success: true,
                    status: 200,
                    message: "Notes successfully retrieved",
                    data: [
                        {
                            id: "642a09c16a35ca02115ea354",
                            title: "Work note title",
                            description: "Work note description",
                            category: "Work",
                            completed: false,
                            created_at: "2023-04-02T23:03:29.259Z",
                            updated_at: "2023-04-03T08:11:41.518Z",
                            user_id: "64189a74314e9f0218a5213c"
                        },
                        {
                            id: "64298e2b6747aa02118d3c23",
                            title: "Home note title",
                            description: "Home note description",
                            category: "Home",
                            completed: true,
                            created_at: "2023-04-02T14:16:11.153Z",
                            updated_at: "2023-04-03T00:52:42.962Z",
                            user_id: "64189a74314e9f0218a5213c"
                        },
                        {
                            id: "642a08826a35ca02115ea350",
                            title: "Personal note title",
                            description: "Personal note description",
                            category: "Personal",
                            completed: false,
                            created_at: "2023-04-02T22:58:10.263Z",
                            updated_at: "2023-04-02T22:58:10.263Z",
                            user_id: "64189a74314e9f0218a5213c"
                        }
                    ]
                })
            });

        });

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser.email, testUser.password);

        const practiceLandingPage = new PracticeLandingPage(page);
        await practiceLandingPage.clickAllTab();
        await loginPage.verifyUserOnLandingPage();

        await practiceLandingPage.clickTab("Home");
        await practiceLandingPage.verifyNoteIsDisplayed("Home note description")

        await practiceLandingPage.clickTab("Work");
        await practiceLandingPage.verifyNoteIsDisplayed("Work note description")

        await practiceLandingPage.clickTab("Personal");
        await practiceLandingPage.verifyNoteIsDisplayed("Personal note description")

        await practiceLandingPage.gotoProfile();

    })

    test("Login with mock service error on landing page", async ({ page }) => {

        // 1. Determine what resource needs to be mocked: this endpoint **/notes/api/notes
        // 2. Network interception
        // 3. Provide predicatable data (stubbing)
        await page.route("**/notes/api/notes", async route => {

            await route.fulfill({
                status: 500,
                body: "Internal Server Error"
            });

        });

        // 4. Execute test
        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser1.email, testUser1.password);

        // 5. Verify behavior: In this case status code of 500 and still on landing page
        page.on("response", async response => {
            if (response.url().includes("notes/api/notes")) {
                console.log("Response url: ", response.url())
                expect(response.status()).toBe(500);
            };
        })

        const practiceLandingPage = new PracticeLandingPage(page);
        await practiceLandingPage.clickAllTab();
        await loginPage.verifyUserOnLandingPage();

    })

    test("Login and verify notes API response", async ({ page }) => {

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser.email, testUser.password);

        page.on("response", async response => {
            if (response.url().includes("notes/api/notes")) {
                expect(response.status()).toBe(200);
                const result = await response.json();
                expect(result.message).toBe("Notes successfully retrieved");
                expect(result.data).toBeTruthy();
            };
        })

        const practiceLandingPage = new PracticeLandingPage(page);
        await practiceLandingPage.clickAllTab();
        await loginPage.verifyUserOnLandingPage();


    })

    test("Login and verify profile API response", async ({ page }) => {

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser2.email, testUser2.password);

        const practiceLandingPage = new PracticeLandingPage(page);
        await practiceLandingPage.clickAllTab();
        await loginPage.verifyUserOnLandingPage();

        // Handle popup routes
        await page.route("**google**", route => route.abort());
        await page.route("**/encrypted**", route => route.abort());

        page.on("response", async response => {
            if (response.url().includes("/users/profile")) {
                console.log(response.url());
                expect(response.status()).toBe(200);
                const result = await response.json();
                console.log(result);
            };
        })
        await practiceLandingPage.navigateToLandingPage();
        await practiceLandingPage.gotoProfile();

    })

    test("Login and mock return of empty data from notes API", async ({ page }) => {

        // Mock return of empty data
        await page.route("**/notes/api/notes", route => {
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    success: true,
                    status: 200,
                    message: "Notes successfully retrieved",
                    data: []
                })
            });
        });

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser.email, testUser.password);

        const practiceLandingPage = new PracticeLandingPage(page);
        await practiceLandingPage.clickAllTab();
        await loginPage.verifyUserOnLandingPage();
        await practiceLandingPage.verifyNoNotesAreDisplayed();
    })

    test("Login and 401 unauthorized from notes API", async ({ page }) => {

        // Mock unauthorized login
        await page.route("**/users/login", route => {

            route.fulfill({
                status: 401,
                body: JSON.stringify({
                    success: false,
                    status: 401,
                    message: "Unauthorized Request"
                })
            });
        });

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser2.email, testUser2.password);

        await loginPage.verifyUserStillOnLoginPage();
        await loginPage.verifyUnauthorizedAccess();
    })

    test("Login and 403 forbidden from notes API", async ({ page }) => {

        // Mock forbidden login
        await page.route("**/users/login", route => {

            route.fulfill({
                status: 403,
                body: JSON.stringify({
                    success: false,
                    status: 403,
                    message: "Forbidden"
                })
            });
        });

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser2.email, testUser2.password);

        await loginPage.verifyUserStillOnLoginPage();
        await loginPage.verifyForbiddenAccess();
    })

    test("Login and simulate network delay", async ({ page }) => {

        // Mock network delay
        await page.route("**/notes/api/notes", async route => {
            await page.waitForTimeout(8000);
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    success: true,
                    status: 200,
                    message: "Notes successfully retrieved",
                    data: []
                })
            });
        });

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser.email, testUser.password);

        const practiceLandingPage = new PracticeLandingPage(page);
        await practiceLandingPage.verifySpinnerIsPresent();
        await practiceLandingPage.clickAllTab();
    })

    test("Login and mock response modification", async ({ page }) => {

        // Modify response data
        await page.route("**/notes/api/notes", async route => {

            const response = await route.fetch();
            const results = await response.json();
            results.data[0].title = "Mock Modification of Response"
            results.data[0].description = "Mock Modification of Response"

            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(results)
            });
        });

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser3.email, testUser3.password);

        const practiceLandingPage = new PracticeLandingPage(page);
        await practiceLandingPage.verifyNoteIsDisplayed("Mock Modification of Response");
    })

    test("Login and modify outgoing request by adding header", async ({ page }) => {

        // Add header to outgoing request
        await page.route("**/notes/api/notes", async route => {

            const request = route.request();
            const headers = { ...request.headers(), "custom-header": "modified-header" }

            await route.continue({ headers });
        });

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser3.email, testUser3.password);
    })

    test("Login and mock aborted route", async ({ page }) => {

        // Abort route
        await page.route("**/notes/api/notes", async route => route.abort());

        await page.goto(notesUIUrl);
        const loginPage = new PracticeLoginPage(page);
        await loginPage.loginUser(testUser3.email, testUser3.password);

    })

    test("Login and mock authorizations based on user information", async ({ page }) => {

        // Abort route
        await page.route("**/users/login", async route => {
            const request = route.request();
            const payload = request.postDataJSON();

            if (payload.email === "automation@tester.com") {
                await route.continue();
            } else {
                await route.fulfill({
                    status: 403,
                    body: JSON.stringify({
                        success: false,
                        status: 403,
                        message: "Forbidden"
                    })
                });
            }
        });

        const loginPage = new PracticeLoginPage(page);
        const practiceLandingPage = new PracticeLandingPage(page);

        //Login with authorized credential
        await page.goto(notesUIUrl);
        await loginPage.loginUser(testUser.email, testUser.password);

        await practiceLandingPage.clickAllTab();
        await loginPage.verifyUserOnLandingPage();
        await practiceLandingPage.logout();

        //Login with unauthorized credential
        await loginPage.navigateToLoginPage();
        await loginPage.loginUser(testUser3.email, testUser3.password);
        await loginPage.verifyUserStillOnLoginPage();
        await loginPage.verifyForbiddenAccess();
    })

})