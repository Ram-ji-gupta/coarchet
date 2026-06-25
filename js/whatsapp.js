/**
 * croch_etgallery — WhatsApp Direct Order
 * Allows placing an order directly via WhatsApp from the cart.
 */
function sendWhatsAppOrder() {
  if (!cart || cart.length === 0) {
    showToast("Your cart is empty. Please add items before ordering.", "error");
    return;
  }

  let message = "Hello croch_etgallery! 🧶\n\nI would like to place an order for:\n\n";
  let total = 0;

  cart.forEach((item) => {
    let amount = Number(item.price) * Number(item.qty);
    total += amount;
    message += `• ${item.name || "Item"} x ${item.qty} = ₹${amount}\n`;
  });

  message += `\nTotal: ₹${total}\n\nPlease let me know the next steps!`;

  const waUrl = WC.waLink(message);
  window.open(waUrl, "_blank", "noopener,noreferrer");
}
