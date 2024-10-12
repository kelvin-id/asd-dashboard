```markdown
# ASD Dashboard

ASD Dashboard is a pure VanillaJS Progressive Web App (PWA) designed for managing remote services through widgets displayed in iframes. The dashboard allows users to add, resize, reorder, and configure widgets dynamically, with all user preferences stored in localStorage to ensure persistence across sessions.

## Overview

The 'asd-dashboard' is a single-page application (SPA) built using plain HTML, CSS, and JavaScript without any frameworks. The main components include:
- `index.html`: Basic layout of the application.
- `styles.css`: Styling for the application.
- `main.js`: Core JavaScript functionality divided into feature files for better organization and maintainability.

The application uses Node.js as a runtime environment to facilitate running the app. The architecture focuses solely on frontend functionality, making AJAX calls to remote services as needed.

### Project Structure

```
asd-dashboard/
├── .github/workflows/
│   └── playwright.yml
├── src/
│   ├── component/
│   │   ├── menu/
│   │   │   ├── boardMode.js
│   │   │   └── dashboardMenu.js
│   │   ├── widget/
│   │   │   ├── events/
│   │   │   │   ├── dragDrop.js
│   │   │   │   └── fullscreenToggle.js
│   │   │   ├── menu/
│   │   │   │   └── resizeMenu.js
│   │   │   ├── utils/
│   │   │   │   ├── fetchData.js
│   │   │   │   ├── fetchServices.js
│   │   │   │   ├── getConfig.js
│   │   │   │   └── widgetUtils.js
│   │   │   └── widgetManagement.js
│   ├── storage/
│   │   └── localStorage.js
│   ├── ui/
│   │   ├── styles.css
│   │   └── unicodeEmoji.js
│   ├── setup/
│   │   ├── example-config.json
│   │   └── example-services.json
│   ├── index.html
│   ├── main.js
│   ├── serviceWorker.js
│   ├── config.json
│   ├── services.json
├── tests/
│   └── dashboard.spec.ts
├── .gitignore
├── package.json
├── playwright.config.ts
└── README.md
```

## Features

- **Widget Management**: Add, resize, reorder, and configure widgets dynamically.
- **Local Storage**: User preferences, including widget order and size, are stored in localStorage to ensure persistence across sessions.
- **Responsive Design**: Utilizes CSS Grid for flexible and responsive layouts.
- **Full-Screen Mode**: Toggle widgets to full-screen mode.
- **Grid Layout**: Uses CSS Grid for layout management, ensuring widgets fully utilize screen space.
- **Keyboard Navigation**: Use keyboard shortcuts for various actions.
- **Service Selection**: Add widgets by selecting services from a pre-defined JSON file.
- **Playwright Tests**: Automated tests for adding services, configuring widgets, and ensuring UI functionality.

## Getting started

### Requirements

- Node.js (latest LTS version)
- Yarn (for dependency management)

### Quickstart

1. **Clone the repository**:
    ```bash
    git clone git@github.com:kelvin-id/asd-dashboard.git
    cd asd-dashboard
    ```

2. **Install dependencies**:
    ```bash
    yarn install
    ```

3. **Start the application**:
    ```bash
    npm start
    ```

4. **Run Playwright tests**:
    ```bash
    npm test
    ```

### License

The project is proprietary (not open source). Copyright (c) 2024.
```