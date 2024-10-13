async function getConfig () {
  if (window.asd && window.asd.config && Object.keys(window.asd.config).length > 0) {
    console.log('Using cached configuration')
    return window.asd.config
  }

  try {
    const response = await fetch('config.json')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const config = await response.json()
    window.asd.config = config // Cache the configuration
    return config
  } catch (error) {
    console.error('Error fetching config.json:', error)
    throw new Error('Failed to load configuration')
  }
}

export { getConfig }
