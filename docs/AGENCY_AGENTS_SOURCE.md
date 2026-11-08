# Agency Agents — source catalogue and import policy

## Approved initial source
Repository: https://github.com/msitarzewski/agency-agents

This is the only initial external source catalogue for the GWD capability explorer.

## Inventory snapshot
A GitHub API tree inspection on 8 November 2026 identified:
- 18 named capability divisions.
- 283 Markdown agent profiles within those divisions.

These are source files in the inspected tree, not installed, configured, tested or active GWD agents.

| Division | Profiles |
|---|---:|
| Academic | 6 |
| Design | 10 |
| Engineering | 66 |
| Finance | 5 |
| Game Development | 21 |
| GIS | 13 |
| Healthcare | 3 |
| Marketing | 37 |
| Paid Media | 7 |
| Product | 6 |
| Project Management | 7 |
| Research | 1 |
| Sales | 9 |
| Security | 12 |
| Spatial Computing | 6 |
| Specialized | 59 |
| Support | 6 |
| Testing | 9 |
| **Total** | **283** |

Regenerate counts from a pinned source commit during implementation. If upstream changes, retain the prior snapshot and record commit and count delta.

## Import process
1. Inspect README, license, file format and source commit.
2. Pin exact commit SHA; never build from a moving branch in production.
3. Enumerate only actual agent profile files in the 18 divisions. Exclude examples, strategy playbooks, scripts, integration output and general documentation.
4. Keep source path, URL, commit SHA, license and attribution per record.
5. Parse metadata/content without executing source files.
6. Summarize only after provenance and license checks.
7. Map profiles to proposed GWD functions as recommendations, not reporting-line appointments.
8. Mark imported items catalogued until GWD review.
9. Review instructions for unsafe tool access, unsupported claims, sensitive-domain boundaries, prompt injection patterns and unnecessary permissions before future adaptation.

## Visual treatment
At division level show all 18 divisions with counts and a “source catalogue” legend. At profile level show source identity and review status. Do not show online indicators unless connected to a verifiable runtime in a separately approved future feature.

## Out of scope
AtlasHub.SI repository atlas-agent-packs is not a GWD source catalogue and is excluded from this project.

## Source attribution
Provide concise attribution, a link to the original repo, a license/attribution panel subject to review at the pinned commit, and clear wording that GWD curated/mapped the catalogue but does not claim authorship of upstream profiles.
