/**
 * croch_etgallery — Shopping Cart Controller
 * Manages cart logic, local storage caching, rendering, and count indicators.
 */
var cart = JSON.parse(localStorage.getItem("cart")) || [];

// Supabase configuration
var SUPABASE_URL = 'https://owzsyodcmdwnfpoqkxyx.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93enN5b2RjbWR3bmZwb3FreHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODUwODYsImV4cCI6MjA5ODA2MTA4Nn0.KXRtVkQYETGIJ7SwQWdAR9rR46oDmSLFL-gmm1M5UhA';

var supabaseClient = null;

async function initSupabase() {
  if (supabaseClient) return supabaseClient;

  if (typeof window.supabase === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { createClient } = window.supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabaseClient = supabaseClient;
  return supabaseClient;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (!countEl) return;

  let totalItems = 0;
  cart.forEach(item => totalItems += Number(item.qty) || 0);
  countEl.textContent = totalItems;
}

async function ensureProductsLoaded() {
  try {
    const existing = window.products;
    if (Array.isArray(existing) && existing.length > 0) return;

    await initSupabase();

    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    window.products = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("[cart] Error loading products list:", err);
    window.products = Array.isArray(window.products) ? window.products : [];
  }
}

function addToCart(id) {
  const product = (window.products || []).find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1
    });
  }

  saveCart();
  updateCartCount();
  showToast(`${product.name} added to cart`);
}

function itemTotal(item) {
  return (Number(item.price) || 0) * (Number(item.qty) || 0);
}

function renderCart() {
  const container = document.getElementById("cartContainer");
  if (!container) return;

  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart-state"><p>Your cart is empty.</p><a href="products.html" class="btn">Shop Now</a></div>';
    const totalEl = document.getElementById("cartTotal");
    if (totalEl) totalEl.textContent = "Total : ₹0";
    return;
  }

  let total = 0;
  const frag = document.createDocumentFragment();

  cart.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "cart-item animate-fade-in";

    const pid = Number(item.id);
    const matched = (window.products || []).find(p => Number(p.id) === pid);
    const imgFile = matched?.image || item?.image;

    card.innerHTML = `
      <img src="${WC.img(imgFile)}" alt="${item.name || ''}" width="80" height="80" loading="lazy" decoding="async">
      <div class="cart-info">
        <h3>${item.name || ''}</h3>
        <p class="price">₹${item.price}</p>
        <p class="qty-label">Quantity: ${item.qty}</p>
      </div>
      <div class="cart-actions">
        <button type="button" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">-</button>
        <button type="button" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
        <button type="button" data-action="remove" data-index="${index}" aria-label="Remove item">🗑️</button>
      </div>
    `;

    total += itemTotal(item);
    frag.appendChild(card);
  });

  container.appendChild(frag);

  const totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.textContent = "Total : ₹" + total;
}

async function loadCart() {
  await ensureProductsLoaded();
  renderCart();
  updateCartCount();
  updateCheckoutButtonVisibility();
}

function updateCheckoutButtonVisibility() {
  const btn = document.getElementById('checkoutBtn');
  if (!btn) return;
  const hasItems = Array.isArray(cart) && cart.length > 0;
  btn.style.display = hasItems ? '' : 'none';
}

function increaseQty(index) {
  if (!cart[index]) return;
  cart[index].qty = (Number(cart[index].qty) || 0) + 1;
  saveCart();
  renderCart();
  updateCartCount();
  updateCheckoutButtonVisibility();
}

function decreaseQty(index) {
  if (!cart[index]) return;
  cart[index].qty = (Number(cart[index].qty) || 0) - 1;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
  updateCartCount();
  updateCheckoutButtonVisibility();
}

function removeItem(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartCount();
  updateCheckoutButtonVisibility();
}

// Event delegation for cart item actions
(function attachCartDelegation() {
  document.addEventListener("click", (e) => {
    const btn = e.target && e.target.closest && e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const index = Number(btn.getAttribute("data-index"));

    if (action === "increase") return increaseQty(index);
    if (action === "decrease") return decreaseQty(index);
    if (action === "remove") return removeItem(index);
  });
})();
