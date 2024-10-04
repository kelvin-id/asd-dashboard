import { saveWidgetState } from './localStorage.js';
import { fetchData } from './fetchData.js';
import { showResizeMenu, hideResizeMenu, showResizeMenuBlock, hideResizeMenuBlock } from './resizeMenu.js';
import emojiList from './unicodeEmoji.js';
import { debounce } from './utils.js';
import { fetchServices } from './fetchServices.js';

async function getConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching config.json:', error);
        throw new Error('Failed to load configuration');
    }
}

async function createWidget(service, url, gridColumnSpan = 1, gridRowSpan = 1) {
    console.log('Creating widget with URL:', url);
    const config = await getConfig();
    const services = await fetchServices();
    const serviceConfig = services.find(s => s.name === service)?.config || {};
    const minColumns = serviceConfig.minColumns || config.styling.grid.minColumns;
    const maxColumns = serviceConfig.maxColumns || config.styling.grid.maxColumns;
    const minRows = serviceConfig.minRows || config.styling.grid.minRows;
    const maxRows = serviceConfig.maxRows || config.styling.grid.maxRows;

    const widgetWrapper = document.createElement('div');
    widgetWrapper.className = 'widget-wrapper';
    widgetWrapper.style.position = 'relative';
    widgetWrapper.dataset.service = service;
    widgetWrapper.dataset.url = url;
    console.log(`Creating widget for service: ${service}`);

    gridColumnSpan = Math.min(Math.max(gridColumnSpan, minColumns), maxColumns);
    gridRowSpan = Math.min(Math.max(gridRowSpan, minRows), maxRows);

    widgetWrapper.style.gridColumn = `span ${gridColumnSpan}`;
    widgetWrapper.style.gridRow = `span ${gridRowSpan}`;
    widgetWrapper.dataset.columns = gridColumnSpan;
    widgetWrapper.dataset.rows = gridRowSpan;

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

    const widgetMenu = document.createElement('div');
    widgetMenu.classList.add('widget-menu');

    const removeButton = document.createElement('button');
    removeButton.innerHTML = emojiList.cross.unicode;
    removeButton.classList.add('widget-button', 'remove');
    removeButton.addEventListener('click', () => {
        removeWidget(widgetWrapper);
    });

    const configureButton = document.createElement('button');
    configureButton.innerHTML = emojiList.link.unicode;
    configureButton.classList.add('widget-button', 'widget-icon-configure');
    configureButton.addEventListener('click', () => {
        configureWidget(iframe);
    });

    const buttonDebounce = 100;

    const debouncedHideResizeMenu = debounce((icon) => {
        hideResizeMenu(icon);
    }, buttonDebounce);

    const debouncedHideResizeMenuBlock = debounce((widgetWrapper) => {
        hideResizeMenuBlock(widgetWrapper);
    }, buttonDebounce);

    const resizeMenuIcon = document.createElement('button');
    resizeMenuIcon.innerHTML = emojiList.triangularRuler.unicode;
    resizeMenuIcon.classList.add('widget-button', 'widget-icon-resize');
    resizeMenuIcon.addEventListener('mouseenter', () => {
        console.log('Mouse enter resize menu icon');
        showResizeMenu(resizeMenuIcon);
    });
    resizeMenuIcon.addEventListener('mouseleave', (event) => {
        console.log('Mouse left resize menu icon');
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('resize-menu')) {
            debouncedHideResizeMenu(resizeMenuIcon);
        }
    });

    const resizeMenuBlockIcon = document.createElement('button');
    resizeMenuBlockIcon.innerHTML = emojiList.puzzle.unicode;
    resizeMenuBlockIcon.classList.add('widget-button', 'widget-icon-resize-block');
    resizeMenuBlockIcon.addEventListener('mouseenter', () => {
        showResizeMenuBlock(resizeMenuBlockIcon, widgetWrapper);
    });

    resizeMenuBlockIcon.addEventListener('mouseleave', (event) => {
        console.log('Mouse left resize menu block icon');
        const related = event.relatedTarget;
        if (!related || !related.closest('.resize-menu-block')) {
            debouncedHideResizeMenuBlock(widgetWrapper);
        }
    });

    const dragHandle = document.createElement('span');
    dragHandle.classList.add('widget-icon-drag', 'widget-button');
    dragHandle.innerHTML = emojiList.pinching.icon;
    dragHandle.draggable = true;
    widgetMenu.appendChild(dragHandle);

    const fullScreenButton = document.createElement('button');
    fullScreenButton.innerHTML = emojiList.fullscreen.unicode;
    fullScreenButton.classList.add('widget-button', 'fullscreen-btn');
    widgetMenu.appendChild(fullScreenButton);

    widgetMenu.appendChild(removeButton);
    widgetMenu.appendChild(configureButton);
    widgetMenu.appendChild(resizeMenuIcon);
    widgetMenu.appendChild(resizeMenuBlockIcon);

    widgetWrapper.appendChild(iframe);
    widgetWrapper.appendChild(widgetMenu);

    dragHandle.addEventListener('dragstart', (e) => {
        console.log('Drag start event triggered');
        e.dataTransfer.setData('text/plain', widgetWrapper.getAttribute('data-order'));
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setDragImage(widgetWrapper, 0, 0);
        widgetWrapper.classList.add('dragging');
        handleDragStart(e, widgetWrapper);
    });

    dragHandle.addEventListener('dragend', (e) => {
        console.log('Drag end event triggered');
        widgetWrapper.classList.remove('dragging');
        handleDragEnd(e);
    });

    console.log('Drag start event listener attached to drag handle');
    console.log('Widget created with grid spans:', {
        columns: gridColumnSpan,
        rows: gridRowSpan
    });

    return widgetWrapper;
}

