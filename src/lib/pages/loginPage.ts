import { expect, Page, Locator } from "@playwright/test";
import dotenv from 'dotenv';


export class LoginPage {
    
    // Declaring the page property, which will be used throughout the class
    readonly page: Page;

    // Class-level constants for element locators
    private static readonly USERNAME_FIELD_LOCATOR = '#wpName1';
    private static readonly PASSWORD_FIELD_LOCATOR = '#wpPassword1';
    private static readonly LOGIN_BUTTON_LOCATOR = '#wpLoginAttempt';
    private static readonly USER_PAGE_LOCATOR = '//li[@id="pt-userpage-2"]//span[text()="Rangerskill8"]';
    private static readonly ERROR_MESSAGE_LOCATOR = '.mw-message-box-error';
    private static readonly CENTRAL_LOGIN_NOTICE = 'text=centrally logged in';

    /**
     * Constructor to initialize the LoginPage with a Playwright Page object.
     * @param page - The Playwright Page object representing the browser page.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to the login page using the TARGET_URL environment variable.
     * Throws an error if the TARGET_URL is not defined.
     */
    async goToLoginPage() {
        const url = process.env.TARGET_URL;

        // Check if the URL is defined in the environment variables
        if (!url) {
            throw new Error('TARGET_URL is not defined or invalid');
        }

        console.log('Navigating to:', url);
        await this.page.goto(url); // Navigate to the login page
    }

    /**
     * Perform login with valid credentials.
     * @param username - The username to be used for login.
     * @param password - The password to be used for login.
     */
    async loginWithValidCredentials(username: string, password: string) {
        // Fill in the username and password fields using the class-level constants for locators
        await this.page.fill(LoginPage.USERNAME_FIELD_LOCATOR, username);
        await this.page.fill(LoginPage.PASSWORD_FIELD_LOCATOR, password);

        // Click the login button to submit the form
        await this.page.click(LoginPage.LOGIN_BUTTON_LOCATOR);
        
    }

    async getUserPageLocator(): Promise<Locator> {
        return this.page.locator(LoginPage.USER_PAGE_LOCATOR);
    }

    async isUserPageLinkVisible(): Promise<boolean> {
        return await this.page.locator(LoginPage.USER_PAGE_LOCATOR).isVisible({ timeout: 5000 });
    }

    async isCentralLoginNoticeVisible(): Promise<boolean> {
        return await this.page.locator(LoginPage.CENTRAL_LOGIN_NOTICE).isVisible({ timeout: 5000 }).catch(() => false);
    }

    /**
     * Retrieve the error message displayed on the page after a failed login attempt.
     * @returns The error message as a string.
     */
    async getErrorMessage(): Promise<string> {
        // Return the error message text if it exists, otherwise return an empty string
        return await this.page.textContent(LoginPage.ERROR_MESSAGE_LOCATOR) || '';
    }
}
