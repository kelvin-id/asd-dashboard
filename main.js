import { services } from './widgetManagement.js';
import { saveWidgetState, loadWidgetState } from './localStorage.js';
import { initializeUIInteractions } from './uiInteractions.js';
import { debounce } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Fetch services from services.json and populate the service selector
    fetch('services.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(fetchedServices => {
            services.push(...fetchedServices);
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

    initializeUIInteractions();
    loadWidgetState();

    // Add event listener for window resize
    window.addEventListener('resize', debounce(saveWidgetState, 250));
});
