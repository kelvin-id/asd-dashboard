# ASD Dashboard

ASD Dashboard is a single-page application (SPA) built using VanillaJS, HTML, and CSS. It allows users to manage remote services through widgets displayed in iframes. Users can add, resize, reorder, and configure widgets, with their preferences being saved in local storage.

## Overview

The ASD Dashboard is designed as a pure VanillaJS application, focusing on frontend functionality without any backend requirements. The project is structured as follows:

- **index.html**: Main entry point of the application.
- **styles.css**: Stylesheet for the application.
- **main.js**: Core JavaScript file that initializes the application.
- **boardboardMode.js**: Manages the boardboard mode for widget reordering.
- **fetchData.js**: Handles data fetching from remote services.
- **localStorage.js**: Manages saving and loading widget states using local storage.
- **resizeMenu.js**: Provides functionality for resizing widgets.
- **serverWorkerRegistration.js**: Manages service worker registration and unregistration.
- **serviceWorker.js**: Implements caching strategies for offline functionality.
- **uiInteractions.js**: Initializes user interface interactions.
- **unicodeEmoji.js**: Defines a list of Unicode emojis used in the application.
- **utils.js**: Contains utility functions like debounce.
- **widgetManagement.js**: Implements functions for creating, adding, removing, configuring, and reordering widgets.
- **fullscreenToggle.js**: Provides functionality to toggle full-screen mode for widgets.
- **services.json**: Contains a list of remote services.

## Features

- **Add Widgets**: Users can add widgets by selecting a service from a dropdown or entering a URL manually.
- **Resize Widgets**: Widgets can be resized both horizontally and vertically.
- **Reorder Widgets**: Widgets can be reordered using a dropdown menu in boardboard mode.
- **Save Preferences**: User preferences, including widget order and size, are saved in local storage and restored on page reload.
- **Full-Screen Mode**: Widgets can be toggled to full-screen mode.
- **Service Worker**: Option to enable or disable the service worker for offline capabilities.
- **Reset Settings**: Users can reset the dashboard to its default settings.

## Getting Started

### Requirements

- **Node.js**: JavaScript runtime for building and running the application.

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

4. **Open the application**:
    Open your web browser and navigate to `http://localhost:3000` to view the dashboard.

### License

The project is proprietary (not open source). Copyright (c) 2024.
