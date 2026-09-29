# BRIEF v3: Ali Hassan Portfolio (personal, light)

Status: **Interviewed, redirected twice.** v1 (dark chaptered editorial) read
"basic". v2 (dark build sequence, story about the visitor) was loved "A - Z"
but read as an agency. v3 keeps v2's scroll-driven geometry and turns the site
back toward the person. Authored decisions are marked; the user delegated the
rest ("i'll leave it upto you").

## What the user said about v2 (verbatim)

- "the website seems to belong to a softwaer agency not to a software developer the website should intorduce me, what i do, my projects, experience, how can i help others, contact form"
- "i was planning to put my pictures and a video relevant to me, i was planning the website to have sections and i do not like a dark website"
- "the pictures placed in raw assets wers upposed to be used"
- "It should follow a minimal theme of light and dark." Clarified: not a dark-mode toggle, and "make sure that it is not too dark, colors should complement each other"
- "can you make the backgrounds move with the scrolls"
- "make sure the backgrounds are moving like the geometric shapes in the previous designs, and are relevant to a software developers portfolio"
- "add azton.vercel.app in projects as well"

## The eight topics

1. **Vibe:** premium-minimal, light, warm, personal. Bold type kept from v2.
2. **Journey (user's list):** intro, about, what I do / how I can help, projects, process, experience, testimonials (real only), contact.
3. **Energy:** calm and confident throughout; the pinned process act is the one held beat.
4. **Feeling curve and peak:** below.
5. **One thing no site does (authored):** the background writes the code symbols a developer types, and the reader's scroll rewrites it from one to the next: `</>` behind him, `{ }` around his video, the layers of his services, a pipeline of his process, the git graph of his career, `@` beside the form.
6. **Range:** premium-minimal.
7. **World:** distinct sections on one paper ground; one continuous object behind them.
8. **Assets:** headshot4 (background removed via kie.ai recraft/remove-background), workingVid (8s silent loop, 1 MB), backWorking.jpeg (opens the Work rail), five project screenshots (Azton captured live). No generated imagery: three generated sunlight plates were rejected as not developer-relevant and deleted.

## Feeling curve

```
1  Hero        Recognition  a real face, "Hi, I'm Ali.", </> behind his head, tags floating in front
2  About       Warmth       the clip of him at work opens inside a window, braces { } around it
3  Services    Clarity      four rows; the matching layer of the stack lights as each is read
4  Work        Confidence   five real products travel sideways past a turning sphere
5  Process     Trust        pinned: a pulse carries the work block to block as the steps light
6  Experience  Credibility  the timeline beside its own git graph, HEAD at Cloudpacer
7  Contact     Invitation   the form, and an @ that settles beside it
```

## The peak

> "The background turned into code as I scrolled: brackets around his video, a
> pipeline for how he works, a git graph of his jobs."

Lives across the whole page, loudest in Process (the pinned act, span 3.4).

## Tell-someone sentence

> "It's the portfolio where the background keeps turning into code as you
> scroll: brackets, a pipeline, a git graph of his career."

## Grammar: Sectioned portfolio over a living backdrop (new)

Organising logic: plain, readable sections (the user asked for sections), and
one point cloud fixed behind them whose state belongs to the section in view.
Nav: a top bar with the section list in a pill, current section lit, one CTA.
Hero: cut-out portrait between the backdrop plane and a foreground plane of tags.
Close: the form on the page ground with `@` beside it.
Bans: dark grounds, photography behind copy, section counters, invented stats,
fake testimonials (the section renders only when real quotes exist).

## Layer contract (hero)

| Plane | Asset | Movement |
|---|---|---|
| Back | `</>` point cloud (canvas) | sways with scroll, morphs to `{ }` as About arrives, leans to pointer |
| Subject | portrait cutout | parallax -1.1 |
| Copy | semantic HTML | 1x |
| Front | three tech tags | parallax 2.2 |

## Score

| Beat | Device | Why |
|---|---|---|
| Hero | backdrop + `in` + `parallax` | depth from subject between planes |
| About | `reveal` (video window) + `in` | the window wipes open |
| Services | `flow` + `in` + backdrop layer highlight | calm, readable |
| Work | `pan` 5.4 | lateral travel reads as range |
| Process | `pin` 3.4 + bespoke pipeline pulse | the one held beat |
| Experience | `reveal` (timeline) + `in` | the history draws down |
| Contact | `flow` + `in` | a form that holds |

## Feel check (lab/v3-*)

| Section | Intended | Felt | Change made |
|---|---|---|---|
| Hero | Recognition | Recognition | headline shrunk so the CTA clears the fold; front dot plane over the face replaced by tags |
| About | Warmth | Warmth | braces pulled left off the copy |
| Services | Clarity | Clarity | layer labels hidden on phones |
| Work | Confidence | Confidence | none |
| Process | Trust | Trust | phones: pipeline moved above the heading; short phones fade it |
| Experience | Credibility | Credibility | git labels hidden on phones |
| Contact | Invitation | Invitation | none |
