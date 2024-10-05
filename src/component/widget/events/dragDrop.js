function handleDragStart (e, draggedWidgetWrapper) {
  const widgetOrder = draggedWidgetWrapper.getAttribute('data-order')
  console.log('Drag started for widget with order:', widgetOrder)
  e.dataTransfer.setData('text/plain', widgetOrder)
  e.dataTransfer.effectAllowed = 'move'
  console.log('Data transfer set with widget order:', widgetOrder)

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
  widgetWrapper.classList.remove('has-overlay')
}

function handleDrop (e, targetWidgetWrapper) {
  e.preventDefault()
  console.log('Drop event on overlay for widget:', targetWidgetWrapper)

  const draggedOrder = e.dataTransfer.getData('text/plain')
  const targetOrder = targetWidgetWrapper.getAttribute('data-order')

  console.log(`Drop event: draggedOrder=${draggedOrder}, targetOrder=${targetOrder}`)

  if (draggedOrder === null || targetOrder === null) {
    console.error('Invalid drag or drop target')
    return
  }

  const widgetContainer = document.getElementById('widget-container')

  const draggedWidget = widgetContainer.querySelector(`[data-order='${draggedOrder}']`)
  const targetWidget = widgetContainer.querySelector(`[data-order='${targetOrder}']`)

  if (!draggedWidget || !targetWidget) {
    console.error('Invalid widget elements for dragging or dropping')
    return
  }

  console.log('Before rearrangement:', {
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

  const updatedWidgets = Array.from(widgetContainer.children)
  updatedWidgets.forEach(widget => widget.classList.remove('drag-over'))

  updateWidgetOrders()
}

function handleDragOver (e, widgetWrapper) {
  e.preventDefault()
  console.log('Drag over event on overlay for widget:', widgetWrapper)
  widgetWrapper.classList.add('drag-over')
}

function handleDragLeave (e, widgetWrapper) {
  console.log('Drag leave event on overlay for widget:', widgetWrapper)
  widgetWrapper.classList.remove('drag-over')
}

export { handleDragStart, handleDragEnd, handleDrop, handleDragOver, handleDragLeave }
