import { initializeBoards, switchBoard, createBoard, addBoardToUI } from './component/board/boardManagement.js';
import { initializeDashboardMenu } from './component/menu/dashboardMenu.js';
import { saveWidgetState, loadWidgetState } from './storage/localStorage.js';
import { initializeDragAndDrop } from './component/widget/events/dragDrop.js';

window.asd = {
  services: [],
  config: {},
  boards: []
}

let currentBoardId = 'default-0'; // Assuming 'board-0' is the default board ID

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');

  // Fetch services from services.json and populate the service selector
  fetch('services.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`)
      }
      return response.json()
    })
    .then(fetchedServices => {
      console.log('Fetched services:', fetchedServices)
      window.asd.services = fetchedServices

      const serviceSelector = document.getElementById('service-selector')
      fetchedServices.forEach(service => {
        const option = document.createElement('option')
        option.value = service.url
        option.textContent = service.name
        serviceSelector.appendChild(option)
      })
    })
    .catch(error => {
      console.error('Error fetching services:', error)
    })

  initializeBoards();
  initializeDashboardMenu();
  initializeDragAndDrop(); // Restore this line to initialize drag-and-drop functionality

  // Load the state of the default board initially
  loadWidgetState(currentBoardId);

  document.getElementById('create-board-button').addEventListener('click', () => {
    const boardName = prompt('Enter board name:');
    if (boardName) {
      const newBoard = createBoard(boardName);
      addBoardToUI(newBoard);
    }
  });

  document.getElementById('board-selector').addEventListener('change', (event) => {
    const selectedBoardId = event.target.value;
    saveWidgetState(currentBoardId); // Save the state of the current board before switching
    currentBoardId = selectedBoardId; // Update the current board ID
    switchBoard(selectedBoardId);
    loadWidgetState(selectedBoardId); // Load the state of the selected board
  });
})