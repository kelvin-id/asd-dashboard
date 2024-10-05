import emojiList from '../../../ui/unicodeEmoji.js'
import { saveWidgetState } from '../../../storage/localStorage.js'
import { fetchServices } from '../utils/fetchServices.js'
import { getConfig } from '../utils/getConfig.js'

// Function to resize widget horizontally
async function resizeHorizontally (widget, increase = true) {
  try {
    const config = await getConfig()
    const services = await fetchServices()
    const widgetUrl = widget.dataset.url
    const serviceConfig = services.find(service => service.url === widgetUrl)?.config || {}

    const currentSpan = parseInt(widget.dataset.columns) || config.styling.grid.minColumns
    const newSpan = increase ? currentSpan + 1 : currentSpan - 1

    const minColumns = serviceConfig.minColumns || config.styling.grid.minColumns
    const maxColumns = serviceConfig.maxColumns || config.styling.grid.maxColumns

    // Apply constraints and provide visual feedback
    if (newSpan < minColumns) {
      widget.classList.add('below-min')
      console.log('Cannot resize below minimum columns')
      return
    } else if (newSpan > maxColumns) {
      widget.classList.add('exceeding-max')
      console.log('Cannot resize beyond maximum columns')
      return
    } else {
      widget.classList.remove('below-min', 'exceeding-max')
    }

    widget.dataset.columns = newSpan
    widget.style.gridColumn = `span ${newSpan}`
    console.log(`Widget resized horizontally to span ${newSpan} columns`)
    saveWidgetState()

    // Log dimensions and overflow state of widget container
    const widgetContainer = document.getElementById('widget-container')
    console.log('Widget Container Dimensions:', widgetContainer.getBoundingClientRect())
    console.log('Widget Container Overflow:', window.getComputedStyle(widgetContainer).overflow)
  } catch (error) {
    console.error('Error resizing widget horizontally:', error)
  }
}

// Function to resize widget vertically
async function resizeVertically (widget, increase = true) {
  try {
    const config = await getConfig()
    const services = await fetchServices()
    const widgetUrl = widget.dataset.url
    const serviceConfig = services.find(service => service.url === widgetUrl)?.config || {}

    const currentSpan = parseInt(widget.dataset.rows) || config.styling.grid.minRows
    const newSpan = increase ? currentSpan + 1 : currentSpan - 1

    const minRows = serviceConfig.minRows || config.styling.grid.minRows
    const maxRows = serviceConfig.maxRows || config.styling.grid.maxRows

    // Apply constraints and provide visual feedback
    if (newSpan < minRows) {
      widget.classList.add('below-min')
      console.log('Cannot resize below minimum rows')
      return
    } else if (newSpan > maxRows) {
      widget.classList.add('exceeding-max')
      console.log('Cannot resize beyond maximum rows')
      return
    } else {
      widget.classList.remove('below-min', 'exceeding-max')
    }

    widget.dataset.rows = newSpan
    widget.style.gridRow = `span ${newSpan}`
    console.log(`Widget resized vertically to span ${newSpan} rows`)
    saveWidgetState()

    // Log dimensions and overflow state of widget container
    const widgetContainer = document.getElementById('widget-container')
    console.log('Widget Container Dimensions:', widgetContainer.getBoundingClientRect())
    console.log('Widget Container Overflow:', window.getComputedStyle(widgetContainer).overflow)
  } catch (error) {
    console.error('Error resizing widget vertically:', error)
  }
}

async function enlarge (widget) {
  try {
    await resizeHorizontally(widget, true)
    await resizeVertically(widget, true)
    console.log('Widget enlarged')
  } catch (error) {
    console.error('Error enlarging widget:', error)
  }
}

async function shrink (widget) {
  try {
    await resizeHorizontally(widget, false)
    await resizeVertically(widget, false)
    console.log('Widget shrunk')
  } catch (error) {
    console.error('Error shrinking widget:', error)
  }
}

// Function to show resize menu
async function showResizeMenu (icon) {
  try {
    const widget = icon.closest('.widget-wrapper')
    let menu = widget.querySelector('.resize-menu')

    if (!menu) {
      menu = document.createElement('div')
      menu.className = 'resize-menu'

      const horizontalIncreaseButton = document.createElement('button')
      horizontalIncreaseButton.innerHTML = emojiList.arrowRight.unicode
      horizontalIncreaseButton.addEventListener('click', async () => await resizeHorizontally(widget, true))

      const horizontalDecreaseButton = document.createElement('button')
      horizontalDecreaseButton.innerHTML = emojiList.arrowLeft.unicode
      horizontalDecreaseButton.addEventListener('click', async () => await resizeHorizontally(widget, false))

      const verticalIncreaseButton = document.createElement('button')
      verticalIncreaseButton.innerHTML = emojiList.arrowUp.unicode
      verticalIncreaseButton.addEventListener('click', async () => await resizeVertically(widget, false))

      const verticalDecreaseButton = document.createElement('button')
      verticalDecreaseButton.innerHTML = emojiList.arrowDown.unicode
      verticalDecreaseButton.addEventListener('click', async () => await resizeVertically(widget, true))

      menu.appendChild(verticalDecreaseButton)
      menu.appendChild(horizontalIncreaseButton)
      menu.appendChild(verticalIncreaseButton)
      menu.appendChild(horizontalDecreaseButton)

      widget.appendChild(menu)

      menu.addEventListener('mouseover', () => {
        console.log('Mouse over resize menu')
        menu.style.display = 'block'
      })
      menu.addEventListener('mouseout', (event) => {
        console.log('Mouse out resize menu')
        if (!event.relatedTarget || !event.relatedTarget.classList.contains('widget-icon-resize')) {
          menu.style.display = 'none'
        }
      })
    }
    menu.style.display = 'block'
    console.log('Resize menu shown')
  } catch (error) {
    console.error('Error showing resize menu:', error)
  }
}

