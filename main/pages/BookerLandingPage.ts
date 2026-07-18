import { expect, Locator, Page } from "@playwright/test";
import { generateFullURL, restfulBookerUiUrl } from "../configuratons/config";

export class BookerLandingPage {
    landingURL: string;
    bookNowBtn: Locator;
    checkAvailabilityBtn: Locator;
    roomsSection: Locator;
    bookRoomBtn: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.landingURL = generateFullURL(restfulBookerUiUrl, "#booking");
        this.bookNowBtn = page.locator("a[href='#booking']");
        this.checkAvailabilityBtn = page.getByRole("button", { name: "Check Availability" });
        this.roomsSection = page.locator("#rooms");
        this.bookRoomBtn = this.roomsSection.getByRole("link", { name: "Book Now" });
    }

    async navigateToLandingPage() {
        await this.page.goto(this.landingURL);
        await this.page.waitForURL("**/#booking");
    }

    async bookFirstRoom() {
        await this.bookNowBtn.click();
        await this.checkAvailabilityBtn.click();
        await this.bookRoomByIndex(0);
    }

    async bookRoomByIndex(index: number) {
        await expect(this.bookRoomBtn.nth(index)).toBeVisible();
        await this.bookRoomBtn.nth(index).click()
    }

    async verifyRoomIsPresent(description: string) {
        await expect(this.roomsSection.getByText(description)).toBeVisible();
    }

    async verifyRoomsAreAbsent() {
        const roomsText = await this.roomsSection.textContent();
        expect(roomsText?.trim()).toBe("Our RoomsComfortable beds and delightful breakfast from locally sourced ingredients");
    }

    async sendMessage(payload: { [key: string]: string }) {
        const { name, email, phone, subject, description } = payload;
        await this.page.getByLabel("name").fill(name);
        await this.page.getByLabel("email").fill(email);
        await this.page.getByLabel("phone").fill(phone);
        await this.page.getByLabel("subject").fill(subject);
        await this.page.getByTestId("ContactDescription").fill(description);
        await this.page.getByRole("button", { name: "Submit" }).click();
    }

    async verifyMessageSent(name: string) {
        const successMessage = this.page.getByText(`Thanks for getting in touch ${name}!`);
        await expect(successMessage).toBeVisible();
    }

    async verifyMessageIsWrongLength() {
        const messageTooShort = this.page.getByText("Message must be between 20 and 2000 characters.");
        await expect(messageTooShort).toBeVisible();
    }

}