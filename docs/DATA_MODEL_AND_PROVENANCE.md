# Data model and provenance contract

## Separate domains
1. Organization nodes and reporting/service relationships.
2. Agency Agents source profiles and divisions.
3. GWD capability mappings (how a source profile could support GWD work).
4. Mission scenarios and participation.
5. Economic-centre definitions and illustrative assumptions.

Do not infer one domain from another. A source profile does not create a GWD role or active agent.

## Organization node fields
Each node should have: stable id; display name; type (governance, executive, shared_service, business_unit, cost_centre, profit_centre, investment_centre, lab or venture); status (proposed, approved, active, paused or retired); mandate; optional confirmed owner role; parentId; tags; optional evidence references.

## Relationship fields
Each relationship has id, from, to, type (reports_to, provides_service_to, capability_supports, participates_in_mission or invests_in), status, rationale and provenance. Never use a generic connected relationship when the type is known.

## Agency Agents source record
Each imported profile retains sourceId, sourceName, sourceDivision, sourcePath, sourceRepository, sourceCommit, sourceUrl, sourceLicense, licenseReviewStatus, attribution, importedAt, sourceContentHash, authored summary, GWD mapping IDs, and GWD maturity status (catalogued, evaluated, adapted, tested or active).

A GWD active status requires separate operational evidence. Never derive it from the existence of an upstream source profile.

## Mission scenario fields
Each scenario includes id, title, objective, description, scenarioStatus=illustrative, assumptions, exclusions, participating organization node IDs, capability profile/division IDs, ordered steps, human approval gates, outputs and optional economic assumptions with unit, currency, basis, source and label.

Every scenario must display: “Illustrative simulation — not a live GWD operation”.

## Economic model
A centre record states centreType (cost, profit or investment), accountableUnit, cost/revenue/capital categories, measurementPeriod, metric definitions and value type (actual, target, estimate or scenario assumption).

No actual financial values without an approved source. Scenario assumptions need explicit units and visible illustrative labels.

## Required statuses
- proposed: designed, not formally approved.
- approved: approved by the proper human authority with evidence.
- catalogued: identified in an external source catalogue.
- evaluated: reviewed for suitability, license and quality.
- adapted: modified/configured for GWD use.
- tested: validated in a GWD-controlled test.
- active: operating in a GWD environment with verifiable evidence.
- paused / retired: no longer currently active.

## Provenance principle
Public factual claims about GWD must be supported by a source record, or labelled proposed/illustrative. Provide a simple provenance drawer in the UI.
