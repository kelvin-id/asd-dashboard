import { saveBoardState, loadBoardState } from '../../storage/localStorage.js'
import { addWidget } from '../widget/widgetManagement.js'

let boards = []

export function createBoard (boardName, boardId = null) {
  let newBoardId
  if (boardId) {
    newBoardId = boardId
  } else {
    newBoardId = `board-${Date.now()}`
  }
  const newBoard = {
    id: newBoardId,
    name: boardName,
    order: boards.length,
    views: []
  }
  boards.push(newBoard)
  saveBoardState(boards)
  return newBoard
}

export function createView (boardId, viewName, viewId = null) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    let newViewId
    if (viewId) {
      newViewId = viewId
    } else {
      newViewId = `view-${Date.now()}`
    }
    const newView = {
      id: newViewId,
      name: viewName,
      widgetState: []
    }
    board.views.push(newView)
    saveBoardState(boards)
    console.log('Created new view:', newView) // Add this log
    return newView
  } else {
    console.error(`Board with ID ${boardId} not found`)
  }
}

export function removeView (boardId, viewId) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    board.views = board.views.filter(view => view.id !== viewId)
    saveBoardState(boards)
  } else {
    console.error(`Board with ID ${boardId} not found`)
  }
}

export function switchView (boardId, viewId) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    const view = board.views.find(v => v.id === viewId)
    if (view) {
      document.querySelector('.board-view').id = viewId
      const widgetContainer = document.getElementById('widget-container')
      while (widgetContainer.firstChild) {
        widgetContainer.removeChild(widgetContainer.firstChild)
      }
      view.widgetState.forEach(widget => {
        addWidget(widget.url, widget.columns, widget.rows, widget.type, boardId, viewId)
      })
    } else {
      console.error(`View with ID ${viewId} not found in board ${boardId}`)
    }
  } else {
    console.error(`Board with ID ${boardId} not found`)
  }
}

export function switchBoard (boardId) {
  const board = boards.find(b => b.id === boardId)
  if (board) {
    document.querySelector('.board').id = boardId
    const widgetContainer = document.getElementById('widget-container')
    while (widgetContainer.firstChild) {
      widgetContainer.removeChild(widgetContainer.firstChild)
    }
    if (board.views.length > 0) {
      switchView(boardId, board.views[0].id)
    }
  }
}

export function initializeBoards () {
  loadBoardState().then(loadedBoards => {
    boards = loadedBoards || []
    if (!Array.isArray(boards)) {
      boards = []
    }
    if (boards.length === 0) {
      const defaultBoard = createBoard('Default Board', 'default-0')
      createView(defaultBoard.id, 'Default View', 'default-0-view')
    }
    boards.forEach(board => {
      console.log('Initializing board:', board) // Add this log
      addBoardToUI(board)
      board.views.forEach(view => {
        console.log('Initializing view:', view) // Add this log
        addViewToUI(board.id, view)
      })
    })
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

export function addViewToUI (boardId, view) {
  const viewSelector = document.getElementById('view-selector')
  const option = document.createElement('option')
  option.value = view.id
  option.textContent = view.name
  viewSelector.appendChild(option)
}
