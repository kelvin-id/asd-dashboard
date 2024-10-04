import { addWidget } from './widgetManagement.js';
import { toggleBoardboardMode, toggleButtons, exitBoardboardMode } from './boardboardMode.js';
import { showResizeMenuBlock, hideResizeMenuBlock, resizeHorizontally, resizeVertically } from './resizeMenu.js';
import { fetchServices } from './fetchServices.js';
import { getConfig } from './widgetManagement.js';

let uiInitialized = false; // Guard variable

function initializeUIInteractions() {
    if (uiInitialized) return; // Guard clause
    uiInitialized = true;

    document.getElementById('add-widget-button').addEventListener('click', () => {
        const serviceSelector = document.getElementById('service-selector');
        const widgetUrlInput = document.getElementById('widget-url');
        const url = serviceSelector.value || widgetUrlInput.value;

        console.log('Add Widget Button Clicked');

        if (url) {
            addWidget(url);
        } else {
            alert('Please select a service or enter a URL.');
        }
    });

    document.getElementById('toggle-widget-order').addEventListener('click', toggleBoardboardMode);
    document.getElementById('toggle-widget-buttons').addEventListener('click', toggleButtons);
    document.getElementById('save-widget-order').addEventListener('click', exitBoardboardMode);

    document.getElementById('reset-button').addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });

    // Add event listeners for showing resize menu block
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('widget-icon-resize-block')) {
            const widgetWrapper = event.target.closest('.widget-wrapper');
            if (!widgetWrapper) {
                console.error('No widget wrapper found for resize icon');
                return;
            }

            const widgetUrl = widgetWrapper.dataset.url;
            if (!widgetUrl) {
                console.error('No URL found for widget');
                return;
            }

            try {
                const services = await fetchServices();
                const config = await getConfig();
                const service = services.find(s => widgetUrl.startsWith(s.url));

                if (!service) {
                    console.error(`No service found for URL: ${widgetUrl}`);
                    return;
                }

                const widgetConstraints = service.config || {};
                showResizeMenuBlock(event.target, widgetWrapper, widgetConstraints, config.styling.grid);
            } catch (error) {
                console.error('Error fetching services or config:', error);
            }
        }
    });

    // Add event listener for hiding resize menu block
    document.addEventListener('mouseleave', (event) => {
        if (event.target.classList.contains('widget-wrapper')) {
            hideResizeMenuBlock(event.target);
        }
    }, true);

    // Add event listeners for resizing widgets
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('resize-button')) {
            const widgetWrapper = event.target.closest('.widget-wrapper');
            if (!widgetWrapper) {
                console.error('No widget wrapper found for resize button');
                return;
            }

            const direction = event.target.dataset.direction;
            const increase = event.target.dataset.increase === 'true';

            try {
                const services = await fetchServices();
                const config = await getConfig();
                const widgetUrl = widgetWrapper.dataset.url;
                const service = services.find(s => widgetUrl.startsWith(s.url));

                if (!service) {
                    console.error(`No service found for URL: ${widgetUrl}`);
                    return;
                }

                const widgetConstraints = service.config || {};

                if (direction === 'horizontal') {
                    await resizeHorizontally(widgetWrapper, increase, widgetConstraints, config.styling.grid);
                } else if (direction === 'vertical') {
                    await resizeVertically(widgetWrapper, increase, widgetConstraints, config.styling.grid);
                }
            } catch (error) {
                console.error('Error resizing widget:', error);
            }
        }
    });
}

export { initializeUIInteractions };
