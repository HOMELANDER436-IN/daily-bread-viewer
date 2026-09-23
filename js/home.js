/**
 * Daily Bread — Viewer App — Home Page Controller
 * Handles message loading, reactions, prayer banner, and refresh.
 */

import { getLatestMessage, getReactions, upsertReaction, getCurrentPrayer } from './api.js';
import { getDeviceId, getCachedMessage, setCachedMessage } from './storage.js';
import { t, getLang } from './i18n.js';
import { formatDate, showToast } from './utils.js';

let currentMessage = null;
let currentReaction = null; // 'like' | 'dislike' | null

// ─── Render: Loading Skeleton ─────────────────────────────────
function showSkeleton() {
  const container = document.getElementById('message-container');
  container.innerHTML = `
    <div class="skeleton-card">
      <div class="skeleton skeleton-line w-40 h-20" style="margin-bottom:20px"></div>
      <div class="skeleton skeleton-line w-100"></div>
      <div class="skeleton skeleton-line w-100"></div>
      <div class="skeleton skeleton-line w-80"></div>
      <div class="skeleton skeleton-line w-60" style="margin-top:16px"></div>
    </div>
  `;
}

// ─── Render: Error State ──────────────────────────────────────
function showError(msg) {
  const container = document.getElementById('message-container');
  container.innerHTML = `
    <div class="error-state">
      <p>${msg || t('loadError')}</p>
      <p style="margin-top:6px;font-size:0.82rem;color:var(--text-light)">${t('loadErrorSub')}</p>
      <button class="retry-btn" onclick="window.homeRetry()">${t('retry')}</button>
    </div>
  `;
}

