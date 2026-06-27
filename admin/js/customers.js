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
  supabaseClient = createClient(
    'https://owzsyodcmdwnfpoqkxyx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93enN5b2RjbWR3bmZwb3FreHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODUwODYsImV4cCI6MjA5ODA2MTA4Nn0.KXRtVkQYETGIJ7SwQWdAR9rR46oDmSLFL-gmm1M5UhA'
  );
  return supabaseClient;
}

async function loadCustomers() {
  try {
    await initSupabase();

    const { data: customers, error } = await supabaseClient
      .from('customers')
      .select('*');

    if (error) throw error;

    const container = document.getElementById("customerList");
    if (!container) return;

    container.innerHTML = "";

    customers?.forEach(customer => {
      container.innerHTML += `
        <div class="customer-card" data-id="${customer.id}">
          <h3>${customer.name}</h3>
          <p class="phone">📞 ${customer.phone}</p>
          <p class="email">✉️ ${customer.email || ''}</p>
          <p class="address">📍 ${customer.address}</p>
          <div style="display:flex;gap:8px;margin-top:12px;">
            <button class="action-globe globe-delete" title="Delete" data-action="delete">🗑️</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

loadCustomers();

// Event delegation for delete
document.getElementById('customerList')?.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const card = btn.closest('.customer-card');
  const id = card && card.getAttribute('data-id');
  if (!id) return;

  if (btn.dataset.action === 'delete') {
    if (!confirm('Delete this customer?')) return;
    try {
      await initSupabase();
      const { error } = await supabaseClient
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      card.remove();
      alert('Customer deleted');
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  }
});
