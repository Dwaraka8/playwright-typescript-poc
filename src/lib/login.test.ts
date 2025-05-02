import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from './pages/loginPage';

dotenv.config();


/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */
test('Sign in to Wikipedia', async ({ page }) => {
    
    const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
    const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;
    const authFile = 'src/auth/login.json';

    const loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();

    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error(`Need a username and password to sign in!`);
    }
    
    await loginPage.loginWithValidCredentials(wikipediaUsername, wikipediaPassword);

    await expect(await loginPage.isUserPageLinkVisible()).toBe(true);

    const mainpageUrl = process.env.MAIN_PAGE_URL;
    if (!mainpageUrl) {
        throw new Error('Main page url is null or invalid');
    }
    console.log('Navigating to:', mainpageUrl);
    await page.goto(mainpageUrl);
    
    // Wait for central login sync message and reload
    const isCentralNoticeVisible = await loginPage.isCentralLoginNoticeVisible();
    console.log('Central login notice visible:', isCentralNoticeVisible);
    if (isCentralNoticeVisible) {
        console.log('Detected central login message, reloading page...');
        await page.reload();
        await expect(await loginPage.isUserPageLinkVisible()).toBe(true);
    }

    await page.context().storageState({ path: authFile });
    
});
