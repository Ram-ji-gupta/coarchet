/**
 * croch_etgallery — Shop Page Controller
 * Wires search, category filtering, and product rendering.
 */
(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function getSelectedCategory(selectEl) {
    if (!selectEl) return "";
    const selected = selectEl.options[selectEl.selectedIndex];
    if (selected?.value !== undefined) return selected.value.trim();
    return (selected?.text || '').trim();
  }

  async function loadAndRenderProducts() {
    const grid = document.getElementById('shopProducts');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    if (!grid) return;

    // Show beautiful skeletal or text loader
    grid.innerHTML = '<div class="loading-state"><p>Loading our handmade collection...</p></div>';

    let products = [];
    try {
      // Use Supabase client
      const SUPABASE_URL = 'https://owzsyodcmdwnfpoqkxyx.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93enN5b2RjbWR3bmZwb3FreHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODUwODYsImV4cCI6MjA5ODA2MTA4Nn0.KXRtVkQYETGIJ7SwQWdAR9rR46oDmSLFL-gmm1M5UhA';

      if (!window.supabaseClient) {
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
        window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }

      const { data, error } = await window.supabaseClient
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      products = data || [];

      // Keep compatibility with global product state
      window.products = products;
      window.allProducts = products;
    } catch (err) {
      console.error('[products-page] Fetch error:', err);
      grid.innerHTML = `<div class="error-state"><p>Failed to load products. Please check your connection or try again.</p></div>`;
      return;
    }

    const render = (list) => {
      grid.innerHTML = '';
      if (list.length === 0) {
        grid.innerHTML = `<div class="no-results"><p>No items match your search or filter criteria.</p></div>`;
        return;
      }

      const frag = document.createDocumentFragment();

      list.forEach(p => {
        const id = p.id;
        const name = escapeHtml(p.name || '');
        const price = p.price ?? '';
        const descRaw = p.description ? String(p.description) : '';
        const desc = descRaw
          ? `${escapeHtml(descRaw.slice(0, 90))}${descRaw.length > 90 ? '...' : ''}`
          : '';

        const targetPage = location.pathname.endsWith('.html') ? 'product.html' : 'product';
        const card = document.createElement('div');
        card.className = 'product-card animate-fade-in';
        card.innerHTML = `
          <a href="${targetPage}?id=${id}">
            <img src="${WC.img(p.image)}" alt="${name}" width="400" height="220" loading="lazy" decoding="async">
            <h3>${name}</h3>
            <p class="price">₹${price}</p>
            ${desc ? `<p class="desc">${desc}</p>` : ''}
          </a>
          <button type="button" onclick="addToCart(${id})">Add To Cart</button>
        `;
        frag.appendChild(card);
      });

      grid.appendChild(frag);
    };

    const getFiltered = () => {
      const q = (searchInput?.value || '').trim().toLowerCase();
      const cat = getSelectedCategory(categoryFilter).toLowerCase();

      return products.filter(p => {
        const name = String(p.name || '').toLowerCase();
        const desc = String(p.description || '').toLowerCase();
        const category = String(p.category || '').toLowerCase();

        const matchesSearch = !q ||
          name.includes(q) ||
          desc.includes(q) ||
          (category && category.includes(q));

        const matchesCategory = !cat ||
          (category && category.includes(cat)) ||
          (!category && name.includes(cat));

        return matchesSearch && matchesCategory;
      });
    };

    // Initial render
    render(getFiltered());

    // Event listeners for instant search/filter feedback
    if (searchInput) {
      searchInput.addEventListener('input', () => render(getFiltered()));
    }
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => render(getFiltered()));
    }

    // Read category query param if present from homepage click
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam && categoryFilter) {
      for (let i = 0; i < categoryFilter.options.length; i++) {
        if (categoryFilter.options[i].value.toLowerCase() === catParam.toLowerCase() ||
            categoryFilter.options[i].text.toLowerCase() === catParam.toLowerCase()) {
          categoryFilter.selectedIndex = i;
          render(getFiltered());
          break;
        }
      }
    }
  }

  function init() {
    loadAndRenderProducts().catch(console.error);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

