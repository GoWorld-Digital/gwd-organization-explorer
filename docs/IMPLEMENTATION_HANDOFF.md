# Implementation handoff — next engineering agent

## Current state
- Repository bootstrap README exists on main.
- Product/architecture/design blueprint is on branch blueprint/gwd-explorer-v1.
- The branch contains product specification, organization model, experience architecture, art direction, motion direction, 3D scene specification, technical architecture, data/provenance policy, Agency Agents source snapshot, QA/roadmap, deployment plan, prompts, portable skills, design tokens, seed data and three SVG mockups.
- No Next.js application has been implemented yet.
- No Vercel project, production domain or database has been configured.

## Immediate next actions
1. Review this branch and its open draft PR.
2. Confirm no repo files conflict with an implementation tool's bootstrap assumptions.
3. Review the pinned Agency Agents source commit and license before importing individual profiles.
4. Build the first high-fidelity vertical slice described in docs/ROADMAP_AND_ACCEPTANCE.md.
5. Keep all five organizational layers and status labels from content/organization/organization.seed.json.
6. Use content/capabilities/divisions.seed.json for the 18 divisions and the 283-profile total.
7. Use content/missions/learning-launch.seed.json as the first illustrative scenario.
8. Implement a responsive 2D view before or alongside the 3D scene.
9. Capture browser evidence and run the complete verification suite.
10. Open a feature PR. Do not merge or deploy.

## Expected first milestone
- Next.js app scaffold.
- Design tokens applied.
- Premium cinematic opening with skip button.
- Organization Explorer overview with 5 selectable layers.
- Detail panel with mandate and proposal status.
- 2D map/list fallback.
- Responsive behaviour.
- Reduced-motion path.
- Desktop/mobile screenshots.
- Test commands and results in PR description.

## Files to treat as source of truth
- docs/ORGANIZATION_MODEL.md
- docs/3D_SCENE_SPEC.md
- docs/DATA_MODEL_AND_PROVENANCE.md
- docs/AGENCY_AGENTS_SOURCE.md
- docs/PERFORMANCE_ACCESSIBILITY_QA.md
- docs/ROADMAP_AND_ACCEPTANCE.md
- prompts/MASTER_BUILD_PROMPT.md
