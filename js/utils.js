/**
 * Daily Bread — Viewer App — Utility Functions
 */

/**
 * Generates a UUID v4 string.
 * @returns {string}
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Returns a time-of-day greeting key based on current hour.
 * @returns {'goodMorning'|'goodAfternoon'|'goodEvening'}
 */
export function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'goodMorning';
  if (hour < 17) return 'goodAfternoon';
  return 'goodEvening';
}

/**
 * Robustly parses any timestamp input (Firestore object, seconds, ISO string, Date).
 * Returns a valid Date object, or null if invalid.
 * @param {*} ts
 * @returns {Date|null}
 */
export function parseTimestamp(ts) {
  if (!ts) return null;
  if (ts instanceof Date) {
    return isNaN(ts.getTime()) ? null : ts;
  }
  // Firestore Timestamp with toMillis()
  if (typeof ts.toMillis === 'function') {
    const d = new Date(ts.toMillis());
    return isNaN(d.getTime()) ? null : d;
  }
  // Firestore Timestamp object serialized as { _seconds, _nanoseconds } or { seconds, nanoseconds }
  if (typeof ts === 'object') {
    const sec = ts._seconds ?? ts.seconds;
    if (typeof sec === 'number') {
      const d = new Date(sec * 1000);
      return isNaN(d.getTime()) ? null : d;
    }
  }
  // Epoch millisecond or second number
  if (typeof ts === 'number') {
    const d = new Date(ts < 1e11 ? ts * 1000 : ts);
    return isNaN(d.getTime()) ? null : d;
  }
  // String timestamp
  if (typeof ts === 'string') {
    const trimmed = ts.trim();
    if (!trimmed) return null;
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Formats a date into a clean human-readable string.
 * Never returns 'Invalid Date'.
 * @param {*} dateInput
 * @param {string} lang - 'en' or 'ml'
 * @param {string} fallback
 * @returns {string}
 */
export function formatDate(dateInput, lang = 'en', fallback = '—') {
  const date = parseTimestamp(dateInput);
  if (!date) return fallback;

  try {
    const locale = lang === 'ml' ? 'ml-IN' : 'en-IN';
    const formatted = date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!formatted || formatted.toLowerCase().includes('invalid')) {
      return fallback;
    }
    return formatted;
  } catch {
    return fallback;
  }
}

/**
 * Formats a time into strict 12-hour format with AM/PM (e.g. "9:00 PM").
 * Never exposes 24-hour time to the user.
 * Never returns 'Invalid Date'.
 * @param {*} timeOrTs - "HH:MM" string, Date, or timestamp
 * @param {string} lang - 'en' or 'ml'
 * @param {string} fallback
 * @returns {string}
 */
export function formatTime(timeOrTs, lang = 'en', fallback = '—') {
  if (!timeOrTs) return fallback;

  // Handle "HH:MM" 24-hour string directly
  if (typeof timeOrTs === 'string' && timeOrTs.includes(':')) {
    const parts = timeOrTs.trim().split(':');
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (!isNaN(h) && !isNaN(m)) {
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      const minStr = String(m).padStart(2, '0');
      return `${h}:${minStr} ${ampm}`;
    }
  }

  const date = parseTimestamp(timeOrTs);
  if (!date) return fallback;

  try {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const minStr = String(minutes).padStart(2, '0');
    return `${hours}:${minStr} ${ampm}`;
  } catch {
    return fallback;
  }
}

/**
 * Formats date and 12-hour time together.
 * @param {*} dateInput
 * @param {string} lang - 'en' or 'ml'
 * @param {string} fallback
 * @returns {string}
 */
export function formatDateTime(dateInput, lang = 'en', fallback = '—') {
  const dStr = formatDate(dateInput, lang, '');
  const tStr = formatTime(dateInput, lang, '');
  if (dStr && tStr) return `${dStr}, ${tStr}`;
  return dStr || tStr || fallback;
}

/**
 * Shows a toast message at the bottom of the screen.
 * @param {string} message
 * @param {'success'|'error'|''} type
 * @param {number} duration - ms
 */
export function showToast(message, type = '', duration = 3000) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`.trim();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
  });

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Debounces a function.
 */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
