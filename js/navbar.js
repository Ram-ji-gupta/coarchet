/**
 * WoolCraft Studio — Navigation Bar Controller
 * Handles mobile hamburger menu toggle and updates accessibility state.
 */
function toggleMobileMenu() {
  const navbar = document.getElementById("navbar");
  const button = document.querySelector(".mobile-menu");
  if (!navbar) return;

  const isActive = navbar.classList.toggle("active");
  if (button) {
    button.setAttribute("aria-expanded", String(isActive));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop() || "index.html";

  // Highlight active link in navigation
  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Auto-close menu when clicking links on mobile
  document.querySelectorAll("#navbar a").forEach(link => {
    link.addEventListener("click", () => {
      const navbar = document.getElementById("navbar");
      const button = document.querySelector(".mobile-menu");
      if (navbar) {
        navbar.classList.remove("active");
      }
      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });
  });
});