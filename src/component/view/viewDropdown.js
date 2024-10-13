import { createView, renameView, deleteView, resetView, updateViewSelector } from '../board/boardManagement.js'
import { getCurrentBoardId, getCurrentViewId } from '../../utils/elements.js'
import { initializeDropdown } from '../utils/dropDownUtils.js'

export function initializeViewDropdown () {
  const viewDropdown = document.getElementById('view-dropdown')
  console.log('View dropdown initialized:', viewDropdown)

  initializeDropdown(viewDropdown, {
    create: handleCreateView,
    rename: handleRenameView,
    delete: handleDeleteView,
    reset: handleResetView
  })
}

function handleCreateView () {
  const boardId = getCurrentBoardId()
  const viewName = prompt('Enter new view name:')
  if (viewName) {
    try {
      const newView = createView(boardId, viewName)
      console.log('View created:', newView)
      updateViewSelector(boardId)
    } catch (error) {
      console.error('Error creating view:', error)
    }
  }
}

function handleRenameView () {
  const boardId = getCurrentBoardId()
  const viewId = getCurrentViewId()
  const newViewName = prompt('Enter new view name:')
  if (newViewName) {
    try {
      renameView(boardId, viewId, newViewName)
      console.log('View renamed to:', newViewName)
    } catch (error) {
      console.error('Error renaming view:', error)
    }
  }
}

function handleDeleteView () {
  const boardId = getCurrentBoardId()
  const viewId = getCurrentViewId()
  if (confirm('Are you sure you want to delete this view?')) {
    try {
      deleteView(boardId, viewId)
      console.log('View deleted:', viewId)
      updateViewSelector(boardId)
    } catch (error) {
      console.error('Error deleting view:', error)
    }
  }
}

function handleResetView () {
  const boardId = getCurrentBoardId()
  const viewId = getCurrentViewId()
  if (confirm('Are you sure you want to reset this view?')) {
    try {
      resetView(boardId, viewId)
      console.log('View reset:', viewId)
    } catch (error) {
      console.error('Error resetting view:', error)
    }
  }
}
