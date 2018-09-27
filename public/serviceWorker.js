const CACHE_NAME = 'pwa-cache';
const CACHE_URLS = [
  'https://code.jquery.com/jquery-2.2.4.js',
  '/style.css',
  '/app.js'
];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS)));
});

self.addEventListener('fetch', ev => {
  ev.respondWith(
    caches
      .open(CACHE_NAME)
      .then(cache =>
        cache
          .match(ev.request)
          .then(cachedResponse => cachedResponse || fetch(ev.request))
      )
  );
});

self.addEventListener('push', ev => {
  console.log('push', ev);
  var message = ev.data.text();

  ev.waitUntil(
    self.registration.showNotification('Push message received', {
      body: message
    })
  );
});

self.addEventListener('notificationclick', ev => {
  console.log('notificationclick in sw');

  const url = 'http://localhost:4000';

  ev.notification.close();

  ev.waitUntil(clients.openWindow(url));
});