// Function to hide resize menu
async function hideResizeMenu (icon) {
  try {
    const widget = icon.closest('.widget-wrapper')
    const menu = widget.querySelector('.resize-menu')
    if (menu) {
      menu.style.display = 'none'
      console.log('Resize menu hidden')
    }
  } catch (error) {
    console.error('Error hiding resize menu:', error)
  }
}

// Function to show resize menu block
async function showResizeMenuBlock (icon, widgetWrapper) {
  try {
    const config = await getConfig()
    console.log('Loaded config:', config)

    const widgetUrl = widgetWrapper.dataset.url
    console.log('Widget URL:', widgetUrl)

    const services = await fetchServices()
    console.log('Fetched services:', services)

    const widgetService = services.find(service => service.url === widgetUrl)
    console.log('Found widget service:', widgetService)

    if (!widgetService || !widgetService.config) {
      console.error(`No constraints found for URL: ${widgetUrl}`)
      return
    }

    const existingMenu = widgetWrapper.querySelector('.resize-menu-block')
    if (existingMenu) {
      existingMenu.remove()
    }

    const menu = document.createElement('div')
    menu.className = 'resize-menu-block'

    const { minColumns, maxColumns, minRows, maxRows } = widgetService.config

    const gridOptions = []
    for (let cols = minColumns; cols <= maxColumns; cols++) {
      for (let rows = minRows; rows <= maxRows; rows++) {
        gridOptions.push({ cols, rows })
      }
    }

    console.log('Grid options:', gridOptions)

    gridOptions.forEach(option => {
      const button = document.createElement('button')
      button.textContent = `${option.cols} columns, ${option.rows} rows`
      button.addEventListener('click', () => {
        adjustWidgetSize(widgetWrapper, option.cols, option.rows)
        menu.remove()
        saveWidgetState()
      })
      menu.appendChild(button)
    })

    menu.style.position = 'absolute'
    menu.style.top = '30px'
    menu.style.right = '5px'
    menu.style.zIndex = '20'

    menu.addEventListener('mouseleave', (event) => {
      console.log('Mouse left resize-menu-block')
      hideResizeMenuBlock(widgetWrapper)
    })

    widgetWrapper.appendChild(menu)
  } catch (error) {
    console.error('Error showing resize menu block:', error)
  }
}

// Function to hide resize menu block
async function hideResizeMenuBlock (widgetWrapper) {
  console.log('Removing resize menu block')
  try {
    const menu = widgetWrapper.querySelector('.resize-menu-block')
    if (menu) {
      menu.remove()
      console.log('Resize menu block hidden')
    } else {
      console.log('No resize menu block to hide')
    }
  } catch (error) {
    console.error('Error hiding resize menu block:', error)
  }
}

// Function to adjust widget size
async function adjustWidgetSize (widgetWrapper, columns, rows) {
  try {
    const config = await getConfig()
    const services = await fetchServices()
    const widgetUrl = widgetWrapper.dataset.url
    const serviceConfig = services.find(service => service.url === widgetUrl)?.config || {}

    const minColumns = serviceConfig.minColumns || config.styling.grid.minColumns
    const maxColumns = serviceConfig.maxColumns || config.styling.grid.maxColumns
    const minRows = serviceConfig.minRows || config.styling.grid.minRows
    const maxRows = serviceConfig.maxRows || config.styling.grid.maxRows

    columns = Math.min(Math.max(columns, minColumns), maxColumns)
    rows = Math.min(Math.max(rows, minRows), maxRows)

    widgetWrapper.dataset.columns = columns
    widgetWrapper.dataset.rows = rows
    widgetWrapper.style.gridColumn = `span ${columns}`
    widgetWrapper.style.gridRow = `span ${rows}`
    console.log(`Widget resized to ${columns} columns and ${rows} rows`)
  } catch (error) {
    console.error('Error adjusting widget size:', error)
  }
}

export { resizeHorizontally, resizeVertically, enlarge, shrink, showResizeMenu, hideResizeMenu, showResizeMenuBlock, hideResizeMenuBlock, adjustWidgetSize }
