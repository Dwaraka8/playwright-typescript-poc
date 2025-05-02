import { Page, expect } from '@playwright/test';
import { SearchPage } from '../pages/searchPage';
import { ArtificialIntelligencePage } from '../pages/artificialIntelligencePage';


/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia
 * 2. Go to the "Artificial intelligence" page
 * 3. Click "View history"
 * 4. Assert that the latest edit was made by the user "Worstbull"
 *
 * Instructions:
 * - Run the test and ensure it performs all steps described above
 * - Add assertions to the test to ensure it validates the expected
 *   behavior:
 *   - If the latest edit was not made by "Worstbull" update the steps above accordingly
 *   - Write your assertion to provide clear diagnostic feedback if it fails
 *
 * Good luck!
 */
export async function run(page: Page, params: {}) {
    const searchPage = new SearchPage(page);
    const artificialIntelligencePage = new ArtificialIntelligencePage(page);

    // Constants for expected values and test steps
    const EXPECTED_LAST_EDITOR_NAME = 'Worstbull';
    const SEARCH_TERM = 'Artificial Intelligence';

    /** STEP: Navigate to URL */
    await searchPage.goto();
    
    // Search for "Artificial Intelligence"
    await searchPage.search(SEARCH_TERM);
    
    // Navigate to the Artificial Intelligence page and open its "View History"
    await artificialIntelligencePage.goto();
    await artificialIntelligencePage.openViewHistory();

    // Get the name of the last editor
    const lastEditor = await artificialIntelligencePage.getLastEditorName();
    console.log(`Last edited by: ${lastEditor}`);

    // Assert that the last editor is not EXPECTED_LAST_EDITOR_NAME
    expect(lastEditor.toLocaleLowerCase()).not.toContain(EXPECTED_LAST_EDITOR_NAME);
}
