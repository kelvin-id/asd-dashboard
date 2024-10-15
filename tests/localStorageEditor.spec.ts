import { test, expect } from '@playwright/test';
import { routeServicesConfig } from './shared/mocking';
import emojiList from '../src/ui/unicodeEmoji.js';
import { ciBoards } from './data/ciConfig.js';

test.describe('LocalStorage Editor Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // await routeServicesConfig(page);
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('log', 'localStorageModal,localStorage');
    });
  });

  test('should open LocalStorage editor modal, modify JSON content, and save changes', async ({ page }) => {
    // Open LocalStorage editor
    // await page.click('#localStorage-edit-button');
    await page.click(`text=${emojiList.floppyDisk.unicode}`);

    // Verify modal is visible
    const modal = await page.locator('#localStorage-modal');
    await expect(modal).toBeVisible();

    // Verify Close button is present
    const closeButton = await modal.locator('button.lsm-cancel-button');
    await expect(closeButton).toBeVisible();

    // Modify the JSON content in the textarea to create a board, view, and widget
    const textarea = await modal.locator('textarea#localStorage-boards'); // Adjust the selector to match actual key
    const originalContent = await textarea.inputValue();
    const newContent = JSON.stringify(ciBoards.boards, null, 2);
    await textarea.fill(newContent);

    // Save changes
    const saveButton = await modal.locator('button.lsm-save-button');
    await saveButton.click();

    // Verify notification for successful save
    const notification = await page.locator('.user-notification span');
    await expect(notification).toHaveText('LocalStorage updated successfully!');

    // Verify changes in localStorage
    const updatedValue = await page.evaluate(() => localStorage.getItem('boards'));
    expect(updatedValue[0].id).toBe(newContent[0].id);

    // Test closing modal using Close button
    await closeButton.click();
    await expect(modal).toBeHidden();

    // Reopen and test closing modal using Escape key
    await page.click('#localStorage-edit-button');
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();

    await page.reload()
    
    // Verify the changes are reflected in localStorage
    const boards = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('boards'));
    });

    expect(boards[0].name).toBe('Modified Board 1');
    expect(boards[0].views[0].name).toBe('Modified View 1');
    expect(boards[0].views[0].widgetState[0].url).toBe('http://localhost:8000/asd/toolbox');

    // Verify the UI reflects the changes
    const boardName = await page.locator('#board-selector').textContent();
    expect(boardName).toContain('Modified Board 1');
    const viewName = await page.locator('#view-selector').textContent();
    expect(viewName).toContain('Modified View 1');
  });

  // test('should log notification for invalid JSON and keep non-JSON values uneditable', async ({ page }) => {
  //   const logs: string[] = [];

  //   // Listen for console events
  //   page.on('console', msg => {
      
  //     if (['log', 'info', 'warn', 'error'].includes(msg.type())) {
  //       logs.push(msg.text());
  //     }
  //   });

  //   await page.evaluate(() => {
  //     localStorage.setItem('brokenJSON', '/////Te/////');
  //   });

  //   // // Open LocalStorage editor
  //   await page.click('#localStorage-edit-button');
  //   console.log(`Kelvin ${logs}`);

  //   const localStorageNonJSONErrors = logs.find(log => log.includes('Non-JSON value detected for key: brokenJSON'));
  //   expect(localStorageNonJSONErrors).toBeDefined();
  // });
});
