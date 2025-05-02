import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from './pages/loginPage';

dotenv.config();


const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;

const authFile = 'src/auth/login.json';

/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */
test('Sign in to Wikipedia', async ({ page }) => {
    
    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error(`Need a username and password to sign in!`);
    }
    await loginPage.loginWithValidCredentials(wikipediaUsername, wikipediaPassword);

    const mainpageUrl = process.env.MAIN_PAGE_URL;
        if (!mainpageUrl) {
            throw new Error('Main page url is null or invalid');
        }
        console.log('Navigating to:', mainpageUrl);
        await page.goto(mainpageUrl);
        
        // Wait for central login sync message and reload
        const centralLoginNotice = page.locator('text=centrally logged in');
        if (await centralLoginNotice.isVisible({ timeout: 5000 })) {
            console.log('Detected central login message, reloading page...');
            await page.reload();
            await expect(loginPage.isUserPageLinkVisible()).toBe(true);
        }
        await page.context().storageState({ path: 'src/auth/login.json' });
    
});
