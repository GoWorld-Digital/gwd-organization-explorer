---
name: gwd-visual-qa
description: Perform visual, responsive, accessibility, performance and browser verification for the GWD Organization Explorer.
---
# GWD visual QA workflow

1. Read docs/PERFORMANCE_ACCESSIBILITY_QA.md and docs/ROADMAP_AND_ACCEPTANCE.md.
2. Start the app with its documented command.
3. Capture screenshots at 1440x900, 1280x800, 1024x768, 390x844 and 360x800.
4. Review landing, organization overview, selected layer, capability divisions and mission simulator.
5. Test mouse, touch and keyboard navigation.
6. Enable prefers-reduced-motion and confirm the experience remains complete.
7. Test the 2D/non-WebGL fallback.
8. Inspect loading, error, empty and small-screen states.
9. Run lint, typecheck, unit tests, browser tests and production build.
10. Record exact commands, results, screenshots and unresolved issues. Never claim a test passed if it was not run.
