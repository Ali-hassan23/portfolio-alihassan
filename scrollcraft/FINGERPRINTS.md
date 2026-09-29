# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| ali-hassan-portfolio v2 (2026-09-29) | Build sequence (new): one point-cloud object built by the reader's scroll, every stage changes its state | Build rail: stage names down the left edge, current lit, fill line, every stage a link; phones get stage name in the top bar | Code-rendered seed-of-light with three orbits; headline between back and front canvases; generated light-painting plate as far plane; pointer tilts orbits | 7 acts: flow, pin 2.6, flow, pin 4.2 (peak), pan 3.6, flow + reveal, flow; about 15.5vh | Object resolves back into one ring and a point; the CTA is the project form itself | The reader pushes a lead through their own inbox, spreadsheet, CRM, calendar and team chat with the scroll wheel; each tool lights and stays lit | Light geometry: live canvas particles over three kie.ai long-exposure light-painting plates (atom, lattice, ring) | Next.js 16 app, localhost:3000 |
| ali-hassan-portfolio v3 (2026-09-29) | Sectioned portfolio over a living backdrop (new): readable sections on a light paper ground, one point cloud behind them whose state belongs to the section in view | Top bar: name, section list in a pill with the current section lit, one CTA | Background-removed portrait between a `</>` point-cloud plane and a foreground of tech tags; parallax on both | 7 sections: flow, flow + reveal, flow, pan 5.4, pin 3.4, flow + reveal, flow; about 15vh | Form on the page ground with an `@` point cloud beside it | The backdrop rewrites itself into the code a developer writes as you scroll: `</>`, `{ }` around the video, layers, a pulsing pipeline, a git graph of the career, `@` | Ink point cloud on warm paper, real photos and a real video loop, no generated imagery | Next.js 16 app, localhost:3000 |

Superseded and not logged as a row: v1 (chaptered editorial with photographic
backgrounds), rejected by the user before shipping.

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Grammar:** build sequence (one object whose state the scroll builds).
- **Nav:** the build rail (stage list with fill line).
- **Close:** the object returning to its opening form, with the form as the CTA.
- **Signature:** scroll-driven data pulse through labelled nodes of the reader's own tools.
- **Hero:** type between two canvases of one rotating point cloud.
- **Grammar (v3):** sectioned page over a backdrop whose state is owned by the section in view.
- **Signature (v3):** a point cloud rasterised from code glyphs (`</>`, `{ }`, `@`) and dev diagrams (pipeline, git graph).
- **Hero (v3):** cut-out subject between a point-cloud plane and a foreground tag plane.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
