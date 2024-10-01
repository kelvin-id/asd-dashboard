document.addEventListener('DOMContentLoaded', () => {

    // Declare the services variable in a higher scope
    let services = [];

    // Fetch services from services.json and populate the service selector
    fetch('services.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(fetchedServices => {
            services = fetchedServices; // Assign the fetched services to the higher scope variable
            const serviceSelector = document.getElementById('service-selector');
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.url;
                option.textContent = service.name;
                serviceSelector.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching services:', error);
        });

    // Event listener for the "Add Widget" button
    document.getElementById('add-widget-button').addEventListener('click', () => {
        const serviceSelector = document.getElementById('service-selector');
        const widgetUrlInput = document.getElementById('widget-url');
        const url = serviceSelector.value || widgetUrlInput.value;

        if (url) {
            addWidget(url);
        } else {
            alert('Please select a service or enter a URL.');
        }
    });

    // Event listener for the order selector dropdown
    document.getElementById('order-selector').addEventListener('change', () => {
        const orderCriteria = document.getElementById('order-selector').value;
        reorderWidgets(orderCriteria);
    });

    // Event listeners for the new buttons
    document.getElementById('toggle-boardboard').addEventListener('click', toggleBoardboardMode);
    document.getElementById('toggle-buttons').addEventListener('click', toggleButtons);
    document.getElementById('save-boardboard').addEventListener('click', exitBoardboardMode);

    // Function to create and add a widget (iframe) to the widget container
    function addWidget(url) {
        const widgetContainer = document.getElementById('widget-container');
        if (!widgetContainer) {
            console.error('Widget container not found');
            return;
        }

        const widgetWrapper = document.createElement('div');
        widgetWrapper.className = 'widget-wrapper';
        widgetWrapper.setAttribute('data-order', widgetContainer.children.length + 1); // Set initial data-order
        widgetWrapper.draggable = true;

        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.border = '1px solid #ccc';
        iframe.style.width = '100%';
        iframe.style.height = '100%';

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

        widgetContainer.appendChild(widgetWrapper);

        // Fetch data and display it in the iframe if it's an API service
        const service = services.find(service => service.url === url);
        if (service && service.type === 'api') {
            fetchData(url, data => {
                displayDataInIframe(iframe, data);
            });
        }

        // Add resize functionality
        addResizeFunctionality(widgetWrapper);

        // Add drag and drop functionality
        addDragAndDropFunctionality(widgetWrapper);
    }

    function addResizeFunctionality(widgetWrapper) {
        const resizeHandle = widgetWrapper.querySelector('.resize-handle');

        function resize(e) {
            const width = e.clientX - widgetWrapper.getBoundingClientRect().left;
            const height = e.clientY - widgetWrapper.getBoundingClientRect().top;

            // Update widgetWrapper dimensions (iframe dimensions will follow as iframe is a child of widgetWrapper)
            widgetWrapper.style.width = width + 'px';
            widgetWrapper.style.height = height + 'px';

            console.log('Resizing: ', {
                widgetWrapper: { width: widgetWrapper.style.width, height: widgetWrapper.style.height }
            });

            // Ensure iframe content scales properly
            const iframe = widgetWrapper.querySelector('iframe');
            iframe.contentWindow.postMessage({ action: 'resize', width, height }, '*');
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResize);
            console.log('Resize stopped');
        }

        function startResize(e) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
            console.log('Resize started');

            // Immediate update on start resize
            const width = widgetWrapper.getBoundingClientRect().width;
            const height = widgetWrapper.getBoundingClientRect().height;
            widgetWrapper.style.width = width + 'px';
            widgetWrapper.style.height = height + 'px';

            console.log('Immediate update on start resize: ', {
                width: widgetWrapper.style.width,
                height: widgetWrapper.style.height
            });

            // Ensure iframe content scales properly
            const iframe = widgetWrapper.querySelector('iframe');
            iframe.contentWindow.postMessage({ action: 'resize', width, height }, '*');
        }

        resizeHandle.addEventListener('mousedown', startResize);

        // Initialize widgetWrapper dimensions
        widgetWrapper.style.width = '300px';
        widgetWrapper.style.height = '200px';

        // Set initial resize handle position
        resizeHandle.style.bottom = '0';
        resizeHandle.style.right = '0';
    }

    function addDragAndDropFunctionality(widgetWrapper) {
        widgetWrapper.addEventListener('dragstart', dragStart);
        widgetWrapper.addEventListener('dragover', dragOver);
        widgetWrapper.addEventListener('drop', drop);
        widgetWrapper.addEventListener('dragend', dragEnd);
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-order'));
        e.target.style.opacity = '0.5';
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const draggedOrder = e.dataTransfer.getData('text/plain');
        const targetOrder = e.target.closest('.widget-wrapper').getAttribute('data-order');

        if (draggedOrder !== targetOrder) {
            reorderWidgetsManually(draggedOrder, targetOrder);
        }
    }

    function dragEnd(e) {
        e.target.style.opacity = '1';
    }

    function reorderWidgetsManually(fromOrder, toOrder) {
        const widgetContainer = document.getElementById('widget-container');
        const widgets = Array.from(widgetContainer.children);

        const fromIndex = widgets.findIndex(w => w.getAttribute('data-order') === fromOrder);
        const toIndex = widgets.findIndex(w => w.getAttribute('data-order') === toOrder);

        if (fromIndex !== -1 && toIndex !== -1) {
            const [movedWidget] = widgets.splice(fromIndex, 1);
            widgets.splice(toIndex, 0, movedWidget);

            widgets.forEach((widget, index) => {
                widget.setAttribute('data-order', index + 1);
                widget.style.order = index + 1;
            });

            widgets.forEach(widget => widgetContainer.appendChild(widget));

            console.log('Widgets reordered manually:', widgets.map(w => w.getAttribute('data-order')));
            saveWidgetOrder(widgets.map(w => w.getAttribute('data-order')));
        }
    }

    // Function to reorder widgets based on selected criteria
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

        // Clear the container and append sorted widgets
        widgetContainer.innerHTML = '';
        widgets.forEach((widget, index) => {
            widget.setAttribute('data-order', index + 1);
            widget.style.order = index + 1;
            widgetContainer.appendChild(widget);
        });

        saveWidgetOrder(widgets.map(w => w.getAttribute('data-order')));
    }

    // Function to remove a widget
    function removeWidget(widgetElement) {
        widgetElement.remove();
        updateWidgetOrders();
    }

    function updateWidgetOrders() {
        const widgetContainer = document.getElementById('widget-container');
        const widgets = Array.from(widgetContainer.children);
        widgets.forEach((widget, index) => {
            widget.setAttribute('data-order', index + 1);
            widget.style.order = index + 1;
        });
        saveWidgetOrder(widgets.map(w => w.getAttribute('data-order')));
    }

    // Function to configure a widget
    function configureWidget(iframeElement) {
        const newUrl = prompt('Enter new URL for the widget:', iframeElement.src);
        if (newUrl) {
            iframeElement.src = newUrl;
            // Fetch data and update widget content
            const service = services.find(service => service.url === newUrl);
            if (service && service.type === 'api') {
                fetchData(newUrl, data => {
                    displayDataInIframe(iframeElement, data);
                });
            }
        }
    }

    // Function to fetch data and update widget content
    function fetchData(url, callback) {
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}` // Use a function to get the actual token
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error('Fetching data failed:', error);
        });
    }

    // Function to get the authorization token
    function getAuthToken() {
        return 'YOUR_API_TOKEN'; // Placeholder
    }

    // Function to display data in the iframe using postMessage
    function displayDataInIframe(iframe, data) {
        if (iframe.contentWindow) {
            const message = JSON.stringify(data, null, 2);
            iframe.contentWindow.postMessage(message, '*');
        } else {
            console.error('Unable to access iframe contentWindow');
        }
    }

    // Function to enter boardboard mode
    function enterBoardboardMode() {
        const widgets = Array.from(document.querySelectorAll('.widget-wrapper'));
        widgets.forEach((widget, index) => {
            let orderInput = widget.querySelector('.order-input');
            if (!orderInput) {
                orderInput = document.createElement('input');
                orderInput.type = 'number';
                orderInput.value = widget.style.order || index + 1; // Use current order or index + 1
                orderInput.className = 'order-input';
                widget.appendChild(orderInput);
                console.log(`Added order input to widget ID: ${widget.getAttribute('data-order')}, Initial Order: ${orderInput.value}`);
            } else {
                orderInput.style.display = 'block';
            }
        });

        document.getElementById('save-boardboard').style.display = 'inline-block';
    }

    // Function to exit boardboard mode
    function exitBoardboardMode() {
        const widgets = Array.from(document.querySelectorAll('.widget-wrapper'));
        console.log('Widgets before reordering:', widgets.map(widget => widget.style.order));

        const orderMap = new Map();
        let maxOrder = widgets.length;

        widgets.forEach((widget, index) => {
            const orderInput = widget.querySelector('.order-input');
            if (orderInput) {
                let orderValue = Number(orderInput.value);

                // If the input is empty or not a valid number, use the current index as the order
                if (isNaN(orderValue) || orderValue === 0) {
                    orderValue = index + 1;
                }

                // If the order already exists, find the next available order
                while (orderMap.has(orderValue)) {
                    orderValue = ++maxOrder;
                }

                orderMap.set(orderValue, widget);
                widget.style.order = orderValue;
                widget.setAttribute('data-order', orderValue);
                console.log(`Setting Widget ID: ${widget.getAttribute('data-order')} to Order: ${orderValue}`);

                orderInput.style.display = 'none';
            }
        });

        // Save the new order to localStorage
        const order = Array.from(orderMap.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([_, widget]) => widget.getAttribute('data-order'));
        saveWidgetOrder(order);

        console.log('Widgets after reordering:', widgets.map(widget => widget.style.order));

        document.getElementById('save-boardboard').style.display = 'none';
    }

    // Function to toggle boardboard mode
    function toggleBoardboardMode() {
        const widgetContainer = document.getElementById('widget-container');
        widgetContainer.classList.toggle('boardboard-mode');

        if (widgetContainer.classList.contains('boardboard-mode')) {
            enterBoardboardMode();
        } else {
            exitBoardboardMode();
        }
    }

    // Function to toggle visibility of remove and configure buttons
    function toggleButtons() {
        const widgetContainer = document.getElementById('widget-container');
        widgetContainer.classList.toggle('hidden-buttons');
    }

    // Function to save widget order to localStorage
    function saveWidgetOrder(order) {
        localStorage.setItem('widgetOrder', JSON.stringify(order));
    }

    // Function to load widget order from localStorage
    function loadWidgetOrder() {
        const order = JSON.parse(localStorage.getItem('widgetOrder'));
        if (order) {
            const widgetContainer = document.getElementById('widget-container');
            const widgets = Array.from(widgetContainer.children);
            widgets.sort((a, b) => order.indexOf(a.getAttribute('data-order')) - order.indexOf(b.getAttribute('data-order')));
            widgets.forEach((widget, index) => {
                widget.style.order = index + 1;
                widget.setAttribute('data-order', index + 1);
                widgetContainer.appendChild(widget);
            });
        }
    }

    // Call loadWidgetOrder on DOMContentLoaded
    loadWidgetOrder();
});

// This updated version of `main.js` includes the following changes:

// 1. Added drag and drop functionality to enable reordering of widgets.
// 2. Fixed the issue with toggling widget order by ensuring that the `data-order` attribute and `style.order` property are always in sync.
// 3. Updated the `enterBoardboardMode` function to use the current order or index + 1 as the initial value for the order input.
// 4. Modified the `exitBoardboardMode` function to handle cases where the input value might be empty or invalid, and to ensure unique order values for all widgets.
// 5. Added an `updateWidgetOrders` function to maintain correct order when a widget is removed.
// 6. Updated the `reorderWidgets` function to set both `data-order` attribute and `style.order` property.
// 7. Modified the `loadWidgetOrder` function to update both `data-order` attribute and `style.order` property when loading saved order.

// These changes should resolve the issues with widget reordering and ensure that the order is maintained correctly across all operations, including when toggling widgets to become number 1 in the order.