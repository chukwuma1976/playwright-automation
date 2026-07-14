import { expect, test } from "@playwright/test";
import { generateFullURL, petStoreAPI } from "../../main/configuratons/config";
import { petPayload } from "../../main/utilities/petApiData";
import fs from "fs";

test.describe('Pet Store API Tests', () => {

    test('Get available pets', async ({ request }) => {
        const response = await request.get(generateFullURL(petStoreAPI, "pet/findByStatus"), {
            params: {
                status: "available"
            }
        });
        expect(response.status()).toBe(200);
        expect(await response.json()).toBeInstanceOf(Array);
    });

    test('Add a new pet', async ({ request }) => {
        const response = await request.post(generateFullURL(petStoreAPI, "pet"), { data: petPayload });
        const result = await response.json();
        expect(response.status()).toBe(200);
        expect(result.category.name).toBe("Scooby Doo");
        expect(result.name).toBe("Great Dane");
        expect(result.status).toBe("available");
    });

    test('Edit an existing pet', async ({ request }) => {
        // First, add a new pet to ensure it exists
        await request.post(generateFullURL(petStoreAPI, "pet"), {
            data: petPayload
        });
        // Now, edit the pet's details
        const updatedPetPayload = { ...petPayload, name: "Snoopy", status: "sold" };
        const response = await request.put(generateFullURL(petStoreAPI, `pet`), { data: updatedPetPayload });
        const result = await response.json();
        expect(response.status()).toBe(200);
        expect(result.name).toBe("Snoopy");
        expect(result.status).toBe("sold");
    });

    test('Delete an existing pet', async ({ request }) => {
        // First, add a new pet to ensure it exists
        await request.post(generateFullURL(petStoreAPI, "pet"), {
            data: petPayload
        });
        // Now, delete the pet
        console.log(`Deleting pet with ID: ${petPayload.id}`);
        const response = await request.delete(generateFullURL(petStoreAPI, `pet${petPayload.id}`));
    });

    test('Add a image to pet', async ({ request }) => {

        const dogImageFile = {
            file: {
                name: "dog_image_for_upload.jpg",
                mimeType: "image/jpeg",
                buffer: fs.readFileSync("./main/resources/dog_image_for_upload.jpg")
            }
        }

        const response = await request
            .post(generateFullURL(petStoreAPI, `pet/${petPayload.id}/uploadImage`), { multipart: dogImageFile });
        const result = await response.json();
        expect(response.status()).toBe(200);
        expect(result.code).toBe(200);
        expect(result.message).toContain(dogImageFile.file.name);
    });

});