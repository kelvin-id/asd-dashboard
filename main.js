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

    // Function to create a widget (extracted from addWidget function)
    function createWidget(url, width = '300px', height = '200px') {
        const widgetWrapper = document.createElement('div');
        widgetWrapper.className = 'widget-wrapper';
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

        addResizeFunctionality(widgetWrapper);
        addDragAndDropFunctionality(widgetWrapper);

        widgetWrapper.style.width = width;
        widgetWrapper.style.height = height;
        console.log('Widget created with size:', {
            width: widgetWrapper.style.width,
            height: widgetWrapper.style.height
        });

        return widgetWrapper;
    }

    // Function to create and add a widget (iframe) to the widget container
    function addWidget(url, width = '300px', height = '200px') {
        const widgetContainer = document.getElementById('widget-container');
        if (!widgetContainer) {
            console.error('Widget container not found');
            return;
        }

        const widget = createWidget(url, width, height);
        widget.setAttribute('data-order', widgetContainer.children.length + 1);
        widgetContainer.appendChild(widget);

        // Fetch data and display it in the iframe if it's an API service
        const service = services.find(service => service.url === url);
        if (service && service.type === 'api') {
            fetchData(url, data => {
                displayDataInIframe(widget.querySelector('iframe'), data);
            });
        }

        saveWidgetState();
    }

    function addResizeFunctionality(widgetWrapper) {
        const resizeHandle = widgetWrapper.querySelector('.resize-handle');

        function resize(e) {
            const width = e.clientX - widgetWrapper.getBoundingClientRect().left;
            const height = e.clientY - widgetWrapper.getBoundingClientRect().top;

            widgetWrapper.style.width = `${width}px`;
            widgetWrapper.style.height = `${height}px`;

            console.log('Resize event triggered:', {
                width: widgetWrapper.style.width,
                height: widgetWrapper.style.height
            });

            const iframe = widgetWrapper.querySelector('iframe');
            iframe.contentWindow.postMessage({ action: 'resize', width, height }, '*');

            // Call saveWidgetState after each resize
            saveWidgetState();
            console.log('saveWidgetState called from resize function');
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResize);
            console.log('Resize stopped');
            saveWidgetState();
            console.log('saveWidgetState called from stopResize function');
        }

        function startResize(e) {
            e.preventDefault();
            console.log('Resize started');
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);

            const width = widgetWrapper.getBoundingClientRect().width;
            const height = widgetWrapper.getBoundingClientRect().height;
            widgetWrapper.style.width = `${width}px`;
            widgetWrapper.style.height = `${height}px`;

            console.log('Initial size on start resize:', {
                width: widgetWrapper.style.width,
                height: widgetWrapper.style.height
            });

            const iframe = widgetWrapper.querySelector('iframe');
            iframe.contentWindow.postMessage({ action: 'resize', width, height }, '*');
        }

        resizeHandle.addEventListener('mousedown', startResize);

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
            saveWidgetState();
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

        widgetContainer.innerHTML = '';
        widgets.forEach((widget, index) => {
            widget.setAttribute('data-order', index + 1);
            widget.style.order = index + 1;
            widgetContainer.appendChild(widget);
        });

        saveWidgetState();
    }

    // Function to remove a widget
    function removeWidget(widgetElement) {
        widgetElement.remove();
        updateWidgetOrders();
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
            saveWidgetState();
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
                orderInput.value = widget.style.order || index + 1;
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

                if (isNaN(orderValue) || orderValue === 0) {
                    orderValue = index + 1;
                }

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

        saveWidgetState();

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

    // Function to save widget state to localStorage
    function saveWidgetState() {
        console.log('saveWidgetState function called');
        const widgetContainer = document.getElementById('widget-container');
        const widgets = Array.from(widgetContainer.children);
        const widgetState = widgets.map(widget => {
            const state = {
                order: widget.getAttribute('data-order'),
                width: widget.style.width,
                height: widget.style.height,
                url: widget.querySelector('iframe').src
            };
            console.log('Saving widget state:', state);
            return state;
        });
        localStorage.setItem('widgetState', JSON.stringify(widgetState));
        console.log('Saved widget state to localStorage:', widgetState);
    }

    // Function to load widget state from localStorage
    function loadWidgetState() {
        const savedState = JSON.parse(localStorage.getItem('widgetState'));
        console.log('Loaded widget state from localStorage:', savedState);
        if (savedState) {
            const widgetContainer = document.getElementById('widget-container');
            widgetContainer.innerHTML = ''; // Clear existing widgets
            savedState.forEach(widgetData => {
                console.log('Creating widget with data:', widgetData);
                const widget = createWidget(widgetData.url, widgetData.width, widgetData.height);
                widget.style.order = widgetData.order;
                widget.setAttribute('data-order', widgetData.order);
                widget.style.width = widgetData.width || '300px';
                widget.style.height = widgetData.height || '200px';
                console.log('Widget created with size:', {
                    width: widget.style.width,
                    height: widget.style.height
                });
                widgetContainer.appendChild(widget);
            });
        }
    }

    // Call loadWidgetState on DOMContentLoaded
    loadWidgetState();

    // Add event listener for window resize
    window.addEventListener('resize', debounce(saveWidgetState, 250));

    // Debounce function to limit the rate at which saveWidgetState is called
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});
