import { saveWidgetState } from '../../../storage/localStorage.js'
import { getCurrentBoardId, getCurrentViewId } from '../../../utils/elements.js'
import { debounce } from '../../../utils/utils.js'

export function initializeResizeHandles () {
  const widgets = document.querySelectorAll('.widget')
  console.log(`Found ${widgets.length} widgets to initialize resize handles.`)

  widgets.forEach((widget, index) => {
    console.log(`Initializing resize handle for widget index: ${index}`)
    const resizeHandle = document.createElement('div')
    resizeHandle.className = 'resize-handle'
    widget.appendChild(resizeHandle)

    console.log('Appended resize handle:', resizeHandle)

    resizeHandle.addEventListener('mousedown', (event) => {
      event.preventDefault()
      handleResizeStart(event, widget)
    })
  })
}

function createResizeOverlay () {
  const overlay = document.createElement('div')
  overlay.className = 'resize-overlay'
  overlay.style.position = 'fixed'
  overlay.style.top = 0
  overlay.style.left = 0
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.zIndex = 1000 // Ensure it is above all other elements
  document.body.appendChild(overlay)
  return overlay
}

async function handleResizeStart (event, widget) {
  const startX = event.clientX
  const startY = event.clientY
  const startWidth = widget.offsetWidth
  const startHeight = widget.offsetHeight

  const widgetUrl = widget.dataset.url
  const serviceConfig = window.asd.services.find(service => service.url === widgetUrl)?.config || {}
  const config = window.asd.config

  // const minColumns = serviceConfig.minColumns || config.styling.widget.minColumns
  const gridColumns = serviceConfig.maxColumns || config.styling.widget.maxColumns
  // const minRows = serviceConfig.minRows || config.styling.widget.minRows
  const gridRows = serviceConfig.maxRows || config.styling.widget.maxRows

  const gridColumnSize = widget.parentElement.offsetWidth / gridColumns || 1
  const gridRowSize = widget.parentElement.offsetHeight / gridRows || 1

  // Add the resizing class to the widget
  widget.classList.add('resizing')

  // Create and append an overlay to capture all mouse events
  const overlay = createResizeOverlay()

  const debouncedSaveState = debounce(() => {
    const boardId = getCurrentBoardId()
    const viewId = getCurrentViewId()
    saveWidgetState(boardId, viewId)
  }, 500)

  function handleResize (event) {
    try {
      const newWidth = Math.max(1, Math.round((startWidth + event.clientX - startX) / gridColumnSize))
      const newHeight = Math.max(1, Math.round((startHeight + event.clientY - startY) / gridRowSize))
      // Snap the resize values to the grid
      const snappedWidth = Math.round(newWidth / 1) * 1 // Adjust this if grid size should snap at different intervals
      const snappedHeight = Math.round(newHeight / 1) * 1

      widget.style.gridColumn = `span ${snappedWidth}`
      widget.style.gridRow = `span ${snappedHeight}`
      widget.dataset.columns = snappedWidth
      widget.dataset.rows = snappedHeight

      debouncedSaveState()
      console.log(`Widget resized to columns: ${snappedWidth}, rows: ${snappedHeight}`)
    } catch (error) {
      console.error('Error during widget resize:', error)
    }
  }

  function stopResize () {
    try {
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)

      // Remove the resizing class from the widget
      widget.classList.remove('resizing')

      // Remove the overlay
      document.body.removeChild(overlay)

      console.log('Resize stopped and widget state saved.')
    } catch (error) {
      console.error('Error stopping resize:', error)
    }
  }

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}
