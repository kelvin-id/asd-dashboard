import { createWidget } from '../component/widget/widgetManagement.js'
import { getServiceFromUrl } from '../component/widget/utils/widgetUtils.js'

async function saveWidgetState (boardId, viewId) {
  if (!boardId) {
    boardId = document.querySelector('.board').id
  }
  if (!viewId) {
    viewId = document.querySelector('.board-view').id
  }
  try {
    console.log(`saveWidgetState function called for board: ${boardId}, view: ${viewId}`)
    const widgetContainer = document.getElementById('widget-container')
    const widgets = Array.from(widgetContainer.children)
    const widgetState = widgets.map(widget => {
      const state = {
        order: widget.getAttribute('data-order'),
        url: widget.querySelector('iframe').src,
        columns: widget.dataset.columns || 1,
        rows: widget.dataset.rows || 1,
        type: widget.dataset.type || 'iframe',
        metadata: widget.dataset.metadata ? JSON.parse(widget.dataset.metadata) : {},
        settings: widget.dataset.settings ? JSON.parse(widget.dataset.settings) : {}
      }
      console.log('Saving widget state:', state)
      return state
    })
    const boards = await loadBoardState()
    console.log(`Loaded board state from localStorage: ${boards}`)
    const board = boards.find(b => b.id === boardId)
    if (board) {
      console.log(`Found board: ${board}`)
      const view = board.views.find(v => v.id === viewId)
      if (view) {
        console.log(`Found view: ${view}`)
        view.widgetState = widgetState
        await saveBoardState(boards)
        console.log(`Saved widget state to view: ${viewId} in board: ${boardId}`)
      } else {
        console.error(`View not found: ${viewId}`)
      }
    } else {
      console.error(`Board not found: ${boardId}`)
    }
  } catch (error) {
    console.error('Error saving widget state:', error)
  }
}

async function loadWidgetState (boardId, viewId) {
  try {
    console.log('loadWidgetState function called for board:', boardId, 'and view:', viewId)

    setBoardAndViewIds(boardId, viewId)

    const boards = await loadBoardState()
    console.log('Loaded board state from localStorage:', boards)
    const board = boards.find(b => b.id === boardId)

    if (board) {
      console.log('Found board:', board)
      const view = board.views.find(v => v.id === viewId)

      if (view && view.widgetState.length > 0) {
        console.log('Found widget state in view:', view.widgetState)
        const savedState = view.widgetState
        const widgetContainer = document.getElementById('widget-container')
        widgetContainer.innerHTML = ''

        for (const widgetData of savedState) {
          console.log('Loading widget data:', widgetData)
          const service = await getServiceFromUrl(widgetData.url)
          const widgetWrapper = await createWidget(
            service,
            widgetData.url,
            widgetData.columns,
            widgetData.rows
          )
          widgetWrapper.dataset.order = widgetData.order
          widgetWrapper.style.order = widgetData.order
          widgetWrapper.dataset.type = widgetData.type
          widgetWrapper.dataset.metadata = JSON.stringify(widgetData.metadata)
          widgetWrapper.dataset.settings = JSON.stringify(widgetData.settings)
          widgetContainer.appendChild(widgetWrapper)
        }
      } else {
        console.log('No widget state found in view:', viewId)
      }
    } else {
      console.error('Board not found:', boardId)
    }
  } catch (error) {
    console.error('Error loading widget state:', error)
  }
}

async function loadInitialConfig () {
  try {
    const boards = window.asd.config.boards
    if (boards.length > 0) {
      await saveBoardState(boards)
    }
  } catch (error) {
    console.error('Error loading initial configuration:', error)
  }
}

function setBoardAndViewIds (boardId, viewId) {
  const boardElement = document.querySelector('.board')
  boardElement.id = boardId
  const viewElement = document.querySelector('.board-view')
  viewElement.id = viewId
}

export async function saveBoardState (boards) {
  try {
    localStorage.setItem('boards', JSON.stringify(boards))
  } catch (error) {
    console.error('Error saving board state:', error)
  }
}

export async function loadBoardState () {
  try {
    const boards = localStorage.getItem('boards')
    const parsedBoards = boards ? JSON.parse(boards) : []

    if (parsedBoards) {
      window.asd.boards = parsedBoards
    }
    return parsedBoards
  } catch (error) {
    console.error('Error loading board state:', error)
    return []
  }
}

export { saveWidgetState, loadWidgetState, loadInitialConfig }
