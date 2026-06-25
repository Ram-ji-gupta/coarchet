/**
 * croch_etgallery — Dark Mode
 * Single source for all pages — replaces inline <script> duplicates.
 */
(function () {
  "use strict";

  const KEY = "darkMode";
  const CLASS = "dark-mode";

  /* Apply immediately to prevent flash of light mode */
  if (localStorage.getItem(KEY) === "true") {
    document.documentElement.classList.add(CLASS);
  }

  /* Also respond to OS preference if user hasn't explicitly chosen */
  if (localStorage.getItem(KEY) === null) {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add(CLASS);
    }
  }

  /**
   * Toggle dark mode — called from the 🌙 button.
   * Exposed as a global for onclick handlers.
   */
  window.toggleDarkMode = function () {
    const isCurrentlyDark = document.documentElement.classList.contains(CLASS);
    const next = !isCurrentlyDark;

    localStorage.setItem(KEY, String(next));
    document.documentElement.classList.toggle(CLASS, next);

    /* Update the button icon */
    const btn = document.getElementById("darkModeToggle");
    if (btn) btn.textContent = next ? "☀️" : "🌙";
  };

  /* Set correct icon on load */
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("darkModeToggle");
    if (btn) {
      btn.textContent = document.documentElement.classList.contains(CLASS) ? "☀️" : "🌙";
    }
  });
})();

