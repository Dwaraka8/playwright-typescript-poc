import { Page, expect } from '@playwright/test';
import { WikipediaHomepage } from '../pages/wikipediaHomePage';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/loginPage';



/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia's homepage
 * 2. Assert there are less than 7,000,000 articles in English
 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
 *
 * Instructions: Run the test and ensure it performs all steps described above
 *
 * Good luck!
 */
export async function run(page: Page, params: {}) {

    const wikipediaHomePage = new WikipediaHomepage(page);
    let originalSize;
    let largeSize;

    /** STEP: Navigate to URL */
    wikipediaHomePage.navigateToHomePage();

    /** STEP: Click the link to view the total number of articles in English */
    const totalArticlesLink = await wikipediaHomePage.getEnglishArticleCount();
    const comparableArticlesLink = 7000000
    console.log(`English articles count: ${totalArticlesLink}`);
    expect(totalArticlesLink).toBeLessThan(comparableArticlesLink);

    /** STEP: Select the 'Small' text size option in the appearance settings */
    originalSize = await wikipediaHomePage.getBodyFontSize();
    console.log(`***Original Size 1: ${originalSize}`);
    await wikipediaHomePage.selectTextSize('Small');
    const smallSize = await wikipediaHomePage.getBodyFontSize();
    console.log(`Original: ${originalSize}, Small: ${smallSize}`);
    expect(smallSize).toBeLessThan(originalSize);    

    /** STEP: Click the 'Large' text size option to change the display size */
    originalSize = await wikipediaHomePage.getBodyFontSize();
    console.log(`***Original Size 2: ${originalSize}`);
    await wikipediaHomePage.selectTextSize('Large');
    largeSize = await wikipediaHomePage.getBodyFontSize();
    expect(originalSize).toBeLessThan(largeSize);

    
    /** STEP: Click the 'Standard' text size option in the appearance settings */
    originalSize = await wikipediaHomePage.getBodyFontSize();
    console.log(`***Original Size 3: ${originalSize}`);
    await wikipediaHomePage.selectTextSize('Standard');
    const standardSize = await wikipediaHomePage.getBodyFontSize();
    expect(standardSize).toBeLessThan(originalSize);
    
}