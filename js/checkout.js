/**
 * WoolCraft Studio — Checkout Controller
 * Form validation, order payload creation, API posting, and WhatsApp confirmation redirect.
 */
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

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
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

  const orderPayload = {
    customer: name,
    phone,
    email,
    address,
    custom_requirement: customRequirement,
    items
  };

  showToast("Processing order...", "info");

  try {
    const res = await fetch(WC.api("/api/orders"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    });

    if (!res.ok) {
      const errorMsg = await res.text().catch(() => "");
      throw new Error(`Order posting failed (HTTP ${res.status}): ${errorMsg}`);
    }

    const result = await res.json().catch(() => ({}));

    // Clear cart storage immediately upon successful post
    localStorage.removeItem("cart");
    showToast("Order Placed Successfully!", "success");

    const orderId = result?.orderId || "";
    const status = result?.status || "Pending";
    const itemsDetailed = Array.isArray(result?.itemsDetailed) ? result.itemsDetailed : [];

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

    const waText = `Hello WoolCraft Studio! 🧶\n\nI have placed a new order!\n\nOrder ID: ${orderId || "N/A"}\nStatus: ${status}\n\nItems Ordered:\n${itemsText}${customRequirementText}\n\nThank you!`;
    
    // Redirect to WhatsApp chat after brief timeout so user sees success toast
    setTimeout(() => {
      window.open(WC.waLink(waText), "_blank", "noopener,noreferrer");
      window.location.href = "index.html";
    }, 1500);

  } catch (error) {
    console.error("[checkout] Order error:", error);
    showToast("Order failed. Please try again or contact support.", "error");
  }
}
