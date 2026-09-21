/**
 * Daily Bread — Viewer App — API Client
 * All communication with the backend REST API.
 */

import { BASE_URL } from './config.js';

const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * Core fetch wrapper with timeout and error normalization.
 * @param {string} path
 * @param {object} options
 * @returns {Promise<any>}
 */
async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : { success: false, message: 'Unexpected response format' };

    if (!response.ok) {
      throw new ApiError(data.message || `HTTP ${response.status}`, response.status);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', 0);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError('Network error. Please check your connection.', 0);
  }
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// ─── Messages ────────────────────────────────────────────────
/**
 * Fetch the latest published message.
 */
async function getLatestMessage() {
  const res = await apiFetch('/api/messages/latest');
  return res.data;
}

// ─── Reactions ───────────────────────────────────────────────
/**
 * Get reaction counts + this device's current reaction.
 * @param {string} messageId
 * @param {string} deviceId
 */
async function getReactions(messageId, deviceId) {
  const res = await apiFetch(
    `/api/messages/${messageId}/reactions?device_id=${encodeURIComponent(deviceId)}`
  );
  return res.data; // { likes, dislikes, myReaction }
}

/**
 * Submit or toggle a reaction.
 * @param {string} messageId
 * @param {string} deviceId
 * @param {'like'|'dislike'} reaction
 */
async function upsertReaction(messageId, deviceId, reaction) {
  const res = await apiFetch(`/api/messages/${messageId}/reaction`, {
    method: 'POST',
    body: JSON.stringify({ device_id: deviceId, reaction }),
  });
  return res.data; // { action, myReaction, likes, dislikes }
}

// ─── Counselling ─────────────────────────────────────────────
/**
 * Submit a counselling request.
 * @param {{ full_name: string, contact_number: string, comment?: string }} data
 */
async function submitCounselling(data) {
  const res = await apiFetch('/api/counselling', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

// ─── Prayer ──────────────────────────────────────────────────
/**
 * Get the currently active prayer event (if any, within 2-hour window).
 */
async function getCurrentPrayer() {
  const res = await apiFetch('/api/prayer/current');
  return res.data; // null or { id, scheduled_at, expires_at, message }
}

// ─── Device Registration ─────────────────────────────────────
/**
 * Register or update the device's FCM token.
 * @param {{ device_id: string, fcm_token: string, platform: string, language: string }} data
 */
async function registerDevice(data) {
  await apiFetch('/api/devices/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export {
  getLatestMessage,
  getReactions,
  upsertReaction,
  submitCounselling,
  getCurrentPrayer,
  registerDevice,
  ApiError,
  BASE_URL,
};
