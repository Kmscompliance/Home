# KMS Compliance Ltd — Website Rebuild

This repo holds the new kmscompliance.com website — a plain HTML/CSS/JS site
with no database and no login system, built to eventually replace the
current GoDaddy Website Builder site.

**Nothing here is live yet.** The real domain still points at GoDaddy. This
is Phase 2 (Build) of the project — see the phase plan below.

## What's in here

```
index.html       Home
about.html        About / team
services.html     FCA Launch Pad, FCA Guard, Health Check and Rescue
resources.html     Guides/articles (placeholder content for now)
products.html      FCA Authorisation Document Toolkit ("coming soon")
contact.html       Contact form + details
css/style.css       All styling, including brand colours as CSS variables
js/main.js         Mobile menu toggle + footer year
images/            Empty for now — logo and team photos go here
```

Anything marked **[DRAFT — REVIEW NEEDED]** on a page is placeholder copy
I wrote from what you've told me about the business — not final text.
Anything marked **[PHOTO PLACEHOLDER]** or **[Service illustration/photo
placeholder]** is a spot waiting for a real image.

## How to look at it yourself (no coding needed)

Easiest way: in your file browser, find `index.html` inside this project
and double-click it. It'll open in your normal web browser and you can
click around exactly like a real site. Every page links to every other
page through the same navigation menu, so you can browse it end to end.

Try resizing your browser window (or opening it on your phone if you sync
files there) to see how it adapts — that's the "fully responsive" part
Matt asked for.

## What's still missing before this can go live

1. **Logo** — currently a plain coloured square standing in for the real
   KMS butterfly mark. Export the logo (ideally as an SVG, or a large
   PNG with a transparent background) from the Canva brand kit
   (`kAGyr1qCMpE`) and I'll drop it in.
2. **Brand colours** — I used navy `#11304F` and green `#068A53` based on
   what you described. Once you export the brand kit, I'll check these
   against the actual values (and flag if the kit has both an old and
   new palette, as you mentioned might be the case).
3. **Matt and Marc's photos** — placeholders are on the About page.
4. **Real copy** — go through each `[DRAFT]` section and tell me what to
   change; I'll update it directly.
5. **Resources content** — currently 3 empty placeholder cards.

## What happens next (the phases, as a reminder)

1. ~~Discovery~~ → **2. Build (we're here)** → 3. Preview & review → 4.
   Domain cutover → 5. GoDaddy cleanup.

**Phase 3 (next):** once the above gaps are filled in, I'll deploy this
repo to Netlify (a free static-site host). That gives you a real, working
web address like `kms-compliance.netlify.app` that only you and I know
about — the actual kmscompliance.com domain still points at GoDaddy the
whole time, so nothing public changes. You review the live preview fully
before we go anywhere near DNS.

**A note on the contact form:** it's built using a feature called Netlify
Forms, which lets a plain static site (no server, no database) still
receive form submissions — Netlify collects them for you automatically
once the site is deployed there. It won't submit anywhere while you're
just opening the file locally; the `mailto:admin@kmscompliance.com` link
next to it works immediately as a fallback.

**Phase 4 (domain cutover) will need real care around DNS** — the settings
that control both where your website lives and where your email
(`admin@kmscompliance.com`) gets delivered. I will not change or suggest
changing any DNS record, especially an MX record (the setting that
controls email delivery), without first showing you exactly what it
currently says, what it would change to, and why — and getting your
explicit go-ahead on that specific change.
