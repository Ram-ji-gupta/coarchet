// Dashboard - uses Supabase directly
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

async function dashboard() {
  try {
    await initSupabase();

    // Get products count
    const { count: productsCount } = await supabaseClient
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Get orders
    const { data: orders, count: ordersCount } = await supabaseClient
      .from('orders')
      .select('*');

    // Get customers count
    const { count: customersCount } = await supabaseClient
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Update UI
    document.getElementById("totalProducts").textContent = productsCount || 0;
    document.getElementById("totalOrders").textContent = ordersCount || 0;
    document.getElementById("totalCustomers").textContent = customersCount || 0;

    // Calculate revenue
    let revenue = 0;
    orders?.forEach(order => { revenue += Number(order.total) || 0; });
    document.getElementById("revenue").textContent = "₹" + revenue;

    // Recent orders
    const recentDiv = document.getElementById("recentOrders");
    if (recentDiv) {
      recentDiv.innerHTML = "";
      orders?.slice(0, 5).forEach(order => {
        const status = order.status || "Pending";
        recentDiv.innerHTML += `
          <div class="card">
            <h3>${order.customer}</h3>
            <p>💰 ₹${order.total}</p>
            <p>📞 ${order.phone}</p>
            <p>📍 ${order.address}</p>
            <p>Status : <span class="status-badge ${String(status).toLowerCase()}">${status}</span></p>
          </div>
        `;
      });
    }
  } catch (error) {
    console.log(error);
  }
}

dashboard();
