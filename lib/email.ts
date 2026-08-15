import { Resend } from "resend";
import { getBusiness } from "@/lib/settings";

/**
 * Le client Resend est créé à la demande, jamais au chargement du module :
 * son constructeur lève une exception quand la clé est absente, ce qui ferait
 * échouer le build (et le démarrage) sur un environnement sans RESEND_API_KEY.
 * Sans clé configurée, l'envoi est simplement ignoré — le site reste fonctionnel
 * et les réservations comme les messages restent enregistrés en base.
 */
let _resend: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

function noKey(kind: string) {
  console.warn(`[email] RESEND_API_KEY absente — envoi « ${kind} » ignoré.`);
  return null;
}

const SALON_NAME = "Solange's Hair Braiding LLC";
const FROM_EMAIL = process.env.EMAIL_FROM || "Solange's Hair Braiding <onboarding@resend.dev>";

/**
 * Email, téléphone et adresse viennent des coordonnées modifiables depuis
 * l'admin : changer l'email du salon redirige aussi les alertes de réservation
 * et de contact, sans toucher au code.
 */
async function salonContact() {
  const b = await getBusiness();
  return { email: b.email, phone: b.phone1, address: b.address };
}

/** Neutralise le HTML dans les valeurs saisies par le visiteur avant insertion dans le template. */
function esc(v: string | undefined | null) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDate(d: string) {
  if (!d) return d;
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(day)}, ${y}`;
}

// ─────────────────────────────────────────────────────────────
// EMAIL 1 — Confirmation to the CLIENT
// ─────────────────────────────────────────────────────────────
export async function sendBookingConfirmationToClient(data: {
  clientName:   string;
  clientEmail:  string;
  service:      string;
  date:         string;
  time:         string;
  stylist?:     string;
  notes?:       string;
}) {
  const { clientName, clientEmail, service, date, time, stylist, notes } = data;
  const prettyDate = fmtDate(date);
  const salon = await salonContact();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Appointment Confirmation — ${SALON_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#8B1A1A 0%,#B22222 100%);padding:40px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.7);">✦ Appointment Confirmation ✦</p>
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${SALON_NAME}</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">Braids · Beauty · Confidence</p>
            </td>
          </tr>

          <!-- CHECKMARK ICON -->
          <tr>
            <td align="center" style="padding:32px 32px 0;">
              <div style="display:inline-block;background:#F0FDF4;border-radius:50%;width:64px;height:64px;line-height:64px;text-align:center;font-size:32px;">✅</div>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="padding:20px 40px 0;text-align:center;">
              <h2 style="margin:0 0 8px;font-size:22px;color:#1a1a1a;">You're all set, ${clientName}!</h2>
              <p style="margin:0;font-size:15px;color:#555;line-height:1.6;">
                Your appointment request has been received. We'll call you shortly to confirm and collect your <strong>$30 deposit</strong>.
              </p>
            </td>
          </tr>

          <!-- BOOKING DETAILS CARD -->
          <tr>
            <td style="padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF8F3;border-radius:12px;border:1px solid #E8DDD3;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #E8DDD3;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B1A1A;">Service</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a1a;">${service}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:20px 24px;border-bottom:1px solid #E8DDD3;border-right:1px solid #E8DDD3;width:50%;">
                          <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B1A1A;">Date</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">📅 ${prettyDate}</p>
                        </td>
                        <td style="padding:20px 24px;border-bottom:1px solid #E8DDD3;">
                          <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B1A1A;">Time</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">🕐 ${time}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${stylist ? `
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #E8DDD3;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B1A1A;">Preferred Stylist</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a1a;">💇‍♀️ ${stylist}</p>
                  </td>
                </tr>` : ""}
                ${notes ? `
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B1A1A;">Your Notes</p>
                    <p style="margin:0;font-size:14px;color:#555;">${notes}</p>
                  </td>
                </tr>` : ""}
              </table>
            </td>
          </tr>

          <!-- REMINDER BOX -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFBEB;border:1px solid #F59E0B;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#92400E;">📌 Good to know</p>
                    <p style="margin:0 0 6px;font-size:13px;color:#78350F;">• A <strong>$30 deposit</strong> is required to confirm your appointment</p>
                    <p style="margin:0 0 6px;font-size:13px;color:#78350F;">• Please arrive <strong>10–15 minutes early</strong> with clean, detangled hair</p>
                    <p style="margin:0;font-size:13px;color:#78350F;">• Cancellations require <strong>24 hours notice</strong> minimum</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- WHATSAPP BUTTON -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="https://wa.me/4433201312" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;letter-spacing:0.5px;">
                💬 Confirm via WhatsApp
              </a>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #E8E8E8;margin:0;" />
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1a1a1a;">${SALON_NAME}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#888;">📍 ${salon.address}</p>
              <p style="margin:0 0 12px;font-size:12px;color:#888;">📞 ${salon.phone}</p>
              <p style="margin:0;font-size:11px;color:#aaa;">If you did not make this booking, please ignore this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const client = getResend();
  if (!client) return noKey("confirmation cliente");

  return client.emails.send({
    from:    FROM_EMAIL,
    to:      clientEmail,
    subject: `✅ Appointment Confirmed — ${service} on ${prettyDate}`,
    html,
  });
}

// ─────────────────────────────────────────────────────────────
// EMAIL 2 — Alert to the SALON
// ─────────────────────────────────────────────────────────────
export async function sendBookingAlertToSalon(data: {
  clientName:   string;
  clientEmail:  string;
  clientPhone:  string;
  service:      string;
  date:         string;
  time:         string;
  stylist?:     string;
  notes?:       string;
}) {
  const { clientName, clientEmail, clientPhone, service, date, time, stylist, notes } = data;
  const prettyDate = fmtDate(date);
  const salon = await salonContact();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

          <!-- HEADER -->
          <tr>
            <td style="background:#8B1A1A;padding:24px 32px;">
              <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">New Booking Alert</p>
              <h2 style="margin:6px 0 0;font-size:20px;color:#fff;font-weight:700;">🆕 New Appointment Request</h2>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:28px 32px;">

              <!-- CLIENT INFO -->
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B1A1A;">Client Information</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F9F9;border-radius:8px;border:1px solid #E5E5E5;margin-bottom:20px;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #E5E5E5;font-size:13px;">
                    <strong>Name:</strong> ${clientName}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #E5E5E5;font-size:13px;">
                    <strong>Phone:</strong> <a href="tel:${clientPhone}" style="color:#8B1A1A;">${clientPhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;font-size:13px;">
                    <strong>Email:</strong> <a href="mailto:${clientEmail}" style="color:#8B1A1A;">${clientEmail}</a>
                  </td>
                </tr>
              </table>

              <!-- APPOINTMENT INFO -->
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B1A1A;">Appointment Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F9F9;border-radius:8px;border:1px solid #E5E5E5;margin-bottom:20px;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #E5E5E5;font-size:13px;">
                    <strong>Service:</strong> ${service}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #E5E5E5;font-size:13px;">
                    <strong>Date:</strong> ${prettyDate}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;${stylist || notes ? "border-bottom:1px solid #E5E5E5;" : ""}font-size:13px;">
                    <strong>Time:</strong> ${time}
                  </td>
                </tr>
                ${stylist ? `
                <tr>
                  <td style="padding:12px 16px;${notes ? "border-bottom:1px solid #E5E5E5;" : ""}font-size:13px;">
                    <strong>Preferred Stylist:</strong> ${stylist}
                  </td>
                </tr>` : ""}
                ${notes ? `
                <tr>
                  <td style="padding:12px 16px;font-size:13px;">
                    <strong>Notes:</strong> ${notes}
                  </td>
                </tr>` : ""}
              </table>

              <!-- ACTION BUTTONS -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:8px;" width="50%">
                    <a href="tel:${clientPhone}" style="display:block;background:#8B1A1A;color:#fff;text-decoration:none;text-align:center;font-size:13px;font-weight:700;padding:12px;border-radius:8px;">
                      📞 Call Client
                    </a>
                  </td>
                  <td style="padding-left:8px;" width="50%">
                    <a href="https://wa.me/${clientPhone.replace(/\D/g,"")}" style="display:block;background:#25D366;color:#fff;text-decoration:none;text-align:center;font-size:13px;font-weight:700;padding:12px;border-radius:8px;">
                      💬 WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:16px 32px;background:#F5F5F5;text-align:center;">
              <p style="margin:0;font-size:11px;color:#999;">This is an automated notification from your booking system.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const client = getResend();
  if (!client) return noKey("alerte réservation");

  return client.emails.send({
    from:    FROM_EMAIL,
    to:      salon.email,
    subject: `🆕 New Booking: ${clientName} — ${service} on ${prettyDate} at ${time}`,
    html,
  });
}

// ─────────────────────────────────────────────────────────────
// EMAIL 3 — Contact form alert to the SALON
// ─────────────────────────────────────────────────────────────
export async function sendContactAlertToSalon(data: {
  name:     string;
  email:    string;
  phone?:   string;
  service?: string;
  message:  string;
}) {
  const name    = esc(data.name);
  const email   = esc(data.email);
  const phone   = esc(data.phone);
  const service = esc(data.service);
  const message = esc(data.message).replace(/\n/g, "<br/>");
  const salon   = await salonContact();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

          <!-- HEADER -->
          <tr>
            <td style="background:#8B1A1A;padding:24px 32px;">
              <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">Contact Form</p>
              <h2 style="margin:6px 0 0;font-size:20px;color:#fff;font-weight:700;">✉️ New Message</h2>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:28px 32px;">

              <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B1A1A;">Sender</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F9F9;border-radius:8px;border:1px solid #E5E5E5;margin-bottom:20px;">
                <tr>
                  <td style="padding:12px 16px;border-bottom:1px solid #E5E5E5;font-size:13px;">
                    <strong>Name:</strong> ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;${phone || service ? "border-bottom:1px solid #E5E5E5;" : ""}font-size:13px;">
                    <strong>Email:</strong> <a href="mailto:${email}" style="color:#8B1A1A;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding:12px 16px;${service ? "border-bottom:1px solid #E5E5E5;" : ""}font-size:13px;">
                    <strong>Phone:</strong> <a href="tel:${phone}" style="color:#8B1A1A;">${phone}</a>
                  </td>
                </tr>` : ""}
                ${service ? `
                <tr>
                  <td style="padding:12px 16px;font-size:13px;">
                    <strong>Service:</strong> ${service}
                  </td>
                </tr>` : ""}
              </table>

              <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B1A1A;">Message</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F9F9;border-radius:8px;border:1px solid #E5E5E5;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px;font-size:13px;line-height:1.7;color:#333;">${message}</td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:8px;" width="50%">
                    <a href="mailto:${email}" style="display:block;background:#8B1A1A;color:#fff;text-decoration:none;text-align:center;font-size:13px;font-weight:700;padding:12px;border-radius:8px;">
                      ✉️ Reply by Email
                    </a>
                  </td>
                  ${phone ? `
                  <td style="padding-left:8px;" width="50%">
                    <a href="tel:${phone}" style="display:block;background:#25D366;color:#fff;text-decoration:none;text-align:center;font-size:13px;font-weight:700;padding:12px;border-radius:8px;">
                      📞 Call Back
                    </a>
                  </td>` : ""}
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:16px 32px;background:#F5F5F5;text-align:center;">
              <p style="margin:0;font-size:11px;color:#999;">Also saved in your admin panel under “Messages”.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const client = getResend();
  if (!client) return noKey("alerte message de contact");

  return client.emails.send({
    from:     FROM_EMAIL,
    to:       salon.email,
    replyTo:  data.email,
    subject:  `✉️ New Message from ${data.name}${data.service ? ` — ${data.service}` : ""}`,
    html,
  });
}
