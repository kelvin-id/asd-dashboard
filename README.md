```markdown
# asd-dashboard

asd-dashboard is a VanillaJS Progressive Web App (PWA) designed to facilitate ⚡ Accelerated Software Development and 🚀 Automated Service Deployment. This application empowers users to manage remote services through dynamic, resizable widgets embedded within iframes. It supports multiple boards and views for flexible configuration, with user settings stored in localStorage to ensure persistence across sessions. Configuration can be fetched via a config.json file, either remotely or locally.

## Overview

The project is structured as a single-page application built using VanillaJS, HTML, and CSS. It leverages CSS Grid for layout management and iframes for embedding widgets. Key architectural components include:

- **Frontend**: VanillaJS for interactivity and dynamic content management, with CSS Grid for responsive layout design.
- **Storage**: Utilizes localStorage to persist user preferences such as widget positions and board/view states.
- **Service Worker**: Provides PWA capabilities, enabling offline functionality and caching of key resources.
- **Testing**: Employs Playwright for automated UI testing, integrated with GitHub Actions for continuous integration.
- **Widgets**: Use iframes to load content from URLs or APIs, supporting auto-refresh based on widget type and configurable refresh intervals.
- **Themes**: Offers configurable light and dark themes, applied globally based on user settings.

## Features

- **Widget Management**: Add, resize, reorder, and remove widgets dynamically. Widgets are customizable with properties like size, metadata, and settings. They can load content or display API call results, with resizing adhering to grid column and row steps.
- **Board and View Structure**: Supports multiple boards with child views, allowing users to switch, rename, delete, or reset. The state of each view, including widget layouts and settings, is stored persistently.
- **Global Configuration**: Central configuration file (config.json) defines global settings such as theme, widget store URL, and data storage mode.
- **LocalStorage Integration**: Stores all dashboard preferences, supporting import/export/edit functionality via a LocalStorage Editing Modal.
- **Responsive Grid Layout**: Widgets are arranged in a flexible grid that adapts based on screen size.
- **Persistent State**: Saves widget properties across sessions, including detailed settings like auto-refresh status and intervals.
- **Theme Support**: Includes both light and dark themes, with easy switching between them.
- **Service Selection**: Widgets can be added by selecting services from a predefined JSON file, entering a custom URL, or pulling remote services.
- **Service Worker & PWA**: Enables offline functionality and caching.
- **Playwright Integration & Testing**: Automated tests ensure functionality, with a focus on board and view actions, widget resizing, and state persistence.
- **Custom Logger Integration**: Centralized logging mechanism for easier development and debugging.

## Getting Started

### Requirements

To run the asd-dashboard, ensure you have the following setup on your computer:
- **Node.js**: JavaScript runtime environment required to run the application.

### Quickstart

To set up and run the project, follow these steps:

1. **Clone the repository**: 
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the project directory**:
   ```bash
   cd asd-dashboard
   ```
3. **Install dependencies**:
   ```bash
   yarn install
   ```
4. **Start the application**:
   ```bash
   yarn start
   ```
5. Open your web browser and navigate to `http://localhost:3000` to access the dashboard.

### License

The project is proprietary. All rights reserved. © 2024.
```