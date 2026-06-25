const nodemailer = require("nodemailer");

function getEnv(name, fallback = "") {
  return process.env[name] ?? fallback;
}

function buildTransport() {
  const smtpHost = getEnv("GMAIL_SMTP_HOST", "smtp.gmail.com");
  const smtpPort = Number(getEnv("GMAIL_SMTP_PORT", 587));
  const smtpUser = getEnv("GMAIL_SMTP_USER", getEnv("CONTACT_FROM_EMAIL"));
  const smtpPass = getEnv("GMAIL_SMTP_PASS", "");

  if (!smtpPass) {
    throw new Error("Gmail SMTP password not configured (GMAIL_SMTP_PASS)");
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass }
  });
}

async function sendMail({ to, subject, html, text }) {
  const toEmail = to || getEnv("ORDERS_TO_EMAIL") || getEnv("CONTACT_TO_EMAIL");
  const fromEmail = getEnv("CONTACT_FROM_EMAIL") || getEnv("GMAIL_SMTP_USER");

  if (!toEmail || !fromEmail) {
    throw new Error("Notification email destination/source not configured (CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL)");
  }

  const transporter = buildTransport();

  return transporter.sendMail({
    from: fromEmail,
    to: toEmail,
    subject,
    html,
    text
  });
}

module.exports = {
  sendMail
};

