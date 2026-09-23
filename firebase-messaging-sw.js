// Daily Bread — Firebase Messaging Service Worker
// This file MUST be served at /firebase-messaging-sw.js (root of the web server)

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase config (must match the app config)
firebase.initializeApp({
  apiKey:            'AIzaSyDEvvgtx90uZCjQdkgbVUlZSphBxi9FQ04',
  authDomain:        'manual-4b66a.firebaseapp.com',
  projectId:         'manual-4b66a',
  storageBucket:     'manual-4b66a.firebasestorage.app',
  messagingSenderId: '798366798336',
  appId:             '1:798366798336:web:46c363445ad063b0dabee5',
});

const messaging = firebase.messaging();

// Handle background messages (app is closed or in background)
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const { title, body, icon } = payload.notification || {};
  const data = payload.data || {};

  const notificationTitle = title || 'Daily Bread';
  const notificationOptions = {
    body: body || '',
    icon: icon || '/assets/icon-192.png',
    badge: '/assets/badge-72.png',
    sound: (self.location && self.location.origin ? self.location.origin : '') + '/assets/church_bell.mp3',
    tag: data.type === 'prayer' ? 'prayer-notification' : 'daily-bread',
    renotify: false,
    requireInteraction: false,
    data: {
      url: '/',
      ...data,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open or focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If app is already open, focus it
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
