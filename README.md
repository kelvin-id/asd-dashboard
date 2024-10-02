# asd-dashboard

ASD Dashboard is a pure VanillaJS Progressive Web App (PWA) designed for managing remote services through widgets displayed in iframes. The dashboard allows users to add, resize, reorder, and configure widgets dynamically, with all user preferences stored in localStorage to ensure persistence across sessions.

## Overview

The 'asd-dashboard' is a single-page application (SPA) built using plain HTML, CSS, and JavaScript without any frameworks. The main components include:

- `index.html`: The main entry point with a basic layout.
- `styles.css`: The stylesheet for styling the application.
- `main.js`: The core JavaScript file for the application's functionality.
- `services.json`: A JSON file containing a list of remote services.

### Project Structure

The project is organized into several JavaScript files, each handling different features:

- `boardboardMode.js`: Implements the boardboard mode functionality for reordering widgets.
- `fetchData.js`: Handles network requests and data fetching.
- `localStorage.js`: Manages saving and loading widget states using the browser's localStorage.
- `resizeMenu.js`: Provides functionality to resize widgets.
- `serverWorkerRegistration.js`: Manages the registration and unregistration of a Service Worker.
- `serviceWorker.js`: Implements caching strategies to enhance the app's performance and offline functionality.
- `uiInteractions.js`: Initializes user interface interactions for adding, reordering, and managing widgets.
- `unicodeEmoji.js`: Contains a collection of emoji metadata for UI elements.
- `utils.js`: Provides utility functions like `debounce`.
- `widgetManagement.js`: Implements functions for creating, adding, removing, configuring, and reordering widgets.

## Features

- **Add Widgets**: Users can add widgets by selecting a service from `services.json` or by entering a URL.
- **Resize Widgets**: Widgets can be resized both horizontally and vertically.
- **Reorder Widgets**: Widgets can be reordered using a dropdown menu or by entering order numbers in boardboard mode.
- **Persist State**: Widget states, including order and size, are saved in localStorage and restored on page reload.
- **Configure Widgets**: Users can change the URL of a widget.
- **Reset Settings**: A button is available to reset the settings to default.
- **Toggle Boardboard Mode**: A unique mode to reorder widgets by entering order numbers.
- **Service Worker**: Enhances performance and offline capabilities through caching.

## Getting Started

### Requirements

- **Node.js**: JavaScript runtime for building apps. This is required to be able to run the app you're building.

### Quickstart

1. **Clone the Repository**:
   ```sh
   git clone git@github.com:kelvin-id/asd-dashboard.git
   cd asd-dashboard
   ```

2. **Install Dependencies**:
   There are no additional dependencies to install for this project as it is a pure VanillaJS application.

3. **Run the Application**:
   Start a simple HTTP server to serve the application. You can use the provided `start` script:
   ```sh
   npm start
   ```
   This will start a local server at `http://localhost:8000`.

4. **Build the Application**:
   To create a distribution build, run:
   ```sh
   npm run build
   ```

### License

The project is proprietary (not open source), just output the standard Copyright (c) 2024.

```plaintext
© 2024. All rights reserved.
```