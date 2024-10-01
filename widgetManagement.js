import { saveWidgetState } from './localStorage.js';
import { fetchData } from './fetchData.js';
import { debounce } from './utils.js';

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

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    widgetWrapper.appendChild(resizeHandle);

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

    widgetWrapper.appendChild(iframe);
    widgetWrapper.appendChild(removeButton);
    widgetWrapper.appendChild(configureButton);

    widgetWrapper.style.width = width;
    widgetWrapper.style.height = height;
    console.log('Widget created with size:', {
        width: widgetWrapper.style.width,
        height: widgetWrapper.style.height
    });

    // Add resize functionality
    addResizeFunctionality(widgetWrapper, resizeHandle);

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

function addResizeFunctionality(widgetWrapper, resizeHandle) {
    let isResizing = false;
    let lastDownX = 0;
    let lastDownY = 0;

    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        lastDownX = e.clientX;
        lastDownY = e.clientY;
        e.preventDefault();
        e.stopPropagation();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;

        let offsetX = e.clientX - lastDownX;
        let offsetY = e.clientY - lastDownY;

        let newWidth = parseInt(getComputedStyle(widgetWrapper, '').width) + offsetX;
        let newHeight = parseInt(getComputedStyle(widgetWrapper, '').height) + offsetY;

        if (newWidth > 100) { // minimum width
            widgetWrapper.style.width = newWidth + 'px';
            lastDownX = e.clientX;
        }
        if (newHeight > 100) { // minimum height
            widgetWrapper.style.height = newHeight + 'px';
            lastDownY = e.clientY;
        }

        // We can optionally save state here if you want real-time saving
        // But it's more efficient to save once after resizing ends
    });

    document.addEventListener('mouseup', function(e) {
        isResizing = true;
        if (isResizing) {
            console.log('Saving resize state');
            isResizing = false;
            debounce(saveWidgetState, 1000); // Save sizes after resizing ends
        }
    });
}


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