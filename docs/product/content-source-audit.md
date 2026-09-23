# Content-source audit for the public landing page

Date: 2026-09-23 (Phase 5). Every meaningful claim or section on `public/index.html` is
traced to one of these sources:

- **A** approved current page (the Phase 4 `index.html`, originally the supplied
  `index.html`)
- **B** product documentation in `docs/product/`
- **C** Magic UI prototype (`archive/phase-1-originals/studio-landing-v1.1-magic-ui.html`)
- **D** content resource package (content strategy doc and frameworks)
- **E** structural or editorial synthesis: wording written for this page that restates
  A–D without adding a new business fact

Anything that would be a new business fact is not on the page; see "Not used" at the end.

## Header and hero

| Element | Text | Source |
|---|---|---|
| Nav labels | Your foundation, How it works, Guide, Book a call | E |
| Headline | Make the next move clearer. | A (original page headline); working answer per the alignment brief, final approval pending |
| Lede, sentence 1 | We help service businesses connect the pieces behind their work: the website, the inquiries, the bookings, the documents, the payments. | E, from B ("service-business owners" in D pillar 1; the list of pieces is the owner brief's concept list recorded in B) |
| Lede, sentences 2–4 | We map what you already have, find what is missing, and shape a foundation you can build from. A website may be part of it. It is not the whole answer. | C, lightly reworded |
| Primary CTA | Book a Studio Discovery call | A/B (terminology) |
| Secondary CTA | Not sure yet? Try the guide | E |
| Hero note | A conversation about where your business is and what is getting in the way. | E, from C process copy. "No preparation needed" removed (unsupported). |

## Problem recognition

| Element | Source |
|---|---|
| Heading "The work is good. The system behind it is scattered." | E, from D pillar 1 ("Your business runs on systems you cannot see") and C footer line |
| Lede "Most service businesses run on a mix of tools, documents, and memory. It works until it gets busy." | E; "most" is a general observation, not a statistic |
| Follow-up lives in your memory | owner brief (Phase 5 instruction) + D pillar 1 (admin drag); E wording |
| Invoices need chasing | owner brief + D pillar 1 ("uninvoiced-work leak"); E wording |
| Documents are everywhere | owner brief, B ("scattered documents"); E wording |
| Booking, payment, and client work do not connect | owner brief, B ("disconnected tools"); E wording |
| The same admin, again | owner brief ("repetitive admin"); E wording |
| It all lives in one person's head | owner brief; E wording |
| Closing note "Not every business has every one of these…" | E, required by the instruction not to imply every visitor has every problem |

## Connected systems

| Element | Source |
|---|---|
| Heading "One journey instead of a pile of tools." | E, from C hero visual concept |
| Lede | E, from the owner brief ("connected business systems") |
| Seven steps: Inquiry, Booking, Quote, Agreement, Payment, Delivery, Follow-up ("Quote" replaces "Proposal" so the word keeps one meaning on the page) | owner Phase 5 instruction (example list); Inquiry/Booking/Payment descriptions adapted from C ("A clear route to your inbox", "Connect a suitable booking tool to the times you make available", "Plan checkout…") |
| Step descriptions for Proposal, Agreement, Delivery, Follow-up | E; they describe the type of system, not product features |
| Closing note "Your version may need only three… not a list of features you have to buy." | E, required by the instruction to avoid a feature checklist |

## Studio foundation

| Element | Source |
|---|---|
| Heading "A map of what fits. Room for what comes next." | C verbatim |
| Lede | E, rewritten from C and the alignment brief: Studio Foundation (provisional offer name) starts with the Foundation Map diagnostic, then a separate Proposal |
| 01 What you already have | B (product model: "understand what exists"); E wording |
| 02 What is missing | B ("identify what is missing"); E wording |
| 03 What could fit | B ("map the useful opportunities"); draws on C "Product suggestion map" and "Essential platforms" descriptions without using the internal names |
| 04 What comes first | B ("decide what should happen first"); draws on C "Opportunity stack" ("each layer tied to a real need") without the 200+ count |

## How it works

| Element | Source |
|---|---|
| Heading and lede | C verbatim |
| 01 Discovery | C, expanded with the owner brief's Discovery definition; the preparation sentence was removed |
| 02 Foundation Map | alignment brief: current state, evidence-backed findings, linked recommendations, risks and constraints, prioritized next steps; "It is not the Proposal." Detailed wording pending Max's Foundation Map brief |
| 03 Proposal | alignment brief: separate commercial step based on Map recommendations; what we would build, scope, pricing, payment terms; client decision |
| Build note "Build comes later…" | alignment brief: downstream delivery after Proposal and agreement; not a stage |

## Discovery guide

| Element | Source |
|---|---|
| Eyebrow "Optional: a place to begin", heading "Put your situation into words." | A, reworded |
| Intro paragraph | E; states that nothing is sent and booking does not require it |
| Four questions and options | owner specification (2026-09-23), verbatim |
| Review copy "Nothing has been sent. Copy this and bring it to your Studio Discovery call, or book without it." | owner specification, verbatim |
| Privacy note | A verbatim |

## Final CTA and footer

| Element | Source |
|---|---|
| "Book a Studio Discovery call." heading | B terminology |
| Body copy | E, restating C process copy; "If it makes sense to continue, the next step is the Foundation Map, followed by a separate Proposal" reflects the alignment brief without implying booking starts the Map |
| "The link opens our Cal.com scheduling page." | A (privacy note mentions Cal.com) |
| (removed) "No preparation needed, and no commitment beyond the conversation." | removed as unsupported |
| Footer tagline "From an unclear situation to a mapped, useful, and responsibly supported system." | C verbatim |
| © 2026 Macks Studios · Arlington, Texas | A and C |

## Not used, on purpose

- "Library of 200+ opportunities" (C): unconfirmed.
- "10 minute session", "$150 Paid", "$500 Paid" (C): fake demo data.
- Inquiry form (C): design-only, did not send anything.
- "About the studio" link to macksstudios.org/about/studio (C footer): points at the
  separate live application; left out pending the routing decision.
- Live-site pricing, reservation, five-step flow, login/signup: excluded by owner decision.
- Internal deliverable names (Presence Package, Product Suggestion Map, Essential
  Platforms, Opportunity Stack): described in plain language instead, per terminology
  guidance.
- "Seven business systems" (D): undefined.
- Testimonials, client counts, statistics, guarantees: none exist in the sources.

## Editorial claims and working answers (resolved in Phase 9)

All items below were resolved by Max on 2026-09-23; see `studio-foundation-alignment.md`,
"Final owner decisions". Kept here as the record of what was open.

1. Hero headline "Make the next move clearer." (WORKING).
2. "Studio Foundation" as the offer name (WORKING; needs Max's tick).
3. Whether "paid diagnostic" should appear publicly (UNRESOLVED; currently absent).
Audience and public process are LOCKED; see `studio-foundation-alignment.md`.
5. "Most service businesses run on a mix of tools, documents, and memory." (problem lede; generalisation).
