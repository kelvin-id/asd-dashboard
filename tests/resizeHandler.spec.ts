import { test, expect } from '@playwright/test';
import { routeServicesConfig } from './shared/mocking';
import { addServices } from './shared/common';
import { ciServices } from './data/ciServices';

test.describe('Resize Handler Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await routeServicesConfig(page);
    await page.goto('/');
  });

  test('should resize widget and persist changes', async ({ page }) => {
    // Add a widget for testing
    await addServices(page, 1);

    // Fetch maxColumns and maxRows from service configuration
    const serviceConfig = ciServices.find(service => service.name === 'ASD-toolbox').config;
    const maxColumns = serviceConfig.maxColumns;
    const maxRows = serviceConfig.maxRows;

    const widget = page.locator('.widget-wrapper').first();
    const resizeHandle = widget.locator('.resize-handle');

    // Initial size checks
    await expect(widget).toHaveAttribute('data-columns', '1');
    await expect(widget).toHaveAttribute('data-rows', '1');

    // Resize to maximum size allowed by config
    await resizeWidget(page, resizeHandle, 800, 600, maxColumns, maxRows);

    // Reload and verify persistence
    await page.reload();
    await expect(widget).toHaveAttribute('data-columns', `${maxColumns}`);
    await expect(widget).toHaveAttribute('data-rows', `${maxRows}`);

    // Resize to minimum size
    await resizeWidget(page, resizeHandle, -800, -600, 1, 1);

    // Reload and verify persistence
    await page.reload();
    await expect(widget).toHaveAttribute('data-columns', '1');
    await expect(widget).toHaveAttribute('data-rows', '1');
  });

  async function resizeWidget(page, resizeHandle, moveX, moveY, expectedColumns, expectedRows) {
    await resizeHandle.hover();
    await page.mouse.down();
    await page.mouse.move(moveX, moveY);
    await page.mouse.up();

    const widget = page.locator('.widget-wrapper').first();
    await expect(widget).toHaveAttribute('data-columns', `${expectedColumns}`);
    await expect(widget).toHaveAttribute('data-rows', `${expectedRows}`);
  }
});