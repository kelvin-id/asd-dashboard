import { test, expect } from '@playwright/test';
import { routeServicesConfig } from './shared/mocking.js';
import { ciBoards } from './data/ciConfig.js';

test.describe('LocalStorage Editor Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should update LocalStorage and reflect changes in UI for board, view, and widget', async ({ page }) => {
    // Open the LocalStorage editor modal by clicking the floppy disk icon
    await page.click('text=💾');

    // Ensure the modal is open
    const modal = page.locator('#localStorage-modal');
    await expect(modal).toBeVisible();

    // Modify the JSON content in the textarea to create a board, view, and widget
    const textarea = modal.locator('#localStorage-content');
    const newContent = JSON.stringify(ciBoards, null, 2);
    await textarea.fill(newContent);

    await modal.locator('#save-localStorage').click();
    
    // Verify the changes are reflected in localStorage
    const boards = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('boards'));
    });

    expect(boards[0].name).toBe('Modified Board');
    expect(boards[0].views[0].name).toBe('Modified View');
    expect(boards[0].views[0].widgetState[0].url).toBe('http://localhost:8000/asd/toolbox');

    // Verify the UI reflects the changes
    const boardName = await page.locator('#board-selector').textContent();
    expect(boardName).toContain('Modified Board');
    const viewName = await page.locator('#view-selector').textContent();
    expect(viewName).toContain('Modified View');
  });
});
