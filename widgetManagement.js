import { saveWidgetState } from './localStorage.js';
import { fetchData } from './fetchData.js';
import { debounce } from './utils.js';
import { resizeHorizontally, resizeVertically, enlarge, shrink, showResizeMenu, hideResizeMenu } from './resizeMenu.js';

let services = [];

function createWidget(url, width = '300px', height = '200px') {
    console.log('Creating widget with URL:', url);
    const widgetWrapper = document.createElement('div');
    widgetWrapper.className = 'widget-wrapper';
    widgetWrapper.draggable = true;

    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.border = '1px solid #ccc';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    iframe.onload = () => {
        console.log('Iframe loaded successfully:', url);
    };

    iframe.onerror = () => {
        console.error('Error loading iframe:', url);
    };

    const removeButton = document.createElement('button');
    removeButton.innerHTML = '&#x274C;';
    removeButton.classList.add('widget-button');
    removeButton.addEventListener('click', () => {
        removeWidget(widgetWrapper);
    });

    const configureButton = document.createElement('button');
    configureButton.innerHTML = '&#x1F527;';
    configureButton.classList.add('widget-button', 'configure');
    configureButton.addEventListener('click', () => {
        configureWidget(iframe);
    });

    const resizeMenuIcon = document.createElement('button');
    resizeMenuIcon.innerHTML = '&#128269;';
    resizeMenuIcon.classList.add('widget-button', 'resize-menu-icon');
    resizeMenuIcon.addEventListener('mouseover', () => {
        console.log('Mouse over resize menu icon');
        showResizeMenu(resizeMenuIcon);
    });
    resizeMenuIcon.addEventListener('mouseout', (event) => {
        console.log('Mouse out resize menu icon');
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('resize-menu')) {
            hideResizeMenu(resizeMenuIcon);
        }
    });

    widgetWrapper.appendChild(iframe);
    widgetWrapper.appendChild(removeButton);
    widgetWrapper.appendChild(configureButton);
    widgetWrapper.appendChild(resizeMenuIcon);

    widgetWrapper.style.width = width;
    widgetWrapper.style.height = height;
    console.log('Widget created with size:', {
        width: widgetWrapper.style.width,
        height: widgetWrapper.style.height
    });

    return widgetWrapper;
}

function addWidget(url, width = '300px', height = '200px') {
    console.log('Adding widget with URL:', url);
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) {
        console.error('Widget container not found');
        return;
    }

    const widget = createWidget(url, width, height);
    widget.setAttribute('data-order', widgetContainer.children.length + 1);
    widgetContainer.appendChild(widget);

    console.log('Widget appended to container:', widget);

    const service = services.find(service => service.url === url);
    if (service && service.type === 'api') {
        fetchData(url, data => {
            displayDataInIframe(widget.querySelector('iframe'), data);
        });
    }

    saveWidgetState();
}

function removeWidget(widgetElement) {
    widgetElement.remove();
    updateWidgetOrders();
    saveWidgetState();
}

function configureWidget(iframeElement) {
    const newUrl = prompt('Enter new URL for the widget:', iframeElement.src);
    if (newUrl) {
        iframeElement.src = newUrl;
        const service = services.find(service => service.url === newUrl);
        if (service && service.type === 'api') {
            fetchData(newUrl, data => {
                displayDataInIframe(iframeElement, data);
            });
        }
        saveWidgetState();
    }
}

function displayDataInIframe(iframe, data) {
    if (iframe.contentWindow) {
        const message = JSON.stringify(data, null, 2);
        iframe.contentWindow.postMessage(message, '*');
    } else {
        console.error('Unable to access iframe contentWindow');
    }
}

function reorderWidgets(criteria) {
    const widgetContainer = document.getElementById('widget-container');
    const widgets = Array.from(widgetContainer.children);

    widgets.sort((a, b) => {
        const iframeA = a.querySelector('iframe').src;
        const iframeB = b.querySelector('iframe').src;
        if (criteria === 'name') {
            const nameA = services.find(service => service.url === iframeA).name;
            const nameB = services.find(service => service.url === iframeB).name;
            return nameA.localeCompare(nameB);
        } else if (criteria === 'url') {
            return iframeA.localeCompare(iframeB);
        }
    });

    widgetContainer.innerHTML = '';
    widgets.forEach((widget, index) => {
        widget.setAttribute('data-order', index + 1);
        widget.style.order = index + 1;
        widgetContainer.appendChild(widget);
    });

    saveWidgetState();
}

function updateWidgetOrders() {
    const widgetContainer = document.getElementById('widget-container');
    const widgets = Array.from(widgetContainer.children);
    widgets.forEach((widget, index) => {
        widget.setAttribute('data-order', index + 1);
        widget.style.order = index + 1;
    });
}

// Ensure to export necessary functions
export {
    services,
    createWidget,
    addWidget,
    removeWidget,
    configureWidget,
    displayDataInIframe,
    reorderWidgets,
    updateWidgetOrders
};