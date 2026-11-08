---
name: gwd-immersive-organization-explorer
description: Build and review the GWD immersive organization explorer with React Three Fiber, GSAP, Motion, accessible 2D fallbacks and strict source/status truth.
---

Read AGENTS.md and the relevant docs before editing. Keep the experience premium, architectural, calm and informative—not a game or generic AI dashboard.

Truth boundaries: the five organizational layers and units are proposals unless verified; Agency Agents' 283 profiles across 18 divisions are upstream source templates, not deployed GWD agents; financial values are illustrative; atlas-agent-packs is out of scope; V1 has no DB, auth or operational integration.

Technical rules: verify stable versions and peer deps; lazy-load the R3F canvas; build 2D/DOM first-class alternatives; use 18 capability clusters, not 283 meshes; keep domain/simulation state outside render components; use useFrame refs for frame updates; GSAP for camera/intro timelines and Motion for DOM transitions without overlapping property ownership; support keyboard, touch, reduced motion, no-WebGL and mobile 2D-first. Report only tests actually run. Never merge or deploy production without human authorization.
