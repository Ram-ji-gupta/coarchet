/**
 * croch_etgallery — Page Loader
 * Displays a branded loading screen and fades out when the page is ready.
 */
(function () {
  "use strict";

  /* Inject loading overlay HTML at the top of <body> */
  function createLoader() {
    if (document.getElementById("wc-loader")) return;

    const overlay = document.createElement("div");
    overlay.id = "wc-loader";
    overlay.setAttribute("aria-label", "Loading");
    overlay.innerHTML = `
      <div class="wc-loader__content">
        <div class="wc-loader__yarn">
          <div class="wc-loader__ball"></div>
          <div class="wc-loader__thread"></div>
        </div>
        <p class="wc-loader__text">croch_etgallery</p>
      </div>`;

    document.body.prepend(overlay);
  }

  /* Fade out and remove */
  function dismissLoader() {
    const loader = document.getElementById("wc-loader");
    if (!loader) return;

    loader.classList.add("wc-loader--hide");
    loader.addEventListener("animationend", () => loader.remove(), { once: true });
    /* Fallback */
    setTimeout(() => { if (loader.parentNode) loader.remove(); }, 800);
  }

  /* Boot */
  createLoader();

  window.addEventListener("load", () => {
    /* Small delay so the animation is visible */
    setTimeout(dismissLoader, 400);
  });
})();

