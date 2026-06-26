/**
 * croch_etgallery — Contact Page Controller
 * Validates fields and redirects to WhatsApp for contact.
 */
async function sendContactMessage(e) {
  e.preventDefault();

  const nameEl = document.getElementById('contactName');
  const emailEl = document.getElementById('contactEmail');
  const phoneEl = document.getElementById('contactPhone');
  const messageEl = document.getElementById('contactMessage');
  const form = document.querySelector('.contact-form');

  const name = nameEl?.value?.trim() || "";
  const email = emailEl?.value?.trim() || "";
  const phone = phoneEl?.value?.trim() || "";
  const message = messageEl?.value?.trim() || "";

  if (!name || !email || !message) {
    showToast("Please fill in Name, Email, and Message", "error");
    return;
  }

  // Build WhatsApp message
  const waText = `Hello croch_etgallery! 🧶\n\nNew Contact Inquiry:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`;

  showToast('Redirecting to WhatsApp...', 'success');
  if (form) form.reset();

  setTimeout(() => {
    window.open(WC.waLink(waText), "_blank", "noopener,noreferrer");
  }, 800);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', sendContactMessage);
  }
});

