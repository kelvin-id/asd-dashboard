```markdown
# ASD Dashboard

ASD Dashboard is a VanillaJS Progressive Web App (PWA) designed to enhance Accelerated Software Development and Automated Service Deployment processes. It empowers users to manage remote services through dynamic, resizable widgets within iframes. The app supports multiple boards and views, allowing for flexible configurations, with user settings stored in localStorage for persistence across sessions. Configuration can be fetched via a config.json file, either remotely or locally.

## Overview

The project architecture is built on a frontend using VanillaJS, with CSS Grid for layout and iframes for embedding widgets. It leverages localStorage for user preferences, such as widget positions and board/view states, and supports fetching and applying configuration from a config.json file. The Service Worker enables PWA functionality, providing offline capabilities and caching. Testing is automated using Playwright, integrated via GitHub Actions, with static files served by a Python web server during tests. The continuous integration process ensures consistent deployment.

### Project Structure

- **Frontend**: VanillaJS and CSS Grid
- **Storage**: localStorage for user preferences
- **Service Worker**: For PWA functionality
- **Testing**: Playwright with GitHub Actions
- **Continuous Integration**: Automated testing workflows

## Features

- **Widget Management**: Add, resize, reorder, and remove widgets dynamically from a service list or custom URL. Widgets are customizable with properties like size, metadata, and settings. Widgets can load content or display API call results. Users can resize widgets using the mouse cursor by dragging from the bottom right corner, adhering to grid column and row steps.
  
- **Board and View Structure**: Supports multiple boards with child views (similar to tabs), allowing users to switch, rename, delete, or reset. The state of each view, including widget layouts and settings, is stored persistently.
  
- **Global Configuration**: Supports a central configuration file (config.json) defining global settings such as theme, widget store URL, and data storage mode.
  
- **LocalStorage Integration**: Stores all dashboard preferences, such as widget states, board orders, and view configurations. A LocalStorage Editing Modal allows users to modify stored data.
  
- **Responsive Grid Layout**: Widgets are arranged in a flexible grid that adapts based on screen size, using CSS Grid.
  
- **Persistent State**: Saves widget properties across sessions, including auto-refresh status, refresh intervals, and metadata.
  
- **Theme Support**: Includes both light and dark themes, with easy switching.
  
- **Service Selection**: Widgets can be added by selecting services from a predefined JSON file, entering a custom URL, or pulling remote services.
  
- **Service Worker & PWA**: Enables offline functionality and caching.
  
- **Playwright Integration & Testing**: Utilizes a Python web server for testing, with automated tests run via GitHub Actions.

## Getting started

### Requirements

- **Node.js**: JavaScript runtime is required to run the app.

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

### License

The project is proprietary. All rights reserved. © 2024.
```
