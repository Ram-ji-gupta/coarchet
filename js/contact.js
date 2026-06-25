/**
 * croch_etgallery — Contact Page Controller
 * Validates fields, sends contact messages to the backend API, and displays modern toast alerts.
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

  showToast("Sending message...", "info");

  try {
    const res = await fetch(WC.api('/api/contact'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, message })
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`Contact message failed to send: ${res.status} ${msg}`);
    }

    showToast('Your message has been sent successfully!', 'success');
    if (form) form.reset();
  } catch (err) {
    console.error("[contact] Error sending message:", err);
    showToast('Failed to send message. Please try again.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', sendContactMessage);
  }
});

