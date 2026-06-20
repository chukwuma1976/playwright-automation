import test, { APIRequestContext, expect } from "@playwright/test"
import { generateFullURL, restfulBookerApiUrl } from "../../main/configuratons/config";
import { bookerAdminLoginPayload, mockMinimalRoom, mockPremiumRoom, mockStandardRoom } from "../../main/utilities/testDataGenerator";
import { BookerLandingPage } from "../../main/pages/BookerLandingPage";

test.describe("Restful Booking Integration Test", () => {
    let cookie: string;
    let loginURL: string;
    let roomsURL: string;

    test.beforeAll("Login and generate token", async ({ request }) => {

        loginURL = generateFullURL(restfulBookerApiUrl, "/auth/login");
        roomsURL = generateFullURL(restfulBookerApiUrl, "room")

        // Login and generate token
        const loginResponse = await request.post(loginURL, { data: bookerAdminLoginPayload });
        expect(loginResponse.status()).toBe(200);

        const loginResult = await loginResponse.json();
        expect(loginResult.token).toBeTruthy();

        cookie = `token=${loginResult.token}`;
    })

    test("Login and add rooms and check that it is displayed in UI", async ({ page, request }) => {

        //Add rooms using token
        const roomsToAdd = [mockMinimalRoom, mockStandardRoom, mockPremiumRoom];
        for (let room of roomsToAdd) {
            const response = await request.post(roomsURL, { data: room, headers: { Cookie: cookie } });
            expect(response.status()).toBe(200);
            const result = await response.json();
            expect(result.success).toBeTruthy();
        }

        //Confirm added rooms are present using API
        const retrieveResponse = await request.get(roomsURL);
        expect(retrieveResponse.status()).toBe(200);
        const retrievedRooms = await retrieveResponse.json();

        const addedRooms = retrievedRooms.rooms.filter((room: any) => {
            return room.description?.includes(mockMinimalRoom.description) ||
                room.description?.includes(mockStandardRoom.description) ||
                room.description?.includes(mockPremiumRoom.description)
        });
        expect(addedRooms.length).toBe(3);

        //check rooms in UI
        await page.route("**api/room", async route =>
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ rooms: addedRooms })
            })
        )
        const landingPage = new BookerLandingPage(page);
        await landingPage.navigateToLandingPage();
        //Verify that rooms are present
        for (let room of roomsToAdd) {
            await landingPage.verifyRoomIsPresent(room.description);
        }

        await landingPage.bookFirstRoom();

    })

    test.afterEach("Cleanup, delete added rooms", async ({ request }) => {
        await deleteRooms(request);
    })

    async function deleteRooms(request: APIRequestContext) {
        //Confirm added rooms are present using API
        const retrieveResponse = await request.get(roomsURL);
        const retrievedRooms = await retrieveResponse.json();

        const addedRooms = retrievedRooms.rooms.filter((room: any) => {
            return room.description?.includes(mockMinimalRoom.description) ||
                room.description?.includes(mockStandardRoom.description) ||
                room.description?.includes(mockPremiumRoom.description)
        });
        const roomIds = addedRooms.map((room: any) => room.roomid);

        //delete added rooms
        for (let id of roomIds) {
            const res = await request.delete(generateFullURL(restfulBookerApiUrl, `room/${id}`), { headers: { Cookie: cookie } });
            expect(res.status()).toBe(202);
        }
    }

})