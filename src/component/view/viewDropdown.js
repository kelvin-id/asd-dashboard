import { createView, renameView, deleteView, resetView, updateViewSelector, switchView } from '../board/boardManagement.js'
import { getCurrentBoardId, getCurrentViewId } from '../../utils/elements.js'
import { initializeDropdown } from '../utils/dropDownUtils.js'
import { Logger } from '../../utils/Logger.js'

const logger = new Logger('viewDropdown.js')

export function initializeViewDropdown () {
  const viewDropdown = document.getElementById('view-dropdown')
  logger.log('View dropdown initialized:', viewDropdown)

  initializeDropdown(viewDropdown, {
    create: handleCreateView,
    rename: handleRenameView,
    delete: handleDeleteView,
    reset: handleResetView
  })
}

async function handleCreateView () {
  const boardId = getCurrentBoardId()
  const viewName = prompt('Enter new view name:')
  if (viewName) {
    try {
      const newView = createView(boardId, viewName)
      logger.log('View created:', newView)
      updateViewSelector(boardId)

      // Switch to the new view
      await switchView(boardId, newView.id)
      logger.log(`Switched to new view ${newView.id} in board ${boardId}`)

      // Save the current view in localStorage
      localStorage.setItem('lastUsedViewId', newView.id)
      localStorage.setItem('lastUsedBoardId', boardId)
      logger.log(`Saved last used viewId: ${newView.id} and boardId: ${boardId} to localStorage`)
    } catch (error) {
      logger.error('Error creating view:', error)
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
      logger.log('View renamed to:', newViewName)
    } catch (error) {
      logger.error('Error renaming view:', error)
    }
  }
}

function handleDeleteView () {
  const boardId = getCurrentBoardId()
  const viewId = getCurrentViewId()
  if (confirm('Are you sure you want to delete this view?')) {
    try {
      deleteView(boardId, viewId)
      logger.log('View deleted:', viewId)
      updateViewSelector(boardId)
    } catch (error) {
      logger.error('Error deleting view:', error)
    }
  }
}

function handleResetView () {
  const boardId = getCurrentBoardId()
  const viewId = getCurrentViewId()
  if (confirm('Are you sure you want to reset this view?')) {
    try {
      resetView(boardId, viewId)
      logger.log('View reset:', viewId)
    } catch (error) {
      logger.error('Error resetting view:', error)
    }
  }
}
