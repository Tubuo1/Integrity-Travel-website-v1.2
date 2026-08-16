import nodemailer from 'nodemailer';
import { intakeAttachmentBase64, intakeFilename } from './intakeAttachment.mjs';

const TEMP_EMAIL = 'killiantubuo.nkwain.kiawitech@gmail.com';
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  },
  body: JSON.stringify(payload)
});

const escapeHtml = value => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');


const getIntakeAttachment = async siteUrl => {
  // Prefer the currently deployed DOCX. This means the business can replace the file
  // in /downloads without regenerating backend code. Keep the embedded copy as a fallback.
  if (siteUrl) {
    try {
      const response = await fetch(`${siteUrl}/downloads/${encodeURIComponent(intakeFilename)}`);
      if (response.ok) return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      console.warn('Could not fetch deployed intake form; using embedded fallback.', error?.message || error);
    }
  }
  return Buffer.from(intakeAttachmentBase64, 'base64');
};

const buildTransport = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || TEMP_EMAIL;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD;

  if (!smtpPass) return null;

  if (smtpHost) {
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = String(process.env.SMTP_SECURE || String(port === 465)).toLowerCase() === 'true';
    return {
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port,
        secure,
        auth: { user: smtpUser, pass: smtpPass }
      }),
      user: smtpUser
    };
  }

  return {
    transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass }
    }),
    user: smtpUser
  };
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' });
  if ((event.body || '').length > 10000) return json(413, { error: 'Request too large.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'Invalid request.' }); }

  // Honeypot: bots often fill this hidden field. Return a quiet success.
  if (String(body.company || '').trim()) return json(200, { ok: true });

  const email = String(body.email || '').trim().toLowerCase();
  const firstNameRaw = String(body.firstName || '').trim().slice(0, 80);
  const firstName = escapeHtml(firstNameRaw);
  const language = String(body.language || 'English').toLowerCase().startsWith('fr') ? 'fr' : 'en';

  if (!validEmail.test(email) || email.length > 254) {
    return json(400, { error: 'Please enter a valid email address.' });
  }

  const siteUrl = String(process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || '').replace(/\/$/, '');
  const dryRun = String(process.env.EMAIL_DRY_RUN || '').toLowerCase() === 'true';
  if (dryRun) return json(200, { ok: true, dryRun: true });

  const mailer = buildTransport();
  if (!mailer) {
    console.error('Missing SMTP_PASSWORD/GMAIL_APP_PASSWORD environment variable.');
    return json(503, { error: 'Email delivery is not configured yet. Please use the download link instead.' });
  }

  const fromAddress = process.env.FROM_EMAIL || mailer.user;
  const replyAddress = process.env.LEAD_NOTIFICATION_EMAIL || fromAddress || TEMP_EMAIL;
  const salutationEn = firstName ? `Hello ${firstName},` : 'Hello,';
  const salutationFr = firstName ? `Bonjour ${firstName},` : 'Bonjour,';
  const onlineLink = siteUrl ? `${siteUrl}/${language === 'fr' ? 'fr/' : ''}visit-travel.html` : '';

  const enHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.65;color:#172033;max-width:680px;margin:auto">
      <h2 style="color:#082c5b">Your Integrity Travel Intake Evaluation Form</h2>
      <p>${salutationEn}</p>
      <p>Thank you for contacting <strong>Integrity Travel &amp; Consulting</strong>. Your intake evaluation form is attached as an editable Word document.</p>
      <p>Please complete the sections that apply to you as clearly and truthfully as possible. The form is for preliminary intake and does not by itself determine eligibility or guarantee a visa, permit, admission, job offer, invitation or immigration outcome.</p>
      <p><strong>Privacy note:</strong> the form may contain sensitive personal information. Do not upload a completed copy through the public contact form. Our team will provide the appropriate return instructions when we follow up.</p>
      ${onlineLink ? `<p>You can return to our travel page here: <a href="${onlineLink}">${onlineLink}</a></p>` : ''}
      <p>Questions? Reply to this email or message us on WhatsApp at <strong>+237 683 190 412</strong>.</p>
      <p style="color:#5b6577">Integrity Travel &amp; Consulting<br><em>Where Dreams Take Flight</em></p>
    </div>`;

  const frHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.65;color:#172033;max-width:680px;margin:auto">
      <h2 style="color:#082c5b">Votre formulaire d'évaluation initiale Integrity Travel</h2>
      <p>${salutationFr}</p>
      <p>Merci d'avoir contacté <strong>Integrity Travel &amp; Consulting</strong>. Votre formulaire d'évaluation initiale est joint à ce message au format Word modifiable.</p>
      <p>Remplissez clairement et honnêtement les sections qui vous concernent. Ce formulaire sert à l'admission préliminaire du dossier. À lui seul, il ne détermine pas votre admissibilité et ne garantit aucun visa, permis, admission, emploi, invitation ou résultat d'immigration.</p>
      <p><strong>Confidentialité :</strong> le formulaire peut contenir des renseignements personnels sensibles. Ne téléversez pas le formulaire rempli dans le formulaire de contact public. Notre équipe vous indiquera la méthode de retour appropriée lors du suivi.</p>
      ${onlineLink ? `<p>Vous pouvez revenir à notre page Voyage ici : <a href="${onlineLink}">${onlineLink}</a></p>` : ''}
      <p>Une question ? Répondez à cet e-mail ou écrivez-nous sur WhatsApp au <strong>+237 683 190 412</strong>.</p>
      <p style="color:#5b6577">Integrity Travel &amp; Consulting<br><em>Where Dreams Take Flight</em></p>
    </div>`;

  const clientSubject = language === 'fr'
    ? "Votre formulaire d'évaluation initiale — Integrity Travel & Consulting"
    : 'Your Travel Intake Evaluation Form — Integrity Travel & Consulting';

  try {
    const attachmentBuffer = await getIntakeAttachment(siteUrl);

    // Send the requested form first. Internal lead alerts should never make a successful
    // client delivery look like a failure if the alert itself encounters a transient issue.
    await mailer.transporter.sendMail({
      from: `Integrity Travel & Consulting <${fromAddress}>`,
      to: email,
      replyTo: replyAddress,
      subject: clientSubject,
      html: language === 'fr' ? frHtml : enHtml,
      attachments: [{
        filename: intakeFilename,
        content: attachmentBuffer,
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }]
    });

    mailer.transporter.sendMail({
      from: `Integrity Website <${fromAddress}>`,
      to: replyAddress,
      subject: `New travel intake form request — ${email}`,
      text: `A visitor requested the travel intake form.\n\nEmail: ${email}\nFirst name: ${firstNameRaw || 'Not provided'}\nPreferred language: ${language === 'fr' ? 'French' : 'English'}\nTime: ${new Date().toISOString()}\n\nNo sensitive intake answers were collected on the public website.`
    }).catch(err => console.error('Internal lead alert failed:', err?.message || err));

    return json(200, { ok: true });
  } catch (error) {
    console.error('Travel intake email failed:', error?.message || error);
    return json(502, { error: 'We could not send the email right now. Please use the download link or contact us directly.' });
  }
}
