import { updateWidgetOrders } from '../widgetManagement.js'
import { saveWidgetState } from '../../../storage/localStorage.js'
import { Logger } from '../../../utils/Logger.js'

const logger = new Logger('dragDrop.js')

function handleDragStart (e, draggedWidgetWrapper) {
  const widgetOrder = draggedWidgetWrapper.getAttribute('data-order')
  logger.log('Drag started for widget with order:', widgetOrder)
  e.dataTransfer.setData('text/plain', widgetOrder)
  e.dataTransfer.effectAllowed = 'move'
  logger.log('Data transfer set with widget order:', widgetOrder)

  const widgetContainer = document.getElementById('widget-container')
  const widgets = Array.from(widgetContainer.children)
  widgets.forEach(widget => {
    if (widget !== draggedWidgetWrapper) {
      addDragOverlay(widget)
    }
  })
}

function handleDragEnd (e) {
  const widgetContainer = document.getElementById('widget-container')
  const widgets = Array.from(widgetContainer.children)
  widgets.forEach(widget => {
    removeDragOverlay(widget)
    widget.classList.remove('drag-over')
  })
}

function addDragOverlay (widgetWrapper) {
  const dragOverlay = document.createElement('div')
  dragOverlay.classList.add('drag-overlay')

  dragOverlay.style.position = 'absolute'
  dragOverlay.style.top = '0'
  dragOverlay.style.left = '0'
  dragOverlay.style.width = '100%'
  dragOverlay.style.height = '100%'
  dragOverlay.style.zIndex = '10000'
  dragOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'

  dragOverlay.addEventListener('dragover', (e) => {
    e.preventDefault()
    handleDragOver(e, widgetWrapper)
  })

  dragOverlay.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopPropagation()
    handleDrop(e, widgetWrapper)
  })

  widgetWrapper.appendChild(dragOverlay)
  widgetWrapper.classList.add('has-overlay')
}

function removeDragOverlay (widgetWrapper) {
  const dragOverlay = widgetWrapper.querySelector('.drag-overlay')
  if (dragOverlay) {
    dragOverlay.remove()
  }
  widgetWrapper.classList.remove('has-overlay', 'highlight-drop-area')
}

function handleDrop (e, targetWidgetWrapper) {
  e.preventDefault()
  logger.log('Drop event on overlay for widget:', targetWidgetWrapper)

  const draggedOrder = e.dataTransfer.getData('text/plain')
  const targetOrder = targetWidgetWrapper ? targetWidgetWrapper.getAttribute('data-order') : null

  logger.log(`Drop event: draggedOrder=${draggedOrder}, targetOrder=${targetOrder}`)

  const widgetContainer = document.getElementById('widget-container')
  const draggedWidget = widgetContainer.querySelector(`[data-order='${draggedOrder}']`)

  if (!draggedWidget) {
    logger.error('Invalid dragged widget element')
    return
  }

  if (targetOrder !== null) {
    const targetWidget = widgetContainer.querySelector(`[data-order='${targetOrder}']`)
    if (!targetWidget) {
      logger.error('Invalid target widget element')
      return
    }

    logger.log('Before rearrangement:', {
      draggedWidgetOrder: draggedWidget.getAttribute('data-order'),
      targetWidgetOrder: targetWidget.getAttribute('data-order')
    })

    widgetContainer.removeChild(draggedWidget)

    if (parseInt(draggedOrder) < parseInt(targetOrder)) {
      if (targetWidget.nextSibling) {
        widgetContainer.insertBefore(draggedWidget, targetWidget.nextSibling)
      } else {
        widgetContainer.appendChild(draggedWidget)
      }
    } else {
      widgetContainer.insertBefore(draggedWidget, targetWidget)
    }
  } else {
    // Calculate nearest available grid position
    const gridColumnCount = parseInt(getComputedStyle(widgetContainer).getPropertyValue('grid-template-columns').split(' ').length, 10)
    let targetColumn = Math.floor(e.clientX / draggedWidget.offsetWidth)
    let targetRow = Math.floor(e.clientY / draggedWidget.offsetHeight)

    // Adjust to fit within grid boundaries
    targetColumn = Math.min(targetColumn, gridColumnCount - 1)
    targetColumn = Math.max(targetColumn, 0)
    targetRow = Math.max(targetRow, 0)

    draggedWidget.style.gridColumnStart = targetColumn + 1
    draggedWidget.style.gridRowStart = targetRow + 1

    logger.log('Widget moved to new grid position:', {
      column: targetColumn + 1,
      row: targetRow + 1
    })
  }

  const updatedWidgets = Array.from(widgetContainer.children)
  updatedWidgets.forEach(widget => widget.classList.remove('drag-over'))

  updateWidgetOrders()

  // Update localStorage with new widget position
  const widgetId = draggedWidget.dataset.dataid
  const boardId = window.asd.currentBoardId
  const viewId = window.asd.currentViewId
  const widgetState = JSON.parse(localStorage.getItem('widgetState')) || {}

  if (!widgetState[boardId]) {
    widgetState[boardId] = {}
  }

  if (!widgetState[boardId][viewId]) {
    widgetState[boardId][viewId] = []
  }

  const widgetIndex = widgetState[boardId][viewId].findIndex(widget => widget.dataid === widgetId)
  if (widgetIndex !== -1) {
    widgetState[boardId][viewId][widgetIndex].column = parseInt(draggedWidget.style.gridColumnStart)
    widgetState[boardId][viewId][widgetIndex].row = parseInt(draggedWidget.style.gridRowStart)
  }

  localStorage.setItem('widgetState', JSON.stringify(widgetState))
  saveWidgetState(boardId, viewId)

  draggedWidget.classList.remove('dragging')
}

