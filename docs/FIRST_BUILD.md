# Organization Explorer · First Functional Slice & Phase 1 (G1) Foundation

The root route opens a read-only model of the proposed GWD organization. Desktop opens the spatial view. Screens narrower than 900 CSS pixels start with the interactive outline. Both views expose the same layer, purpose, units, mandates, inherited proposal status, maturity stages and candidate economic classifications. The catalogue view exposes the 18 attributed Agency Agents divisions and verified upstream snapshot metadata.

## Run and Verify

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

The browser test accepts `EXPLORER_URL` and `CHROME_PATH`. When TCP loopback is blocked, `EXPLORER_BUILD_FILES=1` supplies the production HTML and chunks to Chromium through Playwright request interception.

## Architecture & Phase 1 (G1) Data Foundation

- **Framework:** Next.js 16.4.3 App Router, React 19.3.0, TypeScript 5.9.3, Three.js 0.187.0, React Three Fiber 9.8.2, Drei 10.7.9, GSAP 3.15.0, Motion 12.42.2 and Zod 4.6.7.
- **Canonical Schemas (`lib/schemas.ts`):** Validates `content/organization/organization-model.json` (5 layers, 21 units with mandates, economic roles, Lab/Venture maturity stages, 34 typed `reports_to` / `advises` / `provides_service_to` relationships, 22 `capability_supports` mappings), `content/agency-agents/divisions.json` (18 divisions, 283 source profiles), `content/missions/missions-model.json` (3 illustrative missions with mandatory human approval gates), `content/finance/scenarios-model.json` (4 deterministic financial presets) and `design/tokens.json`.
- **Deterministic Financial Engine (`lib/finance.ts`):** Pure functions `calculateScenarioEconomics`, `clampScenarioInputs` and `validateScenarioInputs` with explicit illustrative disclaimers and boundary checks.
- **Domain Exports (`lib/model.ts`):** Validates all canonical JSON files at load time and exports typed layers, relationships, capability mappings, missions, financial presets and lookup helpers.
- **UI & Scene (`components/Explorer.tsx`, `components/Scene.tsx`, `app/globals.css`):** Formalized `--gwd-*` CSS custom properties in `:root`, unit mandates and maturity stages in the layer dossier panel, and verified upstream commit/tree/license display in the Source catalogue tab.

## Provenance Reconciliation

Phase 1 resolved the earlier 39-character commit typo (`b859515c813efcfc4755d3471dd9e7686c7706d`) against the upstream `msitarzewski/agency-agents` repository and the initial `blueprint/gwd-explorer-v1` seed:
- **Verified Commit SHA:** `b859c515d813efcfc4755d3471dd9e7686c7706d` (`2026-11-06T01:58:56Z`)
- **Verified Git Tree SHA:** `94d97cfd0c3731995a3b22ae96e2a88a004482a5`
- **Verified Licence:** `MIT` (`LICENSE` blob SHA `523078c01624b9b1b1c551e75054b9d3a9f953ab`)
- **Verified Inventory:** 18 divisions totalling 283 Markdown profile templates (excluding `.github`, `examples`, `integrations`, `scripts`, `strategy`).

## Visual Captures

| Capture | Scenario |
| --- | --- |
| [Desktop](screenshots/desktop.png) | 1440 × 900, spatial overview |
| [Layer selection](screenshots/selected.png) | Focused research layer, unit mandates and maturity stages |
| [Fallback](screenshots/fallback.png) | Context loss with selection preserved |
| [Tablet](screenshots/tablet.png) | 768 × 1024 viewport, full-page outline |
| [Mobile](screenshots/mobile.png) | 390 × 844 viewport, touch and reduced motion, full-page capture |
