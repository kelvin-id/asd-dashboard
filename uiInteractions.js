import { addWidget, reorderWidgets } from './widgetManagement.js';
import { saveWidgetState } from './localStorage.js';
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

    document.getElementById('order-selector').addEventListener('change', () => {
        const orderCriteria = document.getElementById('order-selector').value;
        reorderWidgets(orderCriteria);
    });

    document.getElementById('toggle-widget-order').addEventListener('click', toggleBoardboardMode);
    document.getElementById('toggle-buttons').addEventListener('click', toggleButtons);
    document.getElementById('save-boardboard').addEventListener('click', exitBoardboardMode);
}

export { initializeUIInteractions };