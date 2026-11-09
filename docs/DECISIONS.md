# Architecture Decisions Record (ADR)

This document records the architectural and governance decisions for the GWD AI-Native Organization Explorer (ported from `blueprint/gwd-explorer-v1` and updated through Phase 1 / G1).

## ADR-001 — Independent GWD Public Experience
- **Decision:** Build as an independent GWD microsite proposed at `explore.goworld.digital`.
- **Boundary:** Not hosted as an AtlasHub.SI product and does not import `atlas-agent-packs`.

## ADR-002 — Separate Repository and Application
- **Decision:** Keep the Explorer in `GoWorld-Digital/gwd-organization-explorer`, isolated from Ops Core.
- **Boundary:** V1 has no database, no Supabase dependency, no authentication and no write path to operational systems.

## ADR-003 — Versioned Static-First Canonical Data with Zod Validation
- **Decision:** Store canonical data in `content/organization/organization-model.json`, `content/agency-agents/divisions.json`, `content/missions/missions-model.json` and `content/finance/scenarios-model.json`, validated by `lib/schemas.ts` (`zod@4.6.7`).
- **Reason:** Guarantees deterministic, auditable, schema-checked data integrity and cross-model referential integrity before UI expansion.

## ADR-004 — Dual 3D/2D Representation
- **Decision:** 3D (`@react-three/fiber` + `three` + `@react-three/drei`) provides spatial orientation; semantic 2D DOM provides accessible reading, keyboard navigation and fallback.

## ADR-005 — Verified Agency Agents Provenance
- **Decision:** Pin `msitarzewski/agency-agents` to verified commit `b859c515d813efcfc4755d3471dd9e7686c7706d` (tree `94d97cfd0c3731995a3b22ae96e2a88a004482a5`, `2026-11-06T01:58:56Z`, MIT licence blob `523078c01624b9b1b1c551e75054b9d3a9f953ab`) with 18 divisions and 283 profile templates.
- **Boundary:** Never represent catalogued source templates as deployed GWD agents, and never conflate GWD shared services with Agency Agents divisions.

## ADR-006 — Custom CSS with Formalized Design Tokens
- **Decision:** Keep the custom CSS architecture in `app/globals.css` backed by `design/tokens.json` and CSS custom properties (`--gwd-*`), without introducing Tailwind CSS in Phase 1.

## ADR-007 — Native Node Test Runner + Playwright
- **Decision:** Use Node.js 24 native test runner (`node --test tests/model.test.mjs`) for schema, provenance, mission and financial unit tests, and Playwright (`tests/browser.mjs`) for E2E browser and WebGL fallback verification.

## ADR-008 — Human Approval Gates in Mission & Governance Models
- **Decision:** Require explicit human approval gates (`strategy`, `legal`, `financial`, `client`, `security`, `launch`) on every step of illustrative missions.
