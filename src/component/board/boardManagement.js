import { saveBoardState, loadBoardState, loadWidgetState } from '../../storage/localStorage.js'
import { addWidget } from '../widget/widgetManagement.js'
import { Logger } from '../../utils/Logger.js'

const logger = new Logger('boardManagement.js')

export let boards = []
let isLoading = false

function generateUniqueId (prefix) {
  return `${prefix}-${Date.now()}`
}

export function createBoard (boardName, boardId = null, viewId = null) {
  const newBoardId = boardId || generateUniqueId('board')
  const newBoard = {
    id: newBoardId,
    name: boardName,
    order: boards.length,
    views: []
  }
  boards.push(newBoard)

  const defaultViewId = viewId || generateUniqueId('view')
  createView(newBoardId, 'Default View', defaultViewId)
  logger.log(`Created default view ${defaultViewId} for new board ${newBoardId}`)

  // Save the board state after creating the default view
  saveBoardState(boards)

  return newBoard
}

export function createView (boardId, viewName, viewId = null) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    const newViewId = viewId || generateUniqueId('view')
    const newView = {
      id: newViewId,
      name: viewName,
      widgetState: []
    }
    board.views.push(newView)
    saveBoardState(boards)
    logger.log('Created new view:', newView)
    return newView
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
}

function clearWidgetContainer () {
  const widgetContainer = document.getElementById('widget-container')
  while (widgetContainer.firstChild) {
    widgetContainer.removeChild(widgetContainer.firstChild)
  }
}

export async function switchView (boardId, viewId) {
  if (isLoading) {
    logger.log('Currently loading, please wait...')
    return
  }

  isLoading = true
  const board = boards.find(b => b.id === boardId)
  if (board) {
    logger.log(`Switching to view ${viewId} in board ${boardId}`)
    const view = board.views.find(v => v.id === viewId)
    if (view) {
      document.querySelector('.board-view').id = viewId
      clearWidgetContainer()
      logger.log(`Loading widgets for view ${viewId}:`, view.widgetState)
      for (const widget of view.widgetState) {
        logger.log(`Adding widget from state: ${JSON.stringify(widget)}`)
        await addWidget(widget.url, widget.columns, widget.rows, widget.type, boardId, viewId)
      }
    } else {
      logger.error(`View with ID ${viewId} not found in board ${boardId}`)
    }
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
  isLoading = false
}

export function updateViewSelector (boardId) {
  const viewSelector = document.getElementById('view-selector')
  viewSelector.innerHTML = '' // Clear existing options
  const currentBoardId = document.querySelector('.board').id
  const board = boards.find(b => b.id === currentBoardId)

  if (currentBoardId) {
    logger.log(`Found board with ID: ${boardId}, adding its views to the selector`)
    board.views.forEach(view => {
      logger.log(`Adding view to selector: ${view.name} with ID: ${view.id}`)
      const option = document.createElement('option')
      option.value = view.id
      option.textContent = view.name
      viewSelector.appendChild(option)
    })
  } else {
    logger.error(`Board with ID ${currentBoardId} not found`)
  }
}

export async function switchBoard (boardId) {
  if (isLoading) {
    logger.log('Currently loading, please wait...')
    return
  }

  isLoading = true
  logger.log(`Attempting to switch to board: ${boardId}`)
  const board = boards.find(b => b.id === boardId)
  if (board) {
    logger.log(`Switching to board ${boardId}`)
    document.querySelector('.board').id = boardId
    clearWidgetContainer()
    if (board.views.length > 0) {
      const firstViewId = board.views[0].id
      logger.log(`Switching to first view ${firstViewId} in board ${boardId}`)
      document.querySelector('.board-view').id = firstViewId
      await switchView(boardId, firstViewId)
      await loadWidgetState(boardId, firstViewId)
    }
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
  isLoading = false
}

export function initializeBoards () {
  return loadBoardState().then(loadedBoards => {
    boards = loadedBoards || []

    if (!Array.isArray(boards)) {
      boards = []
    }

    if (boards.length === 0) {
      createBoard('Default Board')
    }

    boards.forEach(board => {
      logger.log('Initializing board:', board)
      addBoardToUI(board)
    })

    // Return the first board and its first view
    if (boards.length > 0) {
      const firstBoard = boards[0]
      const firstView = firstBoard.views.length > 0 ? firstBoard.views[0] : null
      return { boardId: firstBoard.id, viewId: firstView.id }
    }
  }).catch(error => {
    logger.error('Error initializing boards:', error)
  })
}

export function addBoardToUI (board) {
  const boardSelector = document.getElementById('board-selector')
  const option = document.createElement('option')
  option.value = board.id
  option.textContent = board.name
  boardSelector.appendChild(option)
}

export function renameBoard (boardId, newBoardName) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    board.name = newBoardName
    saveBoardState(boards)
    logger.log(`Renamed board ${boardId} to ${newBoardName}`)
    updateBoardSelector()
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
}

export function deleteBoard (boardId) {
  const boardIndex = boards.findIndex(b => b.id === boardId)
  if (boardIndex !== -1) {
    boards.splice(boardIndex, 1)
    saveBoardState(boards)
    logger.log(`Deleted board ${boardId}`)
    updateBoardSelector()
    if (boards.length > 0) {
      const firstBoardId = boards[0].id
      switchBoard(firstBoardId)
    } else {
      clearWidgetContainer()
      document.querySelector('.board').id = ''
      document.querySelector('.board-view').id = ''
    }
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
}

export function renameView (boardId, viewId, newViewName) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    const view = board.views.find(v => v.id === viewId)
    if (view) {
      view.name = newViewName
      saveBoardState(boards)
      logger.log(`Renamed view ${viewId} to ${newViewName}`)
      updateViewSelector(boardId)
    } else {
      logger.error(`View with ID ${viewId} not found`)
    }
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
}

export function deleteView (boardId, viewId) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    const viewIndex = board.views.findIndex(v => v.id === viewId)
    if (viewIndex !== -1) {
      board.views.splice(viewIndex, 1)
      saveBoardState(boards)
      logger.log(`Deleted view ${viewId}`)
      updateViewSelector(boardId)
      if (board.views.length > 0) {
        const firstViewId = board.views[0].id
        switchView(boardId, firstViewId)
      } else {
        clearWidgetContainer()
        document.querySelector('.board-view').id = ''
      }
    } else {
      logger.error(`View with ID ${viewId} not found`)
    }
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
}

export function resetView (boardId, viewId) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    const view = board.views.find(v => v.id === viewId)
    if (view) {
      view.widgetState = [] // Reset widget state
      saveBoardState(boards)
      logger.log(`Reset view ${viewId}`)
      clearWidgetContainer()
    } else {
      logger.error(`View with ID ${viewId} not found`)
    }
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
}

function updateBoardSelector () {
  const boardSelector = document.getElementById('board-selector')
  boardSelector.innerHTML = ''
  boards.forEach(board => {
    const option = document.createElement('option')
    option.value = board.id
    option.textContent = board.name
    boardSelector.appendChild(option)
  })
}
