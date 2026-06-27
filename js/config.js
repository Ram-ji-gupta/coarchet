/**
 * croch_etgallery — Centralized Configuration
 * All hardcoded values (API URLs, WhatsApp number, etc.) live here.
 */
const WC = (() => {
  const isLocal =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";

  return Object.freeze({
    API_BASE: isLocal ? "http://localhost:5000" : "",
    WA_NUMBER: "917973856211",
    WA_DISPLAY: "+91 79738 56211",
    BRAND: "croch_etgallery",
    YEAR: new Date().getFullYear(),
    CURRENCY: "₹",
    /** Build a full API URL */
    api(path) {
      return this.API_BASE ? `${this.API_BASE}${path}` : path;
    },
    /** Normalize an image filename to a full URL */
    img(filename) {
      if (!filename) return "images/product-placeholder.svg";
      const value = String(filename);
      if (value.startsWith("http") || value.startsWith("data:")) return value;
      if (value.startsWith("images/") || value.startsWith("/images/")) return value;
      return `${this.API_BASE}/uploads/${value}`;
    },
    /** Build a WhatsApp link with message */
    waLink(message) {
      return `https://wa.me/${this.WA_NUMBER}?text=${encodeURIComponent(message || "")}`;
    }
  });
})();
