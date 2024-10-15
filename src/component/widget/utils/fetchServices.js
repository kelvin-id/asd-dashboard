import { Logger } from '../../../utils/Logger.js'

const logger = new Logger('fetchServices.js')

async function fetchServices () {
  try {
    const response = await fetch('services.json')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    logger.log('Fetching services')
    return await response.json()
  } catch (error) {
    logger.error('Error fetching services.json:', error)
    throw new Error('Failed to load services')
  }
}

export { fetchServices }
