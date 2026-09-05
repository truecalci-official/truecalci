/**
 * TrueCalci Universal Theme Manager
 * Provides reliable Day/Night theme toggling and synchronization across all pages.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tc_theme';

  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('calc_theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    document.documentElement.classList.toggle('light-theme', theme === 'light');

    // Update all toggle button SVGs across the document
    var sunIcons = document.querySelectorAll('.theme-icon-sun');
    var moonIcons = document.querySelectorAll('.theme-icon-moon');

    sunIcons.forEach(function (sun) {
      sun.style.display = theme === 'dark' ? 'none' : 'block';
    });

    moonIcons.forEach(function (moon) {
      moon.style.display = theme === 'dark' ? 'block' : 'none';
    });

    try {
      localStorage.setItem(STORAGE_KEY, theme);
      localStorage.setItem('calc_theme', theme);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('tc_theme_changed', { detail: { theme: theme } }));
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Immediately apply preferred theme to prevent FOUC
  var initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Bind click handlers when DOM is ready
  function initThemeButtons() {
    applyTheme(getPreferredTheme());

    document.querySelectorAll('.theme-icon-toggle-btn').forEach(function (btn) {
      btn.removeEventListener('click', toggleTheme);
      btn.addEventListener('click', toggleTheme);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeButtons);
  } else {
    initThemeButtons();
  }

  window.tcToggleTheme = toggleTheme;
  window.tcApplyTheme = applyTheme;
})();
