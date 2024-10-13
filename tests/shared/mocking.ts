import { type Page } from '@playwright/test';
import { ciConfig } from '../data/ciConfig';


export async function routeServicesConfig(page: Page) {
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
    const json = ciConfig;
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

