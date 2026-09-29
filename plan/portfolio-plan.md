# Ali Hassan Portfolio — Premium Scroll-Driven Build

## Context

The repo is a brand-new, untouched `create-next-app` scaffold (Next.js 16.3.6, App Router, TypeScript, Tailwind v4, React 19) with no custom pages, components, or assets yet. The goal is to replace the default boilerplate with a single premium, scroll-driven personal portfolio homepage built using the `nateherk-design:scroll-craft` skill, for a freelance developer who builds websites, software, automations, and AI systems. The site's job is to convert visitors into leads: prove real skill and real delivery history, then get them into a contact form.

Through an interview, the following creative decisions are locked in:

- **Vibe:** Bold & confident
- **Style range:** Premium-minimal (restrained layout, but decisive/high-contrast typography and color — not maximalist)
- **Structure:** Distinct scenes/chapters, not one continuous "worldflight" world
- **Primary CTA (used everywhere — nav, hero, footer):** "Start a Project" → opens an on-page contact form
- **Visuals:** Mix of real project screenshots (case studies) + AI-generated hero/atmosphere imagery
- **Proof:** Real stats and/or testimonials will be supplied — no invented numbers (skill hard-bans this)
- **Case studies:** 3–4 flagship projects, deep treatment (problem → approach → stack → outcome)

Everything else (exact journey beats, feeling curve, grammar, signature move, device-per-beat score) is authored by me under the interview answers above, following the skill's Step 0/1/2 process, and written into `BRIEF.md` before any asset generation — this is a legitimate "explicit creative delegation" path the skill supports, since the user asked to be told what's needed rather than interviewed exhaustively.

## Technical integration strategy (Next.js 16 App Router + scroll-craft)

The scroll-craft skill's native workflow produces a standalone static HTML/CSS/JS build in its own workspace (`<repo>/scrollcraft/builds/<name>/`), with its own dev server (`serve.mjs`) and screenshot verification (`shoot.mjs`). That workflow will be followed faithfully for brief-writing, grammar/device scoring, asset generation, and first-pass markup — but the **final deliverable must live inside the existing Next.js app**, since that's what will actually be deployed.

