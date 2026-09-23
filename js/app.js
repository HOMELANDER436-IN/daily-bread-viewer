/**
 * Daily Bread — Viewer App — Main App Controller
 * Entry point: initializes i18n, drawer, notifications, and page routing.
 */

import { setLocale, t, getLang } from './i18n.js';
import { getLanguage, setLanguage } from './storage.js';
import { initNotifications } from './notifications.js';
import { loadMessage, checkPrayerBanner, setupSilentBackgroundRefresh } from './home.js';
import { initCounsellingForm } from './counselling.js';

// ─── Page Detection ───────────────────────────────────────────
const PAGE = document.body.dataset.page || 'home';

// ─── Startup ──────────────────────────────────────────────────
async function init() {
  // 1. Restore language preference
  const savedLang = getLanguage();
  setLocale(savedLang);
  updateLangButtons(savedLang);

  // 2. Initialize drawer
  initDrawer();

  // 3. Page-specific initialization
  if (PAGE === 'home') {
    await initHome();
  } else if (PAGE === 'counselling') {
    initCounsellingForm();
  }

  // 4. Initialize notifications (non-blocking)
  initNotifications().catch(console.warn);
}

// ─── Home Page Init ───────────────────────────────────────────
async function initHome() {
  // Load cached content immediately for instant display
  await loadMessage(true);

  // Then fetch fresh content in the background
  loadMessage(false).catch(console.warn);

  // Check prayer banner
  checkPrayerBanner().catch(console.warn);

  // Set up automatic silent background refresh
  setupSilentBackgroundRefresh();

  // Set up prayer banner dismiss
  document.getElementById('prayer-dismiss')?.addEventListener('click', () => {
    document.getElementById('prayer-banner')?.classList.add('hidden');
  });

  // Set greeting
  setGreeting();
}

// ─── Greeting ─────────────────────────────────────────────────
function setGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;
  const hour = new Date().getHours();
  let key = 'goodEvening';
  if (hour < 12) key = 'goodMorning';
  else if (hour < 17) key = 'goodAfternoon';
  el.textContent = t(key);
}

// ─── Drawer ───────────────────────────────────────────────────
function initDrawer() {
  const overlay = document.getElementById('drawer-overlay');
  const drawer  = document.getElementById('app-drawer');
  const openBtn = document.getElementById('hamburger-btn');
  const closeBtn = document.getElementById('drawer-close');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    openBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    openBtn.setAttribute('aria-expanded', 'false');
  }

  openBtn?.addEventListener('click', openDrawer);
  overlay?.addEventListener('click', closeDrawer);
  closeBtn?.addEventListener('click', closeDrawer);

  // Close drawer on nav link click
  drawer.querySelectorAll('.drawer-nav a').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Mark active nav link
  const currentPath = window.location.pathname;
  drawer.querySelectorAll('.drawer-nav a').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href').split('/').pop())) {
      link.classList.add('active');
    }
    if (currentPath === '/' || currentPath.endsWith('index.html')) {
      const homeLink = drawer.querySelector('[data-nav="home"]');
      if (homeLink) homeLink.classList.add('active');
    }
  });
}

// ─── Language Switcher ────────────────────────────────────────
window.switchLanguage = function (lang) {
  setLocale(lang);
  setLanguage(lang);
  updateLangButtons(lang);

  // Update greeting after locale change
  setGreeting();

  // Re-render dynamic content labels
  if (PAGE === 'home') {
    const reactionPrompt = document.querySelector('[data-i18n="reactionPrompt"]');
    if (reactionPrompt) reactionPrompt.textContent = t('reactionPrompt');
  }
};

function updateLangButtons(lang) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// ─── Start App ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
