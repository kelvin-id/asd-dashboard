import { addWidget, reorderWidgets } from './widgetManagement.js';
import { toggleBoardboardMode, toggleButtons, exitBoardboardMode } from './boardboardMode.js';

function initializeUIInteractions() {
    document.getElementById('add-widget-button').addEventListener('click', () => {
        const serviceSelector = document.getElementById('service-selector');
        const widgetUrlInput = document.getElementById('widget-url');
        const url = serviceSelector.value || widgetUrlInput.value;

        if (url) {
            addWidget(url);
        } else {
            alert('Please select a service or enter a URL.');
        }
    });

    document.getElementById('widget-order-selector').addEventListener('change', () => {
        const orderCriteria = document.getElementById('widget-order-selector').value;
        reorderWidgets(orderCriteria);
    });

    document.getElementById('toggle-widget-order').addEventListener('click', toggleBoardboardMode);
    document.getElementById('toggle-widget-buttons').addEventListener('click', toggleButtons);
    document.getElementById('save-widget-order').addEventListener('click', exitBoardboardMode);
}

export { initializeUIInteractions };