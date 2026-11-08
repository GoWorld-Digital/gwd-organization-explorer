# GWD Organization Explorer — Agent Instructions

Build the independent public GWD AI-Native Organization Explorer, proposed at https://explore.goworld.digital.

## Read first
README.md; docs/PRODUCT_BRIEF.md; docs/ORGANIZATION_MODEL.md; docs/ART_DIRECTION.md; docs/3D_SCENE_SPEC.md; docs/TECHNICAL_ARCHITECTURE.md; docs/AGENCY_AGENTS_SOURCE.md; docs/ROADMAP_AND_ACCEPTANCE.md; prompts/MASTER_BUILD_PROMPT.md.

## Product truth constraints
- Agency Agents is an upstream catalogue of 283 source profiles across 18 divisions in the recorded snapshot. It is NOT 283 deployed GWD agents.
- The 18 divisions are capability domains, not automatically GWD departments.
- Governance bodies, departments, BUs, Ventures and Labs are proposals unless verified.
- Financial values are illustrative only, never actual GWD results or forecasts.
- atlas-agent-packs belongs to AtlasHub.SI and is OUT OF SCOPE.
- V1 is public, read-only, static-data: no auth, personal data, DB, Supabase, Ops Core write path or live agent execution.

## Engineering constraints
- Stable compatible releases only; check peer dependencies before pinning.
- Dynamically load the 3D canvas; never block core content on WebGL.
- 3D is spatial orientation/impact; 2D and semantic DOM are the canonical accessible representation.
- Show five organizational layers and 18 capability clusters, never 283 separate meshes.
- Keep simulation/domain state outside render components. Use R3F useFrame with refs for frame updates; never set React state every frame.
- GSAP owns choreographed scene/camera timelines. Motion owns DOM transitions. Never double-animate the same property.
- Lazy-load Three/R3F; cap DPR; instance repeated geometry; clean up resources.
- Support keyboard, touch, reduced motion and no-WebGL fallback. No autoplay audio.
- Work on a feature branch and draft PR. Never merge, deploy production, configure DNS or connect operational systems without explicit human approval.
- Run typecheck, lint, unit tests, production build and Playwright. Report only checks actually run.
