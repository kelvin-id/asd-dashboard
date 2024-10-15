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

export const ciBoards = {
  "boards": [
    {
      "id": "board-1728854315081",
      "name": "Modified Board",
      "order": 0,
      "views": [
        {
          "id": "view-1728854315081",
          "name": "Modified View",
          "widgetState": [
            {
              "order": "0",
              "url": "http://localhost:8000/asd/toolbox",
              "columns": "1",
              "rows": "1",
              "type": "iframe",
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
}