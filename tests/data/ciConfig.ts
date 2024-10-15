export const ciConfig = {
    "globalSettings": {
      "theme": "light",
      "widgetStoreUrl": ["*/services.json"],
      "database": "localStorage",
      "localStorage": {
          "enabled": "true",
          "loadDashboardFromConfig": "true",
          "defaultBoard": "board-1728763634657",
          "defaultView": "view-1728763634657"
      }
    },
    "boards": [],
    "styling": {
        "widget": {
            "minColumns": 1,
            "maxColumns": 6,
            "minRows": 1,
            "maxRows": 6
        }
    }
}

export const ciBoards = [
  {
    "id": "board-1234567",
    "name": "Modified Board 1",
    "order": 0,
    "views": [
      {
        "id": "view-1234567",
        "name": "Modified View 1",
        "widgetState": [
          {
            "order": "0",
            "url": "http://localhost:8000/asd/toolbox",
            "minColumns": "6",
            "maxColumns": "6",
            "minRows": "6",
            "maxRows": "6",
            "type": "web",
            "settings": {
              "autoRefresh": false,
              "refreshInterval": 0
            },
            "metadata": {
                "title": "toolbox"
            }
          }
        ]
      }
    ]
  },
  {
    "id": "board-12345678",
    "name": "Modified Board 2",
    "order": 0,
    "views": [
      {
        "id": "view-12345678",
        "name": "Modified View 2",
        "widgetState": [
          {
            "order": "0",
            "url": "http://localhost:8000/asd/toolbox",
            "type": "web",
            "settings": {
              "autoRefresh": false,
              "refreshInterval": 0
            },
            "metadata": {
                "title": "toolbox"
            }
          }
        ]
      }
    ]
  }
]