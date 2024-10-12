import { saveBoardState, loadBoardState, loadWidgetState } from '../../storage/localStorage.js'
import { addWidget } from '../widget/widgetManagement.js'

let boards = []
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
  console.log(`Created default view ${defaultViewId} for new board ${newBoardId}`)

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
    console.log('Created new view:', newView)
    return newView
  } else {
    console.error(`Board with ID ${boardId} not found`)
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
    console.log('Currently loading, please wait...')
    return
  }

  isLoading = true
  const board = boards.find(b => b.id === boardId)
  if (board) {
    console.log(`Switching to view ${viewId} in board ${boardId}`)
    const view = board.views.find(v => v.id === viewId)
    if (view) {
      document.querySelector('.board-view').id = viewId
      clearWidgetContainer()
      console.log(`Loading widgets for view ${viewId}:`, view.widgetState)
      for (const widget of view.widgetState) {
        console.log(`Adding widget from state: ${JSON.stringify(widget)}`)
        await addWidget(widget.url, widget.columns, widget.rows, widget.type, boardId, viewId)
      }
    } else {
      console.error(`View with ID ${viewId} not found in board ${boardId}`)
    }
  } else {
    console.error(`Board with ID ${boardId} not found`)
  }
  isLoading = false
}

export function updateViewSelector (boardId) {
  const viewSelector = document.getElementById('view-selector')
  viewSelector.innerHTML = '' // Clear existing options
  const currentBoardId = document.querySelector('.board').id
  const board = boards.find(b => b.id === currentBoardId)

  if (currentBoardId) {
    console.log(`Found board with ID: ${boardId}, adding its views to the selector`)
    board.views.forEach(view => {
      console.log(`Adding view to selector: ${view.name} with ID: ${view.id}`)
      const option = document.createElement('option')
      option.value = view.id
      option.textContent = view.name
      viewSelector.appendChild(option)
    })
  } else {
    console.error(`Board with ID ${currentBoardId} not found`)
  }
}

export async function switchBoard (boardId) {
  if (isLoading) {
    console.log('Currently loading, please wait...')
    return
  }

  isLoading = true
  console.log(`Attempting to switch to board: ${boardId}`)
  const board = boards.find(b => b.id === boardId)
  if (board) {
    console.log(`Switching to board ${boardId}`)
    document.querySelector('.board').id = boardId
    clearWidgetContainer()
    if (board.views.length > 0) {
      const firstViewId = board.views[0].id
      console.log(`Switching to first view ${firstViewId} in board ${boardId}`)
      document.querySelector('.board-view').id = firstViewId
      await switchView(boardId, firstViewId)
      await loadWidgetState(boardId, firstViewId)
    }
  } else {
    console.error(`Board with ID ${boardId} not found`)
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
      console.log('Initializing board:', board)
      addBoardToUI(board)
    })

    // Return the first board and its first view
    if (boards.length > 0) {
      const firstBoard = boards[0]
      const firstView = firstBoard.views.length > 0 ? firstBoard.views[0] : null
      return { boardId: firstBoard.id, viewId: firstView.id }
    }
  }).catch(error => {
    console.error('Error initializing boards:', error)
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
    console.log(`Renamed board ${boardId} to ${newBoardName}`)
    updateBoardSelector()
  } else {
    console.error(`Board with ID ${boardId} not found`)
  }
}

export function deleteBoard (boardId) {
  const boardIndex = boards.findIndex(b => b.id === boardId)
  if (boardIndex !== -1) {
    boards.splice(boardIndex, 1)
    saveBoardState(boards)
    console.log(`Deleted board ${boardId}`)
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
    console.error(`Board with ID ${boardId} not found`)
  }
}

export function renameView (boardId, viewId, newViewName) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    const view = board.views.find(v => v.id === viewId)
    if (view) {
      view.name = newViewName
      saveBoardState(boards)
      console.log(`Renamed view ${viewId} to ${newViewName}`)
      updateViewSelector(boardId)
    } else {
      console.error(`View with ID ${viewId} not found`)
    }
  } else {
    console.error(`Board with ID ${boardId} not found`)
  }
}

export function deleteView (boardId, viewId) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    const viewIndex = board.views.findIndex(v => v.id === viewId)
    if (viewIndex !== -1) {
      board.views.splice(viewIndex, 1)
      saveBoardState(boards)
      console.log(`Deleted view ${viewId}`)
      updateViewSelector(boardId)
      if (board.views.length > 0) {
        const firstViewId = board.views[0].id
        switchView(boardId, firstViewId)
      } else {
        clearWidgetContainer()
        document.querySelector('.board-view').id = ''
      }
    } else {
      console.error(`View with ID ${viewId} not found`)
    }
  } else {
    console.error(`Board with ID ${boardId} not found`)
  }
}

export function resetView (boardId, viewId) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    const view = board.views.find(v => v.id === viewId)
    if (view) {
      view.widgetState = [] // Reset widget state
      saveBoardState(boards)
      console.log(`Reset view ${viewId}`)
      clearWidgetContainer()
    } else {
      console.error(`View with ID ${viewId} not found`)
    }
  } else {
    console.error(`Board with ID ${boardId} not found`)
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
