# Organization Explorer · first functional slice

The root route opens a read-only model of the proposed GWD organization. Desktop opens the spatial view. Screens narrower than 900 CSS pixels start with the interactive outline. Both views expose the same layer, purpose, units, inherited proposal status and candidate economic classifications. The catalogue is a separate view of the attributed division totals.

## Run and verify

Use Node.js 24 with npm. Install from the committed lockfile with `npm ci`. Start development with `npm run dev`, or run `npm run build` followed by `npm start` to serve the optimized version. Open http://localhost:3000.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm start
# In a second terminal
npm run test:browser
```

The browser test accepts `EXPLORER_URL` and `CHROME_PATH`. When TCP loopback is blocked, `EXPLORER_BUILD_FILES=1` supplies the production HTML and chunks to Chromium through Playwright request interception. This mode exercises hydration, rendering and interaction separately from HTTP transport. The PR workflow uses the production HTTP server.

## Architecture

- Next.js 16.4.3 App Router prerenders the shell, visible controls and semantic outline. React and React DOM are pinned to 19.3.0. TypeScript 5.9.3 checks the route and components.
- `lib/model.ts` exposes the two original JSON snapshots. A unit inherits its layer's status when it has no more specific status.
- `components/Explorer.tsx` owns selection, section, view mode and motion preference. Switching representations preserves the selected layer. Escape clears it and restores focus to its navigation button.
- `components/Scene.tsx` loads on demand. React Three Fiber 9.8.2, Three.js 0.187.0 and Drei 10.7.9 render five procedural decks and one instanced ring of 18 catalogue anchors. Repeated columns and pavilions are instanced. Individual profile geometry is unnecessary.
- OrbitControls handles orbit, pan and zoom. GSAP interpolates the camera and target, invalidating frames only during transitions. User navigation interrupts a flight. Reduced motion applies the final camera position immediately. Motion handles the detail panel.
- Labels project world coordinates into a DOM overlay on requested frames. Readable controls and panel content remain outside the canvas. Losing the WebGL context returns to the outline with the current selection.
- All assets and data are local. The upstream catalogue link is an explicit visitor action.

## Source and status

The blueprint inventory records 18 distinct divisions and 283 source profiles. Their counts reconcile. It supplies aggregate counts and a snapshot date of 2026-11-08. Its recorded revision `b859515c813efcfc4755d3471dd9e7686c7706d` has 39 characters, and the upstream commits endpoint did not resolve its seven-character prefix. The original JSON and attribution are preserved. The catalogue links to the upstream repository and labels the revision unconfirmed.

The recorded organization model contains proposed governance, services, units and labs. AI Operations / Ops Core has the separate status “design principle.” Profit and investment centre labels describe candidate classifications. This slice has no verified operational roster, live financial figures or simulation results.

## Verification evidence

The local production build prerendered the root route. TypeScript, ESLint and both model tests passed. The lockfile resolved the top-level React, R3F, Three.js and Drei peer relationships. A dry run of npm ci completed. The scripts referenced by the initial production HTML totalled 217,152 bytes compressed with gzip, before the dynamically requested scene. This is a build measurement, not a device timing benchmark.

Headless Chrome used software WebGL2 to render the actual production bundle. The browser test passed mesh picking, layer switching, keyboard input and reset, catalogue counts, the 2D outline, real context loss, blocked WebGL initialization, and touch selection with reduced motion. The mobile test checked horizontal overflow. The production server started locally. Browser verification used the build-file transport because this host blocks TCP loopback.

| Capture | Scenario |
| --- | --- |
| [Desktop](screenshots/desktop.png) | 1440 × 900, spatial overview |
| [Layer selection](screenshots/selected.png) | Focused research layer and unit details |
| [Fallback](screenshots/fallback.png) | Context loss with selection preserved |
| [Tablet](screenshots/tablet.png) | 768 × 1024 viewport, full-page outline |
| [Mobile](screenshots/mobile.png) | 390 × 844 viewport, touch and reduced motion, full-page capture |

## Remaining work

Physical-device GPU performance, assistive-technology testing and cross-browser QA remain open. The opening uses a short, interruptible camera move. The full storyboard, mission simulator, financial simulator, venture pipeline and reviewed profile drill-down belong to later slices. Individual capability anchors communicate the size of the catalogue. Division names and counts are available in the catalogue tab. The recorded upstream revision still needs reconciliation.
