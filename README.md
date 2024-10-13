# ASD Dashboard

ASD Dashboard is a VanillaJS Progressive Web App (PWA) designed to facilitate ⚡ Accelerated Software Development and 🚀 Automated Service Deployment. This application allows users to manage remote services through dynamic, resizable widgets embedded in iframes. With support for multiple boards and views, the dashboard offers a flexible and customizable user experience, storing user settings in localStorage for persistence across sessions. Configuration can be fetched via a local or remote `config.json` file.

## Overview

ASD Dashboard is built using VanillaJS, with a focus on a responsive grid layout powered by CSS Grid. The architecture includes:

- **Frontend**: VanillaJS for dynamic interactions and CSS Grid for layout. Widgets are embedded using iframes.
- **Storage**: Utilizes localStorage for saving user preferences like widget positions and board/view states. Configurations can be fetched from a `config.json` file.
- **Service Worker**: Provides PWA capabilities, enabling offline functionality and caching.
- **Testing**: Playwright is used for automated UI testing, integrated via GitHub Actions. Tests are run on a Python web server serving static files.
- **Continuous Integration**: GitHub Actions automate testing workflows to ensure consistent deployment.

The project structure includes key directories and files such as:
- `src/component/`: Contains JavaScript modules for board, view, and widget management.
- `src/storage/`: Manages localStorage interactions.
- `src/ui/`: Houses CSS for styling and UI utilities.
- `src/utils/`: Utility functions for fetching data and configurations.
- `tests/`: Contains Playwright test scripts.
- `src/index.html`: Main HTML file for the application interface.
- `src/main.js`: Entry point for initializing application logic.

## Features

- **Widget Management**: Add, resize, reorder, and remove widgets dynamically. Widgets can display content from URLs or API call results, with customizable properties such as size, metadata, and auto-refresh settings.
- **Board and View Structure**: Organize widgets into multiple boards and views (similar to tabs). Users can create, rename, delete, and reset boards and views, with persistent state storage.
- **Global Configuration**: Load default settings from a central `config.json` file, including themes, widget store URL, and data storage mode.
- **LocalStorage Integration**: Store dashboard preferences and provide a modal for editing localStorage directly, allowing for import/export of settings.
- **Responsive Grid Layout**: Adapt the widget layout to different screen sizes, configurable between 1 to 6 columns/rows.
- **Theme Support**: Switch between light and dark themes via global settings.
- **Service Selection**: Add widgets from a predefined list of services, custom URLs, or remote sources.
- **Service Worker & PWA**: Enable offline functionality and caching through a service worker.
- **Playwright Integration & Testing**: Automated tests ensure functionality, with GitHub Actions managing test workflows.

## Getting started

### Requirements

To run the ASD Dashboard, you need:
- Node.js (latest LTS version)
- Yarn (for managing dependencies)

### Quickstart

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd asd-dashboard
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Run the application**:
   ```bash
   yarn start
   ```

4. **Access the dashboard**:
   Open your web browser and navigate to `http://localhost:8000`.

### License

The project is proprietary.  
Copyright (c) 2024.
```
