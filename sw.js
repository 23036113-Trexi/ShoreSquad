/**
 * ShoreSquad Service Worker
 * Enables offline support and app-like experience
 */

const CACHE_NAME = 'shoresquad-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './manifest.json'
];

/**
 * Install event - cache assets
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching essential assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
            .catch((error) => console.error('Cache installation failed:', error))
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

/**
 * Fetch event - serve from cache, fallback to network
 * Strategy: Cache first for assets, Network first for API calls
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and external URLs
    if (request.method !== 'GET') {
        return;
    }

    // API calls - network first
    if (url.pathname.includes('/api/') || 
        url.hostname !== self.location.hostname) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Assets - cache first
    event.respondWith(cacheFirst(request));
});

/**
 * Cache first strategy for static assets
 */
async function cacheFirst(request) {
    try {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }

        const response = await fetch(request);
        
        if (!response || response.status !== 200 || response.type === 'error') {
            return response;
        }

        // Clone and cache the response
        const responseToCache = response.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, responseToCache);
        
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        // Return offline page if available
        const cached = await caches.match(request);
        return cached || new Response('Offline - content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Network first strategy for API calls
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        
        if (response && response.status === 200) {
            // Cache successful responses
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.error('Network request failed:', error);
        
        // Return cached response if available
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }

        // Return offline response
        return new Response('Network request failed', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Handle background sync for offline actions
 */
self.addEventListener('sync', (event) => {
    console.log('Background sync event:', event.tag);
    
    if (event.tag === 'sync-cleanups') {
        event.waitUntil(syncCleanups());
    }
});

/**
 * Sync cleanup data when connection is restored
 */
async function syncCleanups() {
    try {
        const db = await openDatabase();
        const pendingCleanups = await getAllFromStore(db, 'pending-cleanups');
        
        for (const cleanup of pendingCleanups) {
            await fetch('/api/cleanups', {
                method: 'POST',
                body: JSON.stringify(cleanup),
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        await clearStore(db, 'pending-cleanups');
        console.log('Cleanups synced successfully');
    } catch (error) {
        console.error('Sync failed:', error);
        throw error;
    }
}

/**
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
    let notificationData = {
        title: 'ShoreSquad',
        body: 'A new cleanup event is nearby!'
    };

    if (event.data) {
        try {
            notificationData = event.data.json();
        } catch (error) {
            notificationData.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: './assets/icon-192.png',
            badge: './assets/badge-72.png',
            tag: 'shoresquad-notification',
            requireInteraction: false,
            actions: [
                {
                    action: 'open',
                    title: 'Join Event'
                },
                {
                    action: 'close',
                    title: 'Dismiss'
                }
            ]
        })
    );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    for (let client of clientList) {
                        if (client.url === '/' && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    if (clients.openWindow) {
                        return clients.openWindow('/');
                    }
                })
        );
    }
});

/**
 * Simple IndexedDB helper functions
 */
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ShoreSquad', 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pending-cleanups')) {
                db.createObjectStore('pending-cleanups', { keyPath: 'id' });
            }
        };
    });
}

function getAllFromStore(db, storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

function clearStore(db, storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}
