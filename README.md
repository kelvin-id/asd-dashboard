# asd-dashboard

A pure VanillaJS dashboard for managing remote services through widgets displayed in iframes. This single-page application (SPA) allows users to dynamically add, resize, reorder, and configure widgets, with preferences stored in local storage.

## Overview

The `asd-dashboard` is built using plain HTML, CSS, and JavaScript without any frameworks. The architecture is designed as a single-page application (SPA) focusing solely on frontend functionality. The main components include:

- **index.html**: Basic layout of the application.
- **styles.css**: Styling for the application.
- **main.js**: Core JavaScript functionality, handling dynamic iframe loading, event listeners for user interactions, and AJAX calls to remote services.

### Technologies Used

- **Node.js**: JavaScript runtime required to run the application.

### Project Structure

```
.
├── .gitignore
├── README.md
├── boardboardMode.js
├── config.json
├── fetchData.js
├── fullscreenToggle.js
├── index.html
├── localStorage.js
├── main.js
├── package.json
├── resizeMenu.js
├── serverWorkerRegistration.js
├── serviceWorker.js
├── services.json
├── styles.css
├── uiInteractions.js
├── unicodeEmoji.js
├── utils.js
└── widgetManagement.js
```

## Features

- **Widget Management**: Add, resize, reorder, and configure widgets. 
- **Local Storage**: Save and restore widget state (order, size, and URL) across sessions.
- **Grid Layout**: Utilizes CSS Grid for layout, with constraints on minimum and maximum grid columns and rows.
- **Full-Screen Mode**: Toggle full-screen mode for widgets.
- **Service Selection**: Add widgets by selecting services from a `services.json` file or entering a URL.
- **Configuration Options**: Show/hide buttons for removing and configuring widgets.
- **Boardboard Mode**: Reorder widgets using a unique number-based system.
- **Reset Settings**: Button to reset settings to default.

## Getting Started

### Requirements

Ensure you have the following installed on your computer:
- **Node.js**: [Download and install Node.js](https://nodejs.org/)

### Quickstart

1. **Clone the repository**:
    ```sh
    git clone <repository_url>
    cd asd-dashboard
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Run the application**:
    ```sh
    npm start
    ```

4. **Open your browser and navigate to**:
    ```
    http://localhost:3000
    ```

### License

The project is proprietary (not open source). 

```
© 2024.
```