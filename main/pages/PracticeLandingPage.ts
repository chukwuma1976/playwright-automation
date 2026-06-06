import { expect, Locator, Page } from "@playwright/test";
import { generateFullURL, practiceTestingUi } from "../configuratons/config";

export class PracticeLandingPage {
    URL: string;
    profileButton: Locator;
    logoutButton: Locator;
    addNoteButton: Locator;
    searchButton: Locator;
    searchInput: Locator;
    allTab: Locator;
    selectCategoryDropdown: Locator;
    completeCheckBox: Locator;
    titleInput: Locator;
    descriptionInput: Locator;
    submitNoteButton: Locator;
    cancelNoteButton: Locator;

    constructor(private page: Page) {
        this.page = page;

        this.URL = generateFullURL(practiceTestingUi, "notes/app");
        this.profileButton = page.getByTestId("profile");
        this.logoutButton = page.getByTestId("logout");
        this.addNoteButton = page.getByTestId("add-new-note");
        this.searchButton = page.getByTestId("search-btn");
        this.searchInput = page.getByTestId("search-input");
        this.allTab = page.getByRole("button", { name: "All" });

        this.selectCategoryDropdown = page.locator("#select");
        this.completeCheckBox = page.locator("input#completed");
        this.titleInput = page.locator("input#title");
        this.descriptionInput = page.locator("textarea#description");
        this.submitNoteButton = page.getByRole("button", { name: "Create" });
        this.cancelNoteButton = page.getByRole("button", { name: "Cancel" });
    }

    async navigateToLandingPage() {
        await this.page.goto(this.URL);
    }

    async gotoProfile() {
        await this.profileButton.click();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async clickAddNote() {
        await this.addNoteButton.click();
    }

    async clickSearch() {
        await this.searchButton.click();
    }

    async clickAllTab() {
        await this.allTab.click();
    }

    async clickTab(tab: string) {
        await this.page.getByRole("button", { name: tab }).click();
    }

    async fillSearchInput(query: string) {
        await this.searchInput.fill(query);
    }

    async selectOptionForNote(option: string) {
        await this.selectCategoryDropdown.click();
        await this.selectCategoryDropdown.selectOption(option);
    }

    async addNoteDetails(option: string, completed: boolean = false, title: string, description: string) {
        await this.selectOptionForNote(option);
        if (completed) {
            await this.completeCheckBox.check();
        }
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
    }

    async submitNote() {
        this.submitNoteButton.click();
    }

    async deleteNote(text: string) {
        const noteCard = this.page.locator("div.card").filter({ hasText: text });
        const noteCardDeleteButton = noteCard.getByRole("button", { name: "Delete" });
        await noteCardDeleteButton.click();
    }

    async viewNote(text: string) {
        const noteCard = this.page.locator("div.card").filter({ hasText: text });
        const noteCardViewButton = noteCard.getByRole("link", { name: "View" });
        await noteCardViewButton.click();
    }

    async editNote(text: string) {
        const noteCard = this.page.locator("div.card").filter({ hasText: text });
        const noteCardEditButton = noteCard.getByRole("button", { name: "Edit" });
        await noteCardEditButton.click();
    }

    async verifyNoteIsDisplayed(text: string) {
        const noteCard = this.page.locator("div.card").filter({ hasText: text });
        await expect(noteCard).toBeVisible();
    }

    async verifyNavigationToProfile() {
        await expect(this.page).toHaveURL("/profile");
    }

    async verifyAllTasksCompleted() {
        const progressInfo = this.page.getByTestId("progress-info");
        const allNotesCompletedText = await progressInfo.textContent();
        expect(allNotesCompletedText).toContain("You have completed all notes");
    }

}