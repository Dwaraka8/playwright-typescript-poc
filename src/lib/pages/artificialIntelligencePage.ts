import { Page, Locator } from "@playwright/test";
import dotenv from 'dotenv';


export class ArtificialIntelligencePage {
    
    // Declaring the page property, which will be used throughout the class
    readonly page: Page;
    

    // Class-level constants for element locators
    private static readonly VIEW_HISTORY_TAB_LOCATOR = '//li[@id="ca-history"]/a';
    private static readonly LAST_EDITOR_LOCATOR = '(//span[@class="history-user"]/a/bdi)[1]';

    /**
     * Constructor to initialize the ArtificialIntelligencePage with a Playwright Page object.
     * @param page - The Playwright Page object representing the browser page.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to the main page using the MAIN_PAGE_URL environment variable.
     * Throws an error if MAIN_PAGE_URL is not defined.
     */
    async goto() {
        const mainPageUrl = process.env.MAIN_PAGE_URL;

        // Check if the URL is defined in the environment variables
        if (!mainPageUrl) {
            throw new Error('MAIN_PAGE_URL is null or invalid');
        }

        console.log(`Navigating to: ${mainPageUrl}`);
        await this.page.goto(mainPageUrl, { timeout: 3000 });
    }

    /**
     * Open the "View History" tab on the page.
     */
    async openViewHistory() {
        // Click on the "View History" tab
        await this.page.locator(ArtificialIntelligencePage.VIEW_HISTORY_TAB_LOCATOR).click();
    }

    /**
     * Get the name of the last editor on the page.
     * @returns The name of the last editor as a string.
     */
    async getLastEditorName(): Promise<string> {
        // Retrieve the inner text of the last editor element
        return await this.page.locator(ArtificialIntelligencePage.LAST_EDITOR_LOCATOR).innerText();
    }
}
