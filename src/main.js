import { saveWidgetState, loadWidgetState } from './storage/localStorage.js'
import { initializeDashboardMenu } from './component/menu/dashboardMenu.js'

window.asd = {
  services: [],
  config: {}
}

document.addEventListener('DOMContentLoaded', () => {
  // Fetch services from services.json and populate the service selector
  fetch('services.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`)
      }
      return response.json()
    })
    .then(fetchedServices => {
      console.log('Fetched services:', fetchedServices)
      window.asd.services = fetchedServices

      const serviceSelector = document.getElementById('service-selector')
      fetchedServices.forEach(service => {
        const option = document.createElement('option')
        option.value = service.url
        option.textContent = service.name
        serviceSelector.appendChild(option)
      })
    })
    .catch(error => {
      console.error('Error fetching services:', error)
    })

  initializeDashboardMenu() // Ensure this is called only once
  loadWidgetState()

  // Add event listener for window resize
  // window.addEventListener('resize', debounce(saveWidgetState, 250));

  // Initialize drag and drop functionality
  const widgetContainer = document.getElementById('widget-container')
  widgetContainer.addEventListener('dragover', (e) => {
    e.preventDefault()
    const dragOverTarget = e.target.closest('.widget-wrapper')
    if (dragOverTarget) {
      dragOverTarget.classList.add('drag-over')
    }
  })

  widgetContainer.addEventListener('dragleave', (e) => {
    const dragLeaveTarget = e.target.closest('.widget-wrapper')
    if (dragLeaveTarget) {
      dragLeaveTarget.classList.remove('drag-over')
    }
  })

  widgetContainer.addEventListener('drop', (e) => {
    e.preventDefault()
    const draggedOrder = e.dataTransfer.getData('text/plain')
    const targetWidgetWrapper = e.target.closest('.widget-wrapper')
    const targetOrder = targetWidgetWrapper.getAttribute('data-order')

    if (draggedOrder !== null && targetOrder !== null) {
      const widgets = Array.from(widgetContainer.children)
      const draggedWidget = widgets.find(widget => widget.getAttribute('data-order') === draggedOrder)
      const targetWidget = widgets.find(widget => widget.getAttribute('data-order') === targetOrder)

      if (draggedWidget && targetWidget) {
        // Swap orders
        draggedWidget.setAttribute('data-order', targetOrder)
        targetWidget.setAttribute('data-order', draggedOrder)

        // Update CSS order
        draggedWidget.style.order = targetOrder
        targetWidget.style.order = draggedOrder

        // Save the new state
        saveWidgetState()
      }
    }
  })

  console.log('Drag and drop functionality initialized')
})
