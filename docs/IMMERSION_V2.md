# Immersion, reading and languages — V2

The visual compositions approved on 9 November 2026 remain the default experience. Original scene artwork, asset hashes and canonical organization data are unchanged.

## Added experience

- Optional, dynamically loaded WebGL architectural studies for the five organizational environments. Each study uses local procedural geometry, its own institutional accent, orbital pavilion, thematic centrepiece and selectable unit modules.
- Camera presets (overview, top, close), explicit zoom/reset controls, pointer/keyboard/touch orbit and an accessible unit index. Unit selection opens the canonical dossier. Demand rendering and a capped pixel ratio limit idle GPU work.
- These studies are architectural interpretations, not exact volumetric reconstructions of the approved artwork. Original composition and 3D study remain distinct views.
- Editorial dossiers with contextual image cover, live model counts, unit index, capability/relationship filters and enlarged reading. Native modal focus containment and body scroll locking remain available.
- PT, FR and EN interfaces; language selector, shareable ?lang=pt/fr/en URLs, local preference, document language, localized search (including accent folding) and analytical number formatting. IDs, provenance, formulas, currency USD, GoWorld, GWD, Genesis, Diana, Agency Agents and BU commercial names retain their source form.
- Canonical unit mandates, organizational relationships, division summaries and analytical scenarios have explicit translations. No automatic translation service or external API is used.
- Image-embedded English labels remain in the approved raster artwork. Translated navigation and dossiers provide readable localized access.
- Touch-first navigation at narrow widths and on coarse-pointer devices, including landscape tablets. Nine-environment menu, scene progress, complete artwork preview, separate readable controls, 44px touch controls and responsive dossiers.

## Boundaries

No production deployment, merge, domain change, operational connector or live agent execution is part of this change. The 283 Agency Agents profiles remain upstream catalogue records. Simulators remain illustrative.

## Validation

Run npm run typecheck, npm run lint, npm test, npm run build, then npm run test:browser, npm run test:cinematic and npm run test:immersion against the production server. The CI workflow includes all three browser suites.

When loopback is blocked, EXPLORER_BUILD_FILES=1 enables a reproducible browser fixture that fulfills requests from production build files on disk. This exercises real Chrome rendering and interaction without HTTP access; it does not validate a running server, deployment headers or a public deployment.

The local Windows build uses one worker, threaded prerendering and an in-process compiler; Linux CI retains default worker settings. Runtime dependencies have not changed.

Physical-device, Safari and assistive-technology verification remain release checks.

## Recorded local results

- 11 domain/asset/localization tests passed.
- ESLint passed.
- Production build completed with exit code 0 using the Windows configuration above.
- The immersion browser suite reported all five WebGL studies, PT/FR reading/search, FR/EN analysis without input loss, 320/390/768/1180px touch layouts and French no-WebGL fallback passed, with no page errors. Screenshots and verification.json are in docs/screenshots/immersion/.
- These browser checks use the production-file fixture because HTTP loopback is unavailable. Physical devices and Safari remain unverified.

- Final TypeScript check and the original five-experience Chrome regression suite passed, including context loss, mobile and reduced motion.
- The nine-scene Chrome fidelity/navigation suite passed against the final production files.

Screenshot captures are retained in the local review workspace; the connected GitHub transfer includes source and verification JSON. CI regenerates the captures as downloadable workflow artifacts.