// ─── Render: Empty State ──────────────────────────────────────
function showEmpty() {
  const container = document.getElementById('message-container');
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">📖</div>
      <h3>${t('noMessage')}</h3>
      <p>${t('noMessageSub')}</p>
    </div>
  `;
}

// ─── Render: Message Card ─────────────────────────────────────
function renderMessage(message, reactionData) {
  currentMessage = message;
  currentReaction = reactionData?.myReaction || null;
  const likes = reactionData?.likes ?? 0;
  const dislikes = reactionData?.dislikes ?? 0;
  const lang = getLang();

  const container = document.getElementById('message-container');
  container.innerHTML = `
    <div class="message-card" id="msg-card">
      <div class="message-card-label" data-i18n="todayMessage">${t('todayMessage')}</div>
      <div class="message-body">
        ${message.title ? `<h2 class="message-title">${escapeHtml(message.title)}</h2>` : ''}
        <p class="message-content">${escapeHtml(message.content)}</p>
        ${message.reference ? `
          <div class="message-reference">${escapeHtml(message.reference)}</div>
        ` : ''}
        <div class="message-meta">
          <span>${formatDate(message.created_at, lang)}</span>
        </div>
      </div>
      <hr class="message-divider">
      <div class="reaction-bar">
        <span class="reaction-label" data-i18n="reactionPrompt">${t('reactionPrompt')}</span>
        <button
          id="like-btn"
          class="reaction-btn ${currentReaction === 'like' ? 'active-like' : ''}"
          onclick="window.handleReaction('like')"
          aria-label="${t('like')}"
          aria-pressed="${currentReaction === 'like'}"
        >
          <span class="reaction-emoji">👍</span>
          <span id="like-count">${likes}</span>
        </button>
        <button
          id="dislike-btn"
          class="reaction-btn ${currentReaction === 'dislike' ? 'active-dislike' : ''}"
          onclick="window.handleReaction('dislike')"
          aria-label="${t('dislike')}"
          aria-pressed="${currentReaction === 'dislike'}"
        >
          <span class="reaction-emoji">👎</span>
          <span id="dislike-count">${dislikes}</span>
        </button>
      </div>
    </div>
  `;
}

// ─── Load Message ─────────────────────────────────────────────
export async function loadMessage(fromCache = false) {
  if (fromCache) {
    const cached = getCachedMessage();
    if (cached) {
      renderMessage(cached, null);
      // Then fetch reactions separately
      fetchReactionsForCached(cached.id);
    } else {
      showSkeleton();
    }
    return;
  }

  showSkeleton();

  try {
    const message = await getLatestMessage();

    if (!message) {
      showEmpty();
      return;
    }

    // Cache for offline use
    setCachedMessage(message);

    // Fetch reactions
    const deviceId = getDeviceId();
    let reactionData = null;
    try {
      reactionData = await getReactions(message.id, deviceId);
    } catch {
      // Reactions are non-critical
    }

    renderMessage(message, reactionData);
  } catch (err) {
    // Try fallback to cache
    const cached = getCachedMessage();
    if (cached) {
      renderMessage(cached, null);
      showToast(t('loadError'), 'error');
    } else {
      showError(err.message);
    }
  }
}

async function fetchReactionsForCached(messageId) {
  try {
    const deviceId = getDeviceId();
    const reactionData = await getReactions(messageId, deviceId);
    if (reactionData) {
      currentReaction = reactionData.myReaction;
      updateReactionUI(reactionData.likes, reactionData.dislikes);
    }
  } catch {
    // Non-critical
  }
}

// ─── Reaction Handler ─────────────────────────────────────────
window.handleReaction = async function (reaction) {
  if (!currentMessage) return;

  const likeBtn    = document.getElementById('like-btn');
  const dislikeBtn = document.getElementById('dislike-btn');
  if (!likeBtn || !dislikeBtn) return;

  likeBtn.disabled = true;
  dislikeBtn.disabled = true;

  try {
    const deviceId = getDeviceId();
    const result = await upsertReaction(currentMessage.id, deviceId, reaction);

    currentReaction = result.myReaction;
    updateReactionUI(result.likes, result.dislikes);
  } catch (err) {
    showToast(err.message || 'Failed to react', 'error');
  } finally {
    likeBtn.disabled = false;
    dislikeBtn.disabled = false;
  }
};

function updateReactionUI(likes, dislikes) {
  const likeCount    = document.getElementById('like-count');
  const dislikeCount = document.getElementById('dislike-count');
  const likeBtn      = document.getElementById('like-btn');
  const dislikeBtn   = document.getElementById('dislike-btn');
  if (!likeCount || !likeBtn) return;

  likeCount.textContent    = likes;
  dislikeCount.textContent = dislikes;

  likeBtn.className    = `reaction-btn ${currentReaction === 'like' ? 'active-like' : ''}`;
  dislikeBtn.className = `reaction-btn ${currentReaction === 'dislike' ? 'active-dislike' : ''}`;
  likeBtn.setAttribute('aria-pressed', currentReaction === 'like');
  dislikeBtn.setAttribute('aria-pressed', currentReaction === 'dislike');
}

// ─── Retry Handler ────────────────────────────────────────────
window.homeRetry = function () {
  loadMessage(false);
};

// ─── Prayer Banner ────────────────────────────────────────────
export async function checkPrayerBanner() {
  const banner = document.getElementById('prayer-banner');
  if (!banner) return;

  try {
    const event = await getCurrentPrayer();
    if (!event) {
      banner.classList.add('hidden');
      return;
    }

    const expiryRaw = event.expires_at || event.expiresAt;
    const expiresAt = new Date(expiryRaw);
    if (new Date() > expiresAt) {
      banner.classList.add('hidden');
      return;
    }

    if (event.message) {
      const bodyEl = banner.querySelector('[data-i18n="prayerBody"]') || banner.querySelector('p');
      if (bodyEl) bodyEl.textContent = event.message;
    }

    banner.classList.remove('hidden');

    // Auto-hide when expires
    const msUntilExpiry = expiresAt.getTime() - Date.now();
    if (msUntilExpiry > 0) {
      setTimeout(() => {
        banner.classList.add('hidden');
      }, msUntilExpiry);
    }
  } catch {
    // Non-critical
    if (banner) banner.classList.add('hidden');
  }
}

// ─── Silent Background Refresh ───────────────────────────────
let refreshTimer = null;

export async function silentCheckForUpdates() {
  try {
    const message = await getLatestMessage();
    if (!message) {
      if (currentMessage) showEmpty();
      return;
    }

    const isNew = !currentMessage || currentMessage.id !== message.id;
    const isUpdated = currentMessage && (
      currentMessage.content !== message.content ||
      currentMessage.title !== message.title ||
      currentMessage.reference !== message.reference
    );

    if (isNew || isUpdated) {
      setCachedMessage(message);
      const deviceId = getDeviceId();
      let reactionData = null;
      try {
        reactionData = await getReactions(message.id, deviceId);
      } catch {
        // Non-critical
      }
      renderMessage(message, reactionData);
    }

    checkPrayerBanner();
  } catch {
    // Silent fail in background — do not disturb user
  }
}

export function setupSilentBackgroundRefresh() {
  // 1. Silent interval approx every hour (60 minutes)
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => {
    silentCheckForUpdates();
  }, 60 * 60 * 1000);

  // 2. Foreground wakeup on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      silentCheckForUpdates();
    }
  });

  // 3. Window focus
  window.addEventListener('focus', () => {
    silentCheckForUpdates();
  });

  // 4. Network online event
  window.addEventListener('online', () => {
    silentCheckForUpdates();
  });
}

// ─── Utility ──────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
