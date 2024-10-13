import { test, expect, type Page } from '@playwright/test';
import emojiList from '../src/ui/unicodeEmoji'; // Adjust the path as necessary
import { routeServicesConfig } from './shared/mocking';
import { addServices, selectServiceByName } from './shared/common';
import { widgetUrlOne, widgetUrlTwo, widgetUrlThree, widgetUrlFour } from './shared/constant';
import { Logger } from '../src/utils/Logger.js';

const logger = new Logger('addManageWidgets.ts');

test.describe('ASD Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await routeServicesConfig(page)
    await page.goto('/');
  });

  test(`should be able to add 4 services and drag and drop ${emojiList.pinching.unicode}`, async ({ page }) => {
    const widgetCount = 4

    // Add 4 services
    await addServices(page, widgetCount);

    const widgets = page.locator('.widget-wrapper');
    const firstWidget = widgets.nth(0);
    const secondWidget = widgets.nth(1);
    const thirdWidget = widgets.nth(2);
    const fourthWidget = widgets.nth(3);

    await expect(widgets).toHaveCount(4);

    // Store data-order and url attributes in a dictionary
    const orderBeforeDragDrop = {};
    logger.log('Before Drag-and-Drop:');
    for (let i = 0; i < widgetCount; i++) {
      const widget = widgets.nth(i);
      const order = await widget.getAttribute('data-order');
      const url = await widget.getAttribute('data-url'); // Fetch the url attribute

      if (url !== null) {
        orderBeforeDragDrop[url] = order; // Use url as the key
      } else {
        logger.error(`Widget ${i} has a null url attribute`);
      }

      logger.log(`Widget ${i} data-order: ${order}, url: ${url}`);
    }

    // Test drag and drop
    const dragWidgetOne = firstWidget.locator('.widget-icon-drag');
    const dropWidgetTwo = secondWidget.locator('.widget-icon-drag');

    await dragWidgetOne.dragTo(dropWidgetTwo);

    const dragWidgetThree = thirdWidget.locator('.widget-icon-drag');
    const dropWidgetFour = fourthWidget.locator('.widget-icon-drag');

    await dragWidgetThree.dragTo(dropWidgetFour);

    // Log data-order attributes after drag and drop
    const orderAfterDragDrop = {};
    logger.log('After Drag-and-Drop:');
    for (let i = 0; i < widgetCount; i++) {
      const widget = widgets.nth(i);
      const order = await widget.getAttribute('data-order');
      const url = await widget.getAttribute('data-url'); // Fetch the url attribute

      if (url !== null) {
        orderAfterDragDrop[url] = order; // Use url as the key
      } else {
        logger.error(`Widget ${i} has a null url attribute`);
      }

      logger.log(`Widget ${i} data-order: ${order}, url: ${url}`);
    }

    // Compare initial and final order by url
    // ToDo: In the future when adding more widgets with the same url, we need UUID's to start identifying them
    logger.log('Order comparison:');
    for (const url in orderBeforeDragDrop) {
      logger.log(`Widget url: ${url}, initial: ${orderBeforeDragDrop[url]}, final: ${orderAfterDragDrop[url]}`);
      expect(orderBeforeDragDrop[url]).not.toBe(orderAfterDragDrop[url]);
    }

    // firstWidget
    expect(orderBeforeDragDrop[widgetUrlOne]).toBe("0");
    expect(orderAfterDragDrop[widgetUrlOne]).toBe("1");
    // secondWidget
    expect(orderBeforeDragDrop[widgetUrlTwo]).toBe("1");
    expect(orderAfterDragDrop[widgetUrlTwo]).toBe("0");

    // thirdWidget
    expect(orderBeforeDragDrop[widgetUrlThree]).toBe("2");
    expect(orderAfterDragDrop[widgetUrlThree]).toBe("3");
    // fourthWidget
    expect(orderBeforeDragDrop[widgetUrlFour]).toBe("3");
    expect(orderAfterDragDrop[widgetUrlFour]).toBe("2");

    // Reload the page to restore widgets from local storage
    await page.reload();

    // Verify the order of widgets after reload
    const orderAfterReload = {};
    logger.log('After Reload:');
    for (let i = 0; i < widgetCount; i++) {
      const widget = widgets.nth(i);
      const order = await widget.getAttribute('data-order');
      const url = await widget.getAttribute('data-url'); // Fetch the url attribute

      if (url !== null) {
        orderAfterReload[url] = order; // Use url as the key
      } else {
        logger.error(`Widget ${i} has a null url attribute`);
      }

      logger.log(`Widget ${i} data-order: ${order}, url: ${url}`);
    }

    // Compare initial and restored order by url
    logger.log('Order comparison after reload:');
    for (const url in orderBeforeDragDrop) {
      logger.log(`Widget url: ${url}, initial: ${orderBeforeDragDrop[url]}, restored: ${orderAfterReload[url]}`);
    }

    // firstWidget
    expect(orderBeforeDragDrop[widgetUrlOne]).toBe("0");
    expect(orderAfterReload[widgetUrlOne]).toBe("1");
    // secondWidget
    expect(orderBeforeDragDrop[widgetUrlTwo]).toBe("1");
    expect(orderAfterReload[widgetUrlTwo]).toBe("0");

    // thirdWidget
    expect(orderBeforeDragDrop[widgetUrlThree]).toBe("2");
    expect(orderAfterReload[widgetUrlThree]).toBe("3");
    // fourthWidget
    expect(orderBeforeDragDrop[widgetUrlFour]).toBe("3");
    expect(orderAfterReload[widgetUrlFour]).toBe("2");
  });


  test(`should be able to change the widget url ${emojiList.link.unicode}`, async ({ page }) => {
    await addServices(page, 2);

    // Listen for the dialog event
    page.on('dialog', async dialog => {
      logger.log(dialog.message());
      await dialog.accept('https://new.url'); // Provide the URL directly in the dialog
    });

    const widgets = page.locator('.widget-wrapper');
    const firstWidget = widgets.nth(0);
    await firstWidget.locator('.widget-icon-link').click();
    // Removed the page.fill line as the URL is now provided in the dialog accept
    await expect(firstWidget.locator('iframe')).toHaveAttribute('src', 'https://new.url');
  });


  test(`should be able to use fullscreen ${emojiList.fullscreen.unicode}`, async ({ page }) => {
    await addServices(page, 2);

    const widgets = page.locator('.widget-wrapper');
    const firstWidget = widgets.nth(0);

    // Test fullscreen
    await firstWidget.locator('.widget-icon-fullscreen').click();
    await expect(firstWidget).toHaveClass(/fullscreen/);
    await page.keyboard.press('Escape');
    await expect(firstWidget).not.toHaveClass(/fullscreen/);

  });


  const allDirectionIcons = `${emojiList.arrowDown.unicode}${emojiList.arrowRight.unicode}${emojiList.arrowUp.unicode}${emojiList.arrowLeft.unicode}`

  test(`should be able to resize all directions using ${allDirectionIcons}`, async ({ page }) => {
    await selectServiceByName(page, "ASD-toolbox");

    const widgets = page.locator('.widget-wrapper');
    const firstWidget = widgets.nth(0);

    // Resize 2/2
    await firstWidget.locator('.widget-icon-resize').hover();
    await page.click('text=⬇');
    await firstWidget.locator('.widget-icon-resize').hover();
    await page.click('text=➡');
    await expect(firstWidget).toHaveAttribute('data-columns', '2');
    await expect(firstWidget).toHaveAttribute('data-rows', '2');

    // Resize 1/1
    await firstWidget.locator('.widget-icon-resize').hover();
    await page.click('text=⬆');
    await firstWidget.locator('.widget-icon-resize').hover();
    await page.click('text=⬅');
    await expect(firstWidget).toHaveAttribute('data-columns', '1');
    await expect(firstWidget).toHaveAttribute('data-rows', '1');
  });


  test(`should be able to resize using columns and rows ${emojiList.triangularRuler.unicode}`, async ({ page }) => {
    await addServices(page, 2);

    const widgets = page.locator('.widget-wrapper');
    const firstWidget = widgets.nth(0);

    // Test resize-block
    await firstWidget.locator('.widget-icon-resize-block').hover();
    await page.click('text=3 columns, 3 rows');
    await expect(firstWidget).toHaveAttribute('data-columns', '3');
    await expect(firstWidget).toHaveAttribute('data-rows', '3');
  });

});