import { test, expect, type Page } from '@playwright/test';

test.describe('ASD Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000');
  });

  test('should add 3 services and test fullscreen, configure, resize, resize-block, and drag and drop functionalities', async ({ page }) => {
    // Mock services.json
    await page.route('**/services.json', route => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          {
            "name": "GeoJS",
            "url": "https://get.geojs.io/",
            "type": "api",
            "config": {
              "minColumns": 1,
              "maxColumns": 4,
              "minRows": 1,
              "maxRows": 4
            }
          },
          {
            "name": "Tradingview",
            "url": "https://www.tradingview.com/embed-widget/market-overview/",
            "type": "web",
            "config": {
              "minColumns": 2,
              "maxColumns": 6,
              "minRows": 2,
              "maxRows": 6
            }
          },
          {
            "name": "Spotify",
            "url": "https://open.spotify.com/embed/playlist/4qh1ivXmCO9PB5xZa2QC4t?utm_source=generator",
            "type": "web",
            "config": {
              "minColumns": 1,
              "maxColumns": 6,
              "minRows": 1,
              "maxRows": 6
            }
          }
        ])
      });
    });

    // Add 3 services
    for (let i = 0; i < 3; i++) {
      await page.selectOption('#service-selector', { index: i + 1 });
      await page.click('#add-widget-button');
    }

    const widgets = page.locator('.widget-wrapper');
    await expect(widgets).toHaveCount(3);

    // Test fullscreen
    const firstWidget = widgets.nth(0);
    await firstWidget.locator('.fullscreen-btn').click();
    await expect(firstWidget).toHaveClass(/fullscreen/);
    await page.keyboard.press('Escape');
    await expect(firstWidget).not.toHaveClass(/fullscreen/);

    // Test configure
    // Listen for the dialog event
    page.on('dialog', async dialog => {
      console.log(dialog.message());
      await dialog.accept('https://new.url'); // Provide the URL directly in the dialog
    });

    await firstWidget.locator('.widget-icon-configure').click();
    // Removed the page.fill line as the URL is now provided in the dialog accept
    await expect(firstWidget.locator('iframe')).toHaveAttribute('src', 'https://new.url');

    // Test resize
    await firstWidget.locator('.widget-icon-resize').hover();
    await page.click('text=⬇');
    await page.click('text=➡');
    await expect(firstWidget).toHaveAttribute('data-columns', '2');
    await expect(firstWidget).toHaveAttribute('data-rows', '2');

    // Test resize-block
    await firstWidget.locator('.widget-icon-resize-block').hover();
    await page.click('text=3 columns, 3 rows');
    await expect(firstWidget).toHaveAttribute('data-columns', '3');
    await expect(firstWidget).toHaveAttribute('data-rows', '3');

    // Log data-order attributes before drag and drop
    console.log('Before Drag-and-Drop:');
    for (let i = 0; i < 3; i++) {
      const widget = widgets.nth(i);
      const order = await widget.getAttribute('data-order');
      console.log(`Widget ${i} data-order: ${order}`);
    }

    // Test drag and drop
    const secondWidget = widgets.nth(1);
    const dragHandle = firstWidget.locator('.widget-icon-drag');
    const dropTarget = secondWidget.locator('.widget-icon-drag');

    await dragHandle.dragTo(dropTarget);

    // Log data-order attributes after drag and drop
    console.log('After Drag-and-Drop:');
    for (let i = 0; i < 3; i++) {
      const widget = widgets.nth(i);
      const order = await widget.getAttribute('data-order');
      console.log(`Widget ${i} data-order: ${order}`);
    }

    await expect(firstWidget).toHaveAttribute('data-order', '1');
    await expect(secondWidget).toHaveAttribute('data-order', '0');
  });
});