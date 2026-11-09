# Data Model and Provenance Contract

## Separate Domains
1. **Organization model** (`content/organization/organization-model.json`) — five layers, 21 units, mandates, economic classifications, maturity stages, 34 typed organizational relationships (`reports_to`, `advises`, `provides_service_to`), 22 capability mappings (`capability_supports`) and documented discrepancy notes.
2. **Agency Agents source catalogue** (`content/agency-agents/divisions.json`) — verified upstream snapshot (`b859c515d813efcfc4755d3471dd9e7686c7706d`), tree (`94d97cfd0c3731995a3b22ae96e2a88a004482a5`), MIT licence metadata, 18 divisions and 283 profile counts.
3. **Mission simulation model** (`content/missions/missions-model.json`) — three deterministic, illustrative mission scenarios with participating units, shared services, candidate capability divisions, sequential steps and mandatory human approval gates.
4. **Financial simulation model** (`content/finance/scenarios-model.json`) — deterministic unit-economics formulas, input bounds, centre definitions and four illustrative scenario presets.
5. **Design tokens** (`design/tokens.json`) — canonical color, typography, motion and layout tokens mirrored as CSS custom properties in `app/globals.css`.

Do not infer operational deployment from any static domain file. Every model is validated at load and test time via Zod schemas in `lib/schemas.ts`.

## Required Status Vocabulary
- `proposed`: organizational unit, layer or relationship under exploration; not formally constituted.
- `design-principle`: architectural coordination concept (`ai-operations` / Ops Core); not an active production system.
- `catalogued-source` / `catalogued`: identified in the pinned upstream Agency Agents repository snapshot (`b859c515d813efcfc4755d3471dd9e7686c7706d`).
- `illustrative`: deterministic simulation scenario or financial preset; never actual GWD operations or financial results.
- Maturity stages for Labs and Ventures: `hypothesis` → `research` → `prototype` → `validation` → `venture-proposal` (and `launched` only if independently verified in a future release).

## Cross-Model Referential Integrity Rules
`validateCanonicalDomain()` in `lib/schemas.ts` enforces:
1. Every relationship `from` and `to` ID must exist in `organization-model.json` and `from !== to`.
2. `advises` edges must originate from an `advisory` unit; `provides_service_to` edges must originate from a Layer 3 `shared-services` unit; every non-governance unit must have a `reports_to` edge.
3. Every `candidateCapabilityDivisions` entry on a unit or mission must match one of the 18 Agency Agents division IDs (preventing GWD shared-service IDs such as `legal-risk-compliance` from being conflated with Agency Agents capability divisions).
4. Every mission step must include a typed `humanGate` (`strategy`, `legal`, `financial`, `client`, `security`, or `launch`).
