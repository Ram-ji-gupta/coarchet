/**
 * WoolCraft Studio — Centralized Configuration
 * All hardcoded values (API URLs, WhatsApp number, etc.) live here.
 */
const WC = (() => {
  const isLocal =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";

  return Object.freeze({
    API_BASE: isLocal ? "http://localhost:5000" : "",
    WA_NUMBER: "917973856211",
    WA_DISPLAY: "+91 79738 56211",
    BRAND: "WoolCraft Studio",
    YEAR: new Date().getFullYear(),
    CURRENCY: "₹",
    /** Build a full API URL */
    api(path) {
      return this.API_BASE ? `${this.API_BASE}${path}` : path;
    },
    /** Normalize an image filename to a full URL */
    img(filename) {
      if (!filename) return "";
      if (String(filename).startsWith("http")) return filename;
      return `${this.API_BASE}/uploads/${filename}`;
    },
    /** Build a WhatsApp link with message */
    waLink(message) {
      return `https://wa.me/${this.WA_NUMBER}?text=${encodeURIComponent(message || "")}`;
    }
  });
})();