async function addWidget(url) {
    console.log('Adding widget with URL:', url);
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) {
        console.error('Widget container not found');
        return;
    }
    const service = await getServiceFromUrl(url);
    console.log('Extracted service:', service);
    const widgetWrapper = await createWidget(service, url);
    widgetWrapper.setAttribute('data-order', widgetContainer.children.length);
    widgetContainer.appendChild(widgetWrapper);

    console.log('Widget appended to container:', widgetWrapper);

    const services = await fetchServices();
    const serviceObj = services.find(s => s.name === service);
    if (serviceObj && serviceObj.type === 'api') {
        fetchData(url, data => {
            displayDataInIframe(widgetWrapper.querySelector('iframe'), data);
        });
    }

    saveWidgetState();
}

async function getServiceFromUrl(url) {
    const services = await fetchServices();
    console.log('Matching URL:', url);
    const service = services.find(service => url.startsWith(service.url));
    console.log('Matched service:', service);
    return service ? service.name : 'defaultService';
}

function removeWidget(widgetElement) {
    widgetElement.remove();
    updateWidgetOrders();
    saveWidgetState();
}

async function configureWidget(iframeElement) {
    const newUrl = prompt('Enter new URL for the widget:', iframeElement.src);
    if (newUrl) {
        const service = await getServiceFromUrl(newUrl);
        const services = await fetchServices();
        const serviceObj = services.find(s => s.name === service);
        iframeElement.src = newUrl;
        if (serviceObj && serviceObj.type === 'api') {
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

function updateWidgetOrders() {
    const widgetContainer = document.getElementById('widget-container');
    const widgets = Array.from(widgetContainer.children);

    widgets.forEach((widget, index) => {
        widget.setAttribute('data-order', index);
        widget.style.order = index;
        console.log('Updated widget order:', {
            widget: widget,
            order: index
        });
    });

    saveWidgetState();
}

function handleDragStart(e, draggedWidgetWrapper) {
    const widgetOrder = draggedWidgetWrapper.getAttribute('data-order');
    console.log('Drag started for widget with order:', widgetOrder);
    e.dataTransfer.setData('text/plain', widgetOrder);
    e.dataTransfer.effectAllowed = 'move';
    console.log('Data transfer set with widget order:', widgetOrder);

    const widgetContainer = document.getElementById('widget-container');
    const widgets = Array.from(widgetContainer.children);
    widgets.forEach(widget => {
        if (widget !== draggedWidgetWrapper) {
            addDragOverlay(widget);
        }
    });
}

function handleDragEnd(e) {
    const widgetContainer = document.getElementById('widget-container');
    const widgets = Array.from(widgetContainer.children);
    widgets.forEach(widget => {
        removeDragOverlay(widget);
        widget.classList.remove('drag-over');
    });
}

function addDragOverlay(widgetWrapper) {
    const dragOverlay = document.createElement('div');
    dragOverlay.classList.add('drag-overlay');

    dragOverlay.style.position = 'absolute';
    dragOverlay.style.top = '0';
    dragOverlay.style.left = '0';
    dragOverlay.style.width = '100%';
    dragOverlay.style.height = '100%';
    dragOverlay.style.zIndex = '10000';
    dragOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';

    dragOverlay.addEventListener('dragover', (e) => {
        e.preventDefault();
        handleDragOver(e, widgetWrapper);
    });

    dragOverlay.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDrop(e, widgetWrapper);
    });

    widgetWrapper.appendChild(dragOverlay);
    widgetWrapper.classList.add('has-overlay');
}

function removeDragOverlay(widgetWrapper) {
    const dragOverlay = widgetWrapper.querySelector('.drag-overlay');
    if (dragOverlay) {
        dragOverlay.remove();
    }
    widgetWrapper.classList.remove('has-overlay');
}

function handleDrop(e, targetWidgetWrapper) {
    e.preventDefault();
    console.log('Drop event on overlay for widget:', targetWidgetWrapper);

    const draggedOrder = e.dataTransfer.getData('text/plain');
    const targetOrder = targetWidgetWrapper.getAttribute('data-order');

    console.log(`Drop event: draggedOrder=${draggedOrder}, targetOrder=${targetOrder}`);

    if (draggedOrder === null || targetOrder === null) {
        console.error('Invalid drag or drop target');
        return;
    }

    const widgetContainer = document.getElementById('widget-container');

    const draggedWidget = widgetContainer.querySelector(`[data-order='${draggedOrder}']`);
    const targetWidget = widgetContainer.querySelector(`[data-order='${targetOrder}']`);

    if (!draggedWidget || !targetWidget) {
        console.error('Invalid widget elements for dragging or dropping');
        return;
    }

    console.log('Before rearrangement:', {
        draggedWidgetOrder: draggedWidget.getAttribute('data-order'),
        targetWidgetOrder: targetWidget.getAttribute('data-order')
    });

    widgetContainer.removeChild(draggedWidget);

    if (parseInt(draggedOrder) < parseInt(targetOrder)) {
        if (targetWidget.nextSibling) {
            widgetContainer.insertBefore(draggedWidget, targetWidget.nextSibling);
        } else {
            widgetContainer.appendChild(draggedWidget);
        }
    } else {
        widgetContainer.insertBefore(draggedWidget, targetWidget);
    }

    const updatedWidgets = Array.from(widgetContainer.children);
    updatedWidgets.forEach(widget => widget.classList.remove('drag-over'));

    updateWidgetOrders();
}

function handleDragOver(e, widgetWrapper) {
    e.preventDefault();
    console.log('Drag over event on overlay for widget:', widgetWrapper);
    widgetWrapper.classList.add('drag-over');
}

function handleDragLeave(e, widgetWrapper) {
    console.log('Drag leave event on overlay for widget:', widgetWrapper);
    widgetWrapper.classList.remove('drag-over');
}

export { addWidget, removeWidget, updateWidgetOrders, createWidget, handleDragStart, handleDrop, handleDragOver, handleDragLeave, getConfig };
