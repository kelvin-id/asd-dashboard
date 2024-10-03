import { createWidget } from './widgetManagement.js';
import { getConfig } from './widgetManagement.js'; // Import getConfig function
import { fetchServices } from './fetchServices.js'; // Import fetchServices function

function saveWidgetState() {
    try {
        console.log('saveWidgetState function called');
        const widgetContainer = document.getElementById('widget-container');
        const widgets = Array.from(widgetContainer.children);
        const widgetState = widgets.map(widget => {
            const state = {
                order: widget.getAttribute('data-order'),
                url: widget.querySelector('iframe').src,
                columns: widget.dataset.columns || 1,
                rows: widget.dataset.rows || 1
            };
            console.log('Saving widget state:', state);
            return state;
        });
        localStorage.setItem('widgetState', JSON.stringify(widgetState));
        console.log('Saved widget state to localStorage:', widgetState);
    } catch (error) {
        console.error('Error saving widget state:', error);
    }
}

async function loadWidgetState() {
    try {
        const savedState = JSON.parse(localStorage.getItem('widgetState'));
        console.log('Loaded widget state from localStorage:', savedState);
        if (savedState) {
            const config = await getConfig(); // Load config once
            const services = await fetchServices(); // Fetch services.json
            const widgetContainer = document.getElementById('widget-container');
            widgetContainer.innerHTML = ''; // Clear existing widgets
            for (const widgetData of savedState) {
                console.log('Creating widget with data:', widgetData);
                const serviceConfig = services.find(service => service.url === widgetData.url)?.config || {};
                const minColumns = serviceConfig.minColumns || config.styling.grid.minColumns;
                const maxColumns = serviceConfig.maxColumns || config.styling.grid.maxColumns;
                const minRows = serviceConfig.minRows || config.styling.grid.minRows;
                const maxRows = serviceConfig.maxRows || config.styling.grid.maxRows;

                // Ensure widget dimensions respect constraints
                const columns = Math.min(Math.max(widgetData.columns, minColumns), maxColumns);
                const rows = Math.min(Math.max(widgetData.rows, minRows), maxRows);

                const widget = await createWidget(
                    widgetData.url,
                    columns,
                    rows
                );
                console.log('Created widget:', widget);
                widget.setAttribute('data-order', widgetData.order);
                widget.style.order = widgetData.order;
                widgetContainer.appendChild(widget);
            }
        }
    } catch (error) {
        console.error('Error loading widget state:', error);
    }
}

export { saveWidgetState, loadWidgetState };