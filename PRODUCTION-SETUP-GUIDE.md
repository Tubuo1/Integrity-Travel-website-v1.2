# Integrity Travel & Consulting - Production Setup Guide

Checked: August 2026. Prices and provider plans can change, so re-check the provider's checkout page before paying.

## Recommended low-cost setup

- **Source code:** GitHub - keep the repository you already know how to use.
- **Production hosting:** Netlify Free initially - it supports the Netlify Function already built into the site, custom domains, SSL and automatic deployment from GitHub.
- **Domain registrar:** Namecheap - simple domain management and free domain privacy on eligible domains.
- **Professional email:** Zoho Mail Free if it is available in your region - up to 5 users for one custom domain. If the free plan is unavailable, use a low-cost paid mail plan or the Namecheap shared-hosting alternative described below.

This separation is usually cheaper than buying a full hosting package when the website itself can run on Netlify Free.

## Suggested professional email addresses

Start with three:

- `info@yourdomain.com`
- `consultations@yourdomain.com`
- `travel@yourdomain.com`

You may later add `support@`, `admin@`, `accounts@` or staff mailboxes.

## Domain purchase

Search for your preferred `.com` name at Namecheap. Prefer a short, easy-to-spell `.com` if available. Avoid buying unnecessary add-ons during checkout. Netlify provides HTTPS/SSL for the website, so you do not need to buy a separate website SSL certificate for the Netlify deployment.

## Netlify deployment from GitHub

1. Create/sign in to Netlify.
2. Choose **Add new project** > **Import an existing project**.
3. Choose GitHub.
4. Authorize Netlify to access the website repository.
5. Select the Integrity Travel repository.
6. The package already contains `netlify.toml` with `publish = "."`; no build command is required for the static pages.
7. Publish the project.
8. Netlify gives the site a temporary `.netlify.app` address.
9. Test the full site at that address before connecting the custom domain.

## Connect the custom domain

In Netlify, open the project and go to **Domain management**, then add the domain you already own.

If you keep DNS at Namecheap, follow the DNS values shown by Netlify. On Netlify's standard network, the current fallback configuration is normally:

- Apex/root (`@`): A record -> `75.2.60.5`
- `www`: CNAME -> your Netlify project hostname such as `your-site.netlify.app`

Use the values shown in your own Netlify dashboard if they differ.

Do not delete email MX/TXT records when editing website DNS records.

## Professional email with Zoho Mail

1. Create a Zoho Mail business/custom-domain account.
2. Select the Free plan if it is offered in your region and meets your needs.
3. Add your new domain.
4. Zoho gives you a DNS verification record. Add it in Namecheap Advanced DNS (or whichever DNS provider you use).
5. After verification, create your three users/mailboxes.
6. Add the exact MX records shown by Zoho.
7. Add SPF and DKIM records shown by Zoho to improve deliverability.
8. Send a message from each address to Gmail and reply back to confirm both directions work.

The free Zoho plan has feature limits and is available only in select data centers. If it is not offered to you, use the alternative below.

## Alternative: one-provider hosting + email

Namecheap Stellar Shared Hosting includes domain-based cPanel email at no extra cost and supports many mailboxes. It is a reasonable option if you prefer website hosting and email under one provider. However, your current site is already optimized for GitHub + Netlify Functions, so moving the backend to cPanel is more technical than staying with Netlify.

## Configure automatic travel-form email on Netlify

Never put passwords in GitHub.

In Netlify open your project, then **Project configuration** > **Environment variables**.

For a professional SMTP mailbox, add:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `FROM_EMAIL`
- `LEAD_NOTIFICATION_EMAIL`
- `SITE_URL`

For Zoho, use the SMTP server settings shown inside your Zoho account. Zoho's general documentation currently lists `smtp.zoho.com` with port 465 (SSL) or 587 (TLS) for free organization users, but your account's own server-configuration page is authoritative.

Typical Netlify values if using port 465:

- `SMTP_HOST` = `smtp.zoho.com`
- `SMTP_PORT` = `465`
- `SMTP_SECURE` = `true`
- `SMTP_USER` = `travel@yourdomain.com` (or the mailbox you select)
- `SMTP_PASSWORD` = the mailbox password/app password
- `FROM_EMAIL` = the same authorized sending address
- `LEAD_NOTIFICATION_EMAIL` = `info@yourdomain.com`
- `SITE_URL` = `https://yourdomain.com`

After saving environment variables, trigger a new Netlify deploy and test the intake-form email with your own personal email address.

## Final domain SEO step

Once the real domain is connected:

1. Copy `sitemap-template.xml` to a new file called `sitemap.xml`.
2. Replace every `https://your-domain.example` with the final HTTPS domain.
3. Open `robots.txt` and add `Sitemap: https://yourdomain.com/sitemap.xml`.
4. Commit the changes in GitHub.
5. Netlify redeploys automatically.

## How future edits go live

For ordinary changes, edit the file in GitHub and commit to `main`. A GitHub-connected Netlify site automatically deploys the new version. This means you do not need to manually upload the entire site every time.

See `EDITING-GUIDE.md` for the exact files to edit.
