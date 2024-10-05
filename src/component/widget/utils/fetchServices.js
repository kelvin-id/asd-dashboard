async function fetchServices () {
  try {
    const response = await fetch('services.json')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching services.json:', error)
    throw new Error('Failed to load services')
  }
}

export { fetchServices }
