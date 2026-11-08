# Performance, accessibility and quality assurance

## Experience quality targets
The experience should feel premium on a modern desktop, remain understandable on a mid-range laptop and remain usable on mobile.

Targets are engineering goals, not guarantees:
- 60 FPS target on a representative modern desktop GPU during normal navigation.
- 30 FPS or deliberate 2D fallback on constrained devices.
- No blocking 3D load before the visitor can read the product proposition.
- No persistent animation when the scene is offscreen or tab is hidden.
- No significant layout shift during scene initialization.

## Responsive verification matrix
Capture and test at 1440×900, 1280×800, 1024×768, 768×1024, 390×844 and 360×800. Include Chromium and at least one of Firefox or WebKit.

## Accessibility gates
- Semantic headings and landmarks.
- Keyboard navigation for all controls.
- Visible focus indicators and accessible names/selected states.
- No hover-only information.
- Sufficient text contrast.
- Reduced-motion support.
- Audio off by default.
- Essential information outside WebGL canvas.
- 2D/list alternative for every 3D interaction.
- Accessible loading/error states and mobile-sized touch targets.

## Performance gates
Lazy-load 3D; set adaptive pixel ratio; avoid huge uncompressed textures; use instancing; minimize post-processing; avoid per-frame React state; avoid scroll-animation layout thrashing; keep critical content server-renderable; inspect bundle weight; profile CPU/GPU/memory on a representative mid-range device.

## Visual QA evidence
Each major delivery includes screenshots of landing, organization overview, selected detail, Agency Agents divisions and one mission scenario, plus mobile versions. Include a short recording of opening + interaction, and known defects/unverified conditions.

## Definition of done
A feature is complete only when relevant tests, typecheck, lint and production build pass; browser paths are tested; desktop/mobile screenshots are reviewed; keyboard/reduced-motion checked; 2D fallback works; provenance labels are correct.
