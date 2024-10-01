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

            const horizontalButton = document.createElement('button');
            horizontalButton.innerHTML = '↔️';
            horizontalButton.addEventListener('click', () => resizeHorizontally(widget));

            const verticalButton = document.createElement('button');
            verticalButton.innerHTML = '↕️';
            verticalButton.addEventListener('click', () => resizeVertically(widget));

            const enlargeButton = document.createElement('button');
            enlargeButton.innerHTML = '⤢';
            enlargeButton.addEventListener('click', () => enlarge(widget));

            const shrinkButton = document.createElement('button');
            shrinkButton.innerHTML = '⤡';
            shrinkButton.addEventListener('click', () => shrink(widget));

            menu.appendChild(horizontalButton);
            menu.appendChild(verticalButton);
            menu.appendChild(enlargeButton);
            menu.appendChild(shrinkButton);

            widget.appendChild(menu);

            // Add event listeners to the menu itself
            menu.addEventListener('mouseover', () => {
                console.log('Mouse over resize menu');
                menu.style.display = 'block';
            });
            menu.addEventListener('mouseout', (event) => {
                console.log('Mouse out resize menu');
                if (!event.relatedTarget || !event.relatedTarget.classList.contains('resize-menu-icon')) {
                    menu.style.display = 'none';
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

export { resizeHorizontally, resizeVertically, enlarge, shrink, showResizeMenu, hideResizeMenu };