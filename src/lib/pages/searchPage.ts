import { Page, Locator, expect } from "@playwright/test";
import dotenv from 'dotenv';


export class SearchPage {
    
    // Declaring the page property, which will be used throughout the class
    readonly page: Page;

    // Class-level constants for element locators
    private static readonly SEARCH_INPUT_LOCATOR = '//div[@id="simpleSearch"]//input[@name="search"]';
    private static readonly LOGIN_LOCATOR = 'pt-login-2';
    private static readonly CENTRAL_LOGIN_NOTICE_LOCATOR = 'text=centrally logged in';
    private static readonly USER_PAGE_LOCATOR = '//li[@id="pt-userpage-2"]//span[text()="Rangerskill8"]';
    private static readonly LOGOUT_BUTTON_LOCATOR = '#pt-logout';
    private static readonly LOGIN_LINK_LOCATOR = 'role=link[name="Log in"]';

    /**
     * Constructor to initialize the SearchPage with a Playwright Page object.
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
        const mainpageUrl = process.env.MAIN_PAGE_URL;

        // Check if the URL is defined in the environment variables
        if (!mainpageUrl) {
            throw new Error('MAIN_PAGE_URL is not defined or invalid');
        }

        console.log('Navigating to:', mainpageUrl);
        await this.page.goto(mainpageUrl, { timeout: 3000 });

        // Wait for central login sync message and reload if visible
        const centralLoginNotice = this.page.locator(SearchPage.CENTRAL_LOGIN_NOTICE_LOCATOR);
        if (await centralLoginNotice.isVisible({ timeout: 5000 })) {
            console.log('Detected central login message, reloading page...');
            await this.page.reload();
            await expect(this.page.locator(SearchPage.USER_PAGE_LOCATOR)).toBeVisible({ timeout: 5000 });
            // Click the login link to go to the login page
            await this.page.locator(SearchPage.LOGIN_LINK_LOCATOR).click();
        }
    }

    /**
     * Perform a search using the given search term.
     * @param term - The search term to be entered in the search input.
     */
    async search(term: string) {
        // Fill the search input and simulate pressing 'Enter'
        await this.page.locator(SearchPage.SEARCH_INPUT_LOCATOR).fill(term);
        await this.page.keyboard.press('Enter');
    }

    /**
     * Check if the user is logged in by verifying the visibility of the logout button.
     * @returns True if the logout button is visible, indicating the user is logged in; otherwise, false.
     */
    async isLoggedIn(): Promise<boolean> {
        // Check if the logout button is visible and return the result
        return await this.page.locator(SearchPage.LOGOUT_BUTTON_LOCATOR).isVisible().catch(() => false);
    }
}
