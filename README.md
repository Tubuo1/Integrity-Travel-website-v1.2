# Integrity Travel & Consulting - Complete Website Package (v1.2)

This package is a deploy-ready, responsive, bilingual website built around the supplied Integrity Travel & Consulting content brief, logo, and travel intake form.

## What is included

- 23 English HTML pages and 23 French HTML pages.
- Responsive mobile/desktop design using the supplied navy/red identity.
- English/French switcher.
- Express Entry flagship page and **The Integrity PR Roadmap™**.
- Permanent residence and provincial pathway pages.
- Study, work, visit/travel and global mobility pages.
- About, Why Integrity and Our Process pages.
- Preliminary-assessment form and contact form.
- Consultation pages showing the configured fee of **XAF 150,000** for **60 minutes**.
- Cancellation/rescheduling policy in English and French, flagged for professional review before commercial launch.
- Anti-fraud centre.
- Resource centre with 50+ FAQs in each language.
- Six downloadable PDF lead magnets.
- Updated editable **Travel Intake Evaluation Form (DOCX)**.
- Automatic travel-intake email workflow using a Netlify Function + Gmail SMTP.
- Privacy, Terms and Disclaimer pages, flagged for professional review before commercial launch.
- 404 and thank-you pages.
- SEO titles/meta descriptions and sitemap.
- Pre-launch safety banner so unverified testimonial previews and placeholder professional details cannot easily be mistaken for live claims.

## Business details currently configured

These values are in `assets/js/config.js`:

- Email: `killiantubuo.nkwain.kiawitech@gmail.com`
- Phone / WhatsApp: `+237 683 190 412`
- Consultation price: `XAF 150,000`
- Consultation length: `60 minutes`
- `prelaunchMode: true`

Change them later in one place: `assets/js/config.js`.

## Important: do not turn off pre-launch mode yet

This build intentionally contains:

- testimonial previews used to evaluate the website layout;
- a draft founder biography;
- an unverified representative placeholder that must be replaced with the actual authorized professional’s verified details.

These exist only so you can judge the design. They are **not real client claims or real credentials**.

Before public launch:

1. Replace testimonial previews with real, permission-based client testimonials.
2. Replace the founder draft with verified founder information.
3. Add the actual authorized professional's verified name, designation, licence number and regulator.
4. Review the regulated-service wording and service agreement.
5. Then change `prelaunchMode` from `true` to `false` in `assets/js/config.js`.

## Travel intake form email automation

### What happens

On the English and French **Visit & Travel** pages, a visitor can enter an email address and request the intake form.

The backend then:

1. validates the request;
2. emails the editable DOCX form to the visitor;
3. sends a separate lead notification to your business inbox;
4. does **not** collect the sensitive medical, criminal, financial or admissibility answers on the public website;
5. shows a direct download link as a fallback.

The backend code is:

- `netlify/functions/send-travel-intake.mjs`
- `netlify/functions/intakeAttachment.mjs` (fallback copy)

The function first fetches the currently deployed DOCX from `/downloads`. Therefore, replacing the DOCX with a newer file using the **same filename** automatically updates future email attachments after the next deploy.

The attachment sent is:

- `downloads/Integrity-Travel-Consulting-Intake-Evaluation-Form.docx`

### Email setup required after deployment

The website cannot send email until SMTP credentials are stored securely on the host. Do **not** put passwords in the website files.

For the current Gmail mailbox, you can use `GMAIL_USER` and `GMAIL_APP_PASSWORD`. For a professional mailbox such as Zoho Mail, the backend also supports generic SMTP variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `FROM_EMAIL`
- `LEAD_NOTIFICATION_EMAIL`
- `SITE_URL`

This lets you change email providers without changing the public website form.

### Test mode

For a deployment test that should not send real email, temporarily add:

- `EMAIL_DRY_RUN` = `true`

Remove it or set it to `false` for live email delivery.

## Recommended hosting: Netlify

Netlify is the recommended host because the package now uses both Netlify Forms and a Netlify Function.

### GitHub + Netlify (recommended)

1. Create a GitHub repository, for example `integrity-travel-website`.
2. Upload the **contents** of this folder to the repository root.
3. In Netlify, import that GitHub repository.
4. There is no site build command; publish directory is `.`.
5. Netlify reads `netlify.toml` and bundles the email function automatically.
6. Add the environment variables listed above.
7. Deploy.
8. Open the Visit & Travel page and request the form using a test email address.
9. Confirm the client email arrives with the DOCX attachment and the business inbox receives the lead alert.
10. Test the English and French versions.

### Manual drag-and-drop warning

A simple drag-and-drop static deployment may not install server-side dependencies for the email function in the same way as a repository-based deploy. For this version, **GitHub + Netlify is the safer deployment method**.

## Cancellation / rescheduling policy

The site currently uses this structure:

- XAF 150,000 consultation fee.
- 60-minute session.
- 24+ hours before: no-fee reschedule or refund option.
- Less than 24 hours: normally non-refundable; one reschedule may be considered for genuine emergencies.
- No-show: normally non-refundable.
- Late arrival: appointment still ends at the scheduled time.
- If Integrity cancels: no-fee reschedule or full consultation-fee refund.
- Major technical failure: replacement session when appropriate.

Review this against your payment methods, jurisdiction and professional obligations before accepting public payments.

## Canadian immigration compliance before launch

Paid Canadian immigration advice and representation must be provided by an appropriately authorized professional. The current site therefore keeps the representative information in **pre-launch placeholder mode** until real credentials are supplied.

Before selling regulated services, add the actual representative's:

1. full name;
2. professional designation;
3. licence/membership number;
4. regulatory body;
5. exact relationship to Integrity Travel & Consulting;
6. required service agreement / retainer process.

## Privacy note for the intake form

The supplied intake document asks questions that can include financial, medical, criminal-history and admissibility information. For that reason, the public website only emails the blank form; it does not collect the completed sensitive answers through the public mini-form.

Before launch, decide on a secure method for clients to return completed intake documents. Add that secure upload link to `secureUploadUrl` in `assets/js/config.js` when available.

## Custom domain

Once you buy a domain:

1. copy `sitemap-template.xml` to `sitemap.xml` and replace `your-domain.example` with the real HTTPS domain;
2. add the absolute sitemap URL to `robots.txt`;
3. add the domain to Netlify;
4. follow Netlify's DNS instructions;
5. confirm HTTPS is active;
6. update `SITE_URL` in the Netlify environment variables.

## Main files to edit

- Homepage: `index.html`
- French homepage: `fr/index.html`
- Styles: `assets/css/styles.css`
- JavaScript: `assets/js/main.js`
- Business configuration: `assets/js/config.js`
- Email backend: `netlify/functions/send-travel-intake.mjs`
- Travel intake DOCX: `downloads/Integrity-Travel-Consulting-Intake-Evaluation-Form.docx`
- Cancellation policy: `cancellation-policy.html`
- French cancellation policy: `fr/cancellation-policy.html`

## Final launch checklist

See `PRELAUNCH-CHECKLIST.md` for the detailed checklist.
