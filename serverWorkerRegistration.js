const CACHE_NAME = 'my-cache-v2'; // Increment this version whenever you update assets
const ENABLE_SERVICE_WORKER = false; // Set to true to enable Service Worker
const swToggle = document.getElementById('sw-toggle'); 

// Set the checkbox state based on localStorage
const swEnabled = localStorage.getItem('swEnabled') === 'true';
swToggle.checked = swEnabled;

// Function to register Service Worker
function registerServiceWorker() {
    navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' })
        .then(function (registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function (error) {
            console.error('Service Worker registration failed:', error);
        });
}

// Function to unregister Service Worker
function unregisterServiceWorker() {
    navigator.serviceWorker.getRegistrations()
        .then(function (registrations) {
            for (let registration of registrations) {
                registration.unregister()
                    .then(function () {
                        console.log('Service Worker unregistered');
                    })
                    .catch(function (error) {
                        console.error('Service Worker unregistration failed:', error);
                    });
            }
        }).catch(function(error) {
            console.error('Failed to get service worker registrations:', error);
        });

    // Optional: Clear cached files
    caches.keys().then(function (cacheNames) {
        return Promise.all(
            cacheNames.map(function (cacheName) {
                return caches.delete(cacheName);
            })
        ).then(function () {
            console.log('All caches cleared');
        });
    });
}

// Register/unregister the service worker based on the stored preference
if (ENABLE_SERVICE_WORKER && 'serviceWorker' in navigator) {
    if (swEnabled) {
        registerServiceWorker();
    } else {
        unregisterServiceWorker();
    }

    // Listen for toggle change (enable/disable service worker)
    swToggle.addEventListener('change', function () {
        const isEnabled = swToggle.checked;

        // Update localStorage with the new preference
        localStorage.setItem('swEnabled', isEnabled);

        if (isEnabled) {
            registerServiceWorker();
        } else {
            unregisterServiceWorker();
        }
    });
}

// Service Worker file content:
self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installed');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('[Service Worker] Caching pre-defined assets');
            return cache.addAll([
                // Pre-cache assets here
                // Example: 'styles.css', '/scripts/main.js', etc.
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('[Service Worker] Fetching: ', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                console.log('[Service Worker] Cache hit for: ', event.request.url);
                return response;
            }
            console.log('[Service Worker] Cache miss, fetching from network: ', event.request.url);
            return fetch(event.request).then(function(networkResponse) {
                // Cache the new asset if it's fetched from the network
                return caches.open(CACHE_NAME).then(function(cache) {
                    console.log('[Service Worker] Caching new resource: ', event.request.url);
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating and cleaning up old caches');
    var cacheWhitelist = [CACHE_NAME]; // Only keep the current cache
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[Service Worker] Deleting old cache: ', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
