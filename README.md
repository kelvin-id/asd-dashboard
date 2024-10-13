# ASD Dashboard

ASD Dashboard is a VanillaJS Progressive Web App (PWA) designed for Accelerated Software Development and Automated Service Deployment. It provides a dynamic interface for managing remote services through customizable widgets embedded in iframes. The application supports multiple boards and views, offering flexible configurations with persistent user settings stored in localStorage.

## Overview

The ASD Dashboard is architected as a single-page application using VanillaJS, HTML, and CSS. It leverages CSS Grid for responsive layout management and iframes for embedding widgets. The application stores user preferences, such as widget positions and board/view states, in localStorage. It supports fetching configurations from a `config.json` file and uses a service worker to enable offline capabilities and caching.

The project structure includes:
- **Frontend**: VanillaJS with CSS Grid and iframes for widget management.
- **Storage**: LocalStorage for persisting user settings and configurations.
- **Service Worker**: Powers PWA features for offline access and caching.
- **Testing**: Automated UI testing with Playwright, integrated via GitHub Actions.
- **Continuous Integration**: GitHub Actions for automating testing workflows.
- **Widgets**: Use iframes for loading content from URLs or APIs, with configurable refresh intervals.
- **Themes**: Supports light and dark themes, configurable globally.

## Features

- **Widget Management**: Add, resize, reorder, and remove widgets dynamically. Widgets can be customized with properties like size, metadata, and settings, including auto-refresh intervals.
- **Board and View Structure**: Manage multiple boards and views, allowing users to switch, rename, delete, or reset views. The state of each view is persistently stored.
- **Global Configuration**: Central configuration file (`config.json`) for global settings like theme and widget store URL.
- **LocalStorage Integration**: Persistent storage of dashboard preferences, with a modal interface for editing localStorage content.
- **Responsive Grid Layout**: Flexible grid layout for widgets, adaptable to screen size.
- **Service Selection**: Widgets can be added from a predefined JSON file, custom URL, or remote services.
- **Service Worker & PWA**: Offline functionality and caching through a service worker.
- **Playwright Integration & Testing**: Automated tests with Playwright, executed via GitHub Actions.

## Getting started

### Requirements

- **Node.js**: Required to run the application and manage dependencies.

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

4. **Access the dashboard**:
   Open your web browser and navigate to `http://localhost:8000`.

### License

The project is proprietary.  
Copyright (c) 2024.
```
