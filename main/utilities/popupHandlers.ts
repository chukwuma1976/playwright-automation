import { Page } from "@playwright/test";

export async function closeAdPopupIfPresent(page: Page, redirectURL?: string): Promise<void> {
    const closeButton = page.getByText("close");

    if (await closeButton.isVisible()) {
        await closeButton.click();
    }

    if (redirectURL) {
        await page.goto(redirectURL);
    }
}