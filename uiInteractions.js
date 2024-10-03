import { addWidget } from './widgetManagement.js';
import { toggleBoardboardMode, toggleButtons, exitBoardboardMode } from './boardboardMode.js';

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

}

export { initializeUIInteractions };