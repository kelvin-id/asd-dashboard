import { test, expect, type Page } from '@playwright/test';
import emojiList from '../src/ui/unicodeEmoji'; // Adjust the path as necessary


// Helper function to add services
async function addServices(page: Page, count: number) {
  for (let i = 0; i < count; i++) {
    await page.selectOption('#service-selector', { index: i + 1 });
    await page.click('#add-widget-button');
  }
}

async function selectServiceByName(page: Page, serviceName: string) {
  await page.selectOption('#service-selector', { label: serviceName });
  await page.click('#add-widget-button');
}

async function routeServices(page: Page) {
    // Mock services.json
    await page.route('**/services.json', async route => {
      const json = [
        {
          "name": "ASD-toolbox",
          "url": "http://localhost:8000/asd/toolbox",
          "type": "api",
          "config": {
            "minColumns": 1,
            "maxColumns": 4,
            "minRows": 1,
            "maxRows": 4
          }
        },
        {
          "name": "ASD-terminal",
          "url": "http://localhost:8000/asd/terminal",
          "type": "web",
          "config": {
            "minColumns": 2,
            "maxColumns": 6,
            "minRows": 2,
            "maxRows": 6
          }
        },
        {
          "name": "ASD-tunnel",
          "url": "http://localhost:8000/asd/tunnel",
          "type": "web",
          "config": {
            "minColumns": 1,
            "maxColumns": 6,
            "minRows": 1,
            "maxRows": 6
          }
        },
        {
          "name": "ASD-containers",
          "url": "http://localhost:8000/asd/containers",
          "type": "web",
          "config": {
            "minColumns": 2,
            "maxColumns": 4,
            "minRows": 2,
            "maxRows": 6
          }
        },
      ];
      await route.fulfill({ json });
    });

    await page.route('**/config.json', async route => {
      const json = {
        "styling": {
            "grid": {
                "minColumns": 1,
                "maxColumns": 6,
                "minRows": 1,
                "maxRows": 6
            }
        }
      };
      await route.fulfill({ json });
    });

    // Mock individual service APIs
    await page.route('**/asd/toolbox', route => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ "name": "ASD-toolbox" })
      });
    });

    await page.route('**/asd/terminal', route => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ "name": "ASD-terminal" })
      });
    });

    await page.route('**/asd/tunnel', route => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ "name": "ASD-tunnel" })
      });
    });

    await page.route('**/asd/containers', route => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ "name": "ASD-containers" })
      });
    });
}

const widgetUrlOne = "http://localhost:8000/asd/toolbox"
const widgetUrlTwo = "http://localhost:8000/asd/terminal"
const widgetUrlThree = "http://localhost:8000/asd/tunnel"
const widgetUrlFour = "http://localhost:8000/asd/containers"

// https://playwright.dev/docs/test-retries#reuse-single-page-between-tests
// test.describe.configure({ mode: 'serial' });

// let page: Page;

test.describe('ASD Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await routeServices(page)
    await page.goto('http://localhost:8000');
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
    console.log('Before Drag-and-Drop:');
    for (let i = 0; i < widgetCount; i++) {
      const widget = widgets.nth(i);
      const order = await widget.getAttribute('data-order');
      const url = await widget.getAttribute('data-url'); // Fetch the url attribute

      if (url !== null) {
        orderBeforeDragDrop[url] = order; // Use url as the key
      } else {
        console.error(`Widget ${i} has a null url attribute`);
      }

      console.log(`Widget ${i} data-order: ${order}, url: ${url}`);
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
    console.log('After Drag-and-Drop:');
    for (let i = 0; i < widgetCount; i++) {
      const widget = widgets.nth(i);
      const order = await widget.getAttribute('data-order');
      const url = await widget.getAttribute('data-url'); // Fetch the url attribute
      
      if (url !== null) {
        orderAfterDragDrop[url] = order; // Use url as the key
      } else {
        console.error(`Widget ${i} has a null url attribute`);
      }

      console.log(`Widget ${i} data-order: ${order}, url: ${url}`);
    }

    // Compare initial and final order by url
    // ToDo: In the future when adding more widgets with the same url, we need UUID's to start identifying them
    console.log('Order comparison:');
    for (const url in orderBeforeDragDrop) {
      console.log(`Widget url: ${url}, initial: ${orderBeforeDragDrop[url]}, final: ${orderAfterDragDrop[url]}`);
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
    console.log('After Reload:');
    for (let i = 0; i < widgetCount; i++) {
      const widget = widgets.nth(i);
      const order = await widget.getAttribute('data-order');
      const url = await widget.getAttribute('data-url'); // Fetch the url attribute

      if (url !== null) {
        orderAfterReload[url] = order; // Use url as the key
      } else {
        console.error(`Widget ${i} has a null url attribute`);
      }

      console.log(`Widget ${i} data-order: ${order}, url: ${url}`);
    }

    // Compare initial and restored order by url
    console.log('Order comparison after reload:');
    for (const url in orderBeforeDragDrop) {
      console.log(`Widget url: ${url}, initial: ${orderBeforeDragDrop[url]}, restored: ${orderAfterReload[url]}`);
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
      console.log(dialog.message());
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
