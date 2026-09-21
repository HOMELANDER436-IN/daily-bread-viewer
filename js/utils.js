/**
 * Daily Bread — Viewer App — Utility Functions
 */

/**
 * Generates a UUID v4 string.
 * Uses crypto.randomUUID() if available, otherwise falls back to a manual implementation.
 * @returns {string}
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
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
 * Formats a date string into a human-readable format.
 * @param {string} dateStr - ISO date string
 * @param {string} lang - 'en' or 'ml'
 * @returns {string}
 */
export function formatDate(dateStr, lang = 'en') {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const locale = lang === 'ml' ? 'ml-IN' : 'en-IN';
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
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
