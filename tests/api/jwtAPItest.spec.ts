import test, { expect } from "@playwright/test"
import { dummyJsonAPI, generateFullURL } from "../../main/configuratons/config"
import { jwtUser } from "../../main/utilities/UserCredentialsGenerator";

test.describe("JWT Token", () => {

    const baseApiUrl = generateFullURL(dummyJsonAPI, "/auth/login");

    test("JWT Token test", async ({ request }) => {
        const response = await request.post(baseApiUrl, { headers: { 'Content-Type': 'application/json' }, data: jwtUser });
        expect(response.status()).toBe(200);
        const result = await response.json();

        const jwtToken = result.accessToken;
        expect(jwtToken).toBeTruthy();

        const [header, payload, signature] = jwtToken.split(".");
        const decodedHeader = JSON.parse(atob(header));
        const decodedPayload = JSON.parse(atob(payload));

        expect(decodedHeader.alg).toBe("HS256");
        expect(decodedHeader.typ).toBe("JWT");
        expect(decodedPayload.username).toBe(jwtUser.username);

        // JWT Token overview

        console.log("JWT (JSON Web Tokens) can be used for authentication, authorization, and information exchange.");
        console.log("JWTs consist of a header, payload, and signature separated by '.'");
        console.log("\nIt looks like this: ", jwtToken);

        console.log("\nheader: ", header);
        console.log("payload: ", payload);
        console.log("signature: ", signature);

        console.log("decoded header: ", decodedHeader);
        console.log("decoded payload: ", decodedPayload);

    })


    test("Get resource using JWT token", async ({ request }) => {
        // Login user and get token
        const response = await request.post(baseApiUrl, { headers: { 'Content-Type': 'application/json' }, data: jwtUser });
        expect(response.status()).toBe(200);
        const result = await response.json();

        const jwtToken = result.accessToken;
        expect(jwtToken).toBeTruthy();

        // Use token and get resources
        const resourceURL = generateFullURL(dummyJsonAPI, "auth/posts");
        const resourceResponse = await request.get(resourceURL, { headers: { "Authorization": `Bearer ${jwtToken}` } });
        expect(resourceResponse.status()).toBe(200);
        const resource = await resourceResponse.json();
        expect(Array.isArray(resource.posts)).toBeTruthy();

    })
})