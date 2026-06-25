const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'doconplus@gmail.com',
    pass: 'lkmxrjoxzbgjzytn',
  },
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  const params = new URLSearchParams(event.body);
  const name    = params.get('formName') || '';
  const phone   = params.get('formPhone') || '';
  const email   = params.get('formEmail') || '';
  const city    = params.get('formCity') || '';
  const service = params.get('formService') || '';
  const msg     = params.get('formMessage') || '';

  if (!name || !phone || !email) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Name, phone, and email are required' }) };
  }

  const fields = [
    ['Full Name', name],
    ['Phone', phone],
    ['Email', email],
    ['City', city],
    ['Service', service],
    ['Message', msg],
  ];
  const rows = fields
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:10px 12px;font-size:13px;color:#888;width:100px;vertical-align:top;border-bottom:1px solid #eee">${k}</td><td style="padding:10px 12px;font-size:14px;color:#222;border-bottom:1px solid #eee">${v}</td></tr>`)
    .join('');

  const html = `
<html><body style="font-family:Segoe UI,Arial,sans-serif;background:#f4f6f9;padding:40px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
<div style="background:linear-gradient(135deg,#0069FF,#00C8FF);padding:24px 32px"><h1 style="color:#fff;font-size:20px;margin:0">New Consultation Request</h1></div>
<div style="padding:32px"><table style="width:100%;border-collapse:collapse">${rows}</table></div>
<div style="background:#f8f9fb;padding:16px 32px;text-align:center;font-size:12px;color:#aaa">Sent via Docon+ contact form</div>
</div></body></html>`;

  try {
    await transporter.sendMail({
      from: 'doconplus@gmail.com',
      to: 'doconplus@gmail.com',
      replyTo: email || undefined,
      subject: `New Consultation Request - ${name}`,
      html,
    });
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
