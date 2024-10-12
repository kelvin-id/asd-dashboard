export const fetchServices = () =>
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
