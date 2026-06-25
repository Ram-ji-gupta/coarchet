/**
 * WoolCraft Studio — Product Service
 * Fetches and maintains product state, dispatching a custom event on load.
 */
let products = [];

async function loadProducts() {
  try {
    const res = await fetch(WC.api("/api/products"));
    if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
    products = await res.json();
    window.products = products; // Global reference for legacy compatibility

    // Dispatch custom event to notify other scripts (like home.js)
    document.dispatchEvent(new CustomEvent('productsLoaded', { detail: products }));
  } catch (err) {
    console.error("[products] Error loading products:", err);
  }
}

// Start loading state immediately
loadProducts();
