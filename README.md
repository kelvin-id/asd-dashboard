```markdown
# ASD Dashboard

ASD Dashboard is a VanillaJS Progressive Web App (PWA) designed for Accelerated Software Development and Automated Service Deployment. It allows users to manage remote services through dynamic, resizable widgets within iframes. The app supports multiple boards and views, ensuring flexible configuration, with user settings stored in localStorage for persistence across sessions. Configuration can be fetched via a config.json file, either remotely or locally.

## Overview

The ASD Dashboard is architected as a single-page application (SPA) using VanillaJS, HTML, and CSS. It leverages a grid-based layout to manage widget positioning and resizing. The project is structured into several key components:

- **Frontend**: Built with VanillaJS and CSS Grid for layout, using iframes for embedding widgets.
- **Storage**: Utilizes localStorage for user preferences, such as widget positions and board/view states, and supports fetching configuration from a config.json file.
- **Service Worker**: Provides PWA functionality, enabling offline mode and caching of key resources.
- **Testing**: Playwright is used for automated UI testing, integrated via GitHub Actions. Static files are served by a Python web server during tests.
- **Continuous Integration**: GitHub Actions automate testing workflows and ensure consistent deployment.

## Features

The ASD Dashboard offers several key features:

- **Widget Management**: Add, resize, reorder, and remove widgets dynamically from a service list or custom URL. Widgets are customizable with properties like size, metadata, and settings.
- **Board and View Structure**: Supports multiple boards with child views, allowing users to switch, rename, delete, or reset. The state of each view, including widget layouts and settings, is stored persistently.
- **Global Configuration**: Supports a central configuration file defining global settings such as theme, widget store URL, and data storage mode.
- **LocalStorage Integration**: Stores all dashboard preferences and supports loading the initial setup from config.json.
- **Responsive Grid Layout**: Widgets are arranged in a flexible grid that adapts based on screen size.
- **Persistent State**: Saves widget properties across sessions, including detailed settings like auto-refresh status.
- **Theme Support**: Includes both light and dark themes, with easy switching between them.
- **Service Selection**: Widgets can be added by selecting services from a predefined JSON file, entering a custom URL, or pulling remote services.
- **Service Worker & PWA**: Enables offline functionality and caching.
- **LocalStorage Editing Modal**: Provides a simple import/export/edit interface for localStorage data.

## Getting started

### Requirements

To run the ASD Dashboard, you need to have the following installed on your system:

- Node.js (latest LTS version)

### Quickstart

Follow these steps to set up and run the ASD Dashboard:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd asd-dashboard
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm start
   ```

This will start the application, allowing you to access it via a local server.

### License

The project is proprietary.  
Copyright (c) 2024.
```