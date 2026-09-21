/**
 * Daily Bread — Viewer App — Notifications (FCM Web Push)
 * Handles notification permission, FCM token retrieval, and device registration.
 */

import { registerDevice } from './api.js';
import { getDeviceId, getLanguage, isNotifBannerDismissed, dismissNotifBanner } from './storage.js';
import { t } from './i18n.js';

// ─── Firebase Web Configuration ────────────────────────────────
// Your project's web app config (public — safe to expose)
const firebaseConfig = {
  apiKey:            'AIzaSyDEvvgtx90uZCjQdkgbVUlZSphBxi9FQ04',
  authDomain:        'manual-4b66a.firebaseapp.com',
  projectId:         'manual-4b66a',
  storageBucket:     'manual-4b66a.firebasestorage.app',
  messagingSenderId: '798366798336',
  appId:             '1:798366798336:web:46c363445ad063b0dabee5',
};

// ─── VAPID Key ─────────────────────────────────────────────────
// Get from: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
// Generate key pair → Copy the public key
const VAPID_KEY = 'BF60of-yEEghT1ovaSg3OSz64MkqM-pG1oG43keUcVNx6zHg6qzcUJ1w8V_fKE43uO7MGYyqus7wajVjMxTk9jg';
// Example: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjZEcYlCVHOeldrui5gWsz-YJqEw'

let messaging = null;
let firebaseApp = null;

/**
 * Initialize Firebase Messaging if not already done.
 */
async function initFirebase() {
  if (firebaseApp) return;

  try {
    // Dynamically import Firebase modules from CDN
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getMessaging, getToken, onMessage } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

    firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log('[FCM] Foreground message:', payload);
      handleForegroundNotification(payload);
    });
  } catch (err) {
    console.warn('[FCM] Firebase init failed:', err.message);
  }
}

/**
 * Show an in-app notification when the app is in the foreground.
 */
function handleForegroundNotification(payload) {
  const { title, body } = payload.notification || {};
  const data = payload.data || {};

  if (data.type === 'prayer') {
    // Show prayer banner
    const banner = document.getElementById('prayer-banner');
    if (banner) {
      banner.classList.remove('hidden');
      // Set expiry auto-hide if expires_at is provided
      if (data.expires_at) {
        const msLeft = new Date(data.expires_at).getTime() - Date.now();
        if (msLeft > 0) {
          setTimeout(() => banner.classList.add('hidden'), msLeft);
        }
      }
    }
  }

  // Also show a brief toast
  if (title) {
    import('./utils.js').then(({ showToast }) => {
      showToast(`${title}: ${body}`, '', 5000);
    });
  }
}

/**
 * Request notification permission and register FCM token with backend.
 * @returns {Promise<boolean>} - true if successful
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    await initFirebase();
    if (!messaging) return false;

    const { getToken } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) return false;

    // Register token with backend
    const deviceId = getDeviceId();
    const language = getLanguage();
    await registerDevice({ device_id: deviceId, fcm_token: token, platform: 'web', language });

    console.log('[FCM] Device registered successfully');
    return true;
  } catch (err) {
    console.warn('[FCM] Token registration failed:', err.message);
    return false;
  }
}

/**
 * Initialize notifications on app startup.
 * Shows permission banner if not yet granted.
 */
export async function initNotifications() {
  if (!('Notification' in window)) return;

  // If already granted, initialize silently
  if (Notification.permission === 'granted') {
    await initFirebase();
    await silentlyRegisterToken();
    return;
  }

  // Show notification permission banner if not dismissed
  if (Notification.permission === 'default' && !isNotifBannerDismissed()) {
    showNotifBanner();
  }
}

/**
 * Re-registers the FCM token without asking for permission (already granted).
 */
async function silentlyRegisterToken() {
  try {
    await initFirebase();
    if (!messaging) return;

    const { getToken } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js');
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });

    if (token) {
      const deviceId = getDeviceId();
      const language = getLanguage();
      await registerDevice({ device_id: deviceId, fcm_token: token, platform: 'web', language });
    }
  } catch (err) {
    console.warn('[FCM] Silent token refresh failed:', err.message);
  }
}

function showNotifBanner() {
  const banner = document.getElementById('notif-permission-banner');
  if (!banner) return;

  banner.classList.remove('hidden');
  banner.querySelector('#notif-allow-btn')?.addEventListener('click', async () => {
    banner.classList.add('hidden');
    dismissNotifBanner();
    await requestNotificationPermission();
  });
  banner.querySelector('#notif-dismiss-btn')?.addEventListener('click', () => {
    banner.classList.add('hidden');
    dismissNotifBanner();
  });
}
