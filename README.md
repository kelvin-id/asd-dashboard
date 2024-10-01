# ASD Dashboard

ASD Dashboard is a pure VanillaJS single-page application (SPA) designed for managing remote services through widgets displayed in iframes. The dashboard allows users to add, resize, reorder, and configure widgets dynamically, with all user preferences stored in localStorage to ensure persistence across sessions.

## Overview

The 'asd-dashboard' is built using plain HTML, CSS, and JavaScript without any frameworks. The architecture is a single-page application (SPA) that consists of the following main components:

- **index.html**: The main entry point of the application, defining the basic layout.
- **styles.css**: The stylesheet for the application's styling.
- **JavaScript Files**: Various JavaScript files handling different functionalities such as widget management, local storage handling, UI interactions, and more.

### Technologies Used

- **VanillaJS**: Core JavaScript functionality.
- **HTML**: Structure of the web application.
- **CSS**: Styling for the application.
- **Node.js**: JavaScript runtime required to run the application.

### Project Structure

```
asd-dashboard/
├── boardboardMode.js
├── fetchData.js
├── index.html
├── localStorage.js
├── main.js
├── resizeMenu.js
├── services.json
├── styles.css
├── uiInteractions.js
├── utils.js
├── widgetManagement.js
├── serverWorkerRegistration.js
├── serviceWorker.js
└── README.md
```

## Features

- **Widget Management**: Add widgets by selecting a service from a predefined list or entering a URL manually.
- **Screen Utilization**: Widgets dynamically resize to fully utilize the screen size.
- **Persistence**: User preferences for widget order and size are stored in localStorage and restored upon page reload.
- **Reordering Widgets**: Widgets can be reordered using a dropdown menu.
- **Boardboard Mode**: Allows users to reorder widgets by entering a number for each widget.
- **Toggle Buttons**: Show or hide remove and configure buttons within widgets.
- **Service Worker**: Optionally register a service worker for caching and offline capabilities.

## Getting Started

### Requirements

- **Node.js**: Ensure Node.js is installed on your computer to run the application.

### Quickstart

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd asd-dashboard
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Run the application**:
    Open `index.html` in your web browser.

### License

The project is proprietary (not open source). 

```
© 2024. All rights reserved.
```