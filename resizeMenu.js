import emojiList from './unicodeEmoji.js';
import { saveWidgetState } from './localStorage.js';

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

async function resizeHorizontally(widget, increase = true) {
    try {
        const config = await getConfig();
        let currentSpan = parseInt(widget.dataset.columns) || config.styling.grid.minColumns;
        let newSpan = increase ? currentSpan + 1 : currentSpan - 1;
        newSpan = Math.min(Math.max(newSpan, config.styling.grid.minColumns), config.styling.grid.maxColumns); // Apply constraints
        widget.dataset.columns = newSpan;
        widget.style.gridColumn = `span ${newSpan}`;
        console.log(`Widget resized horizontally to span ${newSpan} columns`);
        saveWidgetState();
    } catch (error) {
        console.error('Error resizing widget horizontally:', error);
    }
}

async function resizeVertically(widget, increase = true) {
    try {
        const config = await getConfig();
        let currentSpan = parseInt(widget.dataset.rows) || config.styling.grid.minRows;
        let newSpan = increase ? currentSpan + 1 : currentSpan - 1;
        newSpan = Math.min(Math.max(newSpan, config.styling.grid.minRows), config.styling.grid.maxRows); // Apply constraints
        widget.dataset.rows = newSpan;
        widget.style.gridRow = `span ${newSpan}`;
        console.log(`Widget resized vertically to span ${newSpan} rows`);
        saveWidgetState();
    } catch (error) {
        console.error('Error resizing widget vertically:', error);
    }
}

async function enlarge(widget) {
    try {
        await resizeHorizontally(widget, true);
        await resizeVertically(widget, true);
        console.log('Widget enlarged');
    } catch (error) {
        console.error('Error enlarging widget:', error);
    }
}

async function shrink(widget) {
    try {
        await resizeHorizontally(widget, false);
        await resizeVertically(widget, false);
        console.log('Widget shrunk');
    } catch (error) {
        console.error('Error shrinking widget:', error);
    }
}

async function showResizeMenu(icon) {
    try {
        const widget = icon.closest('.widget-wrapper');
        let menu = widget.querySelector('.resize-menu');

        if (!menu) {
            menu = document.createElement('div');
            menu.className = 'resize-menu';

            const horizontalIncreaseButton = document.createElement('button');
            horizontalIncreaseButton.innerHTML = emojiList.arrowRight.unicode;
            horizontalIncreaseButton.addEventListener('click', () => resizeHorizontally(widget, true));

            const horizontalDecreaseButton = document.createElement('button');
            horizontalDecreaseButton.innerHTML = emojiList.arrowLeft.unicode;
            horizontalDecreaseButton.addEventListener('click', () => resizeHorizontally(widget, false));

            const verticalIncreaseButton = document.createElement('button');
            verticalIncreaseButton.innerHTML = emojiList.arrowUp.unicode;
            verticalIncreaseButton.addEventListener('click', () => resizeVertically(widget, false));

            const verticalDecreaseButton = document.createElement('button');
            verticalDecreaseButton.innerHTML = emojiList.arrowDown.unicode;
            verticalDecreaseButton.addEventListener('click', () => resizeVertically(widget, true));

            menu.appendChild(verticalDecreaseButton);
            menu.appendChild(horizontalIncreaseButton);
            menu.appendChild(verticalIncreaseButton);
            menu.appendChild(horizontalDecreaseButton);

            widget.appendChild(menu);

            menu.addEventListener('mouseover', () => {
                console.log('Mouse over resize menu');
                menu.style.display = 'block';
            });
            menu.addEventListener('mouseout', (event) => {
                console.log('Mouse out resize menu');
                if (!event.relatedTarget || !event.relatedTarget.classList.contains('widget-icon-resize')) {
                    menu.style.display = 'none';
                }
            });
        }
        menu.style.display = 'block';
        console.log('Resize menu shown');
    } catch (error) {
        console.error('Error showing resize menu:', error);
    }
}

async function hideResizeMenu(icon) {
    try {
        const widget = icon.closest('.widget-wrapper')
        const menu = widget.querySelector('.resize-menu');
        if (menu) {
            menu.style.display = 'none';
            console.log('Resize menu hidden');
        }
    } catch (error) {
        console.error('Error hiding resize menu:', error);
    }
}

async function showResizeMenuBlock(icon, widgetWrapper) {
    try {
        const config = await getConfig();
        let existingMenu = widgetWrapper.querySelector('.resize-menu-block');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'resize-menu-block';

        const gridOptions = [];
        for (let cols = config.styling.grid.minColumns; cols <= config.styling.grid.maxColumns; cols++) {
            for (let rows = config.styling.grid.minRows; rows <= config.styling.grid.maxRows; rows++) {
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

        menu.style.position = 'absolute';
        menu.style.top = '30px';
        menu.style.right = '5px';
        menu.style.zIndex = '20';

        menu.addEventListener('mouseleave', (event) => {
            console.log('Mouse left resize-menu-block');
            hideResizeMenuBlock(widgetWrapper);
        });

        widgetWrapper.appendChild(menu);
    } catch (error) {
        console.error('Error showing resize menu block:', error);
    }
}

async function hideResizeMenuBlock(widgetWrapper) {
    console.log('Removing resize menu block');
    try {
        const menu = widgetWrapper.querySelector('.resize-menu-block');
        if (menu) {
            menu.remove();
            console.log('Resize menu block hidden');
        } else {
            console.log('No resize menu block to hide');
        }
    } catch (error) {
        console.error('Error hiding resize menu block:', error);
    }
}

async function adjustWidgetSize(widgetWrapper, columns, rows) {
    try {
        const config = await getConfig();
        columns = Math.min(Math.max(columns, config.styling.grid.minColumns), config.styling.grid.maxColumns); // Apply constraints
        rows = Math.min(Math.max(rows, config.styling.grid.minRows), config.styling.grid.maxRows); // Apply constraints
        widgetWrapper.dataset.columns = columns;
        widgetWrapper.dataset.rows = rows;
        widgetWrapper.style.gridColumn = `span ${columns}`;
        widgetWrapper.style.gridRow = `span ${rows}`;
        console.log(`Widget resized to ${columns} columns and ${rows} rows`);
    } catch (error) {
        console.error('Error adjusting widget size:', error);
    }
}

export { resizeHorizontally, resizeVertically, enlarge, shrink, showResizeMenu, hideResizeMenu, showResizeMenuBlock, hideResizeMenuBlock, adjustWidgetSize };