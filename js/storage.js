/**
 * Daily Bread — Viewer App — Local Storage Utilities
 * Manages: device_id, cached message, language preference
 */

import { generateUUID } from './utils.js';

const KEYS = {
  DEVICE_ID:     'db_device_id',
  CACHED_MSG:    'db_cached_message',
  LANGUAGE:      'db_language',
  NOTIF_BANNER:  'db_notif_banner_dismissed',
};

// ─── Device ID ───────────────────────────────────────────────
/**
 * Returns the device's persistent anonymous identifier.
 * Generates and stores one if it doesn't exist.
 */
function getDeviceId() {
  let id = localStorage.getItem(KEYS.DEVICE_ID);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(KEYS.DEVICE_ID, id);
  }
  return id;
}

// ─── Cached Message ──────────────────────────────────────────
/**
 * Returns the last successfully fetched message from localStorage.
 * Used for offline/fallback display.
 * @returns {object|null}
 */
function getCachedMessage() {
  try {
    const raw = localStorage.getItem(KEYS.CACHED_MSG);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Saves the latest message to localStorage for offline use.
 * @param {object} message
 */
function setCachedMessage(message) {
  try {
    localStorage.setItem(KEYS.CACHED_MSG, JSON.stringify(message));
  } catch {
    // Ignore storage errors (e.g. private browsing quota)
  }
}

// ─── Language Preference ──────────────────────────────────────
/**
 * Returns the user's saved language preference ('en' or 'ml').
 * Defaults to 'en'.
 * @returns {string}
 */
function getLanguage() {
  return localStorage.getItem(KEYS.LANGUAGE) || 'en';
}

/**
 * Saves the user's language preference.
 * @param {string} lang - 'en' or 'ml'
 */
function setLanguage(lang) {
  localStorage.setItem(KEYS.LANGUAGE, lang);
}

// ─── Notification Banner ──────────────────────────────────────
function isNotifBannerDismissed() {
  return localStorage.getItem(KEYS.NOTIF_BANNER) === '1';
}

function dismissNotifBanner() {
  localStorage.setItem(KEYS.NOTIF_BANNER, '1');
}

export {
  getDeviceId,
  getCachedMessage,
  setCachedMessage,
  getLanguage,
  setLanguage,
  isNotifBannerDismissed,
  dismissNotifBanner,
};
