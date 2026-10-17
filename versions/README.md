# Resume Versions

Archived, self-contained snapshots of the resume. Each folder holds its own
`index.html`, a PDF, and `assets/` so it renders independently. There are two axes:
**design** editions (same iOS Tech Lead content, different look) and **role** editions
(same Editorial design, content retargeted to a specific job title).

## Founder & CTO, Buraq (every edition)

Since 17 Oct 2026 every edition names the ride-hailing platform: **Buraq** (buraqegypt.com, Buraq
Technologies), founded by Ahmad in March 2026 and built solo across nine repositories. Each edition
carries the same Buraq facts in its experience entry, project card, honours and portfolio index
(re-measured from the source repos on 17 Oct 2026: 22 backend modules, 330+ endpoints, 2,900+
backend tests, 10,000+ tests platform-wide, 3,100+ commits; web app live since 15 Oct 2026), and
adds "Founder & CTO, Buraq" to its masthead. Only the backend README's deployment status is
reflected: the platform is described as launch-ready with the web app live, not "in production".

## Design editions

| Version | Folder | Design | Palette / Type | Vibe |
|--------|--------|--------|----------------|------|
| 2026-06 · **Editorial** | [`2026-06-editorial/`](./2026-06-editorial/) | Editorial broadsheet | Warm paper + oxblood · Fraunces / Hanken / JetBrains Mono | Magazine-grade, refined. **Current live design.** |
| 2026-06 · **Terminal** | [`2026-06-terminal/`](./2026-06-terminal/) | Dark engineering console | Near-black IDE + green/amber/cyan · JetBrains Mono | Unmistakably "engineer," striking on screen. |
| 2026-06 · **Swiss** | [`2026-06-swiss/`](./2026-06-swiss/) | Swiss / brutalist grid | Stark white + electric blue · Anton / Archivo | Bold, art-directed studio portfolio. |

The three design editions keep the full iOS Tech Lead content (8 roles, 6 projects, full
portfolio index, skills, education, honours) and the portrait.

## Target editions (2026-07, Editorial design)

Two editions, one per job family — each covers every title in its family (swap the top role
line per application). Each exports a Riyadh + Cairo PDF.

| Family | Covers | Folder | PDF |
|--------|--------|--------|-----|
| **iOS** | iOS Tech Lead · iOS Team Lead · Senior iOS Engineer | [`2026-07-ios/`](./2026-07-ios/) | `Ahmad_iOS_Resume.pdf` |
| **Mobile** | Mobile Architect · Mobile Team Lead (iOS + Android) | [`2026-07-mobile/`](./2026-07-mobile/) | `Ahmad_Mobile_Resume.pdf` |

The iOS edition leads with iOS craft/leadership; the Mobile edition leads with cross-platform
(iOS + Android) breadth. Both keep the solo ride-hailing platform's four-platform "delivery
timeline" as proof of architectural range.

Every editorial edition has a **terminal-design twin** at `<edition>-terminal/` carrying the same
content in the dark IDE look. The editorial edition's **"See the live interactive edition"**
button links to its twin.

## Leadership editions (2026-08, Editorial design)

Three **independent** files — one per title, so you send the one the posting asks for and never
edit a resume in the moment. All three share the same career facts and the same design; they
differ in the opening paragraph, the stat band, and a dedicated leadership section (§ 01) that
frames the same seven years at Marn for a different reader.

| Title | Folder | § 01 section | PDF |
|-------|--------|--------------|-----|
| **CTO** · Head of Engineering | [`2026-08-cto/`](./2026-08-cto/) | *The Technology Office* — strategy, organisation, delivery, whole-stack ownership | `Ahmad_CTO_Resume.pdf` |
| **Engineering Lead** · Engineering Manager | [`2026-08-engineering-lead/`](./2026-08-engineering-lead/) | *How I Run a Team* — people, predictability, quality, technical credibility | `Ahmad_Engineering_Lead_Resume.pdf` |
| **Technical Lead** · Staff Engineer · Architect | [`2026-08-technical-lead/`](./2026-08-technical-lead/) | *How I Lead Technically* — architecture, standards in code, mentoring, whole-stack depth | `Ahmad_Technical_Lead_Resume.pdf` |

