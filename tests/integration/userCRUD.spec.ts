import { test, expect } from '@playwright/test'
import { generateUserToRegister } from '../../main/utilities/UserCredentialsGenerator';
import { userSchema } from '../../main/schemas/userSchema';
import Ajv from 'ajv';

test.describe('User CRUD integration test', () => {
    const baseURL = 'https://automationexercise.com/api';
    const ajv = new Ajv();

    test('Register, access, edit, remove user', async ({ request }) => {

        const newUser = generateUserToRegister();

        //register user
        const postResponse = await request.post(`${baseURL}/createAccount`, { form: newUser });
        const postResponseJson = await postResponse.json();

        expect(postResponse.status()).toBe(200);
        expect(postResponseJson.responseCode).toBe(201);
        expect(postResponseJson.message).toBe('User created!');

        //access user
        const getResponse = await request.get(`${baseURL}/getUserDetailByEmail`, { params: { email: newUser.email } });
        const getResponseJson = await getResponse.json();
        expect(getResponse.status()).toBe(200);
        expect(getResponseJson.responseCode).toBe(200);
        const validate = ajv.compile(userSchema);
        const valid = validate(getResponseJson.user);
        expect(valid).toBeTruthy();

        //update user
        const updatedUser = { ...newUser, name: "updatedUser" };
        const putResponse = await request.put(`${baseURL}/updateAccount`, { form: updatedUser });
        const putResponseJson = await putResponse.json();

        expect(putResponse.status()).toBe(200);
        expect(putResponseJson.responseCode).toBe(200);
        expect(putResponseJson.message).toBe('User updated!');

        //access user again after update and check updated field
        const response = await request.get(`${baseURL}/getUserDetailByEmail`, { params: { email: updatedUser.email } });
        const responseJson = await response.json();
        expect(responseJson.user.name).toBe("updatedUser");

        //delete user
        const deleteParams = {
            email: updatedUser.email,
            password: updatedUser.password
        };
        const deleteResponse = await request.delete(`${baseURL}/deleteAccount`, { form: deleteParams });
        const deleteResponseJson = await deleteResponse.json();

        expect(deleteResponse.status()).toBe(200);
        expect(deleteResponseJson.responseCode).toBe(200);
        expect(deleteResponseJson.message).toBe('Account deleted!');

        // check that account is gone
        const newResponse = await request.get(`${baseURL}/getUserDetailByEmail`, { params: { email: updatedUser.email } });
        const newResponseJson = await newResponse.json();
        expect(newResponseJson.responseCode).toBe(404);
        expect(newResponseJson.message).toBe('Account not found with this email, try another email!');

    })

})