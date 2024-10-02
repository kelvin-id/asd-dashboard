import { createWidget } from './widgetManagement.js';

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

function loadWidgetState() {
    try {
        const savedState = JSON.parse(localStorage.getItem('widgetState'));
        console.log('Loaded widget state from localStorage:', savedState);
        if (savedState) {
            const widgetContainer = document.getElementById('widget-container');
            widgetContainer.innerHTML = ''; // Clear existing widgets
            savedState.forEach(widgetData => {
                console.log('Creating widget with data:', widgetData);
                const widget = createWidget(
                    widgetData.url,
                    parseInt(widgetData.columns),
                    parseInt(widgetData.rows)
                );
                widget.setAttribute('data-order', widgetData.order);
                widget.style.order = widgetData.order;
                widgetContainer.appendChild(widget);
            });
        }
    } catch (error) {
        console.error('Error loading widget state:', error);
    }
}

export { saveWidgetState, loadWidgetState };