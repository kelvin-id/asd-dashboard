function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getCurrentUrl() {
    // Split the URL by "/"
    const parts = document.location.href.split("/");

    // Get the base URL (protocol + domain)
    const baseUrl = parts.slice(0, 3).join("/");

    // Get the first segment of the path after the domain
    const firstPathSegment = parts[3];

    // Combine base URL with the first path segment
    const newUrl = `${baseUrl}/${firstPathSegment}`;

    return newUrl;
}

export { debounce, getCurrentUrl };