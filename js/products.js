/**
 * croch_etgallery — Product Service
 * Fetches and maintains product state from Supabase
 */

let products = [];

// Supabase configuration
const SUPABASE_URL = 'https://owzsyodcmdwnfpoqkxyx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93enN5b2RjbWR3bmZwb3FreHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODUwODYsImV4cCI6MjA5ODA2MTA4Nn0.KXRtVkQYETGIJ7SwQWdAR9rR46oDmSLFL-gmm1M5UhA';

let supabaseClient = null;

// Initialize Supabase client
async function initSupabase() {
  if (supabaseClient) return supabaseClient;

  // Load Supabase from CDN if not already loaded
  if (typeof supabase === 'undefined' && typeof window.supabase === 'undefined') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { createClient } = window.supabase || supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabaseClient = supabaseClient;
  return supabaseClient;
}

async function loadProducts() {
  try {
    await initSupabase();

    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    products = data || [];
    window.products = products;

    // Dispatch custom event to notify other scripts
    document.dispatchEvent(new CustomEvent('productsLoaded', { detail: products }));
  } catch (err) {
    console.error("[products] Error loading products:", err);
  }
}

// Fetch single product by ID
async function getProductById(id) {
  try {
    await initSupabase();

    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("[products] Error fetching product:", err);
    return null;
  }
}

// Export for use in other scripts
window.loadProducts = loadProducts;
window.getProductById = getProductById;
Object.defineProperty(window, 'products', {
  get: () => products,
  set: (val) => { products = val; }
});

// Start loading immediately
loadProducts();
