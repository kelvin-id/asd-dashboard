function fetchData(url, callback) {
    console.log('Fetching data from:', url);
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        callback(data);
    })
    .catch(error => {
        console.error('Fetching data failed:', error);
    });
}

function getAuthToken() {
    return 'YOUR_API_TOKEN'; // Placeholder
}

export { fetchData, getAuthToken };
