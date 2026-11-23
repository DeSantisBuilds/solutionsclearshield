# Solutions ClearShield — website

New bilingual website for solutionsclearshield.com, built with [Astro](https://astro.build) and hosted on Cloudflare Workers. It replaces the GoHighLevel page; **GoHighLevel stays the CRM**: quote requests go to the same GoHighLevel Inbound Webhook as before.

**Status: preview, not launched.** Every page tells search engines not to index it, and the domain is not connected. Nothing changes on the live site until launch is approved.

## Pages

| French | English |
|---|---|
| `/` | `/en/` |
| `/film-de-securite/` | `/en/security-window-film/` |
| `/film-anti-graffiti/` | `/en/anti-graffiti-film/` |
| `/film-solaire/` | `/en/solar-window-film/` |
| `/film-intimite-decoratif/` | `/en/decorative-privacy-film/` |
| `/commercial/` · `/residentiel/` | `/en/commercial/` · `/en/residential/` |
| `/soumission/` → `/merci/` | `/en/quote/` → `/en/thank-you/` |
| `/confidentialite/` · `/conditions/` | `/en/privacy/` · `/en/terms/` |

Old GoHighLevel links keep working: `/?lang=en` goes to `/en/`, and `/#confidentialite` and `/#conditions` go to the new policy pages.

## Where to change things

| What | File |
|---|---|
| Phone, email, regions, page addresses | `src/data/site.ts` (top) |
| Text of each film page, FAQ, process steps | `src/data/site.ts` |
| Home page layout | `src/components/HomePage.astro` |
| Quote form | `src/components/QuotePage.astro`, `src/scripts/quote.ts` |
| Privacy policy, terms | `src/legal/*.html` |
| Colours and styles | `src/styles/global.css` (colours at the top) |
| What happens to a quote request | `worker/index.js` |

All text comes from the current GoHighLevel site. Every change must be made in French **and** English.

## Quote requests

The form sends to `/api/quote` (in `worker/index.js`), which forwards to GoHighLevel. The fields `name`, `email`, `phone`, `message` and `service` match the old form, so the existing GoHighLevel workflow keeps working. `message` contains a readable summary (type, films, windows with measurements, photo links). New fields are also sent: `building_type`, `films`, `windows`, `window_count`, `photo_urls`, `city`, `address`, `contact_preference`, `marketing_consent`, `language`, `source_page`, `utm`.

Spam protection: a hidden field and a minimum fill time. Cloudflare Turnstile can be added later.

### One-time setup in Cloudflare (Worker `solutionsclearshield` → Settings → Variables and Secrets)

1. **`GHL_WEBHOOK_URL`** (type *Secret*): the GoHighLevel Inbound Webhook address (GoHighLevel → Automation → the workflow with the "Inbound Webhook" trigger). Until it is set, the form shows an error asking visitors to call.
2. **Photos** (optional but recommended):
   - Cloudflare → R2 → *Create bucket* named `solutionsclearshield-photos`.
   - In `wrangler.jsonc`, uncomment the `r2_buckets` line.
   - Add a secret **`PHOTO_LINK_SECRET`**: any long random text. It signs the photo links sent to GoHighLevel (valid 90 days).
   - Without these, the form still works; GoHighLevel is told how many photos were not stored.

## Working on the site

```bash
npm install
npm run dev        # local preview at http://localhost:4321
npm run build      # build into dist/
```

To test the quote form locally, create `.dev.vars` with `GHL_WEBHOOK_URL=...` and run `npx wrangler dev`.

## Publishing

Cloudflare builds automatically from GitHub: the deploy command `npx wrangler deploy` runs `npm run build` first (see `wrangler.jsonc`), then publishes `dist/` and `worker/`. Changes merged into `main` deploy to the Worker's `workers.dev` address.

## Launch checklist (only after approval)

1. Confirm the open content items: anti-graffiti page text and product, XPEL certification and logo use, "5 ans d'expérience", spec sheets for "jusqu'à 80 %" and "jusqu'à 99 % des UV".
2. Replace the temporary shield with the official logo, and add real project photos.
3. Have the privacy policy reviewed (it now names Cloudflare for hosting and photo storage) and update its date.
4. Add Google Analytics / Google Ads / Meta Pixel IDs with a consent banner, if used.
5. `src/data/site.ts`: set `SITE_LIVE = true`. `public/_headers`: remove the `X-Robots-Tag` line.
6. Send a test request and check it arrives in GoHighLevel.
7. Connect the domain (DNS change — approval required), submit `sitemap.xml` in Google Search Console, keep the GoHighLevel page available for rollback.