function handleDragOver (e, widgetWrapper) {
  e.preventDefault()
  logger.log('Drag over event on overlay for widget:', widgetWrapper)
  widgetWrapper.classList.add('drag-over', 'highlight-drop-area')
}

function handleDragLeave (e, widgetWrapper) {
  logger.log('Drag leave event on overlay for widget:', widgetWrapper)
  widgetWrapper.classList.remove('drag-over', 'highlight-drop-area')
}

function initializeDragAndDrop () {
  const widgetContainer = document.getElementById('widget-container')
  widgetContainer.addEventListener('dragover', (e) => {
    e.preventDefault()
    const dragOverTarget = e.target.closest('.widget-wrapper')
    if (dragOverTarget) {
      dragOverTarget.classList.add('drag-over', 'highlight-drop-area')
    }
  })

  widgetContainer.addEventListener('dragleave', (e) => {
    const dragLeaveTarget = e.target.closest('.widget-wrapper')
    if (dragLeaveTarget) {
      dragLeaveTarget.classList.remove('drag-over', 'highlight-drop-area')
    }
  })

  widgetContainer.addEventListener('drop', (e) => {
    e.preventDefault()
    const draggedOrder = e.dataTransfer.getData('text/plain')
    const targetWidgetWrapper = e.target.closest('.widget-wrapper')
    const targetOrder = targetWidgetWrapper ? targetWidgetWrapper.getAttribute('data-order') : null

    if (draggedOrder !== null) {
      const widgets = Array.from(widgetContainer.children)
      const draggedWidget = widgets.find(widget => widget.getAttribute('data-order') === draggedOrder)

      if (draggedWidget) {
        if (targetOrder !== null) {
          const targetWidget = widgets.find(widget => widget.getAttribute('data-order') === targetOrder)
          if (targetWidget) {
            // Swap orders
            draggedWidget.setAttribute('data-order', targetOrder)
            targetWidget.setAttribute('data-order', draggedOrder)

            // Update CSS order
            draggedWidget.style.order = targetOrder
            targetWidget.style.order = draggedOrder
          }
        } else {
          // Handle drop in open space
          handleDrop(e, null)
        }

        // Save the new state
        saveWidgetState()
      }
    }
  })

  logger.log('Drag and drop functionality initialized')
}

export { handleDragStart, handleDragEnd, handleDrop, handleDragOver, handleDragLeave, initializeDragAndDrop }
