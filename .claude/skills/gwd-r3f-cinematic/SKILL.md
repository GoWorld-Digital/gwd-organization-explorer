---
name: gwd-r3f-cinematic
description: Design performant cinematic Three.js and React Three Fiber organization scenes with camera states, layers, interaction and 2D fallbacks.
---
# GWD R3F cinematic workflow

1. Read docs/3D_SCENE_SPEC.md, docs/MOTION_DIRECTION.md and docs/PERFORMANCE_ACCESSIBILITY_QA.md.
2. Separate scene, content data, selection state and UI details.
3. Use React Three Fiber 9 stable with React 19 for release 1.
4. Lazy-load the canvas. Keep headings, labels, buttons and detail content in DOM.
5. Use instancing for repeated nodes and markers.
6. Keep transient animation in refs/frame loop. Never update React state every frame for object motion.
7. Build explicit camera states: overview, governance, business, capability, mission and reset.
8. Animate selection with interruptible, damped transitions.
9. Keep post-processing restrained; avoid bloom over text and heavy effects on mobile.
10. WebGL2 baseline. Do not use R3F v10 alpha or require WebGPU in production path.
11. Provide non-WebGL and reduced-motion alternatives.
12. Verify browser screenshots and device performance; report only measured frame rates.
