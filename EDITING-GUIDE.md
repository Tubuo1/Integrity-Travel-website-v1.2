# Integrity Travel & Consulting - Beginner Editing Guide

This site is intentionally organized so most routine updates can be made directly in GitHub without installing software.

## The easiest way to publish a change

1. Sign in to GitHub.
2. Open the repository that contains the website.
3. Open the file you want to change.
4. Click the pencil icon (**Edit this file**).
5. Make the change carefully.
6. Scroll to **Commit changes**.
7. Enter a short message such as `Update consultation fee`.
8. Commit directly to the `main` branch.
9. If the repository is connected to Netlify, Netlify automatically redeploys the website after the commit.
10. Wait a minute or two, open the live website, and hard-refresh the page if necessary.

## Business details - change these in one place

Open:

`assets/js/config.js`

You can change:

- `email`
- `phone`
- `whatsapp`
- `bookingUrl`
- `consultationPrice`
- `consultationPriceFr`
- `consultationLength`
- `consultationLengthFr`
- `officeAddress`
- `secureUploadUrl`
- founder verification settings
- authorized-representative details

Keep quotation marks around text values and do not delete commas between settings.

## Homepage text

English homepage:

`index.html`

French homepage:

`fr/index.html`

Use your browser's Find command (`Ctrl+F`) to locate the sentence you want to change, edit it, then commit the change.

## Testimonials

English testimonials are near `id="testimonial-preview"` in:

`index.html`

French testimonials are in:

`fr/index.html`

Before commercial launch, replace testimonial preview text and names with genuine client feedback that you have permission to publish. Then set:

`testimonialsVerified: true`

in `assets/js/config.js`.

## Founder and regulated representative

English About page:

`about.html`

French About page:

`fr/about.html`

When real information is ready:

1. Replace the founder profile copy and name.
2. Replace the authorized-representative placeholder with the professional's verified details.
3. Confirm the representative in the regulator's public register.
4. Update the matching settings in `assets/js/config.js`.
5. Set `founderVerified: true` and `authorizedRepresentative.verified: true` only after verification.
6. When testimonials, founder details and professional credentials are all verified, set `prelaunchMode: false`.

## Consultation fee or policy

Fee and length:

`assets/js/config.js`

English cancellation policy:

`cancellation-policy.html`

French cancellation policy:

`fr/cancellation-policy.html`

## Contact page

English:

`contact.html`

French:

`fr/contact.html`

The email and WhatsApp values themselves come from `assets/js/config.js`.

## Travel intake form

File:

`downloads/Integrity-Travel-Consulting-Intake-Evaluation-Form.docx`

If you replace this document later, keep **exactly the same filename**. The production email function first fetches the currently deployed file, so the latest version will be attached automatically after the next deployment.

## PDF resources

Files are in:

`downloads/`

If you replace a PDF but want all existing links to continue working, keep its filename unchanged.

## Logo or images

Files are in:

`assets/img/`

The easiest replacement method is to upload the new image with the same filename. If the filename changes, every HTML reference to the old filename must also be updated.

## Styling

Main design file:

`assets/css/styles.css`

Do not change this file casually. A small CSS change can affect every page. Make a backup or use GitHub history so you can restore a previous version.

## English and French

A content change on an English page does not automatically translate the French page. Update the matching page in `/fr/` too.

## Before every public update

- Open the changed page on desktop and phone.
- Test the English and French versions.
- Test buttons and links near the changed content.
- Confirm that the logo and layout still load.
- If you changed a form or downloadable document, test it yourself.
- Never place passwords, SMTP credentials, API keys or private client information in GitHub files.
