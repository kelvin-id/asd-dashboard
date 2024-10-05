import { saveWidgetState } from '../../storage/localStorage.js'

function enterBoardboardMode () {
  const widgets = Array.from(document.querySelectorAll('.widget-wrapper'))
  widgets.forEach((widget, index) => {
    let orderInput = widget.querySelector('.order-input')
    if (!orderInput) {
      orderInput = document.createElement('input')
      orderInput.type = 'number'
      orderInput.value = widget.dataset.order // || index + 1;
      orderInput.className = 'order-input'
      widget.appendChild(orderInput)
      console.log(`Added order input to widget ID: ${widget.getAttribute('data-order')}, Initial Order: ${orderInput.value}`)
    } else {
      orderInput.style.display = 'block'
    }
  })

  document.getElementById('save-widget-order').style.display = 'inline-block'
}

function exitBoardboardMode () {
  const widgets = Array.from(document.querySelectorAll('.widget-wrapper'))
  console.log('Widgets before reordering:', widgets.map(widget => widget.dataset.order))

  const orderMap = new Map()
  let maxOrder = widgets.length

  widgets.forEach((widget, index) => {
    const orderInput = widget.querySelector('.order-input')
    if (orderInput) {
      let orderValue = Number(orderInput.value)

      if (isNaN(orderValue) || orderValue === 0) {
        orderValue = index + 1
      }

      while (orderMap.has(orderValue)) {
        orderValue = ++maxOrder
      }

      orderMap.set(orderValue, widget)
      widget.dataset.order = orderValue
      widget.style.order = orderValue
      console.log(`Setting Widget ID: ${widget.getAttribute('data-order')} to Order: ${orderValue}`)

      orderInput.style.display = 'none'
    }
  })

  saveWidgetState()

  console.log('Widgets after reordering:', widgets.map(widget => widget.dataset.order))

  document.getElementById('save-widget-order').style.display = 'none'
}

function toggleBoardboardMode () {
  const widgetContainer = document.getElementById('widget-container')
  widgetContainer.classList.toggle('boardboard-mode')

  if (widgetContainer.classList.contains('boardboard-mode')) {
    enterBoardboardMode()
  } else {
    exitBoardboardMode()
  }
}

function toggleButtons () {
  const widgetContainer = document.getElementById('widget-container')
  widgetContainer.classList.toggle('hide-widget-menu')
}

export { enterBoardboardMode, exitBoardboardMode, toggleBoardboardMode, toggleButtons }
