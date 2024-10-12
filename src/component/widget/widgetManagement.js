import { saveWidgetState } from '../../storage/localStorage.js'
import { fetchData } from './utils/fetchData.js'
import { showResizeMenu, hideResizeMenu, showResizeMenuBlock, hideResizeMenuBlock } from './menu/resizeMenu.js'
import emojiList from '../../ui/unicodeEmoji.js'
import { debounce } from '../../utils/utils.js'
import { fetchServices } from './utils/fetchServices.js'
import { getServiceFromUrl } from './utils/widgetUtils.js'
import { getConfig } from './utils/getConfig.js'
import { handleDragStart, handleDragEnd } from './events/dragDrop.js'
import { toggleFullScreen } from './events/fullscreenToggle.js'

async function createWidget (service, url, gridColumnSpan = 1, gridRowSpan = 1) {
  console.log('Creating widget with URL:', url)
  const config = await getConfig()
  const services = await fetchServices()
  const serviceConfig = services.find(s => s.name === service)?.config || {}
  const minColumns = serviceConfig.minColumns || config.styling.grid.minColumns
  const maxColumns = serviceConfig.maxColumns || config.styling.grid.maxColumns
  const minRows = serviceConfig.minRows || config.styling.grid.minRows
  const maxRows = serviceConfig.maxRows || config.styling.grid.maxRows

  const widgetWrapper = document.createElement('div')
  widgetWrapper.className = 'widget-wrapper'
  widgetWrapper.style.position = 'relative'
  widgetWrapper.dataset.service = service
  widgetWrapper.dataset.url = url
  console.log(`Creating widget for service: ${service}`)

  gridColumnSpan = Math.min(Math.max(gridColumnSpan, minColumns), maxColumns)
  gridRowSpan = Math.min(Math.max(gridRowSpan, minRows), maxRows)

  widgetWrapper.style.gridColumn = `span ${gridColumnSpan}`
  widgetWrapper.style.gridRow = `span ${gridRowSpan}`
  widgetWrapper.dataset.columns = gridColumnSpan
  widgetWrapper.dataset.rows = gridRowSpan

  const iframe = document.createElement('iframe')
  iframe.src = url
  iframe.style.border = '1px solid #ccc'
  iframe.style.width = '100%'
  iframe.style.height = '100%'

  iframe.onload = () => {
    console.log('Iframe loaded successfully:', url)
  }

  iframe.onerror = () => {
    console.error('Error loading iframe:', url)
  }

  const widgetMenu = document.createElement('div')
  widgetMenu.classList.add('widget-menu')

  const removeButton = document.createElement('button')
  removeButton.innerHTML = emojiList.cross.unicode
  removeButton.classList.add('widget-button', 'widget-icon-remove')
  removeButton.addEventListener('click', () => {
    removeWidget(widgetWrapper)
  })

  const configureButton = document.createElement('button')
  configureButton.innerHTML = emojiList.link.unicode
  configureButton.classList.add('widget-button', 'widget-icon-link')
  configureButton.addEventListener('click', () => {
    configureWidget(iframe)
  })

  const buttonDebounce = 200

  const debouncedHideResizeMenu = debounce((icon) => {
    hideResizeMenu(icon)
  }, buttonDebounce)

  const debouncedHideResizeMenuBlock = debounce((widgetWrapper) => {
    hideResizeMenuBlock(widgetWrapper)
  }, buttonDebounce)

  const resizeMenuIcon = document.createElement('button')
  resizeMenuIcon.innerHTML = emojiList.triangularRuler.unicode
  resizeMenuIcon.classList.add('widget-button', 'widget-icon-resize')
  resizeMenuIcon.addEventListener('mouseenter', () => {
    console.log('Mouse enter resize menu icon')
    showResizeMenu(resizeMenuIcon)
  })

  resizeMenuIcon.addEventListener('mouseleave', (event) => {
    console.log('Mouse left resize menu icon')
    const related = event.relatedTarget
    if (!related || !related.closest('.resize-menu')) {
      debouncedHideResizeMenu(resizeMenuIcon)
    }
  })

  const resizeMenuBlockIcon = document.createElement('button')
  resizeMenuBlockIcon.innerHTML = emojiList.puzzle.unicode
  resizeMenuBlockIcon.classList.add('widget-button', 'widget-icon-resize-block')
  resizeMenuBlockIcon.addEventListener('mouseenter', () => {
    showResizeMenuBlock(resizeMenuBlockIcon, widgetWrapper)
  })

  resizeMenuBlockIcon.addEventListener('mouseleave', (event) => {
    console.log('Mouse left resize menu block icon')
    const related = event.relatedTarget
    if (!related || !related.closest('.resize-menu-block')) {
      debouncedHideResizeMenuBlock(widgetWrapper)
    }
  })

  const dragHandle = document.createElement('span')
  dragHandle.classList.add('widget-button', 'widget-icon-drag')
  dragHandle.innerHTML = emojiList.pinching.icon
  dragHandle.draggable = true
  widgetMenu.appendChild(dragHandle)

  const fullScreenButton = document.createElement('button')
  fullScreenButton.innerHTML = emojiList.fullscreen.unicode
  fullScreenButton.classList.add('widget-button', 'widget-icon-fullscreen')
  fullScreenButton.addEventListener('click', event => {
    event.preventDefault()
    toggleFullScreen(widgetWrapper)
  })

  widgetMenu.appendChild(fullScreenButton)

  widgetMenu.appendChild(removeButton)
  widgetMenu.appendChild(configureButton)
  widgetMenu.appendChild(resizeMenuIcon)
  widgetMenu.appendChild(resizeMenuBlockIcon)

  widgetWrapper.appendChild(iframe)
  widgetWrapper.appendChild(widgetMenu)

  dragHandle.addEventListener('dragstart', (e) => {
    console.log('Drag start event triggered')
    e.dataTransfer.setData('text/plain', widgetWrapper.getAttribute('data-order'))
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setDragImage(widgetWrapper, 0, 0)
    widgetWrapper.classList.add('dragging')
    handleDragStart(e, widgetWrapper)
  })

  dragHandle.addEventListener('dragend', (e) => {
    console.log('Drag end event triggered')
    widgetWrapper.classList.remove('dragging')
    handleDragEnd(e)
  })

  console.log('Drag start event listener attached to drag handle')
  console.log('Widget created with grid spans:', {
    columns: gridColumnSpan,
    rows: gridRowSpan
  })

  return widgetWrapper
}

