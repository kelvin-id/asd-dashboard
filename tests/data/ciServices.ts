export const ciServices = [
    {
        "name": "ASD-toolbox",
        "url": "http://localhost:8000/asd/toolbox",
        "type": "api",
        "config": {
            "minColumns": 1,
            "maxColumns": 4,
            "minRows": 1,
            "maxRows": 4
    }
    },
    {
        "name": "ASD-terminal",
        "url": "http://localhost:8000/asd/terminal",
        "type": "web",
        "config": {
            "minColumns": 2,
            "maxColumns": 6,
            "minRows": 2,
            "maxRows": 6
    }
    },
    {
        "name": "ASD-tunnel",
        "url": "http://localhost:8000/asd/tunnel",
        "type": "web",
        "config": {
            "minColumns": 1,
            "maxColumns": 6,
            "minRows": 1,
            "maxRows": 6
    }
    },
    {
        "name": "ASD-containers",
        "url": "http://localhost:8000/asd/containers",
        "type": "web",
        "config": {
            "minColumns": 2,
            "maxColumns": 4,
            "minRows": 2,
            "maxRows": 6
    }
    },
];