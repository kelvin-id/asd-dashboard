# ASD Dashboard

ASD Dashboard is a single-page application built with VanillaJS, HTML, and CSS, designed for managing remote services through widgets displayed in iframes. The application allows users to dynamically add, configure, resize, and reorder these widgets, providing a customizable dashboard experience. User preferences, including widget configurations and layout, are stored locally, ensuring persistence across sessions.

## Overview

The ASD Dashboard is architected as a single-page application (SPA) using plain HTML, CSS, and JavaScript. It leverages a grid-based layout to manage widget positioning and resizing. The project is structured into several key components:

- **HTML**: `index.html` serves as the main entry point, setting up the basic structure and controls for the dashboard.
- **CSS**: `styles.css` provides styling for the dashboard's layout and components, ensuring a responsive and user-friendly interface.
- **JavaScript**: The core functionality is divided into multiple JavaScript files, each responsible for different features such as widget management, local storage handling, and UI interactions.
- **Node.js**: Used as the JavaScript runtime environment for running the application.
- **Local Storage**: Utilized for storing user preferences and widget states, allowing persistence of user configurations.

## Features

The ASD Dashboard offers several key features:

- **Widget Management**: Users can add widgets by selecting services from a predefined list or by entering a URL. Widgets can be resized, reordered, and removed as desired.
- **Board and View System**: The application supports multiple boards, each containing views (similar to tabs). Users can create, switch, and manage different boards and views, with all configurations stored in local storage.
- **Responsive Grid Layout**: Widgets are arranged in a grid layout that adapts to screen size, ensuring optimal use of available space. Users can resize widgets within defined constraints.
- **Persistent State**: User preferences, including widget arrangements and settings, are saved in local storage, allowing the dashboard to restore its state upon page reload.
- **User Interface Enhancements**: The interface includes floating buttons for widget actions (remove, configure, resize) and supports keyboard shortcuts for improved accessibility.

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
