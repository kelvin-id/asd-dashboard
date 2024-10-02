import { addWidget, removeWidget, updateWidgetOrders, createWidget, handleDragStart, handleDrop, handleDragOver, handleDragLeave } from './widgetManagement.js';
import { toggleBoardboardMode, toggleButtons, exitBoardboardMode } from './boardboardMode.js';
import { saveWidgetState } from './localStorage.js';
import emojiList from './unicodeEmoji.js';

let uiInitialized = false; // Guard variable

// function initializeUIInteractions() {
//     if (uiInitialized) return; // Guard clause
//     uiInitialized = true;

    // document.getElementById('add-widget-button').addEventListener('click', () => {
    //     const serviceSelector = document.getElementById('service-selector');
    //     const widgetUrlInput = document.getElementById('widget-url');
    //     const url = serviceSelector.value || widgetUrlInput.value;

    //     console.log('Add Widget Button Clicked');

    //     if (url) {
    //         addWidget(url);
    //         attachDragAndDropListeners(document.querySelector('#widget-container .widget-wrapper:last-child'));
    //     } else {
    //         alert('Please select a service or enter a URL.');
    //     }
    // });

    // document.getElementById('toggle-widget-order').addEventListener('click', toggleBoardboardMode);
    // document.getElementById('toggle-widget-buttons').addEventListener('click', toggleButtons);
    // document.getElementById('save-widget-order').addEventListener('click', exitBoardboardMode);

    // document.getElementById('reset-button').addEventListener('click', () => {
    //     localStorage.clear();
    //     location.reload();
    // });

    // Initialize drag-and-drop for existing widgets
    document.querySelectorAll('.widget-wrapper').forEach(attachDragAndDropListeners);

    // Add event listener for the widget container to handle drag and drop
    // const widgetContainer = document.getElementById('widget-container');
    // widgetContainer.addEventListener('dragover', handleDragOver);
    // widgetContainer.addEventListener('drop', (e) => {
    //     handleDrop(e);
    //     saveWidgetState();
    // });
// }

// function attachDragAndDropListeners(widget) {
//     const dragHandle = widget.querySelector('.drag-handle');
//     if (!dragHandle) {
//         console.error('Drag handle not found for widget:', widget);
//         return;
//     }

//     dragHandle.innerHTML = emojiList.pinching.icon;
//     dragHandle.draggable = true;

//     dragHandle.addEventListener('dragstart', (e) => {
//         console.log('Drag start event triggered for widget');
//         handleDragStart(e);
//         widget.classList.add('dragging');
//     });

//     dragHandle.addEventListener('dragend', (e) => {
//         console.log('Drag end event triggered for widget');
//         widget.classList.remove('dragging');
//     });

//     widget.addEventListener('dragover', (e) => {
//         e.preventDefault();
//         console.log('Drag over event triggered for widget');
//         widget.classList.add('drag-over');
//     });

//     widget.addEventListener('dragleave', (e) => {
//         console.log('Drag leave event triggered for widget');
//         widget.classList.remove('drag-over');
//     });

//     widget.addEventListener('drop', (e) => {
//         e.preventDefault();
//         console.log('Drop event triggered for widget');
//         handleDrop(e);
//         widget.classList.remove('drag-over');
//         saveWidgetState();
//     });

//     console.log('Drag and drop event listeners attached to widget:', widget);
// }

// document.addEventListener('DOMContentLoaded', initializeUIInteractions);

// export { initializeUIInteractions };