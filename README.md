Here's the README.md file for the ASD Dashboard project:

```markdown
# ASD Dashboard

ASD Dashboard is a pure VanillaJS application for managing remote services through widgets displayed in iframes. It provides a flexible and customizable dashboard interface that allows users to add, resize, reorder, and configure widgets dynamically.

## Overview

The ASD Dashboard is built as a single-page application (SPA) using HTML, CSS, and JavaScript without any frameworks. The project structure consists of:

- `index.html`: The main entry point of the application
- `styles.css`: Contains all the styling for the dashboard
- `main.js`: The core JavaScript file handling all the functionality
- `services.json`: A JSON file containing the list of available services

The application utilizes modern web technologies and browser APIs to provide a responsive and interactive user experience.

## Features

- Add widgets from a list of predefined services or custom URLs
- Resize widgets to customize the dashboard layout
- Reorder widgets using drag and drop or a dropdown menu
- Configure widget URLs dynamically
- Save and restore dashboard state, including widget order and size
- Toggle visibility of widget control buttons
- Boardboard mode for quick reordering of widgets
- Responsive design that utilizes the full screen size

## Getting started

### Requirements

- Node.js (latest LTS version recommended)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Quickstart

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd asd-dashboard
   ```

3. Install dependencies (if any):
   ```
   npm install
   ```

4. Start a local server:
   ```
   npx http-server
   ```

5. Open your browser and navigate to `http://localhost:8080` (or the port specified by http-server)

### License

Copyright (c) 2024. All rights reserved.
```