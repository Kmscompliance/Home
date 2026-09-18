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
images/            Logo, favicons, and Matt/Marc's photos
```

Anything marked **[DRAFT — REVIEW NEEDED]** on a page is placeholder copy
I wrote from what you've told me about the business — not final text.
Anything marked **[Service illustration/photo placeholder]** is still a
spot waiting for a real image.

### About the logo and team photos

You pointed me at the "kmscompliance images" Google Drive folder, where I
found `KMS Compliance Ltd Logo.jpeg` and `Matt_Marc.jpg`. Both are now in
`images/`, along with what I made from them:

- `kms-icon.png` — just the butterfly mark, background removed, used in
  the nav bar and footer on every page. The "KMS COMPLIANCE" text next to
  it is real text (not part of the image), so it automatically shows navy
  on light backgrounds and white on the dark footer.
- `favicon-32.png` / `favicon-192.png` / `favicon-512.png` — the browser
  tab icon, cropped from the same mark.
- `kms-logo-full.png` — the full icon + wordmark lockup, background
  removed, kept in case we need it somewhere else later (e.g. a shareable
  preview image).
- `kms-logo-original.jpeg` — the untouched file exactly as it came from
  Drive, kept for reference.
- `matt-headshot.jpg` / `marc-headshot.jpg` — individual headshots
  cropped out of `Matt_Marc.jpg`, now on the About page. **I assumed left
  = Matt, right = Marc based on the filename order — please double-check
  that's correct, since I can't verify identities myself.**
- `matt-marc.jpg` — the original combined photo, kept for reference.

One thing to flag, as you asked: the logo's actual navy and green (as
pulled from the image itself) read a little closer to what you described
as the *older* palette (`#2C3E6B` / `#2EAE6E`) than the newer one
(`#11304F` / `#068A53`) I'd guessed at first — though it's hard to be
precise picking colours off a JPEG (compression softens them slightly).
The site currently uses the logo image itself wherever the mark appears,
so this only affects accent colours elsewhere on the site (buttons,
links, headings). Worth confirming the exact values against the Canva
brand kit rather than trusting my estimate — happy to update the CSS
variables in `css/style.css` the moment you confirm.

## How to look at it yourself (no coding needed)

Easiest way: in your file browser, find `index.html` inside this project
and double-click it. It'll open in your normal web browser and you can
click around exactly like a real site. Every page links to every other
page through the same navigation menu, so you can browse it end to end.

Try resizing your browser window (or opening it on your phone if you sync
files there) to see how it adapts — that's the "fully responsive" part
Matt asked for.

## What's still missing before this can go live

1. **Brand colours** — confirm the exact navy/green hex values from the
   Canva brand kit (`kAGyr1qCMpE`) so I can update `css/style.css` — see
   the flag above about old vs. new palette.
2. **Confirm Matt/Marc photo assignment** — see above, I guessed based on
   filename order and need that checked.
3. **Real copy** — go through each `[DRAFT]` section and tell me what to
   change; I'll update it directly.
4. **Resources content** — currently 3 empty placeholder cards.
5. **Service page images** — the three grey "[Service illustration/photo
   placeholder]" boxes on the Services page could use real photos or
   graphics if you have any, or I can leave them as simple graphics.

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
