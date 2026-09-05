/**
 * TrueCalci Universal Currency Selector Component
 * Provides clean multi-currency selection (USD, EUR, GBP, INR) across all pages.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tc_currency';
  var SUPPORTED = {
    USD: { code: 'USD', symbol: '$', label: 'USD ($)', name: 'US Dollar', rateToUsd: 1.0 },
    EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', name: 'Euro', rateToUsd: 0.92 },
    GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)', name: 'British Pound', rateToUsd: 0.79 },
    INR: { code: 'INR', symbol: '₹', label: 'INR (₹)', name: 'Indian Rupee', rateToUsd: 83.2 }
  };

  function getCurrency() {
    var saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('calc_currency');
    if (saved && SUPPORTED[saved.toUpperCase()]) {
      return saved.toUpperCase();
    }
    // Check legacy region keys
    var legacy = localStorage.getItem('tc_region') || localStorage.getItem('calc_region');
    if (legacy === 'india' || legacy === 'INR') return 'INR';
    if (legacy === 'EUR' || legacy === 'europe') return 'EUR';
    if (legacy === 'GBP' || legacy === 'uk') return 'GBP';

    // Location / timezone detection (default to USD if not India timezone)
    try {
      var tz = (window.Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
      if (tz && (tz.indexOf('Calcutta') !== -1 || tz.indexOf('Kolkata') !== -1)) {
        return 'INR';
      }
    } catch (e) {}

    return 'USD';
  }

  function setCurrency(code) {
    if (!SUPPORTED[code]) code = 'USD';
    try {
      localStorage.setItem(STORAGE_KEY, code);
      localStorage.setItem('calc_currency', code);
      localStorage.setItem('tc_region', code === 'INR' ? 'india' : 'global');
      localStorage.setItem('calc_region', code === 'INR' ? 'india' : 'global');
      document.documentElement.setAttribute('data-currency', code);
    } catch (e) {}

    updateUI(code);
    window.dispatchEvent(new CustomEvent('tc_currency_changed', { detail: { currency: code, meta: SUPPORTED[code] } }));
  }

  function updateUI(activeCode) {
    var info = SUPPORTED[activeCode] || SUPPORTED.USD;

    document.querySelectorAll('.tc-currency-label, #global-currency-label').forEach(function (el) {
      el.textContent = info.label;
    });

    document.querySelectorAll('.tc-currency-option, .tc-currency-opt').forEach(function (btn) {
      var isSelected = btn.getAttribute('data-currency') === activeCode;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }

  function init() {
    var active = getCurrency();
    document.documentElement.setAttribute('data-currency', active);
    updateUI(active);

    // Initial dispatch so listeners sync immediately
    window.dispatchEvent(new CustomEvent('tc_currency_changed', { detail: { currency: active, meta: SUPPORTED[active] } }));

    // Document click to toggle and select currency
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.tc-currency-trigger-btn, .tc-currency-btn, #global-currency-btn');
      if (trigger) {
        e.preventDefault();
        var wrapper = trigger.closest('.tc-currency-dropdown-wrapper');
        if (!wrapper) return;
        var isOpen = wrapper.classList.contains('is-open');
        // Close any other open dropdowns
        document.querySelectorAll('.tc-currency-dropdown-wrapper.is-open').forEach(function (w) {
          w.classList.remove('is-open');
          var tr = w.querySelector('.tc-currency-trigger-btn, .tc-currency-btn, #global-currency-btn');
          if (tr) tr.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          wrapper.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
        return;
      }

      var option = e.target.closest('.tc-currency-option, .tc-currency-opt');
      if (option) {
        e.preventDefault();
        var selected = option.getAttribute('data-currency');
        setCurrency(selected);
        var wrapper = option.closest('.tc-currency-dropdown-wrapper');
        if (wrapper) {
          wrapper.classList.remove('is-open');
          var tr = wrapper.querySelector('.tc-currency-trigger-btn, .tc-currency-btn, #global-currency-btn');
          if (tr) tr.setAttribute('aria-expanded', 'false');
        }
        return;
      }

      if (!e.target.closest('.tc-currency-dropdown-wrapper')) {
        document.querySelectorAll('.tc-currency-dropdown-wrapper.is-open').forEach(function (w) {
          w.classList.remove('is-open');
          var tr = w.querySelector('.tc-currency-trigger-btn, .tc-currency-btn, #global-currency-btn');
          if (tr) tr.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.tcGetCurrency = getCurrency;
  window.tcSetCurrency = setCurrency;
  window.tcCurrencyMeta = SUPPORTED;
})();
