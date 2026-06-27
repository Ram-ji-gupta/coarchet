/**
 * croch_etgallery — Checkout Controller
 * Form validation, order payload creation, and WhatsApp confirmation redirect.
 */

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

async function placeOrder() {
  const nameEl = document.getElementById('checkoutName');
  const phoneEl = document.getElementById('checkoutPhone');
  const emailEl = document.getElementById('checkoutEmail');
  const addressEl = document.getElementById('checkoutAddress');
  const customReqEl = document.getElementById('customRequirement');

  const name = nameEl?.value?.trim() || "";
  const phone = phoneEl?.value?.trim() || "";
  const email = emailEl?.value?.trim() || "";
  const address = addressEl?.value?.trim() || "";
  const customRequirement = customReqEl?.value?.trim() || "";

  if (!name || !phone || !email || !address) {
    showToast("Please fill all fields", "error");
    return;
  }

  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!Array.isArray(cart) || cart.length === 0) {
    showToast("Your shopping cart is empty", "error");
    return;
  }

  // Sanitize and validate cart items
  const items = cart
    .filter(it => it && typeof it === 'object')
    .map(it => ({
      id: Number(it.id),
      price: Number(it.price),
      qty: parseInt(it.qty, 10)
    }))
    .filter(it => Number.isFinite(it.id) && it.id > 0 && Number.isFinite(it.price) && it.price >= 0 && Number.isFinite(it.qty) && it.qty > 0);

  if (items.length === 0) {
    showToast("Your cart items are invalid", "error");
    return;
  }

  showToast("Processing order...", "info");

  try {
    await initSupabase();

    // Calculate total
    let total = 0;
    items.forEach(item => total += Number(item.price) * Number(item.qty));

    // Check if customer exists
    const { data: existingCustomer } = await supabaseClient
      .from('customers')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    // Create customer if not exists
    if (!existingCustomer) {
      await supabaseClient
        .from('customers')
        .insert([{ name, phone, email, address }]);
    }

    // Create order
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert([{
        customer: name,
        phone,
        email,
        address,
        custom_requirement: customRequirement || null,
        status: 'Pending',
        total: total.toFixed(2)
      }])
      .select();

    if (orderError) throw orderError;

    const orderId = orderData && orderData[0] ? orderData[0].id : '';

    // Get product details for WhatsApp message
    const itemsDetailed = [];
    for (const item of items) {
      const { data: product } = await supabaseClient
        .from('products')
        .select('name, description')
        .eq('id', item.id)
        .maybeSingle();

      itemsDetailed.push({
        id: item.id,
        name: product?.name || `Product #${item.id}`,
        description: product?.description || "",
        price: item.price,
        qty: item.qty
      });
    }

    // Clear cart storage
    localStorage.removeItem("cart");
    showToast("Order Placed Successfully!", "success");

    const itemsText = itemsDetailed.length
      ? itemsDetailed
          .map((it) => {
            const line = `• ${it.name || "Item"} (Qty: ${it.qty || 0}) - ₹${Number(it.price || 0).toFixed(0)}`;
            const desc = it.description ? `\n  Details: ${it.description}` : "";
            return `${line}${desc}`;
          })
          .join("\n")
      : "";

    const customRequirementText = customRequirement ? `\n\nCustom Request:\n${customRequirement}` : "";

    const waText = `Hello croch_etgallery! 🧶\n\nI have placed a new order!\n\nOrder ID: ${orderId || "N/A"}\nStatus: Pending\n\nItems Ordered:\n${itemsText}${customRequirementText}\n\nThank you!`;

    // Redirect to WhatsApp chat
    setTimeout(() => {
      window.open(WC.waLink(waText), "_blank", "noopener,noreferrer");
      window.location.href = "index.html";
    }, 1500);

  } catch (error) {
    console.error("[checkout] Order error:", error);
    showToast("Order failed. Please try again or contact support.", "error");
  }
}
