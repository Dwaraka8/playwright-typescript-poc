import { Page, Locator, expect } from "@playwright/test";
import dotenv from 'dotenv';

// Page Object Model for the Wikipedia Homepage
export class WikipediaHomepage {
    // Declaring the page property, which will be used throughout the class
    readonly page: Page;

    // Class-level constants for element locators
    private static readonly LOGIN_LINK_LOCATOR = 'role=link[name="Log in"]';
    private static readonly CENTRAL_LOGIN_NOTICE_LOCATOR = 'text=centrally logged in';
    private static readonly ARTICLE_COUNT_LOCATOR = '#articlecount a';
    private static readonly FONT_SIZE_SELECTOR_BASE = '(//span[normalize-space()="{option}"])[1]';
    private static readonly WELCOME_TEXT_LOCATOR = '#Welcome_to_Wikipedia';
    private static readonly FONT_SIZE_SELECTION_CHECKBOXES = [
        { label: 'small', selector: '#skin-client-pref-vector-feature-custom-font-size-value-0' },
        { label: 'large', selector: '#skin-client-pref-vector-feature-custom-font-size-value-2' },
        { label: 'standard', selector: '#skin-client-pref-vector-feature-custom-font-size-value-1' },
    ];

    /**
     * Constructor to initialize the WikipediaHomepage with a Playwright Page object.
     * @param page - The Playwright Page object representing the browser page.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to the Wikipedia home page using the MAIN_PAGE_URL environment variable.
     * If the user is centrally logged in, the page will reload.
     * Throws an error if MAIN_PAGE_URL is not defined.
     */
    async navigateToHomePage() {
        const mainPageUrl = process.env.MAIN_PAGE_URL;

        // Check if the URL is defined in the environment variables
        if (!mainPageUrl) {
            throw new Error('MAIN_PAGE_URL is null or invalid');
        }

        console.log('Navigating to:', mainPageUrl);
        await this.page.goto(mainPageUrl, { timeout: 3000 });

        // Wait for central login sync message and reload if visible
        const centralLoginNotice = this.page.locator(WikipediaHomepage.CENTRAL_LOGIN_NOTICE_LOCATOR);
        if (await centralLoginNotice.isVisible({ timeout: 5000 })) {
            console.log('Detected central login message, reloading page...');
            await this.page.reload();
            await expect(this.page.locator('//li[@id="pt-userpage-2"]//span[text()="Rangerskill8"]')).toBeVisible({ timeout: 10000 });
            await this.page.waitForTimeout(10000);
        }

        // Click the login link if visible
        if (await this.page.locator(WikipediaHomepage.LOGIN_LINK_LOCATOR).isVisible()) {
            await this.page.locator(WikipediaHomepage.LOGIN_LINK_LOCATOR).click({ timeout: 5000 });
        }
    }

    /**
     * Get the count of English articles on the Wikipedia homepage.
     * @returns The article count as a number.
     */
    async getEnglishArticleCount(): Promise<number> {
        const text = await this.page.textContent(WikipediaHomepage.ARTICLE_COUNT_LOCATOR);
        const cleanText = text?.replace(/,/g, '').trim();
        return parseInt(cleanText || '0', 10);
    }

    /**
     * Select the text size option on the Wikipedia homepage.
     * @param option - The text size option to select ('Small', 'Large', or 'Standard').
     */
    async selectTextSize(option: 'Small' | 'Large' | 'Standard') {
        console.log(`Requested option to select is: ${option}`);

        // Wait for the page to load before clicking the option
        await this.page.waitForTimeout(2000);
        await this.page.click(WikipediaHomepage.FONT_SIZE_SELECTOR_BASE.replace('{option}', option));

        // Wait for the page to load after selection
        await this.page.waitForTimeout(2000);

        // Log the font size selection state
        await this.logFontSizeSelectionState(this.page);
    }

    /**
     * Get the current body font size of the page.
     * @returns The font size in pixels as a number.
     */
    async getBodyFontSize(): Promise<number> {
        const fontSizeStr = await this.page
            .locator(WikipediaHomepage.WELCOME_TEXT_LOCATOR)
            .evaluate(el => getComputedStyle(el).fontSize);
        
        console.log(`fontSizeStr: ${fontSizeStr}`);
        return parseFloat(fontSizeStr);
    }

    /**
     * Log the current state of the font size selection checkboxes.
     * This method checks if the 'small', 'large', and 'standard' options are selected.
     * @param page - The Playwright Page object.
     */
    async logFontSizeSelectionState(page: Page) {
        for (const { label, selector } of WikipediaHomepage.FONT_SIZE_SELECTION_CHECKBOXES) {
            const isChecked = await page.isChecked(selector);
            console.log(`${label} - isChecked:`, isChecked);
        }
    }
}
