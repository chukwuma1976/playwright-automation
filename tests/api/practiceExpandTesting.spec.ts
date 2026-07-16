import test, { APIRequestContext, expect } from "@playwright/test";
import { generateFullURL, practiceTestingApi } from "../../main/configuratons/config";
import { generateUserToRegister, testUser, testUser1, testUser4 } from "../../main/utilities/UserCredentialsGenerator";

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

    const { email, password } = testUser1;
    const invalidInputs = [
        { email: "invalidemail", password, description: "invalid email and valid password" },
        { email, password: "invalidpassword", description: "valid email and invalid password" },
        { email: "invalidemail", password: "invalidpassword", description: "invalid email and invalid password" },
        { email: "", password, description: "blank email and valid password" },
        { email, password: "", description: "valid email and blank password" },
        { email: "", password: "", description: "blank email and blank password" }
    ];

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

    test("Register user with username under 4 characters returns 400 response", async ({ request }) => {
        const user = generateUserToRegister();
        const registrationPayload = {
            name: "nm",
            email: user.email,
            password: user.password
        };

        const response = await request.post(registerUserUrl, { form: registrationPayload });
        expect(response.status()).toBe(400);

        const result = await response.json();
        expect(result.success).toBeFalsy();
        expect(result.message).toBe('User name must be between 4 and 30 characters');
    });

    test("Register user with username over 30 characters returns 400 response", async ({ request }) => {
        const user = generateUserToRegister();
        const registrationPayload = {
            name: "ThisusernametobetestedinthisAPItestiswaaaaytoooooooloooooog",
            email: user.email,
            password: user.password
        };

        const response = await request.post(registerUserUrl, { form: registrationPayload });
        expect(response.status()).toBe(400);

        const result = await response.json();
        expect(result.success).toBeFalsy();
        expect(result.message).toBe('User name must be between 4 and 30 characters');
    });

    test("Register user with password under 4 characters returns 400 response", async ({ request }) => {
        const user = generateUserToRegister();
        const registrationPayload = {
            name: user.name,
            email: user.email,
            password: "pw"
        };

        const response = await request.post(registerUserUrl, { form: registrationPayload });
        expect(response.status()).toBe(400);

        const result = await response.json();
        expect(result.success).toBeFalsy();
        expect(result.message).toBe("Password must be between 6 and 30 characters");
    });

    test("Register user with password over 30 characters returns 400 response", async ({ request }) => {
        const user = generateUserToRegister();
        const registrationPayload = {
            name: user.name,
            email: user.email,
            password: "ThispasswordtobetestedinthisAPItestiswaaaaytoooooooloooooog"
        };

        const response = await request.post(registerUserUrl, { form: registrationPayload });
        expect(response.status()).toBe(400);

        const result = await response.json();
        expect(result.success).toBeFalsy();
        expect(result.message).toBe("Password must be between 6 and 30 characters");
    });

    test("Register user with invalid email returns 400 response", async ({ request }) => {
        const user = generateUserToRegister();
        const registrationPayload = {
            name: user.name,
            email: "invalidemail",
            password: user.password
        };

        const response = await request.post(registerUserUrl, { form: registrationPayload });
        expect(response.status()).toBe(400);

        const result = await response.json();
        expect(result.success).toBeFalsy();
        expect(result.message).toBe("A valid email address is required");
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

    invalidInputs.forEach(({ email, password, description }) => {
        test(`Invalid login inputs with ${description}`, async ({ request }) => {
            const response = await request.post(loginURL, { form: { email, password } });

            expect(response.status()).not.toBe(200);
            const result = await response.json();
            expect(result.success).toBeFalsy();
            expect(result.message).not.toBe("Login successful")
        })
    });

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

    test("Valid email used for forgot password link", async ({ request }) => {
        const forgotPasswordURL = generateFullURL(practiceTestingApi, "users/forgot-password");
        const response = await request.post(forgotPasswordURL, { form: { email: payload.email } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.message).toContain(`Password reset link successfully sent to ${payload.email}`);
    })

    test("invalid email used for forgot password link", async ({ request }) => {
        const forgotPasswordURL = generateFullURL(practiceTestingApi, "users/forgot-password");
        const response = await request.post(forgotPasswordURL, { form: { email: "invalidEmail" } });
        expect(response.status()).toBe(400);
        const result = await response.json();
        expect(result.message).toContain("A valid email address is required");
    })

    test("Login user and get notes", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);
        const response = await request.get(notesUrl, { headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(Array.isArray(result.data)).toBe(true);
    });

    test("Retrieve a single note with valid id", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);
        const id = await getNoteId(request, token);
        const response = await request.get(`${notesUrl}/${id}`, { headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.data.id).toBe(id);
        validateNoteSchema(result);
    })

    test("Retrieve a single note with an invalid id", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);
        const response = await request.get(`${notesUrl}/invalidNoteId`, { headers: { "x-auth-token": token } });
        expect(response.status()).toBe(400);
        const result = await response.json();
        expect(result.success).toBeFalsy();
        expect(result.message).toBe("Note ID must be a valid ID");
    })

    test("Add a new note then update completion status and delete", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);
        const newNote = {
            title: "Test note",
            description: "This is a new note for testing",
            category: "Work"
        }

        //Add note
        const response = await request.post(notesUrl, { form: newNote, headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        validateNoteSchema(result);

        //update completed status
        const id = result.data.id;
        const updatedResponse = await request.patch(`${notesUrl}/${id}`, { form: { completed: true }, headers: { "x-auth-token": token } });
        expect(updatedResponse.status()).toBe(200);
        const completedNote = await updatedResponse.json();
        expect(completedNote.data.completed).toBeTruthy();

        //delete note
        await deleteNote(request, id, token);
    })

    test("Add a new note with missing title field", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);
        const newNote = {
            title: "",
            description: "This note is really messed up",
            category: "Work"
        }

        //Add note
        const response = await request.post(notesUrl, { form: newNote, headers: { "x-auth-token": token } });
        expect(response.status()).toBe(400);
        const result = await response.json();
        expect(result.success).toBeFalsy();
        expect(result.message).toBe("Title must be between 4 and 100 characters");
    })

    test("Add a new note with missing description field", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);
        const newNote = {
            title: "This note is really messed up",
            description: "",
            category: "Work"
        }

        //Add note
        const response = await request.post(notesUrl, { form: newNote, headers: { "x-auth-token": token } });
        expect(response.status()).toBe(400);
        const result = await response.json();
        expect(result.success).toBeFalsy();
        expect(result.message).toBe("Description must be between 4 and 1000 characters");
    })

    test("Add a new note with invalid category field", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);
        const newNote = {
            title: "This note is really messed up",
            description: "This note is really messed up",
            category: "Invalid"
        }

        //Add note
        const response = await request.post(notesUrl, { form: newNote, headers: { "x-auth-token": token } });
        expect(response.status()).toBe(400);
        const result = await response.json();
        expect(result.success).toBeFalsy();
        expect(result.message).toBe("Category must be one of the categories: Home, Work, Personal");
    })

    test("Add a new note then update entire note and delete", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);
        const newNote = {
            title: "Test note",
            description: "This is a new note for testing",
            category: "Work"
        }

        //Add note
        const response = await request.post(notesUrl, { form: newNote, headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        validateNoteSchema(result);

        //update with entire payload completed status
        const id = result.data.id;
        const updatedNote = { ...newNote, completed: true }
        const updatedResponse = await request.put(`${notesUrl}/${id}`, { form: updatedNote, headers: { "x-auth-token": token } });
        expect(updatedResponse.status()).toBe(200);
        const completedNote = await updatedResponse.json();
        expect(completedNote.data.completed).toBeTruthy();

        //delete note
        await deleteNote(request, id, token);
    })

    test("Add a new note then update entire note with missing fields and delete", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);
        const newNote = {
            title: "Test note",
            description: "This is a new note for testing",
            category: "Work"
        }

        //Add note
        const response = await request.post(notesUrl, { form: newNote, headers: { "x-auth-token": token } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        validateNoteSchema(result);

        const id = result.data.id;

        //Update with missing completion status
        const updatedNote = { ...newNote }
        const updatedResponse = await request.put(`${notesUrl}/${id}`, { form: updatedNote, headers: { "x-auth-token": token } });
        expect(updatedResponse.status()).toBe(400);
        const completionErrorObject = await updatedResponse.json();
        expect(completionErrorObject.message).toBe("Note completed status must be boolean");

        //Update with missing title:
        const missingTitleNote = { ...newNote, title: "", completed: true };
        const missingTitleResponse = await request.put(`${notesUrl}/${id}`, { form: missingTitleNote, headers: { "x-auth-token": token } });
        expect(missingTitleResponse.status()).toBe(400);
        const missingTitle = await missingTitleResponse.json();
        expect(missingTitle.message).toBe("Title must be between 4 and 100 characters");

        //Update with issing description
        const missingDescNote = { ...newNote, description: "", completed: true };
        const missingDescResponse = await request.put(`${notesUrl}/${id}`, { form: missingDescNote, headers: { "x-auth-token": token } });
        expect(missingDescResponse.status()).toBe(400);
        const missingDescription = await missingDescResponse.json();
        expect(missingDescription.message).toBe("Description must be between 4 and 1000 characters");

        //Update with invalid category
        const invalidCategoryNote = { ...newNote, category: "Invalid", completed: true };
        const invalidCategoryResponse = await request.put(`${notesUrl}/${id}`, { form: invalidCategoryNote, headers: { "x-auth-token": token } });
        expect(invalidCategoryResponse.status()).toBe(400);
        const invalidCategory = await invalidCategoryResponse.json();
        expect(invalidCategory.message).toBe("Category must be one of the categories: Home, Work, Personal");

        //delete note
        await deleteNote(request, id, token);
    })

    test("Delete with invalid id", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);

        const deletedResponse = await request.delete(`${notesUrl}/InvalidNoteId`, { headers: { "x-auth-token": token } });
        expect(deletedResponse.status()).toBe(400);
        const deletedResult = await deletedResponse.json();
        expect(deletedResult.message).toBe("Note ID must be a valid ID");
    })

    test("Delete with missing id", async ({ request }) => {
        const token = await loginAndRetrieveToken(request, testUser4);

        const deletedResponse = await request.delete(notesUrl, { headers: { "x-auth-token": token } });
        expect(deletedResponse.status()).toBe(404);
        expect(deletedResponse.statusText()).toBe("Not Found");
    })

    async function loginAndRetrieveToken(request: APIRequestContext, credentials: any = payload): Promise<string> {
        const response = await request.post(loginURL, { form: credentials });
        const result = await response.json();
        return result.data.token;
    }

    async function registerUser(request: APIRequestContext, payload: any = testUser): Promise<void> {
        await request.post(registerUserUrl, { form: payload });
    }

    async function getNoteId(request: APIRequestContext, token: string): Promise<string> {
        const response = await request.get(notesUrl, { headers: { "x-auth-token": token } });
        const result = await response.json();
        return result.data.map((note: any) => note.id)[0];
    }

    async function deleteNote(request: APIRequestContext, id: string, token: string) {
        const deletedResponse = await request.delete(`${notesUrl}/${id}`, { headers: { "x-auth-token": token } });
        expect(deletedResponse.status()).toBe(200);
        const deletedResult = await deletedResponse.json();
        expect(deletedResult.message).toBe("Note successfully deleted");
    }

    function validateNoteSchema(result: any) {
        expect(result).toMatchObject({
            success: expect.any(Boolean),
            status: expect.any(Number),
            message: expect.any(String),
            data: {
                id: expect.any(String),
                title: expect.any(String),
                description: expect.any(String),
                category: expect.any(String),
                completed: expect.any(Boolean),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                user_id: expect.any(String)
            }
        })
    }

})