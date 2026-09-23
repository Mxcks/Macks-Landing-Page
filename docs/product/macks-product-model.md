# Macks Studios product model

Status: skeleton, populated only from audited sources (2026-09-23). Sections marked
**Unresolved** need Max's input before they can be filled.

## What Macks Studios is

Source-supported (reference prototype copy, content strategy doc, owner brief):

Macks Studios helps a business turn scattered documents, disconnected tools, unclear
customer journeys, and ideas without a sequence into a clearer system and a practical
next step. It maps what the business already has, identifies the opportunities that
fit, and shapes a "Studio foundation" the business can build from. A website may be part
of the answer; it is not automatically the whole answer.

## Studio Foundation (offer level, provisional name)

Per the alignment brief (2026-09-23): the working name for the client engagement or
service being considered. Max still needs to approve this naming split; see
`studio-foundation-alignment.md`. Do not spread the term into code or domain names.

Source-supported meaning of the engagement: bring documents, tools, and loose ideas into
one useful picture, then propose the work that fits the business's priorities, capacity,
and customers.

Plain-language sequence used on the public site (describes what the Foundation Map
gives the client):

1. understand what exists
2. identify what is missing
3. map the useful opportunities
4. decide what should happen first

Supporting deliverable concepts named in the reference material: Presence Package,
Product Suggestion Map, Essential Platforms, Opportunity Stack. Definitions are in
`terminology.md`. They are internal names and do not have to appear as public product
cards.

## Public process

Source-supported and approved by the owner on 2026-09-23:

| Step | What happens |
|---|---|
| 01 Discovery | Talk through the business, documents, current tools, friction, and priorities. |
| 02 Foundation Map | The issued diagnostic and specification document: current-state analysis, evidence-backed findings, recommendations linked to findings, risks and constraints, prioritized next steps. Separate from the Proposal. Detailed public wording pending Max's Foundation Map brief. |
| 03 Proposal | Separate commercial artifact based on the Foundation Map recommendations: offered scope, pricing, payment terms, client decision. |

Build is downstream delivery after the Proposal and later commercial gates. It is not a
public stage and is mentioned on the page only as a one-line note after Proposal.

The live macksstudios.org application shows a different flow (Reserve, Map, Confirm,
Build, Launch) with prices. The owner has ruled that flow and its pricing belong to the
client system and are not imported here.

## Connected systems a business presence can include

Source-supported examples: inquiries, booking, payments. The point is that a presence
can connect to the practical systems customers need, not that these three are products
for sale.

## Primary conversion

Book a Studio Discovery call. Booking runs on Cal.com; the destination is configured in
`public/assets/js/config.js`.

## Business facts

- Location: Arlington, Texas.
- Public domain intention: macksstudios.org.
- Owner: Max.

## Public site vs client management system

| Public website (this repository) | Client management system (separate) |
|---|---|
| explain Macks, positioning, problems, process | engagements, clients, proposals, documents |
| optional discovery guide, browser-only | agreements, invoices, payments |
| route to booking | projects, deliverables, reviews, handoff |

Shared branding only. No shared runtime code, no monorepo.

## Unresolved

- **Max's "seven business systems."** The content package README says these are the
  backbone of the business. No supplied material lists them. Do not invent them.
- **"Library of 200+ opportunities."** Appears in the reference prototype only. Not
  confirmed; not to be published until it is.
- **Session length and pricing.** The prototype mentions a "10 minute session" and
  example payments; none of this is confirmed for the public site.
- **Offer-level naming.** "Studio Foundation" is the working offer name; the live site
  says "Studios Foundation". Max still needs to approve the split (offer: Studio
  Foundation; deliverable: Foundation Map). See `studio-foundation-alignment.md`.
- **Public "paid diagnostic" wording.** Not on the page; Max to choose.
- **Hero headline and audience.** Working answers in use; formal approval pending.
- **Foundation Map detail.** TODO: replace/refine Foundation Map public copy after Max
  supplies the Foundation Map brief.
