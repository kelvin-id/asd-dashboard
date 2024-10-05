# asd-dashboard

ASD Dashboard is a pure VanillaJS single-page application (SPA) for managing remote services through widgets displayed in iframes. The application allows users to add, resize, reorder, and configure widgets, with all user preferences stored in localStorage. The dashboard is designed to fully utilize screen space and provides a user-friendly interface for managing various services.

## Overview

The architecture of the ASD Dashboard is a single-page application built using plain HTML, CSS, and JavaScript without any frameworks. The main components include:
- `index.html`: The main entry point with a basic layout.
- `styles.css`: The stylesheet for styling the application.
- `main.js`: The core JavaScript functionality, split into multiple feature files for better organization and maintainability.

### Technologies Used
- **Node.js**: JavaScript runtime for building and running the application.

### Project Structure
- **index.html**: Defines the basic structure of the web page.
- **styles.css**: Contains the styling rules for the application.
- **main.js**: Initializes the application.
- **config.json**: Configuration settings for grid layout constraints.
- **services.json**: List of services available for widgets.
- **boardboardMode.js**: Implements the boardboard mode functionality.
- **fetchData.js**: Fetches data from remote services.
- **fetchServices.js**: Fetches the list of services from `services.json`.
- **fullscreenToggle.js**: Toggles full-screen mode for widgets.
- **localStorage.js**: Manages saving and loading widget states using localStorage.
- **resizeMenu.js**: Provides functionality to resize widgets.
- **serverWorkerRegistration.js**: Manages service worker registration.
- **serviceWorker.js**: Implements caching strategies for offline capabilities.
- **uiInteractions.js**: Initializes user interface interactions.
- **unicodeEmoji.js**: Defines a collection of emoji metadata.
- **utils.js**: Contains utility functions like debounce.
- **widgetManagement.js**: Manages the creation, addition, removal, and configuration of widgets.

## Features

1. **Widget Management**: Add, resize, reorder, and configure widgets.
2. **Local Storage**: Stores user preferences such as widget order and size.
3. **Boardboard Mode**: Allows users to reorder widgets using a numeric input.
4. **Full-Screen Mode**: Toggle widgets to full-screen mode.
5. **Grid Layout**: Uses CSS Grid for layout management, ensuring widgets fully utilize screen space.
6. **Service Worker**: Caches assets for improved performance and offline functionality.

## Getting Started

### Requirements

- **Node.js**: Ensure you have Node.js installed on your computer.

### Development

- **Linting**:
    ```sh
    npm run lint-fix
    ```

### Quickstart

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/kelvin-id/asd-dashboard.git
    cd asd-dashboard
    ```

2. **Install Dependencies**:
    ```sh
    npm install
    ```

3. **Run the Application**:
    ```sh
    npm start
    ```

### License

The project is proprietary (not open source).  
Copyright (c) 2024.
