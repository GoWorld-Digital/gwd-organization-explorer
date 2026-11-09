# Genesis cinematic experience — implementation and fidelity contract

## Starting point

Reviewed the actual remote `main` at `f7e6da9a895e89af286503403b28381b7d53a4e9` on 9 November 2026. The initial local checkout was older (`4642fae`); the implementation branch starts from the current remote commit, preserving its subsequent work.

The current model already includes the five experiences: 3D/2D organization, source catalogue, illustrative missions with human approval gates, deterministic financial simulation, and Ventures/Labs. Its canonical model has five layers, 21 proposed units, 34 organizational relationships and 22 capability mappings. The source provenance correction and Zod validation remain intact.

## Routes

- `/`: the visual Genesis experience. Nine independent compositions, linked with semantic buttons, browser history and deep links (`/#governance`, `/#labs`, etc.).
- `/architecture`: the existing interactive Three.js/R3F organization and its five experiences. Direct section links: `#catalog`, `#missions`, `#finance`, `#ventures`.

The cinematic layer does not replace canonical data, simulators or the real orbitable 3D model. Legacy styling is scoped to `.architecture-shell` to avoid leaking into the new experience.

## Nine visual environments

| Scene ID | Visual proposal | Action |
| --- | --- | --- |
| arrival | Two worlds connected by golden light | Enter Genesis |
| genesis | Diana introduces the orbital city | Read the Genesis story / begin the guided journey |
| universe | Five territories around the Genesis Core | Enter an organizational environment |
| knowledge | Connected visual knowledge galaxy | Explore curated sources and connections |
| governance | Council Chamber | Council mandates, principles and public decision documentation |
| executive | Executive Observatory | Leadership, missions and coordination |
| shared-services | Operations Campus | Shared-service mandates and relationships |
| business-units | Business District | Proposed units, outcomes and economic classifications |
| labs | Innovation Station | Proposed labs, capabilities and experimental mandates |

## Visual integrity

The nine original, user-directed mockups from this conversation are incorporated as **unaltered scene artwork**, with the approved Diana reference used by the Genesis composition. They are not substituted with generic stock imagery or approximate procedural rooms.

`scripts/prepare-scene-assets.mjs` converts the original PNG references to lossless WebP, decodes both versions and compares every RGB pixel. All nine conversions passed exact pixel equality. `design/scene-assets.json` records source/asset hashes, dimensions, provenance, byte sizes and the comparison result. Source PNGs remain local ignored working inputs under `design/reference/`; the lossless runtime assets are tracked under `public/scenes/`.

Desktop preserves the complete 1672 × 941 artboard, including its aspect ratio, without cropping, stretching or repainting the artwork. HTML buttons share the same percentage-based coordinate system as the artwork. Hover/focus feedback, panels, zoom and scene transitions are enhancements. At rest, the original composition is preserved. Raster typography remains part of the artwork in this fidelity-first layer; semantic HTML supplies headings, labels, controls and the actual model content.

The environments are **illustrated interactive scenes**, not fully reconstructed volumetric rooms. The existing `/architecture` route is genuine, orbitable WebGL 3D. Turning each architectural proposal into a freely traversable room requires modeled geometry, camera calibration and separate environment assets; it is not achieved by displaying these pictures. This distinction remains a material limitation of this implementation.

Mobile uses the same artwork as a cropped visual preview with separately laid out, readable HTML controls. Complete desktop composition and mobile reflow cannot be pixel-identical simultaneously; preservation of the full artboard applies to desktop.

## Interaction and accessibility

- Main navigation, all nine environments, canonical layer selection and contextual hotspots are keyboard/touch accessible.
- Native modal dialogs provide focus containment, Escape dismissal and return focus.
- Search spans environments, canonical units and source capabilities.
- Diana's guided journey is explicit, step-based and skippable; no autoplay sound or fabricated video is supplied.
- Reduced motion follows the system preference, with an explicit control.
- Default artwork navigation requires no WebGL. Blocked GPU access does not block content.
- Broken-image fallback exposes the semantic interface; it does not remove access to the model.
- Knowledge links point to existing public repository documents. No fictional operating agents, operational decisions or financial actuals are invented.
- No analytics, external image host, database, authentication or operational connector is added.

## Verification

Run:

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm start
# In another terminal:
npm run test:browser
npm run test:cinematic
```

`test:browser` continues to exercise the original five experiences at `/architecture`. `test:cinematic` covers nine compositions, desktop screenshot-to-artwork comparison, navigation, the guided journey, dossiers, search, focus restoration, history, mobile/tablet, reduced motion, blocked WebGL and missing-image fallback. Captures are written to `docs/screenshots/cinematic/`; the rendered pixel comparison is saved in `fidelity.json` after a successful run.

Local runtime assets total about 16.8 MB across nine lossless images. Only the current scene is requested, so this is not an initial-page transfer. Each full scene is around 1.7–2.1 MB. Retaining exact pixels is an explicit fidelity/transfer-size tradeoff. Device performance, cross-browser checks and assistive-technology review remain separate release checks.

## Results recorded on 9 November 2026

- TypeScript and ESLint passed. All nine Node tests passed.
- The optimized Next.js production build passed, prerendering `/` and `/architecture`.
- The cinematic Chrome suite passed all nine scenes, navigation, guided tour, dossiers, search, modal focus return, history, mobile touch, tablet, reduced motion, blocked WebGL and missing-image fallback.
- The existing Chrome regression suite passed all five model/simulation experiences, context loss, mobile touch and reduced motion against the final production build.
- At a 1672 × 995 viewport with device scale factor 1, all nine 1672 × 941 artboard captures matched their source artwork with **zero changed RGB channels**. This checks the resting desktop composition; interaction feedback, overlays, zoom and mobile reflow intentionally alter the presentation.
- The initial HTML references eight scripts totaling 260,871 bytes when individually gzip-compressed. This is a build-size measurement, not a device/network benchmark. It is slightly above the aspirational 250 KB initial JavaScript target, so performance acceptance remains open.
- The built-in preview handoff failed. Verification used an isolated local production HTTP server and real headless Chrome; captured files are included with this change.

No production deployment, domain change, operational integration or merge is part of this branch.
