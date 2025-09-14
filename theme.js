// theme.js — centralized theme toggle for rmjm1729.github.io
(function () {
  'use strict';

  const KEY = 'theme'; // localStorage key
  const BTN_SELECTOR = '#theme-toggle';
  const DARK_CLASS = 'dark';

  // Decide initial theme: saved preference > OS preference > light
  function getInitialTheme() {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  // Apply theme to document.body and return boolean: isDark
  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle(DARK_CLASS, isDark);
    // Update all toggle buttons (if there are multiple)
    document.querySelectorAll(BTN_SELECTOR).forEach(btn => {
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      // keep accessible title
      btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
    return isDark;
  }

  // Toggle and persist
  function toggleTheme() {
    const currentIsDark = document.body.classList.contains(DARK_CLASS);
    const newTheme = currentIsDark ? 'light' : 'dark';
    localStorage.setItem(KEY, newTheme);
    applyTheme(newTheme);
  }

  // Init
  function init() {
    // Apply initial theme
    const theme = getInitialTheme();
    applyTheme(theme);

    // Wire up buttons
    document.querySelectorAll(BTN_SELECTOR).forEach(btn => {
      // Make sure button is keyboard accessible and announces state
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-pressed', document.body.classList.contains(DARK_CLASS) ? 'true' : 'false');

      btn.addEventListener('click', toggleTheme);
      // also support Enter/Space when focused on non-button elements
      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          toggleTheme();
        }
      });
    });

    // If user changes OS preference while page is open, and they haven't explicitly chosen,
    // reflect that change (nice-to-have).
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', e => {
        // only follow OS if user didn't choose (i.e. no explicit localStorage)
        if (!localStorage.getItem(KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  // Run on DOM ready (defensive)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
