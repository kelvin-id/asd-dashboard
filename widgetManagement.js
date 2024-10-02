import { saveWidgetState } from './localStorage.js';
import { fetchData } from './fetchData.js';
import { showResizeMenu, hideResizeMenu, showResizeMenuBlock, hideResizeMenuBlock } from './resizeMenu.js';
import emojiList from './unicodeEmoji.js';
import { debounce } from './utils.js';

let services = [];

function createWidget(url, gridColumnSpan = 1, gridRowSpan = 1) {
    console.log('Creating widget with URL:', url);
    const widgetWrapper = document.createElement('div');
    widgetWrapper.className = 'widget-wrapper';
    widgetWrapper.style.position = 'relative'; // Ensure widgetWrapper has position: relative

    // Set initial grid spans
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

    // Create widget menu wrapper
    const widgetMenu = document.createElement('div');
    widgetMenu.classList.add('widget-menu');

    // Add existing buttons (remove, configure, resize, etc.) to widgetMenu
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

    // Resize menu icons
    const buttonDebounce = 100;

    // Debounced hide functions using debounce utility
    const debouncedHideResizeMenu = debounce((icon) => {
        hideResizeMenu(icon);
    }, buttonDebounce);

    const debouncedHideResizeMenuBlock = debounce((widgetWrapper) => {
        hideResizeMenuBlock(widgetWrapper);
    }, buttonDebounce);

    // resize-menu icon
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

    // resize-menu-block icon
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

    // Add drag handle
    const dragHandle = document.createElement('span');
    dragHandle.classList.add('widget-icon-drag');
    dragHandle.classList.add('widget-button');
    dragHandle.innerHTML = emojiList.pinching.icon;
    dragHandle.draggable = true;
    widgetMenu.appendChild(dragHandle);

    // Add full-screen button
    const fullScreenButton = document.createElement('button');
    fullScreenButton.innerHTML = emojiList.fullscreen.unicode; // Full-screen icon (you can choose another if needed)
    fullScreenButton.classList.add('widget-button', 'fullscreen-btn');
    widgetMenu.appendChild(fullScreenButton);

    // Append buttons to widget menu
    widgetMenu.appendChild(removeButton);
    widgetMenu.appendChild(configureButton);
    widgetMenu.appendChild(resizeMenuIcon);
    widgetMenu.appendChild(resizeMenuBlockIcon);

    // Append iframe and widget menu to widget wrapper
    widgetWrapper.appendChild(iframe);
    widgetWrapper.appendChild(widgetMenu);

    // Attach drag event listeners to the drag handle
    dragHandle.addEventListener('dragstart', (e) => {
        console.log('Drag start event triggered');
        e.dataTransfer.setData('text/plain', widgetWrapper.getAttribute('data-order'));
        e.dataTransfer.effectAllowed = 'move';

        // Set the drag image to be the entire widget
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

function addWidget(url) {
    console.log('Adding widget with URL:', url);
    const widgetContainer = document.getElementById('widget-container');
    if (!widgetContainer) {
        console.error('Widget container not found');
        return;
    }
    const widget = createWidget(url);
    widget.setAttribute('data-order', widgetContainer.children.length);
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

function updateWidgetOrders() {
    const widgetContainer = document.getElementById('widget-container');
    const widgets = Array.from(widgetContainer.children);

    // Widgets are already in the correct order in the DOM, so update CSS 'order' and 'data-order' accordingly
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

    // Add dragOverlays to other widgets
    const widgetContainer = document.getElementById('widget-container');
    const widgets = Array.from(widgetContainer.children);
    widgets.forEach(widget => {
        if (widget !== draggedWidgetWrapper) {
            addDragOverlay(widget);
        }
    });
}

function handleDragEnd(e) {
    // Remove dragOverlays from all widgets
    const widgetContainer = document.getElementById('widget-container');
    const widgets = Array.from(widgetContainer.children);
    widgets.forEach(widget => {
        removeDragOverlay(widget);
        widget.classList.remove('drag-over');
    });
}

function addDragOverlay(widgetWrapper) {
    // Create the drag overlay
    const dragOverlay = document.createElement('div');
    dragOverlay.classList.add('drag-overlay');

    // Style the overlay to cover the entire widget
    dragOverlay.style.position = 'absolute';
    dragOverlay.style.top = '0';
    dragOverlay.style.left = '0';
    dragOverlay.style.width = '100%';
    dragOverlay.style.height = '100%';
    dragOverlay.style.zIndex = '10000'; // Ensure it sits above other elements
    dragOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Transparent background

    // Add event listeners to the overlay
    dragOverlay.addEventListener('dragover', (e) => {
        e.preventDefault();
        handleDragOver(e, widgetWrapper);
    });

    dragOverlay.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDrop(e, widgetWrapper);
    });

    // Attach the overlay to the widgetWrapper
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

    // Remove draggedWidget from its current position
    widgetContainer.removeChild(draggedWidget);

    // Insert draggedWidget before or after targetWidget based on their order
    if (parseInt(draggedOrder) < parseInt(targetOrder)) {
        // Insert after targetWidget
        if (targetWidget.nextSibling) {
            widgetContainer.insertBefore(draggedWidget, targetWidget.nextSibling);
        } else {
            widgetContainer.appendChild(draggedWidget);
        }
    } else {
        // Insert before targetWidget
        widgetContainer.insertBefore(draggedWidget, targetWidget);
    }

    // No need to update data-order attributes here if updateWidgetOrders will handle it
    // But if you prefer to update them here, you can do so

    // Remove drag-over class from all widgets
    const updatedWidgets = Array.from(widgetContainer.children);
    updatedWidgets.forEach(widget => widget.classList.remove('drag-over'));

    // Update widget orders
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

export { addWidget, removeWidget, updateWidgetOrders, createWidget, handleDragStart, handleDrop, handleDragOver, handleDragLeave };
