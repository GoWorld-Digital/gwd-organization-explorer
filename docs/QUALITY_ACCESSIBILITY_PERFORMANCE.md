# Quality, Accessibility and Performance Gates

## Visual quality
- Clear hierarchy at 1440×900 and 1920×1080.
- Every layer and unit has an explicit status.
- Motion reinforces information sequence; no continuous spectacle.
- Panels never obscure essential controls.
- Visitor can skip the opening and navigate instantly.

## Accessibility
- Semantic HTML for navigation, buttons and panels.
- Every meaningful canvas action has a DOM equivalent.
- Keyboard support: visible focus, logical order, Escape close, sensible return focus, arrow navigation where useful.
- Do not use colour alone for status.
- WCAG AA contrast for text.
- Respect `prefers-reduced-motion` and provide a user-facing toggle.
- No autoplay audio.
- Mobile touch targets and text must be usable.
- Provide a textual org outline and 2D/SVG fallback.
- Focus remains predictable when panels open/close.

## Performance targets (validate on real devices)
- Main content paints before requesting the 3D module.
- Lazy-load Three/R3F and graph modules.
- Target under 250 KB compressed JavaScript before the 3D chunk; measure separately.
- Cap DPR initially around 1.0–1.5 and adapt down on mobile/low-power devices.
- Keep draw calls and post-processing modest; instance repeated geometry.
- No 283 separate meshes or per-frame React state updates.
- Avoid large uncompressed textures and autoplay video.
- Test on integrated-GPU laptop and mid-range mobile.
- Use static fallback when WebGL is absent, lost or blocked.

## Motion implementation
- Prefer transforms and opacity for DOM transitions.
- Camera transitions are short and interruptible.
- Do not scroll-jack.
- GSAP contexts and ScrollTriggers must be cleaned up on unmount.
- Motion owns DOM transitions; GSAP owns scene choreography; no double-animation.
- Pause nonessential continuous scene motion when hidden/offscreen where practical.

## Automated tests
- TypeScript typecheck and ESLint.
- Vitest: schemas, organization traversal, capability mapping, finance formulas.
- Playwright: navigation, layer selection, capability selection, mission path, reduced motion, mobile and no-WebGL fallback.

## Visual QA screenshots
Capture 1440×900 overview, capability explorer, mission simulator, tablet portrait, mobile 390×844, reduced-motion mode and WebGL fallback.

## Release gate
No production release until source counts reconcile, status/provenance disclaimers are visible, critical keyboard paths pass, tests and build pass, no secrets/personal data are in client bundles, and human owner approves the preview.
