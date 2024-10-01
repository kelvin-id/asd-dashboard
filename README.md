```markdown
# ASD Dashboard

ASD Dashboard is a pure VanillaJS dashboard for managing remote services through widgets displayed in iframes. This single-page application (SPA) allows users to dynamically add, configure, and remove widgets by selecting services from a predefined list or by entering URLs manually.

## Overview

The 'asd-dashboard' is built using plain HTML, CSS, and JavaScript without any frameworks. The architecture is a single-page application (SPA) that focuses solely on frontend functionality. The main components of the project include:

- `index.html`: The main entry point of the application, defining the basic structure of the web page.
- `styles.css`: The stylesheet that defines the styling for the application.
- `main.js`: The core JavaScript file that handles dynamic iframe loading, event listeners for user interactions, and AJAX calls to remote services.
- `services.json`: A JSON file containing a list of services that can be used by the application.

## Features

- **Add Widgets**: Users can add widgets by selecting a service from a dropdown list or by entering a URL manually.
- **Dynamic Loading**: Widgets are dynamically loaded into the dashboard as iframes.
- **Configure Widgets**: Users can configure widgets by updating their URLs.
- **Remove Widgets**: Users can remove widgets from the dashboard.
- **Service Management**: The application fetches available services from a `services.json` file and populates the dropdown list for easy selection.
- **Reorder Widgets**: Users can reorder widgets through a boardboard mode that allows entering order numbers and saving the new order.

## Getting started

### Requirements

- Node.js: JavaScript runtime for building apps. This is required to be able to run the app you're building.

### Quickstart

1. **Clone the repository**:
    ```sh
    git clone <repository_url>
    cd asd-dashboard
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Run the application**:
    ```sh
    npm start
    ```

4. **Open your browser** and navigate to `http://localhost:3000` to view the ASD Dashboard.

## Using Boardboard Mode

Boardboard mode allows you to reorder the widgets on your dashboard. Follow these steps to use this feature:

1. **Toggle Boardboard Mode**:
    - Click the "Toggle Boardboard" button in the controls section. This will enable boardboard mode and display input fields for entering the new order of the widgets.

2. **Reorder Widgets**:
    - Enter the new order for each widget in the input fields displayed on each widget.

3. **Save the New Order**:
    - Once you have reordered the widgets, click the "Save" button that appears in the controls section to save the new order.

4. **Exit Boardboard Mode**:
    - Click the "Toggle Boardboard" button again to exit boardboard mode.

### License

The project is proprietary (not open source).

```
Copyright (c) 2024.
```