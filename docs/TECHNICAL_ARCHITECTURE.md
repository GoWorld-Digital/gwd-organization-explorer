# Technical Architecture

## Decision
Build an independent Next.js application with versioned static data. The public Explorer is a presentation/simulation product, not an operational control plane.

## Recommended stack — verify stable compatible versions at implementation
- Next.js 16.x App Router; React 19.x; TypeScript.
- Tailwind CSS with GWD design tokens.
- Three.js + React Three Fiber 9 + Drei for spatial scene.
- GSAP for cinematic timeline/camera sequences.
- Motion for React for DOM transitions and micro-interactions.
- @xyflow/react for precise 2D graphs where useful.
- Zod for data validation.
- Vitest for model/formula tests; Playwright for browser verification.
- Vercel for preview and public deployment.

A version check on 8 Nov 2026 found stable lines including Next.js 16.4.5, React 19.3.0, R3F 9.8.2, Drei 10.7.9, Three.js 0.187.0 and @xyflow/react 12.12.1. Treat this as a planning snapshot only: re-check peer dependencies, pin compatible stable releases and commit a lockfile. Avoid alpha/canary packages for V1.

## Application boundaries
- Server components: shell, metadata, static content and non-interactive content.
- Client components: Canvas, 3D interactions, animations, graph and simulation controls.
- Dynamic imports: scene and heavy graph.
- Static curated data under content/.
- Pure domain functions for traversal, capability mapping and illustrative formulas.
- No API or database in V1.

## Suggested source layout
app/ (routes); components/{shell,organization,capabilities,mission,scene,ui}; content/{organization,agency-agents,missions,finance}; lib/{schemas,organization,capabilities,simulation,motion}; design/{mockups,tokens}; public/{fonts,icons}; tests/{unit,e2e}.

## Rendering model
Main content and controls are DOM-first. Lazy-load the client-only 3D canvas. The same organization model drives 3D, 2D hierarchy and details. The 2D representation is semantic, not merely a screenshot. If WebGL cannot initialize, show useful SVG/DOM fallback.

## Data flow
Agency Agents upstream source → reviewed snapshot + provenance → content/agency-agents/divisions.json → 18 3D anchors and 2D capability explorer.
Organization proposal JSON → 3D layers, 2D hierarchy, business architecture and mission mapping.

## Future Ops Core boundary
Any future connection must be read-only, explicitly authorized and protected server-side. Require API contract/version, field allow-list, redaction, isolation, provenance/freshness, fallback to static data and no write endpoints.

## Deployment
Dedicated Vercel project linked to this repo. Preview builds per PR. Proposed public domain: explore.goworld.digital, only after acceptance and owner approval. No Supabase secrets or production environment variables in V1. Do not set DNS or production domain automatically.
