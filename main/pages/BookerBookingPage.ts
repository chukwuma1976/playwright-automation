import { Page, expect, Locator } from "@playwright/test";

export class BookerBookingPage {
    features: Locator;
    reserveNowBtn: Locator;
    cancelBtn: Locator;
    firstnameInput: Locator;
    lastnameInput: Locator;
    emailInput: Locator;
    phoneInput: Locator;

    constructor(private page: Page) {
        this.page = page;
        this.features = page.locator("div.mb-4 div").filter({ has: page.getByText("Room Features") });
        this.reserveNowBtn = page.getByRole("button", { name: "Reserve Now" });
        this.cancelBtn = page.getByRole("button", { name: "Cancel" });
        this.firstnameInput = page.getByPlaceholder("Firstname");
        this.lastnameInput = page.getByPlaceholder("Lastname");
        this.emailInput = page.getByPlaceholder("Email");
        this.phoneInput = page.getByPlaceholder("Phone");
    }

    async verifyOnBookingPage() {
        expect(this.page.url()).toContain("/reservation")
    }

    async verifyImage(imageLink: string) {
        const image = this.page.locator(`img[src="${imageLink}"]`);
        await expect(image).toBeVisible();
    }

    async verifyAmenities(amenities: string[]) {
        const amenitiesText = await this.features.textContent();
        const allAmenitiesPresent = amenities.every(item => amenitiesText?.includes(item));
        expect(allAmenitiesPresent).toBeTruthy();
    }

    async confirmDetails(...args: string[]) {
        for (let item of args) {
            const detail = this.page.getByText(item).first();
            await detail.isVisible();
            await expect(detail).toBeVisible();
        }
    }

    async completeBookingForm(firstName: string, lastName: string, email: string, phone: string) {
        await this.firstnameInput.fill(firstName);
        await this.lastnameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.phoneInput.fill(phone);
        await this.reserveNowBtn.click();
    }

}