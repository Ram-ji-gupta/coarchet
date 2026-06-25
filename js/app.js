// Common app bootstrap.
// Some pages don't implement all functions (e.g., loadShopProducts),
// so we guard to avoid console/runtime errors.
if (typeof loadCart === 'function') loadCart();
if (typeof updateCartCount === 'function') updateCartCount();
if (typeof loadShopProducts === 'function') loadShopProducts();
