/**
 * Daily Bread — Viewer App — API Client
 * All communication with the backend REST API.
 * Includes intelligent retry with exponential backoff for Render cold starts.
 */

import { BASE_URL } from './config.js';

const DEFAULT_TIMEOUT = 35000; // 35s per attempt
const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 4000, 8000]; // Exponential backoff intervals

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Sleeps for specified milliseconds.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Core fetch wrapper with timeout, exponential backoff retries, and error sanitization.
 * Handles Render free-tier cold-start wakeups seamlessly.
 *
 * @param {string} path
 * @param {object} options
 * @returns {Promise<any>}
 */
async function apiFetch(path, options = {}) {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const maxAttempts = options.maxRetries ?? (isGet ? MAX_RETRIES : 1);
  let lastError = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutMs = options.timeout || DEFAULT_TIMEOUT;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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

      // Handle 502/503/504 (often returned while Render spins up or reloads)
      if (response.status === 502 || response.status === 503 || response.status === 504) {
        if (attempt < maxAttempts - 1) {
          const delay = RETRY_DELAYS[attempt] || 4000;
          console.info(`[API] Server starting up (HTTP ${response.status}). Retrying attempt ${attempt + 2}/${maxAttempts} in ${delay}ms...`);
          await sleep(delay);
          continue;
        }
        throw new ApiError('Server is starting up. Please try again in a moment.', response.status);
      }

      const contentType = response.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        const errorMsg = data?.message || (response.status >= 500 ? 'Server is temporarily unavailable.' : 'Request failed.');
        throw new ApiError(errorMsg, response.status);
      }

      return data || { success: true };
    } catch (err) {
      clearTimeout(timeoutId);

      const isNetworkOrTimeout = err.name === 'AbortError' || err.name === 'TypeError' || (err instanceof ApiError && err.status >= 500);

      if (isNetworkOrTimeout && attempt < maxAttempts - 1) {
        const delay = RETRY_DELAYS[attempt] || 4000;
        console.info(`[API] Transient connection failure. Retrying attempt ${attempt + 2}/${maxAttempts} in ${delay}ms...`);
        await sleep(delay);
        continue;
      }

      if (err.name === 'AbortError') {
        lastError = new ApiError('Connection timed out. Please try again.', 0);
      } else if (err instanceof ApiError) {
        lastError = err;
      } else {
        lastError = new ApiError('Please check your internet connection.', 0);
      }
      break;
    }
  }

  throw lastError || new ApiError('Unable to connect to server.', 0);
}

// ─── Messages ────────────────────────────────────────────────
/**
 * Fetch the latest published message.
 */
async function getLatestMessage() {
  const res = await apiFetch('/api/messages/latest');
  return res?.data || null;
}

// ─── Reactions ───────────────────────────────────────────────
/**
 * Get reaction counts + this device's current reaction.
 * @param {string} messageId
 * @param {string} deviceId
 */
async function getReactions(messageId, deviceId) {
  const res = await apiFetch(
    `/api/messages/${messageId}/reactions?device_id=${encodeURIComponent(deviceId)}`,
    { maxRetries: 2 }
  );
  return res?.data || { likes: 0, dislikes: 0, myReaction: null };
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
  return res?.data || null;
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
    maxRetries: 2,
  });
  return res?.data || null;
}

// ─── Prayer ──────────────────────────────────────────────────
/**
 * Get the currently active prayer event (if any, within 2-hour window).
 */
async function getCurrentPrayer() {
  try {
    const res = await apiFetch('/api/prayer/current', { maxRetries: 1 });
    return res?.data || null;
  } catch {
    return null;
  }
}

// ─── Device Registration ─────────────────────────────────────
/**
 * Register or update the device's FCM token.
 * @param {{ device_id: string, fcm_token: string, platform: string, language: string }} data
 */
async function registerDevice(data) {
  try {
    await apiFetch('/api/devices/register', {
      method: 'POST',
      body: JSON.stringify(data),
      maxRetries: 2,
    });
  } catch (err) {
    console.warn('[FCM] Token registration with backend deferred:', err.message);
  }
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
