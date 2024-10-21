import { saveBoardState, loadBoardState } from '../../storage/localStorage.js'
import { addWidget } from '../widget/widgetManagement.js'
import { Logger } from '../../utils/Logger.js'

const logger = new Logger('boardManagement.js')

export let boards = []

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

  // Update the board selector
  updateBoardSelector()

  // Switch to the new board
  switchBoard(newBoardId, defaultViewId)
  logger.log(`Switched to new board ${newBoardId}`)

  // Save the current board and view in localStorage
  localStorage.setItem('lastUsedBoardId', newBoardId)
  localStorage.setItem('lastUsedViewId', defaultViewId)
  logger.log(`Saved last used boardId: ${newBoardId} and viewId: ${defaultViewId} to localStorage`)

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

    // Update the view selector
    updateViewSelector(boardId)

    // Switch to the new view
    switchView(boardId, newViewId)
    logger.log(`Switched to new view ${newViewId} in board ${boardId}`)

    // Save the current view in localStorage
    localStorage.setItem('lastUsedViewId', newViewId)
    logger.log(`Saved last used viewId: ${newViewId} to localStorage`)

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
  const board = boards.find(b => b.id === boardId)
  if (board) {
    logger.log(`Switching to view ${viewId} in board ${boardId}`)
    const view = board.views.find(v => v.id === viewId)
    if (view) {
      // Update the view id in the DOM
      const viewElement = document.querySelector('.board-view')
      if (viewElement) {
        viewElement.id = viewId
      } else {
        logger.error('board-view element not found in DOM')
      }

      clearWidgetContainer()
      logger.log(`Rendering widgets for view ${viewId}:`, view.widgetState)
      for (const widget of view.widgetState) {
        await addWidget(widget.url, widget.columns, widget.rows, widget.type, boardId, viewId, widget.dataid)
      }
      window.asd.currentViewId = viewId
      localStorage.setItem('lastUsedViewId', viewId)
      updateViewSelector(boardId)
    } else {
      logger.error(`View with ID ${viewId} not found in board ${boardId}`)
    }
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
}

export function updateViewSelector (boardId) {
  const viewSelector = document.getElementById('view-selector')
  if (!viewSelector) {
    logger.error('View selector element not found')
    return
  }

  viewSelector.innerHTML = '' // Clear existing options
  const board = boards.find(b => b.id === boardId)

  if (board) {
    logger.log(`Found board with ID: ${boardId}, adding its views to the selector`)
    board.views.forEach(view => {
      logger.log(`Adding view to selector: ${view.name} with ID: ${view.id}`)
      const option = document.createElement('option')
      option.value = view.id
      option.textContent = view.name
      viewSelector.appendChild(option)
    })

    // Select the newly created or switched view
    const lastUsedViewId = localStorage.getItem('lastUsedViewId')
    if (lastUsedViewId) {
      viewSelector.value = lastUsedViewId
      logger.log(`Set view selector value to last used viewId: ${lastUsedViewId}`)
    } else {
      logger.log('No last used viewId found in localStorage')
    }
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
}

export async function switchBoard (boardId, viewId = null) {
  logger.log(`Attempting to switch to board: ${boardId}`)
  const board = boards.find(b => b.id === boardId)
  if (board) {
    document.querySelector('.board').id = boardId
    const targetViewId = viewId || board.views[0].id

    await switchView(boardId, targetViewId)

    window.asd.currentBoardId = boardId
    window.asd.currentViewId = targetViewId
    localStorage.setItem('lastUsedBoardId', boardId)
    localStorage.setItem('lastUsedViewId', targetViewId)
    updateViewSelector(boardId)
  } else {
    logger.error(`Board with ID ${boardId} not found`)
  }
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

  // Select the newly created or switched board
  const lastUsedBoardId = localStorage.getItem('lastUsedBoardId')
  if (lastUsedBoardId) {
    boardSelector.value = lastUsedBoardId
  }
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

  // Select the newly created or switched board
  const lastUsedBoardId = localStorage.getItem('lastUsedBoardId')
  if (lastUsedBoardId) {
    boardSelector.value = lastUsedBoardId
  }
}
