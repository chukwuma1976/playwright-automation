import { expect, test } from '@playwright/test'
import { BookerLandingPage } from '../../main/pages/BookerLandingPage'
import { bookingData, mockBookingApiResponse, mockRoomsApiResponse } from '../../main/utilities/testDataGenerator';
import { BookerBookingPage } from '../../main/pages/BookerBookingPage';
import { generateFullURL, restfulBookerUiUrl } from '../../main/configuratons/config';

test.describe('Restful booker UI tests', () => {
    let landingPage: BookerLandingPage;

    test.beforeEach(async ({ page }) => {
        landingPage = new BookerLandingPage(page);
    })

    test('Landing page functionality with api interception', async ({ page }) => {
        //Use route interception to render UI with our mock room data
        await page.route("**/api/room", async route => {
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(mockRoomsApiResponse)
            })
        })
        await landingPage.navigateToLandingPage();

        //Verify that rooms with mock data are present
        for (let room of mockRoomsApiResponse.rooms) {
            await landingPage.verifyRoomIsPresent(room.description);
        }

    })

    test('Landing page with no rooms available with api interception', async ({ page }) => {
        //Use route interception to render UI with our mock room data
        await page.route("**/api/room", async route => {
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ rooms: [] })
            })
        })
        await landingPage.navigateToLandingPage();
        await landingPage.verifyRoomsAreAbsent();

    })

    test('Booking page functionality with api interception', async ({ page }) => {
        const roomToBook = mockRoomsApiResponse.rooms[0];
        //Use route interception to render UI with our mock room data
        await page.route("**/api/room", async route => {
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ rooms: [roomToBook] })
            })
        })

        await page.route("**/api/room/1", async route => {
            route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(roomToBook)
            })
        })

        await page.route("**/api/booking", async route => {
            route.fulfill({
                status: 201,
                contentType: "application/json",
                body: JSON.stringify(mockBookingApiResponse)
            })
        })

        await landingPage.navigateToLandingPage();
        await landingPage.bookFirstRoom();

        const bookingPage = new BookerBookingPage(page);
        await bookingPage.verifyOnBookingPage();
        await bookingPage.verifyImage(roomToBook.image);
        await bookingPage.verifyAmenities(roomToBook.features);

        const { description, roomPrice, type, accessible } = roomToBook;
        await bookingPage.confirmDetails(description, type, roomPrice.toString(), (accessible ? "Accessible" : ""));
        await bookingPage.reserveNowBtn.click();

        const { firstname, lastname, email, phone } = bookingData;
        await bookingPage.completeBookingForm(firstname, lastname, email, phone);
    })

    test('Send a message between 20 and 2000', async ({ page }) => {
        const { firstname, lastname, email, phone } = bookingData;
        const name = `${firstname} ${lastname}`;
        const subject = "Test message between 20 and 2000 characters";
        const description = "I am sending a test message between 20 and 2000 characters long";
        const payload = { name, email, phone, subject, description }

        page.on("response", async response => {
            if (response.url().includes("/api/message")) {
                expect(response.status()).toBe(200);
                const result = await response.json();
                expect(result.success).toBeTruthy();
            }
        })

        await landingPage.navigateToLandingPage();
        await landingPage.sendMessage(payload);
        await landingPage.verifyMessageSent(name);

    })

    test('Send a message that is under 20 characters', async ({ page }) => {
        const { firstname, lastname, email, phone } = bookingData;
        const name = `${firstname} ${lastname}`;
        const subject = "Test message between 20 and 2000 characters";
        const description = "Message too short";
        const payload = { name, email, phone, subject, description }

        page.on("response", async response => {
            if (response.url().includes("/api/message")) {
                expect(response.status()).toBe(400);
                const result = await response.json();
                expect(result).toContain("Message must be between 20 and 2000 characters.");
            }
        })

        await landingPage.navigateToLandingPage();
        await landingPage.sendMessage(payload);
        await landingPage.verifyMessageIsWrongLength();

    })

    test('Send a message that is over 2000 characters', async ({ page, request }) => {
        const fileUrl = "https://www.gutenberg.org/files/5/5-0.txt";
        const fileResp = await request.get(fileUrl);
        const verylongDescription = await fileResp.text();
        const charCount = verylongDescription.split("").length; //The actual length is over 28,000 characters
        expect(charCount).toBeGreaterThan(2000);

        const { firstname, lastname, email, phone } = bookingData;
        const name = `${firstname} ${lastname}`;
        const subject = "Test message between 20 and 2000 characters";
        const description = verylongDescription;
        const payload = { name, email, phone, subject, description }

        page.on("response", async response => {
            if (response.url().includes("/api/message")) {
                expect(response.status()).toBe(400);
                const result = await response.json();
                expect(result).toContain("Message must be between 20 and 2000 characters.");
            }
        })

        await landingPage.navigateToLandingPage();
        await landingPage.sendMessage(payload);
        await landingPage.verifyMessageIsWrongLength();

    })

    test('Admin login', async ({ page }) => {
        const url = generateFullURL(restfulBookerUiUrl, "admin/rooms");
        let cookie: string;

        page.on("request", async request => {
            if (request.url().includes("online/admin/rooms")) {
                const header = (await request.allHeaders());
                cookie = header.cookie;
            }
        })

        await page.goto(url);
        await page.getByPlaceholder("Enter Username").fill("admin");
        await page.getByPlaceholder("Password").fill("password");
        await page.getByRole("button", { name: "Login" }).click();
        await page.waitForTimeout(10000);
        await page.getByRole("button", { name: "Logout" }).click();

    })

})