async function addWidget (url, columns = 1, rows = 1, type = 'iframe', boardId, viewId) {
  console.log('Adding widget with URL:', url)
  console.log('Board ID in addWidget:', boardId)
  console.log('View ID in addWidget:', viewId)
  const widgetContainer = document.getElementById('widget-container')

  if (!widgetContainer) {
    console.error('Widget container not found')
    return
  }

  const service = await getServiceFromUrl(url)
  console.log('Extracted service:', service)

  const widgetWrapper = await createWidget(service, url, columns, rows)
  widgetWrapper.setAttribute('data-order', widgetContainer.children.length)
  widgetContainer.appendChild(widgetWrapper)

  console.log('Widget appended to container:', widgetWrapper)

  const services = await fetchServices()
  const serviceObj = services.find(s => s.name === service)
  if (serviceObj && serviceObj.type === 'api') {
    fetchData(url, data => {
      displayDataInIframe(widgetWrapper.querySelector('iframe'), data)
    })
  }

  saveWidgetState(boardId, viewId)
}

function removeWidget (widgetElement) {
  widgetElement.remove()
  updateWidgetOrders()
  saveWidgetState()
}

async function configureWidget (iframeElement) {
  const newUrl = prompt('Enter new URL for the widget:', iframeElement.src)
  if (newUrl) {
    const service = await getServiceFromUrl(newUrl)
    const services = await fetchServices()
    const serviceObj = services.find(s => s.name === service)
    iframeElement.src = newUrl
    if (serviceObj && serviceObj.type === 'api') {
      fetchData(newUrl, data => {
        displayDataInIframe(iframeElement, data)
      })
    }
    saveWidgetState()
  }
}

function displayDataInIframe (iframe, data) {
  if (iframe.contentWindow) {
    const message = JSON.stringify(data, null, 2)
    iframe.contentWindow.postMessage(message, '*')
  } else {
    console.error('Unable to access iframe contentWindow')
  }
}

function updateWidgetOrders () {
  const widgetContainer = document.getElementById('widget-container')
  const widgets = Array.from(widgetContainer.children)

  widgets.forEach((widget, index) => {
    widget.setAttribute('data-order', index)
    widget.style.order = index
    console.log('Updated widget order:', {
      widget,
      order: index
    })
  })

  saveWidgetState()
}

export { addWidget, removeWidget, updateWidgetOrders, createWidget }
