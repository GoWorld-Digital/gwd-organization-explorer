# Architecture decisions (initial)

This is a proposed product architecture record for the public Explorer. Decisions remain subject to human review.

## ADR-001 — Independent GWD public experience
**Decision:** Build as an independent GWD microsite at explore.goworld.digital.
**Reason:** The Explorer communicates GWD's own organizational model and market-facing capability ecosystem.
**Boundary:** It is not hosted as an AtlasHub.SI product and does not make AtlasHub the apparent owner.

## ADR-002 — Separate repository and application
**Decision:** Keep the Explorer in GoWorld-Digital/gwd-organization-explorer, separate from gwd-core.
**Reason:** It is a public experience, not the operational control plane.
**Boundary:** Do not put this application in Ops Core or couple release 1 to its database.

## ADR-003 — Static-first release 1
**Decision:** Use curated, versioned content in the repository.
**Reason:** Faster, safer, auditable, no operational dependencies.
**Future:** A separate integration decision may connect approved read-only data from Ops Core once it exists and is governed.

## ADR-004 — Dual representation
**Decision:** 3D for spatial orientation and cinematic discovery; 2D/DOM for precision, reading, accessibility and fallback.
**Reason:** 3D must never be the only path to essential information.

## ADR-005 — Agency Agents as the initial capability source
**Decision:** Use msitarzewski/agency-agents as the only initial external agent-capability catalogue, with a pinned source snapshot.
**Reason:** This was the source being evaluated for GWD. Do not conflate a source profile with a GWD deployment.

## ADR-006 — Exclude atlas-agent-packs
**Decision:** Do not import atlas-agent-packs into this product.
**Reason:** It belongs to the AtlasHub.SI ecosystem and was not the selected GWD source in this phase.

## ADR-007 — Stable graphics baseline
**Decision:** React Three Fiber 9 stable with React 19 and WebGL2 baseline for release 1. Evaluate WebGPU later as enhancement.
**Reason:** Avoid an alpha rendering dependency in the first public release.

## ADR-008 — Split animation responsibilities
**Decision:** GSAP for orchestrated cinematic timelines; Motion for UI/layout; Three render loop for spatial movement.
**Constraint:** No two animation systems should drive the same property.

## ADR-009 — Single primary coding agent
**Decision:** Use one primary coding agent (recommended: Codex + GPT-6 Astra) and one independent visual QA agent (recommended: Antigravity + Gemini 4 Argon). Claude Code + Opus 5.5 is an alternative primary builder.
**Reason:** Avoid conflicting concurrent edits and preserve a single integration owner.

## ADR-010 — Human approval gates
**Decision:** No production deploy, DNS changes, merges, operational integrations or external public claims without explicit human approval.
**Reason:** Preserve human control over material risk and market-facing representations.
