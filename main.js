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
        widgets.forEach(widget => widgetContainer.appendChild(widget));
    }

    // Function to remove a widget
    function removeWidget(widgetElement) {
        widgetElement.remove();
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
                orderInput.value = widget.getAttribute('data-order'); // Use existing order
                orderInput.className = 'order-input';
                widget.appendChild(orderInput);
                console.log(`Added order input to widget ID: ${widget.getAttribute('data-order')}`); // Log order input addition
            } else {
                orderInput.style.display = 'block'; // Ensure order input is visible
            }
        });

        // Show instructions to the user
        let instructions = document.getElementById('boardboard-instructions');
        if (!instructions) {
            instructions = document.createElement('div');
            instructions.id = 'boardboard-instructions';
            instructions.textContent = "Enter the new order for each widget and press 'Save'";
            instructions.style.position = 'fixed';
            instructions.style.top = '10px';
            instructions.style.left = '50%';
            instructions.style.transform = 'translateX(-50%)';
            instructions.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            instructions.style.color = 'white';
            instructions.style.padding = '10px';
            instructions.style.borderRadius = '5px';
            document.body.appendChild(instructions);
        } else {
            instructions.style.display = 'block'; // Ensure instructions are visible
        }

        // Show the save button
        document.getElementById('save-boardboard').style.display = 'inline-block';
    }

    // Function to exit boardboard mode
    function exitBoardboardMode() {
        const widgets = Array.from(document.querySelectorAll('.widget-wrapper'));
        console.log('Widgets before reordering:', widgets.map(widget => widget.getAttribute('data-order')));

        const newOrder = widgets.map(widget => {
            const orderInput = widget.querySelector('.order-input');
            let orderValue = widget.getAttribute('data-order');
            if (orderInput) {
                orderValue = Number(orderInput.value);
            } else {
                console.error(`Order input not found for widget ID: ${widget.getAttribute('data-order')}`);
            }
            console.log(`Widget ID: ${widget.getAttribute('data-order')}, New Order: ${orderValue}`);
            return { widget, order: orderValue };
        });

        const validOrder = newOrder.filter(item => item.order !== null);

        const orderMap = new Map();
        validOrder.forEach(item => {
            if (orderMap.has(item.order)) {
                const conflictingWidget = orderMap.get(item.order);
                const tempOrder = conflictingWidget.getAttribute('data-order');
                conflictingWidget.setAttribute('data-order', item.widget.getAttribute('data-order'));
                item.widget.setAttribute('data-order', tempOrder);
                console.log(`Swapped orders: Widget ${item.widget.getAttribute('data-order')} <-> Widget ${conflictingWidget.getAttribute('data-order')}`);
            }
            orderMap.set(item.order, item.widget);
        });

        validOrder.sort((a, b) => a.order - b.order);

        validOrder.forEach((item, index) => {
            const newOrderValue = index + 1;
            item.widget.setAttribute('data-order', newOrderValue);
            console.log(`Setting Widget ID: ${item.widget.getAttribute('data-order')} to Order: ${newOrderValue}`);
        });

        const widgetContainer = document.getElementById('widget-container');
        widgetContainer.innerHTML = '';
        validOrder.forEach(item => {
            console.log(`Appending Widget ID: ${item.widget.getAttribute('data-order')} at Order: ${item.order}`);
            widgetContainer.appendChild(item.widget);
        });

        const order = validOrder.map(item => item.widget.getAttribute('data-order'));
        saveWidgetOrder(order);

        const instructions = document.getElementById('boardboard-instructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
        widgets.forEach(widget => {
            const orderInput = widget.querySelector('.order-input');
            if (orderInput) {
                orderInput.style.display = 'none';
            }
        });

        console.log('Widgets after reordering:', Array.from(widgetContainer.children).map(widget => widget.getAttribute('data-order')));

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
            widgets.forEach(widget => widgetContainer.appendChild(widget));
        }
    }

    // Call loadWidgetOrder on DOMContentLoaded
    loadWidgetOrder();
});