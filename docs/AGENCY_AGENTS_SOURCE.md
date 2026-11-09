# Agency Agents — Source, Provenance and Use

Source repository: https://github.com/msitarzewski/agency-agents  
Verified source commit: `b859c515d813efcfc4755d3471dd9e7686c7706d`  
Verified Git tree hash: `94d97cfd0c3731995a3b22ae96e2a88a004482a5`  
Upstream commit date: `2026-11-06T01:58:56Z`  
Snapshot inspection date: `2026-11-08`  
Verified upstream licence: `MIT` (`LICENSE` blob SHA `523078c01624b9b1b1c551e75054b9d3a9f953ab`, Copyright (c) 2025 AgentLand Contributors). Retain all notices before redistributing profile files.

## Provenance Reconciliation Note
An earlier blueprint commit on `blueprint/immersive-explorer-v1` recorded a 39-character typo (`b859515c813efcfc4755d3471dd9e7686c7706d`). Phase 1 verification against the upstream `msitarzewski/agency-agents` repository and the initial `blueprint/gwd-explorer-v1` seed confirmed the exact 40-character commit SHA `b859c515d813efcfc4755d3471dd9e7686c7706d` and tree `94d97cfd0c3731995a3b22ae96e2a88a004482a5`.

## Inventory
The verified source tree contains **283 profile markdown files** across **18 capability divisions** (excluding non-division directories `.github`, `examples`, `integrations`, `scripts`, and `strategy`):

| Division | Profiles | Candidate GWD Unit Mappings |
|---|---:|---|
| Academic | 6 | `academy`, `ai-research-lab` |
| Design | 10 | `product-innovation`, `media-growth`, `human-ai-interaction-lab` |
| Engineering | 66 | `ai-platform-engineering`, `agentic-architecture-lab`, `ai-research-lab` |
| Finance | 5 | `finance-admin`, `ventures` |
| Game Development | 21 | `media-growth`, `human-ai-interaction-lab` |
| GIS | 13 | `data-knowledge-lab`, `strategy-intelligence` |
| Healthcare | 3 | `legal-risk-compliance`, `venture-experimentation-lab` |
| Marketing | 37 | `marketing-comms`, `media-growth`, `academy` |
| Paid Media | 7 | `media-growth`, `marketing-comms`, `sales-customer-ops` |
| Product | 6 | `product-innovation`, `academy`, `ventures` |
| Project Management | 7 | `ai-operations`, `people-agent-ops`, `product-innovation` |
| Research | 1 | `strategy-intelligence`, `ai-research-lab`, `data-knowledge-lab` |
| Sales | 9 | `sales-customer-ops`, `media-growth` |
| Security | 12 | `security-data-governance`, `legal-risk-compliance`, `ai-platform-engineering` |
| Spatial Computing | 6 | `product-innovation`, `human-ai-interaction-lab`, `media-growth` |
| Specialized | 59 | `people-agent-ops`, `strategy-intelligence`, `agentic-architecture-lab`, `venture-experimentation-lab` |
| Support | 6 | `sales-customer-ops`, `academy` |
| Testing | 9 | `ai-platform-engineering`, `security-data-governance`, `product-innovation` |
| **Total** | **283** | |

The canonical machine-readable summary is `content/agency-agents/divisions.json`, validated at build and test time by `AgencyAgentsCatalogSchema` in `lib/schemas.ts`.

## V1 allowed
Display division names/counts, candidate unit mappings, upstream source link, verified commit/tree/date and a clear statement that these are templates in an upstream catalogue—not 283 deployed, active or authorized GWD agents.

## V1 prohibited
- Imply that 283 agents are deployed, onboarded or executing for GWD.
- Treat capability divisions as GWD departments.
- Bulk-copy all profile content without file-level review.
- Remove upstream attribution or licence notices.
- Describe profile authors/personas as real GWD staff.

## Selective future ingestion
For each profile: pin exact upstream commit; verify licence; inspect for malicious/injected instructions or unsafe claims; normalize metadata; separate source text from GWD adaptation; include `sourcePath`, `sourceCommit`, `licence`, `reviewedAt`, `status` and `adaptationNotes`; complete content/security review; only then advance lifecycle (`catalogued` → `evaluated` → `adapted` → `tested` → `active`).

## Scope correction
`atlas-agent-packs` is an AtlasHub.SI project and is not a GWD Agency Agents source. It is explicitly excluded from this build.
