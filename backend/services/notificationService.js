const nodemailer = require("nodemailer");
const twilio     = require("twilio");

// ── Email transporter ─────────────────────────────────────────────────────────

function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST   || "smtp.gmail.com",
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",   // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ── SMS (Twilio) ──────────────────────────────────────────────────────────────

function createTwilioClient() {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return twilio(sid, token);
}

// ── Send email notification ───────────────────────────────────────────────────

async function sendEmailNotification({ to, userName, medicineName, time, dosage, category }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("[Email] Credentials not configured — skipping email.");
    return { success: false, reason: "not_configured" };
  }

  const transporter = createTransporter();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { margin:0; padding:0; background:#0d1117; font-family:Inter,sans-serif; color:#f1f5f9; }
    .wrap { max-width:520px; margin:40px auto; background:#161b22; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.07); }
    .header { background:linear-gradient(135deg,#14b8a6,#6366f1); padding:32px 28px; text-align:center; }
    .header h1 { margin:0; font-size:1.6rem; font-weight:900; color:white; letter-spacing:-0.02em; }
    .header p  { margin:6px 0 0; color:rgba(255,255,255,0.8); font-size:0.9rem; }
    .body { padding:28px; }
    .greeting { font-size:1rem; margin-bottom:20px; color:#94a3b8; }
    .med-card { background:rgba(20,184,166,0.1); border:1px solid rgba(20,184,166,0.25); border-radius:12px; padding:20px 22px; margin:16px 0; }
    .med-name { font-size:1.4rem; font-weight:800; color:#5eead4; margin:0 0 12px; }
    .detail   { display:flex; align-items:center; gap:8px; font-size:0.88rem; color:#94a3b8; margin:6px 0; }
    .badge    { display:inline-block; background:rgba(99,102,241,0.2); color:#a5b4fc; padding:3px 12px; border-radius:999px; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }
    .cta      { text-align:center; margin:24px 0 8px; }
    .btn      { display:inline-block; background:linear-gradient(135deg,#14b8a6,#6366f1); color:white; padding:13px 32px; border-radius:12px; text-decoration:none; font-weight:700; font-size:0.95rem; }
    .footer   { padding:16px 28px 24px; text-align:center; font-size:0.75rem; color:#475569; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>💊 Medicine Reminder</h1>
      <p>Time to take your medication</p>
    </div>
    <div class="body">
      <p class="greeting">Hi <strong>${userName}</strong>,</p>
      <p style="color:#94a3b8;font-size:0.9rem;margin:0 0 4px;">It's time to take your medicine:</p>
      <div class="med-card">
        <p class="med-name">${medicineName}</p>
        <div class="detail">⏰ <span>Scheduled at <strong style="color:#f1f5f9">${time}</strong></span></div>
        ${dosage   ? `<div class="detail">💉 <span>Dosage: <strong style="color:#f1f5f9">${dosage}</strong></span></div>` : ""}
        ${category ? `<div class="detail">💊 <span>Type: <strong style="color:#f1f5f9">${category}</strong></span></div>` : ""}
      </div>
      <p style="color:#64748b;font-size:0.82rem;margin:16px 0 0;">
        ⚠️ Please follow your doctor's instructions. Do not skip or double doses.
      </p>
    </div>
    <div class="footer">
      This reminder was sent by <strong>MediTrack</strong>. Stay healthy! 💚
    </div>
  </div>
</body>
</html>`;

  try {
    const info = await transporter.sendMail({
      from:    `"MediTrack 💊" <${process.env.EMAIL_USER}>`,
      to,
      subject: `⏰ Medicine Reminder: Take ${medicineName} now`,
      html,
      text: `Hi ${userName}, it's time to take ${medicineName} (${dosage || ""}). Scheduled at ${time}.`,
    });
    console.log(`[Email] Sent to ${to} — MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email] Failed to send to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

// ── Send SMS notification ─────────────────────────────────────────────────────

async function sendSmsNotification({ to, userName, medicineName, time, dosage }) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_FROM) {
    console.warn("[SMS] Twilio credentials not configured — skipping SMS.");
    return { success: false, reason: "not_configured" };
  }

  const client = createTwilioClient();
  if (!client) return { success: false, reason: "client_init_failed" };

  // Normalize phone: must start with + and country code e.g. +1234567890
  const phone = to.startsWith("+") ? to : `+${to}`;

  const body =
    `💊 MediTrack Reminder\n` +
    `Hi ${userName}! Time to take: ${medicineName}` +
    (dosage ? ` (${dosage})` : "") +
    `\nScheduled: ${time}\n` +
    `Stay healthy! 💚`;

  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_FROM,
      to:   phone,
    });
    console.log(`[SMS] Sent to ${phone} — SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (err) {
    console.error(`[SMS] Failed to send to ${phone}:`, err.message);
    return { success: false, error: err.message };
  }
}

// ── Send both ─────────────────────────────────────────────────────────────────

async function sendMedicineReminder({ user, medicine }) {
  const payload = {
    userName:     user.name,
    medicineName: medicine.name,
    time:         medicine.time,
    dosage:       medicine.dosage   || "",
    category:     medicine.category || "",
  };

  const results = await Promise.allSettled([
    sendEmailNotification({ to: user.email, ...payload }),
    user.phone ? sendSmsNotification({ to: user.phone, ...payload }) : Promise.resolve({ success: false, reason: "no_phone" }),
  ]);

  return {
    email: results[0].status === "fulfilled" ? results[0].value : { success: false },
    sms:   results[1].status === "fulfilled" ? results[1].value : { success: false },
  };
}

module.exports = { sendEmailNotification, sendSmsNotification, sendMedicineReminder };
