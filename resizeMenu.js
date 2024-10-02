import emojiList from './unicodeEmoji.js';
import { saveWidgetState } from './localStorage.js';


function resizeHorizontally(widget, increase = true) {
    try {
        const currentWidth = parseInt(widget.style.width, 10);
        const newWidth = increase ? currentWidth + 20 : currentWidth - 20;
        widget.style.width = `${newWidth}px`;
        console.log(`Widget resized horizontally to ${newWidth}px`);
    } catch (error) {
        console.error('Error resizing widget horizontally:', error);
    }
}

function resizeVertically(widget, increase = true) {
    try {
        const currentHeight = parseInt(widget.style.height, 10);
        const newHeight = increase ? currentHeight + 20 : currentHeight - 20;
        widget.style.height = `${newHeight}px`;
        console.log(`Widget resized vertically to ${newHeight}px`);
    } catch (error) {
        console.error('Error resizing widget vertically:', error);
    }
}

function enlarge(widget) {
    try {
        resizeHorizontally(widget, true);
        resizeVertically(widget, true);
        console.log('Widget enlarged');
    } catch (error) {
        console.error('Error enlarging widget:', error);
    }
}

function shrink(widget) {
    try {
        resizeHorizontally(widget, false);
        resizeVertically(widget, false);
        console.log('Widget shrunk');
    } catch (error) {
        console.error('Error shrinking widget:', error);
    }
}

function showResizeMenu(icon) {
    try {
        const widget = icon.parentElement;
        let menu = widget.querySelector('.resize-menu');
        if (!menu) {
            menu = document.createElement('div');
            menu.className = 'resize-menu';

            // Horizontal Increase Button
            const horizontalIncreaseButton = document.createElement('button');
            horizontalIncreaseButton.innerHTML = emojiList.arrowRight.unicode;
            horizontalIncreaseButton.addEventListener('click', () => resizeHorizontally(widget, true));

            // Horizontal Decrease Button   
            const horizontalDecreaseButton = document.createElement('button');
            horizontalDecreaseButton.innerHTML = emojiList.arrowLeft.unicode;
            horizontalDecreaseButton.addEventListener('click', () => resizeHorizontally(widget, false));

            // Vertical Increase Button
            const verticalIncreaseButton = document.createElement('button');
            verticalIncreaseButton.innerHTML = emojiList.arrowUp.unicode;
            verticalIncreaseButton.addEventListener('click', () => resizeVertically(widget, false));

            // Vertical Decrease Button
            const verticalDecreaseButton = document.createElement('button');
            verticalDecreaseButton.innerHTML = emojiList.arrowDown.unicode;
            verticalDecreaseButton.addEventListener('click', () => resizeVertically(widget, true));

            menu.appendChild(verticalDecreaseButton);
            menu.appendChild(horizontalIncreaseButton);
            menu.appendChild(verticalIncreaseButton);
            menu.appendChild(horizontalDecreaseButton);

            widget.appendChild(menu);

            // Add event listeners to the menu itself
            menu.addEventListener('mouseover', () => {
                console.log('Mouse over resize menu');
                menu.style.display = 'block';
            });
            menu.addEventListener('mouseout', (event) => {
                console.log('Mouse out resize menu');
                if (!event.relatedTarget || !event.relatedTarget.classList.contains('widget-icon-resize')) {
                    menu.style.diadjustWidgetSizesplay = 'none';
                }
            });
        }
        menu.style.display = 'block';
        console.log('Resize menu shown');
        console.log('Resize menu display status:', menu.style.display);
    } catch (error) {
        console.error('Error showing resize menu:', error);
    }
}

function hideResizeMenu(icon) {
    try {
        const widget = icon.parentElement;
        const menu = widget.querySelector('.resize-menu');
        if (menu) {
            menu.style.display = 'none';
            console.log('Resize menu hidden');
            console.log('Resize menu display status:', menu.style.display);
        }
    } catch (error) {
        console.error('Error hiding resize menu:', error);
    }
}

function showResizeMenuBlock(icon, widgetWrapper) {
    // If a menu already exists, remove it
    let existingMenu = widgetWrapper.querySelector('.resize-menu-block');
    if (existingMenu) {
        existingMenu.remove();
    }

    const menu = document.createElement('div');
    menu.className = 'resize-menu-block';

    // List of grid options
    const gridOptions = [];
    for (let cols = 1; cols <= 4; cols++) {
        for (let rows = 1; rows <= 4; rows++) {
            gridOptions.push({ cols, rows });
        }
    }

    gridOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = `${option.cols} columns, ${option.rows} rows`;
        button.addEventListener('click', () => {
            adjustWidgetSize(widgetWrapper, option.cols, option.rows);
            menu.remove();
            saveWidgetState();
        });
        menu.appendChild(button);
    });

    // Position the menu
    menu.style.position = 'absolute';
    menu.style.top = '30px';
    menu.style.right = '5px';
    menu.style.zIndex = '20';

    widgetWrapper.appendChild(menu);
}

function adjustWidgetSize(widgetWrapper, columns, rows) {
    widgetWrapper.dataset.columns = columns;
    widgetWrapper.dataset.rows = rows;
    widgetWrapper.style.gridColumn = `span ${columns}`;
    widgetWrapper.style.gridRow = `span ${rows}`;
    console.log(`Widget resized to ${columns} columns and ${rows} rows`);
}


export { resizeHorizontally, resizeVertically, enlarge, shrink, showResizeMenu, hideResizeMenu, showResizeMenuBlock, adjustWidgetSize };