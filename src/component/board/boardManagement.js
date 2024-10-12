import { saveBoardState, loadBoardState } from '../../storage/localStorage.js';
import { addWidget } from '../widget/widgetManagement.js';

let boards = [];

export function createBoard(boardName, boardId) {
    let newBoardId; 
    if(boardId){
        newBoardId = boardId
    } else {
        newBoardId = `board-${Date.now()}`;
    }
    const newBoard = {
        id: newBoardId,
        name: boardName,
        order: boards.length,
        views: []
    };
    boards.push(newBoard);
    saveBoardState(boards);
    return newBoard;
}

export function switchBoard(boardId) {
    console.log('Switching to board:', boardId);
    const board = boards.find(b => b.id === boardId);
    console.log('Board found:', board);
    if (board) {
        // Clear existing widgets
        const widgetContainer = document.getElementById('widget-container');
        while (widgetContainer.firstChild) {
            widgetContainer.removeChild(widgetContainer.firstChild);
        }

        console.log('Cleared widget container, loading widgets for board:', board);

        // Load widgets for the selected board
        board.views.forEach(view => {
            view.widgetState.forEach(widget => {
                // Add widgets to the DOM
                console.log('Adding widget to DOM:', widget);
                addWidget(widget.url, widget.columns, widget.rows, widget.type, boardId); // Pass boardId here
            });
        });
    }
}

export function initializeBoards() {
    loadBoardState().then(loadedBoards => {
        boards = loadedBoards || [];
        console.log('Boards after loading from localStorage:', boards);
        if (!Array.isArray(boards)) {
            console.error('Error: boards is not an array', boards);
            boards = [];
        }
        if (boards.length === 0) {
            createBoard('Default Board', 'default-0');
        }
        boards.forEach(board => {
            console.log('Initializing board:', board);
            addBoardToUI(board);
        });
    }).catch(error => {
        console.error('Error initializing boards:', error);
    });
}

export function addBoardToUI(board) {
    const boardSelector = document.getElementById('board-selector');
    const option = document.createElement('option');
    option.value = board.id;
    option.textContent = board.name;
    boardSelector.appendChild(option);
}