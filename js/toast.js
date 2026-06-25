/**
 * croch_etgallery — Toast Notifications
 * Replaces alert() with sleek, non-blocking toasts.
 *
 * Usage:
 *   showToast("Item added to cart");              // default (success)
 *   showToast("Something went wrong", "error");   // error
 *   showToast("Please wait…", "info");            // info
 */
(function () {
  "use strict";

  /* Create container once */
  let container;

  function ensureContainer() {
    if (container) return container;
    container = document.createElement("div");
    container.id = "wc-toast-container";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("role", "status");
    document.body.appendChild(container);
    return container;
  }

  /**
   * @param {string} message
   * @param {"success"|"error"|"info"} [type="success"]
   * @param {number} [durationMs=3000]
   */
  window.showToast = function (message, type, durationMs) {
    type = type || "success";
    durationMs = durationMs || 3000;

    const wrap = ensureContainer();
    const toast = document.createElement("div");
    toast.className = `wc-toast wc-toast--${type}`;

    const icons = { success: "✓", error: "✕", info: "ℹ" };
    toast.innerHTML = `<span class="wc-toast__icon">${icons[type] || "✓"}</span>
      <span class="wc-toast__msg">${message}</span>`;

    wrap.appendChild(toast);

    /* Trigger enter animation */
    requestAnimationFrame(() => toast.classList.add("wc-toast--show"));

    /* Auto dismiss */
    setTimeout(() => {
      toast.classList.remove("wc-toast--show");
      toast.classList.add("wc-toast--hide");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
      /* Fallback removal */
      setTimeout(() => { if (toast.parentNode) toast.remove(); }, 500);
    }, durationMs);
  };
})();

