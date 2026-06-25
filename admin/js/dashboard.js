// ==========================
// DASHBOARD
// ==========================

async function dashboard(){
  try{
    const token = localStorage.getItem("adminToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const [prodRes, orderRes, custRes] = await Promise.all([
      fetch("http://localhost:5000/api/products", { headers }),
      fetch("http://localhost:5000/api/orders", { headers }),
      fetch("http://localhost:5000/api/customers", { headers })
    ]);

    const [products, orders, customers] = await Promise.all([
      prodRes.json(),
      orderRes.json(),
      custRes.json()
    ]);

    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalOrders").textContent = orders.length;
    document.getElementById("totalCustomers").textContent = customers.length;

    let revenue = 0;
    orders.forEach(order => { revenue += Number(order.total) || 0; });
    document.getElementById("revenue").textContent = "₹" + revenue;

    // Recent orders
    const recentDiv = document.getElementById("recentOrders");
    if(recentDiv){
      recentDiv.innerHTML = "";
      orders.slice(0,5).forEach(order => {
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
  }catch(error){
    console.log(error);
  }
}

dashboard();
