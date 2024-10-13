# ASD Dashboard

ASD Dashboard is a VanillaJS Progressive Web App (PWA) designed to facilitate Accelerated Software Development and Automated Service Deployment. This application allows users to manage remote services through dynamic, resizable widgets embedded within iframes. It supports multiple boards and views for flexible configuration, with user settings stored in localStorage for persistence. The app can load configuration settings from a config.json file, either remotely or locally.

## Overview

The ASD Dashboard architecture is built using VanillaJS for the frontend, employing CSS Grid for layout management and iframes for embedding widgets. User preferences, such as widget positions and board/view states, are stored using localStorage. The app supports fetching and applying configuration from a config.json file. A service worker provides PWA functionality, enabling offline mode and caching of key resources. Playwright is used for automated UI testing, integrated via GitHub Actions, with static files served by a Python web server during tests. Continuous Integration is managed through GitHub Actions, automating testing workflows and ensuring consistent deployment.

### Project Structure

- **Frontend**: VanillaJS, CSS Grid
- **Storage**: localStorage for user preferences
- **Service Worker**: Enables PWA features
- **Testing**: Playwright for automated testing
- **Continuous Integration**: GitHub Actions

## Features

- **Widget Management**: Add, resize, reorder, and remove widgets dynamically. Widgets can be customized with properties such as size, metadata, and settings like auto-refresh.
- **Board and View Structure**: Multiple boards with child views allow users to switch, rename, delete, or reset views. Persistent state storage ensures continuity across sessions.
- **Global Configuration**: Central configuration via a config.json file, defining global settings like themes, widget store URL, and data storage mode.
- **LocalStorage Integration**: Stores dashboard preferences, supports import/export/edit via a LocalStorage Editing Modal.
- **Responsive Grid Layout**: Widgets are arranged in a flexible grid that adapts to screen size.
- **Theme Support**: Light and dark themes with easy switching.
- **Service Selection**: Add widgets by selecting services from a JSON file, entering a custom URL, or pulling remote services.
- **Service Worker & PWA**: Provides offline functionality and caching.
- **Playwright Integration & Testing**: Automated tests ensure functionality, with Playwright specs for various features.

## Getting Started

### Requirements

To run the ASD Dashboard, you need to have the following installed on your computer:

- Node.js (latest LTS version)

### Quickstart

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```
   
2. **Navigate to the Project Directory**:
   ```bash
   cd asd-dashboard
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Application**:
   ```bash
   npm start
   ```

The application will be accessible at `http://localhost:3000`.

### License

The project is proprietary.  
Copyright (c) 2024.
