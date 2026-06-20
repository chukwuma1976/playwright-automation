import test, { expect } from "@playwright/test"
import { generateFullURL, restfulBookerApiUrl } from "../../main/configuratons/config"
import { bookerAdminLoginPayload, bookingData, mockPremiumRoom } from "../../main/utilities/testDataGenerator"

test.describe("RestfulBookerApi", () => {

    test("get rooms", async ({ request }) => {
        const roomsURL = generateFullURL(restfulBookerApiUrl, "room")
        const response = await request.get(roomsURL);
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(Array.isArray(result.rooms)).toBeTruthy();
        expect(result.rooms.length).toBeGreaterThan(0);

    })


    test("get rooms available for check in", async ({ request }) => {
        const checkingURL = generateFullURL(restfulBookerApiUrl, "room");

        const date = new Date();
        const todaysDate = getDateString(date);
        date.setDate(date.getDate() + 1)
        const tomorrowsDate = getDateString(date);

        const params = { checkin: todaysDate, checkout: tomorrowsDate };

        const response = await request.get(checkingURL, { params });

        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(Array.isArray(result.rooms)).toBeTruthy();
    })

    test("get a specific room", async ({ request }) => {
        const roomsURL = generateFullURL(restfulBookerApiUrl, "room/1")
        const response = await request.get(roomsURL);
        expect(response.status()).toBe(200);

        const result = await response.json();
        const roomSchema = {
            accessible: expect.any(Boolean),
            description: expect.any(String),
            features: expect.any(Array),
            image: expect.any(String),
            roomName: expect.any(String),
            roomPrice: expect.any(Number),
            roomid: expect.any(Number),
            type: expect.any(String),
        }
        expect(result).toMatchObject(roomSchema);

    })

    test("adding a room requires authentication", async ({ request }) => {
        const roomsURL = generateFullURL(restfulBookerApiUrl, "room")
        const response = await request.post(roomsURL, { data: mockPremiumRoom });
        expect(response.status()).toBe(401);
        const result = await response.json();
        expect(result.errors).toContain("Authentication required");
    })

    test("Login generates a token", async ({ request }) => {
        const loginURL = generateFullURL(restfulBookerApiUrl, "/auth/login");
        const roomsURL = generateFullURL(restfulBookerApiUrl, "room")

        // Login and generate token
        const loginResponse = await request.post(loginURL, { data: bookerAdminLoginPayload });
        expect(loginResponse.status()).toBe(200);

        const loginResult = await loginResponse.json();
        expect(loginResult.token).toBeTruthy();

        const cookie = `token=${loginResult.token}`;

        // Use token as cookie to add a premium room
        const response = await request.post(roomsURL, { data: mockPremiumRoom, headers: { Cookie: cookie } });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.success).toBeTruthy();

        const retrieveResponse = await request.get(roomsURL);
        const allRooms = await retrieveResponse.json();
        const addedRooms = allRooms.rooms.filter((room: any) => room.description?.includes("top-floor penthouse"));
        const roomIds = addedRooms.map((room: any) => room.roomid);

        //delete added rooms
        for (let id of roomIds) {
            const res = await request.delete(generateFullURL(restfulBookerApiUrl, `room/${id}`), { headers: { Cookie: cookie } });
            expect(res.status()).toBe(202);
        }


    });

    test("Make a reservation", async ({ request }) => {
        const bookingURL = generateFullURL(restfulBookerApiUrl, "booking");

        const date = new Date();
        const todaysDate = getDateString(date);
        date.setDate(date.getDate() + 1)
        const tomorrowsDate = getDateString(date);

        const payload = bookingData;
        payload.bookingdates.checkin = todaysDate;
        payload.bookingdates.checkout = tomorrowsDate;

        const response = await request.post(bookingURL, { data: payload });
        const result = await response.json();
        expect(result).toBeTruthy();
        console.log(response.status());
        console.log(result);

    })

    test("Send a message between 20 and 2000 characters", async ({ request }) => {
        const bookingURL = generateFullURL(restfulBookerApiUrl, "message");

        const { firstname, lastname, email, phone } = bookingData;
        const name = `${firstname} ${lastname}`;
        const subject = "Test message between 20 and 2000 characters";
        const description = "I am sending a test message between 20 and 2000 characters long";

        const payload = { name, email, phone, subject, description }

        const response = await request.post(bookingURL, { data: payload });
        const result = await response.json();
        expect(response.status()).toBe(200);
        expect(result.success).toBeTruthy();
    })

    test("Send a message less than 20 characters and expect error", async ({ request }) => {
        const bookingURL = generateFullURL(restfulBookerApiUrl, "message");

        const { firstname, lastname, email, phone } = bookingData;
        const name = `${firstname} ${lastname}`;
        const subject = "Test under 20 characters";
        const description = "Too short";

        const payload = { name, email, phone, subject, description }

        const response = await request.post(bookingURL, { data: payload });
        const result = await response.json();

        expect(response.status()).toBe(400);
        expect(result).toContain("Message must be between 20 and 2000 characters.");
    })

    test("Send a message greater than 2000 characters and expect error", async ({ request }) => {
        const bookingURL = generateFullURL(restfulBookerApiUrl, "message");
        const fileUrl = "https://www.gutenberg.org/files/5/5-0.txt";
        const fileResp = await request.get(fileUrl);
        const verylongDescription = await fileResp.text();
        const charCount = verylongDescription.split("").length; //The actual length is over 28,000 characters
        expect(charCount).toBeGreaterThan(2000);


        const { firstname, lastname, email, phone } = bookingData;
        const name = `${firstname} ${lastname}`;
        const subject = "Test message over 2000 characters";
        const description = verylongDescription;

        const payload = { name, email, phone, subject, description }

        const response = await request.post(bookingURL, { data: payload });
        const result = await response.json();

        expect(response.status()).toBe(400);
        expect(result).toContain("Message must be between 20 and 2000 characters.");
    })

    function getDateString(date: Date) {
        const day = (date.getDate().toString().padStart(2, "0"));
        const year = (date.getFullYear());
        const month = ((date.getMonth() + 1).toString().padStart(2, "0"));

        return `${year}-${month}-${day}`
    }
})
