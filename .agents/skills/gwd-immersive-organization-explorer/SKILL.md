---
name: gwd-immersive-organization-explorer
description: Build, extend, review or optimize this GWD AI-Native Organization Explorer using Next.js, React Three Fiber, Three.js, GSAP, Motion and accessible 2D fallbacks. Use for organization scenes, capability constellations, cinematic motion, mission simulation or visual QA.
---

# GWD Immersive Organization Explorer

Before acting, read relevant docs: ART_DIRECTION, 3D_SCENE_SPEC, SCENE_STORYBOARD, TECHNICAL_ARCHITECTURE and QUALITY gates.

## Product truth
- The five layers and all units are proposed unless source data explicitly says otherwise.
- Agency Agents is a source catalogue (283 profiles / 18 divisions in recorded snapshot), not an active GWD fleet.
- Capability divisions are not a GWD reporting hierarchy.
- Financial scenarios are illustrative.
- The Explorer is read-only; no Ops Core, Supabase, Hermes or CRM connection in V1.

## Design
Premium architectural observatory; calm, precise, cinematic. 3D clarifies relationships, never hides information. DOM and 2D are first-class. No autoplay audio, hover-only actions or constant camera spinning.

## Technical
- Verify installed versions and peer dependencies before using APIs.
- Keep R3F components focused; use useFrame + refs for frame motion, not React setState.
- Keep simulation data and domain logic outside render components.
- Instance repeated geometry; 18 clusters only, not 283 meshes.
- Lazy-load Canvas and heavy graph modules.
- GSAP for intro/camera timelines; Motion for DOM; never animate the same property twice.
- Cleanup timelines, controls, event listeners and resources.

## Quality
Keyboard/touch interaction, reduced-motion, no-WebGL/context-loss fallback, mobile 2D-first, no hidden factual claims. Report only tests actually run.