Plan:
1. Run the skill's Bootstrap (`doctor.mjs`, `workspace.mjs --ensure`) and Steps 0–4 to produce the design in its native workspace folder, exactly as the skill specifies (brief, journey, grammar, fingerprint gate, generated/encoded assets, `template.html`-based markup, `scrollcraft.js`/`scrollcraft.css` engine).
2. Port the finished result into the Next.js app:
   - `engine/scrollcraft.js` + `scrollcraft.css` copied in unedited (per skill rule: never edit the engine), loaded from a small client component that mounts the engine against the page's `data-sc-*` markup.
   - Page markup translated into `app/page.tsx` (split into a handful of section components, e.g. `components/sections/Hero.tsx`, `Services.tsx`, `Proof.tsx`, `Projects.tsx`, `Process.tsx`, `Contact.tsx`) as real semantic HTML/TSX — not a config-driven renderer.
   - Design tokens (the six colors + two fonts) merged into `app/globals.css` alongside the existing Tailwind v4 `@theme` block; Tailwind utilities stay available but the scroll-craft CSS is the authoritative visual system for this page.
   - Generated/real media placed in `/public` (video assets encoded per `encode.sh`'s dense-GOP scrub requirement).
   - The contact form becomes a real Next.js Server Action (see below), not a static form.
3. Before writing any App Router code, skim the Next 16-specific docs the explore pass flagged as likely unfamiliar (per this repo's `AGENTS.md` instruction): `node_modules/next/dist/docs/01-app/02-guides/rendering-philosophy.md`, `caching-without-cache-components.md`, `upgrading/version-16.md`, and `server-actions.md`/`forms.md` — Next 16's caching/rendering model and Server Action conventions may differ from training data.
4. Final verification (Step 5) re-runs `shoot.mjs` against the **real `next dev` server** (localhost:3000), not just the skill's standalone `serve.mjs` preview, so what's screenshotted is what actually ships.

**Contact form backend:** Next.js Server Action → [Resend](https://resend.com) API to email form submissions. Requires a `RESEND_API_KEY` env var (see "Accounts/keys you need to set up" below).

## Information I need from you (content, not files)

**About you / positioning**
- Full name as it should appear, plus a one-line title/tagline (e.g. "Full-stack developer & AI systems builder")
- Short bio (2–4 sentences): background, years active, what you specialize in, what makes your work distinct
- Location/availability framing (e.g. "Based in ___, working with clients worldwide" or similar)
- Contact/social links: email, LinkedIn, GitHub, X/Twitter, Upwork/Fiverr profile if relevant

**Services** (the "range" beat)
- Your 3–5 core service offerings (you mentioned websites, software, automations, AI systems) — one clear sentence per service on what you actually deliver
- Whether you want pricing signals ("starting at $X" / "custom quote") or no pricing at all

**Case studies (3–4 flagship projects)** — for each one:
- Project name + one-line description
- The problem/brief you were solving
- Your approach/what you built
- Tech stack used
- The outcome — ideally a concrete result (e.g. "cut manual ops time by 80%", "launched in 3 weeks", "processed 10k+ orders")
- Live link and/or repo link if public (or say if it's private/NDA)

**Proof**
- Real stats you're comfortable displaying (years experience, projects delivered, client count, ratings, response time, etc.) — only include numbers you can stand behind
- Real testimonials/quotes if you have them: quote text, person's name, their role/company

**Experience**
- A short work history / timeline (freelance start date, notable clients or platforms, any past roles relevant to credibility)
- Any certifications, awards, or notable mentions worth surfacing

**Tech stack**
- The list of tools/technologies/frameworks you want shown (for a skills strip/grid) — e.g. React, Next.js, Python, n8n, OpenAI API, LangChain, etc.

**Contact form**
- Which email address should receive form submissions (default assumption: your own email on file, confirm or override)
- Any specific fields you want on the intake form beyond name/email/project type/budget/message

## Assets I need from you (separate, as requested)

- **Headshot(s):** at least one real, high-quality photo of you (portrait works best; a candid "working" shot is a nice second option). Real photography is strongly preferred over a generated likeness.
- **Project screenshots:** clean, high-resolution screenshots of each flagship project (browser-chrome-free crops where possible) — ideally 2–4 per project
- **Project clips (optional but valuable):** short screen-recordings/GIFs of a project in action, if you have any — these read as far more credible than static shots
- **Client/company logos:** only if you have permission to display them, for a social-proof strip
- **Resume/CV (optional):** a PDF if you want a "download resume" link
- **Existing brand assets (optional):** logo/wordmark, specific brand colors or fonts if you have preferences beyond what's already decided (bold & confident, premium-minimal)
- **Testimonial headshots (optional):** small photos of the people quoted, if available

**What I'll handle without you:** favicon, all layout/typography/motion, and any hero/atmosphere/background imagery that isn't a literal project or personal photo — these will be AI-generated via kie.ai per your "mix" answer, styled to one consistent look (single style preamble reused across every generated asset, per the skill's method).

## Accounts/keys you'll need to set up (outside this chat — I won't create accounts on your behalf)

- **`RESEND_API_KEY`** — free tier is enough for a contact form. Sign up at resend.com, verify a sending domain (or use their test domain while developing), generate an API key, and give it to me to add as a local env var.
- **`KIE_AI_API_KEY`** — only needed for the generated hero/atmosphere imagery. A handful of stills plus one or two short clips is a small spend (cents to a few dollars total). If you'd rather skip this, tell me and I'll design the hero/atmosphere sections using only your real photos/screenshots instead.

## Build plan (maps to the skill's own steps)

1. **Bootstrap:** run `doctor.mjs` (env check) and `workspace.mjs --ensure` (resolves/creates the scrollcraft workspace, seeds the empty fingerprint registry since this is the first build in this repo).
2. **Brief (Step 0/1):** write `BRIEF.md` — the locked interview answers, the authored journey (proposed beats: Hero/Recognition → Services/Range → Proof/Credibility → Flagship Case Studies → Process/Experience → Contact/Commitment), the feeling curve, the named peak (very likely the flagship project's outcome reveal), and the "It's the site where ___" sentence — using your supplied content once received.
3. **Grammar, gate, score (Step 2):** pick a grammar from the skill's 8 defined options that fits "distinct scenes/chapters" (not worldflight/filmic one-shot by default), run it against `FINGERPRINTS.md` (trivially passes — registry starts empty), invent one bespoke signature move (candidate idea to refine: a scroll-driven "build log" readout in the Projects section that live-types real project metrics/commit-style notes tied to scroll position — coded bespoke, not a kit device), and write the device-per-beat score table.
4. **Assets (Step 3):** generate hero/atmosphere stills and clips (one reused style preamble, reviewed before use, encoded per `encode.sh` for scrubbing) once real photos/screenshots are in hand; layer the hero into independent planes (background/subject/foreground/atmosphere) per the skill's hero-depth requirement.
5. **Build the page (Step 4):** real semantic markup in `app/page.tsx` + section components, engine wired via `data-sc-*` attributes, tokens set in `globals.css`, contact form as a Server Action + Resend.
6. **Verify (Step 5):** screenshot pass at desktop + mobile (390×844) + reduced-motion against the real `next dev` server, contact-sheet review, feel-check against the brief's intended curve, focus-order tab-through, and a real-phone note for the hero clip specifically (headless Chrome can't validate iOS video/autoplay behavior).

## Verification

- `npm run dev` and manually scroll the full page at desktop and mobile widths (browser pane), confirming every act reads correctly and the CTA form actually submits (test send via Resend's test mode).
- Run the skill's `shoot.mjs` against `http://localhost:3000` for desktop, mobile, and reduced-motion contact sheets; inspect `sheet.png` for dead scroll, cue opacity, and contrast per the skill's own acceptance bar.
- `npm run lint` and `npm run build` to confirm the Next.js 16 App Router build is clean (particularly around the Server Action and any cache-components-related behavior flagged in the docs).
