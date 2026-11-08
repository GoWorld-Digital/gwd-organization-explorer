---
name: gwd-visual-qa
description: Perform visual, responsive, accessibility, performance and browser verification for the GWD Organization Explorer.
---
# GWD visual QA workflow

1. Read docs/PERFORMANCE_ACCESSIBILITY_QA.md and docs/ROADMAP_AND_ACCEPTANCE.md.
2. Run the app and capture screenshots at 1440x900, 1280x800, 1024x768, 390x844 and 360x800.
3. Review landing, organization overview, selected detail, capability divisions and mission simulator.
4. Test mouse, touch and keyboard navigation.
5. Enable prefers-reduced-motion and confirm the experience remains complete.
6. Test the 2D/non-WebGL fallback.
7. Inspect loading, error, empty and small-screen states.
8. Run lint, typecheck, unit tests, browser tests and production build.
9. Record exact commands, results, screenshots and unresolved issues.
10. Never claim a test passed if it was not run.