| **Founder & CTO, Buraq** · Founding Engineer | [`2026-08-founding-cto/`](./2026-08-founding-cto/) | *Zero to One* — ship from nothing, found the company, standards before scale, then lead the team | `Ahmad_Founding_CTO_Resume.pdf` |

The **Founder & CTO** edition is the CTO edition re-cut for founder-shaped roles (early-stage
startup, founding engineer, hands-on CTO). It leads with Buraq (buraqegypt.com), the Egyptian
ride-hailing platform Ahmad founded in March 2026 and built solo across nine repositories: the
NestJS backend, the ops console, rider and captain apps on iOS and Android, and the public web app
(live since 15 Oct 2026). The stat band and § 01 are rebuilt around founding the company as well as
the code (incorporation, the Law 87/2018 licence path, the 626-fare pricing study). Figures were
re-measured from `~/Learn/Topics/Buraq` on 17 Oct 2026 (22 backend modules, 330+ endpoints, 2,900+
backend tests, 10,000+ tests platform-wide, 3,100+ commits). Use it where the employer wants someone
building right now — for an established engineering org, the plain **CTO** edition leads with the
stronger credential.

Each has a terminal-design twin at `2026-08-<title>-terminal/`, linked from its editorial
"See the live interactive edition" button, and each exports a Riyadh + Cairo PDF.

Each page 1 is packed top-to-bottom — no blank space.

## Individual-contributor editions (2026-10, Editorial design)

Two hands-on editions for engineering roles that are not leadership titles. Same career facts and
design; the stat band, the opening paragraph and § 01 are rebuilt for an engineer's reader, and the
ride-hailing platform figures were re-measured from the source repos on 4 Oct 2026 (23 backend
modules, ~320 endpoints, 2,900+ backend tests, 800+ iOS tests, four native clients).

| Title | Folder | § 01 section | PDF |
|-------|--------|--------------|-----|
| **Senior Software Engineer** | [`2026-10-senior-software-engineer/`](./2026-10-senior-software-engineer/) | *How I Engineer* — systems design, measurable quality, modernising in flight, end-to-end ownership | `Ahmad_Senior_Software_Engineer_Resume.pdf` |
| **Full-Stack Engineer** | [`2026-10-fullstack-engineer/`](./2026-10-fullstack-engineer/) | *Across the Stack* — backend &amp; data, realtime &amp; integrations, web, mobile clients | `Ahmad_Fullstack_Engineer_Resume.pdf` |

The **Senior Software Engineer** edition keeps Marn first (engineering bullets lead, leadership
last). The **Full-Stack Engineer** edition puts the ride-hailing platform first, because the
backend and web work is the credential. Each has a terminal twin at `2026-10-<title>-terminal/`
and exports a Riyadh + Cairo PDF.

## Location: Riyadh / Cairo

Every contact-bearing edition (editorial + swiss designs; terminal has no phone/Bureau)
switches between a **Riyadh** and **Cairo** version from a single source — no duplicated files:

- **Default = Riyadh** — `Bureau: Riyadh, Saudi Arabia`, phone `+966 … · +20 …` (Saudi first).
- **Cairo** — append **`?loc=cairo`** to any live URL → `Bureau: Cairo, Egypt`, phone `+20 … · +966 …`
  (Egyptian first). The "live interactive edition" link carries `?loc` through to the terminal twin.
- **PDFs** — `npm run pdf` exports both per edition: the default name (Riyadh) and a
  `…_Cairo_Resume.pdf`. Send the file that matches the job's city.

A small inline script (keyed off the `.k` contact labels) drives it; the location value lives
in one place per file.

The root `index.html` (served on GitHub Pages) mirrors whichever version is live
(currently the **iOS** resume — `2026-07-ios/`, exported to the root as `Ahmad_iOS_Resume.pdf`).
To switch the live edition, copy a version's `index.html`, `assets/`, and PDF up to the repo root.
