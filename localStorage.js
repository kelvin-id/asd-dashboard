import { createWidget, getConfig } from './widgetManagement.js';
import { fetchServices } from './fetchServices.js';

async function saveWidgetState() {
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
            const config = await getConfig();
            const services = await fetchServices();
            console.log('Fetched services:', services);
            const widgetContainer = document.getElementById('widget-container');
            widgetContainer.innerHTML = '';
            for (const widgetData of savedState) {
                console.log('Creating widget with data:', widgetData);
                const serviceConfig = services.find(service => service.url === widgetData.url)?.config || {};
                console.log('Service config for URL:', widgetData.url, serviceConfig);

                const minColumns = serviceConfig.minColumns || config.styling.grid.minColumns;
                const maxColumns = serviceConfig.maxColumns || config.styling.grid.maxColumns;
                const minRows = serviceConfig.minRows || config.styling.grid.minRows;
                const maxRows = serviceConfig.maxRows || config.styling.grid.maxRows;

                const columns = Math.min(Math.max(widgetData.columns, minColumns), maxColumns);
                const rows = Math.min(Math.max(widgetData.rows, minRows), maxRows);

                const service = await getServiceFromUrl(widgetData.url);
                console.log('Extracted service for URL:', widgetData.url, service);
                const widgetWrapper = await createWidget(service, widgetData.url, columns, rows);
                widgetWrapper.dataset.order = widgetData.order;
                widgetWrapper.style.order = widgetData.order;
                widgetContainer.appendChild(widgetWrapper);
                console.log('Created widget:', widgetWrapper);
            }
        }
    } catch (error) {
        console.error('Error loading widget state:', error);
    }
}

async function getServiceFromUrl(url) {
    try {
        const services = await fetchServices();
        console.log('Matching URL:', url);
        const service = services.find(service => url.startsWith(service.url));
        console.log('Matched service:', service);
        return service ? service.name : 'defaultService';
    } catch (error) {
        console.error('Error in getServiceFromUrl:', error);
        return 'defaultService';
    }
}

export { saveWidgetState, loadWidgetState };
