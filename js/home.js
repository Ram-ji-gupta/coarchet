/**
 * WoolCraft Studio — Home Page Script
 * Renders the featured products list and adds subtle interactive animations.
 */
(function () {
  "use strict";

  function renderFeaturedProducts() {
    const container = document.getElementById("featuredProducts");
    if (!container) return;

    const list = (window.products || []).slice(0, 3);
    container.innerHTML = "";
    const frag = document.createDocumentFragment();

    list.forEach(p => {
      const targetPage = location.pathname.endsWith('.html') ? 'product.html' : 'product';
      const card = document.createElement("div");
      card.className = "product-card animate-fade-in";
      card.innerHTML = `
        <a href="${targetPage}?id=${p.id}">
          <img src="${WC.img(p.image)}" alt="${p.name || ''}" width="400" height="220" loading="lazy" decoding="async">
          <h3>${p.name || ''}</h3>
          <p class="price">₹${p.price}</p>
        </a>
        <button type="button" onclick="addToCart(${p.id})">Add To Cart</button>
      `;
      frag.appendChild(card);
    });

    container.appendChild(frag);
  }

  // Bind to products loaded event
  document.addEventListener('productsLoaded', renderFeaturedProducts);

  // If products are already available in window, render immediately
  if (window.products && window.products.length > 0) {
    renderFeaturedProducts();
  }
})();