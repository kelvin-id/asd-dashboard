import { saveBoardState, loadBoardState } from '../../storage/localStorage.js'
import { addWidget } from '../widget/widgetManagement.js'

let boards = []
let isLoading = false

export function createBoard (boardName, boardId = null, viewId = null) {
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

  let defaultViewId

  if (viewId) {
    defaultViewId = viewId
  } else {
    // Create a default view for the new board
    defaultViewId = `view-${Date.now()}`
  }
  createView(newBoardId, 'Default View', defaultViewId)
  console.log(`Created default view ${defaultViewId} for new board ${newBoardId}`)

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
    console.log('Created new view:', newView)
    return newView
  } else {
    console.error(`Board with ID ${boardId} not found`)
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
      const widgetContainer = document.getElementById('widget-container')
      while (widgetContainer.firstChild) {
        widgetContainer.removeChild(widgetContainer.firstChild)
      }
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

export async function switchBoard (boardId) {
  if (isLoading) {
    console.log('Currently loading, please wait...')
    return
  }

  isLoading = true
  const board = boards.find(b => b.id === boardId)
  if (board) {
    console.log(`Switching to board ${boardId}`)
    document.querySelector('.board').id = boardId
    const widgetContainer = document.getElementById('widget-container')
    while (widgetContainer.firstChild) {
      widgetContainer.removeChild(widgetContainer.firstChild)
    }
    if (board.views.length > 0) {
      console.log(`Switching to first view ${board.views[0].id} in board ${boardId}`)
      await switchView(boardId, board.views[0].id)
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

      board.views.forEach(view => {
        console.log('Initializing view:', view)
        addViewToUI(board.id, view)
      })
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

export function addViewToUI (boardId, view) {
  const viewSelector = document.getElementById('view-selector')
  const option = document.createElement('option')
  option.value = view.id
  option.textContent = view.name
  viewSelector.appendChild(option)
}
