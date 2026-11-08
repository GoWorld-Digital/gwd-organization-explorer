# Repository operating instructions

You are working on the GWD AI-Native Organization Explorer, a public-facing product experience owned by GoWorld Digital.

## Start here
Read README.md, then the relevant product, organization, experience, art direction, scene, technical architecture, source provenance and acceptance documents in docs/.

## Product boundaries
- This is a public exploration and simulation experience, not GWD Ops Core.
- Do not connect production databases, operational control planes, customer records or agent credentials in the first release.
- Do not import or represent AtlasHub's atlas-agent-packs as GWD source material. It is out of scope.
- Agency Agents is the only initial external agent-capability catalogue. Treat it as source material, not deployed infrastructure.
- Keep the organization model, capability catalogue and actual runtime status as separate data domains.

## Truth and governance
- Distinguish proposed, approved, catalogued, evaluated, adapted, tested and active.
- The 283 Agency Agents profiles are not 283 running GWD agents.
- Governance bodies, departments, cost centres, profit centres, ventures and labs are proposed unless formal status is evidenced.
- Financial values in demos are illustrative assumptions, never actual GWD results or forecasts.
- Do not invent people, officeholders, legal entities, revenue, customers, performance results or operational status.
- Every imported capability record must retain source URL, source commit, source path, attribution and license review state.

## Engineering rules
- Use the stable stack in docs/TECHNICAL_ARCHITECTURE.md. Never silently introduce alpha/beta rendering dependencies into production.
- Keep the 3D scene lazy-loaded and isolated from server-rendered content.
- Provide synchronized 2D and non-WebGL fallbacks.
- Avoid expensive per-frame React state updates. Use refs/render-loop updates for transient scene motion.
- Do not add a database or AI API to the first release without a separate architecture decision.
- Use strict TypeScript, Zod validation and deterministic tests.
- Keep scene, data, navigation and UI components composable; do not build a monolithic scene component.
- Use semantic HTML for all critical text and controls. Canvas is an enhancement, never the only information channel.

## Required verification
Before declaring a feature complete: run lint, typecheck, tests and production build; verify keyboard navigation, reduced motion, 2D fallback and browser screenshots at desktop and mobile sizes. Report anything not tested.

## Git and deployment
Work on a feature branch and open a PR. Never merge, configure DNS, add secrets or deploy production without explicit human approval.
