const nodemailer = require("nodemailer");

// If you want to disable contact emails temporarily (useful when Gmail is not configured),
// set CONTACT_EMAIL_ENABLED=false in backend/.env
const contactEmailEnabled = process.env.CONTACT_EMAIL_ENABLED !== "false";



// POST /api/contact
// body: { name, email, phone, message }
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: "name, email and message are required" });
    }

    if (!contactEmailEnabled) {
      // Temporarily disabled (for example: Gmail not configured yet)
      return res.json({ message: "Contact received (email sending disabled)" });
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "";
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "";

    if (!toEmail || !fromEmail) {
      return res.status(500).json({ message: "Contact email not configured on server" });
    }


    const smtpHost = process.env.GMAIL_SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.GMAIL_SMTP_PORT || 587);
    const smtpUser = process.env.GMAIL_SMTP_USER || fromEmail;
    const smtpPass = process.env.GMAIL_SMTP_PASS || "";

    if (!smtpPass) {
      return res.status(500).json({ message: "Gmail SMTP password not configured" });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const subject = `New Contact Inquiry from ${name}`;
    const html = `
      <p>You have received a new contact inquiry:</p>
      <ul>
        <li><b>Name:</b> ${name}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>Phone:</b> ${phone || ""}</li>
      </ul>
      <p><b>Message:</b></p>
      <p style="white-space:pre-wrap">${message}</p>
    `;

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      html
    });

    return res.json({ message: "Contact email sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send contact email" });
  }
};

