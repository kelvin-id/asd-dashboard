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

    // Add existing buttons (remove, configure, resize, etc.) to widgetMenu...
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
    dragHandle.classList.add('drag-handle');
    dragHandle.innerHTML = emojiList.pinching.icon;
    dragHandle.draggable = true;
    widgetMenu.appendChild(dragHandle);

    // Attach drag event listeners to the drag handle
    dragHandle.addEventListener('dragstart', (e) => {
        console.log('Drag start event triggered');
        e.dataTransfer.setData('text/plain', widgetWrapper.getAttribute('data-order'));
        e.dataTransfer.effectAllowed = 'move';

        // Set the drag image to be the entire widget
        e.dataTransfer.setDragImage(widgetWrapper, 0, 0);

        widgetWrapper.classList.add('dragging');
        handleDragStart(e);
    });

    dragHandle.addEventListener('dragend', (e) => {
        console.log('Drag end event triggered');
        widgetWrapper.classList.remove('dragging');
        const allWidgets = document.querySelectorAll('.widget-wrapper');
        allWidgets.forEach(widget => widget.classList.remove('drag-over'));
    });

    console.log('Drag start event listener attached to drag handle');

    // Attach drop and dragover event listeners to the widget wrapper
    widgetWrapper.addEventListener('dragover', (e) => {
        console.log('Drag over event triggered on widget wrapper');
        e.preventDefault(); // Necessary to allow dropping
        handleDragOver(e);
    });

    widgetWrapper.addEventListener('drop', (e) => {
        console.log('Drop event triggered on widget wrapper');
        e.preventDefault();
        handleDrop(e);
    });

    widgetWrapper.addEventListener('dragleave', (e) => {
        console.log('Drag leave event triggered');
        handleDragLeave(e);
    });

    console.log('Drag over, drop, and drag leave event listeners attached to widget wrapper');

    // Append buttons to widget menu
    widgetMenu.appendChild(removeButton);
    widgetMenu.appendChild(configureButton);
    widgetMenu.appendChild(resizeMenuIcon);
    widgetMenu.appendChild(resizeMenuBlockIcon);

    // Append widget menu and iframe to widget wrapper
    widgetWrapper.appendChild(iframe);
    widgetWrapper.appendChild(widgetMenu);

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

function handleDragStart(e) {
    const widgetWrapper = e.target.closest('.widget-wrapper');
    const widgetOrder = widgetWrapper.getAttribute('data-order');
    console.log('Drag started for widget with order:', widgetOrder);
    e.dataTransfer.setData('text/plain', widgetOrder);
    e.dataTransfer.effectAllowed = 'move';
    console.log('Data transfer set with widget order:', widgetOrder);
}

function handleDrop(e) {
    e.preventDefault();
    console.log('Drop event target:', e.target);
    console.log('Drop event currentTarget:', e.currentTarget);
    const draggedOrder = e.dataTransfer.getData('text/plain');
    const targetWidgetWrapper = e.currentTarget;
    console.log('Target widget wrapper:', targetWidgetWrapper);
    const targetOrder = targetWidgetWrapper.getAttribute('data-order');

    console.log(`Drop event: draggedOrder=${draggedOrder}, targetOrder=${targetOrder}`);

    if (draggedOrder === null || targetOrder === null) {
        console.error('Invalid drag or drop target');
        return;
    }

    const widgetContainer = document.getElementById('widget-container');
    const widgets = Array.from(widgetContainer.children);

    const draggedWidget = widgets.find(widget => widget.getAttribute('data-order') === draggedOrder);
    const targetWidget = widgets.find(widget => widget.getAttribute('data-order') === targetOrder);

    if (!draggedWidget || !targetWidget) {
        console.error('Invalid widget elements for dragging or dropping');
        return;
    }

    console.log('Before swap:', {
        draggedWidgetOrder: draggedWidget.getAttribute('data-order'),
        targetWidgetOrder: targetWidget.getAttribute('data-order')
    });

    // Swap orders
    draggedWidget.setAttribute('data-order', targetOrder);
    targetWidget.setAttribute('data-order', draggedOrder);

    console.log('After swap:', {
        draggedWidgetOrder: draggedWidget.getAttribute('data-order'),
        targetWidgetOrder: targetWidget.getAttribute('data-order')
    });

    updateWidgetOrders();
    saveWidgetState();

    // Re-render widgets
    widgetContainer.innerHTML = '';
    widgets.sort((a, b) => parseInt(a.getAttribute('data-order')) - parseInt(b.getAttribute('data-order')));
    widgets.forEach(widget => widgetContainer.appendChild(widget));

    // Remove drag-over class from all widgets
    widgets.forEach(widget => widget.classList.remove('drag-over'));
}

function handleDragOver(e) {
    e.preventDefault();
    console.log('Drag over event target:', e.target);
    console.log('Drag over event currentTarget:', e.currentTarget);
    const dragOverTarget = e.currentTarget;
    console.log('Drag over target widget wrapper:', dragOverTarget);
    if (dragOverTarget) {
        dragOverTarget.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const dragLeaveTarget = e.currentTarget;
    if (dragLeaveTarget) {
        dragLeaveTarget.classList.remove('drag-over');
    }
}

export { addWidget, removeWidget, updateWidgetOrders, createWidget, handleDragStart, handleDrop, handleDragOver, handleDragLeave };
