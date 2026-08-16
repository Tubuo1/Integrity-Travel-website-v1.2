# Integrity Travel & Consulting - Pre-launch Checklist

Do not disable `prelaunchMode` until every item below is complete.

## Brand and identity

- [ ] Replace draft founder copy with verified founder name, biography and approved photo.
- [ ] Replace testimonial previews with real client quotes and written permission to publish.
- [ ] Confirm public business name, legal entity name and any registration details you intend to display.

## Canadian immigration professional information

- [ ] Replace the unverified representative placeholder with the real authorized professional.
- [ ] Add the real authorized representative's full name.
- [ ] Add the correct professional designation.
- [ ] Add the real licence/membership number.
- [ ] Confirm current good standing with the regulator.
- [ ] Link to the regulator's public verification page/register where appropriate.
- [ ] Confirm the exact relationship between the representative and Integrity Travel & Consulting.
- [ ] Finalize required service/retainer agreements before accepting regulated work.

## Contact and bookings

- [ ] Replace temporary email if needed.
- [ ] Replace temporary WhatsApp/phone if needed.
- [ ] Confirm XAF 150,000 consultation fee or update it.
- [ ] Confirm 60-minute consultation length or update it.
- [ ] Add booking URL if using a scheduler.
- [ ] Add office address only if it is an actual public business location.

## Travel intake email workflow

- [ ] Gmail 2-step verification configured if required by the account.
- [ ] Gmail App Password created if available.
- [ ] Netlify `GMAIL_USER` environment variable added.
- [ ] Netlify `GMAIL_APP_PASSWORD` environment variable added.
- [ ] Netlify `LEAD_NOTIFICATION_EMAIL` added.
- [ ] Netlify `SITE_URL` added.
- [ ] Test email arrives with DOCX attachment.
- [ ] Internal lead notification arrives.
- [ ] French email tested.
- [ ] Spam-folder placement checked.
- [ ] Secure return/upload process chosen for completed intake forms.

## Policies and legal review

- [ ] Cancellation/rescheduling policy approved.
- [ ] Privacy Policy reviewed for actual tools and data flows.
- [ ] Terms of Use reviewed.
- [ ] Website Disclaimer reviewed.
- [ ] Consultation terms reviewed.
- [ ] Refund method and payment-processing rules finalized.
- [ ] Privacy retention/deletion practices finalized.

## Website QA

- [ ] English pages checked on desktop and mobile.
- [ ] French pages checked on desktop and mobile.
- [ ] Contact form tested.
- [ ] Preliminary assessment tested.
- [ ] FAQ search tested.
- [ ] All PDF and DOCX downloads tested.
- [ ] WhatsApp floating button tested.
- [ ] Every internal link tested.
- [ ] No placeholder text remains.
- [ ] Create `sitemap.xml` from `sitemap-template.xml`, replace `your-domain.example`, and update `robots.txt`.
- [ ] Real domain connected and HTTPS active.

## Final step

- [ ] Set `prelaunchMode: false` in `assets/js/config.js`.
