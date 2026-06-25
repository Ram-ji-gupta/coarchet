// ==========================
// LOAD ORDERS
// ==========================

async function loadOrders() {

try {
const token = localStorage.getItem("adminToken");
const response =
await fetch(
"http://localhost:5000/api/orders",
{
  headers: token ? { Authorization: `Bearer ${token}` } : undefined
}
);

const orders =
await response.json();

const container =
document.getElementById(
"ordersList"
);

if (!container) return;

container.innerHTML = "";

orders.forEach(order => {

const status =
order.status || "Pending";

container.innerHTML += `

<div class="order-card" data-order-id="${order.id}">

<h3>
${order.customer}
</h3>

<p>
📞 ${order.phone}
</p>

<p>
📍 ${order.address}
</p>

<p>
💰 ₹${order.total}
</p>

<div class="status-row">

<span>
Current Status
</span>

<span class="status-badge ${status.toLowerCase()}">
${status}
</span>

</div>

  <div style="display:flex;gap:8px;margin-top:8px;">
    <button class="delete-order-btn" data-action="delete-order">🗑️ Delete</button>
  </div>

</div>

`;

});

}

catch(error){

console.log(error);

}

}


// ==========================
// UPDATE STATUS
// ==========================

const STATUSES = ["Pending","Processing","Shipped","Delivered"];

function normalizeSelectedIds() {
  const cards = document.querySelectorAll('.order-card.order-selected');
  return Array.from(cards).map(el => Number(el.dataset.orderId)).filter(Boolean);
}

function toggleCardSelected(cardEl) {
  if (!cardEl) return;
  cardEl.classList.toggle('order-selected');
}

async function updateStatusesForSelected() {
  // keep UI responsive
  // (optional) disable button could be added later
  const selectedIds = normalizeSelectedIds();
  if (selectedIds.length === 0) {
    alert("Select one or more orders first");
    return;
  }

  const statusSelect = document.getElementById('bulkStatusSelect');
  const newStatus = statusSelect?.value;
  if (!STATUSES.includes(newStatus)) {
    alert("Choose a valid status");
    return;
  }

  try {
    const token = localStorage.getItem("adminToken");
    // optimized: run PUTs in parallel
    await Promise.all(
      selectedIds.map(id =>
        fetch(`http://localhost:5000/api/orders/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ status: newStatus })
        })
      )
    );
    await loadOrders();
  } catch (error) {
    console.log(error);
    alert("Failed to update order status");
  }
}

// ==========================
// INITIALIZE
// ==========================

// click-to-select (no checkbox)
document.addEventListener('click', (e) => {
  const list = document.getElementById('ordersList');
  const card = e.target.closest('.order-card');
  if (!list || !card || !list.contains(card)) return;
  toggleCardSelected(card);
});

// Event delegation for delete order button
document.getElementById('ordersList').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action="delete-order"]');
  if (!btn) return;
  const card = btn.closest('.order-card');
  const id = card && card.getAttribute('data-order-id');
  if (!id) return;
  if (!confirm('Delete this order?')) return;
  try {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    if (!res.ok) throw new Error(await res.text());
    card.remove();
    alert('Order deleted');
  } catch (err) {
    console.error(err);
    alert('Delete failed');
  }
});

loadOrders();

