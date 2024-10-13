import { saveBoardState } from '../../storage/localStorage.js'
import { createBoard, renameBoard, deleteBoard, updateViewSelector, addBoardToUI, boards } from './boardManagement.js'

export function initializeBoardDropdown () {
  const boardDropdown = document.getElementById('board-dropdown')
  console.log('Board dropdown initialized:', boardDropdown)

  boardDropdown.addEventListener('click', (event) => {
    const action = event.target.dataset.action
    console.log('Board dropdown clicked:', action)

    switch (action) {
      case 'create':
        handleCreateBoard()
        break
      case 'rename':
        handleRenameBoard()
        break
      case 'delete':
        handleDeleteBoard()
        break
      default:
        console.warn('Unknown action:', action)
    }
  })
}

function handleCreateBoard () {
  const boardName = prompt('Enter new board name:')
  if (boardName) {
    try {
      const newBoard = createBoard(boardName)
      console.log('Board created:', newBoard)
      saveBoardState(boards)
      addBoardToUI(newBoard)
    } catch (error) {
      console.error('Error creating board:', error)
    }
  }
}

function handleRenameBoard () {
  const boardId = getSelectedBoardId()
  const newBoardName = prompt('Enter new board name:')
  if (newBoardName) {
    try {
      renameBoard(boardId, newBoardName)
      console.log('Board renamed to:', newBoardName)
      saveBoardState(boards)
    } catch (error) {
      console.error('Error renaming board:', error)
    }
  }
}

function handleDeleteBoard () {
  const boardId = getSelectedBoardId()
  if (confirm('Are you sure you want to delete this board?')) {
    try {
      deleteBoard(boardId)
      console.log('Board deleted:', boardId)
      saveBoardState(boards)
      if (boards.length > 0) {
        updateViewSelector(boards[0].id)
      }
    } catch (error) {
      console.error('Error deleting board:', error)
    }
  }
}

function getSelectedBoardId () {
  const boardSelector = document.getElementById('board-selector')
  return boardSelector.value
}
