# CLAUDE.md — Solutions ClearShield website

Website for **Solutions ClearShield**, one of the owner's own companies: architectural window film installation in Greater Montreal and Laval (security, solar control, decorative, privacy and anti-graffiti film; commercial and residential). **No automotive window tinting.** Astro static site on a Cloudflare Worker; see `README.md`.

## Rules

- Do not invent testimonials, certifications, warranties, projects, client names or product performance figures. Claims already on the site are listed for confirmation in `README.md` (launch checklist).
- Every text change is made in French **and** English.
- Do not deploy, merge into `main`, change Cloudflare settings, connect the domain or change DNS without the owner's explicit approval. Pushing to `main` publishes the preview.
- Keep the site out of search engines until launch (`SITE_LIVE` in `src/data/site.ts`, `X-Robots-Tag` in `public/_headers`).
- `npm run build` must pass before committing.

## Design skills (DeSantisBuilds/design-skills)

This project has pinned design skills in `.claude/skills/`, installed from the private repository `DeSantisBuilds/design-skills`. The installed versions are recorded in `.claude/skills/design-skills.lock.json`. Do not edit those skill folders by hand; reinstall from design-skills instead.

Order of authority when instructions conflict:
1. The project rules in this file (no invented claims, testimonials, certifications, warranties, projects or performance figures; approval boundaries).
2. The approved brief, `PRODUCT.md` and `DESIGN.md`.
3. Impeccable (`/impeccable`): design direction, structure, typography, layout, audit, polish.
4. Emil Kowalski's skills (`/animate`, `/emil-design-eng`, `/review-animations`…): motion and interaction details.
5. Taste Skill (`/design-taste-frontend`): manual second opinion only; its findings are suggestions.

When you use a design skill, say which one in your reply, so its use can be verified.
