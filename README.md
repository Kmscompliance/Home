# KMS Compliance Ltd — Website

This repo holds the kmscompliance.com website — a plain HTML/CSS/JS site
with no database and no login system, replacing the old GoDaddy Website
Builder site.

**This is live.** `kmscompliance.com` and `www.kmscompliance.com` are
pointed at this site via DNS (hosted on Netlify, project name
`tiny-rugelach-2326ec`). DNS stays managed in GoDaddy — only the web
records (A + CNAME) were changed; the domain registration and email
(`admin@kmscompliance.com`) are untouched and still live at GoDaddy.

## What's in here

```
index.html      Home
about.html      About / team (currently just Matt, Co-Founder)
services.html   FCA Launch Pad, FCA Guard, Health Check and Rescue
products.html   FCA Authorisation Document Toolkit ("coming soon")
contact.html    Contact form + details
css/style.css   All styling, including brand colours as CSS variables
js/main.js      Mobile menu toggle + footer year
images/         Logo, favicons, Matt's photo, service illustrations
```

There is no Resources page — it was removed; Products covers that need
for now.

## How to look at it yourself (no coding needed)

Double-click `index.html` to browse it locally, or just visit
`https://kmscompliance.com` directly — that's the real, live site.

## Still open

1. **Brand colours** — `css/style.css` uses navy `#11304F` / green
   `#068A53` as a best guess. The actual logo image (used directly for
   the mark itself) reads a little closer to an older palette
   (`#2C3E6B` / `#2EAE6E`). Worth confirming the exact values against
   the Canva brand kit (`kAGyr1qCMpE`) and updating the CSS variables
   once confirmed.
2. **Marc's photo** — his About page card was removed for now at your
   request. Send his individual headshot whenever ready and he can go
   back in.
3. **Copy review** — the wording throughout (About, Services, Products)
   was drafted from what you'd told me about the business. Send edits
   any time and I'll update it directly.
4. **Header logo fidelity** — the nav/footer currently show the
   butterfly icon plus real HTML text ("KMS COMPLIANCE") rather than
   the exact original wordmark artwork. Fine for now; can swap in the
   precise original lockup image later if wanted.

## A note on the contact form

It's built using Netlify Forms — lets a plain static site (no server, no
database) receive form submissions, collected automatically in the
Netlify dashboard under "Forms". Submissions also need a notification
email set up there if you want an alert per submission (optional, ask
if you want this set up).

## GoDaddy cleanup (not done yet)

Now that the site is live elsewhere, the old GoDaddy Website Builder
product is no longer doing anything — visitors go to Netlify instead.
Once you're confident everything's stable, that product (not the domain
registration, not email) is the one that can be cancelled to save money.
Domain registration and email both stay exactly as they are — nothing
about cancelling anything happens without you explicitly doing it in
GoDaddy yourself.
