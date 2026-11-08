---
name: gwd-org-data-integrity
description: Model organizational units, relationship types, Agency Agents source profiles, provenance and maturity without conflating proposals with operational facts.
---
# GWD organization data integrity workflow

1. Read docs/ORGANIZATION_MODEL.md, docs/DATA_MODEL_AND_PROVENANCE.md and docs/AGENCY_AGENTS_SOURCE.md.
2. Keep reporting, service, capability and mission edges distinct.
3. Require stable IDs and schema validation.
4. Retain source repository, commit, path, URL, license, attribution and content hash for imported profiles.
5. Keep source profiles and GWD-adapted capabilities separate.
6. Use statuses only with the meanings defined in the data model.
7. Never infer deployment from a source file existing.
8. Do not invent people, legal entities, revenue, customers or operational results.
9. Label demo missions/economic scenarios illustrative.
10. Test counts, referential integrity, relationship types and missing provenance.
