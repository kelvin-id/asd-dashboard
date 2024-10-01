import { createWidget } from './widgetManagement.js';

function saveWidgetState() {
    try {
        console.log('saveWidgetState function called');
        const widgetContainer = document.getElementById('widget-container');
        const widgets = Array.from(widgetContainer.children);
        const widgetState = widgets.map(widget => {
            const state = {
                order: widget.getAttribute('data-order'),
                width: widget.style.width,
                height: widget.style.height,
                url: widget.querySelector('iframe').src
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

function loadWidgetState() {
    try {
        const savedState = JSON.parse(localStorage.getItem('widgetState'));
        console.log('Loaded widget state from localStorage:', savedState);
        if (savedState) {
            const widgetContainer = document.getElementById('widget-container');
            widgetContainer.innerHTML = ''; // Clear existing widgets
            savedState.forEach(widgetData => {
                console.log('Creating widget with data:', widgetData);
                const widget = createWidget(widgetData.url, widgetData.width, widgetData.height);
                widget.style.order = widgetData.order;
                widget.setAttribute('data-order', widgetData.order);
                widget.style.width = widgetData.width || '300px';
                widget.style.height = widgetData.height || '200px';
                console.log('Widget created with size:', {
                    width: widget.style.width,
                    height: widget.style.height
                });
                widgetContainer.appendChild(widget);
            });
        }
    } catch (error) {
        console.error('Error loading widget state:', error);
    }
}

export { saveWidgetState, loadWidgetState };