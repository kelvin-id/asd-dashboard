# ASD Dashboard

ASD Dashboard is a VanillaJS Progressive Web App (PWA) designed to facilitate Accelerated Software Development and Automated Service Deployment. This application enables users to manage remote services through dynamic, resizable widgets within iframes. It supports multiple boards and views, providing flexible configurations and persistent user settings across sessions via localStorage. Configuration can be fetched from a config.json file, either remotely or locally.

## Overview

The ASD Dashboard is built using VanillaJS for the frontend, with CSS Grid employed for layout management and iframes for embedding widgets. The app leverages localStorage to store user preferences, such as widget positions and board/view states, ensuring persistence across sessions. A service worker provides PWA capabilities, enabling offline functionality and caching. Automated UI testing is conducted with Playwright, integrated via GitHub Actions. Static files are served by a Python web server during tests. The application supports configurable light and dark themes and a flexible grid layout that can scale from 1 to 6 columns/rows by default.

### Project Structure

- **Frontend**: VanillaJS, CSS Grid
- **Storage**: localStorage for user preferences
- **Service Worker**: Enables PWA functionality
- **Testing**: Playwright for automated UI testing
- **Continuous Integration**: GitHub Actions for automated testing and deployment
- **Widgets**: Iframes for loading content from URLs or APIs
- **Themes**: Configurable light and dark themes

## Features

- **Widget Management**: Add, resize, reorder, and remove widgets dynamically. Widgets are customizable with properties like size, metadata, and settings. Widgets can load content or display API call results, with auto-refresh capabilities.
- **Board and View Structure**: Multiple boards with child views allow users to switch, rename, delete, or reset configurations. The state of each view, including widget layouts and settings, is stored persistently.
- **Global Configuration**: Supports a central configuration file for defining global settings such as theme, widget store URL, and data storage mode.
- **LocalStorage Integration**: Stores all dashboard preferences and supports loading the initial setup from config.json. A LocalStorage Editing Modal allows users to modify stored data directly.
- **Responsive Grid Layout**: Widgets are arranged in a flexible grid that adapts based on screen size.
- **Theme Support**: Includes both light and dark themes, with easy switching via global settings.
- **Service Selection**: Widgets can be added by selecting services from a predefined JSON file, entering a custom URL, or pulling remote services.
- **Service Worker & PWA**: Provides offline functionality and caching.
- **Playwright Integration & Testing**: Automated tests ensure functionality.
- **Custom Logger Integration**: A logging utility to manage log statements efficiently.

## Getting Started

### Requirements

To run the ASD Dashboard, ensure you have the following installed:

- Node.js: A JavaScript runtime for building applications.

### Quickstart

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

4. **Access the Application**:
   Open your web browser and navigate to `http://localhost:3000`.

### License

The project is proprietary.  
Copyright (c) 2024.
