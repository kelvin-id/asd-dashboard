```markdown
# ASD Dashboard

ASD Dashboard is a VanillaJS Progressive Web App (PWA) designed to streamline Accelerated Software Development and Automated Service Deployment. It enables users to manage remote services through dynamic, resizable widgets within iframes. The app supports multiple boards and views for flexible configuration, with user settings stored in localStorage for persistence across sessions. Configuration can be fetched via a config.json file, either remotely or locally.

## Overview

ASD Dashboard is built using VanillaJS with CSS Grid for layout and iframes for embedding widgets. The architecture includes:

- **Frontend**: Utilizes VanillaJS for interactive features and CSS Grid for responsive widget layouts.
- **Storage**: Uses localStorage to save user preferences, such as widget positions and board/view states. Configuration can be fetched from a config.json file.
- **Service Worker**: Provides PWA capabilities, including offline mode and caching of key resources.
- **Testing**: Uses Playwright for automated UI testing, integrated with GitHub Actions for continuous integration.
- **Widgets**: Leverage iframes to load content from URLs or APIs, supporting auto-refresh based on widget type with configurable refresh intervals.
- **Remote Services**: Allows pulling and merging multiple sources to build customizable widgets and dashboards.
- **Themes**: Supports configurable light and dark themes.

The project structure includes:
- **src/component**: Contains components for boards, views, widgets, and menus.
- **src/storage**: Manages localStorage operations.
- **src/ui**: Houses CSS files for styling the application.
- **src/utils**: Includes utility functions for fetching services and configurations.
- **tests**: Contains Playwright test specifications.

## Features

ASD Dashboard offers a range of features for efficient service management:
- **Widget Management**: Add, resize, reorder, and remove widgets dynamically. Widgets can display content or API call results, with customizable properties like size, metadata, and settings.
- **Board and View Structure**: Create and manage multiple boards and views, with persistent state saving. Actions include creating, renaming, deleting, and resetting boards and views.
- **Global Configuration**: Central configuration file supports theme settings, widget store URL, and data storage mode.
- **LocalStorage Integration**: Stores all dashboard preferences, with features for import/export/editing via a modal interface.
- **Responsive Grid Layout**: Widgets are arranged in a flexible grid that adapts to screen size.
- **Persistent State**: Saves widget properties across sessions.
- **Service Selection**: Add widgets from a predefined JSON file, custom URL, or remote services.
- **Service Worker & PWA**: Provides offline functionality and caching.
- **Playwright Integration & Testing**: Automated tests ensure functionality and are run via GitHub Actions.

## Getting started

### Requirements

- **Node.js**: JavaScript runtime required to run the application.

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
   ```bash
   npm start
   ```

4. **Access the application** in your web browser at `http://localhost:8000`.

### License

The project is proprietary. Copyright (c) 2024.
```