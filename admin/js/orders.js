let supabaseClient = null;

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
  supabaseClient = createClient(
    'https://owzsyodcmdwnfpoqkxyx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93enN5b2RjbWR3bmZwb3FreHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODUwODYsImV4cCI6MjA5ODA2MTA4Nn0.KXRtVkQYETGIJ7SwQWdAR9rR46oDmSLFL-gmm1M5UhA'
  );
  return supabaseClient;
}

// ==========================
// LOAD ORDERS
// ==========================

async function loadOrders() {
  try {
    await initSupabase();

    const { data: orders, error } = await supabaseClient
      .from('orders')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    const container = document.getElementById("ordersList");
    if (!container) return;

    container.innerHTML = "";

    orders?.forEach(order => {
      const status = order.status || "Pending";
      container.innerHTML += `
        <div class="order-card" data-order-id="${order.id}">
          <h3>${order.customer}</h3>
          <p>📞 ${order.phone}</p>
          <p>📍 ${order.address}</p>
          <p>💰 ₹${order.total}</p>
          <div class="status-row">
            <span>Current Status</span>
            <span class="status-badge ${status.toLowerCase()}">${status}</span>
          </div>
          <div style="display:flex;gap:8px;margin-top:8px;">
            <select class="status-select" data-order-id="${order.id}">
              <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Processing" ${status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
            <button class="delete-order-btn" data-action="delete-order">🗑️ Delete</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

// ==========================
// INITIALIZE
// ==========================

document.addEventListener('DOMContentLoaded', () => {
  loadOrders();

  // Event delegation for status change
  document.getElementById('ordersList')?.addEventListener('change', async (e) => {
    if (!e.target.classList.contains('status-select')) return;
    const id = e.target.getAttribute('data-order-id');
    const newStatus = e.target.value;
    try {
      await initSupabase();
      const { error } = await supabaseClient
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      // Update badge
      const card = e.target.closest('.order-card');
      const badge = card?.querySelector('.status-badge');
      if (badge) {
        badge.textContent = newStatus;
        badge.className = `status-badge ${newStatus.toLowerCase()}`;
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  });

  // Event delegation for delete order button
  document.getElementById('ordersList')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action="delete-order"]');
    if (!btn) return;
    const card = btn.closest('.order-card');
    const id = card && card.getAttribute('data-order-id');
    if (!id) return;
    if (!confirm('Delete this order?')) return;
    try {
      await initSupabase();
      const { error } = await supabaseClient
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      card.remove();
      alert('Order deleted');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  });
});
